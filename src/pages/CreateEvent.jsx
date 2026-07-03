import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { saveEvent, getEvents } from '../services'
import { notify } from '../utils/notify'

const CreateEvent = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    price: '',
    category: '',
    seats: 100,
    description: '',
  })
  const [status, setStatus] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const events = getEvents()
    const maxId = events.reduce((currentMax, item) => Math.max(currentMax, Number(item.id) || 0), 0)
    saveEvent({ ...form, id: maxId + 1, creator: user?.id || 'guest' })
    setStatus('Event created successfully. You can view it on the Events page.')
    notify('Event created', 'success')
    navigate('/events')
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
      <p className="text-theme-weak mb-6">Create a new event and make it discoverable on the Events page.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Event title"
            className="w-full p-3 border rounded"
            required
          />
          <input
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            type="date"
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Location"
            className="w-full p-3 border rounded"
            required
          />
          <input
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Price (e.g. Free or $49)"
            className="w-full p-3 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Category"
            className="w-full p-3 border rounded"
          />
          <input
            value={form.seats}
            onChange={(e) => handleChange('seats', e.target.value)}
            type="number"
            min="1"
            placeholder="Seats"
            className="w-full p-3 border rounded"
          />
        </div>

        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description"
          className="w-full p-3 border rounded h-40"
        />

        <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Save Event</button>
      </form>

      {status && <div className="mt-4 p-3 bg-white/5 border border-theme rounded text-theme">{status}</div>}
    </div>
  )
}

export default CreateEvent
