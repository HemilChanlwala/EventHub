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
    </div>
  )
}

export default Tickets
