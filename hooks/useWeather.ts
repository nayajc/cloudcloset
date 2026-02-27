'use client'

import { useState, useEffect } from 'react'
import type { WeatherData } from '@/lib/types'

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보를 사용할 수 없습니다.')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`
          )
          if (!res.ok) throw new Error('날씨 정보를 가져오지 못했습니다.')
          const data: WeatherData = await res.json()
          setWeather(data)
        } catch (e) {
          setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('위치 권한이 거부되었습니다.')
        setLoading(false)
      }
    )
  }, [])

  return { weather, loading, error }
}
