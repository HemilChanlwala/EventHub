import { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import EventCard from '../components/EventCard'
import { getEvents } from '../services'
import AuthContext from '../context/AuthContext'

const MyEvents = () => {
  const { user } = useContext(AuthContext)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getEvents(true)
      setEvents(data.filter((event) => String(event.creator) === String(user?.id)))
    }
    load()
  }, [user?.id])

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <Sidebar />
      </aside>
      <main className="lg:col-span-3 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">My Events</h2>
          <p className="text-theme-weak">Your created events are listed below.</p>
        </div>

        {events.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} id={event.id} title={event.title} date={event.date} location={event.location} price={event.price} image={event.image} />
            ))}
          </div>
        ) : (
          <div className="glass p-6 rounded text-theme-weak">No events found. Create an event on the Organizer Dashboard.</div>
        )}
      </main>
    </div>
  )
}

export default MyEvents
