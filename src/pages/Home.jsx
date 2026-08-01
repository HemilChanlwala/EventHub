// Builds the landing page with hero content, featured events, categories, and platform highlights.
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
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <section className="relative mb-12 overflow-hidden rounded-[32px] border border-white/15 bg-[radial-gradient(circle_at_top_left,rgba(91,95,239,0.36),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(17,24,39,0.82),rgba(30,41,59,0.68))] px-5 py-10 text-white shadow-[0_32px_90px_rgba(15,23,42,0.35)] md:px-10 lg:px-14">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.82),rgba(15,23,42,0.66),rgba(28,25,23,0.2))]" />

        <div className="relative grid min-h-[72vh] grid-cols-1 items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <Sparkles size={16} className="text-cyan-300" />
              Curated events for curious people
            </div>
            <h1 className="mt-6 max-w-xl text-white">Discover events worth showing up for</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
              Find workshops, concerts, conferences, pitch nights, and local experiences with quick registration and clear tickets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/events" className="btn btn-primary gap-2 rounded-2xl px-6 py-4 text-base font-semibold shadow-[0_18px_34px_rgba(91,95,239,0.32)]">
                Explore Events
                <ArrowRight size={18} />
              </Link>
              {isOrganizer && (
                <Link to="/create-event" className="btn btn-primary gap-2 rounded-2xl px-6 py-4 text-base font-semibold shadow-[0_18px_34px_rgba(91,95,239,0.32)]">
                  Create Event
                </Link>
              )}
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {stats.slice(0, 3).map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.18)] backdrop-blur-md">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden justify-end md:flex">
            <div className="floaty w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-4 text-left shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">Next highlight</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">{highlight.title}</h2>
                </div>
                <Ticket className="text-cyan-300" size={28} />
              </div>
              <img src={highlight.image || heroImage} alt="" className="h-56 w-full rounded-[20px] object-cover" />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-3">
                  <CalendarDays size={16} />
                  {formatDate(highlight.date)}
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-3">
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
                      className={`h-2.5 rounded-full transition-all ${index === highlightIndex ? 'w-7 bg-cyan-300' : 'w-2.5 bg-white/35 hover:bg-white/60'}`}
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Browse by interest</p>
            <h2>Categories</h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
            View all events
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EVENT_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/events?category=${encodeURIComponent(category)}`}
              className="group flex items-center justify-between rounded-[20px] border border-white/15 bg-white/10 p-4 text-[var(--text-strong)] shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(91,95,239,0.14)]"
            >
              {category}
              <Search size={16} className="text-[var(--text-weak)] transition group-hover:text-[var(--primary)]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10 text-left">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Upcoming</p>
          <h2>Featured Events</h2>
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
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Reviews</p>
        <h2 className="mb-6">What People Say</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-card p-5 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5B5FEF,#8B5CF6,#06B6D4)] text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,95,239,0.28)]">
                  {testimonial.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-strong)]">{testimonial.name}</div>
                  <div className="text-sm font-semibold text-amber-500">{`${testimonial.rating}.0 / 5`}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--text-weak)]">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
