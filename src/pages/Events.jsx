import { useState, useMemo } from 'react'
import EventCard from '../components/EventCard'
import { getEvents } from '../services'
import formatDate from '../utils/formatDate'

const Events = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [priceFilter, setPriceFilter] = useState('All')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const events = useMemo(() => getEvents(), [])

  const categories = useMemo(() => {
    const set = new Set(events.map(s => s.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [events])

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (query && !e.title.toLowerCase().includes(query.toLowerCase())) return false
      if (category && category !== 'All' && e.category !== category) return false
      if (location && !e.location.toLowerCase().includes(location.toLowerCase())) return false
      if (date && new Date(e.date) < new Date(date)) return false
      if (priceFilter === 'Free' && String(e.price).toLowerCase() !== 'free') return false
      if (priceFilter === 'Paid' && String(e.price).toLowerCase() === 'free') return false
      return true
    })
  }, [events, query, category, location, date, priceFilter])

  // Reset page to 1 when any filter changes (handled inline in handlers below)

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-4">Events</h2>
      <div className="py-4">
        <div className="glass p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1); }} placeholder="Search events" className="w-full md:col-span-2 p-3 bg-transparent border border-white/10 rounded text-white" />
          <input value={location} onChange={e=>{ setLocation(e.target.value); setPage(1); }} placeholder="Location" className="w-full p-3 bg-transparent border border-white/10 rounded text-white" />
          <select value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }} className="p-3 bg-transparent border border-white/10 rounded text-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input value={date} onChange={e=>{ setDate(e.target.value); setPage(1); }} type="date" className="p-2 bg-transparent border border-white/10 rounded text-white" />
            <select value={priceFilter} onChange={e=>{ setPriceFilter(e.target.value); setPage(1); }} className="p-2 bg-transparent border border-white/10 rounded text-white">
              <option value="All">All Prices</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {(filtered.length === 0) ? (
          <div className="col-span-full text-center py-12 text-gray-500">No events found.</div>
        ) : (
          filtered.slice((page-1)*pageSize, page*pageSize).map(e => (
            <EventCard key={e.id} id={e.id} title={e.title} date={formatDate(e.date)} location={e.location} price={e.price} image={e.image} />
          ))
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-600">{filtered.length} events</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
          <div className="px-3">Page {page} / {Math.max(1, Math.ceil(filtered.length / pageSize))}</div>
          <button onClick={()=>setPage(p=>Math.min(Math.ceil(filtered.length / pageSize)||1,p+1))} disabled={page>=Math.ceil(filtered.length / pageSize)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}

export default Events
