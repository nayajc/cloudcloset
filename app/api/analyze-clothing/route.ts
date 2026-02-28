import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, language = 'ko' } = await req.json()

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: '이미지 데이터가 필요합니다.' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
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
  "name": "옷 이름 (예: ${language === 'en' ? 'White Cotton T-shirt, Black Jeans' : '흰 면 티셔츠, 블랙 청바지'})",
  "category": "upwear 또는 downwear",
  "colors": ["주요 색상을 ${language === 'en' ? '영어' : '한국어'}로"],
  "style": "casual / formal / sport / street 중 하나",
  "seasons": ["spring", "summer", "fall", "winter 중 해당되는 것들"]
}`,
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // JSON 문자열만 안전하게 추출 (Claude가 앞뒤에 부가 설명을 붙이는 경우 대비)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('AI 응답에서 JSON 형식을 찾을 수 없습니다.')
    }

    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json(result)
  } catch (error) {
    console.error('[analyze-clothing]', error)
    const message = error instanceof Error ? error.message : '옷 분석 중 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
