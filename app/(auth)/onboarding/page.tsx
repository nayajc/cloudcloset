'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const STYLES = [
    'style.casual', 'style.minimal', 'style.street', 'style.dandy',
    'style.classic', 'style.office', 'style.sports', 'style.vintage',
    'style.hiphop', 'style.modern', 'style.lovely', 'style.highend'
]

const AGE_GROUPS = [
    'age.10-20', 'age.20-30', 'age.30-40', 'age.40-50', 'age.50-60', 'age.60+'
]

export default function OnboardingPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const { t } = useTranslation()

    const [gender, setGender] = useState<'auth.male' | 'auth.female' | ''>('')
    const [ageGroup, setAgeGroup] = useState('')
    const [preferredStyles, setPreferredStyles] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)

    // Redirect if already has metadata
    useEffect(() => {
        if (!authLoading && user) {
            const meta = user.user_metadata
            if (meta?.gender && meta?.ageGroup && meta?.preferredStyles?.length > 0) {
                router.push('/')
            }
        }
    }, [user, authLoading, router])

    const toggleStyle = (style: string) => {
        setPreferredStyles(prev =>
            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!gender || !ageGroup || preferredStyles.length === 0) return

        setSubmitting(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: { gender, ageGroup, preferredStyles }
            })
            if (error) throw error

            // Notify developer about new signup (fire-and-forget)
            fetch('/api/notify-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user?.email, method: 'google-oauth' }),
            }).catch(err => console.error('[notify-signup]', err))

            // Force refresh session to ensure new metadata is picked up
            await supabase.auth.refreshSession()
            router.push('/')
        } catch (e) {
            console.error(e)
            alert(t('common.error'))
        } finally {
            setSubmitting(false)
        }
    }

    if (authLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">{t('onboarding.title', { default: 'Welcome! Tell us about yourself' })}</h1>
                    <p className="text-gray-500 text-sm mt-2">{t('onboarding.desc', { default: 'We need some details to personalize your AI outfit recommendations.' })}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>{t('auth.gender')}</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {['auth.male', 'auth.female'].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setGender(g as 'auth.male' | 'auth.female')}
                                    className={cn("p-2 text-sm border rounded-xl flex items-center justify-center transition-colors", gender === g ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50")}
                                >
                                    {t(g)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('auth.ageGroup')}</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {AGE_GROUPS.map(age => (
                                <button
                                    key={age}
                                    type="button"
                                    onClick={() => setAgeGroup(age)}
                                    className={cn("p-2 text-xs border rounded-xl flex items-center justify-center transition-colors", ageGroup === age ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50")}
                                >
                                    {t(age)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('auth.preferredStyles')} <span className="text-xs font-normal text-gray-400">{t('auth.multipleChoices')}</span></Label>
                        <div className="flex flex-wrap gap-2">
                            {STYLES.map(style => {
                                const selected = preferredStyles.includes(style)
                                return (
                                    <button
                                        key={style}
                                        type="button"
                                        onClick={() => toggleStyle(style)}
                                        className={cn("px-3 py-1.5 text-xs border rounded-full flex items-center gap-1 transition-all", selected ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-600")}
                                    >
                                        {selected && <Check className="w-3 h-3" />}
                                        {t(style)}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!gender || !ageGroup || preferredStyles.length === 0 || submitting}
                    >
                        {submitting ? t('auth.processing') : t('common.save')}
                    </Button>
                </form>
            </div>
        </div>
    )
}
