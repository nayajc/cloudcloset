'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { ClothingEditForm } from '@/components/clothing/ClothingEditForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import type { ClothingItem } from '@/lib/types'
import { useTranslation } from '@/lib/i18n'

export default function ClothingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { getClothing, updateClothing, removeClothing } = useWardrobe(user?.id)
  const { t, language } = useTranslation()

  const STYLE_LABEL: Record<string, string> = language === 'ko'
    ? { casual: '캐주얼', formal: '포멀', sport: '스포츠', street: '스트릿' }
    : { casual: 'Casual', formal: 'Formal', sport: 'Sport', street: 'Street' };
  const SEASON_LABEL: Record<string, string> = language === 'ko'
    ? { spring: '봄', summer: '여름', fall: '가을', winter: '겨울' }
    : { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' };

  const [item, setItem] = useState<ClothingItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const loadItem = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await getClothing(id)
      setItem(data)
    } finally {
      setLoading(false)
    }
  }, [id, getClothing])

  useEffect(() => {
    loadItem()
  }, [loadItem])

  async function handleSave(updates: Partial<ClothingItem>) {
    if (!id) return
    const updated = await updateClothing(id, updates)
    setItem(updated)
    setEditing(false)
  }

  async function handleDelete() {
    if (!id || !confirm(t('common.confirmDelete'))) return
    await removeClothing(id)
    router.push('/wardrobe')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>{t('wardrobe.notFound')}</p>
        <Link href="/wardrobe" className="text-sm underline mt-2 block">
          {t('wardrobe.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Link
          href="/wardrobe"
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold flex-1 truncate">{item.name}</h2>
      </div>

      {/* 이미지 */}
      <div className="rounded-2xl overflow-hidden border bg-gray-50">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full aspect-square object-cover"
        />
      </div>

      {editing ? (
        /* 수정 모드 */
        <div className="rounded-xl border p-4 bg-gray-50">
          <p className="font-semibold text-sm mb-3">{t('wardrobe.infoEdit')}</p>
          <ClothingEditForm
            item={item}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        /* 상세 뷰 */
        <>
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t('wardrobe.propCategory')}</span>
              <Badge variant="secondary">
                {item.category === 'upwear' ? t('wardrobe.upwear') : item.category === 'downwear' ? t('wardrobe.downwear') : t('wardrobe.onepiece')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t('wardrobe.propStyle')}</span>
              <Badge variant="outline">
                {STYLE_LABEL[item.style] ?? item.style}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t('wardrobe.propColor')}</span>
              <div className="flex gap-1">
                {item.colors.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            {item.location && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{t('wardrobe.propLocation')}</span>
                <span className="text-sm font-medium">{item.location}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t('wardrobe.propSeason')}</span>
              <div className="flex gap-1">
                {item.seasons.map((s) => (
                  <Badge key={s} variant="outline">
                    {SEASON_LABEL[s] ?? s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              className="flex-1 gap-1"
            >
              <Pencil className="w-4 h-4" />
              {t('common.edit')}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              {t('common.delete')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
