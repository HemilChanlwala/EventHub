import { cleanup, fireEvent, render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import useAuth from '../hooks/useAuth'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({
  setSessionStoragePreference: vi.fn(),
  clearSessionStoragePreference: vi.fn(),
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

afterEach(() => {
  cleanup()
})

const renderWithAuth = (ui, value = {}) => {
  const authValue = {
    login: vi.fn().mockResolvedValue({ success: true }),
    loginWithGoogle: vi.fn().mockResolvedValue({ error: null }),
    register: vi.fn().mockResolvedValue({ success: true }),
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
        target: { value: 'jane@example.test' },
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

  it('passes the remember-me preference when signing in', async () => {
    const login = vi.fn().mockResolvedValue({ success: true, role: 'attendee' })
    renderWithAuth(<Login />, { login })

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jane@example.test' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByLabelText(/remember me/i))
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('jane@example.test', 'secret123', { rememberMe: true })
    })
  })

  it('passes profile details when registering', async () => {
    const register = vi.fn().mockResolvedValue({ success: true })
    renderWithAuth(<Register />, { register })

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'Jane Doe' },
    })
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'jane@example.test' },
      })
    fireEvent.change(screen.getByPlaceholderText(/phone/i), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'organizer' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^register$/i }))

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
          email: 'jane@example.test',
        phone: '1234567890',
        password: 'secret123',
        role: 'organizer',
      })
    })
  })

  it('redirects organizers to the organizer dashboard after login', async () => {
    const login = vi.fn().mockResolvedValue({ success: true, role: 'organizer' })

    render(
      <AuthContext.Provider value={{ login, loginWithGoogle: vi.fn().mockResolvedValue({ error: null }) }}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/organizer" element={<div>Organizer Dashboard</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'jane@example.test' },
      })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    expect(await screen.findByText(/organizer dashboard/i)).toBeTruthy()
  })

  it('logs the Supabase session after a successful login', async () => {
    const session = { access_token: 'token' }
    supabase.auth.signInWithPassword.mockResolvedValue({ data: { session }, error: null })
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const { result } = renderHook(() => useAuth())

    await act(async () => {
        await result.current.login('jane@example.test', 'secret123')
    })

    expect(consoleSpy).toHaveBeenCalledWith(session)

    consoleSpy.mockRestore()
  })

  it('loads the current user on startup via getUser', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const user = { email: 'jane@example.test' }
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null })

    renderHook(() => useAuth())

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(user.email)
    })

    consoleSpy.mockRestore()
  })
})
