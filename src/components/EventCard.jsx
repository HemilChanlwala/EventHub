// Renders a reusable event summary card with links to details and registration.
import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import defaultImg from '../assets/hero.png'

const EventCard = ({ id, image, title = 'Event', date = 'TBD', location = 'Online', price = 'Free', category = 'General' }) => {
  const detailsPath = id ? `/events/${id}` : '/events'
  const registerPath = id ? `/events/${id}/register` : '/events'

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/15 bg-white/10 text-left shadow-[0_20px_60px_rgba(31,38,135,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_72px_rgba(91,95,239,0.2)]">
      <Link to={detailsPath} className="relative block h-52 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img src={image || defaultImg} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-md">
          {category || 'General'}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-slate-900/40 px-2.5 py-1 text-[10px] font-medium text-slate-100 backdrop-blur-md">
          {date}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-[var(--text-strong)]">{title}</h3>

        <div className="mt-4 space-y-2 text-sm text-[var(--text-weak)]">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-[var(--primary)]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-[var(--primary)]" />
            <span className="truncate">{location || 'Online'}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 font-semibold text-[var(--text-strong)]">
            <Ticket size={17} className="text-[var(--primary)]" />
            {price || 'Free'}
          </div>
          <div className="flex items-center gap-2">
            <Link to={detailsPath} className="rounded-full px-3 py-2 text-sm font-medium text-[var(--text-weak)] transition hover:text-[var(--text-strong)]">
              Details
            </Link>
            <Link to={registerPath} className="rounded-xl bg-[linear-gradient(135deg,#5B5FEF,#8B5CF6,#06B6D4)] px-3.5 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(91,95,239,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(91,95,239,0.38)]">
              Register
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default EventCard
