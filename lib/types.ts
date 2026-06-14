export interface AppManifest {
  manifestVersion: string
  name: string
  slug: string
  tagline: string
  description?: string
  category: string
  tags?: string[]
  prompt: {
    text: string
    model?: string
    builder: string
    followUpCount: number
    transcriptUrl?: string
  }
  outcome: {
    timeToFirstVersionMinutes?: number
    reproducibility: 'full' | 'partial' | 'none'
    worked?: string[]
    manualEdits?: string[]
  }
  demo: {
    type: 'bundle' | 'live'
    entry?: string
    liveUrl?: string
  }
  source: {
    available: boolean
    url?: string
    license?: string
  }
  author: {
    name: string
    handle: string
    url?: string
  }
  media: {
    thumbnail: string
    screenshots: Array<{ src: string; alt: string }>
  }
  permissions: {
    permissionToFeature: boolean
    rightsAttested: boolean
  }
  manualEditLevel: 'none-claimed' | 'minor' | 'moderate' | 'significant' | 'unknown'
  externalApiDomains?: string[]
  publishedAt?: string
}

export interface AppEntry {
  id: string
  username: string
  slug: string
  path: string
  name: string
  tagline: string
  description: string
  category: string
  tags: string[]
  builder: string
  model: string
  timeToFirstVersionMinutes: number | null
  reproducibility: string
  manualEditLevel: string
  sourceAvailable: boolean
  sourceUrl: string
  license: string
  demoType: string
  demoUrl: string
  thumbnail: string
  screenshots: Array<{ src: string; alt: string }>
  promptText: string
  worked: string[]
  manualEdits: string[]
  authorName: string
  authorHandle: string
  publishedAt: string
  externalApiDomains: string[]
  followUpCount: number
}

export interface Registry {
  apps: AppEntry[]
  categories: string[]
  builders: string[]
}
