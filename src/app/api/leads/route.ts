import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { verifyRecaptcha } from '@/lib/verifyRecaptcha'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, location, interest, recaptchaToken } = await req.json()

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

    // reCAPTCHA verification
    if (recaptchaToken) {
      const captcha = await verifyRecaptcha(recaptchaToken)
      if (!captcha.success) {
        return NextResponse.json({ error: captcha.error || 'Security check failed.' }, { status: 400 })
      }
    }

    const db = supabaseAdmin()
    const { error } = await db.from('chat_leads').insert({
      name: name.trim(),
      phone: phone.trim(),
      location: location?.trim() || null,
      interest: interest?.trim() || null,
    })

    if (error) {
      console.error('[LEADS] Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save lead.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[LEADS] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
