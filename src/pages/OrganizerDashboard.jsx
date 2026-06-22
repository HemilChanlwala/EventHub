import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import EventCard from '../components/EventCard'
import { getEvents, saveEvent, deleteEvent } from '../services'
import AuthContext from '../context/AuthContext'
import { notify } from '../utils/notify'

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext)

  const [events, setEvents] = useState(() => getEvents())

  useEffect(() => {
    const onStorage = () => setEvents(getEvents())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const myEvents = events.filter(e => !user?.id || e.creator === user?.id)

  const revenue = events.reduce((sum, e) => {
    try {
      const p = typeof e.price === 'string' ? parseFloat(String(e.price).replace(/[^0-9.]/g, '')) || 0 : Number(e.price) || 0
      const seats = Number(e.seats) || 0
      return sum + p * seats
    } catch { return sum }
  }, 0)

  const stats = [
    { title: 'Revenue', value: `$${Math.round(revenue).toLocaleString()}` },
    { title: 'Events', value: String(myEvents.length) },
    { title: 'Attendees', value: '—' },
  ]

  const handleCreate = (ev) => {
    try {
      const toSave = { ...ev, creator: user?.id }
      saveEvent(toSave)
      setEvents(getEvents())
      notify('Event created', 'info')
    } catch (err) { console.warn(err); notify('Failed to create event', 'error') }
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this event?')) return
    try {
      deleteEvent(id)
      setEvents(getEvents())
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
  const [form, setForm] = useState({ title: '', date: '', location: '', price: '', category: '', seats: 100 })

  const submit = (e) => {
    e.preventDefault()
    try {
      const events = getEvents()
      const maxId = events.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0)
      const ev = { ...form, id: maxId + 1 }
      onCreate(ev)
      setForm({ title: '', date: '', location: '', price: '', category: '', seats: 100 })
    } catch (err) { console.warn(err) }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white/5 rounded">
      <input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" className="p-2 bg-transparent border rounded" />
      <input required value={form.date} onChange={e=>setForm({...form, date: e.target.value})} type="date" className="p-2 bg-transparent border rounded" />
      <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Venue/Location" className="p-2 bg-transparent border rounded" />
      <input value={form.price} onChange={e=>setForm({...form, price: e.target.value})} placeholder="Price (e.g. $49 or Free)" className="p-2 bg-transparent border rounded" />
      <input value={form.category} onChange={e=>setForm({...form, category: e.target.value})} placeholder="Category" className="p-2 bg-transparent border rounded" />
      <input value={form.seats} onChange={e=>setForm({...form, seats: e.target.value})} placeholder="Seats" className="p-2 bg-transparent border rounded" />
      <div className="md:col-span-2 text-right">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Event</button>
      </div>
    </form>
  )
}
