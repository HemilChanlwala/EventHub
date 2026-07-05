import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFrom = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}))

const { getEvents } = await import('../services')

describe('event service', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    localStorage.clear()
  })

  it('loads events from Supabase when available', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              title: 'Launch Night',
              description: 'An opening event',
              category: 'Tech',
              venue: 'Skyline Hall',
              city: 'Lagos',
              event_date: '2026-08-12',
              event_time: '19:30',
              price: 25,
              capacity: 150,
              banner_url: 'https://cdn.example/banner.png',
              organizer_id: 'org-1',
              status: 'published',
              created_at: '2026-07-01T00:00:00.000Z',
            },
          ],
          error: null,
        }),
      })),
    })

    const events = await getEvents(true)

    expect(mockFrom).toHaveBeenCalledWith('events')
    expect(events[0].title).toBe('Launch Night')
    expect(events[0].venue).toBe('Skyline Hall')
  })
})
