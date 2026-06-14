# 1PromptApps

A curated gallery of static webapps built from a single AI prompt — original prompt, live demo, screenshots, and honest edit notes.

**Repo:** https://github.com/dylandevus/1promptapps

## Submit an app

Open a PR adding your app folder. See [CONTRIBUTING.md](CONTRIBUTING.md).

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

| Field | Description |
|---|---|
| `prompt.text` | The exact original prompt |
| `prompt.builtWith` | Tool — OpenCode, Claude Code, Cursor, v0, Lovable… |
| `prompt.model` / `modelId` | Model name + canonical provider ID |
| `prompt.provider` | API provider — DeepInfra, OpenRouter, Anthropic… |
| `prompt.effort` | Reasoning effort — `low` / `medium` / `high` / `default` |
| `prompt.toolsUsed` | AI tools invoked — `web-search`, `code-interpreter`… |
| `prompt.generationDurationSeconds` | Model inference time |
| `prompt.followUpCount` | Follow-up feature prompts (0 = truly one prompt) |
| `prompt.followUpPrompts` | The actual follow-up prompts, in order |
| `prompt.errorFixes` | Fix prompts sent after an error (0 = ran clean) |
| `manualEditLevel` | `none-claimed` / `minor` / `moderate` / `significant` |
| `outcome.reproducibility` | `full` / `partial` / `none` |

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
