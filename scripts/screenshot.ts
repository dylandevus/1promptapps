#!/usr/bin/env tsx
/**
 * Take screenshots for an app using Playwright headless Chromium.
 * Usage: tsx scripts/screenshot.ts <username>/<slug>
 *
 * Requires the Next.js dev server to be running (npm run dev).
 * Output: apps/<username>/<slug>/screenshots/thumbnail.png + desktop.png
 */

import path from 'path'
import fs from 'fs'
import { chromium } from 'playwright'

const ROOT = path.join(__dirname, '..')
const SITE = process.env.SITE_URL ?? 'http://localhost:3030'

async function shoot(appPath: string) {
  const [username, slug] = appPath.split('/')
  if (!username || !slug) {
    console.error('Usage: tsx scripts/screenshot.ts <username>/<slug>')
    process.exit(1)
  }

  const screenshotsDir = path.join(ROOT, 'apps', username, slug, 'screenshots')
  fs.mkdirSync(screenshotsDir, { recursive: true })

  const url = `${SITE}/_apps/${username}/${slug}/index.html`
  console.log(`Screenshotting ${url}`)

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  await page.screenshot({ path: path.join(screenshotsDir, 'thumbnail.png') })
  console.log('  ✓ thumbnail.png (1280×800)')

  await page.screenshot({ path: path.join(screenshotsDir, 'desktop.png'), fullPage: true })
  console.log('  ✓ desktop.png (full page)')

  await browser.close()
}

const target = process.argv[2]
if (!target) {
  console.error('Usage: tsx scripts/screenshot.ts <username>/<slug>')
  process.exit(1)
}

shoot(target).catch(e => { console.error(e); process.exit(1) })
