'use client'

import { useState, useEffect, useCallback } from 'react'
import { bkendAuth } from '@/lib/bkend'

interface User {
  id: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bkendAuth.getUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await bkendAuth.signIn(email, password)
    setUser(data.user)
    return data
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const data = await bkendAuth.signUp(email, password)
    setUser(data.user)
    return data
  }, [])

  const signOut = useCallback(async () => {
    await bkendAuth.signOut()
    setUser(null)
  }, [])

  return { user, loading, signIn, signUp, signOut }
}
