import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'
const API_KEY = process.env.NEXT_PUBLIC_BKEND_PK!

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const res = await fetch(`${API_BASE}/auth/email/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({
      method: 'password',
      email,
      password,
      name: email.split('@')[0],
    }),
  })
  const data = await res.json().catch(() => ({ message: res.statusText }))
  return NextResponse.json(data, { status: res.status })
}
