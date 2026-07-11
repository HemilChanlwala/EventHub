import { supabase } from '../lib/supabase'

const DEFAULT_COUNTRY = 'India'
const DEFAULT_STATUS = 'Upcoming'

const buildEventPayload = (event = {}) => {
    const payload = {
        organizer_id: event.organizer_id,
        title: event.title || '',
        short_description: event.short_description || '',
        description: event.description || '',
        category: event.category || '',
        venue: event.venue || '',
        city: event.city || '',
        state: event.state || '',
        country: event.country || DEFAULT_COUNTRY,
        start_date: event.start_date || null,
        end_date: event.end_date || null,
        start_time: event.start_time || null,
        end_time: event.end_time || null,
        price: event.price || '0',
        capacity: Math.max(1, Number(event.capacity) || 1),
        banner_url: event.banner_url || '',
        status: event.status || DEFAULT_STATUS,
    }

    const allowedColumns = [
        'organizer_id',
        'title',
        'short_description',
        'description',
        'category',
        'venue',
        'city',
        'state',
        'country',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'price',
        'capacity',
        'banner_url',
        'status',
    ]

    return Object.fromEntries(
        Object.entries(payload).filter(([key, value]) => allowedColumns.includes(key) && value !== undefined)
    )
}

const normalizeEvent = (item = {}) => ({
    ...item,
    price: item.price ?? 0,
    capacity: Number(item.capacity ?? item.seats ?? 0),
    event_type: item.event_type || item.ticket_type || 'General',
    short_description: item.short_description || '',
    description: item.description || '',
    date: item.date || item.start_date || item.event_date || item.startDate || item.eventDate || '',
    time: item.time || item.start_time || item.eventTime || item.event_time || '',
    location: item.location || item.venue || item.venue_name || '',
    image: item.image || item.banner_url || '',
    organizer: item.organizer || item.organizer_name || item.organizer_id || '',
    tags: item.tags || [],
})

export const createEvent = async (event) => {
    if (!supabase) throw new Error('Supabase client is not available')

    const payload = buildEventPayload(event)
    const { data, error } = await supabase.from('events').insert([payload]).select('*').single()
    if (error) throw error

    return normalizeEvent(data)
}

export const getAllEvents = async () => {
    if (!supabase) throw new Error('Supabase client is not available')

    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (error) throw error

    const events = Array.isArray(data) ? data.map(normalizeEvent) : []
    return events.filter((event) => !isExpiredEvent(event))
}

export const getEventById = async (id) => {
    if (!supabase) throw new Error('Supabase client is not available')

    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error) throw error

    const event = normalizeEvent(data)
    if (isExpiredEvent(event)) {
        throw new Error('Event has expired')
    }

    return event
}

const getEventDateValue = (event = {}) => {
    return event.start_date || event.date || event.event_date || event.startDate || event.eventDate || null
}

const getEventExpiryDateValue = (event = {}) => {
    return event.end_date || event.endDate || getEventDateValue(event)
}

const isExpiredEvent = (event = {}) => {
    const dateValue = getEventExpiryDateValue(event)
    if (!dateValue) return false
    const eventTime = new Date(dateValue).getTime()
    if (Number.isNaN(eventTime)) return false

    const expiryDate = new Date(eventTime)
    expiryDate.setHours(23, 59, 59, 999)
    return expiryDate.getTime() < Date.now()
}

const removeExpiredEvents = async (events = []) => {
    const expired = events.filter((event) => isExpiredEvent(event))
    // Browsing events must never delete organizer data. Expired events are
    // filtered at read time; archival or deletion belongs in an admin job.
    return expired
}

export const getOrganizerEvents = async (organizerId) => {
    if (!supabase) throw new Error('Supabase client is not available')

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false })

    if (error) throw error

    const events = Array.isArray(data) ? data.map(normalizeEvent) : []
    return events.filter((event) => !isExpiredEvent(event))
}

export const removeExpiredOrganizerEvents = async (organizerId) => {
    if (!supabase) throw new Error('Supabase client is not available')

    const { data, error } = await supabase
        .from('events')
        .select('id, start_date, end_date, organizer_id')
        .eq('organizer_id', organizerId)

    if (error) throw error
    if (!Array.isArray(data) || data.length === 0) return []

    const expired = await removeExpiredEvents(data)
    return expired.map((event) => event.id).filter(Boolean)
}

export const updateEvent = async (id, updates) => {
    if (!supabase) throw new Error('Supabase client is not available')

    // Keep updates aligned with the columns used by the existing events table.
    // In particular, never send form-only or newly introduced fields (such as
    // `tags`) before the database migration that adds them has been applied.
    const payload = buildEventPayload(updates)
    delete payload.organizer_id

    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().single()
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
