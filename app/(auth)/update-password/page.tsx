'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation, Language } from '@/lib/i18n'
import { Languages } from 'lucide-react'
import { BrandLogo } from '@/components/ui/BrandLogo'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const { updatePassword } = useAuth()
    const { t, language, setLanguage } = useTranslation()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await updatePassword(password)
            setSuccess(true)
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } catch (e) {
            setError(e instanceof Error ? e.message : t('common.error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 flex-col relative">
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                    className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                    <Languages className="w-4 h-4" />
                    {language === 'ko' ? 'EN' : 'KO'}
                </button>
            </div>

            <div className="w-full max-w-sm">
                <div className="text-center mb-8 flex flex-col items-center">
                    <BrandLogo size="lg" showIcon />
                    <p className="text-gray-500 text-sm mt-4">{t('auth.updatePasswordTitle')}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="password">{t('auth.newPassword')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                disabled={success}
                            />
                            <p className="text-xs text-gray-400">{t('auth.pwHint')}</p>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
                        )}

                        {success && (
                            <p className="text-green-600 text-sm bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                                {t('auth.passwordUpdated')}
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={loading || success}>
                            {loading ? t('auth.processing') : t('auth.updatePasswordBtn')}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
