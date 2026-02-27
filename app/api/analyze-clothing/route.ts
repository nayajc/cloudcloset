import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json()

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: '이미지 데이터가 필요합니다.' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `당신은 패션 전문가입니다. 주어진 옷 사진을 분석하여 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

응답 형식:
{
  "name": "옷 이름 (예: 흰 면 티셔츠, 블랙 청바지)",
  "category": "upwear 또는 downwear",
  "colors": ["주요 색상을 한국어로"],
  "style": "casual / formal / sport / street 중 하나",
  "seasons": ["spring", "summer", "fall", "winter 중 해당되는 것들"]
}`,
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[analyze-clothing]', error)
    return NextResponse.json({ error: '옷 분석 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
