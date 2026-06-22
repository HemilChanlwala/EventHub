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
