# How submissions work on 1PromptApps

A 3-step guide to submitting your prompt-built app to the gallery.

### Shortcut: let an LLM do it

Point a coding agent (Claude Code, OpenCode, Codex, Cursor, etc.) at your generated app and paste:

```
Submit this app to 1PromptApps (github.com/dylandevus/1promptapps).
Fork + clone the repo, then create apps/<my-username>/<slug>/ with:
- index.html  — this app
- prompt.md   — my exact original prompt: "<paste prompt>"
- manifest.json — fill EVERY field from schemas/manifest.schema.json honestly
  (builtWith, model, provider, followUpCount, errorFixes, manualEditLevel, etc.)
Generate screenshots with `npm run screenshot <my-username>/<slug>`,
run `npm run validate` until it passes, then open a PR.
Follow docs/how-submissions-work.md.
```

Then review what it produced before opening the PR. Or do it by hand:

---

## Step 1 — Fork + clone

```bash
# Fork the repo on GitHub: https://github.com/dylandevus/1promptapps/fork
# Then clone your fork:
git clone https://github.com/<YOUR-USERNAME>/1promptapps
cd 1promptapps
npm install
```

---

## Step 2 — Add your app

Create a folder for your app and populate it with the required files:

```
apps/<your-username>/<your-app-slug>/
├── manifest.json        # metadata + provenance
├── prompt.md            # your exact original prompt
├── index.html           # the app itself
└── screenshots/
    ├── thumbnail.png    # 1280×800 (16:10)
    └── desktop.png      # full-page screenshot
```

### manifest.json (full field reference)

Copy from `templates/static-app/manifest.json`. `schemas/manifest.schema.json` is the
enforced source of truth — `npm run validate` checks against it. **• = required.**

**Top level**

| Field | Notes |
|---|---|
| • `manifestVersion` | `"1.0"` |
| • `name` | Display name, 3–60 chars |
| • `slug` | URL-safe, must match the folder name (lowercase, `.` and `-` allowed) |
| `collectionId` | Groups related submissions (e.g. same app across models); clustered together in the gallery. Convention: `<date>-<username>-<concept>`, e.g. `2026-06-13-dylandevus-stock-dashboard` |
| • `tagline` | One-liner, 10–120 chars |
| `description` | Longer summary, ≤ 2000 chars |
| • `category` | One of: `productivity`, `developer-tools`, `design-tools`, `education`, `finance`, `data-visualization`, `internal-tools`, `games`, `writing`, `personal-utilities`, `ecommerce`, `health-fitness`, `other` |
| `tags` | ≤ 8 unique topical strings (e.g. `finance`, `charts`) |
| `techStack` | Languages + libraries used, lowercase slugs (≤ 12). Powers the gallery **Tech** filter. Suggested: `javascript`, `typescript`, `tailwind`, `chartjs`, `threejs`, `d3`, `lit-html`, `alpine`, `react`, `canvas`, `webgl`, `lucide`, `gsap`. Free-form — new libs don't need a schema change. |
| • `manualEditLevel` | `none-claimed` / `minor` / `moderate` / `significant` / `unknown` |
| `externalApiDomains` | Allowed CDN/API hosts the app calls |
| `publishedAt` | ISO 8601 datetime, e.g. `2026-06-13T17:11:06-07:00` |

**`prompt`**

| Field | Notes |
|---|---|
| • `text` | Exact original prompt, 10–8000 chars |
| • `builtWith` | Tool/agent — Claude Code, OpenCode, Cursor, v0, Lovable, Bolt, Windsurf… (free-form) |
| `model` | Human-readable name — `GPT-5.5`, `Claude Opus 4.8`, `GLM-5.1` |
| `modelId` | Canonical provider ID — `openai/gpt-5.5`, `anthropic/claude-opus-4.8` |
| `provider` | API provider — OpenAI, Anthropic, DeepInfra, OpenRouter… |
| `effort` | Reasoning effort — `low` / `medium` / `high` / `default` |
| • `followUpCount` | Integer ≥ 0 (`0` = truly one shot) |
| `followUpPrompts` | The actual follow-up prompts, in order |
| `errorFixes` | Fix prompts sent after an error (`0` = ran clean) |
| `generationDurationSeconds` | Model inference time, seconds |
| `estimatedCostUSD` | Estimated API cost; `null` = unknown |
| `toolsUsed` | Tools the model used while generating — subset of `web-search`, `external-api`, `code-interpreter`, `image-generation`, `file-upload`, `computer-use`, `other` |
| `transcriptUrl` | URL to the full chat transcript |

