# Gap Analysis: clothing-management

> Design: `docs/02-design/features/clothing-management.design.md`
> Phase: Check
> Date: 2026-02-27
> Match Rate: **95%**

---

## 항목별 분석

### 1. DB 스키마 (clothing_items 테이블)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| 테이블 생성 | clothing_items | console.bkend.ai에서 생성 완료 | ✅ Match |
| 컬럼: user_id (String) | ✅ | ✅ | ✅ Match |
| 컬럼: name (String) | ✅ | ✅ | ✅ Match |
| 컬럼: image_url (String) | ✅ | ✅ | ✅ Match |
| 컬럼: category (String) | ✅ | ✅ | ✅ Match |
| 컬럼: colors (Array) | ✅ | ✅ | ✅ Match |
| 컬럼: style (String) | ✅ | ✅ | ✅ Match |
| 컬럼: seasons (Array) | ✅ | ✅ | ✅ Match |
| 컬럼: is_active (Boolean, default true) | ✅ | ✅ | ✅ Match |

**소계: 9/9 (100%)**

---

### 2. 파일 구조

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| `wardrobe/page.tsx` 수정 | 필터 강화 | ClothingFilter 통합 완료 | ✅ Match |
| `wardrobe/add/page.tsx` 변경 없음 | 유지 | 유지 | ✅ Match |
| `wardrobe/[id]/page.tsx` 신규 | 🆕 | 생성 완료 | ✅ Match |
| `ClothingCard.tsx` 수정 | Link 추가 | Link 래핑 완료 | ✅ Match |
| `ClothingUpload.tsx` 변경 없음 | 유지 | 유지 | ✅ Match |
| `ClothingEditForm.tsx` 신규 | 🆕 | 생성 완료 | ✅ Match |
| `ClothingFilter.tsx` 신규 | 🆕 | 생성 완료 | ✅ Match |
| `useWardrobe.ts` 수정 | update/get 추가 | 추가 완료 | ✅ Match |

**소계: 8/8 (100%)**

---

### 3. useWardrobe 훅 (Design 4-1)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| updateClothing 메서드 | `bkendDB.update` + setItems 갱신 | 동일 구현 | ✅ Match |
| getClothing 메서드 | `bkendDB.get` 반환 | 동일 구현 | ✅ Match |
| fetchItems 필터 지원 | `filter[category]`, `filter[style]` 파라미터 | 동일 구현 | ✅ Match |
| FetchOptions 인터페이스 | category, style, season 필드 | WardrobeFilter로 category, style만 구현 | ⚠️ Minor Gap |
| filter 상태 관리 | Design에 명시 안됨 | `filter` + `setFilter` 상태 추가 (개선) | ✅ Match+ |
| 반환값 | items, loading, add/update/remove/get, refetch | + filter, setFilter 추가 | ✅ Match+ |

**소계: 5.5/6 (92%)**

**Gap 상세:**
- `season` 필터: Design의 FetchOptions에 `season` 필드가 명시되어 있으나 구현에서 누락. bkend Array 필터 제약사항(Design 7절)으로 클라이언트 사이드 폴백이 필요할 수 있어 의도적 생략 가능성 높음.

---

### 4. ClothingFilter 컴포넌트 (Design 4-2)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| Props: category (string \| null) | ✅ | ✅ | ✅ Match |
| Props: style (string \| null) | ✅ | ✅ | ✅ Match |
| Props: onCategoryChange | ✅ | ✅ | ✅ Match |
| Props: onStyleChange | ✅ | ✅ | ✅ Match |
| 카테고리 탭 (전체/상의/하의) | pill 토글 | pill 토글 구현 | ✅ Match |
| 스타일 필터 (캐주얼/포멀/스포츠/스트릿) | pill 토글 | pill 토글 구현 | ✅ Match |
| itemCount prop | Design에 없음 | 추가 구현 (개선) | ✅ Match+ |

**소계: 6/6 (100%)**

---

### 5. ClothingCard 수정 (Design 4-3)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| Link로 카드 감싸기 | `<Link href={/wardrobe/${item.id}}>` | 동일 구현 | ✅ Match |
| 삭제 버튼 유지 | 기존 유지 | e.preventDefault() 추가 + z-10 | ✅ Match |
| 미사용 import 제거 | - | Button import 제거 | ✅ Match |

**소계: 3/3 (100%)**

---

