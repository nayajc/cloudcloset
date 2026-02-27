'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { bkendDB } from '@/lib/bkend'
import { OutfitCard } from '@/components/outfit/OutfitCard'
import type { OutfitRecommendation } from '@/lib/types'
import { Cloud } from 'lucide-react'

export default function HistoryPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<OutfitRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    bkendDB
      .list<OutfitRecommendation>('outfit_recommendations', { user_id: user.id })
      .then((data) => setRecords(data.sort((a, b) => b.created_at.localeCompare(a.created_at))))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-bold">코디 히스토리</h2>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">코디 히스토리</h2>
        <p className="text-sm text-gray-500 mt-0.5">지난 추천 기록을 확인해보세요</p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Cloud className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">아직 추천 기록이 없어요</p>
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {new Date(record.created_at).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </span>
              <span className="text-gray-400">
                {record.weather_condition} {record.weather_temp}°C · {record.weather_location}
              </span>
            </div>
            <div className="space-y-3">
              {record.outfits.map((outfit) => (
                <OutfitCard key={outfit.label} outfit={outfit} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
