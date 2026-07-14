import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const safeFilename = (text = '') => String(text)
  .replace(/[\\/:*?"<>|]/g, '')
  .replace(/\s+/g, '-')
  .replace(/_+/g, '-')
  .trim()

const addTicketDetails = (pdf, registration) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const left = 48
  let y = 72
  const detail = (label, value) => {
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(79, 70, 229)
    pdf.setFontSize(10)
    pdf.text(label.toUpperCase(), left, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(30, 41, 59)
    pdf.setFontSize(15)
    const lines = pdf.splitTextToSize(String(value || 'TBD'), pageWidth - 96)
    y += 19
    pdf.text(lines, left, y)
    y += lines.length * 17 + 18
  }

  pdf.setFillColor(79, 70, 229)
  pdf.rect(0, 0, pageWidth, 28, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.text('EVENTHUB • OFFICIAL EVENT TICKET', left, 18)
  pdf.setTextColor(15, 23, 42)
  pdf.setFontSize(28)
  pdf.text('Admit One', left, y)
  y += 42
  detail('Event', registration.eventTitle)
  detail('Attendee', registration.name || registration.fullName || registration.userName)
  detail('Date and time', [registration.eventDate || registration.date, registration.eventTime || registration.time].filter(Boolean).join(' • '))
  detail('Location', registration.eventLocation || registration.location || registration.venue)
  detail('Ticket', `${registration.ticketType || 'General Admission'} • ${registration.ticketId || 'Ticket ID pending'}`)
  pdf.setDrawColor(148, 163, 184)
  pdf.setLineDashPattern([4, 4], 0)
  pdf.line(left, pageHeight - 64, pageWidth - left, pageHeight - 64)
  pdf.setLineDashPattern([], 0)
  pdf.setFontSize(10)
  pdf.setTextColor(71, 85, 105)
  pdf.text('Present this ticket and a valid ID at the event entrance.', left, pageHeight - 40)
}

export async function downloadTicketPdf(registration = {}, captureElement = null) {
  const filename = `${safeFilename(registration.eventTitle || 'EventHub')}-${safeFilename(registration.ticketId || 'ticket')}.pdf`
  try {
    if (!captureElement) {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', compress: true })
      addTicketDetails(pdf, registration)
      pdf.save(filename)
      return true
    }

    const canvas = await html2canvas(captureElement, {
      scale: Math.min(1.25, window.devicePixelRatio || 1),
      useCORS: true,
      backgroundColor: '#0f172a',
      logging: false,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.78)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4', compress: true })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 24
    const maxWidth = pageWidth - margin * 2
    const maxHeight = pageHeight - margin * 2

    const imgProps = pdf.getImageProperties(imgData)
    const ratio = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height)
    const imgWidth = imgProps.width * ratio
    const imgHeight = imgProps.height * ratio
    const x = (pageWidth - imgWidth) / 2
    const y = (pageHeight - imgHeight) / 2

    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST')

    pdf.save(filename)
    return true
  } catch (err) {
    console.error('downloadTicketPdf error', err)
    // Remote event banners and QR images can make a DOM capture unavailable. A
    // text ticket remains valid and guarantees the download action still works.
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', compress: true })
      addTicketDetails(pdf, registration)
      pdf.save(filename)
      return true
    } catch (fallbackError) {
      console.error('ticket PDF fallback error', fallbackError)
      return false
    }
  }
}

export default {
  downloadTicketPdf,
}
