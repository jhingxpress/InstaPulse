import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { data: { user }, error: authError } = await sb.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error: fetchError } = await sb
    .from('users')
    .select('mobile_app_status')
    .eq('id', user.id)
    .single()

  if (fetchError || !profile) {
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
  }

  const current = profile.mobile_app_status
  if (current && current !== 'rejected' && current !== 'disabled') {
    return NextResponse.json(
      { error: 'Application already submitted', status: current },
      { status: 409 }
    )
  }

  const { error: updateError } = await sb
    .from('users')
    .update({ mobile_app_status: 'pending' })
    .eq('id', user.id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }

  return NextResponse.json({ success: true, status: 'pending' })
}
