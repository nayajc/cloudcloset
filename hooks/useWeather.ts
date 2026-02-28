'use client'

import { useState, useEffect, useCallback } from 'react'
import type { WeatherData } from '@/lib/types'
import { useTranslation } from '@/lib/i18n'

export function useWeather() {
  const { language } = useTranslation()
  const [weatherArray, setWeatherArray] = useState<WeatherData[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(() => {
    if (!navigator.geolocation) {
      setError('위치 정보를 사용할 수 없습니다.')
      return
    }

    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}&lang=${language}`
          )
          const data = await res.json()

          if (!res.ok) {
            throw new Error(`날씨 정보를 가져오지 못했습니다. 내역: ${data.error}`)
          }

          if (data.forecasts && data.forecasts.length > 0) {
            setWeatherArray(data.forecasts)
            setWeather(data.forecasts[0])
          } else {
            throw new Error('예보 데이터가 없습니다.')
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('위치 권한이 거부되었습니다. 여길 클릭하여 다시 시도하거나, 브라우저 설정에서 권한을 허용해주세요.')
        setLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather, language])

  return { weatherArray, weather, loading, error, refetch: fetchWeather }
}
