import { NextRequest, NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/verifyRecaptcha'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid reCAPTCHA token.' },
        { status: 400 }
      )
    }

    const result = await verifyRecaptcha(token)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, score: result.score },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, score: result.score })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
