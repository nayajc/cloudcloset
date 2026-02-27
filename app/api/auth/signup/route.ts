import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const apiKey = process.env.BKEND_PK

    if (!apiKey) {
      return NextResponse.json({ message: 'API key not configured' }, { status: 500 })
    }

    const res = await fetch(`${API_BASE}/auth/email/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        method: 'password',
        email,
        password,
        name: email.split('@')[0],
      }),
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      // bkend.ai error: { success: false, error: { code, message, details } }
      const fieldErrors = body?.error?.details?.fieldErrors
      let message = body?.error?.message ?? `HTTP ${res.status}`
      if (fieldErrors?.password?.includes('auth/invalid-password-format')) {
        message = '비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다'
      }
      return NextResponse.json({ message }, { status: res.status })
    }

    // success: { success: true, data: { accessToken, refreshToken, ... } }
    return NextResponse.json(body?.data ?? body, { status: res.status })
  } catch (err) {
    console.error('[signup proxy error]', err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
