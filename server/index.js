import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(cors())
app.use(express.json())

const SUPABASE_URL = (globalThis.process && globalThis.process.env && (globalThis.process.env.VITE_SUPABASE_URL || globalThis.process.env.SUPABASE_URL)) || ''
const SUPABASE_KEY = (globalThis.process && globalThis.process.env && (globalThis.process.env.VITE_SUPABASE_ANON_KEY || globalThis.process.env.SUPABASE_ANON_KEY)) || ''
const SUPABASE_SERVICE_KEY = (globalThis.process && globalThis.process.env && (globalThis.process.env.SUPABASE_SERVICE_KEY || globalThis.process.env.VITE_SUPABASE_SERVICE_KEY)) || ''
let supabase = null
let supabaseService = null
if (SUPABASE_URL) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  if (SUPABASE_SERVICE_KEY) {
    supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  } else {
    console.warn('[server] SUPABASE_SERVICE_KEY not set; write operations will be blocked by row-level security')
  }
  console.log('[server] supabase config', {
    url: !!SUPABASE_URL,
    anonKey: !!SUPABASE_KEY,
    serviceKey: !!SUPABASE_SERVICE_KEY,
  })
} else {
  console.warn('[server] SUPABASE_URL not set; API endpoints will return an error until configured')
}

const upload = multer()

// Simple API key middleware for write operations (if SERVER_API_KEY set)
const SERVER_API_KEY = (globalThis.process && globalThis.process.env && (globalThis.process.env.SERVER_API_KEY || globalThis.process.env.VITE_SERVER_API_KEY)) || ''
function requireApiKey(req, res, next) {
  if (!SERVER_API_KEY) return next()
  const key = req.headers['x-api-key'] || req.query.api_key
  if (!key || String(key) !== String(SERVER_API_KEY)) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

app.get('/api/events', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  try {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  try {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error) return res.status(500).json({ error })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

app.post('/api/events', requireApiKey, async (req, res) => {
  const payload = req.body || {}
  console.log('[server] raw event body', JSON.stringify(payload))
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  if (!supabaseService) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY is required for write operations' })

  const supportedEventColumns = new Set([
    'title',
    'short_description',
    'description',
    'category',
    'venue',
    'city',
    'start_date',
    'start_time',
    'price',
    'capacity',
    'banner_url',
    'organizer_id',
    'created_at',
  ])

  const normalizedPrice = (() => {
    if (payload.price === undefined || payload.price === null || payload.price === '') return 0
    if (typeof payload.price === 'number') return payload.price
    const text = String(payload.price).trim().toLowerCase()
    if (text === 'free' || text === '0' || text === '0.00') return 0
    const parsed = parseFloat(text.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(parsed) ? parsed : 0
  })()

  const normalizedPayload = {
    title: payload.title,
    description: payload.description || payload.short_description || '',
    category: payload.category || 'General',
    venue: payload.location || payload.venue || '',
    city: payload.city || '',
    start_date: payload.date || payload.start_date || payload.event_date || null,
    start_time: payload.time || payload.start_time || payload.event_time || null,
    price: normalizedPrice,
    capacity: payload.capacity ?? payload.seats ?? 0,
    banner_url: payload.banner_url || payload.image || payload.bannerUrl || null,
    organizer_id: payload.organizer_id || payload.organizerId || payload.creator || null,
    created_at: payload.created_at || payload.createdAt || new Date().toISOString(),
  }
  const cleanPayload = Object.entries(normalizedPayload).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '' && supportedEventColumns.has(key)) {
      acc[key] = value
    }
    return acc
  }, {})

  try {
    console.log('[server] create event payload', JSON.stringify(cleanPayload))
    const { data, error } = await supabaseService.from('events').insert([cleanPayload]).select().single()
    if (error) {
      console.log('[server] create event error', error)
      return res.status(500).json({ error })
    }
    console.log('[server] create event success', data)
    return res.status(201).json(data)
  } catch (err) {
    console.log('[server] create event exception', err)
    return res.status(500).json({ error: String(err) })
  }
})

// Registrations
app.post('/api/registrations', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  if (!supabaseService) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY is required for write operations' })
  const payload = req.body || {}
  try {
    // create registration
    const { data: reg, error: regErr } = await supabaseService.from('registrations').insert([payload]).select().single()
    if (regErr) return res.status(500).json({ error: regErr })

    // decrement event capacity if possible
    try {
      const eventId = payload.event_id || payload.eventId
      if (eventId) {
        const { data: eventRow, error: eventErr } = await supabaseService.from('events').select('capacity').eq('id', eventId).single()
        if (!eventErr && eventRow && typeof eventRow.capacity === 'number' && eventRow.capacity > 0) {
          await supabaseService.from('events').update({ capacity: eventRow.capacity - 1 }).eq('id', eventId)
        }
      }
    } catch { /* non-fatal */ }

    // create ticket record
    try {
      const ticketPayload = {
        ticket_id: payload.ticketId || payload.ticket_id,
        registration_id: reg.id,
        event_id: payload.eventId || payload.event_id,
        event_title: payload.eventTitle || payload.event_title,
        attendee_name: payload.name,
        attendee_email: payload.email,
        attendee_phone: payload.phone,
        ticket_type: payload.ticketType || payload.ticket_type,
        price: payload.price,
        qr_data: payload.qrData || payload.qr_data || null,
        created_at: reg.created_at || new Date().toISOString(),
      }
      await supabaseService.from('tickets').insert([ticketPayload])
    } catch { /* non-fatal */ }

    return res.status(201).json(reg)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

app.get('/api/registrations', requireApiKey, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  try {
    const { user, event } = req.query
    let q = supabase.from('registrations').select('*')
    if (user) q = q.eq('user_id', user)
    if (event) q = q.eq('event_id', event)
    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

app.get('/api/registrations/:id', requireApiKey, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('registrations').select('*').eq('id', id).single()
    if (error) return res.status(500).json({ error })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

// mark attendance / check-in
app.put('/api/registrations/:id/checkin', requireApiKey, async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' })
  try {
    const { id } = req.params
    const now = new Date().toISOString()
    const { data, error } = await supabase.from('attendance').insert([{ registration_id: id, checked_in: true, checked_in_time: now }]).select().single()
    if (error) return res.status(500).json({ error })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

app.put('/api/events/:id', requireApiKey, async (req, res) => {
  const { id } = req.params
  const payload = req.body || {}
  if (!supabaseService) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY is required for write operations' })
  try {
    const { data, error } = await supabaseService.from('events').update(payload).eq('id', id).select().single()
    if (error) return res.status(500).json({ error })
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

app.delete('/api/events/:id', requireApiKey, async (req, res) => {
  const { id } = req.params
  if (!supabaseService) return res.status(500).json({ error: 'SUPABASE_SERVICE_KEY is required for write operations' })
  try {
    const { data, error } = await supabaseService.from('events').delete().eq('id', id)
    if (error) return res.status(500).json({ error })
    return res.json({ success: true, data })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

// Upload endpoint: accepts multipart/form-data with field `file` and uploads to Supabase storage
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    const { error } = await supabaseService.storage.from('event-banners').upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false })
    if (error) return res.status(500).json({ error })
    const { data } = supabaseService.storage.from('event-banners').getPublicUrl(fileName)
    return res.json({ publicUrl: data?.publicUrl || null })
  } catch (err) {
    return res.status(500).json({ error: String(err) })
  }
})

const port = (globalThis.process && globalThis.process.env && globalThis.process.env.PORT) || 3001
app.listen(port, () => console.log(`API server listening on http://localhost:${port}`))
