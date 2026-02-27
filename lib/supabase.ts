import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC_ 변수는 빌드 타임에 번들에 포함됨
// 폴백은 SSG 빌드 시 크래시 방지용 (실제 런타임에는 실제 값 사용됨)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-build-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 서버 전용 Admin 클라이언트 (RLS 우회, Route Handler에서만 사용)
export function createAdminClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
