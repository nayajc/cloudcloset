'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { ClothingCard } from '@/components/clothing/ClothingCard'
import { ClothingFilter } from '@/components/clothing/ClothingFilter'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function WardrobePage() {
  const { user } = useAuth()
  const { items, loading, filter, setFilter, removeClothing } = useWardrobe(
    user?.id
  )

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

      <ClothingFilter
        category={filter.category ?? null}
        style={filter.style ?? null}
        itemCount={items.length}
        onCategoryChange={(v) => setFilter((f) => ({ ...f, category: v }))}
        onStyleChange={(v) => setFilter((f) => ({ ...f, style: v }))}
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-gray-100 aspect-square animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">아직 옷이 없어요</p>
          <Link
            href="/wardrobe/add"
            className="text-sm underline mt-2 block"
          >
            첫 번째 옷 추가하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <ClothingCard key={item.id} item={item} onRemove={removeClothing} />
          ))}
        </div>
      )}
    </div>
  )
}
