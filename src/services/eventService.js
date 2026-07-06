import { supabase } from '../lib/supabase'

const DEFAULT_COUNTRY = 'India'
const DEFAULT_STATUS = 'Upcoming'

const buildEventPayload = (event = {}) => {
    const price = Number(event.price)
    const capacity = Number(event.capacity)

    return {
        organizer_id: event.organizer_id,

        title: event.title || '',

        short_description: event.short_description || '',

        description: event.full_description || event.description || '',

        category: event.category || '',

        event_type: event.ticket_type || 'General',

        venue: event.venue || '',

        city: event.city || '',

        state: event.state || '',

        country: event.country || 'India',

        start_date: event.start_date,
        date: event.start_date || event.date,

        end_date: event.end_date,

        start_time: event.start_time,
        time: event.start_time || event.time,

        end_time: event.end_time,

        capacity: Math.max(1, Number(event.capacity) || 1),

        price: Number(event.price) || 0,

        banner_url: event.banner_url,

        status: event.status || 'Upcoming'
    }
}

const normalizeEvent = (item = {}) => ({
    ...item,
    price: item.price ?? 0,
    capacity: Number(item.capacity ?? item.seats ?? 0),
    event_type: item.event_type || 'General',
    short_description: item.short_description || '',
    description: item.description || '',
    date: item.date || item.start_date || item.event_date || item.startDate || item.eventDate || '',
    time: item.time || item.start_time || item.eventTime || '',
    location: item.location || item.venue || item.venue_name || '',
    image: item.image || item.banner_url || '',
    organizer: item.organizer || item.organizer_name || item.organizer_id || '',
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

const getEventDateValue = (event = {}) => {
    return event.start_date || event.date || event.event_date || event.startDate || event.eventDate || null
}

const isExpiredEvent = (event = {}) => {
    const dateValue = getEventDateValue(event)
    if (!dateValue) return false
    const eventTime = new Date(dateValue).getTime()
    return !Number.isNaN(eventTime) && eventTime < Date.now()
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

export const removeExpiredOrganizerEvents = async (organizerId) => {
    if (!supabase) throw new Error('Supabase client is not available')

    const { data, error } = await supabase
        .from('events')
        .select('id, start_date, date, event_date, organizer_id')
        .eq('organizer_id', organizerId)

    if (error) throw error
    if (!Array.isArray(data) || data.length === 0) return []

    const expired = data.filter((event) => isExpiredEvent(event))
    if (expired.length === 0) return []

    const expiredIds = expired.map((event) => event.id).filter(Boolean)
    const { error: deleteError } = await supabase.from('events').delete().in('id', expiredIds)
    if (deleteError) throw deleteError

    return expiredIds
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

export const getEvents = getAllEvents
export const saveEvent = createEvent

export default {
    createEvent,
    getAllEvents,
    getEventById,
    getOrganizerEvents,
    updateEvent,
    deleteEvent,
    getEvents,
    saveEvent,
}
