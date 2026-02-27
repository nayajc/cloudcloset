import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api-client.bkend.ai/v1'
const API_KEY = process.env.NEXT_PUBLIC_BKEND_PK!

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  await fetch(`${API_BASE}/auth/signout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  }).catch(() => {})
  return NextResponse.json({ ok: true })
}
