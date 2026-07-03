import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEvents } from '../services'
import formatDate from '../utils/formatDate'

const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    const load = async () => {
      const events = await getEvents(true)
      const selected = events.find((e) => String(e.id) === String(id)) || events[0]
      setEvent(selected)
    }
    load()
  }, [id])

  if (!event) return <div className="p-8">Event not found.</div>

  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="h-64 bg-gray-200 rounded mb-4 overflow-hidden flex items-center justify-center text-gray-500">
          {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> : 'Banner'}
        </div>
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <div className="text-sm text-gray-500 mt-2">{formatDate(event.date)} • {event.location}</div>
        <p className="mt-4 text-gray-700">{event.description}</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Schedule</h2>
          <ul className="space-y-2">
            <li>Starts: {formatDate(event.date)} {event.time || ''}</li>
            <li>Venue: {event.venue || event.location}</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Speakers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.speakers?.map((s, i) => (
              <div key={i} className="p-4 border rounded">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-500">{s.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Reviews</h2>
          <div className="space-y-4">
            {event.reviews && event.reviews.length > 0 ? event.reviews.map((r) => (
              <div key={r.id} className="p-4 border rounded">
                <div className="font-semibold">{r.name} — {'★'.repeat(r.rating)}</div>
                <div className="text-sm text-gray-600 mt-1">{r.comment}</div>
              </div>
            )) : <div className="text-sm text-gray-500">No reviews yet.</div>}
          </div>
        </section>
      </div>

      <aside className="p-6 border rounded h-fit">
        <div className="text-sm text-gray-500">Category</div>
        <div className="text-xl font-bold mt-1">{event.category}</div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Price</div>
          <div className="text-2xl font-bold">{event.price}</div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500">Seats</div>
          <div className="text-lg">{event.capacity || event.seats || 0}</div>
        </div>

        <Link to={`/events/${event.id}/register`} className="mt-6 w-full inline-block text-center px-4 py-2 bg-indigo-600 text-white rounded">Register</Link>
      </aside>
    </div>
  )
}

export default EventDetails
