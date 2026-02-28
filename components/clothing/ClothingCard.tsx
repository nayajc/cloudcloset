'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import type { ClothingItem } from '@/lib/types'

const STYLE_LABEL: Record<string, string> = {
  casual: '캐주얼',
  formal: '포멀',
  sport: '스포츠',
  street: '스트릿',
}

interface Props {
  item: ClothingItem
  onRemove?: (id: string) => void
}

export function ClothingCard({ item, onRemove }: Props) {
  return (
    <div className="group relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/wardrobe/${item.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <p className="font-medium text-sm truncate">{item.name}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {item.category === 'upwear' ? '상의' : item.category === 'downwear' ? '하의' : '원피스'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {STYLE_LABEL[item.style] ?? item.style}
            </Badge>
            {item.colors.slice(0, 1).map((c) => (
              <Badge key={c} variant="outline" className="text-xs">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault()
            onRemove(item.id)
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-1 hover:bg-red-50 z-10"
          title="삭제"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      )}
    </div>
  )
}
