'use client'

import { useState } from 'react'

interface Props {
  demoUrl: string
  appName: string
  thumbnail: string
}

type Viewport = 'desktop' | 'mobile'

export function DemoFrame({ demoUrl, appName, thumbnail }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [viewport, setViewport] = useState<Viewport>('desktop')

  return (
    <div
      className="relative w-full"
      style={{
        height: 'calc(100dvh - 48px)',
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
        <>
          {/* Viewport toggle */}
          <div
            className="absolute top-3 right-3 z-10 flex gap-1 rounded-lg p-1"
            role="group"
            aria-label="Demo viewport"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            {(['desktop', 'mobile'] as Viewport[]).map(v => {
              const active = viewport === v
              return (
                <button
                  key={v}
                  onClick={() => setViewport(v)}
                  aria-pressed={active}
                  aria-label={`${v === 'desktop' ? 'Desktop' : 'Mobile'} view`}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                  style={{
                    background: active ? 'rgba(255,255,255,0.92)' : 'transparent',
                    color: active ? '#000' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {v === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
                </button>
              )
            })}
          </div>

          {/* Iframe — constrained to a phone width in mobile mode so the app's
              own responsive breakpoints kick in. Same element across modes, so
              toggling resizes without reloading the demo. */}
          <div
            className="w-full h-full flex items-center justify-center overflow-auto"
            style={{ padding: viewport === 'mobile' ? '16px' : 0, background: viewport === 'mobile' ? '#0a0a0a' : '#000' }}
          >
            <iframe
              src={demoUrl}
              title={`${appName} demo`}
              className="border-0 bg-white"
              style={
                viewport === 'mobile'
                  ? { width: 390, maxWidth: '100%', height: '100%', maxHeight: 844, borderRadius: 14, boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 10px 40px rgba(0,0,0,0.5)' }
                  : { width: '100%', height: '100%' }
              }
              sandbox="allow-scripts allow-forms allow-popups allow-downloads allow-same-origin"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
            />
          </div>
        </>
      )}
    </div>
  )
}
