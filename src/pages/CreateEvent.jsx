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
    short_description: '',
    description: '',
    full_description: '',
    category: '',
    venue: '',
    city: '',
    state: '',
    country: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    capacity: 100,
    ticket_type: 'general',
    price: '',
    tags: '',
    organizer_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    facebook: '',
    instagram: '',
    banner_url: '',
  })
  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  const isOrganizer = role === 'organizer'
  const [bannerFile, setBannerFile] = useState(null)
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

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
          <input value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} type="date" placeholder="Start date" className="w-full p-3 border rounded" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.start_time} onChange={(e) => handleChange('start_time', e.target.value)} type="time" placeholder="Start time" className="w-full p-3 border rounded" />
          <input value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} type="date" placeholder="End date" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.end_time} onChange={(e) => handleChange('end_time', e.target.value)} type="time" placeholder="End time" className="w-full p-3 border rounded" />
          <input value={form.registration_deadline} onChange={(e) => handleChange('registration_deadline', e.target.value)} type="date" placeholder="Registration deadline" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={form.venue} onChange={(e) => handleChange('venue', e.target.value)} placeholder="Venue" className="w-full p-3 border rounded" required />
          <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" className="w-full p-3 border rounded" />
          <input value={form.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="State" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={form.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="Country" className="w-full p-3 border rounded" />
          <input value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Category" className="w-full p-3 border rounded" />
          <input value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} type="number" min="1" placeholder="Capacity" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.ticket_type} onChange={(e) => handleChange('ticket_type', e.target.value)} placeholder="Ticket type (e.g. general, vip)" className="w-full p-3 border rounded" />
          <input value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Price (e.g. Free or $49)" className="w-full p-3 border rounded" />
        </div>

        <textarea value={form.short_description} onChange={(e) => handleChange('short_description', e.target.value)} placeholder="Short description" className="w-full p-3 border rounded h-24" />
        <textarea value={form.full_description} onChange={(e) => handleChange('full_description', e.target.value)} placeholder="Full description" className="w-full p-3 border rounded h-40" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} placeholder="Tags (comma separated)" className="w-full p-3 border rounded" />
          <input value={form.organizer_name} onChange={(e) => handleChange('organizer_name', e.target.value)} placeholder="Organizer name" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} type="email" placeholder="Contact email" className="w-full p-3 border rounded" />
          <input value={form.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} placeholder="Contact phone" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={form.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} placeholder="Contact phone" className="w-full p-3 border rounded" />
          <input value={form.website} onChange={(e) => handleChange('website', e.target.value)} placeholder="Website" className="w-full p-3 border rounded" />
          <input value={form.facebook} onChange={(e) => handleChange('facebook', e.target.value)} placeholder="Facebook link" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={form.instagram} onChange={(e) => handleChange('instagram', e.target.value)} placeholder="Instagram link" className="w-full p-3 border rounded" />
          <div className="space-y-2">
            <label className="block text-sm">Banner image</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0] || null
              setBannerFile(file)
              if (file) setPreviewUrl(URL.createObjectURL(file))
            }} className="w-full p-3 border rounded" />
          </div>
        </div>

        {previewUrl && (
          <div className="mt-2">
            <div className="text-sm text-gray-400">Preview</div>
            <img src={previewUrl} alt="preview" className="w-full h-48 object-cover rounded mt-2" />
          </div>
        )}

        <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">{submitting ? 'Publishing...' : 'Publish Event'}</button>
      </form>

      {status && <div className="mt-4 p-3 bg-white/5 border border-theme rounded text-theme">{status}</div>}
    </div>
  )
}

export default CreateEvent
