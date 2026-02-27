'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useWardrobe } from '@/hooks/useWardrobe'
import { ClothingUpload } from '@/components/clothing/ClothingUpload'
import type { ClothingAnalysis } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddClothingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addClothing } = useWardrobe(user?.id)

  async function handleSave(file: File, analysis: ClothingAnalysis) {
    if (!user) return
    await addClothing(file, analysis, user.id)
    router.push('/wardrobe')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/wardrobe" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold">옷 추가</h2>
      </div>
      <p className="text-sm text-gray-500">
        사진을 업로드하면 AI가 자동으로 분류해드려요.
      </p>
      <ClothingUpload onSave={handleSave} />
    </div>
  )
}
