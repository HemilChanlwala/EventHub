import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import { SampleLine } from '../components/ChartWrapper'
import EventCard from '../components/EventCard'
import { getEvents } from '../services'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { generateCertificate } from '../utils/generateCertificate'
import { notify } from '../utils/notify'

const Dashboard = () => {
  const { user } = useContext(AuthContext)

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

  const stats = [
    { title: 'Registered Events', value: String(userRegs.length) },
    { title: 'Upcoming Events', value: String(upcomingCount) },
    { title: 'Tickets', value: String(userRegs.length) },
  ]

  const chartData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [
      { label: 'Attendance', data: [12,19,8,17,14,20], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)' }
    ]
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