**`outcome`**

| Field | Notes |
|---|---|
| • `reproducibility` | `full` / `partial` / `none` |
| `timeToFirstVersionMinutes` | Integer ≥ 0 |
| `worked` | Strings — what came out right |
| `manualEdits` | Strings — edits you made by hand |
| `issues` | Subset of `failed-to-start`, `crashes`, `broken-controls`, `visual-glitches`, `missing-features`, `poor-performance`, `mobile-broken` (empty = usable) |

**`demo` / `source` / `author` / `media` / `permissions`**

| Field | Notes |
|---|---|
| • `demo.type` | `bundle` or `live` |
| `demo.entry` | Entry file for `bundle` (e.g. `index.html`) |
| `demo.liveUrl` | URL for `live` demos |
| • `source.available` | Boolean — is source published |
| `source.url` / `source.license` | Repo URL and license, if available |
| • `author.name` / • `author.handle` | Name + username |
| `author.url` / `author.contactEmail` | Optional contact |
| • `media.thumbnail` | Path to 1280×800 thumbnail |
| • `media.screenshots` | ≥ 1 item, each `{ src, alt }` (`alt` ≥ 5 chars) |
| • `permissions.permissionToFeature` | Must be `true` |
| • `permissions.rightsAttested` | Must be `true` |

### prompt.md

Paste your **exact original prompt**. If you want comparable outputs, append this:
```
Output to a HTML file with a light theme that works on both desktop and mobile screens (responsive). Measure the total time it takes you to generate this app completely end-to-end.
```

### Screenshots

```bash
npm run screenshot <your-username>/<your-app-slug>
```
or take them manually:
- `thumbnail.png` — 1280×800 pixels, ≤ 2 MB
- `desktop.png` — full-page, ≤ 2 MB

---

## Step 3 — Validate + PR

```bash
# Validate your app before committing:
npm run validate

# If it passes, commit and push:
git add apps/<your-username>/
git commit -m "Add <app name>"
git push

# Open a PR from your fork to dylandevus/1promptapps main
```

### What happens after you open the PR

1. **CI validates** your app automatically — schema check, file size limits, structure
2. **Vercel preview** deploys your app's detail page so reviewers can see it live
3. **A maintainer reviews** and merges
4. **Merged = live** at `https://1promptapps.com/<username>/<slug>`

---

## Real example PR (walkthrough)

Say you built a checkers game with Claude Code. Here's exactly what you'd do:

```
apps/yourname/checkers/
├── manifest.json
├── prompt.md
├── index.html
└── screenshots/
    ├── thumbnail.png
    └── desktop.png
```

**manifest.json** (snippet):
```json
{
  "name": "Checkers",
  "tagline": "Classic checkers with AI opponent",
  "category": "games",
  "prompt": {
    "text": "Build a single-page HTML checkers game with drag-and-drop, a simple AI opponent, and move validation. Use a light theme, responsive layout.",
    "builtWith": "Claude Code",
    "model": "Claude Opus 4.8",
    "modelId": "anthropic/claude-opus-4.8",
    "provider": "Anthropic",
    "effort": "high",
    "generationDurationSeconds": 94,
    "followUpCount": 2,
    "followUpPrompts": [
      "Add piece highlighting for selected pieces",
      "Show whose turn it is"
    ],
    "errorFixes": 0,
    "toolsUsed": ["web-search"]
  },
  "manualEditLevel": "none-claimed"
}
```

That's it. Your checkers game will appear in the gallery alongside every other prompt-built app — model-agnostic, honest about edits, and ready for the community to discover.

---

## Tips for a great submission

- **One prompt, one app.** Follow-up prompts for small feature additions are OK — disclose them in `prompt.followUpCount`.
- **Be honest.** `manualEditLevel` and `errorFixes` are the trust layer. Honest apps rank higher in credibility.
- **Descriptive name.** "Habit Heatmap" not "Insane AI Tracker". Use clear nouns.
- **Use CDN libraries.** Alpine.js, Chart.js, Tailwind (via CDN) are fine. No build-step frameworks — every app must render from a single `index.html`.
