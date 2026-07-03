import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import { SampleBar } from '../components/ChartWrapper'
import { getUsers, getEvents, deleteUser, deleteEvent, saveUser } from '../services'
import { exportCsv } from '../utils/exportCsv'
import { useEffect, useState } from 'react'

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '10k' },
    { title: 'Total Events', value: '520' },
    { title: 'Revenue', value: '$320k' },
  ]

  const barData = {
    labels: ['Jan','Feb','Mar','Apr','May'],
    datasets: [ { label: 'Revenue', data: [12000,20000,18000,24000,30000], backgroundColor: '#4f46e5' } ]
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Sidebar />
      </div>

      <div className="lg:col-span-3">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of platform metrics</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {stats.map(s => <StatsCard key={s.title} title={s.title} value={s.value} />)}
        </div>

        <div className="mt-6 p-4 bg-white rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Revenue (monthly)</h3>
          <SampleBar data={barData} />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-3">Users</h3>
              <div>
                <button onClick={() => exportCsv('users.csv', getUsers())} className="px-3 py-1 border rounded text-sm">Export CSV</button>
              </div>
            </div>
            <UsersList />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-3">Events</h3>
              <div>
                <button onClick={() => exportCsv('events.csv', getEvents())} className="px-3 py-1 border rounded text-sm">Export CSV</button>
              </div>
            </div>
            <EventsList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

function UsersList() {
  const [users, setUsers] = useState(() => getUsers())

  const refresh = () => setUsers(getUsers())

  return (
    <div className="space-y-2">
      {users.length === 0 && <div className="text-sm text-gray-400">No users</div>}
      {users.map(u => (
        <div key={u.id || u.email} className="p-3 bg-white/5 rounded flex items-center justify-between">
          <div>
            <div className="font-semibold">{u.name || u.email}</div>
            <div className="text-sm text-gray-400">{u.email} • {u.role || 'attendee'}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { saveUser({ ...u, role: u.role === 'organizer' ? 'attendee' : 'organizer' }); refresh() }} className="px-2 py-1 border rounded text-sm">{u.role === 'organizer' ? 'Demote' : 'Promote'}</button>
            <button onClick={() => { deleteUser(u.id || u.email); refresh() }} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function EventsList() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getEvents(true)
      setEvents(data)
    }
    load()
  }, [])

  const refresh = async () => {
    const data = await getEvents(true)
    setEvents(data)
  }

  return (
    <div className="space-y-2">
      {events.length === 0 && <div className="text-sm text-gray-400">No events</div>}
      {events.slice(0,12).map(e => (
        <div key={e.id} className="p-3 bg-white/5 rounded flex items-center justify-between">
          <div>
            <div className="font-semibold">{e.title}</div>
            <div className="text-sm text-gray-400">{e.date} • {e.location}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { deleteEvent(e.id); refresh() }} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
