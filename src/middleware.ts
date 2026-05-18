import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/superadmin']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin routes (admin or superadmin only)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
        return NextResponse.redirect(new URL('/403', req.url))
      }
    }
  }

  // Superadmin routes (superadmin only)
  if (req.nextUrl.pathname.startsWith('/superadmin')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/403', req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/superadmin/:path*'],
}
