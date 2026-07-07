import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import EventCard from '../components/EventCard'
import { getEvents, deleteEvent, getRegistrations, getRegistrationsFromServer, saveEvent, removeExpiredOrganizerEvents } from '../services'
import AuthContext from '../context/AuthContext'
import { notify } from '../utils/notify'
import exportCsv from '../utils/exportCsv'
import { EVENT_CATEGORIES } from '../constants/eventCategories'

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext)

  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        if (user?.id) {
          await removeExpiredOrganizerEvents(user.id)
        }
      } catch (err) {
        console.warn('Failed to remove expired organizer events', err)
      }

      const data = await getEvents(true)
      setEvents(data)
      const serverRegs = await getRegistrationsFromServer()
      setRegistrations(serverRegs.length ? serverRegs : getRegistrations())
    }
    load()
  }, [user?.id])

  useEffect(() => {
    const onStorage = () => setRegistrations(getRegistrations())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const myEvents = events.filter(e => !user?.id || String(e.creator) === String(user?.id))

  useEffect(() => {
    if (!selectedEventId && myEvents.length > 0) {
      setSelectedEventId(String(myEvents[0].id))
    }
  }, [myEvents, selectedEventId])

  const selectedEvent = myEvents.find(e => String(e.id) === String(selectedEventId)) || myEvents[0] || null
  const myRegistrations = registrations.filter(r => myEvents.some(e => String(e.id) === String(r.eventId)))
  const selectedAttendees = selectedEvent ? registrations.filter(r => String(r.eventId) === String(selectedEvent.id)) : []

  const revenue = myEvents.reduce((sum, e) => {
    try {
      const p = typeof e.price === 'string' ? parseFloat(String(e.price).replace(/[^0-9.]/g, '')) || 0 : Number(e.price) || 0
      const seats = Number(e.capacity || e.seats) || 0
      return sum + p * seats
    } catch { return sum }
  }, 0)

  const stats = [
    { title: 'Revenue', value: `$${Math.round(revenue).toLocaleString()}` },
    { title: 'Events', value: String(myEvents.length) },
    { title: 'Attendees', value: String(myRegistrations.length) },
  ]

  const handleCreate = async (ev) => {
    try {
      const toSave = { ...ev, creator: user?.id }
      await saveEvent(toSave)
      const data = await getEvents(true)
      setEvents(data)
      notify('Event created', 'info')
    } catch (err) { console.warn(err); notify('Failed to create event', 'error') }
  }

  const handleExportAttendees = () => {
    if (!selectedEvent) return
    const rows = selectedAttendees.map((attendee) => ({
      ticketId: attendee.ticketId,
      name: attendee.name,
      email: attendee.email,
      phone: attendee.phone,
      ticketType: attendee.ticketType,
      price: attendee.price,
      checkedIn: attendee.checkedIn ? 'Yes' : 'No',
      eventId: attendee.eventId,
      eventTitle: attendee.eventTitle,
      registeredAt: attendee.createdAt || attendee.created_at || '',
    }))
    exportCsv(`attendees-${selectedEvent.title || selectedEvent.id}.csv`, rows)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      deleteEvent(id)
      const data = await getEvents(true)
      setEvents(data)
      notify('Event deleted', 'info')
    } catch (err) { console.warn(err); notify('Failed to delete', 'error') }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Sidebar />
      </div>

      <div className="lg:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Organizer Dashboard</h2>
            <p className="text-sm text-gray-500">Manage your events and view revenue</p>
          </div>
          <div>
            <Link to="/organizer/checkin" className="px-3 py-1 bg-indigo-600 text-white rounded">Open Check-In</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {stats.map(s => <StatsCard key={s.title} title={s.title} value={s.value} />)}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Create Event</h3>
          <CreateEventForm onCreate={handleCreate} />

          <div className="mt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Attendee roster</h3>
                <p className="text-sm text-gray-500">View attendee details for any of your events.</p>
              </div>
              <button onClick={handleExportAttendees} className="px-3 py-2 border rounded text-sm">Export attendees</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Event</label>
                <select value={selectedEventId || ''} onChange={(e) => setSelectedEventId(e.target.value)} className="w-full p-3 bg-transparent border rounded">
                  {myEvents.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white/5 rounded">
                  <div className="text-sm text-gray-400">Attendees</div>
                  <div className="text-lg font-semibold">{selectedAttendees.length}</div>
                </div>
                <div className="p-3 bg-white/5 rounded">
                  <div className="text-sm text-gray-400">Checked In</div>
                  <div className="text-lg font-semibold">{selectedAttendees.filter((r) => r.checkedIn).length}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
            {selectedAttendees.length > 0 ? selectedAttendees.map((attendee) => (
              <div key={attendee.ticketId} className="p-4 bg-white/5 rounded">
                <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{attendee.name || attendee.email}</div>
                      <div className="text-sm text-gray-400">{attendee.email} • {attendee.phone}</div>
                    </div>
                    <div className="text-sm text-theme-weak">{attendee.ticketType}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                    <span>Ticket: {attendee.ticketId}</span>
                    <span>Price: {attendee.price}</span>
                    <span>{attendee.checkedIn ? 'Checked in' : 'Not checked in'}</span>
                  </div>
                </div>
              )) : (
                <div className="p-4 bg-white/5 rounded text-gray-400">No attendees found for this event yet.</div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 mt-6">Your Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myEvents.slice(0,6).map(e => (
              <div key={e.id} className="relative">
                <EventCard id={e.id} title={e.title} date={e.date} location={e.location} price={e.price} image={e.image} />
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleDelete(e.id)} className="px-3 py-1 border rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizerDashboard

function CreateEventForm({ onCreate }) {
  // canonical keys: start_date, venue, capacity
  const [form, setForm] = useState({ title: '', start_date: '', venue: '', price: '', category: '', capacity: 100 })

  const submit = async (e) => {
    e.preventDefault()
    try {
      const ev = { ...form }
      await onCreate(ev)
      setForm({ title: '', start_date: '', venue: '', price: '', category: '', capacity: 100 })
    } catch (err) { console.warn(err) }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white/5 rounded">
      <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" className="p-2 bg-transparent border rounded" />
      <input required value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} type="date" className="p-2 bg-transparent border rounded" />
      <input value={form.venue} onChange={e=>setForm({...form, venue: e.target.value})} placeholder="Venue/Location" className="p-2 bg-transparent border rounded" />
      <input value={form.price} onChange={e=>setForm({...form, price: e.target.value})} placeholder="Price (e.g. $49 or Free)" className="p-2 bg-transparent border rounded" />
      <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="p-2 bg-transparent border rounded">
        <option value="" disabled>Select category</option>
        {EVENT_CATEGORIES.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <input value={form.capacity} onChange={e=>setForm({...form, capacity: e.target.value})} placeholder="Capacity" className="p-2 bg-transparent border rounded" />
      <div className="md:col-span-2 text-right">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Event</button>
      </div>
    </form>
  )
}
