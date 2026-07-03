import { createContext, useContext } from 'react'
import useAuth from '../hooks/useAuth'

export const AuthContext = createContext(null)

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
