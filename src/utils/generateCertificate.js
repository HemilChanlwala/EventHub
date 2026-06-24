import { jsPDF } from 'jspdf'
import { formatDate } from './formatDate'

export function generateCertificate(reg = {}) {
  try {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const w = doc.internal.pageSize.getWidth()
    const h = doc.internal.pageSize.getHeight()

    // white background
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, w, h, 'F')

    // decorative border
    doc.setDrawColor(99, 102, 241)
    doc.setLineWidth(6)
    doc.rect(24, 24, w - 48, h - 48)

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(32)
    doc.setTextColor(99, 102, 241)
    doc.text('Certificate of Attendance', w / 2, 120, { align: 'center' })

    // Subtitle
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(80, 80, 80)
    doc.text('This certifies that', w / 2, 160, { align: 'center' })

    // Name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.setTextColor(32, 32, 32)
    doc.text(reg.name || 'Participant', w / 2, 200, { align: 'center' })

    // Event line
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(16)
    const dateText = formatDate(reg.createdAt || reg.date || new Date().toISOString())
    const eventLine = `has attended "${reg.eventTitle || 'Event'}" on ${dateText}`
    doc.text(eventLine, w / 2, 240, { align: 'center', maxWidth: w - 160 })

    // Ticket id
    doc.setFontSize(12)
    doc.setTextColor(120, 120, 120)
    doc.text(`Ticket ID: ${reg.ticketId || ''}`, w / 2, 270, { align: 'center' })

    // Signature placeholder
    doc.setLineWidth(0.6)
    doc.line(w / 2 - 120, h - 120, w / 2 + 120, h - 120)
    doc.setFontSize(12)
    doc.text('Organizer Signature', w / 2, h - 100, { align: 'center' })

    // filename
    const safe = (str = '') => String(str).replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_')
    const filename = `${safe(reg.eventTitle || 'event')}_${safe(reg.name || 'participant')}_${safe(reg.ticketId || 'ticket')}.pdf`
    doc.save(filename)
  } catch (err) {
    console.error('generateCertificate error', err)
  }
}

export default generateCertificate
