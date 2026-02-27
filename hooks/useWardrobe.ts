'use client'

import { useState, useEffect, useCallback } from 'react'
import { bkendDB, bkendStorage } from '@/lib/bkend'
import type { ClothingItem, ClothingAnalysis } from '@/lib/types'

export interface WardrobeFilter {
  category?: string | null
  style?: string | null
}

export function useWardrobe(userId?: string) {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<WardrobeFilter>({})

  const fetchItems = useCallback(
    async (options?: WardrobeFilter) => {
      if (!userId) return
      setLoading(true)
      try {
        const params: Record<string, string> = {
          'filter[user_id]': userId,
          'filter[is_active]': 'true',
          sort: 'created_at:desc',
        }
        const opts = options ?? filter
        if (opts.category) params['filter[category]'] = opts.category
        if (opts.style) params['filter[style]'] = opts.style
        const data = await bkendDB.list<ClothingItem>('clothing_items', params)
        setItems(data)
      } finally {
        setLoading(false)
      }
    },
    [userId, filter]
  )

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addClothing = useCallback(
    async (file: File, analysis: ClothingAnalysis, userId: string) => {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/${Date.now()}.${ext}`
      const imageUrl = await bkendStorage.upload(file, path, 'protected')

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

  const updateClothing = useCallback(
    async (id: string, updates: Partial<ClothingItem>) => {
      const updated = await bkendDB.update<ClothingItem>(
        'clothing_items',
        id,
        updates
      )
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
      return updated
    },
    []
  )

  const getClothing = useCallback(async (id: string) => {
    return await bkendDB.get<ClothingItem>('clothing_items', id)
  }, [])

  const removeClothing = useCallback(async (id: string) => {
    await bkendDB.update('clothing_items', id, { is_active: false })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return {
    items,
    loading,
    filter,
    setFilter,
    addClothing,
    updateClothing,
    getClothing,
    removeClothing,
    refetch: fetchItems,
  }
}
