import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://1promptapps.com'

export const metadata: Metadata = {
  title: { default: '1PromptApps', template: '%s | 1PromptApps' },
  description: 'Real static webapps built from one AI prompt. Browse proof-driven examples with prompts, demos, screenshots, and honest edit notes.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: '1PromptApps',
    title: '1PromptApps — Real apps from one prompt',
    description: 'A curated gallery of static webapps generated from a single AI prompt. Each entry includes the original prompt, live demo, screenshots, builder info, and honest edit notes.',
    url: '/',
    locale: 'en_US',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: '1PromptApps — Real apps from one prompt' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1PromptApps — Real apps from one prompt',
    description: 'A curated gallery of static webapps generated from a single AI prompt. Browse proof-driven examples with prompts, demos, and honest edit notes.',
    images: ['/og-default.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: 'var(--bg)' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
