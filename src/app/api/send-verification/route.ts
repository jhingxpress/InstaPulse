import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[SEND-VERIFICATION] Request received:', { email: body.email, userId: body.userId })

    if (!body.email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    // Validate environment variables
    const requiredVars = ['RESEND_API_KEY', 'NEXT_PUBLIC_SITE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    const missing = requiredVars.filter(v => !process.env[v])
    if (missing.length > 0) {
      console.error('[SEND-VERIFICATION] Missing env vars:', missing)
      return NextResponse.json({ error: `Server misconfiguration: missing ${missing.join(', ')}` }, { status: 500 })
    }

    console.log('[SEND-VERIFICATION] Env vars validated')

    const resend = new Resend(process.env.RESEND_API_KEY)
    const db = supabaseAdmin()
    const email: string = body.email

    // Resolve userId — accept directly or look up by email
    let userId: string = body.userId
    if (!userId) {
      const { data: { users }, error: lookupError } = await db.auth.admin.listUsers()
      if (lookupError) {
        console.error('[SEND-VERIFICATION] User lookup error:', lookupError)
        return NextResponse.json({ error: 'Failed to look up account.' }, { status: 500 })
      }
      const found = users.find(u => u.email === email)
      if (!found) {
        return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 })
      }
      userId = found.id
    }

    // Rate limit: max 3 verification emails per user per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await db
      .from('email_verifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo)

    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Too many verification emails sent. Please wait before requesting another.' },
        { status: 429 }
      )
    }

    // Generate secure token and set 1-hour expiry
    const token = crypto.randomUUID() + '-' + crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    console.log('[SEND-VERIFICATION] Token generated, inserting to DB...')

    const { error: insertError } = await db
      .from('email_verifications')
      .insert({ user_id: userId, token, expires_at: expiresAt })

    if (insertError) {
      console.error('[SEND-VERIFICATION] Token insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create verification token' }, { status: 500 })
    }

    console.log('[SEND-VERIFICATION] Token inserted successfully')

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`
    console.log('[SEND-VERIFICATION] Sending email via Resend to:', email)

    // Try custom domain first, fallback to Resend's default if not verified
    const fromEmail = 'InstaPulse <support@instapulse.site>'
    let emailError = null
    let result = null

    try {
      result = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Verify your InstaPulse account',
        html: buildEmailHtml(verifyUrl),
      })
      console.log('[SEND-VERIFICATION] Resend result (custom domain):', result)
    } catch (err: any) {
      console.error('[SEND-VERIFICATION] Resend error (custom domain):', err)
      emailError = err

      // Fallback to Resend's default domain
      console.log('[SEND-VERIFICATION] Trying fallback to onboarding@resend.dev...')
      try {
        result = await resend.emails.send({
          from: 'InstaPulse <onboarding@resend.dev>',
          to: email,
          subject: 'Verify your InstaPulse account',
          html: buildEmailHtml(verifyUrl),
        })
        console.log('[SEND-VERIFICATION] Resend result (fallback):', result)
        emailError = null
      } catch (fallbackErr: any) {
        console.error('[SEND-VERIFICATION] Resend error (fallback):', fallbackErr)
        emailError = fallbackErr
      }
    }

    if (emailError) {
      console.error('[SEND-VERIFICATION] Final Resend error:', emailError)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    console.log('[SEND-VERIFICATION] Email sent successfully')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-verification error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildEmailHtml(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your InstaPulse account</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#dc2626;padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">InstaPulse</span>
              </div>
              <p style="color:#fca5a5;margin:6px 0 0;font-size:13px;">Security Solutions</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;">Verify your email address</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Welcome to InstaPulse! Please verify your email address to activate your account and access your dashboard.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background-color:#dc2626;border-radius:8px;">
                    <a href="${verifyUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Verify My Account
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;line-height:1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px;font-size:12px;color:#6b7280;word-break:break-all;background-color:#f9fafb;padding:12px;border-radius:6px;border:1px solid #e5e7eb;">
                ${verifyUrl}
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
              <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
                ⏰ This link expires in <strong>1 hour</strong>.
              </p>
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                If you did not create an InstaPulse account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Need help? Contact us at
                <a href="mailto:support@instapulse.site" style="color:#dc2626;text-decoration:none;">support@instapulse.site</a>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#d1d5db;">
                © ${new Date().getFullYear()} InstaPulse. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
