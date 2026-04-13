import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Supabase 연결 확인을 위한 경량 쿼리
    const { error } = await supabase
      .from('my_style_outfits')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error('[health] Supabase ping failed:', error.message)
      return NextResponse.json({ status: 'error', message: error.message }, { status: 503 })
    }

    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[health] Unexpected error:', err)
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 })
  }
}
