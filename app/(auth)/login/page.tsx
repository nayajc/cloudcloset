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

const STYLES = ['캐주얼', '미니멀', '스트릿', '댄디', '클래식', '오피스룩', '스포츠 / 애슬레저', '빈티지', '힙합', '모던', '러블리', '하이엔드']
const AGE_GROUPS = ['10-20대', '20-30대', '30-40대', '40-50대', '50-60대', '60대 이상']

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, resetPassword } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  // Onboarding Data
  const [gender, setGender] = useState<'남성' | '여성' | ''>('')
  const [ageGroup, setAgeGroup] = useState('')
  const [preferredStyles, setPreferredStyles] = useState<string[]>([])

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
          throw new Error('성별, 연령대, 선호 스타일을 모두 선택해주세요.')
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
                  <Label>성별</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['남성', '여성'].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g as '남성' | '여성')}
                        className={cn("p-2 text-sm border rounded-xl flex items-center justify-center transition-colors", gender === g ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50")}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>연령대</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {AGE_GROUPS.map(age => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setAgeGroup(age)}
                        className={cn("p-2 text-xs border rounded-xl flex items-center justify-center transition-colors", ageGroup === age ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50")}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>선호하는 스타일 <span className="text-xs font-normal text-gray-400">(중복 선택 가능)</span></Label>
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
                          {style}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
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

        </div>
      </div>
    </div>
  )
}
