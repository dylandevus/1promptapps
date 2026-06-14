# Contributing to 1PromptApps

Submit your single-prompt webapp by opening a pull request to this repo.

## What qualifies

- A **static HTML/CSS/JS webapp** — runs entirely in the browser, no server required.
- Built from **one AI prompt** (follow-up prompts allowed, but disclosed via `followUpCount`).
- You have the right to share it and grant 1PromptApps permission to feature it.
- External API calls from the browser are fine — declare the domains in the manifest.

## Step-by-step

```
1.  Fork this repo  (or push a branch if you have write access)

2.  Copy templates/static-app/  →  apps/<your-github-username>/<your-app-slug>/
    Naming rules:
      username  lowercase, 3–32 chars, [a-z0-9_-], must not be a reserved word
      slug      lowercase, 3–80 chars, [a-z0-9-], unique within your username

3.  Drop your app in:
      index.html          (required — the demo entry point)
      assets/             (optional — local JS/CSS/images, relative paths only)

4.  Fill manifest.json  (copy from templates and edit)
    Key fields:
      name, tagline, category, builder, model
      prompt.text         — the exact prompt you used
      prompt.followUpCount  — 0 = truly one prompt
      outcome.reproducibility, outcome.worked, outcome.manualEdits
      manualEditLevel     — be honest: none-claimed | minor | moderate | significant
      externalApiDomains  — list every external host your app calls
      permissions.permissionToFeature: true
      permissions.rightsAttested: true

5.  Paste your original prompt into  prompt.md

6.  Add screenshots/:
      thumbnail.png  — 1280×800 px (16:10), ≤ 2 MB
      desktop.png    — full-page desktop shot, ≤ 2 MB
      mobile.png     — optional

7.  Run the validator locally:
      npm install
      npm run validate

    Fix everything it flags before opening the PR.

8.  Open a PR.
    Fill the PR template checklist.
    GitHub Actions will validate your submission and post a comment.
    Vercel will post a preview deploy link — that's your app's live case-study page.

9.  A maintainer reviews (safety + editorial quality) and merges.
    Merge to main = published.
    Your app is live at:  https://1promptapps.com/<username>/<slug>
```

## File limits

| Limit | Value |
|---|---|
| Max folder size | 10 MB |
| Max per file | 2 MB |
| Max files | 100 |
| Max path depth | 6 |

## Allowed file types

`.html .css .js .mjs .json .md .txt .png .jpg .jpeg .webp .gif .woff .woff2 .ico`

Do **not** include: `.env`, `.pem`, `.key`, API credentials, symlinks, executables, or server-side scripts.

## One PR = one app

Keep each PR to a single app folder. This keeps review focused and CI fast.

## Tone & honesty

The `manualEditLevel` and `outcome.manualEdits` fields are the product's trust layer.
Being honest about edits **increases** credibility — we never claim "verified 100% one prompt",
only that it was *submitted as* built from one prompt with edits disclosed.

Use clear names — nouns over verbs ("Habit Heatmap", not "Insane AI Tracker").

## Questions?

Open an issue or start a discussion in this repo.
