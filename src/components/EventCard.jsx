import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import defaultImg from '../assets/hero.png'

const EventCard = ({ id, image, title = 'Event', date = 'TBD', location = 'Online', price = 'Free', category = 'General' }) => {
  const detailsPath = id ? `/events/${id}` : '/events'
  const registerPath = id ? `/events/${id}/register` : '/events'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-surface bg-surface text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link to={detailsPath} className="relative block h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img src={image || defaultImg} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          {category || 'General'}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 dark:text-white">{title}</h3>

        <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-[#4F46E5]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-[#4F46E5]" />
            <span className="truncate">{location || 'Online'}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-surface pt-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Ticket size={17} className="text-[#4F46E5]" />
            {price || 'Free'}
          </div>
          <div className="flex items-center gap-2">
            <Link to={detailsPath} className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Details
            </Link>
            <Link to={registerPath} className="rounded-lg bg-[#4F46E5] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4338CA]">
              Register
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default EventCard
