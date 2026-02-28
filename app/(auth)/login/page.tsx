'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation, Language } from '@/lib/i18n'
import { Languages } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/')
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
          <img src="/logo.png" alt="CloudCloset Logo" className="w-16 h-16 rounded-2xl shadow-sm mb-4 border" />
          <h1 className="text-3xl font-bold tracking-tight">CloudCloset</h1>
          <p className="text-gray-500 text-sm mt-2">{t('brand.subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-400">
                  {t('auth.pwHint')}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.processing') : mode === 'signin' ? t('auth.login') : t('auth.signup')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
