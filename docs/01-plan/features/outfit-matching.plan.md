# Plan: Outfit Matching App (CloudCloset)

## Overview

내 옷장 사진 기반 + 날씨 연동 AI 코디 추천 웹앱

- 사용자가 보유한 옷 사진을 등록하면
- 현재 날씨를 자동으로 가져와
- Claude AI가 상의(upwear) + 하의(downwear) 조합 3가지를 추천해주는 서비스

---

## Goals

| # | Goal | Priority |
|---|------|----------|
| G1 | 옷 사진 업로드 → Claude AI 자동 분류 (상의/하의, 색상, 스타일) | High |
| G2 | 날씨 API 연동으로 현재 기온/날씨 상태 가져오기 | High |
| G3 | Claude AI가 옷장 기반 코디 3가지 추천 (upwear + downwear 조합) | High |
| G4 | 추천 결과 저장 및 히스토리 확인 | Medium |
| G5 | 사용자 계정 관리 (내 옷장 개인화) | Medium |

---

## Core Features

### Feature 1: 옷 등록 (Wardrobe)
- 사진 업로드 (드래그&드롭 or 파일 선택)
- Claude Vision으로 자동 분석:
  - **카테고리**: upwear / downwear
  - **색상**: 주요 색상 태그
  - **스타일**: 캐주얼 / 포멀 / 스포츠 등
  - **계절**: 봄/여름/가을/겨울
- 사용자가 분류 수정 가능

### Feature 2: 날씨 연동
- OpenWeatherMap API 사용
- 사용자 위치 기반 (브라우저 Geolocation)
- 표시 정보: 기온(°C), 날씨 상태(맑음/흐림/비 등), 체감온도

### Feature 3: AI 코디 추천
- "오늘의 코디 추천받기" 버튼
- Claude에게 전달:
  - 현재 날씨 데이터 (기온, 날씨)
  - 내 옷장 목록 (카테고리, 색상, 스타일)
  - 상의 3개 + 하의 3개 조합으로 추천 요청
- 결과: 3가지 코디 카드
  - 코디 A: 상의 OO + 하의 OO (추천 이유)
  - 코디 B: 상의 OO + 하의 OO (추천 이유)
  - 코디 C: 상의 OO + 하의 OO (추천 이유)

### Feature 4: 코디 히스토리
- 추천받은 코디 저장
- 날짜별 확인 가능

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 15 (App Router) | 빠른 개발, SSR, API routes 내장 |
| UI | Tailwind CSS + shadcn/ui | 모던 UI 빠르게 구성 |
| Auth + DB + Storage | bkend.ai (BaaS) | 서버 없이 인증/DB/파일저장 한번에 |
| AI (Vision + 추천) | Claude API (claude-3-5-sonnet) | 사진 분석 + 텍스트 추천 모두 가능 |
| 날씨 | OpenWeatherMap API | 무료 tier, 한국 지원 |
| 배포 | Vercel | Next.js 최적화, 무료 |

---

## User Flow

```
[홈] → 날씨 자동 로드 + 내 옷장 요약
  ↓
[옷 추가] → 사진 업로드 → Claude 분석 → 카테고리 확인 → 저장
  ↓
[코디 추천] → "추천받기" 클릭 → Claude 처리 중... → 결과 3개 카드
  ↓
[결과 저장] → 히스토리에 기록
```

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| 홈 | `/` | 날씨 + 오늘의 코디 추천 CTA |
| 옷장 | `/wardrobe` | 내 옷 목록 (그리드) |
| 옷 추가 | `/wardrobe/add` | 사진 업로드 + AI 분류 |
| 코디 추천 | `/recommend` | 추천 결과 3가지 |
| 히스토리 | `/history` | 과거 추천 기록 |
| 로그인 | `/login` | 이메일 로그인 |

---

## Data Models

### ClothingItem
```
id, userId, imageUrl, category(upwear/downwear),
color[], style, season[], name, createdAt
```

### OutfitRecommendation
```
id, userId, weather{temp, condition, location},
outfits[3]{ upwear_id, downwear_id, reason },
date, createdAt
```

---

## AI API Design

### 1. 옷 분석 (Vision)
```
입력: 옷 사진 (base64)
출력: { category, color, style, season, name }
```

### 2. 코디 추천 (Text)
```
입력:
  - weather: { temp, condition }
  - wardrobe: [ { id, category, color, style, season } ]
출력:
  - outfits[3]: [ { upwear_id, downwear_id, reason } ]
```

---

## Development Phases

| Phase | Task | Priority |
|-------|------|----------|
| 1 | 프로젝트 셋업 + 인증 (bkend.ai) | High |
| 2 | 옷 등록 + Claude Vision 분류 | High |
| 3 | 날씨 API 연동 | High |
| 4 | Claude 코디 추천 기능 | High |
| 5 | UI 완성 + 히스토리 | Medium |
| 6 | 배포 (Vercel) | Medium |

---

## Constraints

- Claude API 비용: 사진 분석은 토큰 소모 높음 → 업로드 시 1회만 분석, 결과 DB 저장
- 날씨 API: OpenWeatherMap 무료 티어 (1000 calls/day)
- 이미지 저장: bkend.ai Storage 사용

---

## Success Criteria

- [ ] 옷 사진 업로드 후 10초 내 AI 분류 완료
- [ ] 날씨 데이터 자동 로드 (위치 권한)
- [ ] 추천 3가지 코디 생성 (상의+하의 각각 지정)
- [ ] 모바일 브라우저에서도 사용 가능 (반응형)
