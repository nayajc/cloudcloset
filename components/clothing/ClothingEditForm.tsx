'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import type { ClothingItem } from '@/lib/types'

const STYLE_OPTIONS = ['casual', 'formal', 'sport', 'street'] as const
const SEASON_OPTIONS = ['spring', 'summer', 'fall', 'winter'] as const
const SEASON_LABEL: Record<string, string> = {
  spring: '봄',
  summer: '여름',
  fall: '가을',
  winter: '겨울',
}
const STYLE_LABEL: Record<string, string> = {
  casual: '캐주얼',
  formal: '포멀',
  sport: '스포츠',
  street: '스트릿',
}

interface Props {
  item: ClothingItem
  onSave: (updates: Partial<ClothingItem>) => Promise<void>
  onCancel: () => void
}

export function ClothingEditForm({ item, onSave, onCancel }: Props) {
  const [name, setName] = useState(item.name)
  const [location, setLocation] = useState(item.location || '')
  const [category, setCategory] = useState(item.category)
  const [style, setStyle] = useState(item.style)
  const [seasons, setSeasons] = useState<string[]>(item.seasons)
  const [colorsText, setColorsText] = useState(item.colors.join(', '))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave({
        name,
        location: location || null,
        category,
        style,
        seasons: seasons as ClothingItem['seasons'],
        colors: colorsText
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">옷 이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">위치 (예: 첫번째 서랍)</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="옷이 보관된 위치를 입력하세요"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">카테고리</label>
        <div className="flex gap-2">
          {(['upwear', 'downwear'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${category === c
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
            >
              {c === 'upwear' ? '상의' : '하의'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">스타일</label>
        <div className="flex gap-2 flex-wrap">
          {STYLE_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${style === s
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
            >
              {STYLE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          계절 (복수 선택)
        </label>
        <div className="flex gap-2 flex-wrap">
          {SEASON_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() =>
                setSeasons((prev) =>
                  prev.includes(s)
                    ? prev.filter((x) => x !== s)
                    : [...prev, s]
                )
              }
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${seasons.includes(s)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
            >
              {SEASON_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          색상 (콤마로 구분)
        </label>
        <input
          type="text"
          value={colorsText}
          onChange={(e) => setColorsText(e.target.value)}
          placeholder="흰색, 회색"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="flex-1 gap-1"
        >
          <Check className="w-4 h-4" />
          {saving ? '저장 중...' : '저장'}
        </Button>
        <Button variant="outline" onClick={onCancel} className="gap-1">
          <X className="w-4 h-4" />
          취소
        </Button>
      </div>
    </div>
  )
}
