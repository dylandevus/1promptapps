'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { AppEntry } from '@/lib/types'
import { EDIT_LEVEL_LABELS, EDIT_LEVEL_COLORS } from '@/lib/constants'
import { formatDuration } from '@/lib/format'

interface Props {
  apps: AppEntry[]
  categories: string[]
  builtWithOptions: string[]
  categoryLabels: Record<string, string>
  builtWithLabels: Record<string, string>
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'fastest', label: 'Fastest build' },
  { value: 'az', label: 'A → Z' },
]

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
    <Link
      href={app.path}
      className="group block rounded-xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
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

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge
            label={categoryLabels[app.category] ?? app.category}
            color="bg-indigo-50 text-indigo-700 ring-indigo-600/20"
          />
          <Badge
            label={builtWithLabels[app.builtWith] ?? app.builtWith}
            color="bg-violet-50 text-violet-700 ring-violet-600/20"
          />
          {app.model && (
            <Badge
              label={app.model}
              color="bg-stone-50 text-stone-600 ring-stone-500/20"
            />
          )}
          {app.manualEditLevel !== 'none-claimed' && (
            <Badge
              label={EDIT_LEVEL_LABELS[app.manualEditLevel] ?? app.manualEditLevel}
              color={EDIT_LEVEL_COLORS[app.manualEditLevel]}
            />
          )}
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
          {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes) && (
            <span>⏱ {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes)}</span>
          )}
          {app.provider && <span>{app.provider}</span>}
          {app.sourceAvailable && <span>‹/› source</span>}
        </div>
      </div>
    </Link>
  )
}

export function GalleryClient({ apps, categories, builtWithOptions, categoryLabels, builtWithLabels }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [builtWith, setBuiltWith] = useState(searchParams.get('builtWith') ?? '')
  const [editLevel, setEditLevel] = useState(searchParams.get('edit') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'newest')
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
    if (editLevel && app.manualEditLevel !== editLevel) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        app.name.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Sort
  if (sort === 'fastest') {
    filtered = [...filtered].sort((a, b) =>
      (a.timeToFirstVersionMinutes ?? 9999) - (b.timeToFirstVersionMinutes ?? 9999)
    )
  } else if (sort === 'az') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  }

  const hasFilters = !!(category || builtWith || editLevel || search)

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center mb-8 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Search */}
        <input
          type="search"
          placeholder="Search apps…"
          value={search}
          onChange={e => { setSearch(e.target.value); updateParam('q', e.target.value) }}
          className="flex-1 min-w-[200px] max-w-xs h-9 px-3 text-sm rounded-lg outline-none focus:ring-2"
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
          className="h-9 px-3 text-sm rounded-lg outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          <option value="">All tools</option>
          {builtWithOptions.map(b => (
            <option key={b} value={b}>{builtWithLabels[b] ?? b}</option>
          ))}
        </select>

        {/* Edit level */}
        <select
          value={editLevel}
          onChange={e => { setEditLevel(e.target.value); updateParam('edit', e.target.value) }}
          className="h-9 px-3 text-sm rounded-lg outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          <option value="">Any edit level</option>
          <option value="none-claimed">No edits claimed</option>
          <option value="minor">Minor edits</option>
          <option value="moderate">Moderate edits</option>
          <option value="significant">Significant edits</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => { setSort(e.target.value); updateParam('sort', e.target.value) }}
          className="h-9 px-3 text-sm rounded-lg outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              setCategory(''); setBuiltWith(''); setEditLevel(''); setSearch(''); setSort('newest')
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
          <p className="text-lg mb-2">No apps match your filters.</p>
          <button
            onClick={() => {
              setCategory(''); setBuiltWith(''); setEditLevel(''); setSearch('')
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
