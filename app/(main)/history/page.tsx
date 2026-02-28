'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { OutfitCard } from '@/components/outfit/OutfitCard'
import type { OutfitRecommendation } from '@/lib/types'
import { Cloud } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function HistoryPage() {
  const { user } = useAuth()
  const { t, language } = useTranslation()
  const [records, setRecords] = useState<OutfitRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data } = await supabase
        .from('outfit_recommendations')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
      setRecords((data as OutfitRecommendation[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4 py-2">
        <h2 className="text-xl font-bold">{t('history.title')}</h2>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">{t('history.title')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t('history.desc')}</p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Cloud className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('history.empty')}</p>
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {new Date(record.created_at).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
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
