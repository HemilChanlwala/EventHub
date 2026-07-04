import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'eventhub_events'
const REGISTRATIONS_KEY = 'eventhub_registrations'

const normalizeEvent = (item = {}) => {
  const dateValue = item.start_date || item.event_date || item.date || item.eventDate || ''
  const timeValue = item.start_time || item.event_time || item.time || item.eventTime || ''
  const venueValue = item.venue || item.location || item.venueName || ''
  const cityValue = item.city || ''
  const capacityValue = Number(item.capacity ?? item.seats ?? 0) || 0
  const priceValue = item.price === null || item.price === undefined || item.price === '' ? 'Free' : item.price

  return {
    id: item.id ?? item.event_id ?? item._id,
    title: item.title || 'Untitled Event',
    description: item.description || '',
    category: item.category || 'General',
    venue: venueValue,
    city: cityValue,
    date: dateValue,
    time: timeValue,
    location: venueValue || cityValue || 'Online',
    price: priceValue,
    capacity: capacityValue,
    seats: capacityValue,
    banner_url: item.banner_url || item.image || item.bannerUrl || '',
    image: item.banner_url || item.image || item.bannerUrl || '',
    organizer_id: item.organizer_id || item.organizerId || item.creator || null,
    creator: item.organizer_id || item.organizerId || item.creator || 'guest',
    status: item.status || 'published',
    created_at: item.created_at || item.createdAt || new Date().toISOString(),
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
  }
}

const readLocalEvents = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(data) ? data.map(normalizeEvent) : []
  } catch (err) {
    console.warn('readLocalEvents', err)
    return []
  }
}

const writeLocalEvents = (events) => {
  const payload = Array.isArray(events) ? events.map(normalizeEvent) : []
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}

const fallbackEvents = () => {
  const local = readLocalEvents()
  return local
}

export const getEvents = async (useSupabase = false) => {
  // In Node/test environments, prefer using Supabase client (tests mock it)
  const isNode = typeof window === 'undefined' || (globalThis.process && globalThis.process.env && globalThis.process.env.NODE_ENV === 'test')
  if (useSupabase && isNode && supabase) {
    try {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
      if (!error && Array.isArray(data)) {
        const normalized = data.map(normalizeEvent)
        writeLocalEvents(normalized)
        return normalized
      }
    } catch (err) {
      console.warn('getEvents from Supabase failed', err)
    }
  }

  // In browser environments, call server API which proxies to Supabase
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/events')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          if (data.length === 0) {
            localStorage.removeItem(STORAGE_KEY)
            return []
          }
          const normalized = data.map(normalizeEvent)
          writeLocalEvents(normalized)
          return normalized
        }
      }
    } catch (err) {
      console.warn('getEvents from /api/events failed', err)
    }
  }

  const local = readLocalEvents()
  if (local.length) return local

  const seeded = fallbackEvents()
  writeLocalEvents(seeded)
  return seeded
}

export const saveEvent = async (ev) => {
  const normalized = normalizeEvent({ ...ev, creator: ev.creator || ev.organizer_id || ev.organizerId || 'guest' })
  const existing = readLocalEvents()
  const merged = [normalized, ...existing.filter((event) => String(event.id) !== String(normalized.id))]
  writeLocalEvents(merged)
  // POST to server API which will insert into Supabase
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ev, ...normalized }),
    })
    if (res.ok || res.status === 201) {
      const data = await res.json()
      const refreshed = normalizeEvent({ ...data, creator: data.creator || data.organizer_id || normalized.creator })
      const next = [refreshed, ...existing.filter((event) => String(event.id) !== String(data.id))]
      writeLocalEvents(next)
      return refreshed
    }
  } catch (err) {
    console.warn('saveEvent to /api/events failed', err)
  }

  return normalized
}

export const uploadBanner = async (file) => {
  if (!file) return null

  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Upload failed')
    const json = await res.json()
    return json?.publicUrl || null
  } catch (err) {
    console.warn('uploadBanner failed', err)
    return null
  }
}

