import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'
const API_KEY = process.env.NEXT_PUBLIC_BKEND_PK!

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  })
  if (!res.ok) {
    return NextResponse.json(null, { status: res.status })
  }
  const data = await res.json().catch(() => null)
  return NextResponse.json(data)
}
