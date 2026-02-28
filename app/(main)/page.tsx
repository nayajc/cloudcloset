'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { Button } from '@/components/ui/button'
import { Sparkles, Shirt, Plus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const { user } = useAuth()
  const { items } = useWardrobe(user?.id)
  const { t } = useTranslation()

  const upwears = items.filter((i) => i.category === 'upwear')
  const downwears = items.filter((i) => i.category === 'downwear')
  const onepieces = items.filter((i) => i.category === 'onepiece')

  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="text-xl font-bold">{t('home.weatherTitle')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t('home.weatherDesc')}</p>
      </div>

      <WeatherWidget />

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