export const saveRegistration = async (registration) => {
  const existing = readRegistrations()
  const next = [registration, ...existing.filter((item) => item.ticketId !== registration.ticketId)]
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(next))

  // POST to server API which will insert into Supabase and create ticket/attendance
  try {
    const headers = { 'Content-Type': 'application/json' }
    const apiKey = import.meta.env.VITE_SERVER_API_KEY
    if (apiKey) headers['x-api-key'] = apiKey

    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        registration_id: registration.ticketId,
        user_id: registration.userId || null,
        event_id: registration.eventId,
        ticket_type: registration.ticketType,
        price: registration.price,
        status: 'confirmed',
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        college_company: registration.college || registration.company || null,
        occupation: registration.occupation || null,
        address: registration.address || null,
        city: registration.city || null,
        state: registration.state || null,
        emergency_contact_name: registration.emergencyName || null,
        emergency_contact_phone: registration.emergencyPhone || null,
        dietary_preference: registration.dietary || null,
        tshirt_size: registration.tshirt || null,
        notes: registration.notes || null,
        ticketId: registration.ticketId,
        qrData: registration.qrData || null,
        createdAt: registration.createdAt,
      }),
    })
    if (res.ok || res.status === 201) {
      const data = await res.json()
      return { ...registration, id: data.id }
    }
  } catch (err) {
    console.warn('saveRegistration to /api/registrations failed', err)
  }

  return registration
}

export const getRegistrations = () => {
  try {
    const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('getRegistrations', err)
    return []
  }
}

export const getRegistrationsFromServer = async (eventId) => {
  try {
    const apiKey = import.meta.env.VITE_SERVER_API_KEY
    const headers = apiKey ? { 'x-api-key': apiKey } : {}
    const query = eventId ? `?event=${encodeURIComponent(eventId)}` : ''
    const res = await fetch(`/api/registrations${query}`, { headers })
    if (!res.ok) {
      throw new Error(`failed to fetch registrations ${res.status}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('getRegistrationsFromServer failed', err)
    return []
  }
}

export const api = {
  getEvents,
  saveEvent,
  saveRegistration,
  getRegistrations,
}

export default api

const readRegistrations = () => {
  try {
    const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('readRegistrations', err)
    return []
  }
}

export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('eventhub_users') || '[]')
  } catch (err) {
    console.warn('getUsers', err)
    return []
  }
}

export const saveUser = (user) => {
  try {
    const existing = getUsers()
    const idx = existing.findIndex(u => (u.id && user.id && u.id === user.id) || (u.email && user.email && u.email === user.email))
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...user }
    } else {
      existing.unshift(user)
    }
    localStorage.setItem('eventhub_users', JSON.stringify(existing))
    return user
  } catch (err) {
    console.warn('saveUser', err)
    return user
  }
}

export const findUserByEmail = (email) => {
  if (!email) return null
  try {
    return getUsers().find(u => (u.email || '').toLowerCase() === String(email).toLowerCase()) || null
  } catch (err) {
    console.warn('findUserByEmail', err)
    return []
  }
}

export const deleteUser = (idOrEmail) => {
  try {
    const users = getUsers()
    const filtered = users.filter(u => !(u.id === idOrEmail || u.email === idOrEmail))
    localStorage.setItem('eventhub_users', JSON.stringify(filtered))
    return true
  } catch (err) {
    console.warn('deleteUser', err)
    return false
  }
}

export const deleteEvent = (id) => {
  try {
    const events = readLocalEvents()
    const filtered = events.filter(e => String(e.id) !== String(id))
    writeLocalEvents(filtered)

    // Fire server delete asynchronously
    try {
      fetch(`/api/events/${id}`, { method: 'DELETE' }).catch(() => {})
    } catch (e) { console.warn('deleteEvent remote failed', e) }

    return true
  } catch (err) {
    console.warn('deleteEvent', err)
    return false
  }
}
