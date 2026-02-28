'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { OutfitCard } from '@/components/outfit/OutfitCard'
import type { MyStyleOutfit } from '@/lib/types'
import { Heart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function HistoryPage() {
  const { user } = useAuth()
  const { t, language } = useTranslation()
  const [records, setRecords] = useState<MyStyleOutfit[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!user) return
    const { data } = await supabase
      .from('my_style_outfits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setRecords((data as MyStyleOutfit[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user])

  const handleRemove = () => {
    // If an item is unliked, we reload to remove it from the list
    load()
  }

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
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('history.empty')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-gray-500">
                  {new Date(record.created_at).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-gray-400">
                  {record.weather.condition} {Math.round(record.weather.temp)}°C · {record.weather.location}
                </span>
              </div>
              <OutfitCard
                outfit={record.outfit}
                weather={record.weather}
                myStyleId={record.id}
                onRemove={handleRemove}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
