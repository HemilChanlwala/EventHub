export function formatDate(dateStr) {
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'TBD'
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return 'TBD'
  }
}

export default formatDate
