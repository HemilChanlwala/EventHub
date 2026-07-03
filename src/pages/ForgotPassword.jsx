import { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage(`If an account exists for ${email}, reset instructions have been sent.`)
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
      <p className="mb-6 text-theme-weak">Enter your email and we will send instructions to reset your password.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-sm mb-2">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Send reset email</button>
      </form>

      {message && <div className="mt-4 p-3 bg-white/5 border border-theme rounded text-theme">{message}</div>}

      <div className="mt-6 text-sm text-theme-weak">
        Remembered your password? <Link to="/login" className="text-indigo-500 hover:underline">Back to login</Link>
      </div>
    </div>
  )
}

export default ForgotPassword
