import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const apiKey = process.env.BKEND_PK

    if (!apiKey) {
      return NextResponse.json({ message: 'API key not configured' }, { status: 500 })
    }

    const res = await fetch(`${API_BASE}/auth/email/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        method: 'password',
        email,
        password,
      }),
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      const message = body?.error?.message ?? `HTTP ${res.status}`
      return NextResponse.json({ message }, { status: res.status })
    }

    // success: { success: true, data: { accessToken, refreshToken, ... } }
    return NextResponse.json(body?.data ?? body, { status: res.status })
  } catch (err) {
    console.error('[signin proxy error]', err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
