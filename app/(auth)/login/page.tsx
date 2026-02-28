'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation, Language } from '@/lib/i18n'
import { Languages, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Re-using same style options from existing components
const STYLES = [
  'style.casual', 'style.minimal', 'style.street', 'style.dandy',
  'style.classic', 'style.office', 'style.sports', 'style.vintage',
  'style.hiphop', 'style.modern', 'style.lovely', 'style.highend'
]

const AGE_GROUPS = [
  'age.10-20', 'age.20-30', 'age.30-40', 'age.40-50', 'age.50-60', 'age.60+'
]

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  // Onboarding Data
  const [gender, setGender] = useState<'auth.male' | 'auth.female' | ''>('')
  const [ageGroup, setAgeGroup] = useState('')
  const [preferredStyles, setPreferredStyles] = useState<string[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const toggleStyle = (style: string) => {
    setPreferredStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'forgot') {
        await resetPassword(email)
      } else if (mode === 'signin') {
        await signIn(email, password)
      } else {
        if (!gender || !ageGroup || preferredStyles.length === 0) {
          throw new Error(t('auth.onboardingError'))
        }
        if (!agreedToTerms) {
          throw new Error(t('auth.termsRequired'))
        }
        await signUp(email, password, { gender, ageGroup, preferredStyles })
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
      <div className="w-full max-w-sm relative">
        <div className="absolute -top-12 right-0">
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Languages className="w-4 h-4" />
            {language === 'ko' ? 'EN' : 'KO'}
          </button>
        </div>
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="CloudCloset Logo" className="w-16 h-16 rounded-2xl shadow-sm mb-4" />
          <h1 className="text-3xl tracking-tight"><span className="font-extrabold" style={{ color: '#000DFF' }}>Cloud</span><span className="font-bold">Closet</span></h1>
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

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
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
            )}

            {mode === 'signup' && (
              <div className="space-y-5 pt-4 border-t mt-4">
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
              </div>
            )}

            {mode === 'signup' && (
              <label className="flex items-start gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 accent-blue-600"
                />
                <span className="text-xs text-gray-500">
                  {t('auth.agreeToTerms')}{' '}
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                    {t('auth.termsLink')}
                  </a>
                </span>
              </label>
            )}

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            {resetSent && (
              <p className="text-green-600 text-sm bg-green-50 rounded-lg px-3 py-2 border border-green-100">{t('auth.resetEmailSent')}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading || resetSent}>
              {loading
                ? t('auth.processing')
                : mode === 'forgot'
                  ? t('auth.sendResetLink')
                  : mode === 'signin'
                    ? t('auth.login')
                    : t('auth.signup')}
            </Button>
          </form>

          {mode === 'signin' && (
            <div className="mt-4 pt-4 border-t flex flex-col items-center">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-center"
                onClick={() => signInWithGoogle()}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                {t('auth.continueWithGoogle')}
              </Button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setResetSent(false)
                setError(null)
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {mode === 'forgot'
                ? t('auth.backToLogin')
                : mode === 'signin'
                  ? t('auth.noAccount')
                  : t('auth.hasAccount')}
            </button>
          </div>

          <div className="mt-3 text-center">
            <a href="/contact" className="text-xs text-gray-400 hover:text-gray-600">
              {t('contact.title')} · C.Threads
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
