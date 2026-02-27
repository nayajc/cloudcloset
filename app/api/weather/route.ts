import { NextRequest, NextResponse } from 'next/server'

const CONDITION_MAP: Record<string, string> = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '천둥번개',
  Snow: '눈',
  Mist: '안개',
  Fog: '안개',
  Haze: '연무',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: '위치 정보가 필요합니다.' }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const res = await fetch(url, { next: { revalidate: 600 } }) // 10분 캐시
    if (!res.ok) throw new Error('OpenWeatherMap API 오류')

    const data = await res.json()
    const mainCondition = data.weather[0].main as string

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: CONDITION_MAP[mainCondition] ?? mainCondition,
      conditionIcon: data.weather[0].icon,
      location: data.name,
      humidity: data.main.humidity,
    })
  } catch (error) {
    console.error('[weather]', error)
    return NextResponse.json({ error: '날씨 정보를 가져오지 못했습니다.' }, { status: 500 })
  }
}
