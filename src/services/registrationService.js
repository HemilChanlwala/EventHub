import { supabase } from '../lib/supabase'

const REGISTRATIONS_KEY = 'eventhub_registrations'

const normalizePrice = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const numeric = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

const readLocalRegistrations = () => {
  try {
    const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('readLocalRegistrations', err)
    return []
  }
}

const writeLocalRegistrations = (registrations) => {
  const payload = Array.isArray(registrations) ? registrations : []
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(payload))
  return payload
}

export const getRegistrations = () => {
  return readLocalRegistrations()
}

export const getRegistrationsFromServer = async (eventId) => {
  if (!supabase) return []
  try {
    let query = supabase.from('registrations').select('*').order('created_at', { ascending: false })
    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data, error } = await query
    if (error) throw error
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('getRegistrationsFromServer', err)
    return []
  }
}

export const saveRegistration = async (registration) => {
  const payload = {
    ticketId: registration.ticketId,
    eventId: registration.eventId,
    eventTitle: registration.eventTitle,
    name: registration.name,
    email: registration.email,
    phone: registration.phone,
    ticketType: registration.ticketType,
    price: registration.price,
    eventDate: registration.eventDate || registration.date || registration.start_date || null,
    eventTime: registration.eventTime || registration.time || registration.start_time || null,
    eventLocation: registration.eventLocation || registration.location || registration.venue || null,
    eventBanner: registration.eventBanner || registration.banner || registration.image || null,
    organizerName: registration.organizerName || registration.organizer || registration.organizer_name || null,
    createdAt: registration.createdAt || new Date().toISOString(),
    checkedIn: registration.checkedIn ?? false,
    qrData: registration.qrData || null,
    userId: registration.userId || registration.user_id || null,
  }

  const existing = readLocalRegistrations()
  const next = [payload, ...existing.filter((item) => item.ticketId !== payload.ticketId)]
  writeLocalRegistrations(next)

  if (!supabase) return payload

  try {
    const supabasePayload = {
      ticket_id: payload.ticketId,
      event_id: payload.eventId,
      event_title: payload.eventTitle,
      attendee_name: payload.name,
      attendee_email: payload.email,
      attendee_phone: payload.phone,
      ticket_type: payload.ticketType,
      price: normalizePrice(payload.price),
      user_id: payload.userId,
      checked_in: payload.checkedIn,
      qr_data: payload.qrData,
      created_at: payload.createdAt,
    }

    const { data, error } = await supabase
      .from('registrations')
      .upsert(supabasePayload, { onConflict: 'ticket_id' })
      .select()
      .single()
    if (error) throw error

    return {
      ...payload,
      id: data?.id ?? payload.id,
    }
  } catch (err) {
    console.warn('saveRegistration', err)
    return payload
  }
}
