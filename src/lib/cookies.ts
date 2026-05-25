import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'instapulse_session'

const BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

/**
 * Sets a secure httpOnly session cookie on a NextResponse.
 * Use in API route handlers: setSessionCookie(response, token)
 */
export function setSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    ...BASE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return response
}

/**
 * Reads the session cookie value from incoming request cookies.
 * Use in Server Components or API routes.
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

/**
 * Clears the session cookie on a NextResponse.
 * Use on logout API routes.
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    ...BASE_OPTIONS,
    maxAge: 0,
  })
  return response
}
