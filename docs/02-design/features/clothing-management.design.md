# Design: Clothing Management (옷 관리)

> Plan 참조: `docs/01-plan/features/clothing-management.plan.md`
> Parent Design: `docs/02-design/features/outfit-matching.design.md`
> Phase: Design
> Created: 2026-02-27

---

## 1. DB 스키마 (bkend.ai)

### Table: clothing_items (생성 완료)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | auto | PK | 자동 생성 |
| user_id | String | NOT NULL | 소유자 ID |
| name | String | NOT NULL | 옷 이름 (ex: "흰 면 티셔츠") |
| image_url | String | | bkend.ai Storage URL |
| category | String | NOT NULL | `upwear` \| `downwear` |
| colors | Array | | `["흰색", "회색"]` |
| style | String | | `casual` \| `formal` \| `sport` \| `street` |
| seasons | Array | | `["spring", "fall"]` |
| is_active | Boolean | DEFAULT true | 활성 여부 |
| created_at | auto | | 자동 생성 |

**bkend API 필터링:**
```
GET /v1/data/clothing_items?filter[user_id]={userId}&filter[is_active]=true
GET /v1/data/clothing_items?filter[category]=upwear&filter[style]=casual
GET /v1/data/clothing_items?sort=created_at:desc&page=1&limit=20
```

---

## 2. 파일 구조 (변경사항)

```
app/(main)/wardrobe/
├── page.tsx               # ✅ 기존 — 필터 강화 수정
├── add/
│   └── page.tsx           # ✅ 기존 — 변경 없음
└── [id]/
    └── page.tsx           # 🆕 옷 상세/수정 페이지

components/clothing/
├── ClothingCard.tsx        # ✅ 기존 — 수정 링크 추가
├── ClothingUpload.tsx      # ✅ 기존 — 변경 없음
├── ClothingEditForm.tsx    # 🆕 수정 폼 컴포넌트
└── ClothingFilter.tsx      # 🆕 필터 UI 컴포넌트

hooks/
└── useWardrobe.ts          # ✅ 기존 — updateClothing 추가
```

---

## 3. 기존 코드 현황 (변경 불필요)

| 파일 | 상태 | 비고 |
|------|------|------|
| `lib/types.ts` | ✅ 완료 | ClothingItem, ClothingAnalysis 정의됨 |
| `lib/bkend.ts` | ✅ 완료 | list, get, create, update, delete 모두 있음 |
| `app/api/analyze-clothing/route.ts` | ✅ 완료 | Claude Vision 분석 API |
| `components/clothing/ClothingUpload.tsx` | ✅ 완료 | 업로드 + AI 분석 + 수정 폼 |
| `app/(main)/wardrobe/add/page.tsx` | ✅ 완료 | 옷 추가 페이지 |
| `hooks/useAuth.ts` | ✅ 완료 | 인증 훅 |
| `components/layout/Navbar.tsx` | ✅ 완료 | 하단 탭 네비게이션 |

---

## 4. 신규/수정 설계

### 4-1. useWardrobe 훅 수정 (`hooks/useWardrobe.ts`)

**추가할 메서드:**

```typescript
// 옷 정보 수정
const updateClothing = useCallback(
  async (id: string, updates: Partial<ClothingItem>) => {
    const updated = await bkendDB.update<ClothingItem>('clothing_items', id, updates)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    return updated
  }, []
)

// 단일 아이템 조회
const getClothing = useCallback(
  async (id: string) => {
    return await bkendDB.get<ClothingItem>('clothing_items', id)
  }, []
)
```

**수정할 메서드 — fetchItems 필터 지원:**

```typescript
interface FetchOptions {
  category?: string    // 'upwear' | 'downwear'
  style?: string       // 'casual' | 'formal' | 'sport' | 'street'
  season?: string      // 'spring' | 'summer' | 'fall' | 'winter'
}

const fetchItems = useCallback(async (options?: FetchOptions) => {
  if (!userId) return
  setLoading(true)
  try {
    const params: Record<string, string> = {
      'filter[user_id]': userId,
      'filter[is_active]': 'true',
      sort: 'created_at:desc',
    }
    if (options?.category) params['filter[category]'] = options.category
    if (options?.style) params['filter[style]'] = options.style
    const data = await bkendDB.list<ClothingItem>('clothing_items', params)
    setItems(data)
  } finally {
    setLoading(false)
  }
}, [userId])
```

**반환값 변경:**
```typescript
return {
  items, loading,
  addClothing, updateClothing, removeClothing, getClothing,
  refetch: fetchItems
}
```

---

### 4-2. ClothingFilter 컴포넌트 (`components/clothing/ClothingFilter.tsx`)

**Props:**
```typescript
interface ClothingFilterProps {
  category: string | null       // null = 전체
  style: string | null
  onCategoryChange: (v: string | null) => void
  onStyleChange: (v: string | null) => void
}
```

**UI 구조:**
```
┌────────────────────────────────────┐
│ [전체] [상의] [하의]                 │  ← 카테고리 탭 (기존 로직 추출)
│ [캐주얼] [포멀] [스포츠] [스트릿]     │  ← 스타일 필터 (신규)
└────────────────────────────────────┘
```

