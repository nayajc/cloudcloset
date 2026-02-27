'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { Button } from '@/components/ui/button'
import { Sparkles, Shirt, Plus } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()
  const { items } = useWardrobe(user?.id)

  const upwears = items.filter((i) => i.category === 'upwear')
  const downwears = items.filter((i) => i.category === 'downwear')

  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="text-xl font-bold">오늘의 날씨</h2>
        <p className="text-sm text-gray-500 mt-0.5">날씨 기반으로 코디를 추천해드려요</p>
      </div>

      <WeatherWidget />

      {/* 내 옷장 요약 */}
      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Shirt className="w-4 h-4" /> 내 옷장
          </h3>
          <Link href="/wardrobe/add" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <Plus className="w-3 h-3" /> 추가
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="text-2xl font-bold">{upwears.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">상의</p>
          </div>
          <div className="bg-gray-50 rounded-xl py-3">
            <p className="text-2xl font-bold">{downwears.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">하의</p>
          </div>
        </div>
      </div>

      {/* 추천 CTA */}
      {upwears.length > 0 && downwears.length > 0 ? (
        <Link href="/recommend">
          <Button size="lg" className="w-full gap-2 h-14 text-base rounded-2xl">
            <Sparkles className="w-5 h-5" />
            오늘의 코디 추천받기
          </Button>
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed p-6 text-center space-y-3">
          <p className="text-sm text-gray-500">
            상의와 하의를 각각 1개 이상 등록하면<br />코디 추천을 받을 수 있어요!
          </p>
          <Link href="/wardrobe/add">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> 첫 번째 옷 추가하기
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
