#!/usr/bin/env tsx
/**
 * validate-all.ts
 * Validates all apps (or a single app with --app <path>).
 * This is the single gate: same code runs in CI and locally.
 *
 * Usage:
 *   npm run validate               # validate all apps
 *   npm run validate:app apps/duc/my-app  # validate one app
 */

import fs from 'fs'
import path from 'path'

const ROOT = path.join(__dirname, '..')
const APPS_DIR = path.join(ROOT, 'apps')

// ── constants ────────────────────────────────────────────────────────────────

const RESERVED_USERNAMES = new Set([
  'apps', 'app', 'admin', 'api', 'submit', 'about', 'privacy', 'terms',
  'categories', 'builders', 'static', 'assets', '_app', '_next', 'generated',
  'templates', 'schemas', 'scripts', 'lib', 'public',
])

const VALID_CATEGORIES = new Set([
  'productivity', 'developer-tools', 'design-tools', 'education', 'finance',
  'data-visualization', 'internal-tools', 'games', 'writing', 'personal-utilities',
  'ecommerce', 'health-fitness', 'other',
])

const VALID_BUILDERS = new Set([
  'v0', 'lovable', 'bolt', 'replit', 'cursor', 'claude', 'chatgpt', 'windsurf', 'glm', 'other',
])

const VALID_EDIT_LEVELS = new Set([
  'none-claimed', 'minor', 'moderate', 'significant', 'unknown',
])

const VALID_REPRODUCIBILITY = new Set(['full', 'partial', 'none'])

const ALLOWED_EXTENSIONS = new Set([
  '.html', '.css', '.js', '.mjs', '.cjs', '.json', '.md', '.txt',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.woff', '.woff2', '.ico',
  '.ts', // allow .ts in templates only — CI blocks in actual submissions
])

const BLOCKED_EXTENSIONS = new Set([
  '.env', '.pem', '.key', '.p12', '.pfx', '.sh', '.bat', '.exe',
  '.dll', '.so', '.dylib', '.py', '.rb', '.php', '.jar',
])

const BLOCKED_FILENAMES = new Set([
  '.env', '.env.local', 'Dockerfile', 'docker-compose.yml', 'docker-compose.yaml',
])

const MAX_FOLDER_BYTES = 10 * 1024 * 1024     // 10 MB
const MAX_FILE_BYTES = 2 * 1024 * 1024         // 2 MB
const MAX_FILES = 100
const MAX_PATH_DEPTH = 6

// ── result helpers ────────────────────────────────────────────────────────────

interface Result {
  ok: boolean
  errors: string[]
  warnings: string[]
}

function err(r: Result, msg: string) { r.errors.push(msg); r.ok = false }
function warn(r: Result, msg: string) { r.warnings.push(msg) }

// ── validators ────────────────────────────────────────────────────────────────

function validateManifest(appDir: string, r: Result) {
  const mfPath = path.join(appDir, 'manifest.json')
  if (!fs.existsSync(mfPath)) { err(r, 'manifest.json not found'); return null }

  let m: Record<string, unknown>
  try { m = JSON.parse(fs.readFileSync(mfPath, 'utf8')) }
  catch { err(r, 'manifest.json is not valid JSON'); return null }

  const slug = path.basename(appDir)
  const username = path.basename(path.dirname(appDir))

  // Required fields
  if (!m.manifestVersion) err(r, 'manifest: missing manifestVersion')
  if (!m.name || typeof m.name !== 'string') err(r, 'manifest: missing name')
  if (!m.slug || typeof m.slug !== 'string') err(r, 'manifest: missing slug')
  else if (m.slug !== slug) err(r, `manifest: slug "${m.slug}" must match folder name "${slug}"`)

  if (!m.tagline || typeof m.tagline !== 'string') err(r, 'manifest: missing tagline')
  else if ((m.tagline as string).length > 120) err(r, 'manifest: tagline exceeds 120 chars')

  // Identity
  if (RESERVED_USERNAMES.has(username)) err(r, `username "${username}" is reserved`)
  if (!/^[a-z0-9][a-z0-9_-]{2,31}$/.test(username)) warn(r, `username "${username}" should be 3–32 lowercase chars`)
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(slug)) err(r, `slug "${slug}" must be 3–80 lowercase chars/hyphens`)

  // Category / builder
  if (!m.category) err(r, 'manifest: missing category')
  else if (!VALID_CATEGORIES.has(m.category as string)) err(r, `manifest: unknown category "${m.category}"`)

  const prompt = m.prompt as Record<string, unknown> | undefined
  if (!prompt) { err(r, 'manifest: missing prompt object'); }
  else {
    if (!prompt.text || typeof prompt.text !== 'string') err(r, 'manifest: missing prompt.text')
    if (!prompt.builder) err(r, 'manifest: missing prompt.builder')
    else if (!VALID_BUILDERS.has(prompt.builder as string)) err(r, `manifest: unknown builder "${prompt.builder}"`)
    if (typeof prompt.followUpCount !== 'number') err(r, 'manifest: prompt.followUpCount must be a number')
  }

  const outcome = m.outcome as Record<string, unknown> | undefined
  if (!outcome) err(r, 'manifest: missing outcome object')
  else {
    if (!outcome.reproducibility) err(r, 'manifest: missing outcome.reproducibility')
    else if (!VALID_REPRODUCIBILITY.has(outcome.reproducibility as string))
      err(r, `manifest: unknown reproducibility "${outcome.reproducibility}"`)
  }

  // manualEditLevel
  if (!m.manualEditLevel) err(r, 'manifest: missing manualEditLevel')
  else if (!VALID_EDIT_LEVELS.has(m.manualEditLevel as string))
    err(r, `manifest: unknown manualEditLevel "${m.manualEditLevel}"`)

  // Permissions
  const perms = m.permissions as Record<string, unknown> | undefined
  if (!perms?.permissionToFeature) err(r, 'manifest: permissionToFeature must be true')
  if (!perms?.rightsAttested) err(r, 'manifest: rightsAttested must be true')

  // Demo
  const demo = m.demo as Record<string, unknown> | undefined
  if (!demo) err(r, 'manifest: missing demo object')
  else {
    if (demo.type !== 'bundle' && demo.type !== 'live') err(r, 'manifest: demo.type must be "bundle" or "live"')
    if (demo.type === 'bundle' && !demo.entry) warn(r, 'manifest: demo.entry not set, defaulting to index.html')
  }

  // Source
  const source = m.source as Record<string, unknown> | undefined
  if (source?.available && !source.license) warn(r, 'manifest: source.available=true but no license specified')

  return m
}

