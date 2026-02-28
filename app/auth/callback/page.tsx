'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        // Supabase client automatically handles the `#access_token=...` hash fragment in the URL
        // and stores the session in local storage.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                // The layout handles redirecting to /onboarding if metadata is missing.
                router.push('/')
            }
        })

        // Fallback if no event fires but session already exists
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push('/')
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">인증 처리 중입니다...</p>
            </div>
        </div>
    )
}
