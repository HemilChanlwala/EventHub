import { supabase } from '../lib/supabase'

export const createAuthUser = async (email, password) => {
  if (!supabase) throw new Error('Supabase client is not available')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  if (!supabase) throw new Error('Supabase client is not available')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signInWithGoogle = async () => {
  if (!supabase) throw new Error('Supabase client is not available')
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
}

export const signOut = async () => {
  if (!supabase) throw new Error('Supabase client is not available')
  return await supabase.auth.signOut()
}
