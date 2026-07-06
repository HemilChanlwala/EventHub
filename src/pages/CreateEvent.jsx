import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import { saveEvent, uploadBanner } from "../services";

import {
  getEventById,
  updateEvent,
} from "../services/eventService";

import { notify } from "../utils/notify";


const CreateEvent = () => {

  const { user, profile } = useContext(AuthContext)
  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '',
    short_description: '',
    description: '',
    category: '',
    venue: '',
    city: '',
    state: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    capacity: '',
    event_type: '',
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
  useEffect(() => {
    if (!isEdit) return;

    const loadEvent = async () => {
      try {
        const event = await getEventById(id);

        setForm({
          title: event.title || "",
          short_description: event.short_description || "",
          description: event.description || "",
          category: event.category || "",
          venue: event.venue || "",
          city: event.city || "",
          state: event.state || "",
          start_date: event.start_date || "",
          end_date: event.end_date || "",
          start_time: event.start_time || "",
          end_time: event.end_time || "",
          capacity: event.capacity || "",
          event_type: event.event_type || "",
          price: event.price || "",
          banner_url: event.banner_url || "",
        });

        if (event.banner_url) {
          setPreviewUrl(event.banner_url);
        }
      } catch (err) {
        console.error(err);
        notify("Unable to load event", "error");
      }
    };

    loadEvent();
  }, [id]);
  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      let bannerUrl = form.banner_url
      if (bannerFile) {
        bannerUrl = await uploadBanner(bannerFile)
      }

      const eventData = {
        organizer_id: user.id,
        title: form.title,
        short_description: form.short_description,
        description: form.description,
        category: form.category,
        event_type: form.event_type || "General",
        venue: form.venue,
        city: form.city,
        state: form.state,
        country: "India",
        start_date: form.start_date,
        end_date: form.end_date,
        start_time: form.start_time,
        end_time: form.end_time,
        capacity: Number(form.capacity),
        price: Number(form.price) || 0,
        banner_url: bannerUrl,
        status: "Upcoming",
      };

      if (isEdit) {
        await updateEvent(id, eventData);
        notify("Event updated", "success");
      } else {
        await saveEvent(eventData);
        notify("Event created", "success");
      }

      setStatus('Event created successfully. You can view it on the Events page.')
      notify('Event created', 'success')
      navigate("/my-events");
    } catch (err) {
      console.warn(err)
      setStatus('Unable to create the event right now.')
      notify('Failed to create event', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-10 text-center">
        <h2>
          {isEdit ? "Edit Event" : "Create Event"}
        </h2>
        <p className="text-gray-400">Create a new event and make it discoverable on the Events page.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Event Information</h3>
          <div className="grid grid-cols-1 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Event Title</span>
              <input
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
                required
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Category</span>
              <input
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Music, Sports, Workshop"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Short Description</span>
              <textarea
                value={form.short_description}
                onChange={(e) => handleChange('short_description', e.target.value)}
                placeholder="A quick one-line summary"
                rows={3}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Full Description</span>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the event in detail"
                rows={6}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Date & Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Start Date</span>
              <input
                value={form.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                type="date"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                required
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Start Time</span>
              <input
                value={form.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                type="time"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">End Date</span>
              <input
                value={form.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                type="date"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">End Time</span>
              <input
                value={form.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                type="time"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Venue</span>
              <input
                value={form.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder="Event venue"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
                required
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">City</span>
              <input
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">State</span>
              <select
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
              >
                <option value="" disabled>Select state / UT</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Tickets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Capacity</span>
              <input
                value={form.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                type="number"
                min="1"
                placeholder="Maximum participants"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Event Type</span>
              <input
                value={form.event_type}
                onChange={(e) => handleChange('event_type', e.target.value)}
                placeholder="General, VIP, Free"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Price</span>
              <input
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="Free or $49"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Organizer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Organizer Name</span>
              <input
                value={form.organizer_name}
                onChange={(e) => handleChange('organizer_name', e.target.value)}
                placeholder="Organizer name"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Tags</span>
              <input
                value={form.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Contact & Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Contact Email</span>
              <input
                value={form.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                type="email"
                placeholder="Contact email"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Contact Phone</span>
              <input
                value={form.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="Contact phone"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Website</span>
              <input
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="Website"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Facebook</span>
              <input
                value={form.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="Facebook link"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Instagram</span>
              <input
                value={form.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="Instagram link"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500"
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-700 bg-zinc-950/40 p-6">
          <h3 className="text-xl font-semibold">Media</h3>
          <div className="space-y-4">
            <label className="space-y-2 text-sm">
              <span className="text-gray-300">Banner Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setBannerFile(file)
                  if (file) setPreviewUrl(URL.createObjectURL(file))
                }}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
              />
            </label>
            {previewUrl && (
              <div className="rounded-3xl border border-zinc-700 overflow-hidden">
                <img src={previewUrl} alt="preview" className="w-full h-52 object-cover" />
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button type="button" onClick={() => navigate("/my-events")} className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-200">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60">
            {submitting
              ? isEdit
                ? "Updating..."
                : "Publishing..."
              : isEdit
                ? "Update Event"
                : "Create Event"}
          </button>
        </div>
      </form>

      {status && <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-950/60 p-4 text-theme">{status}</div>}
    </div>
  )
}

export default CreateEvent
