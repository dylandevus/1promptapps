'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { AppEntry } from '@/lib/types'
import { EDIT_LEVEL_LABELS, EDIT_LEVEL_COLORS, ISSUE_LABELS, ISSUE_COLORS, USABLE_COLOR } from '@/lib/constants'
import { formatDuration, formatRelativeDate } from '@/lib/format'
import { CopyButton } from '@/app/_components/CopyButton'

interface Props {
  apps: AppEntry[]
  categories: string[]
  builtWithOptions: string[]
  models: string[]
  techStack: string[]
  allTags: string[]
  categoryLabels: Record<string, string>
  builtWithLabels: Record<string, string>
}


function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${color ?? 'bg-stone-50 text-stone-600 ring-stone-500/20'}`}
    >
      {label}
    </span>
  )
}

function AppCard({ app, categoryLabels, builtWithLabels }: {
  app: AppEntry
  categoryLabels: Record<string, string>
  builtWithLabels: Record<string, string>
}) {
  return (
    <div className="group relative rounded-xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <Link
        href={app.path}
        className="block"
      >
        {/* Thumbnail */}
        <div className="w-full aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={app.thumbnail}
            alt={`${app.name} screenshot`}
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="font-semibold text-sm mb-0.5 truncate" style={{ color: 'var(--ink)' }}>
            {app.name}
          </h2>
          <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--muted)' }}>
            {app.tagline}
          </p>

          {/* Identity pills: category + model (purple) + usability */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge
              label={categoryLabels[app.category] ?? app.category}
              color="bg-indigo-50 text-indigo-700 ring-indigo-600/20"
            />
            {app.model && (
              <Badge
                label={app.effort && app.effort !== 'default' ? `${app.model} ${app.effort}` : app.model}
                color="bg-violet-50 text-violet-700 ring-violet-600/20"
              />
            )}
            {app.manualEditLevel !== 'none-claimed' && (
              <Badge
                label={EDIT_LEVEL_LABELS[app.manualEditLevel] ?? app.manualEditLevel}
                color={EDIT_LEVEL_COLORS[app.manualEditLevel]}
              />
            )}
            {app.issues.length === 0 ? (
              <Badge label="Usable" color={USABLE_COLOR} />
            ) : (
              app.issues.map(issue => (
                <Badge key={issue} label={ISSUE_LABELS[issue] ?? issue} color={ISSUE_COLORS[issue]} />
              ))
            )}
          </div>

          {/* Tool · provider */}
          <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
            {builtWithLabels[app.builtWith] ?? app.builtWith}
            {app.provider && <span> · {app.provider}</span>}
          </div>

          {/* Metrics row */}
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
            {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes) && (
              <span>⏱ {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes)}</span>
            )}
            <span>↻ {app.followUpCount + 1} prompt{app.followUpCount + 1 !== 1 ? 's' : ''}</span>
            {app.sourceAvailable && <span>‹/› source</span>}
            {formatRelativeDate(app.publishedAt) && (
              <span className="ml-auto" suppressHydrationWarning title={app.publishedAt}>
                {formatRelativeDate(app.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Copy prompt overlay — visible on card hover/focus */}
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation() }}
        role="none"
      >
        <CopyButton text={app.promptText} label={`Copy ${app.name} prompt to clipboard`} />
      </div>
    </div>
  )
}

export function GalleryClient({ apps, categories, builtWithOptions, models, techStack, allTags, categoryLabels, builtWithLabels }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [builtWith, setBuiltWith] = useState(searchParams.get('builtWith') ?? '')
  const [model, setModel] = useState(searchParams.get('model') ?? '')
  const [tech, setTech] = useState(searchParams.get('tech') ?? '')
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') ?? '')
  const [search, setSearch] = useState(searchParams.get('q') ?? '')

  const updateParam = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.replace(`${pathname}?${p.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Filter
  let filtered = apps.filter(app => {
    if (category && app.category !== category) return false
    if (builtWith && app.builtWith !== builtWith) return false
    if (model && app.model !== model) return false
    if (tech && !app.techStack.includes(tech)) return false
    if (tagFilter && !app.tags.includes(tagFilter)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        app.name.toLowerCase().includes(q) ||
        app.slug.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.model.toLowerCase().includes(q) ||
        app.builtWith.toLowerCase().includes(q) ||
        app.tags.some(t => t.toLowerCase().includes(q)) ||
        app.techStack.some(t => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  const hasFilters = !!(category || builtWith || model || tech || tagFilter || search)

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      {/* Filter bar */}
      <div role="search" className="flex flex-wrap gap-3 items-center mb-8 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Search */}
        <input
          type="search"
          placeholder="Search apps…"
          value={search}
          onChange={e => { setSearch(e.target.value); updateParam('q', e.target.value) }}
          aria-label="Search apps by name, tag, model, or builder"
          className="w-full sm:w-auto sm:flex-1 min-w-0 sm:min-w-[200px] sm:max-w-xs h-9 px-3 text-sm rounded-lg outline-none focus:ring-2"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--ink)',
          }}
        />

        {/* Category */}
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); updateParam('category', e.target.value) }}
          aria-label="Filter by category"
          className="h-9 px-3 text-sm rounded-lg outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{categoryLabels[c] ?? c}</option>
          ))}
        </select>

        {/* Built with */}
        <select
          value={builtWith}
          onChange={e => { setBuiltWith(e.target.value); updateParam('builtWith', e.target.value) }}
          aria-label="Filter by builder tool"
          className="h-9 px-3 text-sm rounded-lg outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          <option value="">All tools</option>
          {builtWithOptions.map(b => (
            <option key={b} value={b}>{builtWithLabels[b] ?? b}</option>
          ))}
        </select>

        {/* Model */}
        <select
          value={model}
          onChange={e => { setModel(e.target.value); updateParam('model', e.target.value) }}
          aria-label="Filter by AI model"
          className="h-9 px-3 text-sm rounded-lg outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          <option value="">All models</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Tech */}
        {techStack.length > 0 && (
          <select
            value={tech}
            onChange={e => { setTech(e.target.value); updateParam('tech', e.target.value) }}
            aria-label="Filter by tech stack"
            className="h-9 px-3 text-sm rounded-lg outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
          >
            <option value="">All tech</option>
            {techStack.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {hasFilters && (
          <button
            onClick={() => {
              setCategory(''); setBuiltWith(''); setModel(''); setTech(''); setTagFilter(''); setSearch('')
              router.replace(pathname, { scroll: false })
            }}
            className="h-9 px-3 text-sm rounded-lg transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            Clear all
          </button>
        )}

        <span className="text-sm ml-auto" style={{ color: 'var(--muted)' }}>
          {filtered.length} app{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tag chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 max-h-28 overflow-y-auto">
          {allTags.map(t => {
            const active = tagFilter === t
            return (
              <button
                key={t}
                onClick={() => {
                  const next = active ? '' : t
                  setTagFilter(next)
                  updateParam('tag', next)
                }}
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all"
                style={{
                  background: active ? 'var(--accent)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--muted)',
                  border: active ? '1px solid transparent' : '1px solid var(--border)',
                }}
                aria-pressed={active}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
          <p className="text-lg mb-2">No apps match your filters.</p>
          <button
            onClick={() => {
              setCategory(''); setBuiltWith(''); setModel(''); setTech(''); setTagFilter(''); setSearch('')
              router.replace(pathname, { scroll: false })
            }}
            className="text-sm underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(app => (
            <AppCard key={app.id} app={app} categoryLabels={categoryLabels} builtWithLabels={builtWithLabels} />
          ))}
        </div>
      )}
    </div>
  )
}
