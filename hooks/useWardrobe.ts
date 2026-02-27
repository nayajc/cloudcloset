'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
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
        const opts = options ?? filter
        let query = supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (opts.category) query = query.eq('category', opts.category)
        if (opts.style) query = query.eq('style', opts.style)

        const { data, error } = await query
        if (error) throw error
        setItems((data as ClothingItem[]) ?? [])
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

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(path, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(path)

      const { data, error } = await supabase
        .from('clothing_items')
        .insert({
          user_id: userId,
          name: analysis.name,
          image_url: publicUrl,
          category: analysis.category,
          colors: analysis.colors,
          style: analysis.style,
          seasons: analysis.seasons,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error
      const item = data as ClothingItem
      setItems((prev) => [item, ...prev])
      return item
    },
    []
  )

  const updateClothing = useCallback(
    async (id: string, updates: Partial<ClothingItem>) => {
      const { data, error } = await supabase
        .from('clothing_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      const updated = data as ClothingItem
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
      return updated
    },
    []
  )

  const getClothing = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('clothing_items')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as ClothingItem
  }, [])

  const removeClothing = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('clothing_items')
      .update({ is_active: false })
      .eq('id', id)
    if (error) throw error
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
