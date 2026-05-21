import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, phone, address } = await req.json()

    console.log('[REGISTER] Request received:', { email, full_name })

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // Validate environment variables
    const requiredVars = ['RESEND_API_KEY', 'NEXT_PUBLIC_SITE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    const missing = requiredVars.filter(v => !process.env[v])
    if (missing.length > 0) {
      console.error('[REGISTER] Missing env vars:', missing)
      return NextResponse.json({ error: `Server misconfiguration: missing ${missing.join(', ')}` }, { status: 500 })
    }

    console.log('[REGISTER] Env vars validated')

    const db = supabaseAdmin()

    // Create user via admin SDK with email_confirm: TRUE
    // This prevents Supabase from sending any confirmation email (avoids SMTP errors)
    // Login is blocked via our own email_verified=false field instead
    const { data: authData, error: createError } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone, address },
    })

    console.log('[REGISTER] Supabase create user result:', { success: !createError, error: createError?.message })

    let userId: string

    if (createError) {
      const msg = createError.message?.toLowerCase() ?? ''

      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('duplicate')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }

      if (msg.includes('error sending confirmation email') || msg.includes('sending confirmation')) {
        // Supabase tried its own SMTP and failed — but the user WAS created.
        // Recover by looking up the created user and continuing with our Resend flow.
        console.warn('[REGISTER] Supabase SMTP failed — recovering created user by email...')
        const { data: listData } = await db.auth.admin.listUsers()
        const found = listData?.users?.find((u: any) => u.email === email)
        if (!found) {
          console.error('[REGISTER] User not found after SMTP error')
          return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
        }
        userId = found.id
        console.log('[REGISTER] Recovered user ID:', userId)
      } else {
        console.error('[REGISTER] Supabase create error:', createError)
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }
    } else {
      userId = authData.user.id
    }

    console.log('[REGISTER] User ready, ID:', userId)

    // Wait briefly for the handle_new_user trigger to create public.users
    await new Promise(r => setTimeout(r, 600))

    // Explicitly mark email_verified = false so login is blocked until they verify
    const { error: verifiedUpdateError } = await db.from('users').update({ email_verified: false }).eq('id', userId)
    if (verifiedUpdateError) {
      console.error('[REGISTER] Failed to set email_verified=false:', verifiedUpdateError)
    } else {
      console.log('[REGISTER] email_verified set to false for user:', userId)
    }

    // Rate limit: max 3 tokens per user per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await db
      .from('email_verifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo)

    console.log('[REGISTER] Rate limit check:', { userId, count })

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Too many verification attempts.' }, { status: 429 })
    }

    // Generate token with 1-hour expiry
    const token = crypto.randomUUID() + '-' + crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    console.log('[REGISTER] Token generated, inserting to DB...')

    const { error: insertError } = await db.from('email_verifications').insert({ user_id: userId, token, expires_at: expiresAt })

    if (insertError) {
      console.error('[REGISTER] Token insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create verification token' }, { status: 500 })
    }

    console.log('[REGISTER] Token inserted successfully')

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`
    console.log('[REGISTER] Sending email via Resend to:', email)

    // Send via Resend — SDK returns { data, error } and does NOT throw
    const sendResult = await resend.emails.send({
      from: 'InstaPulse <admin@instapulse.site>',
      to: email,
      subject: 'Verify your InstaPulse account',
      html: buildEmailHtml(verifyUrl, full_name),
    })
    console.log('[REGISTER] Resend result:', sendResult)

    if (sendResult.error) {
      console.warn('[REGISTER] Custom domain failed, trying fallback:', sendResult.error)
      // Fallback to Resend's onboarding domain
      const fallbackResult = await resend.emails.send({
        from: 'InstaPulse <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your InstaPulse account',
        html: buildEmailHtml(verifyUrl, full_name),
      })
      console.log('[REGISTER] Resend fallback result:', fallbackResult)
      if (fallbackResult.error) {
        console.error('[REGISTER] Both Resend sends failed:', fallbackResult.error)
        return NextResponse.json({ error: 'Failed to send verification email. Please try again.' }, { status: 500 })
      }
    }

    console.log('[REGISTER] Email sent successfully')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('register error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildEmailHtml(verifyUrl: string, name?: string): string {
  const greeting = name ? `Hi ${name},` : 'Welcome to InstaPulse!'
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Verify your InstaPulse account</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background-color:#dc2626;padding:32px 40px;text-align:center;">
            <span style="font-size:28px;font-weight:800;color:#ffffff;">InstaPulse</span>
            <p style="color:#fca5a5;margin:6px 0 0;font-size:13px;">Security Solutions</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;">Verify your email address</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">${greeting} Please verify your email address to activate your InstaPulse account.</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background-color:#dc2626;border-radius:8px;">
                  <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Verify My Account</a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;">Or copy and paste this link:</p>
            <p style="margin:0 0 28px;font-size:12px;color:#6b7280;word-break:break-all;background-color:#f9fafb;padding:12px;border-radius:6px;border:1px solid #e5e7eb;">${verifyUrl}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">⏰ This link expires in <strong>1 hour</strong>.</p>
            <p style="margin:0;font-size:13px;color:#9ca3af;">If you did not create an account, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Need help? <a href="mailto:admin@instapulse.site" style="color:#dc2626;text-decoration:none;">admin@instapulse.site</a></p>
            <p style="margin:6px 0 0;font-size:11px;color:#d1d5db;">© ${new Date().getFullYear()} InstaPulse. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
