import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are the official AI assistant for InstaPulse — a real-time emergency alert and monitoring system based in the Philippines.

Your role is to act as a 24/7 customer support and sales assistant. Be concise, professional, friendly, and sales-oriented.

== PRODUCT KNOWLEDGE ==

PACKAGES & PRICING:
- Basic Package: ₱20,000 one-time | 1 Alert System, 1 CCTV Camera, 1 Alert Button
- Standard Package: ₱21,000 one-time | 1 Alert System, 2 CCTV Cameras, 1 Alert Button
- Advanced Package: ₱22,000 one-time | 1 Alert System, 2 CCTV Cameras, 2 Alert Buttons
- Enterprise Package: ₱25,000 one-time | 1 Alert System, 4 CCTV Cameras, 2 Alert Buttons
- All packages include a ₱500/month maintenance fee (software maintenance + monthly on-site inspection)

WHAT'S INCLUDED IN EVERY PACKAGE:
- Professional Installation by certified technicians
- System Configuration
- User Training
- Dashboard Access (24/7 monitoring from anywhere)
- Technical Support
- Emergency Alert Monitoring

INSTALLATION TIMELINE:
- Day 1: Site Assessment
- Day 2–3: Device Installation
- Day 4: System Testing
- Day 5: Activation & Training

HOW IT WORKS:
1. Alert button is pressed → signal transmitted instantly
2. CCTV activates and begins live recording
3. Dashboard receives the alert in real-time
4. Emergency response notification is sent
5. Incident is monitored until resolved

CONTACT:
- Phone: +63 939 920 8711
- Email: admin@instapulse.site
- Telegram: https://t.me/instapulsedavsur
- Location: Digos City, Davao del Sur, Philippines

== BEHAVIOR RULES ==
- Answer only about InstaPulse, its services, packages, pricing, installation, and support
- Be concise — keep answers under 5 sentences when possible
- For complex or specific account issues, direct users to contact support
- Never make up prices or features not listed above
- Encourage interested users to visit /packages or contact the team
- If asked about something unrelated to InstaPulse, politely redirect the conversation`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    const { message, history } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const contents = [
      ...(history || []).map((h: { role: string; text: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    })

    const text = response.text ?? 'Sorry, I could not generate a response. Please try again.'

    return NextResponse.json({ reply: text })
  } catch (err: any) {
    console.error('[CHAT API ERROR]', err)
    return NextResponse.json({ error: 'Failed to get a response. Please try again.' }, { status: 500 })
  }
}
