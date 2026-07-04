import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import Navbar from '../components/Navbar'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AuthContext from '../context/AuthContext'

afterEach(() => {
  cleanup()
})

describe('Navbar', () => {
  it('renders links', () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    )
    expect(screen.getByText(/Home/i)).toBeTruthy()
    expect(screen.getByText(/Events/i)).toBeTruthy()
  })

  it('shows the signed-in user name in the navbar', () => {
    render(
      <AuthContext.Provider value={{ user: { email: 'jane@example.test', user_metadata: { full_name: 'Jane Doe' } }, logout: vi.fn() }}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByText(/hi, jane doe/i)).toBeTruthy()
  })

  it('routes dashboard to login when no user is signed in', () => {
    const { container } = render(
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<div>Login page</div>} />
            <Route path="/dashboard" element={<div>Dashboard page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    const dashboardLink = Array.from(container.querySelectorAll('a')).find((link) => link.textContent === 'Dashboard' && link.getAttribute('href') === '/login')

    expect(dashboardLink).toBeTruthy()
  })

  it('redirects to login after logout', async () => {
    const logout = vi.fn().mockResolvedValue(undefined)

    render(
      <AuthContext.Provider value={{ user: { email: 'jane@example.test', user_metadata: { full_name: 'Jane Doe' } }, logout }}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Navbar />} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    fireEvent.click(screen.getAllByRole('button', { name: /logout/i })[0])

    expect(await screen.findByText(/login page/i)).toBeTruthy()
    expect(logout).toHaveBeenCalled()
  })
})
