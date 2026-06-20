'use client'

import { useCallback, useState } from 'react'

interface RemixProvider {
  name: string
  label: string
  baseUrl: string
  icon: string
}

const PROVIDERS: RemixProvider[] = [
  { name: 'ChatGPT', label: 'Open in ChatGPT', baseUrl: 'https://chatgpt.com', icon: '💬' },
  { name: 'Claude', label: 'Open in Claude', baseUrl: 'https://claude.ai/new', icon: '🤖' },
  { name: 'Gemini', label: 'Open in Gemini', baseUrl: 'https://gemini.google.com/app', icon: '✨' },
]

export function RemixButtons({ promptText }: { promptText: string }) {
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleRemix = useCallback(async (provider: RemixProvider) => {
    // Copy prompt to clipboard so the user always has it, even if the
    // URL-param deep-link is too long for the browser to preserve.
    try {
      await navigator.clipboard.writeText(promptText)
    } catch {
      // clipboard unavailable — just open the URL
    }

    // Open the LLM page with the prompt as a query param (deep-link).
    // If the prompt is short enough, it appears pre-filled. If not, the
    // clipboard fallback covers the user.
    const encoded = encodeURIComponent(promptText)
    window.open(`${provider.baseUrl}?q=${encoded}`, '_blank', 'noopener')

    setFeedback(provider.name)
    setTimeout(() => setFeedback(null), 2000)
  }, [promptText])

  return (
    <div
      className="flex items-center gap-2 mt-4 pt-4"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <span className="text-xs font-medium shrink-0" style={{ color: 'var(--muted)' }}>
        Remix in:
      </span>
      <div className="flex gap-1.5">
        {PROVIDERS.map(p => (
          <button
            key={p.name}
            onClick={() => handleRemix(p)}
            className="text-xs px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors hover:opacity-80"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--ink)',
              background: 'var(--surface)',
            }}
            aria-label={`${p.label} — copies prompt and opens ${p.name} in a new tab`}
          >
            {p.icon}
            {feedback === p.name ? 'Copied!' : p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
