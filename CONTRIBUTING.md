# Contributing to 1PromptApps

Open a PR to this repo adding your app folder.

## What qualifies

- Static HTML/CSS/JS — runs in the browser, no server.
- Built from one AI prompt. Follow-up feature prompts are fine for fixing bugs — disclose them.
- Use CDN-based libs: lit-html, Tailwind, Chart.js, Alpine.js, htmx, Lucide, etc. Avoid build-step frameworks (React, Vue, Svelte) — they don't work in a single HTML file.
- Run in **yolo mode** so generation time is uninterrupted by approval prompts — the `generationDurationSeconds` you record should reflect pure model time:
  ```
  claude --dangerously-skip-permissions   # Claude Code
  codex --yolo                            # Codex
  ```
- You have the right to share it and grant permission to feature it.

## Steps

```
1. Fork this repo

2. Copy templates/static-app/ → apps/<username>/<slug>/
   username  lowercase, 3–32 chars, [a-z0-9_-], not a reserved word
   slug      lowercase, 3–80 chars, [a-z0-9.-], unique within your username

3. Add your app files:
   index.html          required — demo entry point
   assets/             optional — local JS/CSS/images (relative paths)

4. Fill manifest.json — key fields below; full reference in docs/how-submissions-work.md:
   prompt.text                 exact original prompt
   prompt.builtWith            tool: OpenCode, Cursor, v0, Claude Code…
   prompt.model / modelId      e.g. "GLM-5.1" / "zai-org/GLM-5.1"
   prompt.provider             e.g. DeepInfra, OpenRouter, Anthropic
   prompt.effort               low / medium / high / default
   prompt.followUpCount        0 = truly one prompt
   prompt.followUpPrompts      array of follow-up prompt texts
   prompt.errorFixes           fix prompts after errors (0 = ran clean)
   prompt.generationDurationSeconds
   prompt.toolsUsed            ["web-search", "code-interpreter"…]
   manualEditLevel             none-claimed | minor | moderate | significant
   externalApiDomains          every external host the app calls
   permissions.permissionToFeature: true
   permissions.rightsAttested: true

5. Add prompt.md — paste your exact original prompt.
   Append this to the end of your prompt for consistent, comparable outputs:

   > Output to a HTML file with a light theme that works on both desktop and mobile screens (responsive). Measure the total time it takes you to generate this app completely end-to-end.

6. Add screenshots/:
   thumbnail.png   1280×800 (16:10), ≤ 2 MB
   desktop.png     full-page, ≤ 2 MB

7. npm run validate  — fix everything it flags

8. Open a PR, fill the checklist
   → CI validates and posts a comment
   → Vercel posts a preview deploy of your case-study page
   → Maintainer reviews and merges

9. Merged → live at https://1promptapps.com/<username>/<slug>
```

## Limits

| | |
|---|---|
| Folder | ≤ 5 MB |
| Per file | ≤ 2 MB |
| Files | ≤ 50 |
| Path depth | ≤ 6 |

## Allowed extensions

`.html .css .js .mjs .json .md .txt .png .jpg .jpeg .webp .gif .woff .woff2 .ico`

No `.env`, credentials, symlinks, executables, or server-side scripts.

## Honesty

`manualEditLevel` and `errorFixes` are the trust layer. Being honest increases credibility.
We never claim "verified one prompt" — only that it was submitted as one, with edits disclosed.

One PR = one app. Use clear nouns: "Habit Heatmap", not "Insane AI Tracker".
