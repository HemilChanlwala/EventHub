import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Register = () => {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState('attendee')
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
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
            className="w-full p-3 border rounded bg-transparent"
            required
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-sm text-indigo-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </div>
        </div>

        <div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm Password"
            className="w-full p-3 border rounded bg-transparent"
            required
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-sm text-indigo-600"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
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
        </div>
      </form>
    </div>
  )
}

export default Register
