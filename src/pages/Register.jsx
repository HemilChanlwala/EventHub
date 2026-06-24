import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
<<<<<<< HEAD

const Register = () => {
  const { register } = useContext(AuthContext)
=======
import { saveUser, findUserByEmail } from '../services'

const Register = () => {
  const { login } = useContext(AuthContext)
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('attendee')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    const { error } = await register(
      email,
      password
    )

    if (error) {
      setError(error.message)
      return
    }

    navigate('/login')
  }

  const handleGoogle = () => {
    alert('Google Login Coming Soon')
=======
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Email and password are required')
    const exists = findUserByEmail(email)
    if (exists) return setError('User with this email already exists')

    const user = {
      id: `${Date.now()}`,
      name: name || (email && email.split('@')[0]) || 'User',
      email,
      phone,
      role,
      password,
      createdAt: new Date().toISOString()
    }

    try {
      saveUser(user)
      // login without exposing password
      const safeUser = { ...user }
      delete safeUser.password
      login(safeUser, remember)
      if (role === 'organizer') navigate('/organizer')
      else navigate('/dashboard')
    } catch {
      setError('Failed to create account')
    }
  }

  const handleGoogle = () => {
    const email = 'google_user@example.com'
    const existing = findUserByEmail(email)
    const user = existing || { id: `g_${Date.now()}`, email, name: 'Google User', role: 'attendee', createdAt: new Date().toISOString() }
    try { saveUser(user) } catch { void 0 }
    const safeUser = { ...user }
    delete safeUser.password
    login(safeUser, true)
    navigate('/dashboard')
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
  }

  return (
    <div className="max-w-md mx-auto p-8">
<<<<<<< HEAD
      <h2 className="text-2xl font-semibold mb-4">
        Create an account
      </h2>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="text-sm text-red-400">
            {error}
          </div>
        )}

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Full Name"
          className="w-full p-3 border rounded bg-transparent"
        />

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Email"
          className="w-full p-3 border rounded bg-transparent"
          required
        />

        <input
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          placeholder="Phone"
          className="w-full p-3 border rounded bg-transparent"
        />

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Password"
          className="w-full p-3 border rounded bg-transparent"
          required
        />

        <div className="flex items-center gap-3">
          <label className="text-sm">
            Register as
          </label>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="p-2 border rounded"
          >
            <option value="attendee">
              Attendee
            </option>
            <option value="organizer">
              Organizer
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) =>
              setRemember(e.target.checked)
            }
          />
          <span>Remember me</span>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Register
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleGoogle}
            className="px-4 py-2 border rounded"
          >
            Register with Google
          </button>
=======
      <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div>
          <label htmlFor="reg-name" className="sr-only">Full name</label>
          <input id="reg-name" aria-label="Full name" value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full p-3 border rounded bg-transparent" />
        </div>
        <div>
          <label htmlFor="reg-email" className="sr-only">Email</label>
          <input id="reg-email" aria-label="Email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded bg-transparent" />
        </div>
        <div>
          <label htmlFor="reg-phone" className="sr-only">Phone</label>
          <input id="reg-phone" aria-label="Phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full p-3 border rounded bg-transparent" />
        </div>
        <div>
          <label htmlFor="reg-password" className="sr-only">Password</label>
          <input id="reg-password" aria-label="Password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded bg-transparent" />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm">Register as</label>
          <select value={role} onChange={e=>setRole(e.target.value)} className="p-2 bg-transparent border rounded">
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
            Remember me
          </label>
        </div>

        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Register</button>

        <div className="text-center mt-4">
          <button type="button" onClick={handleGoogle} className="px-4 py-2 border rounded">Register with Google</button>
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
        </div>
      </form>
    </div>
  )
}

<<<<<<< HEAD
export default Register
=======
export default Register
>>>>>>> 07a3d598e0971ee3e2dd567faee5f43c136d6b7c
