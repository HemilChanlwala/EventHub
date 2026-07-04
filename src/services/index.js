import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'eventhub_events'
const REGISTRATIONS_KEY = 'eventhub_registrations'

const normalizeEvent = (item = {}) => {
  const dateValue = item.event_date || item.date || item.eventDate || ''
  const timeValue = item.event_time || item.time || item.eventTime || ''
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
  if (useSupabase && supabase) {
    try {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
      if (!error && Array.isArray(data)) {
        const normalized = data.map(normalizeEvent)
        const local = readLocalEvents()
        const merged = [
          ...normalized,
          ...local.filter((localEvent) => !normalized.some((remoteEvent) => String(remoteEvent.id) === String(localEvent.id))),
        ]
        writeLocalEvents(merged)
        if (merged.length > 0) {
          return merged
        }
        if (local.length) return local
      }
    } catch (err) {
      console.warn('getEvents from Supabase failed', err)
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

  if (supabase) {
    try {
      const payload = {
        title: normalized.title,
        description: normalized.description,
        category: normalized.category,
        venue: normalized.venue,
        city: normalized.city,
        event_date: normalized.date,
        event_time: normalized.time,
        price: normalized.price,
        capacity: normalized.capacity,
        banner_url: normalized.banner_url,
        organizer_id: normalized.organizer_id || normalized.creator,
        creator: normalized.creator,
        status: normalized.status,
        created_at: normalized.created_at,
      }

      const { data, error } = await supabase.from('events').insert([payload]).select().single()
      if (error) {
        console.error('Supabase saveEvent insert error:', error)
      }
      if (!error && data) {
        const refreshed = normalizeEvent({ ...data, creator: data.creator || data.organizer_id || normalized.creator })
        const next = [refreshed, ...existing.filter((event) => String(event.id) !== String(data.id))]
        writeLocalEvents(next)
        return refreshed
      }
    } catch (err) {
      console.warn('saveEvent to Supabase failed', err)
    }
  }

  return normalized
}

export const uploadBanner = async (file) => {
  if (!file || !supabase) return null

  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from('event-banners').upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error

    const { data } = supabase.storage.from('event-banners').getPublicUrl(fileName)
    return data?.publicUrl || null
  } catch (err) {
    console.warn('uploadBanner failed', err)
    return null
  }
}

export const saveRegistration = async (registration) => {
  const existing = readRegistrations()
  const next = [registration, ...existing.filter((item) => item.ticketId !== registration.ticketId)]
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(next))

  if (supabase) {
    try {
      await supabase.from('tickets').insert([{
        ticket_id: registration.ticketId,
        event_id: registration.eventId,
        event_title: registration.eventTitle,
        attendee_name: registration.name,
        attendee_phone: registration.phone,
        attendee_email: registration.email,
        ticket_type: registration.ticketType,
        price: registration.price,
        status: 'confirmed',
        created_at: registration.createdAt,
        qr_data: registration.qrData || null,
      }])
    } catch (err) {
      console.warn('saveRegistration to Supabase failed', err)
    }
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
    return true
  } catch (err) {
    console.warn('deleteEvent', err)
    return false
  }
}
