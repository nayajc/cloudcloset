'use client'

import { useWeather } from '@/hooks/useWeather'
import { Cloud, Droplets, Thermometer } from 'lucide-react'

export function WeatherWidget() {
  const { weather, loading, error, refetch } = useWeather()

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-4 text-white animate-pulse">
        <div className="h-4 w-24 bg-white/30 rounded mb-2" />
        <div className="h-8 w-16 bg-white/30 rounded" />
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div
        onClick={() => refetch()}
        className="rounded-2xl bg-gray-100 p-4 text-gray-500 text-sm cursor-pointer hover:bg-gray-200 transition-colors"
      >
        {error ?? '날씨 정보를 불러오는 중... (다시 시도하려면 클릭)'}
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{weather.location}</p>
          <p className="text-4xl font-bold mt-1">{weather.temp}°C</p>
          <p className="text-sm mt-1 opacity-90">{weather.condition}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.conditionIcon}@2x.png`}
          alt={weather.condition}
          className="w-16 h-16"
        />
      </div>
      <div className="flex gap-4 mt-3 text-sm opacity-90">
        <span className="flex items-center gap-1">
          <Thermometer className="w-3 h-3" />
          체감 {weather.feelsLike}°C
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          습도 {weather.humidity}%
        </span>
      </div>
    </div>
  )
}
