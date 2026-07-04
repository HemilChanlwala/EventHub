import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const Login = () => {
  const { login, loginWithGoogle } = useAuthContext()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const result = await login(email, password)

    if (!result.success) {
      setError(result.error)
      return
    }

    if (result.role === 'organizer') {
      navigate('/organizer')
    } else if (result.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoogle = async () => {
  const { error } =
    await loginWithGoogle()

  if (error) {
    setError(error.message)
  }
}

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="login-email"
            className="sr-only"
          >
            Email
          </label>

          <input
            id="login-email"
            type="email"
            aria-label="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="sr-only"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              aria-label="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              className="w-full p-3 border rounded pr-10"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleGoogle}
            className="px-4 py-2 border rounded"
          >
            Login with Google
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
