# How submissions work on 1PromptApps

A 3-step guide to submitting your prompt-built app to the gallery.

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

### manifest.json (required fields)

Copy from `templates/static-app/manifest.json`. These are the key fields:

| Field | Example |
|---|---|
| `prompt.text` | `"Build a habit tracker with a heatmap"` |
| `prompt.builtWith` | `"Claude Code"`, `"OpenCode"`, `"Cursor"`, `"v0"` |
| `prompt.model` | `"GPT-5.5"`, `"Claude Opus 4.8"`, `"GLM-5.1"` |
| `prompt.modelId` | `"openai/gpt-5.5"`, `"anthropic/claude-opus-4.8"` |
| `prompt.provider` | `"OpenAI"`, `"Anthropic"`, `"DeepInfra"` |
| `prompt.effort` | `"low"`, `"medium"`, `"high"`, `"default"` |
| `prompt.generationDurationSeconds` | Actual model inference time |
| `prompt.followUpCount` | `0` = truly one shot |
| `prompt.followUpPrompts` | Array of follow-up prompts if any |
| `prompt.errorFixes` | Number of fix prompts after errors (0 = ran clean) |
| `prompt.toolsUsed` | `["web-search", "code-interpreter"]` |
| `manualEditLevel` | `"none-claimed"`, `"minor"`, `"moderate"`, `"significant"` |
| `permissions.permissionToFeature` | `true` |
| `permissions.rightsAttested` | `true` |

### prompt.md

Paste your **exact original prompt**. If you want comparable outputs, append this:
```
Output with a light theme that works on both desktop and mobile screens (responsive). Measure the total time it takes you to generate this app completely end-to-end.
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
