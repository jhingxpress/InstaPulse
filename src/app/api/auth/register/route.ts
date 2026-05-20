import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, phone, address } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Create user via admin SDK — bypasses Supabase's own email system
    // email_confirm: false so user cannot sign in until our link is clicked
    const { data: authData, error: createError } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name, phone, address },
    })

    if (createError) {
      if (createError.message?.toLowerCase().includes('already registered') ||
          createError.message?.toLowerCase().includes('already been registered') ||
          createError.message?.toLowerCase().includes('duplicate')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // Wait briefly for the handle_new_user trigger to create public.users
    await new Promise(r => setTimeout(r, 500))

    // Rate limit: max 3 tokens per user per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await db
      .from('email_verifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo)

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Too many verification attempts.' }, { status: 429 })
    }

    // Generate token with 1-hour expiry
    const token = crypto.randomUUID() + '-' + crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    await db.from('email_verifications').insert({ user_id: userId, token, expires_at: expiresAt })

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`

    await resend.emails.send({
      from: 'InstaPulse <admin@instapulse.site>',
      to: email,
      subject: 'Verify your InstaPulse account',
      html: buildEmailHtml(verifyUrl, full_name),
    })

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
