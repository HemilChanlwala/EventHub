import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Login = () => {
  const { login, loginWithGoogle } =useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { error } = await login(email, password)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/dashboard')
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

          <input
            id="login-password"
            type="password"
            aria-label="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            className="w-full p-3 border rounded"
            required
          />
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

          <a
            href="#"
            className="text-sm text-indigo-600"
          >
            Forgot?
          </a>
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
