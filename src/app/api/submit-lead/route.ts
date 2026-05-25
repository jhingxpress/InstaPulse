import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { verifyRecaptcha } from '@/lib/verifyRecaptcha'
import { sanitizeFields } from '@/lib/sanitize'
import { validateName, validatePhilippinePhone, validateLocation, isSpamLike } from '@/lib/validate'
import { logSpam } from '@/lib/spam-logger'
import { supabaseAdmin } from '@/lib/supabase-server'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-client-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ENDPOINT = '/api/submit-lead'
  const ip = getClientIp(req)

  // ── LAYER 1: Rate Limiting ─────────────────────────────────────────────────
  const rl = checkRateLimit(`${ip}:${ENDPOINT}`, 5, 60_000)
  if (!rl.allowed) {
    await logSpam({ ip, reason: 'rate_limit_exceeded', endpoint: ENDPOINT })
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before trying again.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfter ?? 60) },
      }
    )
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, phone, location, interest, recaptchaToken, honeypot } = body as Record<string, string>

  // ── LAYER 2a: Honeypot Check ───────────────────────────────────────────────
  // Real users never fill the hidden "company" field — bots do.
  // Return fake success so bots don't know they were blocked.
  if (honeypot && honeypot.trim().length > 0) {
    await logSpam({
      ip,
      reason: 'honeypot_triggered',
      endpoint: ENDPOINT,
      payload: { honeypot: honeypot.substring(0, 100) },
    })
    return NextResponse.json({ success: true })
  }

  // ── LAYER 2b: reCAPTCHA Verification ──────────────────────────────────────
  if (recaptchaToken) {
    const captcha = await verifyRecaptcha(recaptchaToken)
    if (!captcha.success) {
      await logSpam({
        ip,
        reason: `recaptcha_failed_score_${captcha.score ?? 0}`,
        endpoint: ENDPOINT,
      })
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }
  }

  // ── LAYER 2c: Sanitize All Inputs ─────────────────────────────────────────
  const s = sanitizeFields({
    name: String(name ?? ''),
    phone: String(phone ?? ''),
    location: String(location ?? ''),
    interest: String(interest ?? ''),
  })

  // ── LAYER 3a: Field Validation ─────────────────────────────────────────────
  const nameCheck = validateName(s.name)
  if (!nameCheck.valid) {
    return NextResponse.json({ error: nameCheck.error }, { status: 400 })
  }

  const phoneCheck = validatePhilippinePhone(s.phone)
  if (!phoneCheck.valid) {
    await logSpam({
      ip,
      reason: 'invalid_phone_format',
      endpoint: ENDPOINT,
      payload: { phone: s.phone.substring(0, 20) },
    })
    return NextResponse.json({ error: phoneCheck.error }, { status: 400 })
  }

  const locationCheck = validateLocation(s.location)
  if (!locationCheck.valid) {
    return NextResponse.json({ error: locationCheck.error }, { status: 400 })
  }

  // ── LAYER 3b: Spam Content Detection ──────────────────────────────────────
  if (isSpamLike(s.name) || isSpamLike(s.location)) {
    await logSpam({
      ip,
      reason: 'spam_content_detected',
      endpoint: ENDPOINT,
      payload: { name: s.name.substring(0, 50) },
    })
    return NextResponse.json(
      { error: 'Submission rejected. Please enter valid information.' },
      { status: 400 }
    )
  }

  // ── LAYER 3c: Duplicate Submission Prevention ──────────────────────────────
  // Block same phone number submitting more than once within 60 seconds
  const db = supabaseAdmin()
  const cutoff = new Date(Date.now() - 60_000).toISOString()

  const { data: recent } = await (db as any)
    .from('chat_leads')
    .select('id')
    .eq('phone', s.phone)
    .gte('created_at', cutoff)
    .limit(1)

  if (recent && recent.length > 0) {
    await logSpam({
      ip,
      reason: 'duplicate_submission_60s',
      endpoint: ENDPOINT,
      payload: { phone: s.phone.substring(0, 20) },
    })
    // Return success to prevent timing attacks / phone enumeration
    return NextResponse.json({ success: true })
  }

  // ── LAYER 4: Persist Lead ──────────────────────────────────────────────────
  const { error: dbError } = await (db as any).from('chat_leads').insert({
    name: s.name,
    phone: s.phone,
    location: s.location || null,
    interest: s.interest || null,
  })

  if (dbError) {
    console.error('[submit-lead] DB insert error:', dbError)
    return NextResponse.json(
      { error: 'Failed to save your details. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
