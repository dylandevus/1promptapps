import { Suspense } from 'react'
import Link from 'next/link'
import { getApps, getCategories, getBuiltWith, getModels, getTechStack } from '@/lib/registry'
import { CATEGORY_LABELS, BUILT_WITH_LABELS } from '@/lib/constants'
import { GalleryClient } from './GalleryClient'
import { ShowcaseHero } from './_components/ShowcaseHero'

export const metadata = {
  title: '1PromptApps — Real apps from one prompt',
  description: 'Browse proof-driven case studies of static webapps built from a single AI prompt. Every app includes the original prompt, screenshots, builder info, generation time, and honest edit notes.',
}

export default function HomePage() {
  const apps = getApps()
  const categories = getCategories()
  const builtWithOptions = getBuiltWith()
  const models = getModels()
  const techStack = getTechStack()

  // Collect unique tags from all apps
  const allTags = [...new Set(apps.flatMap(a => a.tags))].sort()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Skip to content link for keyboard users */}
      <a
        href="#gallery"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Skip to gallery
      </a>

      {/* Header */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-base tracking-tight" style={{ color: 'var(--ink)' }}>
            1PromptApps
          </Link>
          <a
            href="https://github.com/dylandevus/1promptapps/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 rounded-md font-medium transition-colors"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Submit via PR
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: 'var(--ink)' }}>
          Real apps from one prompt.
        </h1>
        <p className="text-base max-w-xl" style={{ color: 'var(--muted)' }}>
          Each entry includes the original prompt, a live demo, screenshots, and honest notes
          on what worked and what needed manual editing.
        </p>
      </div>

      {/* Gallery — Suspense required for useSearchParams() */}
      <div id="gallery">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <ShowcaseHero />
        </div>
        <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 text-sm" style={{ color: 'var(--muted)' }}>Loading…</div>}>
          <GalleryClient
            apps={apps}
            categories={categories}
            builtWithOptions={builtWithOptions}
            models={models}
            techStack={techStack}
            allTags={allTags}
            categoryLabels={CATEGORY_LABELS}
            builtWithLabels={BUILT_WITH_LABELS}
          />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 mt-16" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>1PromptApps</span>
          <div className="flex gap-4 text-sm" style={{ color: 'var(--muted)' }}>
            <a href="/about" className="hover:underline">About</a>
            <a
              href="https://github.com/dylandevus/1promptapps"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://github.com/dylandevus/1promptapps/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Contribute
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
