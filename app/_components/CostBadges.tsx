/** Compact build-cost badge row for the app detail page.
 *  Surfaces generation effort metadata as scannable chips:
 *  model + effort, generation duration, follow-up count, error fixes, provider. */
import { formatDuration } from '@/lib/format'

interface Props {
  model: string
  effort?: string
  provider?: string
  generationDurationSeconds: number | null
  followUpCount: number
  errorFixes: number
  timeToFirstVersionMinutes: number | null
}

const EFFORT_LABELS: Record<string, string> = {
  low: 'Low effort',
  medium: 'Medium effort',
  high: 'High effort',
  'xhigh': 'X-High effort',
  max: 'Max effort',
  default: '',
}

const EFFORT_COLORS: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  high: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  xhigh: 'bg-red-50 text-red-700 ring-red-600/20',
  max: 'bg-red-50 text-red-700 ring-red-600/20',
}

function Chip({ label, color, title }: { label: string; color?: string; title?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${color ?? 'bg-stone-50 text-stone-600 ring-stone-500/20'}`}
      title={title}
    >
      {label}
    </span>
  )
}

export default function CostBadges({
  model,
  effort,
  provider,
  generationDurationSeconds,
  followUpCount,
  errorFixes,
  timeToFirstVersionMinutes,
}: Props) {
  const effortLabel = effort ? EFFORT_LABELS[effort] : ''
  const effortColor = effort ? EFFORT_COLORS[effort] : undefined
  const durationLabel = formatDuration(generationDurationSeconds, timeToFirstVersionMinutes)

  return (
    <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Build cost summary">
      {/* Model + effort */}
      <Chip
        label={effortLabel ? `${model} · ${effortLabel}` : model}
        color="bg-indigo-50 text-indigo-700 ring-indigo-600/20"
        title={`Model: ${model}${effort ? `, effort: ${effort}` : ''}`}
      />

      {/* Provider */}
      {provider && (
        <Chip
          label={provider}
          color="bg-sky-50 text-sky-700 ring-sky-600/20"
          title={`API provider: ${provider}`}
        />
      )}

      {/* Generation duration */}
      {durationLabel && (
        <Chip
          label={`${durationLabel}`}
          color="bg-stone-50 text-stone-600 ring-stone-500/20"
          title={`Generation duration: ${durationLabel}`}
        />
      )}

      {/* Follow-up count */}
      {followUpCount > 0 && (
        <Chip
          label={`${followUpCount} follow-up${followUpCount !== 1 ? 's' : ''}`}
          color="bg-violet-50 text-violet-700 ring-violet-600/20"
          title={`${followUpCount} follow-up prompt${followUpCount !== 1 ? 's' : ''} sent`}
        />
      )}

      {/* Error fixes */}
      {errorFixes > 0 && (
        <Chip
          label={`${errorFixes} fix${errorFixes !== 1 ? 'es' : ''}`}
          color="bg-amber-50 text-amber-700 ring-amber-600/20"
          title={`${errorFixes} error fix${errorFixes !== 1 ? 'es' : ''} needed`}
        />
      )}

      {/* No follow-ups + no errors = single-shot clean generation */}
      {followUpCount === 0 && errorFixes === 0 && (
        <Chip
          label="Single shot"
          color="bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          title="Generated in a single attempt, no follow-ups needed"
        />
      )}
    </div>
  )
}
