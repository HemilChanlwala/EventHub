import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { saveEvent, uploadBanner } from '../services'
import { notify } from '../utils/notify'

const CreateEvent = () => {
  const { user, profile } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    price: '',
    category: '',
    capacity: 100,
    description: '',
    banner_url: '',
  })
  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  const isOrganizer = role === 'organizer'

  if (!isOrganizer) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-lg border border-red-500 bg-red-950/60 p-6 text-red-100">
          <h2 className="text-2xl font-semibold mb-3">Only organizers can create events</h2>
          <p>Please register as an organizer to create events. If you already registered as an organizer, log out and log back in to refresh your role.</p>
        </div>
      </div>
    )
  }
  const [bannerFile, setBannerFile] = useState(null)
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      let bannerUrl = form.banner_url
      if (bannerFile) {
        bannerUrl = await uploadBanner(bannerFile)
      }

      await saveEvent({
        ...form,
        image: bannerUrl || form.banner_url,
        banner_url: bannerUrl || form.banner_url,
        organizer_id: user?.id || 'guest',
        creator: user?.id || 'guest',
        capacity: Number(form.capacity) || 0,
        price: form.price || 'Free',
      })

      setStatus('Event created successfully. You can view it on the Events page.')
      notify('Event created', 'success')
      navigate('/events')
    } catch (err) {
      console.warn(err)
      setStatus('Unable to create the event right now.')
      notify('Failed to create event', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Create Event</h2>
      <p className="text-theme-weak mb-6">Create a new event and make it discoverable on the Events page.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Event title" className="w-full p-3 border rounded" required />
          <input value={form.date} onChange={(e) => handleChange('date', e.target.value)} type="date" className="w-full p-3 border rounded" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.time} onChange={(e) => handleChange('time', e.target.value)} type="time" className="w-full p-3 border rounded" />
          <input value={form.venue} onChange={(e) => handleChange('venue', e.target.value)} placeholder="Venue" className="w-full p-3 border rounded" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" className="w-full p-3 border rounded" />
          <input value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Price (e.g. Free or $49)" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Category" className="w-full p-3 border rounded" />
          <input value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} type="number" min="1" placeholder="Capacity" className="w-full p-3 border rounded" />
        </div>

        <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Description" className="w-full p-3 border rounded h-40" />

        <div className="space-y-2">
          <label className="block text-sm">Banner image</label>
          <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="w-full p-3 border rounded" />
        </div>

        <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">{submitting ? 'Creating...' : 'Create Event'}</button>
      </form>

      {status && <div className="mt-4 p-3 bg-white/5 border border-theme rounded text-theme">{status}</div>}
    </div>
  )
}

export default CreateEvent
