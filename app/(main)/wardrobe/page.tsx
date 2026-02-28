'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { ClothingCard } from '@/components/clothing/ClothingCard'
import { ClothingFilter } from '@/components/clothing/ClothingFilter'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function WardrobePage() {
  const { user } = useAuth()
  const { items, loading, filter, setFilter, removeClothing } = useWardrobe(
    user?.id
  )
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t('wardrobe.title')}</h2>
        <Link href="/wardrobe/add">
          <Button size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> {t('common.add')}
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
          <p className="text-sm">{t('wardrobe.emptyTitle')}</p>
          <Link
            href="/wardrobe/add"
            className="text-sm underline mt-2 block"
          >
            {t('home.addFirst')}
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
