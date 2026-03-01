import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini for text prompt generation if API key is present
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

export async function POST(req: NextRequest) {
    try {
        const { outfit } = await req.json()

        if (!outfit) {
            return NextResponse.json({ error: '코디 정보가 필요합니다.' }, { status: 400 })
        }

        if (!process.env.GEMINI_API_KEY || !genAI) {
            return NextResponse.json({ error: '서버에 GEMINI_API_KEY가 설정되지 않았습니다.' }, { status: 500 })
        }

        // Step 1: Create a highly detailed fashion prompt using Gemini text model
        const promptModel = genAI.getGenerativeModel({ model: 'nano-banana-pro-preview' })
        const stylingPrompt = `
You are an expert fashion photographer and stylist. Create a highly detailed, photorealistic image prompt for a fashion model wearing an outfit based on these items:
- Top: ${outfit.upwear_name} (Color: ${outfit.upwear_color || 'any'}, Style: ${outfit.upwear_style || 'any'})
- Bottom: ${outfit.downwear_name} (Color: ${outfit.downwear_color || 'any'}, Style: ${outfit.downwear_style || 'any'})
${outfit.onepiece_name ? `- One-piece: ${outfit.onepiece_name} (Color: ${outfit.onepiece_color || 'any'}, Style: ${outfit.onepiece_style || 'any'})` : ''}

Output ONLY the English prompt string for an image generation model like Imagen. The prompt should describe a photorealistic, fashion editorial style, full body shot of a model wearing these specific clothes with a neutral or street background. DO NOT output any other text or markdown.
`
        const textResult = await promptModel.generateContent(stylingPrompt)
        let imagePrompt = textResult.response.text().trim()

        // Step 2: Request Image Generation via Gemini REST API (Imagen 4)
        const imagenResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    instances: [{ prompt: imagePrompt }],
                    parameters: { sampleCount: 1 }
                })
            }
        )

        if (!imagenResponse.ok) {
            const errText = await imagenResponse.text()
            console.error('[imagen-error]', errText)
            throw new Error('이미지 생성 API 호출에 실패했습니다.')
        }

        const imagenData = await imagenResponse.json()
        // The Gemini Imagen API typically returns base64 in predictions[0].bytesBase64Encoded
        const base64Image = imagenData?.predictions?.[0]?.bytesBase64Encoded

        if (!base64Image) {
            throw new Error('이미지 데이터를 받지 못했습니다.')
        }

        return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${base64Image}` })
    } catch (error) {
        console.error('[generate-preview]', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '미리보기 이미지 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}
