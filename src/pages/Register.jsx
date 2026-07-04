import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const Register = () => {
  const { register, loginWithGoogle, login } = useAuthContext()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState('user')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('Email, password, and confirm password are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const result = await register({
      fullName: name,
      email,
      phone,
      password,
      role,
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    const loginResult = await login(email, password)
    if (loginResult.success) {
      if (loginResult.role === 'organizer') {
        navigate('/create-event')
      } else if (loginResult.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
      return
    }

    alert('Registration Successful! Please login to continue.')
    navigate('/login')
  }

  const handleGoogle = async () => {
    const { error } = await loginWithGoogle()

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
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

        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              className="w-full p-3 border rounded bg-transparent pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white z-10 bg-transparent p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 hover:shadow-glow hover:bg-white/10"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.04-2.6 2.8-4.73 4.9-6.08" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm Password"
              className="w-full p-3 border rounded bg-transparent pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white z-10 bg-transparent p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 hover:shadow-glow hover:bg-white/10"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.04-2.6 2.8-4.73 4.9-6.08" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

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
            <option value="user">
              User
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
        </div>
      </form>
    </div>
  )
}

export default Register
