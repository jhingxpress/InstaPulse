import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// ─── Minimal HS256 JWT signer (Node.js built-in crypto, no extra deps) ────────
// Used when RAN_JWT_SECRET is set but no pre-signed RAN_ADMIN_TOKEN is configured.
function signRanJwt(secret: string): string {
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    iat:  Math.floor(Date.now() / 1000),
    exp:  Math.floor(Date.now() / 1000) + 60,
  })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${sig}`
}

// ─── Verify caller is an InstaPulse admin using service role ─────────────────
async function verifyAdmin(token: string): Promise<boolean> {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data: { user }, error } = await sb.auth.getUser(token)
  if (error || !user) return false
  const { data: profile } = await sb.from('users').select('role').eq('id', user.id).single()
  return !!profile && ['admin', 'superadmin'].includes(profile.role)
}

// ─── Safe field extractor ─────────────────────────────────────────────────────
// NEVER exposes: cctv, sim900a, orange_pi, tailscale, camera_ip,
//                username, password, notes, sim_number, private_ip
function toSafeClient(c: Record<string, unknown>) {
  return {
    ran_client_id:  String(c.id ?? c.ran_client_id ?? c.client_id ?? ''),
    business_name:  String(c.business_name  ?? c.businessName  ?? c.name    ?? c.company ?? ''),
    address:        String(c.address        ?? c.location      ?? ''),
    contact_person: String(c.contact_person ?? c.contactPerson ?? c.contact_name ?? c.contactName ?? ''),
    contact_phone:  String(c.contact_phone  ?? c.contactPhone  ?? c.phone   ?? c.contact_number ?? ''),
  }
}

// ─── GET /api/ran-clients?q=<search> ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  // 1. Require admin auth
  const authHeader = req.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const isAdmin = await verifyAdmin(authHeader.slice(7))
  if (!isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  // 2. Resolve RAN server config
  const ranUrl    = process.env.RAN_SERVER_URL?.replace(/\/$/, '')
  const ranToken  = process.env.RAN_ADMIN_TOKEN
  const ranSecret = process.env.RAN_JWT_SECRET

  if (!ranUrl) {
    return NextResponse.json(
      { error: 'RAN_SERVER_URL is not configured. Add it to .env.local.' },
      { status: 503 },
    )
  }
  if (!ranToken && !ranSecret) {
    return NextResponse.json(
      { error: 'Set RAN_ADMIN_TOKEN or RAN_JWT_SECRET in .env.local to enable client search.' },
      { status: 503 },
    )
  }

  const bearerToken = ranToken ?? signRanJwt(ranSecret!)
  const q           = req.nextUrl.searchParams.get('q') ?? ''

  // 3. Call RAN server
  let clients: Record<string, unknown>[] = []

  try {
    const endpoint = new URL(`${ranUrl}/api/clients`)
    if (q) endpoint.searchParams.set('search', q)
    endpoint.searchParams.set('limit', '30')

    const ranRes = await fetch(endpoint.toString(), {
      headers: { Authorization: `Bearer ${bearerToken}` },
      signal:  AbortSignal.timeout(8_000),
    })

    if (!ranRes.ok) {
      const errText = await ranRes.text().catch(() => '')
      console.error('[ran-clients] RAN server error:', ranRes.status, errText)
      return NextResponse.json(
        { error: `RAN server returned HTTP ${ranRes.status}. Check RAN_SERVER_URL and token config.` },
        { status: 502 },
      )
    }

    const body = await ranRes.json()
    // Handle various response shapes from the RAN Express server
    clients = Array.isArray(body)           ? body           :
              Array.isArray(body?.clients)  ? body.clients   :
              Array.isArray(body?.data)     ? body.data      :
              Array.isArray(body?.rows)     ? body.rows      :
              Array.isArray(body?.results)  ? body.results   : []

  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'RAN server did not respond within 8 seconds.' }, { status: 504 })
    }
    console.error('[ran-clients] Fetch error:', err.message)
    return NextResponse.json({ error: 'Cannot reach RAN server. Is it running?' }, { status: 502 })
  }

  // 4. Strip ALL sensitive fields — return only the 5 safe fields
  const safeClients = clients
    .map(toSafeClient)
    .filter(c => c.ran_client_id !== '')

  return NextResponse.json({ clients: safeClients })
}
