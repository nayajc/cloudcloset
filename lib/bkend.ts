/**
 * bkend.ai REST Service API 클라이언트
 * Base URL: https://api.bkend.ai/v1
 * Docs: https://github.com/popup-studio-ai/bkend-docs
 *
 * 필수 헤더:
 *   x-project-id: 프로젝트 ID (console.bkend.ai에서 확인)
 *   x-environment: dev | staging | prod
 *   Authorization: Bearer {accessToken}  (인증 필요 엔드포인트)
 */

const API_BASE = 'https://api.bkend.ai/v1'
const PROJECT_ID = process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!
const ENVIRONMENT = process.env.NEXT_PUBLIC_BKEND_ENV || 'dev'

// ── Token 관리 ───────────────────────────────────────────────────────────────

const TOKEN_KEY = 'bkend_access_token'
const REFRESH_KEY = 'bkend_refresh_token'

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

function saveTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
}

function clearTokens() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

// ── Base Fetch ───────────────────────────────────────────────────────────────

async function bkendFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-project-id': PROJECT_ID,
      'x-environment': ENVIRONMENT,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }

  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────────────────────

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: { id: string; email: string }
}

export const bkendAuth = {
  /**
   * 이메일 회원가입 (Next.js proxy → bkend.ai, CORS 방지)
   */
  async signUp(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
    saveTokens(data.accessToken, data.refreshToken)
    return data
  },

  /**
   * 이메일 로그인 (Next.js proxy → bkend.ai, CORS 방지)
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
    saveTokens(data.accessToken, data.refreshToken)
    return data
  },

  /**
   * 현재 로그인 사용자 정보 (Next.js proxy → bkend.ai)
   */
  async getUser(): Promise<{ id: string; email: string } | null> {
    try {
      const token = getAccessToken()
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  },

  /**
   * Access Token 갱신 (Next.js proxy → bkend.ai)
   */
  async refresh(): Promise<boolean> {
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem(REFRESH_KEY)
        : null
    if (!refreshToken) return false
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      saveTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      clearTokens()
      return false
    }
  },

  /**
   * 로그아웃 (Next.js proxy → bkend.ai)
   */
  async signOut(): Promise<void> {
    try {
      const token = getAccessToken()
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } finally {
      clearTokens()
    }
  },

  getToken(): string | null {
    return getAccessToken()
  },

  isAuthenticated(): boolean {
    return !!getAccessToken()
  },
}

// ── Database (Data CRUD) ──────────────────────────────────────────────────────

interface ListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export const bkendDB = {
  /**
   * 목록 조회
   * GET /v1/data/{table}
   * 필터: ?filter[field]=value, 정렬: ?sort=field:asc, 페이지: ?page=1&limit=20
   */
  async list<T>(
    table: string,
    params?: Record<string, string>
  ): Promise<T[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const data = await bkendFetch<ListResponse<T>>(`/data/${table}${qs}`)
    return data.data
  },

  /**
   * 단일 조회
   * GET /v1/data/{table}/{id}
   */
  async get<T>(table: string, id: string): Promise<T> {
    const data = await bkendFetch<{ data: T }>(`/data/${table}/${id}`)
    return data.data
  },

  /**
   * 생성
   * POST /v1/data/{table}
   */
  async create<T>(
    table: string,
    body: Omit<T, 'id' | 'created_at'>
  ): Promise<T> {
    const data = await bkendFetch<{ data: T }>(`/data/${table}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return data.data
  },

  /**
   * 부분 업데이트
   * PATCH /v1/data/{table}/{id}
   */
  async update<T>(table: string, id: string, body: Partial<T>): Promise<T> {
    const data = await bkendFetch<{ data: T }>(`/data/${table}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    return data.data
  },

  /**
   * 삭제
   * DELETE /v1/data/{table}/{id}
   */
  async delete(table: string, id: string): Promise<void> {
    await bkendFetch(`/data/${table}/${id}`, { method: 'DELETE' })
  },
}

// ── Storage (Presigned URL 방식) ──────────────────────────────────────────────

interface PresignedUrlResponse {
  url: string      // PUT 업로드 대상 URL (15분 유효)
  fileId: string   // 메타데이터 등록 시 사용
}

interface FileMetadata {
  id: string
  url: string
  filename: string
  contentType: string
  size: number
  visibility: string
}

export const bkendStorage = {
  /**
   * 파일 업로드 (Presigned URL 방식)
   *
   * 흐름:
   *   1. POST /v1/files/presigned-url  -> { url, fileId }
   *   2. PUT {url} with file binary
   *   3. POST /v1/files               -> 메타데이터 등록 -> 최종 URL 반환
   */
  async upload(
    file: File,
    path: string,
    visibility: 'public' | 'private' | 'protected' = 'protected'
  ): Promise<string> {
    // Step 1: Presigned URL 요청
    const { url, fileId } = await bkendFetch<PresignedUrlResponse>(
      '/files/presigned-url',
      {
        method: 'POST',
        body: JSON.stringify({
          filename: path,
          contentType: file.type,
          size: file.size,
        }),
      }
    )

    // Step 2: S3/CDN에 직접 업로드 (Content-Type 헤더 필수)
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    if (!uploadRes.ok) throw new Error('File upload failed')

    // Step 3: 메타데이터 등록
    const meta = await bkendFetch<{ data: FileMetadata }>('/files', {
      method: 'POST',
      body: JSON.stringify({
        fileId,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        visibility,
      }),
    })

    return meta.data.url
  },

  /**
   * 다운로드 URL 생성 (private/protected 파일용)
   * GET /v1/files/{id}/download-url
   */
  async getDownloadUrl(fileId: string): Promise<string> {
    const data = await bkendFetch<{ url: string }>(
      `/files/${fileId}/download-url`
    )
    return data.url
  },
}
