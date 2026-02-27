import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api.bkend.ai/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  await fetch(`${API_BASE}/auth/signout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  }).catch(() => {})
  return NextResponse.json({ ok: true })
}
