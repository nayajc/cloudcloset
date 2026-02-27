# Design: Outfit Matching App (CloudCloset)

> Plan 참조: `docs/01-plan/features/outfit-matching.plan.md`
> Backend: bkend.ai | AI: Claude API | Frontend: Next.js 15

---

## 1. 프로젝트 구조 (File Structure)

```
cloudcloset/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx           # 로그인 페이지
│   ├── (main)/
│   │   ├── layout.tsx             # 메인 레이아웃 (nav, auth guard)
│   │   ├── page.tsx               # 홈 (날씨 + CTA)
│   │   ├── wardrobe/
│   │   │   ├── page.tsx           # 옷장 목록
│   │   │   └── add/
│   │   │       └── page.tsx       # 옷 추가 (업로드)
│   │   ├── recommend/
│   │   │   └── page.tsx           # 코디 추천 결과
│   │   └── history/
│   │       └── page.tsx           # 추천 히스토리
│   └── api/
│       ├── analyze-clothing/
│       │   └── route.ts           # Claude Vision - 옷 분석
│       ├── recommend-outfit/
│       │   └── route.ts           # Claude - 코디 추천
│       └── weather/
│           └── route.ts           # OpenWeatherMap 프록시
├── components/
│   ├── ui/                        # shadcn/ui 기본 컴포넌트
│   ├── clothing/
│   │   ├── ClothingCard.tsx       # 옷 카드 (그리드용)
│   │   ├── ClothingUpload.tsx     # 파일 업로드 + 미리보기
│   │   └── ClothingForm.tsx       # 분류 수정 폼
│   ├── outfit/
│   │   ├── OutfitCard.tsx         # 코디 추천 카드 (A/B/C)
│   │   └── OutfitHistory.tsx      # 히스토리 아이템
│   ├── weather/
│   │   └── WeatherWidget.tsx      # 날씨 위젯
│   └── layout/
│       └── Navbar.tsx             # 상단 네비게이션
├── lib/
│   ├── bkend.ts                   # bkend.ai 클라이언트 초기화
│   ├── claude.ts                  # Claude API 클라이언트
│   ├── weather.ts                 # 날씨 API 유틸
│   └── types.ts                   # TypeScript 타입 정의
├── hooks/
│   ├── useAuth.ts                 # 인증 상태 훅
│   ├── useWardrobe.ts             # 옷장 CRUD 훅
│   └── useWeather.ts              # 날씨 데이터 훅
└── .env.local
    # BKEND_URL, BKEND_KEY
    # ANTHROPIC_API_KEY
    # OPENWEATHERMAP_API_KEY
```

---

## 2. bkend.ai 스키마 (DB Tables)

### Table: clothing_items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, auto | 고유 ID |
| user_id | uuid | FK → users, NOT NULL | 소유자 |
| name | varchar(100) | NOT NULL | 옷 이름 (ex: "흰 면 티셔츠") |
| image_url | text | NOT NULL | bkend.ai Storage URL |
| category | enum | NOT NULL | 'upwear' \| 'downwear' |
| colors | text[] | NOT NULL | ["흰색", "회색"] |
| style | varchar(50) | NOT NULL | 'casual' \| 'formal' \| 'sport' \| 'street' |
| seasons | text[] | NOT NULL | ["spring", "fall"] |
| is_active | boolean | DEFAULT true | 사용 여부 (삭제 대신 비활성화) |
| created_at | timestamp | DEFAULT now() | 생성일 |

### Table: outfit_recommendations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, auto | 고유 ID |
| user_id | uuid | FK → users, NOT NULL | 요청자 |
| weather_temp | float | NOT NULL | 기온 (°C) |
| weather_condition | varchar(50) | NOT NULL | "맑음", "흐림", "비" 등 |
| weather_location | varchar(100) | | 위치명 |
| outfits | jsonb | NOT NULL | 추천 3개 (아래 구조 참조) |
| created_at | timestamp | DEFAULT now() | 추천 일시 |

**outfits JSON 구조:**
```json
[
  {
    "label": "A",
    "upwear_id": "uuid",
    "upwear_name": "흰 면 티셔츠",
    "upwear_image": "https://...",
    "downwear_id": "uuid",
    "downwear_name": "청바지",
    "downwear_image": "https://...",
    "reason": "15도의 선선한 날씨에 가볍게 입기 좋은 캐주얼 조합입니다."
  },
  { "label": "B", ... },
  { "label": "C", ... }
]
```

