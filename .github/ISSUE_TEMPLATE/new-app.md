---
name: Submit a new prompt-built app
about: Add your LLM-generated webapp to the gallery
title: '[App] <Your App Name>'
labels: app-submission
assignees: ''
---

## App details

- **App name:**
- **Your GitHub username:**
- **App slug:** (folder name: `apps/<username>/<slug>/`)
- **Slug preview:** `[a-z0-9._-]`, 3–80 chars, unique within your namespace

## Provenance

- **Builder / tool used:** (e.g. Codex, Claude Code, OpenCode, Cursor, v0, lovable)
- **Model used:** (e.g. GPT-5.5, Claude Opus 4.8, GLM-5.1, Gemini 3.0 Pro)
- **Provider:** (e.g. OpenAI, Anthropic, DeepInfra, OpenRouter)
- **Generation time:** (seconds — use actual run time)
- **Error fixes:** (number of error-fix follow-ups, 0 = ran clean)
- **Follow-up prompts (feature additions):** (number)
- **Manual edit level:** none-claimed | minor | moderate | significant
- **Category:** (e.g. finance, productivity, games, design, utilities, data-viz)
- **Theme:** light | dark | auto

## Checklist

- [ ] My app is a **static HTML/CSS/JS** webapp — no server-side code
- [ ] I listed all external API domains in `manifest.json` under `externalApiDomains`
- [ ] I included `manifest.json` with all required fields (copy from `templates/static-app/`)
- [ ] I included `prompt.md` with the exact original prompt
- [ ] I included `index.html` as the demo entry point
- [ ] I included at least **2 screenshots** (`screenshots/thumbnail.png` 1280×800 + `screenshots/desktop.png` full-page)
- [ ] I disclosed my manual edits honestly in `manualEditLevel` and `outcome.manualEdits`
- [ ] I set `permissions.permissionToFeature: true`
- [ ] I set `permissions.rightsAttested: true`
- [ ] This submission contains **no secrets, private keys, or credentials**
- [ ] I ran `npm run validate` locally and the check passed

## Notes for reviewer

<!-- Anything the reviewer should know: unusual approach, known limitations, context about the prompt, etc. -->
