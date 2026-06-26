import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Login from '../pages/Login'
import Register from '../pages/Register'

afterEach(() => {
  cleanup()
})

const renderWithAuth = (ui, value = {}) => {
  const authValue = {
    login: vi.fn().mockResolvedValue({ error: null }),
    loginWithGoogle: vi.fn().mockResolvedValue({ error: null }),
    register: vi.fn().mockResolvedValue({ error: null }),
    ...value,
  }

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('Authentication pages', () => {
  it('toggles password visibility on the login form', () => {
    renderWithAuth(<Login />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const toggleButton = screen.getByRole('button', { name: /^show password$/i })

    expect(passwordInput.getAttribute('type')).toBe('password')

    fireEvent.click(toggleButton)

    expect(passwordInput.getAttribute('type')).toBe('text')
  })

  it('requires matching passwords before registration', async () => {
    renderWithAuth(<Register />)

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'jane@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'different123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^register$/i }))

    expect(await screen.findByText(/passwords do not match/i)).toBeTruthy()
  })
})