### 6. ClothingEditForm 컴포넌트 (Design 4-5)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| Props: item, onSave, onCancel | ✅ | ✅ | ✅ Match |
| 이름: text input | ✅ | ✅ | ✅ Match |
| 카테고리: upwear/downwear 토글 | ✅ | ✅ | ✅ Match |
| 스타일: 4종 토글 | ✅ | ✅ | ✅ Match |
| 계절: 복수 선택 토글 | ✅ | ✅ | ✅ Match |
| 색상: 콤마 구분 텍스트 → 배열 변환 | ✅ | ✅ | ✅ Match |

**소계: 6/6 (100%)**

---

### 7. 옷 상세/수정 페이지 (Design 4-4)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| 상태: item, editing, loading | ✅ | ✅ | ✅ Match |
| 뒤로 버튼 + 제목 | ✅ | ArrowLeft + item.name | ✅ Match |
| 이미지 크게 표시 | ✅ | aspect-square, rounded-2xl | ✅ Match |
| 상세 정보 (카테고리/스타일/색상/계절) | ✅ | Badge로 각각 표시 | ✅ Match |
| 수정하기 버튼 → editing=true | ✅ | ✅ | ✅ Match |
| 삭제하기 버튼 → confirm → removeClothing | ✅ | ✅ | ✅ Match |
| 수정 모드: ClothingEditForm 렌더링 | ✅ | ✅ | ✅ Match |
| 저장 → updateClothing → 상세 뷰 복귀 | ✅ | ✅ | ✅ Match |
| 취소 → editing=false | ✅ | ✅ | ✅ Match |
| 로딩 스켈레톤 | Design에 없음 | 추가 구현 (개선) | ✅ Match+ |
| 404 처리 | Design에 없음 | 추가 구현 (개선) | ✅ Match+ |

**소계: 9/9 (100%)**

---

### 8. 데이터 플로우 (Design 5절)

| 항목 | Design | 구현 | 판정 |
|------|--------|------|------|
| 옷 추가 플로우 | 사진→분석→확인→업로드→DB저장 | 기존 코드 유지 | ✅ Match |
| 옷 목록 플로우 | useWardrobe→list→필터→refetch | filter/setFilter 상태 연동 | ✅ Match |
| 옷 수정 플로우 | /wardrobe/[id]→get→수정→update→갱신 | 동일 구현 | ✅ Match |
| 옷 삭제 플로우 | 삭제→update(is_active:false)→/wardrobe | 동일 구현 | ✅ Match |

**소계: 4/4 (100%)**

---

## 요약

| 섹션 | 항목 수 | Match | Gap | Match Rate |
|------|---------|-------|-----|------------|
| 1. DB 스키마 | 9 | 9 | 0 | 100% |
| 2. 파일 구조 | 8 | 8 | 0 | 100% |
| 3. useWardrobe 훅 | 6 | 5.5 | 0.5 | 92% |
| 4. ClothingFilter | 6 | 6 | 0 | 100% |
| 5. ClothingCard | 3 | 3 | 0 | 100% |
| 6. ClothingEditForm | 6 | 6 | 0 | 100% |
| 7. 상세/수정 페이지 | 9 | 9 | 0 | 100% |
| 8. 데이터 플로우 | 4 | 4 | 0 | 100% |
| **총계** | **51** | **50.5** | **0.5** | **95%** |

---

## Gap 목록

| # | 항목 | 심각도 | 설명 |
|---|------|--------|------|
| G1 | season 필터 미구현 | Low | Design FetchOptions에 `season` 필드 명시되었으나 WardrobeFilter에 미포함. Design 7절에서 Array 필터의 클라이언트 사이드 폴백 필요성 언급 — bkend.ai Array 필터 제약으로 의도적 생략 가능 |

---

## 개선 사항 (Design 대비 추가 구현)

| # | 항목 | 설명 |
|---|------|------|
| E1 | ClothingFilter.itemCount | 필터 결과 아이템 수 표시 추가 |
| E2 | filter/setFilter 상태 | 훅 레벨에서 필터 상태 관리 (반응적 리패치) |
| E3 | 로딩 스켈레톤 | 상세 페이지 로딩 시 스켈레톤 UI |
| E4 | 404 처리 | 아이템 미발견 시 안내 + 옷장 링크 |

---

## 결론

**Match Rate: 95%** — 90% 기준 통과

모든 핵심 설계 항목이 구현되었으며, 유일한 Gap(season 필터)은 Design 제약사항에서 언급된 Array 필터 제약과 관련된 Low 심각도 항목입니다. 추가로 4개의 개선 사항이 Design 범위를 초과하여 구현되었습니다.
