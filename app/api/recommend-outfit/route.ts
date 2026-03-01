import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'
import type { ClothingItem, WeatherData } from '@/lib/types'

// Define types for preferences
interface UserPreferences {
  gender?: 'male' | 'female' | 'unisex';
  ageGroup?: 'teenager' | '20s' | '30s' | '40s' | '50s+' | 'all';
  preferredStyles?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: {
      weather: WeatherData;
      wardrobe: { upwears: ClothingItem[]; downwears: ClothingItem[], onepieces: ClothingItem[] };
      preferences?: UserPreferences;
      language?: 'ko' | 'en';
    } = await req.json();

    const { weather, wardrobe, preferences, language = 'ko' } = body;

    // Build the preference string
    let preferenceInstruction = '';
    if (preferences && (preferences.gender || preferences.ageGroup || (preferences.preferredStyles && preferences.preferredStyles.length > 0))) {
      preferenceInstruction = `\n\n=== USER PREFERENCES ===\n`;
      if (preferences.gender) preferenceInstruction += `- Gender: ${preferences.gender}\n`;
      if (preferences.ageGroup) preferenceInstruction += `- Age Group: ${preferences.ageGroup}\n`;
      if (preferences.preferredStyles && preferences.preferredStyles.length > 0) {
        preferenceInstruction += `- Preferred Styles: ${preferences.preferredStyles.join(', ')}\n`;
      }
      preferenceInstruction += `IMPORTANT: When recommending outfits, strongly consider these user preferences. The generated style, tone, and rationale should distinctly reflect their gender, age group, and favored styles.\n`;
    }

    if (!weather || !wardrobe) {
      return NextResponse.json({ error: '날씨와 옷장 정보가 필요합니다.' }, { status: 400 })
    }

    // Ensure wardrobe items are arrays, defaulting to empty if undefined
    const { upwears = [], downwears = [], onepieces = [] } = wardrobe;

    if ((upwears.length === 0 || downwears.length === 0) && onepieces.length === 0) {
      return NextResponse.json(
        { error: '상의 1개+하의 1개, 또는 원피스 1개 이상이 필요합니다.' },
        { status: 400 }
      )
    }

    const upwearList = upwears
      .map((i) => `- ID: ${i.id} | ${i.name} | 색상: ${i.colors.join(', ')} | 스타일: ${i.style} | 계절: ${i.seasons.join(', ')}`)
      .join('\n')

    const downwearList = downwears
      .map((i) => `- ID: ${i.id} | ${i.name} | 색상: ${i.colors.join(', ')} | 스타일: ${i.style} | 계절: ${i.seasons.join(', ')}`)
      .join('\n')

    const onepieceList = onepieces
      .map((i) => `- ID: ${i.id} | ${i.name} | 색상: ${i.colors.join(', ')} | 스타일: ${i.style} | 계절: ${i.seasons.join(', ')}`)
      .join('\n')

    const prompt = language === 'ko'
      ? `당신은 패션 스타일리스트입니다. 오늘의 날씨와 사용자의 옷장을 보고 코디 3가지를 추천해주세요. JSON만 응답하세요.

[오늘의 날씨]
- 기온: ${weather.temp}°C (체감: ${weather.feelsLike}°C)
- 날씨: ${weather.condition}
- 습도: ${weather.humidity}%

<clothes-data>
[내 옷장 - 상의]
${upwearList || '(없음)'}

[내 옷장 - 하의]
${downwearList || '(없음)'}

[내 옷장 - 원피스]
${onepieceList || '(없음)'}
</clothes-data>
${preferenceInstruction}
Output MUST be a valid JSON matching this schema:
{
  "outfits": [
    { "label": "A", "upwear_id": "uuid or null", "downwear_id": "uuid or null", "onepiece_id": "uuid or null", "reason": "한국어로 이 조합이 좋은 이유 설명" },
    { "label": "B", "upwear_id": "uuid or null", "downwear_id": "uuid or null", "onepiece_id": "uuid or null", "reason": "한국어로 설명" },
    { "label": "C", "upwear_id": "uuid or null", "downwear_id": "uuid or null", "onepiece_id": "uuid or null", "reason": "한국어로 설명" }
  ]
}

각 코디는 고유해야 하고, 날씨에 적합하며, 사용자 취향을 반영해야 합니다.
Returns exactly 3 outfits (A, B, C).
reason 필드 규칙:
- 반드시 한국어로, 왜 이 조합이 오늘 날씨에 잘 어울리는지 정중하고 자연스럽게 설명해주세요 (예: ~해서 ~하기 좋습니다).
- 날씨 상태를 반드시 언급하세요.`
      : `You are a fashion stylist. Based on today's weather and the user's wardrobe, recommend 3 outfit combinations. Respond with JSON only.

[Today's Weather]
- Temperature: ${weather.temp}°C (Feels like: ${weather.feelsLike}°C)
- Condition: ${weather.condition}
- Humidity: ${weather.humidity}%

<clothes-data>
[Wardrobe - Tops]
${upwearList || '(none)'}

[Wardrobe - Bottoms]
${downwearList || '(none)'}

[Wardrobe - One-pieces]
${onepieceList || '(none)'}
</clothes-data>
${preferenceInstruction}
Output MUST be a valid JSON matching this schema:
{
  "outfits": [
    { "label": "A", "upwear_id": "uuid or null", "downwear_id": "uuid or null", "onepiece_id": "uuid or null", "reason": "Explain in English why this combination works" },
    { "label": "B", "upwear_id": "uuid or null", "downwear_id": "uuid or null", "onepiece_id": "uuid or null", "reason": "English explanation" },
    { "label": "C", "upwear_id": "uuid or null", "downwear_id": "uuid or null", "onepiece_id": "uuid or null", "reason": "English explanation" }
  ]
}

Ensure each outfit is unique, weather-appropriate, and reflects the user's preferences.
Returns exactly 3 outfits (A, B, C).
Rules for the reason field:
- Explain in English why these specific items work well together for the current weather.
- Use a friendly, professional fashion styling tone.
- Mention the weather condition explicitly.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
    const { outfits } = JSON.parse(cleaned)

    const enriched = outfits.map((o: { label: string; upwear_id?: string; downwear_id?: string; onepiece_id?: string; reason: string }) => {
      const up = wardrobe.upwears.find((i) => i.id === o.upwear_id)
      const down = wardrobe.downwears.find((i) => i.id === o.downwear_id)
      const onep = wardrobe.onepieces.find((i) => i.id === o.onepiece_id)
      return {
        ...o,
        upwear_name: up?.name ?? '',
        upwear_image: up?.image_url ?? '',
        upwear_location: up?.location ?? null,
        upwear_color: up?.colors?.join(', ') ?? '',
        upwear_style: up?.style ?? '',
        downwear_name: down?.name ?? '',
        downwear_image: down?.image_url ?? '',
        downwear_location: down?.location ?? null,
        downwear_color: down?.colors?.join(', ') ?? '',
        downwear_style: down?.style ?? '',
        onepiece_name: onep?.name ?? '',
        onepiece_image: onep?.image_url ?? '',
        onepiece_location: onep?.location ?? null,
        onepiece_color: onep?.colors?.join(', ') ?? '',
        onepiece_style: onep?.style ?? '',
      }
    })

    return NextResponse.json({ outfits: enriched })
  } catch (error) {
    console.error('[recommend-outfit]', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
