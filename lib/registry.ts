import fs from 'fs'
import path from 'path'
import type { AppEntry } from './types'

// Re-export constants so server components only need to import from here
export {
  CATEGORY_LABELS, BUILDER_LABELS, EDIT_LEVEL_LABELS,
  EDIT_LEVEL_COLORS, REPRO_COLORS,
} from './constants'

export function getApps(): AppEntry[] {
  const file = path.join(process.cwd(), 'generated', 'apps.json')
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function getApp(username: string, slug: string): AppEntry | undefined {
  return getApps().find(a => a.username === username && a.slug === slug)
}

export function getCategories(): string[] {
  const file = path.join(process.cwd(), 'generated', 'categories.json')
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function getBuilders(): string[] {
  const file = path.join(process.cwd(), 'generated', 'builders.json')
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}
