# 1PromptApps

A curated gallery of static webapps built from a single AI prompt — with the original prompt, a live demo, screenshots, and honest notes on what worked and what needed editing.

**Live site:** https://1promptapps.com  
**Repo:** https://github.com/dylandevus/1promptapps

## Submit an app

Open a PR adding your app to `apps/<your-github-username>/<your-app-slug>/`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full flow.

```
apps/
  your-username/
    your-app-slug/
      manifest.json   # metadata + provenance
      prompt.md       # the exact prompt you used
      index.html      # your static app
      screenshots/
        thumbnail.png # 1280×800 (16:10)
        desktop.png
```

Run `npm run validate` locally before opening the PR — CI runs the same check.

## Stack

- **Next.js 15** — App Router, SSG (`output: export`), no DB, no backend
- **GitHub** — editorial database; merged PR = published app
- **Vercel** — static hosting + preview deploys per PR
- **`scripts/build-registry.ts`** — walks `apps/**` → `generated/apps.json`
- **`scripts/validate-all.ts`** — validates manifests, structure, file hygiene, size limits

## Key manifest fields

| Field | Description |
|---|---|
| `prompt.builtWith` | Tool used — OpenCode, Claude Code, Cursor, v0, Lovable, etc. |
| `prompt.model` / `modelId` | Model name and canonical provider ID |
| `prompt.provider` | API provider — DeepInfra, OpenRouter, Anthropic, etc. |
| `prompt.toolsUsed` | AI tools invoked — `web-search`, `code-interpreter`, etc. |
| `prompt.generationDurationSeconds` | Model inference time |
| `manualEditLevel` | `none-claimed` / `minor` / `moderate` / `significant` |
| `outcome.reproducibility` | `full` / `partial` / `none` |

## Dev

```bash
npm install
npm run validate        # validate all apps
npm run build           # build registry + Next.js static export
npm run dev             # dev server on localhost:3000
```
