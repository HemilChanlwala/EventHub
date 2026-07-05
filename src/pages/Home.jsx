import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import EventCard from '../components/EventCard'
import formatDate from '../utils/formatDate'
import StatsCard from '../components/StatsCard'

const categories = ['Technology','Music','Sports','Workshop','Business','Startup','Seminar','Cultural']

const stats = [
  { label: 'Events', value: '500+' },
  { label: 'Users', value: '10k+' },
  { label: 'Tickets', value: '50k+' },
  { label: 'Organizers', value: '200+' },
]

const testimonials = [
  { id: 1, name: 'Alex Johnson', rating: 5, review: 'EventHub made finding and registering for events effortless.' },
  { id: 2, name: 'Maria Lee', rating: 5, review: 'Great platform for organizers and attendees alike.' },
  { id: 3, name: 'Sam Park', rating: 4, review: 'Smooth experience and useful recommendations.' },
]

const featuredEvents = []

const Home = () => {
  const { user, profile } = useContext(AuthContext)
  const role = profile?.role || user?.role || user?.user_metadata?.role || 'attendee'
  const isOrganizer = role === 'organizer'

  return (
    <div className="max-w-7xl mx-auto p-4">
      <section className="relative overflow-hidden min-h-[70vh] mb-8">
        <div className="orb purple" />
        <div className="orb cyan" />
        <div className="orb pink" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 py-12">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-theme leading-tight">Discover Amazing Events Near You</h1>
            <p className="mt-4 text-lg md:text-xl text-theme-weak">Find workshops, seminars, concerts and conferences.</p>
            <div className="mt-8 flex gap-4">
              <Link to="/events"><button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded font-semibold shadow-glow">Explore Events</button></Link>
              {isOrganizer && (
                <Link to="/create-event"><button className="px-6 py-3 border border-theme rounded text-theme-weak">Create Event</button></Link>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm">
              {featuredEvents[1] && (
                <EventCard id={featuredEvents[1].id} title={featuredEvents[1].title} date={formatDate(featuredEvents[1].date)} location={featuredEvents[1].location} price={featuredEvents[1].price} image={featuredEvents[1].image} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(c => (
            <div key={c} className="glass p-4 rounded-lg text-center text-theme-weak neon-hover">{c}</div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.slice(0,6).map(e => (
            <EventCard key={e.id} id={e.id} title={e.title} date={formatDate(e.date)} location={e.location} price={e.price} image={e.image} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map(s => (
            <StatsCard key={s.label} title={s.label} value={s.value} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-6">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="glass p-4 rounded shadow-sm text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/8 rounded-full flex items-center justify-center text-theme">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div>
                  <div className="font-semibold text-theme">{t.name}</div>
                  <div className="text-sm text-yellow-400">{'★'.repeat(t.rating)}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-theme-weak">{t.review}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
