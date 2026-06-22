import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../components/Navbar'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

describe('Navbar', () => {
  it('renders links', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    )
    expect(screen.getByText(/Home/i)).toBeTruthy()
    expect(screen.getByText(/Events/i)).toBeTruthy()
  })
})
