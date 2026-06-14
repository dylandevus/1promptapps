'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded transition-colors"
      style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'var(--surface)' }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
