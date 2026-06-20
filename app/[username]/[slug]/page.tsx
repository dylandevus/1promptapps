import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getApps, getApp } from '@/lib/registry'
import { formatDuration } from '@/lib/format'
import { CATEGORY_LABELS, BUILT_WITH_LABELS, EDIT_LEVEL_LABELS, EDIT_LEVEL_COLORS, REPRO_COLORS, ISSUE_LABELS, ISSUE_COLORS, USABLE_COLOR } from '@/lib/constants'
import { DemoFrame } from './DemoFrame'
import { CopyButton } from '@/app/_components/CopyButton'
import { RemixButtons } from '@/app/_components/RemixButtons'
import { Comments } from './Comments'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://1promptapps.com'

interface Params { username: string; slug: string }

export async function generateStaticParams() {
  return getApps().map(a => ({ username: a.username, slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { username, slug } = await params
  const app = getApp(username, slug)
  if (!app) return {}
  return {
    title: `${app.name} — Static App Built from One AI Prompt`,
    description: `${app.tagline} Built with ${BUILT_WITH_LABELS[app.builtWith] ?? app.builtWith}. ${app.timeToFirstVersionMinutes != null ? `First version in ${app.timeToFirstVersionMinutes} minutes.` : ''} Original prompt included.`,
    openGraph: {
      title: `${app.name} — 1PromptApps`,
      description: `${app.tagline} Built with ${BUILT_WITH_LABELS[app.builtWith] ?? app.builtWith}.`,
      images: [{ url: app.thumbnail, width: 1280, height: 800, alt: app.name }],
      url: `/${username}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${app.name} — 1PromptApps`,
      description: `${app.tagline} Built with ${BUILT_WITH_LABELS[app.builtWith] ?? app.builtWith}.`,
      images: [app.thumbnail],
    },
  }
}

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${color ?? 'bg-stone-50 text-stone-600 ring-stone-500/20'}`}>
      {label}
    </span>
  )
}

export default async function AppPage({ params }: { params: Promise<Params> }) {
  const { username, slug } = await params
  const app = getApp(username, slug)
  if (!app) notFound()

  const builtWithLabel = BUILT_WITH_LABELS[app.builtWith] ?? app.builtWith
  const categoryLabel = CATEGORY_LABELS[app.category] ?? app.category

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-medium"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Skip to content
      </a>
      {/* Provenance banner — OUTSIDE the iframe, on gallery origin */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-2 sm:gap-3 text-sm">
          {/* Identity — scrolls horizontally if needed; verbose meta hidden on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-x-auto">
            <Link href="/" className="shrink-0 font-semibold text-xs" style={{ color: 'var(--accent)' }}>
              ← 1PromptApps
            </Link>
            <span className="shrink-0" style={{ color: 'var(--border)' }}>|</span>
            <span className="font-medium truncate" style={{ color: 'var(--ink)' }}>{app.name}</span>
            <span className="hidden sm:inline shrink-0" style={{ color: 'var(--muted)' }}>·</span>
            <span className="hidden sm:inline shrink-0" style={{ color: 'var(--muted)' }}>{builtWithLabel}</span>
            {app.model && <>
              <span className="hidden sm:inline shrink-0" style={{ color: 'var(--muted)' }}>·</span>
              <span className="hidden sm:inline shrink-0 text-xs font-mono" style={{ color: 'var(--muted)' }}>{app.model}</span>
            </>}
            {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes) && <>
              <span className="hidden sm:inline shrink-0" style={{ color: 'var(--muted)' }}>·</span>
              <span className="hidden sm:inline shrink-0" style={{ color: 'var(--muted)' }}>⏱ {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes)}</span>
            </>}
            <span className="hidden sm:inline shrink-0" style={{ color: 'var(--muted)' }}>·</span>
            <span className="hidden sm:inline shrink-0 text-xs" style={{ color: 'var(--muted)' }}>{app.publishedAt}</span>
          </div>

          {/* Actions — always visible */}
          <div className="flex shrink-0 gap-1.5 sm:gap-2">
            <a
              href="#comments"
              aria-label="Jump to comments"
              className="h-7 px-2 sm:px-3 text-xs rounded-md font-medium flex items-center"
              style={{ border: '1px solid var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
            >
              💬<span className="hidden sm:inline">&nbsp;Comments</span>
            </a>
            <a
              href={app.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 px-2 sm:px-3 text-xs rounded-md font-medium flex items-center"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Open<span className="hidden sm:inline">&nbsp;full app</span> ↗
            </a>
            {app.sourceUrl && (<>
              <a
                href={app.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source"
                className="h-7 px-2 sm:px-3 text-xs rounded-md font-medium flex items-center"
                style={{ border: '1px solid var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
              >
                ‹/›<span className="hidden sm:inline">&nbsp;Source</span>
              </a>
              <a
                href={app.sourceUrl}
                download={`${app.slug}.html`}
                aria-label="Download HTML"
                className="h-7 px-2 sm:px-3 text-xs rounded-md font-medium flex items-center"
                style={{ border: '1px solid var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
              >
                ↓<span className="hidden sm:inline">&nbsp;Download</span>
              </a>
            </>)}
          </div>
        </div>
      </header>

      {/* Demo iframe — click-to-load, sandboxed */}
      <DemoFrame
        demoUrl={app.demoUrl}
        appName={app.name}
        thumbnail={app.thumbnail}
      />

      {/* Case study */}
      <main id="main-content" className="max-w-3xl mx-auto px-6 py-12">
        {/* Title + meta */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--ink)' }}>{app.name}</h1>
          <p className="text-base mb-4" style={{ color: 'var(--muted)' }}>{app.tagline}</p>
          <div className="flex flex-wrap gap-2">
            <Badge label={categoryLabel} color="bg-indigo-50 text-indigo-700 ring-indigo-600/20" />
            <Badge label={builtWithLabel} color="bg-violet-50 text-violet-700 ring-violet-600/20" />
            {app.model && (
              <Badge
                label={app.effort && app.effort !== 'default' ? `${app.model} ${app.effort}` : app.model}
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
        </div>

        {/* Proof strip */}
        <div
          className="rounded-xl p-5 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes) && (
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Time to first version</div>
              <div className="font-semibold" style={{ color: 'var(--ink)' }}>{formatDuration(app.generationDurationSeconds, app.timeToFirstVersionMinutes)}</div>
            </div>
          )}
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Follow-up prompts</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>{app.followUpCount}</div>
          </div>
          {app.errorFixes > 0 && (
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Error fixes</div>
              <div className="font-semibold" style={{ color: 'var(--ink)' }}>{app.errorFixes}</div>
            </div>
          )}
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Reproducibility</div>
            <Badge
              label={app.reproducibility}
              color={REPRO_COLORS[app.reproducibility]}
            />
          </div>
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Usability</div>
            <div className="flex flex-wrap gap-1">
              {app.issues.length === 0 ? (
                <Badge label="Usable" color={USABLE_COLOR} />
              ) : (
                app.issues.map(issue => (
                  <Badge key={issue} label={ISSUE_LABELS[issue] ?? issue} color={ISSUE_COLORS[issue]} />
                ))
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted)' }}>Source</div>
            <div className="font-semibold" style={{ color: 'var(--ink)' }}>
              {app.sourceAvailable ? (
                <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--accent)' }}>
                  Available
                </a>
              ) : 'Not public'}
            </div>
          </div>
        </div>

        {/* Prompt block */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              The Prompt
            </h2>
            <CopyButton text={app.promptText} label={`Copy ${app.name} prompt to clipboard`} />
          </div>
          <div
            className="prompt-block rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed"
            style={{ background: '#F8F8F7', border: '1px solid var(--border)', color: 'var(--ink)' }}
          >
            {app.promptText}
          </div>
          <div className="mt-2 text-xs flex flex-wrap gap-x-3 gap-y-1" style={{ color: 'var(--muted)' }}>
            <span>Builder: {builtWithLabel}</span>
            {app.model && <span>Model: {app.model}</span>}
            {app.techStack.length > 0 && <span>Tech: {app.techStack.join(', ')}</span>}
          </div>
        </section>

        <RemixButtons promptText={app.promptText} />

        {/* Follow-up prompts */}
        {app.followUpPrompts.length > 0 && (
          <section className="mb-8">
            {app.followUpPrompts.map((fp, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                    Follow-up {i + 1}
                  </h2>
                  <CopyButton text={fp} label={`Copy ${app.name} follow-up ${i + 1} to clipboard`} />
                </div>
                <div
                  className="prompt-block rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed"
                  style={{ background: '#F8F8F7', border: '1px solid var(--border)', color: 'var(--ink)' }}
                >
                  {fp}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Outcome */}
        {(app.worked.length > 0 || app.manualEdits.length > 0) && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>Outcome</h2>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border)' }}
            >
              {app.worked.length > 0 && (
                <div className="p-5" style={{ background: '#F0FDF4', borderBottom: app.manualEdits.length > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div className="text-xs font-semibold mb-2 text-green-700">✓ What worked out of the box</div>
                  <ul className="text-sm space-y-1" style={{ color: 'var(--ink)' }}>
                    {app.worked.map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              )}
              {app.manualEdits.length > 0 && (
                <div className="p-5" style={{ background: '#FFFBEB' }}>
                  <div className="text-xs font-semibold mb-2 text-amber-700">✎ What needed manual edits</div>
                  <ul className="text-sm space-y-1" style={{ color: 'var(--ink)' }}>
                    {app.manualEdits.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Screenshots */}
        {app.screenshots.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.screenshots.map((s, i) => (
                <a key={i} href={s.src} target="_blank" rel="noopener noreferrer">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="w-full rounded-lg"
                    style={{ border: '1px solid var(--border)' }}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <section id="comments" className="mb-8 scroll-mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
            💬 Comments
          </h2>
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <Comments threadUrl={`${SITE_URL}/${app.username}/${app.slug}`} />
          </div>
        </section>

        {/* Back */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
            ← Back to gallery
          </Link>
        </div>
      </main>
    </div>
  )
}

