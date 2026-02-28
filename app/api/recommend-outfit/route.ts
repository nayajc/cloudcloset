import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'
import type { ClothingItem, WeatherData } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { weather, wardrobe, language = 'ko' }: { weather: WeatherData; wardrobe: { upwears: ClothingItem[]; downwears: ClothingItem[] }; language?: 'ko' | 'en' } =
      await req.json()

    if (!weather || !wardrobe) {
      return NextResponse.json({ error: '날씨와 옷장 정보가 필요합니다.' }, { status: 400 })
    }

    if (wardrobe.upwears.length === 0 || wardrobe.downwears.length === 0) {
      return NextResponse.json(
        { error: '상의와 하의가 각각 1개 이상 필요합니다.' },
        { status: 400 }
      )
    }

    const upwearList = wardrobe.upwears
      .map((i) => `- ID: ${i.id} | ${i.name} | 색상: ${i.colors.join(', ')} | 스타일: ${i.style} | 계절: ${i.seasons.join(', ')}`)
      .join('\n')

    const downwearList = wardrobe.downwears
      .map((i) => `- ID: ${i.id} | ${i.name} | 색상: ${i.colors.join(', ')} | 스타일: ${i.style} | 계절: ${i.seasons.join(', ')}`)
      .join('\n')

    const prompt = `당신은 패션 스타일리스트입니다. 오늘의 날씨와 사용자의 옷장을 보고 코디 3가지를 추천해주세요. JSON만 응답하세요.

[오늘의 날씨]
- 기온: ${weather.temp}°C (체감: ${weather.feelsLike}°C)
- 날씨: ${weather.condition}
- 습도: ${weather.humidity}%

[내 옷장 - 상의]
${upwearList}

[내 옷장 - 하의]
${downwearList}

규칙:
1. 날씨와 기온에 적합한 조합 선택
2. 색상 조화를 고려
3. 스타일 일관성 유지
4. 각 코디마다 추천 이유 1-2문장 (${language === 'en' ? 'in English' : '한국어로'})
5. 각 코디는 다른 아이템 조합이어야 함

응답 형식:
{
  "outfits": [
    {
      "label": "A",
      "upwear_id": "실제 ID",
      "downwear_id": "실제 ID",
      "reason": "추천 이유"
    },
    {
      "label": "B",
      "upwear_id": "실제 ID",
      "downwear_id": "실제 ID",
      "reason": "추천 이유"
    },
    {
      "label": "C",
      "upwear_id": "실제 ID",
      "downwear_id": "실제 ID",
      "reason": "추천 이유"
    }
  ]
}`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
    const { outfits } = JSON.parse(cleaned)

    // upwear/downwear 이름과 이미지를 추천 결과에 포함
    const enriched = outfits.map((o: { label: string; upwear_id: string; downwear_id: string; reason: string }) => {
      const up = wardrobe.upwears.find((i) => i.id === o.upwear_id)
      const down = wardrobe.downwears.find((i) => i.id === o.downwear_id)
      return {
        ...o,
        upwear_name: up?.name ?? '',
        upwear_image: up?.image_url ?? '',
        downwear_name: down?.name ?? '',
        downwear_image: down?.image_url ?? '',
      }
    })

    return NextResponse.json({ outfits: enriched })
  } catch (error) {
    console.error('[recommend-outfit]', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
