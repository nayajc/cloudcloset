/**
 * bkend.ai REST API 클라이언트
 * Docs: https://bkend.ai/docs
 */

const BKEND_URL = process.env.NEXT_PUBLIC_BKEND_URL!
const BKEND_KEY = process.env.NEXT_PUBLIC_BKEND_KEY!

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('bkend_access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': BKEND_KEY,
      ...getAuthHeader(),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? 'Request failed')
  }
  return res.json()
}

// ── Auth ────────────────────────────────────────────────────────────────────

export const bkendAuth = {
  async signUp(email: string, password: string) {
    const data = await request<{ access_token: string; user: { id: string; email: string } }>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    )
    if (typeof window !== 'undefined') {
      localStorage.setItem('bkend_access_token', data.access_token)
    }
    return data
  },

  async signIn(email: string, password: string) {
    const data = await request<{ access_token: string; user: { id: string; email: string } }>(
      '/auth/signin',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    )
    if (typeof window !== 'undefined') {
      localStorage.setItem('bkend_access_token', data.access_token)
    }
    return data
  },

  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bkend_access_token')
    }
  },

  async getUser(): Promise<{ id: string; email: string } | null> {
    try {
      const data = await request<{ id: string; email: string }>('/auth/me')
      return data
    } catch {
      return null
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('bkend_access_token')
  },
}

// ── Database ────────────────────────────────────────────────────────────────

export const bkendDB = {
  async list<T>(table: string, params?: Record<string, string>): Promise<T[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    const data = await request<{ data: T[] }>(`/data/${table}${qs}`)
    return data.data
  },

  async get<T>(table: string, id: string): Promise<T> {
    const data = await request<{ data: T }>(`/data/${table}/${id}`)
    return data.data
  },

  async create<T>(table: string, body: Omit<T, 'id' | 'created_at'>): Promise<T> {
    const data = await request<{ data: T }>(`/data/${table}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return data.data
  },

  async update<T>(table: string, id: string, body: Partial<T>): Promise<T> {
    const data = await request<{ data: T }>(`/data/${table}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    return data.data
  },

  async delete(table: string, id: string): Promise<void> {
    await request(`/data/${table}/${id}`, { method: 'DELETE' })
  },
}

// ── Storage ─────────────────────────────────────────────────────────────────

export const bkendStorage = {
  async upload(bucket: string, path: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)

    const res = await fetch(`${BKEND_URL}/storage/${bucket}/upload`, {
      method: 'POST',
      headers: {
        'x-api-key': BKEND_KEY,
        ...getAuthHeader(),
      },
      body: formData,
    })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url as string
  },

  getUrl(bucket: string, path: string): string {
    return `${BKEND_URL}/storage/${bucket}/file/${path}`
  },
}
