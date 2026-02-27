import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api.bkend.ai/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  })
  if (!res.ok) {
    return NextResponse.json(null, { status: res.status })
  }
  const data = await res.json().catch(() => null)
  return NextResponse.json(data)
}
