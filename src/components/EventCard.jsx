import { Link } from 'react-router-dom'
import defaultImg from '../assets/hero.png'

const EventCard = ({ id, image, title = 'Event', date = 'TBD', location = 'Online', price = 'Free', category = 'General' }) => {
  return (
    <div className="glass overflow-hidden rounded-xl flex flex-col transition-transform duration-200 hover:-translate-y-1">
      <div className="h-44 bg-gray-800 overflow-hidden rounded-t-xl">
        <img src={image || defaultImg} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs uppercase tracking-wide text-indigo-400">{category}</div>
        <h3 className="font-semibold text-lg text-theme mt-1">{title}</h3>
        <div className="text-sm text-theme-weak mt-2">{date} • {location}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-bold text-theme">{price}</div>
          <div className="flex items-center gap-2">
            <Link to={id ? `/events/${id}` : '/events'} className="text-sm text-theme-weak hover:underline">View Details</Link>
            <Link to={id ? `/events/${id}/register` : '/events'} className="px-3 py-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
