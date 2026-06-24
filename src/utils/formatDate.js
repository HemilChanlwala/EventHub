export function formatDate(dateStr) {
  try { return new Date(dateStr).toLocaleDateString() }
  catch { return dateStr }
}

export default formatDate
