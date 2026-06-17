# 1PromptApps

A curated gallery of static webapps built from a single AI prompt — original prompt, live demo, screenshots, and honest edit notes.

**Repo:** https://github.com/dylandevus/1promptapps

## Submit an app

Open a PR adding your app folder. See [How submissions work](docs/how-submissions-work.md) (3-step guide with example PR).

```
apps/<username>/<slug>/
  manifest.json   # metadata + provenance
  prompt.md       # exact prompt used
  index.html      # your static app
  screenshots/
    thumbnail.png # 1280×800 (16:10)
    desktop.png
```

Run `npm run validate` locally — CI runs the same check.

## Manifest fields

Full field reference: [How submissions work → manifest.json](docs/how-submissions-work.md#manifestjson-full-field-reference). The enforced source of truth is [`schemas/manifest.schema.json`](schemas/manifest.schema.json) (`npm run validate`).

## Dev

```bash
npm install
npm run validate        # validate all apps
npm run build           # build registry + Next.js static export
npm run dev             # dev server on localhost:3000
```

## Stack

- **Next.js 15** — App Router, SSG, no DB, no backend
- **GitHub** — editorial database; merged PR = published
- **Vercel** — static hosting + preview deploy per PR
- `scripts/build-registry.ts` — walks `apps/**` → `generated/*.json`
- `scripts/validate-all.ts` — schema, structure, file hygiene, size limits
