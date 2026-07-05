import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MyEvents from '../pages/MyEvents'
import Tickets from '../pages/Tickets'

describe('Dashboard subpages', () => {
  it('renders My Events page', () => {
    render(
      <MemoryRouter>
        <MyEvents />
      </MemoryRouter>
    )

    expect(screen.getByText(/my events/i)).toBeTruthy()
  })

  it('renders Tickets page', () => {
    render(
      <MemoryRouter>
        <Tickets />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /tickets/i })).toBeTruthy()
  })
})