---

## 3. bkend.ai Auth 설정

```
인증 방식: 이메일 + 비밀번호 (email/password)
소셜 로그인: 미사용 (MVP)

보호 규칙 (RLS):
- clothing_items: user_id = 현재 사용자만 CRUD 가능
- outfit_recommendations: user_id = 현재 사용자만 읽기/쓰기
```

### 인증 흐름

```
[로그인 페이지]
  → bkend.auth.signIn({ email, password })
  → Access Token 저장 (localStorage)
  → 홈으로 리다이렉트

[보호된 페이지]
  → useAuth() 훅으로 토큰 확인
  → 미인증 시 /login 리다이렉트
```

---

## 4. bkend.ai Storage 설정

```
버킷: clothing-images
가시성: protected (인증된 사용자만 자신의 파일 접근)
파일 형식: image/jpeg, image/png, image/webp
최대 크기: 10MB
경로 규칙: {user_id}/{uuid}.{ext}
```

### 업로드 흐름

```
1. 클라이언트: 파일 선택
2. bkend.storage.upload(file, path) → Presigned URL로 업로드
3. 반환된 URL을 Claude Vision API에 전달 (또는 base64 변환)
4. Claude 분석 결과 받기
5. clothing_items 테이블에 저장
```

---

## 5. API Routes 설계 (Next.js)

### POST /api/analyze-clothing

**목적**: 옷 사진 → Claude Vision 분석

**Request:**
```typescript
{
  imageBase64: string,  // base64 인코딩된 이미지
  mimeType: "image/jpeg" | "image/png" | "image/webp"
}
```

**Response:**
```typescript
{
  name: string,          // "흰 면 티셔츠"
  category: "upwear" | "downwear",
  colors: string[],      // ["흰색"]
  style: string,         // "casual"
  seasons: string[]      // ["spring", "summer", "fall"]
}
```

**Claude Prompt:**
```
당신은 패션 전문가입니다. 주어진 옷 사진을 분석하여 JSON 형식으로 응답하세요.

응답 형식 (JSON만 반환):
{
  "name": "옷 이름 (예: 흰 면 티셔츠, 청바지)",
  "category": "upwear 또는 downwear",
  "colors": ["주요 색상 (한국어)"],
  "style": "casual / formal / sport / street 중 하나",
  "seasons": ["spring", "summer", "fall", "winter 중 해당되는 것"]
}
```

---

### POST /api/recommend-outfit

**목적**: 날씨 + 옷장 → Claude 코디 추천 3가지

**Request:**
```typescript
{
  weather: {
    temp: number,        // 15.2
    condition: string,   // "맑음"
    feelsLike: number    // 13.5
  },
  wardrobe: {
    upwears: ClothingItem[],
    downwears: ClothingItem[]
  }
}
```

**Response:**
```typescript
{
  outfits: [
    {
      label: "A" | "B" | "C",
      upwear_id: string,
      upwear_name: string,
      upwear_image: string,
      downwear_id: string,
      downwear_name: string,
      downwear_image: string,
      reason: string
    }
  ]
}
```

**Claude Prompt:**
```
당신은 패션 스타일리스트입니다.
오늘의 날씨와 사용자의 옷장을 기반으로 코디 3가지를 추천해주세요.

[오늘의 날씨]
- 기온: {temp}°C (체감: {feelsLike}°C)
- 날씨: {condition}

[내 옷장 - 상의]
{upwears.map(item => `- ID: ${item.id} | ${item.name} | 색상: ${item.colors.join(', ')} | 스타일: ${item.style} | 계절: ${item.seasons.join(', ')}`)}

[내 옷장 - 하의]
{downwears.map(item => `- ID: ${item.id} | ${item.name} | 색상: ${item.colors.join(', ')} | 스타일: ${item.style} | 계절: ${item.seasons.join(', ')}`)}

규칙:
1. 날씨와 기온에 적합한 조합 선택
2. 색상 조화를 고려할 것
3. 스타일 일관성 유지
4. 각 코디마다 추천 이유 1-2문장

응답 형식 (JSON만 반환):
{
  "outfits": [
    {
      "label": "A",
      "upwear_id": "...",
      "downwear_id": "...",
      "reason": "..."
    },
    { "label": "B", ... },
    { "label": "C", ... }
  ]
}
```

