import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: "This app doesn't exist — or not yet.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--ink)' }}>404</h1>
      <p className="text-base mb-6" style={{ color: 'var(--muted)' }}>This app doesn't exist — or not yet.</p>
      <Link href="/" className="text-sm underline" style={{ color: 'var(--accent)' }}>
        ← Back to gallery
      </Link>
    </div>
  )
}
