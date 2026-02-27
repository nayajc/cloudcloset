import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_BKEND_PK
    if (!apiKey) return NextResponse.json(null, { status: 401 })

    const authHeader = request.headers.get('Authorization')
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })
    if (!res.ok) return NextResponse.json(null, { status: res.status })

    const body = await res.json().catch(() => null)
    // bkend.ai returns { success: true, data: { id, email, ... } }
    return NextResponse.json(body?.data ?? body)
  } catch {
    return NextResponse.json(null, { status: 401 })
  }
}
