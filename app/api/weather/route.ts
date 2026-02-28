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
    // 5-day / 3-hour forecast API
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    const res = await fetch(url, { next: { revalidate: 600 } })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`OpenWeatherMap API 오류: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    const locationName = data.city.name

    // 오늘부터 +4일까지 총 5일의 데이터를 대표값으로 추출합니다.
    // 보통 낮(12:00 ~ 15:00) 데이터를 그 날의 대표 날씨로 사용합니다.
    const dailyForecasts = new Map<string, any>()

    for (const item of data.list) {
      // item.dt_txt format: "YYYY-MM-DD HH:mm:ss"
      const dateStr = item.dt_txt.split(' ')[0]
      const hourStr = item.dt_txt.split(' ')[1]

      // 아직 해당 날짜의 데이터가 없거나, 시간이 낮 12:00에 더 가까운 12:00:00 일 때 덮어씌움
      if (!dailyForecasts.has(dateStr) || hourStr === '12:00:00') {
        dailyForecasts.set(dateStr, item)
      }
    }

    // Map을 배열로 변환하고 오늘부터 5일 치만 남김
    const forecastArray = Array.from(dailyForecasts.entries())
      .slice(0, 5)
      .map(([dateStr, item]) => {
        const mainCondition = item.weather[0].main as string
        return {
          temp: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          condition: CONDITION_MAP[mainCondition] ?? mainCondition,
          conditionIcon: item.weather[0].icon,
          location: locationName,
          humidity: item.main.humidity,
          dateStr,
        }
      })

    return NextResponse.json({
      forecasts: forecastArray
    })
  } catch (error) {
    console.error('[weather]', error)
    const errObj = error as Error
    return NextResponse.json({ error: errObj.message ?? '날씨 정보를 가져오지 못했습니다.' }, { status: 500 })
  }
}
