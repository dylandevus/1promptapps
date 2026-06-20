'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ShowcaseEdition {
  title: string
  appPath: string
  summary: string
  model: string
  category: string
  color: string
  tagline: string
}

const editions: ShowcaseEdition[] = [
  {
    title: 'Prompt Pattern Library',
    appPath: '/dylandevus/prompt-pattern-library-deepseek-v4',
    summary:
      'Interactive catalog of 12 proven prompt engineering techniques with editable examples, copy-to-clipboard, category filters, and detail modals. Built by DeepSeek V4 in 45 seconds — zero follow-ups, zero dependencies.',
    model: 'DeepSeek V4',
    category: 'Developer Tools',
    color: '#7c5cfc',
    tagline: 'Master 12 prompt patterns in one interactive reference',
  },
  {
    title: 'Stock Market Dashboard',
    appPath: '/dylandevus/stock-dashboard-opus-4.8-high',
    summary:
      'Real-time QQQ/SPY/SCHD ETF dashboard with Bollinger Bands, SMA overlays, market insights, and near-term predictions. Claude Opus 4.8 built it from a single four-sentence prompt in under 7 minutes.',
    model: 'Claude Opus 4.8',
    category: 'Finance',
    color: '#059669',
    tagline: 'ETF analysis from one prompt in under 7 minutes',
  },
  {
    title: 'Low Poly Village RPG',
    appPath: '/dylandevus/low-poly-rpg-game-gpt-5.5-high',
    summary:
      'Complete isometric action-RPG in a single HTML file: explore a medieval village, fight with melee/ranged/magic, loot treasure, and manage inventory. GPT-5.5 generated it with real CC0 Kenney sprite assets.',
    model: 'GPT-5.5',
    category: 'Games',
    color: '#dc2626',
    tagline: 'A playable RPG built by GPT-5.5 in one session',
  },
]

function pickEdition(): ShowcaseEdition {
  const day = new Date().getDate()
  return editions[day % editions.length]
}

export function ShowcaseHero() {
  const [edition, setEdition] = useState<ShowcaseEdition | null>(null)

  useEffect(() => {
    setEdition(pickEdition())
  }, [])

  if (!edition) return null

  return (
    <Link
      href={edition.appPath}
      className="group block rounded-xl overflow-hidden transition-all hover:shadow-lg mb-8"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="p-6 sm:p-8">
        {/* Top row: tag + model badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase"
            style={{ background: edition.color + '18', color: edition.color }}
          >
            App of the Day
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
            style={{ color: 'var(--muted)', borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            {edition.model}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
            style={{ color: 'var(--muted)', borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            {edition.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-1.5 group-hover:underline"
          style={{ color: 'var(--ink)' }}
        >
          {edition.title}
        </h2>
        <p className="text-sm mb-1" style={{ color: edition.color }}>
          {edition.tagline}
        </p>

        {/* Summary */}
        <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--muted)' }}>
          {edition.summary}
        </p>

        {/* CTA */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium"
          style={{ color: 'var(--accent)' }}
        >
          <span>View app</span>
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </div>
      </div>
    </Link>
  )
}
