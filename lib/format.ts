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
