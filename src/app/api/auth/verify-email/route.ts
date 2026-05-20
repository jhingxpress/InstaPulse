import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Look up the token
    const { data: record, error: fetchError } = await db
      .from('email_verifications')
      .select('id, user_id, expires_at, used')
      .eq('token', token)
      .single()

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 })
    }

    if (record.used) {
      return NextResponse.json({ error: 'This verification link has already been used.' }, { status: 400 })
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This verification link has expired. Please request a new one.' }, { status: 400 })
    }

    // Mark token as used
    await db
      .from('email_verifications')
      .update({ used: true })
      .eq('id', record.id)

    // Mark user as verified in public.users
    await db.from('users').update({ email_verified: true }).eq('id', record.user_id)

    // Confirm user in Supabase auth so signInWithPassword works
    await db.auth.admin.updateUserById(record.user_id, { email_confirm: true })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('verify-email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
