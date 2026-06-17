export interface AppManifest {
  manifestVersion: string
  name: string
  slug: string
  collectionId?: string
  tagline: string
  description?: string
  category: string
  tags?: string[]
  techStack?: string[]
  prompt: {
    text: string
    builtWith: string
    model?: string
    provider?: string
    effort?: string
    generationDurationSeconds?: number
    estimatedCostUSD?: number | null
    followUpCount: number
    followUpPrompts?: string[]
    errorFixes?: number
    transcriptUrl?: string
  }
  outcome: {
    timeToFirstVersionMinutes?: number
    reproducibility: 'full' | 'partial' | 'none'
    worked?: string[]
    manualEdits?: string[]
    issues?: string[]
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
  collectionId: string
  path: string
  name: string
  tagline: string
  description: string
  category: string
  tags: string[]
  techStack: string[]
  builtWith: string
  model: string
  provider: string
  effort: string
  timeToFirstVersionMinutes: number | null
  generationDurationSeconds: number | null
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
  issues: string[]
  authorName: string
  authorHandle: string
  publishedAt: string
  externalApiDomains: string[]
  followUpCount: number
  followUpPrompts: string[]
  errorFixes: number
}

export interface Registry {
  apps: AppEntry[]
  categories: string[]
  builtWithOptions: string[]
}
