import { Link } from 'react-router-dom'
import { useMemo } from 'react'

const Tickets = () => {
  const registrations = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('eventhub_registrations') || '[]')
    } catch {
      return []
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Tickets</h2>
          <p className="text-sm text-theme-weak">View your generated tickets and QR-ready passes.</p>
        </div>
        <Link to="/dashboard" className="px-3 py-2 border rounded">Back to Dashboard</Link>
      </div>

      {registrations.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((registration) => (
            <div key={registration.ticketId} className="glass rounded-2xl p-4">
              <div className="font-semibold">{registration.eventTitle}</div>
              <div className="text-sm text-theme-weak mt-1">{registration.ticketType} • {registration.ticketId}</div>
              <div className="mt-3 flex gap-2">
                <Link to={`/ticket/${registration.ticketId}`} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Open Ticket</Link>
                <Link to="/dashboard" className="px-3 py-1 border rounded text-sm">Dashboard</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 text-sm text-theme-weak">No tickets yet. Register for an event to generate one.</div>
      )}
    </div>
  )
}

export default Tickets
