# Changelog

Format: `- <area>: <type>: <details> - <author> (+added -removed)`

## 2026-06-16

- app: feat: SEO meta with OpenGraph/Twitter cards, sitemap, robots.txt, og-default image, plus how-submissions-work doc - Henry (+237 -18)
- repo: feat: contributor infrastructure (CODE_OF_CONDUCT, LICENSE, issue templates) and stock-dashboard-mistral app - dylan (+488 -0)
- apps: feat: add 4 low-poly RPG game apps, Comments component, usability field, and card redesign - ducsyn (+5077 -30)

## 2026-06-14

- manifest: feat: add estimatedCostUSD field to schema and all apps (null = to fill in) - ducsyn (+12 -3)
- docs: docs: CONTRIBUTING recommend yolo mode for uninterrupted generation timing - ducsyn (+5 -0)

## 2026-06-13

- gallery: feat: sort by publishedAt ISO datetime and add timestamps to all manifests - ducsyn (+6 -6)
- gallery: refactor: remove edit-level and sort dropdowns from filter bar - ducsyn (+3 -43)
- apps: fix: stock-dashboard-opus-4.8-high builtWith OpenCode → Claude Code - ducsyn (+1 -1)
- apps: feat: add stock-dashboard-opus-4.8-high, Playwright screenshot script, and CLAUDE.md - ducsyn (+818 -7)
- docs: docs: CONTRIBUTING move CDN-libs note into "What qualifies" section - ducsyn (+1 -4)
- docs: docs: CONTRIBUTING recommend CDN libs (lit-html, Tailwind, Chart.js), avoid build-step frameworks - ducsyn (+4 -0)
- docs: docs: CONTRIBUTING add required prompt suffix for consistent output format - ducsyn (+6 -1)
- docs: docs: update README and CONTRIBUTING with all new manifest fields - ducsyn (+85 -96)
- gallery: feat: search also matches slug, model, and builtWith (partial, case-insensitive) - ducsyn (+3 -0)
- detail: feat: add followUpPrompts array to manifest and render as numbered prompt blocks - ducsyn (+32 -2)
- gallery: feat: add Models filter and generate models.json in registry - ducsyn (+30 -5)
- app: feat: add /about page - ducsyn (+50 -0)
- detail: fix: hide 'no edits claimed', add model pill, show errorFixes in proof strip - ducsyn (+20 -5)
- apps: fix: stock-dashboard-glm-5.1 errorFixes 0 → 1 - ducsyn (+1 -1)
- gallery: feat: combine model+effort into one pill and pipe effort through registry - ducsyn (+3 -1)
- apps: refactor: replace GLM app with better 102s run, rename to stock-dashboard-glm-5.1 - ducsyn (+592 -1274)
- apps: feat: add stock-dashboard-glm-5.1-2 (102s run) and errorFixes field to manifests - ducsyn (+786 -0)
- detail: feat: show precise duration (38s, 3m 27s) from generationDurationSeconds - ducsyn (+23 -6)
- apps: feat: add gpt-5.5-high ETF dashboard, rename apps to stock-dashboard-<model>, allow dots in slugs - ducsyn (+700 -3)
- manifest: feat: add effort field (reasoning effort level) to prompt - ducsyn (+6 -0)
- card: fix: hide 'No edits claimed' pill, show edit level only when edits were made - ducsyn (+6 -4)
- card: refactor: model as pill, remove '1 prompt' text, move provider to metrics row - ducsyn (+11 -3)
- app: fix: suppress body hydration warning caused by browser extensions - ducsyn (+1 -1)
- detail: fix: demo frame fills viewport below banner (calc(100vh - 48px)); add CLAUDE.md - ducsyn (+2 -1)
- docs: docs: README with stack, submission flow, and manifest field reference - ducsyn (+53 -2)
- manifest: refactor: rename builder+tool → builtWith (free-form string, no enum) - ducsyn (+54 -64)
- manifest: refactor: add tool field (OpenCode), rename ducsyn → dylandevus, drop stale tech-design2 doc - dylandevus (+9 -1976)
- manifest: feat: add modelId field (canonical provider model ID, e.g. zai-org/GLM-5.1) - dylandevus (+3 -1)
- manifest: feat: add provider field to prompt (e.g. DeepInfra, OpenRouter) - dylandevus (+5 -0)
- manifest: feat: add generationDurationSeconds and toolsUsed, fix prompt text - dylandevus (+18 -2)
- docs: docs: update §0.4 checklist — mark implemented items, note remaining TODOs - dylandevus (+32 -32)
- docs: fix: point all references to dylandevus/1promptapps - dylandevus (+13 -13)
- docs: fix: repo URL → ducsyn/1promptapps - dylandevus (+3 -3)
- docs: fix: GitHub repo URLs → dylandevus/1promptapps - dylandevus (+3 -3)
- app: feat: v0 static Next.js gallery and first app (GLM stock dashboard), CI workflows, CONTRIBUTING - dylandevus (+8106 -210)
- repo: minor: initial commit (.gitignore, README) - dylandevus (+220 -0)
