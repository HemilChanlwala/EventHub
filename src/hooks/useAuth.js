<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user || null)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    return { data, error }
  }

  const login = async (email, password) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    return { data, error }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    register,
    login,
    logout,
  }
}
=======
import { useState } from 'react'

export default function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('eventhub_user')
      return raw ? JSON.parse(raw) : null
    } catch (err) {
      console.warn('useAuth init error', err)
      return null
    }
  })

  const login = (u, remember = false) => {
    setUser(u)
    if (remember) {
      try {
        localStorage.setItem('eventhub_user', JSON.stringify(u))
      } catch (err) {
        console.warn('localStorage set error', err)
      }
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('eventhub_user')
    } catch (err) {
      console.warn('localStorage remove error', err)
    }
  }

  return { user, login, logout }
}
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
