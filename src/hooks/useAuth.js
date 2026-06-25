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
    return await supabase.auth.signUp({
      email,
      password,
    })
  }

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }
const loginWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })
}

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    register,
    login,
    loginWithGoogle,
    logout,
  }
}