import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const roleLabel = (roles = []) => {
  if (roles.length === 0) return 'authorized users'
  return roles
    .map((role) => {
      if (role === 'organizer') return 'organizers'
      if (role === 'admin') return 'admins'
      return `${role}s`
    })
    .join(' or ')
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading = false } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-6 text-slate-100">
          <p className="text-sm">Checking your session…</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-lg border border-red-500 bg-red-950/60 p-6 text-red-100">
          <h2 className="text-xl font-semibold mb-2">Access restricted</h2>
          <p className="leading-7">
            Only {roleLabel(allowedRoles)} can access this page. Please register as an organizer or contact support.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
