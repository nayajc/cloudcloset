import type { OutfitCombo } from '@/lib/types'

interface Props {
  outfit: OutfitCombo
}

const LABEL_COLOR: Record<string, string> = {
  A: 'bg-violet-100 text-violet-700',
  B: 'bg-sky-100 text-sky-700',
  C: 'bg-emerald-100 text-emerald-700',
}

export function OutfitCard({ outfit }: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="p-4 pb-3 flex items-center gap-2 border-b">
        <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${LABEL_COLOR[outfit.label] ?? 'bg-gray-100 text-gray-600'}`}>
          코디 {outfit.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">상의</p>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            {outfit.upwear_image ? (
              <img
                src={outfit.upwear_image}
                alt={outfit.upwear_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                이미지 없음
              </div>
            )}
          </div>
          <p className="text-sm font-medium truncate">{outfit.upwear_name}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">하의</p>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            {outfit.downwear_image ? (
              <img
                src={outfit.downwear_image}
                alt={outfit.downwear_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                이미지 없음
              </div>
            )}
          </div>
          <p className="text-sm font-medium truncate">{outfit.downwear_name}</p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
          {outfit.reason}
        </p>
      </div>
    </div>
  )
}
