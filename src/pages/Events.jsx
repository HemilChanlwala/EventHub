import { useEffect, useMemo, useState } from 'react'
import EventCard from '../components/EventCard'
import { getEvents } from '../services'
import formatDate from '../utils/formatDate'

const Events = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [priceFilter, setPriceFilter] = useState('All')
  const [sortBy, setSortBy] = useState('latest')
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    const load = async () => {
      const data = await getEvents(true)
      setEvents(data)
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(events.map((s) => s.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [events])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (query && !String(e.title || '').toLowerCase().includes(query.toLowerCase())) return false
      if (category && category !== 'All' && e.category !== category) return false
      if (location && !String(e.location || '').toLowerCase().includes(location.toLowerCase())) return false
      if (date && new Date(e.date) < new Date(date)) return false
      if (priceFilter === 'Free' && String(e.price).toLowerCase() !== 'free') return false
      if (priceFilter === 'Paid' && String(e.price).toLowerCase() === 'free') return false
      return true
    })
  }, [events, query, category, location, date, priceFilter])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    switch (sortBy) {
      case 'oldest':
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date))
      case 'price-asc':
        return copy.sort((a, b) => (parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0) - (parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0))
      case 'price-desc':
        return copy.sort((a, b) => (parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0) - (parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0))
      case 'popular':
        return copy.sort((a, b) => (Number(b.attendees || b.seats || 0) - Number(a.attendees || a.seats || 0)))
      case 'latest':
      default:
        return copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  }, [filtered, sortBy])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-4">Events</h2>
      <div className="py-4">
        <div className="glass p-4 grid grid-cols-1 md:grid-cols-6 gap-4">
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} placeholder="Search events" className="w-full md:col-span-2 p-3 bg-transparent border border-theme rounded text-theme" />
          <input value={location} onChange={(e) => { setLocation(e.target.value); setPage(1) }} placeholder="Location" className="w-full p-3 bg-transparent border border-theme rounded text-theme" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} className="w-full min-w-0 p-3 bg-transparent border border-theme rounded text-theme">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={date} onChange={(e) => { setDate(e.target.value); setPage(1) }} type="date" className="w-full min-w-0 p-2 bg-transparent border border-theme rounded text-theme" />
          <select value={priceFilter} onChange={(e) => { setPriceFilter(e.target.value); setPage(1) }} className="w-full min-w-0 p-2 bg-transparent border border-theme rounded text-theme">
            <option value="All">All Prices</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1) }} className="w-full min-w-0 p-2 bg-transparent border border-theme rounded text-theme">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price Low → High</option>
            <option value="price-desc">Price High → Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-theme-weak">No events found.</div>
        ) : (
          sorted.slice((page - 1) * pageSize, page * pageSize).map((e) => (
            <EventCard key={e.id} id={e.id} title={e.title} date={formatDate(e.date)} location={e.location} price={e.price} image={e.image} />
          ))
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-theme-weak">{filtered.length} events</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
          <div className="px-3">Page {page} / {Math.max(1, Math.ceil(filtered.length / pageSize))}</div>
          <button onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / pageSize) || 1, p + 1))} disabled={page >= Math.ceil(filtered.length / pageSize)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}

export default Events
