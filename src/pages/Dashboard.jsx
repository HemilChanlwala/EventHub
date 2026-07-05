import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import { SampleLine } from '../components/ChartWrapper'
import EventCard from '../components/EventCard'
import { getEvents, saveEvent, deleteEvent } from '../services'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { generateCertificate } from '../utils/generateCertificate'
import { notify } from '../utils/notify'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const isOrganizer = Boolean(user?.role === 'organizer' || user?.email?.includes('organizer') || user?.user_metadata?.role === 'organizer')

  const [registrations, setRegistrations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eventhub_registrations') || '[]') } catch { return [] }
  })

  useEffect(() => {
    const onStorage = () => {
      try { setRegistrations(JSON.parse(localStorage.getItem('eventhub_registrations') || '[]')) } catch { setRegistrations([]) }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const events = getEvents()
  const organizerEvents = events.filter((event) => !user?.id || event.creator === user?.id)
  const userRegs = registrations.filter(r => !user || (user.email && r.email === user.email))
  const [upcomingCount, setUpcomingCount] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const now = Date.now()
        const count = userRegs.filter(r => {
          try {
            const ev = events.find(e => String(e.id) === String(r.eventId))
            return ev && new Date(ev.date).getTime() >= now
          } catch { return false }
        }).length
        setUpcomingCount(count)
      } catch { setUpcomingCount(0) }
    }, 0)
    return () => clearTimeout(id)
  }, [userRegs, events])

  const revenue = organizerEvents.reduce((sum, event) => {
    try {
      const price = typeof event.price === 'string' ? parseFloat(String(event.price).replace(/[^0-9.]/g, '')) || 0 : Number(event.price) || 0
      const seats = Number(event.seats) || 0
      return sum + price * seats
    } catch {
      return sum
    }
  }, 0)

  const stats = [
    { title: 'Registered Events', value: String(userRegs.length) },
    { title: 'Upcoming Events', value: String(upcomingCount) },
    { title: 'Tickets', value: String(userRegs.length) },
    ...(isOrganizer ? [{ title: 'Revenue', value: `$${Math.round(revenue).toLocaleString()}` }] : []),
  ]

  const chartData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [
      { label: 'Attendance', data: [12,19,8,17,14,20], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)' }
    ]
  }

  const handleCreate = (event) => {
    try {
      const toSave = { ...event, creator: user?.id }
      saveEvent(toSave)
      notify('Event created', 'info')
      window.location.reload()
    } catch (err) {
      console.warn(err)
      notify('Failed to create event', 'error')
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      deleteEvent(id)
      notify('Event deleted', 'info')
      window.location.reload()
    } catch (err) {
      console.warn(err)
      notify('Failed to delete', 'error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Welcome{user?.name ? `, ${user.name}` : ''}</h2>
              <p className="text-sm text-theme-weak">Overview of your activity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map(s => <StatsCard key={s.title} title={s.title} value={s.value} />)}
          </div>

          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Attendance (last 6 months)</h3>
            <SampleLine data={chartData} />
          </div>

          {isOrganizer && (
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Organizer Tools</h3>
                  <p className="text-sm text-theme-weak">Create, manage, and remove your events from one place.</p>
                </div>
                <a href="/organizer/checkin" className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">Open Check-In</a>
              </div>

              <CreateEventForm onCreate={handleCreate} />

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Your Events</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organizerEvents.slice(0, 6).map((event) => (
                    <div key={event.id} className="glass p-4 rounded">
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-theme-weak mt-1">{event.date} • {event.location}</div>
                      <div className="mt-3 flex gap-2">
                        <a href={`/events/${event.id}`} className="px-3 py-1 border rounded text-sm">View</a>
                        <button onClick={() => handleDelete(event.id)} className="px-3 py-1 border rounded text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Registered Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRegs.length ? (
                userRegs.map(r => (
                  <div key={r.ticketId} className="glass p-4 rounded">
                    <div className="font-semibold">{r.eventTitle}</div>
                    <div className="text-sm text-theme-weak">{r.ticketType} • {r.ticketId}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <a href={`/ticket/${r.ticketId}`} className="px-3 py-1 bg-white/5 text-theme rounded text-sm">View Ticket</a>
                      <button onClick={() => { try { generateCertificate(r); notify('Certificate downloaded') } catch (err) { void err } }} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Download Certificate</button>
                      <button onClick={() => {
                        try {
                          const all = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]')
                          const filtered = all.filter(x => x.ticketId !== r.ticketId)
                          localStorage.setItem('eventhub_registrations', JSON.stringify(filtered))
                          setRegistrations(filtered)
                          notify('Registration canceled', 'info')
                        } catch (err) { console.warn(err); notify('Failed to cancel', 'error') }
                      }} className="px-3 py-1 border rounded text-sm">Cancel</button>
                    </div>
                  </div>
                ))
              ) : (
                events.slice(0,3).map(e => (
                  <EventCard key={e.id} id={e.id} title={e.title} date={e.date} location={e.location} price={e.price} image={e.image} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard

function CreateEventForm({ onCreate }) {
  const [form, setForm] = useState({ title: '', date: '', location: '', price: '', category: '', seats: 100 })

  const submit = (e) => {
    e.preventDefault()
    try {
      const events = getEvents()
      const maxId = events.reduce((m, item) => Math.max(m, Number(item.id) || 0), 0)
      onCreate({ ...form, id: maxId + 1 })
      setForm({ title: '', date: '', location: '', price: '', category: '', seats: 100 })
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white/5 rounded">
      <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="p-2 bg-transparent border rounded" />
      <input required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" className="p-2 bg-transparent border rounded" />
      <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Venue/Location" className="p-2 bg-transparent border rounded" />
      <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (e.g. $49 or Free)" className="p-2 bg-transparent border rounded" />
      <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="p-2 bg-transparent border rounded" />
      <input value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} placeholder="Seats" className="p-2 bg-transparent border rounded" />
      <div className="md:col-span-2 text-right">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Event</button>
      </div>
    </form>
  )
}
