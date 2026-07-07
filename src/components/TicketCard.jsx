import { useRef } from 'react'
import { downloadTicketPdf } from '../utils/downloadTicket'

const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'TBD'
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }
  catch { return dateStr || 'TBD' }
}

const formatTime = (dateStr) => {
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'TBD'
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }
  catch { return dateStr || 'TBD' }
}

const TicketCard = ({ registration }) => {
  const captureRef = useRef(null)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ ticketId: registration.ticketId, event: registration.eventTitle }))}`
  const bannerUrl = registration.eventBanner || registration.banner || registration.image || ''
  const organizerName = registration.organizerName || registration.organizer || registration.organizer_name || 'EventHub'
  const eventDate = registration.eventDate || registration.date || registration.event_date || ''
  const eventTime = registration.eventTime || registration.time || registration.startTime || eventDate
  const venue = registration.eventLocation || registration.location || registration.venue || 'TBD Venue'
  const userName = registration.name || registration.fullName || registration.userName || 'Attendee'
  const registrationDate = registration.registrationDate || registration.registeredAt || registration.createdAt || new Date().toISOString()

  return (
    <div className="relative">
      <div className="glass p-5 rounded-3xl shadow-lg border border-surface">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">{registration.eventTitle}</h3>
            <p className="text-sm text-theme-weak">Ticket ID: {registration.ticketId}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-sm font-medium">{registration.ticketType || 'General Admission'}</span>
            <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm">{registration.price || 'Free'}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm text-theme-weak">
              <div>
                <div className="font-semibold text-white">Date</div>
                <div>{formatDate(eventDate)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Time</div>
                <div>{formatTime(eventTime)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Venue</div>
                <div>{venue}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Organizer</div>
                <div>{organizerName}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-theme-weak">
              <div>
                <div className="font-semibold text-white">Name</div>
                <div>{userName}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Email</div>
                <div>{registration.email}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Registration</div>
                <div>{formatDate(registrationDate)}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Status</div>
                <span className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-sm font-medium text-white">Valid</span>
              </div>
            </div>

            <div className="mt-3">
              <img src={qrUrl} alt="Ticket QR" className="max-w-[200px] rounded-xl border border-surface bg-surface-soft" />
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 text-white shadow-inner shadow-black/20">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">EventHub Ticket</div>
              <h4 className="mt-4 text-2xl font-semibold">{registration.eventTitle}</h4>
              <p className="mt-3 text-sm text-slate-300">A professional PDF ticket will be generated with event details and QR code.</p>
            </div>

            <button
              type="button"
              onClick={() => downloadTicketPdf({
                ...registration,
                eventBanner: bannerUrl,
                eventDate,
                eventTime,
                eventLocation: venue,
                organizerName,
                userName,
                registrationDate,
                qrUrl,
              }, captureRef.current)}
              className="mt-auto rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Download Ticket
            </button>
          </div>
        </div>
      </div>

      <div
        ref={captureRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '960px',
          padding: '24px',
          background: 'linear-gradient(135deg, #e0e7ff, #f8fafc)',
          pointerEvents: 'none',
          opacity: 1,
          visibility: 'visible',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div style={{ width: '912px', borderRadius: '30px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 30px 90px rgba(15,23,42,.22)', border: '1px solid rgba(99,102,241,.22)' }}>
          <div style={{ position: 'relative', padding: '34px 40px 30px', color: '#fff', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)' }}>
            <div style={{ position: 'absolute', right: '-70px', top: '-90px', width: '240px', height: '240px', borderRadius: '999px', background: 'rgba(255,255,255,.14)' }} />
            <div style={{ position: 'absolute', left: '300px', bottom: '-90px', width: '220px', height: '220px', borderRadius: '999px', background: 'rgba(255,255,255,.10)' }} />

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '.02em' }}>EventHub</div>
                <div style={{ fontSize: '12px', marginTop: '7px', letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.78)' }}>Official Event Ticket</div>
              </div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.22em', background: 'rgba(255,255,255,0.18)', padding: '10px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,.24)' }}>Valid</div>
            </div>

            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: '26px', marginTop: '34px', alignItems: 'end' }}>
              <div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.24em', color: 'rgba(255,255,255,.72)' }}>Admit One</div>
                <div style={{ fontSize: '38px', lineHeight: 1.08, fontWeight: 900, marginTop: '10px' }}>{registration.eventTitle}</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '18px', fontSize: '13px', color: 'rgba(255,255,255,.86)' }}>
                  <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.14)' }}>{formatDate(eventDate)}</span>
                  <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.14)' }}>{formatTime(eventTime)}</span>
                  <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.14)' }}>{venue}</span>
                </div>
              </div>

              <div style={{ borderRadius: '24px', overflow: 'hidden', height: '132px', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.18)' }}>
                {bannerUrl ? (
                  <img src={bannerUrl} alt="Event Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.72)' }}>
                    EventHub
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '0', backgroundColor: '#fff' }}>
            <div style={{ padding: '34px 34px 30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '16px' }}>
                {[
                  ['Attendee', userName],
                  ['Ticket Type', registration.ticketType || 'General Admission'],
                  ['Organizer', organizerName],
                  ['Registration', formatDate(registrationDate)],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '18px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{label}</div>
                    <div style={{ marginTop: '8px', color: '#0f172a', fontSize: '16px', fontWeight: 800 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '18px', padding: '18px', borderRadius: '20px', background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                <div style={{ fontSize: '10px', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Ticket ID</div>
                <div style={{ marginTop: '8px', color: '#1e1b4b', fontSize: '14px', fontWeight: 800, wordBreak: 'break-all' }}>{registration.ticketId}</div>
              </div>
            </div>

            <div style={{ position: 'relative', padding: '34px 28px', background: '#0f172a', color: '#fff', borderLeft: '2px dashed #cbd5e1' }}>
              <div style={{ position: 'absolute', left: '-15px', top: '-15px', width: '30px', height: '30px', borderRadius: '999px', background: '#e0e7ff' }} />
              <div style={{ position: 'absolute', left: '-15px', bottom: '-15px', width: '30px', height: '30px', borderRadius: '999px', background: '#e0e7ff' }} />
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.24em', color: '#93c5fd' }}>Scan at entry</div>
              <div style={{ marginTop: '18px', padding: '12px', borderRadius: '22px', background: '#fff' }}>
                <img src={qrUrl} alt="QR code" style={{ width: '170px', height: '170px', display: 'block' }} crossOrigin="anonymous" />
              </div>
              <div style={{ marginTop: '18px', padding: '12px 14px', borderRadius: '18px', background: 'rgba(34,197,94,.16)', color: '#bbf7d0', fontSize: '12px', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '.18em' }}>Valid Ticket</div>
              <p style={{ marginTop: '18px', color: '#cbd5e1', lineHeight: 1.5, fontSize: '12px' }}>
                Present this QR code with a valid ID at the event entrance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
