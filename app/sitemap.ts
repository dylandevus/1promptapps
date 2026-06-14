import type { MetadataRoute } from 'next'
import { getApps } from '@/lib/registry'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://1promptapps.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const apps = getApps()
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...apps.map(a => ({
      url: `${BASE}${a.path}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
