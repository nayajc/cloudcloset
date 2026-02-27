'use client'

import { useState, useEffect, useCallback } from 'react'
import { bkendDB, bkendStorage } from '@/lib/bkend'
import type { ClothingItem, ClothingAnalysis } from '@/lib/types'

export function useWardrobe(userId?: string) {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const data = await bkendDB.list<ClothingItem>('clothing_items', {
        user_id: userId,
        is_active: 'true',
      })
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addClothing = useCallback(
    async (file: File, analysis: ClothingAnalysis, userId: string) => {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/${Date.now()}.${ext}`
      const imageUrl = await bkendStorage.upload('clothing-images', path, file)

      const item = await bkendDB.create<ClothingItem>('clothing_items', {
        user_id: userId,
        name: analysis.name,
        image_url: imageUrl,
        category: analysis.category,
        colors: analysis.colors,
        style: analysis.style,
        seasons: analysis.seasons,
        is_active: true,
      })
      setItems((prev) => [item, ...prev])
      return item
    },
    []
  )

  const removeClothing = useCallback(async (id: string) => {
    await bkendDB.update('clothing_items', id, { is_active: false })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return { items, loading, addClothing, removeClothing, refetch: fetchItems }
}
