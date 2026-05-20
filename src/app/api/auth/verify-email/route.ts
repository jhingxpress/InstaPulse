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
      .from('email_verification_tokens')
      .select('id, user_id, expires_at, used_at')
      .eq('token', token)
      .single()

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 })
    }

    if (record.used_at) {
      return NextResponse.json({ error: 'This verification link has already been used.' }, { status: 400 })
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This verification link has expired. Please request a new one.' }, { status: 400 })
    }

    // Mark token as used
    await db
      .from('email_verification_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', record.id)

    // Mark user as verified
    const { error: updateError } = await db
      .from('users')
      .update({ email_verified: true })
      .eq('id', record.user_id)

    if (updateError) {
      console.error('Failed to mark user verified:', updateError)
      return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('verify-email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
