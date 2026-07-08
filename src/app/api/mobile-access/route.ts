import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const VALID_STATUSES = ['pending', 'linked', 'approved', 'rejected'] as const
type MobileStatus = (typeof VALID_STATUSES)[number]

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function verifyAdmin(token: string): Promise<string | null> {
  const sb = serviceClient()
  const { data: { user }, error } = await sb.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await sb.from('users').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'superadmin'].includes(profile.role)) return null
  return user.id
}

// ─── GET /api/mobile-access ───────────────────────────────────────────────────
// Returns users with mobile_app_status so the admin panel can bypass RLS.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminId = await verifyAdmin(authHeader.slice(7))
  if (!adminId) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const sb = serviceClient()
  const { data, error } = await sb
    .from('users')
    .select('id, full_name, email, phone, address, mobile_app_status, ran_client_id, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[mobile-access GET]', error.message)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  return NextResponse.json({ users: data || [] })
}

// ─── PATCH /api/mobile-access ─────────────────────────────────────────────────
// Body: { userId, mobile_app_status, ran_client_id? }
// Rules:
//   • Approving requires ran_client_id (enforced here and in UI)
//   • Rejecting clears ran_client_id if present
//   • Resetting to pending clears ran_client_id
//   • Uses service role — bypasses RLS so new columns are always writable
export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminId = await verifyAdmin(authHeader.slice(7))
  if (!adminId) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  let body: { userId?: string; mobile_app_status?: string; ran_client_id?: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { userId, mobile_app_status, ran_client_id } = body

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }
  if (!mobile_app_status || !VALID_STATUSES.includes(mobile_app_status as MobileStatus)) {
    return NextResponse.json(
      { error: `mobile_app_status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    )
  }
  if ((mobile_app_status === 'approved' || mobile_app_status === 'linked') && !ran_client_id) {
    return NextResponse.json(
      { error: 'A Project RAN client must be selected before approving or linking mobile access.' },
      { status: 400 },
    )
  }

  const updates: Record<string, unknown> = { mobile_app_status }

  if (mobile_app_status === 'approved' || mobile_app_status === 'linked') {
    updates.ran_client_id = ran_client_id
  } else if (mobile_app_status === 'pending') {
    updates.ran_client_id = null
  }
  // 'rejected' keeps existing ran_client_id intact (admin may reuse it when re-approving)

  const sb = serviceClient()
  const { data, error } = await sb
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, full_name, email, mobile_app_status, ran_client_id')
    .single()

  if (error) {
    console.error('[mobile-access PATCH]', error.message)
    return NextResponse.json({ error: 'Failed to update user. Run the Supabase migration if you have not already.' }, { status: 500 })
  }

  return NextResponse.json(data)
}