---

### GET /api/weather

**목적**: OpenWeatherMap 프록시 (API 키 보호)

**Query:** `?lat=37.5665&lon=126.9780`

**Response:**
```typescript
{
  temp: number,          // 15.2
  feelsLike: number,     // 13.5
  condition: string,     // "맑음"
  conditionIcon: string, // "01d"
  location: string,      // "Seoul"
  humidity: number       // 65
}
```

---

## 6. TypeScript 타입 정의 (lib/types.ts)

```typescript
export type ClothingCategory = 'upwear' | 'downwear'
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
  is_active: boolean
  created_at: string
}

export interface OutfitCombo {
  label: 'A' | 'B' | 'C'
  upwear_id: string
  upwear_name: string
  upwear_image: string
  downwear_id: string
  downwear_name: string
  downwear_image: string
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
}
```

---

## 7. 컴포넌트 설계

### ClothingUpload.tsx

```
상태:
  - file: File | null
  - preview: string (ObjectURL)
  - isAnalyzing: boolean
  - analysisResult: AnalysisResult | null

흐름:
  1. 파일 선택/드롭 → preview 표시
  2. "AI 분석" 버튼 → /api/analyze-clothing 호출
  3. 로딩 스피너 표시 (10초 내외)
  4. 결과 표시 → 수정 가능한 폼
  5. "저장" → bkend.ai Storage 업로드 + DB 저장
```

### OutfitCard.tsx

```
Props:
  - outfit: OutfitCombo
  - label: 'A' | 'B' | 'C'

표시:
  ┌─────────────────────────┐
  │  코디 A                  │
  │  [상의 이미지] [하의 이미지] │
  │  흰 티셔츠 + 청바지        │
  │  "15도 맑은 날 캐주얼..."  │
  └─────────────────────────┘
```

### WeatherWidget.tsx

```
표시:
  ┌─────────────────┐
  │  서울 ☀️         │
  │  15°C           │
  │  체감 13°C      │
  │  습도 65%       │
  └─────────────────┘

초기화: useEffect → navigator.geolocation → /api/weather
```

---

## 8. 환경변수 (.env.local)

```bash
# bkend.ai
NEXT_PUBLIC_BKEND_URL=https://api.bkend.ai
NEXT_PUBLIC_BKEND_KEY=your_bkend_api_key

# Claude API (서버에서만 사용)
ANTHROPIC_API_KEY=sk-ant-...

# OpenWeatherMap (서버에서만 사용)
OPENWEATHERMAP_API_KEY=your_owm_key
```

---

## 9. 의존성 목록

```bash
# 프레임워크
next@15, react@19, typescript

# UI
tailwindcss, @shadcn/ui, lucide-react

# bkend.ai SDK
@bknd/client

# AI
@anthropic-ai/sdk

# 유틸
clsx, tailwind-merge
```

---

## 10. 구현 순서 (Do Phase 참고)

```
Step 1: 프로젝트 초기화
  □ npx create-next-app@latest cloudcloset
  □ Tailwind + shadcn/ui 설정
  □ bkend.ai SDK 설치 및 초기화
  □ 환경변수 설정

Step 2: bkend.ai 설정
  □ clothing_items 테이블 생성
  □ outfit_recommendations 테이블 생성
  □ clothing-images 스토리지 버킷 생성
  □ 이메일 인증 활성화
  □ RLS 정책 설정

Step 3: 인증
  □ /login 페이지 구현
  □ useAuth 훅 구현
  □ 메인 레이아웃 Auth Guard 적용

Step 4: 옷 등록
  □ /api/analyze-clothing 라우트
  □ ClothingUpload 컴포넌트
  □ /wardrobe/add 페이지

Step 5: 날씨 연동
  □ /api/weather 라우트
  □ WeatherWidget 컴포넌트
  □ useWeather 훅

Step 6: 코디 추천
  □ /api/recommend-outfit 라우트
  □ OutfitCard 컴포넌트
  □ /recommend 페이지

Step 7: 옷장 + 히스토리
  □ /wardrobe 페이지 (그리드)
  □ /history 페이지
  □ 홈 페이지 완성

Step 8: 배포
  □ Vercel 배포
  □ 환경변수 설정
```
