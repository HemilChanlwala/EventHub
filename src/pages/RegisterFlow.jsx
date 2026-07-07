import { useContext, useEffect, useRef, useState } from 'react'
import { CalendarDays, Clock3, MapPin, User, Ticket as TicketIcon } from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEvents, saveRegistration } from '../services'
import { downloadTicketPdf } from '../utils/downloadTicket'
import formatDate from '../utils/formatDate'
import AuthContext from '../context/AuthContext'

const parsePrice = (p) => {
  if (!p) return 0
  if (typeof p === 'number') return p
  if (String(p).toLowerCase().includes('free')) return 0
  const digits = String(p).replace(/[^0-9.]/g, '')
  return Number(digits) || 0
}

function makeTicketId(eventId) {
  return `EVT-${eventId}-${String(Date.now()).slice(-6)}`
}

const RegisterFlow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [formExtra, setFormExtra] = useState({ college: '', address: '', city: '', state: '', notes: '' })
  const [ticketType, setTicketType] = useState('Standard')
  const [ticketId, setTicketId] = useState(null)
  const [processing, setProcessing] = useState(false)
  const ticketRef = useRef(null)
  const { user, profile } = useContext(AuthContext)

  useEffect(() => {
    const load = async () => {
      const events = await getEvents(true)
      const selected = events.find((e) => String(e.id) === String(id)) || events[0]
      setEvent(selected)
    }
    load()
  }, [id])

  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prevForm) => ({ ...prevForm, email: user.email }))
    }
    if (profile?.full_name && !form.name) {
      setForm((prevForm) => ({ ...prevForm, name: profile.full_name }))
    }
  }, [user, profile])

  if (!event) return <div className="p-8">Loading event…</div>

  const base = parsePrice(event.price)
  const ticketPrices = {
    Standard: base,
    VIP: Math.round(base * 1.3),
    Premium: Math.round(base * 1.6),
  }
  const price = ticketPrices[ticketType]

  const finalizeRegistration = async () => {
    const tid = makeTicketId(event.id)
    const qrData = JSON.stringify({ ticketId: tid, event: event.title })
    const reg = {
      ticketId: tid,
      eventId: event.id,
      eventTitle: event.title,
      name: form.name,
      email: form.email || user?.email,
      phone: form.phone,
      college: formExtra.college,
      address: formExtra.address,
      city: formExtra.city,
      state: formExtra.state,
      notes: formExtra.notes,
      ticketType,
      price,
      createdAt: new Date().toISOString(),
      qrData,
    }

    await saveRegistration(reg)
    setTicketId(tid)
    setStep(5)
  }

  const onSubmitStep = async (e) => {
    e?.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }
    if (step === 3) {
      if (price === 0) {
        await finalizeRegistration()
        return
      }
      setStep(4)
      return
    }
    if (step === 4) {
      setProcessing(true)
      try {
        await finalizeRegistration()
      } finally {
        setProcessing(false)
      }
    }
  }

  const qrData = step === 5 && ticketId ? encodeURIComponent(JSON.stringify({ ticketId, event: event.title })) : ''

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-4">
        <Link to={`/events/${event.id}`} className="text-sm text-indigo-300">← Back to event</Link>
        <h2 className="text-2xl font-semibold mt-2">Register — {event.title}</h2>
        <div className="text-sm text-gray-500">{formatDate(event.date)} • {event.location}</div>
      </div>

      {step === 1 && (
        <form onSubmit={onSubmitStep} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Full name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 bg-transparent border border-theme rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-3 bg-transparent border border-theme rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Phone</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-3 bg-transparent border border-theme rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="College / Company" value={formExtra.college} onChange={(e)=>setFormExtra({...formExtra, college: e.target.value})} className="p-3 bg-transparent border border-theme rounded" />
            <input placeholder="Address" value={formExtra.address} onChange={(e)=>setFormExtra({...formExtra, address: e.target.value})} className="col-span-1 md:col-span-2 p-3 bg-transparent border border-theme rounded" />
            <input placeholder="City" value={formExtra.city} onChange={(e)=>setFormExtra({...formExtra, city: e.target.value})} className="p-3 bg-transparent border border-theme rounded" />
            <input placeholder="State" value={formExtra.state} onChange={(e)=>setFormExtra({...formExtra, state: e.target.value})} className="p-3 bg-transparent border border-theme rounded" />
            <textarea placeholder="Notes" value={formExtra.notes} onChange={(e)=>setFormExtra({...formExtra, notes: e.target.value})} className="col-span-1 md:col-span-2 p-3 bg-transparent border border-theme rounded" />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onSubmitStep} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Ticket Type</label>
            <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} className="w-full p-3 bg-transparent border border-theme rounded">
              <option value="Standard">Standard — {event.price}</option>
              <option value="VIP">VIP — {priceToLabel(ticketPrices.VIP)}</option>
              <option value="Premium">Premium — {priceToLabel(ticketPrices.Premium)}</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded">Back</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review</h3>
          <div className="p-4 border rounded bg-white/5">
            <div className="flex justify-between"><div>Name</div><div>{form.name}</div></div>
            <div className="flex justify-between"><div>Email</div><div>{form.email}</div></div>
            <div className="flex justify-between"><div>Phone</div><div>{form.phone}</div></div>
            <div className="flex justify-between mt-2"><div>Ticket</div><div>{ticketType}</div></div>
            <div className="flex justify-between font-bold mt-1"><div>Total</div><div>{priceToLabel(price)}</div></div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={onSubmitStep} className="px-4 py-2 bg-indigo-600 text-white rounded">Confirm & Pay</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment</h3>
          <div className="p-4 border rounded bg-white/5">
            <div className="flex justify-between"><div>Ticket</div><div>{ticketType}</div></div>
            <div className="flex justify-between mt-2"><div>Amount</div><div>{priceToLabel(price)}</div></div>
            <div className="mt-3">
              <label className="block text-sm text-gray-300">Cardholder name</label>
              <input className="w-full p-3 bg-transparent border border-theme rounded" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                <input placeholder="Card number" className="col-span-2 p-3 bg-transparent border border-theme rounded" />
                <input placeholder="CVC" className="p-3 bg-transparent border border-theme rounded" />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="px-4 py-2 border rounded">Back</button>
            <button onClick={onSubmitStep} disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded">{processing ? 'Processing...' : `Pay ${priceToLabel(price)}`}</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div ref={ticketRef} className="rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-[0_40px_120px_rgba(15,23,42,0.28)]">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              {event.image ? (
                <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover opacity-90" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-slate-900 to-slate-800" />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative flex h-full flex-col justify-between p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/90">
                    <TicketIcon className="h-4 w-4" /> EventHub
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200">
                    Valid
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.26em] text-slate-200/80">Admit One</div>
                  <h3 className="text-3xl font-semibold leading-tight">{event.title}</h3>
                  <div className="text-sm text-slate-200/80">{event.location || 'Online Event'}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
              <div className="grid gap-6 lg:grid-cols-[1.7fr_1.3fr]">
                <div className="space-y-6">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Ticket #{ticketId}</div>
                        <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{event.title}</div>
                      </div>
                      <div className="rounded-3xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
                        <div className="uppercase tracking-[0.24em] text-slate-400">{ticketType}</div>
                        <div className="mt-2 text-xl">{price ? `$${price}` : 'Free'}</div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                        <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"><CalendarDays className="h-5 w-5" /></span>
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Date</div>
                          <div className="mt-1 text-sm font-semibold">{formatDate(event.date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                        <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><Clock3 className="h-5 w-5" /></span>
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Time</div>
                          <div className="mt-1 text-sm font-semibold">{event.time || 'TBD'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                        <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300"><MapPin className="h-5 w-5" /></span>
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</div>
                          <div className="mt-1 text-sm font-semibold">{event.location || 'Online'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
                        <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"><User className="h-5 w-5" /></span>
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Attendee</div>
                          <div className="mt-1 text-sm font-semibold">{form.name || 'Attendee'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 shadow-xl dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">QR code</div>
                      <div className="mt-2 text-sm font-semibold text-white">Scan at entry</div>
                    </div>
                    <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200">Valid</span>
                  </div>
                  <div className="mt-6 flex items-center justify-center rounded-[28px] bg-white/10 p-4">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`} alt="QR code" className="h-48 w-48 rounded-3xl bg-white p-2" />
                  </div>
                  <div className="mt-6 rounded-[24px] border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    <div className="font-semibold text-white">Ticket details</div>
                    <div className="mt-3 space-y-2 text-slate-400">
                      <div>Event: {event.title}</div>
                      <div>Ticket ID: {ticketId}</div>
                      <div>Issued by EventHub</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-300" />
                <div className="flex justify-center">
                  <span className="bg-white px-3 text-xs uppercase tracking-[0.26em] text-slate-500">Perforation</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-[28px] bg-slate-100 p-5 text-sm text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">EventHub</div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Premium access</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Notice</div>
                    <p>Please bring this ticket and a valid ID. Present the QR code at the venue entrance.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Support</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">help@eventhub.example</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => downloadTicketPdf({ eventTitle: event.title, ticketId }, ticketRef.current)} className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500">
              Download Ticket PDF
            </button>
            <button onClick={() => navigate('/dashboard')} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Go to Dashboard
            </button>
            <Link to={`/events/${event.id}`} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Back to Event
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function priceToLabel(n) {
  if (!n) return 'Free'
  return `$${n}`
}

export default RegisterFlow
