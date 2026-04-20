'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = useMemo<any>(() => {
    try {
      return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    } catch {
      return null
    }
  }, [])

  // useEffect removed to avoid cascading renders since loading is false by default


  const signOut = async () => {
    // signOut login commented out
    
    console.log('Mock signout');
  }

  return {
    user,
    loading,
    signOut,
  }
}
