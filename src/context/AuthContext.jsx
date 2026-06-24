<<<<<<< HEAD
=======
/* eslint-disable react-refresh/only-export-components */
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
import { createContext } from 'react'
import useAuth from '../hooks/useAuth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const auth = useAuth()
<<<<<<< HEAD

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
=======
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default AuthContext
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
