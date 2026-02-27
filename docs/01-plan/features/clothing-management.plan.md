# Plan: Clothing Management (옷 관리)

> Feature: clothing-management
> Parent: outfit-matching (CloudCloset)
> Phase: Plan
> Created: 2026-02-27

---

## Overview

사용자의 옷장을 관리하는 핵심 기능. 옷 사진 업로드, AI 자동 분류, CRUD, 필터/검색 기능을 포함한다.

---

## Goals

| # | Goal | Priority |
|---|------|----------|
| G1 | bkend.ai에 clothing_items 테이블 생성 (DB 스키마 구축) | Critical |
| G2 | 옷 등록: 사진 업로드 + Claude Vision AI 자동 분류 | High |
| G3 | 옷장 목록: 카테고리/스타일/계절 필터, 검색 | High |
| G4 | 옷 수정: 분류 정보(이름, 카테고리, 색상, 스타일, 계절) 편집 | Medium |
| G5 | 옷 삭제: 소프트 삭제(is_active=false) + 복원 기능 | Medium |

---

## Current Status (이미 구현된 것)

| 항목 | 상태 | 파일 |
|------|------|------|
| TypeScript 타입 정의 | ✅ 완료 | `lib/types.ts` |
| bkend.ai REST 클라이언트 | ✅ 완료 | `lib/bkend.ts` |
| 옷 분석 API (Claude Vision) | ✅ 완료 | `app/api/analyze-clothing/route.ts` |
| 옷 업로드 컴포넌트 | ✅ 완료 | `components/clothing/ClothingUpload.tsx` |
| 옷 카드 컴포넌트 | ✅ 완료 | `components/clothing/ClothingCard.tsx` |
| 옷장 목록 페이지 | ✅ 완료 | `app/(main)/wardrobe/page.tsx` |
| 옷 추가 페이지 | ✅ 완료 | `app/(main)/wardrobe/add/page.tsx` |
| useWardrobe 훅 (list/add/remove) | ✅ 완료 | `hooks/useWardrobe.ts` |

---

## Remaining Tasks (구현 필요)

### Task 1: bkend.ai clothing_items 테이블 생성 [Critical]

**DB 스키마:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | auto | PK | 자동 생성 |
| user_id | String | NOT NULL | 소유자 ID |
| name | String | NOT NULL | 옷 이름 |
| image_url | String | | Storage URL |
| category | String | NOT NULL | 'upwear' / 'downwear' |
| colors | Array | | 색상 태그 배열 |
| style | String | | 'casual' / 'formal' / 'sport' / 'street' |
| seasons | Array | | 계절 태그 배열 |
| is_active | Boolean | DEFAULT true | 활성 여부 |
| created_at | auto | | 자동 생성 |

**방법:** bkend MCP 인증 후 테이블 생성 또는 console.bkend.ai에서 직접 생성

### Task 2: 옷 수정 기능 [Medium]

- 옷 상세 페이지: `/wardrobe/[id]` (또는 모달)
- 이름, 카테고리, 색상, 스타일, 계절 편집 가능
- `bkendDB.update('clothing_items', id, {...})` 호출
- useWardrobe 훅에 `updateClothing` 메서드 추가

### Task 3: 필터/검색 강화 [Medium]

- 현재: 카테고리 탭(전체/상의/하의)만 존재
- 추가: 스타일별 필터 (캐주얼/포멀/스포츠/스트릿)
- 추가: 계절별 필터 (봄/여름/가을/겨울)
- 추가: 이름 텍스트 검색
- bkend API 필터 파라미터 활용

### Task 4: 비활성 옷 관리 [Low]

- 삭제된(is_active=false) 옷 복원 기능
- 관리 UI (선택적)

---

## Data Flow

```
[사진 업로드] → [Claude Vision 분석] → [분류 확인/수정] → [bkend Storage 업로드] → [clothing_items DB 저장]
                                                                                        ↓
[옷장 목록] ← [bkendDB.list('clothing_items')] ← [필터/검색 파라미터]
                    ↓
[옷 수정] → [bkendDB.update()] → [목록 갱신]
[옷 삭제] → [bkendDB.update(is_active: false)] → [목록에서 제거]
```

---

## Dependencies

- bkend.ai MCP 인증 (테이블 생성용)
- bkend.ai Auth (사용자 인증, RLS)
- Claude API (옷 이미지 분석)
- bkend.ai Storage (이미지 업로드)

---

## Success Criteria

- [x] clothing_items 테이블이 bkend.ai에 생성됨 (console.bkend.ai)
- [ ] 옷 사진 업로드 → AI 분류 → DB 저장 전체 플로우 동작
- [ ] 옷장 목록에서 카테고리/스타일/계절 필터 동작
- [ ] 옷 정보 수정 가능
- [ ] 소프트 삭제 및 목록에서 즉시 반영

---

## Implementation Priority

```
[1] 테이블 생성 (Critical - 다른 모든 작업의 전제)
     ↓
[2] 기존 코드 테스트 (업로드 → 저장 → 목록 확인)
     ↓
[3] 옷 수정 기능
     ↓
[4] 필터/검색 강화
     ↓
[5] 비활성 옷 관리
```
