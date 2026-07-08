import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-server'

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
    console.error('[mobile-access/apply] Unauthorized request:', authError?.message)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = supabaseAdmin()
  const { data: profile, error: fetchError } = await admin
    .from('users')
    .select('id, mobile_app_status')
    .eq('id', user.id)
    .maybeSingle()

  if (fetchError) {
    console.error('[mobile-access/apply] Failed to look up profile for user', user.id, ':', fetchError.message)
    return NextResponse.json({ error: 'Failed to look up user profile' }, { status: 500 })
  }

  if (!profile) {
    console.log('[mobile-access/apply] Profile missing for valid user', user.id, '- creating profile row')
    const metadata = user.user_metadata || {}
    const { error: insertError } = await admin.from('users').insert({
      id: user.id,
      email: user.email,
      full_name: metadata.full_name || null,
      phone: metadata.phone || null,
      address: metadata.address || null,
      role: 'user',
      mobile_app_status: 'pending',
    })

    if (insertError) {
      console.error('[mobile-access/apply] Failed to create profile for user', user.id, ':', insertError.message)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, status: 'pending' })
  }

  const current = profile.mobile_app_status
  if (current && current !== 'rejected' && current !== 'disabled') {
    return NextResponse.json(
      { error: 'Application already submitted', status: current },
      { status: 409 }
    )
  }

  const { error: updateError } = await admin
    .from('users')
    .update({ mobile_app_status: 'pending' })
    .eq('id', user.id)

  if (updateError) {
    console.error('[mobile-access/apply] Failed to update mobile_app_status for user', user.id, ':', updateError.message)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }

  return NextResponse.json({ success: true, status: 'pending' })
}
