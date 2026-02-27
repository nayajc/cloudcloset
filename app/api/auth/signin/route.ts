import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'
const API_KEY = process.env.NEXT_PUBLIC_BKEND_PK!

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const res = await fetch(`${API_BASE}/auth/email/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({
      method: 'password',
      email,
      password,
    }),
  })
  const data = await res.json().catch(() => ({ message: res.statusText }))
  const message = data.message ?? data.error?.message ?? `HTTP ${res.status}`
  return NextResponse.json({ ...data, message }, { status: res.status })
}
