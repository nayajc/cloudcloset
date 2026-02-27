'use client'

const CATEGORIES = [
  { value: null, label: '전체' },
  { value: 'upwear', label: '상의' },
  { value: 'downwear', label: '하의' },
] as const

const STYLES = [
  { value: null, label: '전체' },
  { value: 'casual', label: '캐주얼' },
  { value: 'formal', label: '포멀' },
  { value: 'sport', label: '스포츠' },
  { value: 'street', label: '스트릿' },
] as const

interface ClothingFilterProps {
  category: string | null
  style: string | null
  itemCount: number
  onCategoryChange: (v: string | null) => void
  onStyleChange: (v: string | null) => void
}

export function ClothingFilter({
  category,
  style,
  itemCount,
  onCategoryChange,
  onStyleChange,
}: ClothingFilterProps) {
  return (
    <div className="space-y-2">
      {/* 카테고리 필터 */}
      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            onClick={() => onCategoryChange(c.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === c.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto flex items-center text-xs text-gray-400">
          {itemCount}벌
        </span>
      </div>

      {/* 스타일 필터 */}
      <div className="flex gap-1.5 flex-wrap">
        {STYLES.map((s) => (
          <button
            key={s.label}
            onClick={() => onStyleChange(s.value)}
            className={`px-3 py-1 rounded-full text-xs transition-colors border ${
              style === s.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
