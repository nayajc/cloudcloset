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
import { Sparkles, RefreshCw } from 'lucide-react'

export default function RecommendPage() {
  const { user } = useAuth()
  const { items } = useWardrobe(user?.id)
  const { weather } = useWeather()
  const [outfits, setOutfits] = useState<OutfitCombo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upwears = items.filter((i) => i.category === 'upwear')
  const downwears = items.filter((i) => i.category === 'downwear')
  const canRecommend = upwears.length > 0 && downwears.length > 0 && !!weather

  async function handleRecommend() {
    if (!weather || !user) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recommend-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weather, wardrobe: { upwears, downwears } }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? '추천에 실패했습니다.')
      }
      const { outfits: result } = await res.json()
      setOutfits(result)

      // DB에 저장
      await supabase.from('outfit_recommendations').insert({
        user_id: user.id,
        weather_temp: weather.temp,
        weather_condition: weather.condition,
        weather_location: weather.location,
        outfits: result,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">코디 추천</h2>
        <p className="text-sm text-gray-500 mt-0.5">오늘 날씨에 맞는 코디 3가지를 추천해드려요</p>
      </div>

      <WeatherWidget />

      {!canRecommend && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
          {!weather
            ? '날씨 정보를 불러오는 중...'
            : '상의와 하의를 각각 1개 이상 등록해주세요.'}
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
            AI가 코디 추천 중...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {outfits.length > 0 ? '다시 추천받기' : '코디 추천받기'}
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      {outfits.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-500">추천 코디</h3>
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.label} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  )
}
