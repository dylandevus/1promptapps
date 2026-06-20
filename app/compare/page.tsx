'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { DemoFrame } from '../[username]/[slug]/DemoFrame'
import { CopyButton } from '@/app/_components/CopyButton'
import appsData from '@/generated/apps.json'
import type { AppEntry } from '@/lib/types'
import { CATEGORY_LABELS, BUILT_WITH_LABELS } from '@/lib/constants'
import { formatDuration } from '@/lib/format'

const apps = appsData as AppEntry[]

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${color ?? 'bg-stone-50 text-stone-600 ring-stone-500/20'}`}>
      {label}
    </span>
  )
}

function compareLabel(collectionId: string): string {
  const labelMap: Record<string, string> = {
    '2026-06-13-dylandevus-stock-dashboard': 'Stock Market Dashboard',
    '2026-06-16-dylandevus-low-poly-rpg-game': 'Low Poly Village RPG Game',
    '2026-06-16-dylandevus-robot-store': 'Robot Store Landing Page',
  }
  return labelMap[collectionId] ?? 'Compare'
}

function getAppBySlug(username: string, slug: string): AppEntry | undefined {
  return apps.find(a => a.username === username && a.slug === slug)
}

function getSiblings(app: AppEntry): AppEntry[] {
  if (!app.collectionId) return []
  return apps.filter(
    a => a.collectionId === app.collectionId && a.username === app.username
  )
}

export default function ComparePage() {
  const [params, setParams] = useState<{ aSlug: string; bSlug: string } | null>(null)

  useEffect(() => {
    const search = window.location.search
    const urlParams = new URLSearchParams(search)
    const a = urlParams.get('a') || ''
    const b = urlParams.get('b') || ''
    setParams({ aSlug: a, bSlug: b })
  }, [])

  // Parse params into app references
  const parsed = useMemo(() => {
    if (!params) return null
    const partsA = params.aSlug.split('/')
    const partsB = params.bSlug.split('/')
    if (partsA.length !== 2 || partsB.length !== 2) return null
    const appA = getAppBySlug(partsA[0], partsA[1])
    const appB = getAppBySlug(partsB[0], partsB[1])
    if (!appA || !appB) return null
    return { appA, appB }
  }, [params])

  // No params yet (client-side loading) — show picker
  if (!params || !parsed) {
    // Group apps by collectionId — only those with 2+ apps
    const byCollection: Record<string, AppEntry[]> = {}
    for (const app of apps) {
      if (!app.collectionId) continue
      if (!byCollection[app.collectionId]) byCollection[app.collectionId] = []
      byCollection[app.collectionId].push(app)
    }

    const multiModelCollections = Object.entries(byCollection)
      .filter(([_, apps]) => apps.length >= 2)
      .sort(([a], [b]) => a.localeCompare(b))

    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center">
            <Link href="/" className="shrink-0 font-semibold text-xs" style={{ color: 'var(--accent)' }}>
              &larr; 1PromptApps
            </Link>
            <span className="mx-2" style={{ color: 'var(--border)' }}>|</span>
            <span className="font-medium text-sm" style={{ color: 'var(--ink)' }}>Compare apps</span>
          </div>
        </header>

        <main id="main-content" className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
            Side-by-side model comparison
          </h1>
          <p className="text-base mb-10" style={{ color: 'var(--muted)' }}>
            See how different AI models interpreted the same prompt.
            Pick a multi-model set below.
          </p>

          <div className="grid gap-6">
            {multiModelCollections.map(([collectionId, apps]) => {
              const label = compareLabel(collectionId)
              const first = apps[0]
              const second = apps[1]
              const href = `/compare?a=${first.username}/${first.slug}&b=${second.username}/${second.slug}`
              return (
                <Link
                  key={collectionId}
                  href={href}
                  className="block rounded-xl p-6 transition-all hover:shadow-md"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                    {label}
                  </h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                    {apps.length} models &mdash; {apps.map(a => a.model).join(' &middot; ')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {apps.map(app => (
                      <Badge
                        key={app.slug}
                        label={`${app.model}${app.effort && app.effort !== 'default' ? ` (${app.effort})` : ''}`}
                        color="bg-violet-50 text-violet-700 ring-violet-600/20"
                      />
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  const { appA, appB } = parsed
  const siblingsA = getSiblings(appA).filter(s => s.slug !== appA.slug)
  const siblingsB = getSiblings(appB).filter(s => s.slug !== appB.slug)

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="shrink-0 font-semibold text-xs" style={{ color: 'var(--accent)' }}>
              &larr; 1PromptApps
            </Link>
            <span className="shrink-0" style={{ color: 'var(--border)' }}>|</span>
            <span className="font-medium text-sm truncate" style={{ color: 'var(--ink)' }}>
              Compare: {appA.model} vs {appB.model}
            </span>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <Link
              href={`/compare?a=${appB.username}/${appB.slug}&b=${appA.username}/${appA.slug}`}
              className="h-7 px-2 sm:px-3 text-xs rounded-md font-medium flex items-center"
              style={{ border: '1px solid var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
            >
              &#8644; Swap
            </Link>
            <Link
              href="/compare"
              className="h-7 px-2 sm:px-3 text-xs rounded-md font-medium flex items-center"
              style={{ border: '1px solid var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
            >
              &times; Pick different
            </Link>
          </div>
        </div>
      </header>

      {/* Side-by-side comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'var(--border)' }}>
        <CompareColumn app={appA} siblings={siblingsA} />
        <CompareColumn app={appB} siblings={siblingsB} />
      </div>
    </div>
  )
}

function CompareColumn({ app, siblings }: { app: AppEntry; siblings: AppEntry[] }) {
  const builtWithLabel = BUILT_WITH_LABELS[app.builtWith] ?? app.builtWith
  const categoryLabel = CATEGORY_LABELS[app.category] ?? app.category
  const otherSibling = siblings.length > 0 ? siblings[0] : null

  return (
    <div className="flex flex-col" style={{ background: 'var(--surface)' }}>
      {/* Column header — model badge + meta */}
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            {app.model}
          </h2>
          {otherSibling && (
            <Link
              href={`/compare?a=${app.username}/${app.slug}&b=${otherSibling.username}/${otherSibling.slug}`}
              className="text-xs font-medium hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Switch model
            </Link>
          )}
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {app.name} &middot; {builtWithLabel}
          {app.effort && app.effort !== 'default' ? ` &middot; ${app.effort}` : ''}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge label={categoryLabel} color="bg-indigo-50 text-indigo-700 ring-indigo-600/20" />
          <Badge label={builtWithLabel} color="bg-violet-50 text-violet-700 ring-violet-600/20" />
          {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes) && (
            <Badge
              label={`⏱ ${formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes)}`}
            />
          )}
        </div>
      </div>

      {/* Demo frame — full width */}  
      <div className="w-full" style={{ height: 'calc(50dvh - 48px)', background: '#000' }}>
        <DemoFrame
          demoUrl={app.demoUrl}
          appName={app.name}
          thumbnail={app.thumbnail}
        />
      </div>

      {/* Prompt + detail */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(50dvh - 48px)' }}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              Prompt
            </h3>
            <CopyButton text={app.promptText} label={`Copy ${app.name} prompt`} />
          </div>
          <div
            className="prompt-block rounded-lg p-4 whitespace-pre-wrap text-xs leading-relaxed"
            style={{ background: '#F8F8F7', border: '1px solid var(--border)', color: 'var(--ink)', maxHeight: 200, overflowY: 'auto' }}
          >
            {app.promptText}
          </div>
        </div>

        <div
          className="rounded-lg p-3 grid grid-cols-3 gap-2 text-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <div className="font-medium" style={{ color: 'var(--muted)' }}>Follow-ups</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>{app.followUpCount}</div>
          </div>
          <div>
            <div className="font-medium" style={{ color: 'var(--muted)' }}>Errors fixed</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>{app.errorFixes}</div>
          </div>
          <div>
            <div className="font-medium" style={{ color: 'var(--muted)' }}>Usability</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>
              {app.issues.length === 0 ? 'Usable' : app.issues.length + ' issues'}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/${app.username}/${app.slug}`}
            className="text-xs font-medium hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            View full detail page &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
