import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://api.bkend.ai/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(`${API_BASE}/auth/email/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({ message: res.statusText }))
  return NextResponse.json(data, { status: res.status })
}
