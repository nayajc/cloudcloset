'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Sparkles, Check } from 'lucide-react'
import type { ClothingAnalysis } from '@/lib/types'

const STYLE_OPTIONS = ['casual', 'formal', 'sport', 'street'] as const
const SEASON_OPTIONS = ['spring', 'summer', 'fall', 'winter'] as const
const SEASON_LABEL: Record<string, string> = {
  spring: '봄', summer: '여름', fall: '가을', winter: '겨울',
}
const STYLE_LABEL: Record<string, string> = {
  casual: '캐주얼', formal: '포멀', sport: '스포츠', street: '스트릿',
}

interface Props {
  onSave: (file: File, analysis: ClothingAnalysis) => Promise<void>
}

import { useTranslation } from '@/lib/i18n'

export function ClothingUpload({ onSave }: Props) {
  const { t, language } = useTranslation()

  const SEASON_LABEL = language === 'ko'
    ? { spring: '봄', summer: '여름', fall: '가을', winter: '겨울' }
    : { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' }

  const STYLE_LABEL = language === 'ko'
    ? { casual: '캐주얼', formal: '포멀', sport: '스포츠', street: '스트릿' }
    : { casual: 'Casual', formal: 'Formal', sport: 'Sport', street: 'Street' }

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [analysis, setAnalysis] = useState<ClothingAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setAnalysis(null)
    setError(null)
  }

  async function handleAnalyze() {
    if (!file) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const base64 = await fileToBase64(file)
      const mimeType = file.type
      const res = await fetch('/api/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType, language }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || t('common.error'))
      }
      setAnalysis(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'))
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleSave() {
    if (!file || !analysis) return
    setIsSaving(true)
    try {
      await onSave(file, analysis)
      setFile(null)
      setPreview(null)
      setAnalysis(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const f = e.dataTransfer.files[0]
          if (f && f.type.startsWith('image/')) handleFileChange(f)
        }}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-64 mx-auto rounded-xl object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-10 h-10" />
            <p className="text-sm">{t('wardrobe.uploadHint1')}</p>
            <p className="text-xs">{t('wardrobe.uploadHint2')}</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFileChange(f)
          }}
        />
      </div>

      {/* AI 분석 버튼 */}
      {file && !analysis && (
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full gap-2">
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? t('wardrobe.analyzing') : t('wardrobe.analyzeStart')}
        </Button>
      )}

      {/* 분석 결과 */}
      {analysis && (
        <div className="rounded-xl border p-4 space-y-3 bg-gray-50">
          <p className="font-semibold text-sm">{t('wardrobe.resultTitle')}</p>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('wardrobe.labelName')}</label>
            <input
              type="text"
              value={analysis.name}
              onChange={(e) => setAnalysis({ ...analysis, name: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('wardrobe.labelLocation')}</label>
            <input
              type="text"
              value={analysis.location || ''}
              onChange={(e) => setAnalysis({ ...analysis, location: e.target.value })}
              placeholder={language === 'ko' ? '옷이 보관된 위치를 입력하세요' : 'Enter where the clothes are stored'}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('wardrobe.labelCategory')}</label>
            <div className="flex gap-2">
              {(['upwear', 'downwear'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setAnalysis({ ...analysis, category: c })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${analysis.category === c
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                  {c === 'upwear' ? t('wardrobe.upwear') : t('wardrobe.downwear')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('wardrobe.labelStyle')}</label>
            <div className="flex gap-2 flex-wrap">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setAnalysis({ ...analysis, style: s })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${analysis.style === s
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
            <label className="text-xs text-gray-500 mb-1 block">{t('wardrobe.labelSeasons')}</label>
            <div className="flex gap-2 flex-wrap">
              {SEASON_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const seasons = analysis.seasons.includes(s)
                      ? analysis.seasons.filter((x) => x !== s)
                      : [...analysis.seasons, s]
                    setAnalysis({ ...analysis, seasons })
                  }}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${analysis.seasons.includes(s)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                  {SEASON_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2 mt-2">
            <Check className="w-4 h-4" />
            {isSaving ? t('common.loading') : t('wardrobe.saveWardrobe')}
          </Button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