- 칩(pill) 형태 토글 버튼
- 카테고리: 단일 선택 (null = 전체)
- 스타일: 단일 선택 (null = 전체)
- 기존 `wardrobe/page.tsx`의 탭 로직을 이 컴포넌트로 추출

---

### 4-3. ClothingCard 수정 (`components/clothing/ClothingCard.tsx`)

**변경사항:**
- 카드 클릭 시 상세 페이지(`/wardrobe/{id}`)로 이동
- 기존 삭제 버튼 유지

```typescript
// 변경: 카드 전체를 Link로 감싸기
<Link href={`/wardrobe/${item.id}`}>
  <div className="group relative rounded-xl ...">
    {/* 기존 내용 */}
  </div>
</Link>
```

---

### 4-4. 옷 상세/수정 페이지 (`app/(main)/wardrobe/[id]/page.tsx`)

**상태:**
```typescript
const [item, setItem] = useState<ClothingItem | null>(null)
const [editing, setEditing] = useState(false)
const [loading, setLoading] = useState(true)
```

**UI 구조:**
```
┌────────────────────────────────────┐
│  ← 뒤로   옷 상세                   │
├────────────────────────────────────┤
│                                    │
│     [ 옷 이미지 (크게) ]            │
│                                    │
├────────────────────────────────────┤
│  이름: 흰 면 티셔츠                  │
│  카테고리: 상의                      │
│  색상: 흰색, 회색                    │
│  스타일: 캐주얼                      │
│  계절: 봄, 여름, 가을                │
├────────────────────────────────────┤
│  [수정하기]          [삭제하기]       │
└────────────────────────────────────┘
```

**수정 모드 (editing=true):**
- ClothingEditForm 컴포넌트 렌더링
- 이름, 카테고리, 스타일, 계절 편집 가능 (색상은 텍스트 입력)
- 저장 → `updateClothing(id, updates)` → 상세 뷰로 복귀
- 취소 → editing=false

---

### 4-5. ClothingEditForm 컴포넌트 (`components/clothing/ClothingEditForm.tsx`)

**Props:**
```typescript
interface ClothingEditFormProps {
  item: ClothingItem
  onSave: (updates: Partial<ClothingItem>) => Promise<void>
  onCancel: () => void
}
```

**UI:**
- ClothingUpload.tsx의 분석 결과 폼과 동일한 UI 재사용
- 이름: text input
- 카테고리: upwear / downwear 토글
- 스타일: casual / formal / sport / street 토글
- 계절: 복수 선택 토글
- 색상: 콤마 구분 텍스트 입력 → 배열 변환

---

### 4-6. Wardrobe 목록 페이지 수정 (`app/(main)/wardrobe/page.tsx`)

**변경사항:**
1. 기존 탭 로직 → ClothingFilter 컴포넌트로 교체
2. 스타일 필터 추가
3. 필터 변경 시 bkend API 서버사이드 필터링

**상태:**
```typescript
const [category, setCategory] = useState<string | null>(null)
const [style, setStyle] = useState<string | null>(null)
```

---

## 5. 데이터 플로우

```
[옷 추가]
  사진 선택 → /api/analyze-clothing (Claude Vision)
  → 분류 확인/수정 → bkendStorage.upload() → bkendDB.create()
  → 목록 갱신

[옷 목록]
  useWardrobe(userId) → bkendDB.list('clothing_items', filters)
  → ClothingFilter로 필터 변경 → refetch(options)

[옷 수정]
  /wardrobe/[id] → bkendDB.get() → 상세 표시
  → "수정" 클릭 → ClothingEditForm
  → 저장 → bkendDB.update() → 상세 뷰 갱신

[옷 삭제]
  "삭제" 클릭 → bkendDB.update(id, {is_active: false})
  → /wardrobe로 이동
```

---

## 6. 구현 순서

```
Step 1: useWardrobe 훅 확장
  □ updateClothing 메서드 추가
  □ getClothing 메서드 추가
  □ fetchItems 필터 파라미터 지원

Step 2: ClothingFilter 컴포넌트 생성
  □ 카테고리 + 스타일 필터 UI
  □ wardrobe/page.tsx에 적용

Step 3: wardrobe/page.tsx 수정
  □ ClothingFilter 통합
  □ 서버사이드 필터링 연결

Step 4: ClothingCard 수정
  □ 카드 클릭 → /wardrobe/[id] 링크

Step 5: ClothingEditForm 컴포넌트 생성
  □ 이름/카테고리/스타일/계절/색상 편집 폼

Step 6: 옷 상세/수정 페이지 생성
  □ /wardrobe/[id]/page.tsx
  □ 상세 뷰 + 수정 모드 전환
  □ 삭제 확인 + 실행
```

---

## 7. 제약사항

- bkend.ai 필터링: `filter[field]=value` 형식만 지원, 복합 조건(AND)은 쿼리 파라미터 병렬로 처리
- Array 필터링 (colors, seasons): bkend.ai의 Array 필터 지원 여부에 따라 클라이언트 사이드 필터 폴백
- 이미지 변경: MVP에서는 미지원 (이미지 교체 시 새로 등록)
