export type ClothingCategory = 'upwear' | 'downwear' | 'onepiece'
export type ClothingStyle = 'casual' | 'formal' | 'sport' | 'street'
export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export interface ClothingItem {
  id: string
  user_id: string
  name: string
  image_url: string
  category: ClothingCategory
  colors: string[]
  style: ClothingStyle
  seasons: Season[]
  location?: string | null
  is_active: boolean
  created_at: string
}

export interface OutfitCombo {
  label: 'A' | 'B' | 'C'
  upwear_id?: string
  upwear_name?: string
  upwear_image?: string
  downwear_id?: string
  downwear_name?: string
  downwear_image?: string
  onepiece_id?: string
  onepiece_name?: string
  onepiece_image?: string
  reason: string
}

export interface OutfitRecommendation {
  id: string
  user_id: string
  weather_temp: number
  weather_condition: string
  weather_location: string
  outfits: OutfitCombo[]
  created_at: string
}

export interface WeatherData {
  temp: number
  feelsLike: number
  condition: string
  conditionIcon: string
  location: string
  humidity: number
  dateStr: string // ISO date string (YYYY-MM-DD)
}

export interface ClothingAnalysis {
  name: string
  category: ClothingCategory
  colors: string[]
  style: ClothingStyle
  seasons: Season[]
  location?: string | null
}
