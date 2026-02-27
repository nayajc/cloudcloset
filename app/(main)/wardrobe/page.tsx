'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { ClothingCard } from '@/components/clothing/ClothingCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

type Tab = 'all' | 'upwear' | 'downwear'

export default function WardrobePage() {
  const { user } = useAuth()
  const { items, loading, removeClothing } = useWardrobe(user?.id)
  const [tab, setTab] = useState<Tab>('all')

  const filtered = tab === 'all' ? items : items.filter((i) => i.category === tab)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">내 옷장</h2>
        <Link href="/wardrobe/add">
          <Button size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> 추가
          </Button>
        </Link>
      </div>

      {/* 탭 */}
      <div className="flex gap-2">
        {(['all', 'upwear', 'downwear'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === t ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'all' ? '전체' : t === 'upwear' ? '상의' : '하의'}
            <span className="ml-1.5 text-xs opacity-70">
              {t === 'all' ? items.length : items.filter((i) => i.category === t).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-gray-100 aspect-square animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">아직 옷이 없어요</p>
          <Link href="/wardrobe/add" className="text-sm underline mt-2 block">
            첫 번째 옷 추가하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <ClothingCard key={item.id} item={item} onRemove={removeClothing} />
          ))}
        </div>
      )}
    </div>
  )
}
