/** Format a duration for display. Prefers seconds precision; falls back to minutes. */
export function formatDuration(seconds: number | null, minutes: number | null): string | null {
  if (seconds != null) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    if (m === 0) return `${s}s`
    if (s === 0) return `${m}m`
    return `${m}m ${s}s`
  }
  if (minutes != null) return `${minutes}m`
  return null
}

/** Relative time for recent dates ("just now", "3h ago", "2d ago"); falls back to an absolute date. */
export function formatRelativeDate(iso: string, now: number = Date.now()): string | null {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return null
  const diffSec = Math.max(0, Math.floor((now - t) / 1000))
  const min = Math.floor(diffSec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (diffSec < 60) return 'just now'
  if (min < 60) return `${min}m ago`
  if (hr < 24) return `${hr}h ago`
  if (day < 30) return `${day}d ago`
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
