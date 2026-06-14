import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '1PromptApps', template: '%s | 1PromptApps' },
  description: 'Real static webapps built from one AI prompt. Browse proof-driven examples with prompts, demos, screenshots, and honest edit notes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://1promptapps.com'),
  openGraph: {
    type: 'website',
    siteName: '1PromptApps',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: 'var(--bg)' }}>
        {children}
      </body>
    </html>
  )
}
