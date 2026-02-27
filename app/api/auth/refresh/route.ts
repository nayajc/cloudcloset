import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'
const API_KEY = process.env.NEXT_PUBLIC_BKEND_PK!

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({ message: res.statusText }))
  return NextResponse.json(data, { status: res.status })
}
