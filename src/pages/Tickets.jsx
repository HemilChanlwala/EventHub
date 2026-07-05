<<<<<<< HEAD
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
=======
import { useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const Tickets = () => {
  const { user } = useContext(AuthContext)

  const registrations = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('eventhub_registrations') || '[]').filter((item) => item.email === user?.email)
    } catch {
      return []
    }
  }, [user])

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <Sidebar />
      </aside>
      <main className="lg:col-span-3">
        <h2 className="text-2xl font-semibold mb-3">Tickets</h2>
        {registrations.length ? (
          <div className="grid grid-cols-1 gap-4">
            {registrations.map((registration) => (
              <div key={registration.ticketId} className="glass p-4 rounded">
                <div className="font-semibold">{registration.eventTitle}</div>
                <div className="text-sm text-theme-weak">Ticket ID: {registration.ticketId}</div>
                <div className="mt-2 text-sm">Type: {registration.ticketType}</div>
                <div className="mt-2 text-sm">Price: {registration.price}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-6 rounded text-theme-weak">You have no tickets yet. Register for an event to get started.</div>
        )}
      </main>
>>>>>>> 0f19eb8170bee855413ca446d0c70e85c092e0b9
    </div>
  )
}

export default Tickets
