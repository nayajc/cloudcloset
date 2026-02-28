'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { useWeather } from '@/hooks/useWeather'
import { OutfitCard } from '@/components/outfit/OutfitCard'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { OutfitCombo } from '@/lib/types'
import { Sparkles, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useSwipe } from '@/hooks/useSwipe'

export default function RecommendPage() {
  const { user } = useAuth()
  const { items } = useWardrobe(user?.id)
  const { weatherArray, loading: weatherLoading, error: weatherError, refetch } = useWeather()
  const { t, language } = useTranslation()
  const [outfits, setOutfits] = useState<OutfitCombo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dayOffset, setDayOffset] = useState(0)

  const currentWeather = weatherArray[dayOffset] || null

  const displayDate = () => {
    if (!currentWeather) return { date: '', relative: '' }
    const d = new Date(currentWeather.dateStr)
    const month = d.getMonth() + 1
    const date = d.getDate()
    const daysKo = ['일', '월', '화', '수', '목', '금', '토']
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayStr = language === 'ko' ? daysKo[d.getDay()] : daysEn[d.getDay()]
    const baseDate = language === 'ko' ? `${month}월 ${date}일 (${dayStr})` : `${month}/${date} (${dayStr})`

    let relative = ''
    if (dayOffset === 0) relative = language === 'ko' ? '오늘' : 'Today'
    else if (dayOffset === 1) relative = language === 'ko' ? '내일' : 'Tomorrow'

    return { date: baseDate, relative }
  }

  const { date: headerDate, relative: headerRelative } = displayDate()

  const swipe = useSwipe({
    onSwipeLeft: () => { if (dayOffset < weatherArray.length - 1) setDayOffset(p => p + 1) },
    onSwipeRight: () => { if (dayOffset > 0) setDayOffset(p => p - 1) },
  })

  const upwears = items.filter((i) => i.category === 'upwear')
  const downwears = items.filter((i) => i.category === 'downwear')
  const onepieces = items.filter((i) => i.category === 'onepiece')
  const canRecommend = ((upwears.length > 0 && downwears.length > 0) || onepieces.length > 0) && !!currentWeather

  async function handleRecommend() {
    if (!currentWeather || !user) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recommend-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: currentWeather,
          wardrobe: { upwears, downwears, onepieces },
          preferences: user.user_metadata,
          language
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? t('common.error'))
      }
      const { outfits: result } = await res.json()
      setOutfits(result)

      // DB에 저장
      await supabase.from('outfit_recommendations').insert({
        user_id: user.id,
        weather_temp: currentWeather.temp,
        weather_condition: currentWeather.condition,
        weather_location: currentWeather.location,
        outfits: result,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-2xl font-bold">{headerDate}</h2>
          {headerRelative && (
            <span className="text-sm font-medium text-gray-400 mb-1">{headerRelative}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDayOffset((p) => Math.max(0, p - 1))}
            disabled={dayOffset === 0 || weatherArray.length === 0}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setDayOffset((p) => Math.min(weatherArray.length - 1, p + 1))}
            disabled={dayOffset >= weatherArray.length - 1 || weatherArray.length === 0}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        onTouchStart={swipe.onTouchStart}
        onTouchMove={swipe.onTouchMove}
        onTouchEnd={swipe.onTouchEnd}
        className="overflow-hidden rounded-2xl"
      >
        <div style={swipe.style}>
          <WeatherWidget weather={currentWeather} loading={weatherLoading} error={weatherError} refetch={refetch} />
        </div>
      </div>

      {!canRecommend && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
          {!currentWeather
            ? t('recommend.weatherLoading')
            : t('recommend.reqText')}
        </div>
      )}

      <Button
        onClick={handleRecommend}
        disabled={!canRecommend || loading}
        size="lg"
        className="w-full gap-2 h-14 text-base rounded-2xl"
      >
        {loading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            {t('recommend.loading')}
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {outfits.length > 0 ? t('recommend.buttonAgain') : t('recommend.button')}
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      {outfits.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-500">{t('recommend.resultTitle')}</h3>
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.label}
              outfit={outfit}
              weather={currentWeather}
            />
          ))}
        </div>
      )}
    </div>
  )
}
