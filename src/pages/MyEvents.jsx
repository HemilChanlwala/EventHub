import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getEvents } from '../services'

const MyEvents = () => {
  const events = useMemo(() => getEvents(), [])

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">My Events</h2>
          <p className="text-sm text-theme-weak">Manage and review your upcoming event activity.</p>
        </div>
        <Link to="/dashboard" className="px-3 py-2 border rounded">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, 6).map((event) => (
          <div key={event.id} className="glass rounded-2xl p-4">
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-theme-weak mt-1">{event.date} • {event.location}</div>
            <div className="mt-3 text-sm">{event.category}</div>
            <div className="mt-4 flex gap-2">
              <Link to={`/events/${event.id}`} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">View</Link>
              <Link to={`/events/${event.id}/register`} className="px-3 py-1 border rounded text-sm">Register</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyEvents
