import { Link } from 'react-router-dom'
import defaultImg from '../assets/hero.png'

const EventCard = ({ id, image, title = 'Event', date = 'TBD', location = 'Online', price = 'Free', category = 'General' }) => {
  return (
    <div className="bg-surface border border-surface rounded-3xl overflow-hidden flex flex-col transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-44 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img src={image || defaultImg} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs uppercase tracking-[0.2em] text-sky-500">{category}</div>
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mt-2">{title}</h3>
        <div className="text-sm text-slate-500 dark:text-slate-300 mt-3">{date} • {location}</div>
        <div className="mt-6 flex items-center justify-between">
          <div className="font-semibold text-slate-900 dark:text-white">{price}</div>
          <div className="flex items-center gap-2">
            <Link to={id ? `/events/${id}` : '/events'} className="text-sm text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">View Details</Link>
            <Link to={id ? `/events/${id}/register` : '/events'} className="px-3 py-2 rounded-xl bg-[#4F46E5] text-white transition hover:bg-[#4338CA]">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
