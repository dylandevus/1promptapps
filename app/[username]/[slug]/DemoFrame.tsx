'use client'

import { useState } from 'react'

interface Props {
  demoUrl: string
  appName: string
  thumbnail: string
}

export function DemoFrame({ demoUrl, appName, thumbnail }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className="relative w-full"
      style={{
        height: 'min(70vh, 640px)',
        background: '#000',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {!loaded ? (
        /* Click-to-load poster */
        <button
          onClick={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 group"
          aria-label={`Launch ${appName} demo`}
        >
          <img
            src={thumbnail}
            alt={`${appName} preview`}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
              Launch demo
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Runs in a sandboxed iframe
            </span>
          </div>
        </button>
      ) : (
        <iframe
          src={demoUrl}
          title={`${appName} demo`}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-forms allow-popups allow-downloads allow-same-origin"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      )}
    </div>
  )
}
