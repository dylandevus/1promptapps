export const CATEGORY_LABELS: Record<string, string> = {
  productivity: 'Productivity',
  'developer-tools': 'Developer Tools',
  'design-tools': 'Design Tools',
  education: 'Education',
  finance: 'Finance',
  'data-visualization': 'Data Visualization',
  'internal-tools': 'Internal Tools',
  games: 'Games',
  writing: 'Writing',
  'personal-utilities': 'Personal Utilities',
  ecommerce: 'E-commerce',
  'landing-page': 'Landing Page',
  'health-fitness': 'Health & Fitness',
  other: 'Other',
}

export const BUILT_WITH_LABELS: Record<string, string> = {
  v0: 'v0',
  lovable: 'Lovable',
  bolt: 'Bolt',
  replit: 'Replit',
  cursor: 'Cursor',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  windsurf: 'Windsurf',
  glm: 'GLM',
  other: 'Other',
}

export const EDIT_LEVEL_LABELS: Record<string, string> = {
  'none-claimed': 'No edits claimed',
  minor: 'Minor edits',
  moderate: 'Moderate edits',
  significant: 'Significant edits',
  unknown: 'Edits unknown',
}

export const EDIT_LEVEL_COLORS: Record<string, string> = {
  'none-claimed': 'bg-green-50 text-green-700 ring-green-600/20',
  minor: 'bg-lime-50 text-lime-700 ring-lime-600/20',
  moderate: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  significant: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  unknown: 'bg-stone-50 text-stone-600 ring-stone-500/20',
}

export const REPRO_COLORS: Record<string, string> = {
  full: 'bg-green-50 text-green-700 ring-green-600/20',
  partial: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  none: 'bg-stone-50 text-stone-600 ring-stone-500/20',
}

// Lingering problems with a generated app. Empty issues = usable.
export const ISSUE_LABELS: Record<string, string> = {
  'failed-to-start': 'Failed to start',
  crashes: 'Crashes',
  'broken-controls': 'Broken controls',
  'visual-glitches': 'Visual glitches',
  'missing-features': 'Missing features',
  'poor-performance': 'Poor performance',
  'mobile-broken': 'Broken on mobile',
}

// "failed-to-start" is a terminal failure (red); the rest are non-fatal (amber).
export const ISSUE_COLORS: Record<string, string> = {
  'failed-to-start': 'bg-red-50 text-red-700 ring-red-600/20',
  crashes: 'bg-red-50 text-red-700 ring-red-600/20',
  'broken-controls': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'visual-glitches': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'missing-features': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'poor-performance': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'mobile-broken': 'bg-amber-50 text-amber-700 ring-amber-600/20',
}

export const USABLE_COLOR = 'bg-stone-50 text-stone-500 ring-stone-400/20'
