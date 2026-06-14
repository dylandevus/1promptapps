import { Suspense } from 'react'
import Link from 'next/link'
import { getApps, getCategories, getBuilders } from '@/lib/registry'
import { CATEGORY_LABELS, BUILDER_LABELS } from '@/lib/constants'
import { GalleryClient } from './GalleryClient'

export const metadata = {
  title: '1PromptApps — Real apps from one AI prompt',
  description: 'Browse proof-driven case studies of static webapps built from a single AI prompt. Every app includes the original prompt, screenshots, builder info, generation time, and honest edit notes.',
}

export default function HomePage() {
  const apps = getApps()
  const categories = getCategories()
  const builders = getBuilders()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
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
          Real apps from one AI prompt.
        </h1>
        <p className="text-base max-w-xl" style={{ color: 'var(--muted)' }}>
          Each entry includes the original prompt, a live demo, screenshots, and honest notes
          on what worked and what needed manual editing.
        </p>
      </div>

      {/* Gallery — Suspense required for useSearchParams() */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 text-sm" style={{ color: 'var(--muted)' }}>Loading…</div>}>
        <GalleryClient
          apps={apps}
          categories={categories}
          builders={builders}
          categoryLabels={CATEGORY_LABELS}
          builderLabels={BUILDER_LABELS}
        />
      </Suspense>

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
