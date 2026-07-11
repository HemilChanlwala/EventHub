import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, MapPin, Search, Sparkles, Ticket } from 'lucide-react'
import AuthContext from '../context/AuthContext'
import EventCard from '../components/EventCard'
import formatDate from '../utils/formatDate'
import StatsCard from '../components/StatsCard'
import { EVENT_CATEGORIES } from '../constants/eventCategories'
import { getEvents } from '../services'
import heroImage from '../assets/hero.png'
import aiWorkshopImage from '../assets/event_ai_workshop.png'
import musicFestImage from '../assets/event_music_fest.png'
import startupPitchImage from '../assets/event_startup_pitch.png'

const stats = [
  { label: 'Events', value: '500+' },
  { label: 'Users', value: '10k+' },
  { label: 'Tickets', value: '50k+' },
  { label: 'Organizers', value: '200+' },
]

const fallbackEvents = [
  {
    id: null,
    title: 'Applied AI Workshop',
    date: '2026-08-12',
    location: 'Bengaluru',
    price: 'Free',
    category: 'Technology',
    image: aiWorkshopImage,
  },
  {
    id: null,
    title: 'City Music Fest',
    date: '2026-08-18',
    location: 'Mumbai',
    price: 'Rs 799',
    category: 'Music',
    image: musicFestImage,
  },
  {
    id: null,
    title: 'Startup Pitch Night',
    date: '2026-08-24',
    location: 'Delhi',
    price: 'Rs 499',
    category: 'Startup',
    image: startupPitchImage,
  },
]

const testimonials = [
  { id: 1, name: 'Alex Johnson', rating: 5, review: 'EventHub made finding and registering for events effortless.' },
  { id: 2, name: 'Maria Lee', rating: 5, review: 'The organizer dashboard keeps our team focused before event day.' },
  { id: 3, name: 'Sam Park', rating: 4, review: 'Fast discovery, clear tickets, and useful event recommendations.' },
]

const Home = () => {
  const { user, profile } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(0)
  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  const isOrganizer = role === 'organizer'
  const featuredEvents = useMemo(() => {
    const liveEvents = events.length > 0 ? events : fallbackEvents
    return liveEvents.slice(0, 6)
  }, [events])

  useEffect(() => {
    let active = true

    const loadEvents = async () => {
      try {
        const data = await getEvents(true)
        if (active && Array.isArray(data)) setEvents(data)
      } catch (error) {
        console.warn('Unable to load featured events', error)
      }
    }

    loadEvents()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (featuredEvents.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setHighlightIndex((current) => (current + 1) % featuredEvents.length)
    }, 10000)

    return () => window.clearInterval(timer)
  }, [featuredEvents.length])

  useEffect(() => {
    if (highlightIndex >= featuredEvents.length) {
      setHighlightIndex(0)
    }
  }, [featuredEvents.length, highlightIndex])

  const highlight = featuredEvents[highlightIndex] || fallbackEvents[0]

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <section className="relative mb-12 min-h-[72vh] overflow-hidden rounded-2xl bg-slate-950 text-white">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92),rgba(15,23,42,0.72),rgba(15,23,42,0.18))]" />

        <div className="relative grid min-h-[72vh] grid-cols-1 items-center gap-8 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-10 lg:px-14">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur">
              <Sparkles size={16} />
              Curated events for curious people
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">Discover events worth showing up for</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
              Find workshops, concerts, conferences, pitch nights, and local experiences with quick registration and clear tickets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/events" className="btn btn-primary gap-2 rounded-lg">
                Explore Events
                <ArrowRight size={18} />
              </Link>
              {isOrganizer && (
                <Link to="/create-event" className="btn btn-secondary rounded-lg">Create Event</Link>
              )}
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {stats.slice(0, 3).map((item) => (
                <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden justify-end md:flex">
            <div className="w-full max-w-md rounded-lg border border-white/15 bg-white/12 p-4 text-left shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">Next highlight</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">{highlight.title}</h2>
                </div>
                <Ticket className="text-sky-300" size={28} />
              </div>
              <img src={highlight.image || heroImage} alt="" className="h-56 w-full rounded-lg object-cover" />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
                <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3">
                  <CalendarDays size={16} />
                  {formatDate(highlight.date)}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3">
                  <MapPin size={16} />
                  {highlight.location || 'Online'}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {featuredEvents.map((event, index) => (
                    <button
                      key={event.id || event.title}
                      type="button"
                      aria-label={`Show highlight ${index + 1}`}
                      onClick={() => setHighlightIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${index === highlightIndex ? 'w-7 bg-sky-300' : 'w-2.5 bg-white/35 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-300">Ongoing Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 text-left">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">Browse by interest</p>
            <h2 className="text-3xl font-semibold">Categories</h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5]">
            View all events
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EVENT_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/events?category=${encodeURIComponent(category)}`}
              className="group flex items-center justify-between rounded-lg border border-surface bg-surface p-4 text-theme transition hover:-translate-y-1 hover:shadow-soft"
            >
              {category}
              <Search size={16} className="text-theme-weak transition group-hover:text-[#4F46E5]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10 text-left">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">Upcoming</p>
          <h2 className="text-3xl font-semibold">Featured Events</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id || event.title}
              id={event.id}
              title={event.title}
              date={formatDate(event.date)}
              location={event.location}
              price={event.price}
              image={event.image}
              category={event.category}
            />
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatsCard key={item.label} title={item.label} value={item.value} />
          ))}
        </div>
      </section>

      <section className="py-10 text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">Reviews</p>
        <h2 className="mb-6 text-3xl font-semibold">What People Say</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-lg border border-surface bg-surface p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-semibold text-white">
                  {testimonial.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="font-semibold text-theme">{testimonial.name}</div>
                  <div className="text-sm font-semibold text-amber-500">{`${testimonial.rating}.0 / 5`}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-theme-weak">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
