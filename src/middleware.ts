import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/superadmin']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Dashboard routes: block deleted or unverified users
  if (req.nextUrl.pathname.startsWith('/dashboard') && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('id, role, email_verified')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (profile.email_verified === false && profile.role !== 'admin' && profile.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/verify-pending', req.url))
    }
  }

  // Admin routes (admin or superadmin only)
  if (req.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  // Superadmin routes (superadmin only)
  if (req.nextUrl.pathname.startsWith('/superadmin') && user) {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Only block if we got a confirmed non-superadmin role.
    // If query errored (network/RLS issue), let the page handle it.
    if (!profileError && profile && profile.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/superadmin/:path*'],
}
