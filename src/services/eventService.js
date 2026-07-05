import { supabase } from '../lib/supabase'

const DEFAULT_COUNTRY = 'India'
const DEFAULT_STATUS = 'Upcoming'

const buildEventPayload = (event = {}) => {
  const price = Number(event.price)
  const capacity = Number(event.capacity)

  return {
    organizer_id: event.organizer_id || event.creator || 'guest',
    title: event.title || '',
    short_description: event.short_description || '',
    description: event.full_description || event.description || '',
    category: event.category || '',
    event_type: event.ticket_type || 'General',
    venue: event.venue || '',
    city: event.city || '',
    state: event.state || '',
    country: event.country || DEFAULT_COUNTRY,
    start_date: event.start_date || null,
    end_date: event.end_date || null,
    start_time: event.start_time || null,
    end_time: event.end_time || null,
    capacity: Number.isNaN(capacity) ? 0 : capacity,
    price: Number.isNaN(price) ? 0 : price,
    banner_url: event.banner_url || null,
    status: event.status || DEFAULT_STATUS,
    created_at: event.created_at || new Date().toISOString(),
  }
}

const normalizeEvent = (item = {}) => ({
  ...item,
  price: item.price ?? 0,
  capacity: Number(item.capacity ?? 0),
  event_type: item.event_type || 'General',
  short_description: item.short_description || '',
  description: item.description || '',
})

export const createEvent = async (event) => {
  if (!supabase) throw new Error('Supabase client is not available')

  const payload = buildEventPayload(event)
  const { data, error } = await supabase.from('events').insert([payload]).select().single()
  if (error) throw error

  return normalizeEvent(data)
}

export const getAllEvents = async () => {
  if (!supabase) throw new Error('Supabase client is not available')

  const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
  if (error) throw error

  return Array.isArray(data) ? data.map(normalizeEvent) : []
}

export const getEventById = async (id) => {
  if (!supabase) throw new Error('Supabase client is not available')

  const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
  if (error) throw error

  return normalizeEvent(data)
}

export const getOrganizerEvents = async (organizerId) => {
  if (!supabase) throw new Error('Supabase client is not available')

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return Array.isArray(data) ? data.map(normalizeEvent) : []
}

export const updateEvent = async (id, updates) => {
  if (!supabase) throw new Error('Supabase client is not available')

  const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single()
  if (error) throw error

  return normalizeEvent(data)
}

export const deleteEvent = async (id) => {
  if (!supabase) throw new Error('Supabase client is not available')

  const { data, error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error

  return data
}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
}
