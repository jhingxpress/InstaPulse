export interface RecaptchaResult {
  success: boolean
  score: number
  error?: string
}

/**
 * Verifies a reCAPTCHA v3 token server-side.
 * Call this from any API route that needs bot protection.
 * Safe to skip if RECAPTCHA_SECRET_KEY is not set (dev mode).
 */
export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — skipping verification (dev mode).')
    return { success: true, score: 1 }
  }

  if (!token) {
    return { success: false, score: 0, error: 'Missing reCAPTCHA token.' }
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    })

    const data = await res.json()

    if (!data.success) {
      console.warn('[reCAPTCHA] Google rejected token:', data['error-codes'])
      return { success: false, score: 0, error: 'reCAPTCHA verification failed.' }
    }

    const score: number = data.score ?? 0

    if (score < 0.5) {
      console.warn(`[reCAPTCHA] Low score: ${score}`)
      return {
        success: false,
        score,
        error: 'Suspicious activity detected. Please try again.',
      }
    }

    return { success: true, score }
  } catch (err) {
    console.error('[reCAPTCHA] Network error during verification:', err)
    return { success: false, score: 0, error: 'Failed to verify reCAPTCHA. Please try again.' }
  }
}
