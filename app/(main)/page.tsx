'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { useWeather } from '@/hooks/useWeather'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { Button } from '@/components/ui/button'
import { Sparkles, Shirt, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const { user } = useAuth()
  const { items } = useWardrobe(user?.id)
  const { weatherArray, loading, error, refetch } = useWeather()
  const { t, language } = useTranslation()

  const [dayOffset, setDayOffset] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

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

  // Swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && dayOffset < weatherArray.length - 1) {
      setDayOffset(prev => prev + 1) // next day
    }
    if (isRightSwipe && dayOffset > 0) {
      setDayOffset(prev => prev - 1) // previous day
    }
  }

  const upwears = items.filter((i) => i.category === 'upwear')
  const downwears = items.filter((i) => i.category === 'downwear')
  const onepieces = items.filter((i) => i.category === 'onepiece')

  return (
    <div className="space-y-6 py-2">
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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="touch-pan-y"
      >
        <WeatherWidget weather={currentWeather} loading={loading} error={error} refetch={refetch} />
      </div>

      {/* 내 옷장 요약 */}
      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Shirt className="w-4 h-4" /> {t('wardrobe.title')}
          </h3>
          <Link href="/wardrobe/add" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <Plus className="w-3 h-3" /> {t('common.add')}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="text-2xl font-bold">{upwears.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('wardrobe.upwear')}</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="text-2xl font-bold">{downwears.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('wardrobe.downwear')}</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="text-2xl font-bold">{onepieces.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('wardrobe.onepiece')}</p>
          </div>
        </div>
      </div>

      {/* 추천 CTA */}
      {(upwears.length > 0 && downwears.length > 0) || onepieces.length > 0 ? (
        <Link href="/recommend">
          <Button size="lg" className="w-full gap-2 h-14 text-base rounded-2xl">
            <Sparkles className="w-5 h-5" />
            {t('recommend.button')}
          </Button>
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed p-6 text-center space-y-3">
          <p className="text-sm text-gray-500 whitespace-pre-line">
            {t('home.recHint')}
          </p>
          <Link href="/wardrobe/add">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> {t('home.addFirst')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
