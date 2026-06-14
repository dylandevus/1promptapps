#!/usr/bin/env tsx
/**
 * build-registry.ts
 * Walks apps/** and generates:
 *   generated/apps.json
 *   generated/categories.json
 *   generated/builders.json
 *   generated/sitemap.json
 * Also copies bundle files to public/_apps/<username>/<slug>/
 *
 * Run: tsx scripts/build-registry.ts
 */

import fs from 'fs'
import path from 'path'
import type { AppManifest, AppEntry } from '../lib/types'

const ROOT = path.join(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')
const GEN_DIR = path.join(ROOT, 'generated')
const PUBLIC_APPS = path.join(ROOT, 'public', '_apps')
const APPS_ORIGIN = process.env.NEXT_PUBLIC_APPS_ORIGIN ?? ''

const VALID_CATEGORIES = new Set([
  'productivity', 'developer-tools', 'design-tools', 'education', 'finance',
  'data-visualization', 'internal-tools', 'games', 'writing', 'personal-utilities',
  'ecommerce', 'health-fitness', 'other',
])

const VALID_BUILDERS = new Set([
  'v0', 'lovable', 'bolt', 'replit', 'cursor', 'claude', 'chatgpt', 'windsurf', 'glm', 'other',
])

function findManifests(): string[] {
  const manifests: string[] = []
  if (!fs.existsSync(APPS_DIR)) return manifests
  for (const username of fs.readdirSync(APPS_DIR)) {
    const uDir = path.join(APPS_DIR, username)
    if (!fs.statSync(uDir).isDirectory()) continue
    for (const slug of fs.readdirSync(uDir)) {
      const sDir = path.join(uDir, slug)
      if (!fs.statSync(sDir).isDirectory()) continue
      const mf = path.join(sDir, 'manifest.json')
      if (fs.existsSync(mf)) manifests.push(mf)
    }
  }
  return manifests
}

function assetUrl(username: string, slug: string, relPath: string): string {
  return `${APPS_ORIGIN}/_apps/${username}/${slug}/${relPath}`
}

function buildEntry(manifestPath: string): AppEntry {
  const appDir = path.dirname(manifestPath)
  const slug = path.basename(appDir)
  const username = path.basename(path.dirname(appDir))

  let manifest: AppManifest
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    throw new Error(`Invalid JSON in ${manifestPath}`)
  }

  if (!manifest.name) throw new Error(`Missing name in ${manifestPath}`)
  if (!manifest.slug) throw new Error(`Missing slug in ${manifestPath}`)
  if (manifest.slug !== slug) throw new Error(`Slug mismatch: manifest "${manifest.slug}" vs folder "${slug}"`)

  const demoUrl =
    manifest.demo.type === 'live' && manifest.demo.liveUrl
      ? manifest.demo.liveUrl
      : assetUrl(username, slug, manifest.demo.entry ?? 'index.html')

  const thumbnailSrc = manifest.media?.thumbnail
    ? assetUrl(username, slug, manifest.media.thumbnail)
    : assetUrl(username, slug, 'screenshots/thumbnail.png')

  const screenshots = (manifest.media?.screenshots ?? []).map(s => ({
    src: assetUrl(username, slug, s.src),
    alt: s.alt,
  }))

  return {
    id: `${username}/${slug}`,
    username,
    slug,
    path: `/${username}/${slug}`,
    name: manifest.name,
    tagline: manifest.tagline ?? '',
    description: manifest.description ?? '',
    category: manifest.category,
    tags: manifest.tags ?? [],
    builder: manifest.prompt.builder,
    model: manifest.prompt.model ?? '',
    timeToFirstVersionMinutes: manifest.outcome.timeToFirstVersionMinutes ?? null,
    reproducibility: manifest.outcome.reproducibility,
    manualEditLevel: manifest.manualEditLevel,
    sourceAvailable: manifest.source.available,
    sourceUrl: manifest.source.url ?? '',
    license: manifest.source.license ?? '',
    demoType: manifest.demo.type,
    demoUrl,
    thumbnail: thumbnailSrc,
    screenshots,
    promptText: manifest.prompt.text,
    worked: manifest.outcome.worked ?? [],
    manualEdits: manifest.outcome.manualEdits ?? [],
    authorName: manifest.author.name,
    authorHandle: manifest.author.handle,
    publishedAt: manifest.publishedAt ?? new Date().toISOString().split('T')[0],
    externalApiDomains: manifest.externalApiDomains ?? [],
    followUpCount: manifest.prompt.followUpCount,
  }
}

function copyBundleToPublic(username: string, slug: string) {
  const src = path.join(APPS_DIR, username, slug)
  const dest = path.join(PUBLIC_APPS, username, slug)
  fs.mkdirSync(dest, { recursive: true })

  const SKIP = new Set(['manifest.json', 'prompt.md'])
  for (const item of fs.readdirSync(src)) {
    if (SKIP.has(item)) continue
    const srcPath = path.join(src, item)
    const destPath = path.join(dest, item)
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item)
    const d = path.join(dest, item)
    if (fs.statSync(s).isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

function main() {
  fs.mkdirSync(GEN_DIR, { recursive: true })
  fs.mkdirSync(PUBLIC_APPS, { recursive: true })

  const manifests = findManifests()
  console.log(`Found ${manifests.length} app(s)`)

  const entries: AppEntry[] = []
  const categories = new Set<string>()
  const builders = new Set<string>()
  let errors = 0

  for (const mf of manifests) {
    try {
      const entry = buildEntry(mf)
      entries.push(entry)
      categories.add(entry.category)
      builders.add(entry.builder)

      const username = entry.username
      const slug = entry.slug
      if (entry.demoType === 'bundle') {
        copyBundleToPublic(username, slug)
        console.log(`  ✓ ${entry.id}`)
      } else {
        console.log(`  ✓ ${entry.id} (live: ${entry.demoUrl})`)
      }
    } catch (e) {
      console.error(`  ✗ ${mf}: ${(e as Error).message}`)
      errors++
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} error(s). Fix them before building.`)
    process.exit(1)
  }

  // Sort by publishedAt desc
  entries.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  fs.writeFileSync(path.join(GEN_DIR, 'apps.json'), JSON.stringify(entries, null, 2))
  fs.writeFileSync(path.join(GEN_DIR, 'categories.json'), JSON.stringify([...categories].sort(), null, 2))
  fs.writeFileSync(path.join(GEN_DIR, 'builders.json'), JSON.stringify([...builders].sort(), null, 2))

  // sitemap
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://1promptapps.com'
  const sitemap = [
    { url: BASE, changefreq: 'daily', priority: '1.0' },
    ...entries.map(e => ({ url: `${BASE}${e.path}`, changefreq: 'weekly', priority: '0.8' })),
  ]
  fs.writeFileSync(path.join(GEN_DIR, 'sitemap.json'), JSON.stringify(sitemap, null, 2))

  console.log(`\nBuilt registry: ${entries.length} apps, ${categories.size} categories, ${builders.size} builders`)
}

main()
