import { getApps, getApp } from './registry'
import type { AppEntry } from './types'

/**
 * Find sibling apps — apps that share the same `collectionId`
 * but have a different slug. Returns all siblings (including the
 * source if not excluded). Only apps from the same username are
 * considered siblings.
 */
export function getSiblings(app: AppEntry): AppEntry[] {
  if (!app.collectionId) return []
  return getApps().filter(
    a => a.collectionId === app.collectionId && a.username === app.username
  )
}

/**
 * Parse a compare URL param of the form `username/slug`
 * into a getApp lookup. Returns undefined if the param is
 * missing or the app is not found.
 */
export function parseCompareSlug(param: string | null): AppEntry | undefined {
  if (!param) return undefined
  const parts = param.split('/')
  if (parts.length !== 2) return undefined
  return getApp(parts[0], parts[1])
}

/**
 * Build a compare URL from two app entries.
 */
export function compareUrl(a: AppEntry, b: AppEntry): string {
  return `/compare?a=${a.username}/${a.slug}&b=${b.username}/${b.slug}`
}
