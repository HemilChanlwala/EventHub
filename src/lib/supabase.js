import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const SESSION_PREFERENCE_KEY = 'eventhub_session_pref'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in production env')
}

const getPreferredStorage = () => {
  if (typeof window === 'undefined') {
    return window?.localStorage ?? null
  }

  try {
    const storedPreference = window.localStorage.getItem(SESSION_PREFERENCE_KEY)
    if (storedPreference === 'session') {
      return window.sessionStorage
    }
    return window.localStorage
  } catch (error) {
    console.warn('[Supabase] Unable to read session storage preference', error)
    return window.localStorage
  }
}

const createDynamicStorage = () => ({
  getItem: (key) => {
    try {
      return getPreferredStorage()?.getItem(key) ?? null
    } catch (error) {
      console.warn('[Supabase] Unable to read auth storage item', error)
      return null
    }
  },
  setItem: (key, value) => {
    try {
      getPreferredStorage()?.setItem(key, value)
    } catch (error) {
      console.warn('[Supabase] Unable to write auth storage item', error)
    }
  },
  removeItem: (key) => {
    try {
      getPreferredStorage()?.removeItem(key)
    } catch (error) {
      console.warn('[Supabase] Unable to remove auth storage item', error)
    }
  },
})

export const setSessionStoragePreference = (rememberMe) => {
  try {
    window.localStorage.setItem(SESSION_PREFERENCE_KEY, rememberMe ? 'local' : 'session')
  } catch (error) {
    console.warn('[Supabase] Unable to persist session preference', error)
  }
}

export const clearSessionStoragePreference = () => {
  try {
    window.localStorage.removeItem(SESSION_PREFERENCE_KEY)
  } catch (error) {
    console.warn('[Supabase] Unable to clear session preference', error)
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: createDynamicStorage(),
  },
})
