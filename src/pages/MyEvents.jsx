import { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import EventCard from '../components/EventCard'
import { getOrganizerEvents } from '../services/eventService'
import AuthContext from '../context/AuthContext'
import { deleteEvent } from "../services/eventService";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const { user } = useContext(AuthContext) || {}
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const data = await getOrganizerEvents(user.id)
        setEvents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        Loading...
      </div>
    )
  }
  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEvent(eventId);

      setEvents((prev) =>
        prev.filter((event) => event.id !== eventId)
      );

      alert("Event deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete event.");
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {user && (
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>
      )}

      <main className={`${user ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
        <div>
          <h2 className="text-2xl font-semibold">My Events</h2>
          <p className="text-theme-weak">
            Your created events are listed below.
          </p>
        </div>


        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id}>
                <EventCard
                  id={event.id}
                  title={event.title}
                  date={event.start_date}
                  location={`${event.venue}, ${event.city}`}
                  price={event.price}
                  image={event.banner_url}
                />

                <div className="mt-3 flex gap-3">

                  <button
                    onClick={() => handleEdit(event.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    ✏️ Edit Event
                  </button>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    🗑 Delete Event
                  </button>

                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className="glass p-6 rounded text-theme-weak">
            No events found.
          </div>

        )}


      </main>
    </div>
  )
}

export default MyEvents