function validateFiles(appDir: string, r: Result) {
  const slug = path.basename(appDir)
  const username = path.basename(path.dirname(appDir))

  // Required files
  if (!fs.existsSync(path.join(appDir, 'prompt.md'))) err(r, 'prompt.md not found')
  if (!fs.existsSync(path.join(appDir, 'index.html'))) err(r, 'index.html not found')

  // Screenshots
  const ssDir = path.join(appDir, 'screenshots')
  if (!fs.existsSync(ssDir)) { err(r, 'screenshots/ directory not found'); }
  else {
    if (!fs.existsSync(path.join(ssDir, 'thumbnail.png')) &&
        !fs.existsSync(path.join(ssDir, 'thumbnail.webp')))
      err(r, 'screenshots/thumbnail.png not found')
    const shots = fs.readdirSync(ssDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    if (shots.length < 2) err(r, 'screenshots/ needs at least 2 images (thumbnail + desktop)')
  }

  // Walk all files
  let totalBytes = 0
  let fileCount = 0

  function walk(dir: string, depth: number) {
    if (depth > MAX_PATH_DEPTH) { err(r, `path depth exceeds ${MAX_PATH_DEPTH}: ${dir}`); return }
    for (const name of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, name)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) { walk(fullPath, depth + 1); continue }

      fileCount++
      if (fileCount > MAX_FILES) { err(r, `too many files (> ${MAX_FILES})`); return }

      const ext = path.extname(name).toLowerCase()
      const basename = path.basename(name)

      // Blocked filenames
      if (BLOCKED_FILENAMES.has(basename)) err(r, `blocked file: ${basename}`)
      if (name.startsWith('.') && name !== '.gitkeep') err(r, `hidden file not allowed: ${name}`)
      if (BLOCKED_EXTENSIONS.has(ext)) err(r, `blocked extension: ${name}`)

      // Size check
      const bytes = stat.size
      totalBytes += bytes
      if (bytes > MAX_FILE_BYTES) err(r, `file too large (> 2 MB): ${name} (${(bytes/1024/1024).toFixed(1)} MB)`)
    }
  }

  walk(appDir, 0)
  if (totalBytes > MAX_FOLDER_BYTES)
    err(r, `total folder size exceeds 10 MB (${(totalBytes/1024/1024).toFixed(1)} MB)`)
}

// ── main ──────────────────────────────────────────────────────────────────────

function validateApp(appDir: string): Result {
  const r: Result = { ok: true, errors: [], warnings: [] }
  const rel = path.relative(ROOT, appDir)

  validateManifest(appDir, r)
  validateFiles(appDir, r)

  return r
}

function findAppDirs(): string[] {
  if (!fs.existsSync(APPS_DIR)) return []
  const dirs: string[] = []
  for (const u of fs.readdirSync(APPS_DIR)) {
    const uDir = path.join(APPS_DIR, u)
    if (!fs.statSync(uDir).isDirectory()) continue
    for (const s of fs.readdirSync(uDir)) {
      const sDir = path.join(uDir, s)
      if (fs.statSync(sDir).isDirectory()) dirs.push(sDir)
    }
  }
  return dirs
}

const args = process.argv.slice(2)
const appArgIdx = args.indexOf('--app')
const targetDirs: string[] =
  appArgIdx !== -1 && args[appArgIdx + 1]
    ? [path.resolve(ROOT, args[appArgIdx + 1])]
    : findAppDirs()

if (targetDirs.length === 0) {
  console.log('No apps found to validate.')
  process.exit(0)
}

let anyFail = false
for (const dir of targetDirs) {
  const rel = path.relative(ROOT, dir)
  const result = validateApp(dir)

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(`✓ ${rel}`)
  } else {
    for (const w of result.warnings) console.warn(`  ⚠ ${rel}: ${w}`)
    for (const e of result.errors) console.error(`  ✗ ${rel}: ${e}`)
    if (!result.ok) anyFail = true
  }
}

if (anyFail) {
  console.error('\nValidation failed. Fix the errors above.')
  process.exit(1)
} else {
  console.log('\nAll validations passed.')
}
