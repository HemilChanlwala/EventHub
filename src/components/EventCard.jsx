import { Link } from 'react-router-dom'
import defaultImg from '../assets/hero.png'

const EventCard = ({ id, image, title = 'Event', date = 'TBD', location = 'Online', price = 'Free' }) => {
  return (
    <div className="glass overflow-hidden rounded-xl flex flex-col">
      <div className="h-44 bg-gray-800 overflow-hidden rounded-t-xl">
        <img src={image || defaultImg} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-theme">{title}</h3>
        <div className="text-sm text-theme-weak mt-2">{date} • {location}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-bold text-theme">{price}</div>
          <div className="flex items-center gap-2">
            <Link to={id ? `/events/${id}` : '/events'} className="text-sm text-theme-weak hover:underline">View</Link>
            <button aria-label={`Register for ${title}`} className="px-3 py-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded">Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
