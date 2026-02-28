'use client'

import { useState } from 'react'
import type { OutfitCombo, WeatherData } from '@/lib/types'
import { Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Props {
  outfit: OutfitCombo
  weather?: WeatherData | null
  myStyleId?: string
  onRemove?: () => void
}

const LABEL_COLOR: Record<string, string> = {
  A: 'bg-violet-100 text-violet-700',
  B: 'bg-sky-100 text-sky-700',
  C: 'bg-emerald-100 text-emerald-700',
}

export function OutfitCard({ outfit, weather, myStyleId, onRemove }: Props) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(!!myStyleId)
  const [currentStyleId, setCurrentStyleId] = useState<string | null>(myStyleId || null)

  const handleToggleLike = async () => {
    if (!user) return

    if (isLiked && currentStyleId) {
      // Unlike
      setIsLiked(false)
      const { error } = await supabase.from('my_style_outfits').delete().eq('id', currentStyleId)
      if (!error) {
        setCurrentStyleId(null)
        if (onRemove) onRemove()
      } else {
        setIsLiked(true) // revert
      }
    } else if (!isLiked && weather) {
      // Like
      setIsLiked(true)
      const { data, error } = await supabase
        .from('my_style_outfits')
        .insert({ user_id: user.id, outfit, weather })
        .select()
        .single()

      if (data && !error) {
        setCurrentStyleId(data.id)
      } else {
        setIsLiked(false) // revert
      }
    }
  }
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden relative">
      <div className="p-4 pb-3 flex items-center justify-between border-b">
        <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${LABEL_COLOR[outfit.label] ?? 'bg-gray-100 text-gray-600'}`}>
          코디 {outfit.label}
        </span>
        <button
          onClick={handleToggleLike}
          className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-300'}`}
          />
        </button>
      </div>

      {outfit.onepiece_id ? (
        <div className="p-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">원피스</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {outfit.onepiece_image ? (
                <img
                  src={outfit.onepiece_image}
                  alt={outfit.onepiece_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-xs">이미지 없음</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium truncate">{outfit.onepiece_name}</p>
              {outfit.onepiece_location && (
                <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
                  📍 {outfit.onepiece_location}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">상의</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              {outfit.upwear_image ? (
                <img
                  src={outfit.upwear_image}
                  alt={outfit.upwear_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  이미지 없음
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium truncate">{outfit.upwear_name}</p>
              {outfit.upwear_location && (
                <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
                  📍 {outfit.upwear_location}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">하의</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              {outfit.downwear_image ? (
                <img
                  src={outfit.downwear_image}
                  alt={outfit.downwear_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  이미지 없음
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium truncate">{outfit.downwear_name}</p>
              {outfit.downwear_location && (
                <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
                  📍 {outfit.downwear_location}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
          {outfit.reason}
        </p>
      </div>
    </div>
  )
}
