import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { findUserByEmail, saveUser } from '../services'

const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const found = findUserByEmail(email)
    if (!found) return setError('No account found for this email')
    if (found.password !== password) return setError('Invalid credentials')
    const safeUser = { ...found }
    delete safeUser.password
    login(safeUser, remember)
    if (safeUser.role === 'organizer') navigate('/organizer')
    else if (safeUser.role === 'admin') navigate('/admin')
    else navigate('/dashboard')
  }

  const handleGoogle = () => {
    // Mock Google Sign-In (placeholder)
    const email = 'google_user@example.com'
    const existing = findUserByEmail(email)
    const user = existing || { id: `g_${Date.now()}`, email, name: 'Google User', role: 'attendee', createdAt: new Date().toISOString() }
    try { saveUser(user) } catch { void 0 }
    const safeUser = { ...user }
    delete safeUser.password
    login(safeUser, true)
    navigate('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div>
          <label htmlFor="login-email" className="sr-only">Email</label>
          <input id="login-email" aria-label="Email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
        </div>
        <div>
          <label htmlFor="login-password" className="sr-only">Password</label>
          <input id="login-password" aria-label="Password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded" />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
            Remember me
          </label>
          <a href="#" className="text-sm text-indigo-600">Forgot?</a>
        </div>

        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Login</button>

        <div className="text-center mt-4">
          <button type="button" onClick={handleGoogle} className="px-4 py-2 border rounded">Login with Google</button>
        </div>
      </form>
    </div>
  )
}

export default Login
