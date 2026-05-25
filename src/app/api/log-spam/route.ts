import { NextRequest, NextResponse } from 'next/server'
import { logSpam } from '@/lib/spam-logger'

// Internal-use endpoint for server-side spam logging.
// In production, protect this with an INTERNAL_API_SECRET header check.
export async function POST(req: NextRequest) {
  try {
    const { ip, reason, endpoint, payload } = await req.json()

    if (!reason || !endpoint) {
      return NextResponse.json(
        { error: 'Missing required fields: reason, endpoint.' },
        { status: 400 }
      )
    }

    await logSpam({
      ip: ip ?? 'unknown',
      reason: String(reason),
      endpoint: String(endpoint),
      payload: payload ?? undefined,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to log entry.' }, { status: 500 })
  }
}
