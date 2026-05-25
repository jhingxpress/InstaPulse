'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

/**
 * React hook for Google reCAPTCHA v3.
 * Usage:
 *   const { getToken } = useRecaptcha()
 *   const token = await getToken('login')
 *   // send token to /api/verify-recaptcha or include in form POST body
 */
export function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      if (!siteKey) {
        console.warn('[reCAPTCHA] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set — skipping.')
        return null
      }

      if (typeof window === 'undefined' || !window.grecaptcha) {
        console.warn('[reCAPTCHA] grecaptcha not loaded yet.')
        return null
      }

      try {
        return await new Promise<string>((resolve, reject) => {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(siteKey, { action })
              resolve(token)
            } catch (err) {
              reject(err)
            }
          })
        })
      } catch (err) {
        console.error('[reCAPTCHA] Failed to execute:', err)
        return null
      }
    },
    [siteKey]
  )

  return { getToken }
}
