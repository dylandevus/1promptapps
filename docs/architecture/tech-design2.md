````markdown
# Technical Design Document: 1PromptApps

Version: 1.0  
Deployment target: Vercel  
MVP model: Static HTML webapps only  
Primary submission model: GitHub PR-based curated registry  
Initial data model: No database; Git + generated JSON registry  
Public showcase URL format: `https://1promptapps.com/{username}/{app-slug}`

---

## 1. Product Summary

1PromptApps is a curated web platform that showcases real static webapps built from a single AI prompt.

Each app is presented as a compact, proof-driven case study containing:

- Original prompt
- Static HTML/CSS/JS app demo
- Screenshots
- Builder/tool used
- Model used, when known
- Time-to-first-version
- Published date
- Source link, when available
- Manual edit disclosure
- Known limitations
- Licensing and permission metadata

The platform should feel like a credible gallery of reproducible prompt-to-app experiments, not a generic AI directory.

The MVP is intentionally simple:

- Static HTML webapps only
- Apps may call external APIs from the browser
- No backend execution of submitted apps
- No database initially
- GitHub PRs are the primary contribution mechanism
- Vercel hosts the main website
- Friendly public wrapper URLs show the app inside an iframe with a thin metadata banner

---

## 2. Core Product Decisions

### 2.1 Static Webapps Only

Supported app type:

```text
Static HTML/CSS/JS webapps
````

Allowed:

```text
index.html
CSS
JavaScript
Images
Fonts
JSON
Markdown
Client-side API calls to external services
```

Not allowed for MVP:

```text
Server-rendered apps
Node.js backends
Python backends
Docker containers
Serverless functions submitted by users
Databases per app
Long-running jobs
Cron jobs
Private environment variables
```

Reasoning:

* Greatly reduces hosting and security complexity
* Makes moderation easier
* Makes PR-based contribution practical
* Keeps the platform focused on visible prompt-to-app outcomes
* Avoids arbitrary backend code execution

---

### 2.2 No Database for MVP

For fewer than roughly 200 apps, a database is unnecessary.

Initial source of truth:

```text
GitHub repository + manifest files
```

Generated runtime data:

```text
generated/apps.json
generated/categories.json
generated/builders.json
generated/sitemap.json
```

The Next.js app reads generated JSON files and statically generates pages.

Add a database later only when the platform needs:

* User accounts
* In-app submissions
* Drafts
* Private moderation notes
* View counts
* Demo click analytics
* Contributor dashboards
* Advanced search
* Favorites
* Comments
* Instant publishing without redeploy
* Large-scale ingestion

---

### 2.3 GitHub PR Submission Model

Preferred contribution path:

```text
Contributor opens a GitHub PR adding one app bundle.
Maintainer reviews.
CI validates.
Merge means approved for publication.
A build step regenerates the public registry.
Vercel deploys the updated site.
```

This gives the platform:

* Transparent contribution history
* Public review process
* Community credibility
* Low infrastructure overhead
* Easy rollback
* Human moderation through PR review
* Automated validation through GitHub Actions

---

### 2.4 Friendly Showcase URL

Each published app should have a clean showcase URL:

```text
https://1promptapps.com/{username}/{app-slug}
```

Example:

```text
https://1promptapps.com/duc/todolist-app
```

This URL is not the raw app file. It is a 1PromptApps-owned wrapper page.

The wrapper page includes:

* Thin top banner
* App metadata
* Prompt/source/actions
* iframe containing the actual static app

---

### 2.5 iframe Showcase Model

The actual app appears inside an iframe.

Recommended layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ 1PromptApps · Todo List App · Built with v0 · 12 min · Jun 13 │
│ [Prompt] [Source] [Open app] [Report]                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  iframe: static submitted app                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

This is a good practice for 1PromptApps because it:

* Preserves consistent attribution
* Shows provenance and trust signals
* Keeps the submitted app unmodified
* Gives users context before interacting with the app
* Creates a branded, shareable showcase page
* Allows reporting and source/prompt actions outside the iframe

---

## 3. Recommended MVP Architecture

```text
GitHub Repo: 1promptapps/gallery
  ├── apps/
  │   └── {username}/
  │       └── {app-slug}/
  │           ├── manifest.json
  │           ├── prompt.md
  │           ├── index.html
  │           ├── assets/
  │           └── screenshots/
  ├── schemas/
  │   └── manifest.schema.json
  ├── scripts/
  │   ├── validate-app.ts
  │   ├── validate-all.ts
  │   └── build-registry.ts
  └── generated/
      ├── apps.json
      ├── categories.json
      ├── builders.json
      └── sitemap.json


Vercel Project: 1promptapps-web
  ├── Next.js app
  ├── Public gallery
  ├── Static showcase wrapper pages
  ├── Category pages
  ├── Builder pages
  └── Static JSON registry


Public routes:
  ├── /
  ├── /apps
  ├── /categories/{category}
  ├── /builders/{builder}
  ├── /submit
  ├── /submit/github
  └── /{username}/{app-slug}
```

---

## 4. Hosting Model

### 4.1 Main Site

Main site:

```text
https://1promptapps.com
```

Hosted by:

```text
Vercel
```

Responsibilities:

* Home page
* Gallery page
* Category pages
* Builder pages
* Showcase wrapper pages
* Submission guidelines
* Static registry loading
* SEO pages
* Sitemap generation

---

### 4.2 Static App Hosting

For MVP, static app files may live inside the same repository and be served as public files.

Simple MVP path:

```text
https://1promptapps.com/_apps/{username}/{app-slug}/index.html
```

Better isolation path:

```text
https://apps.1promptapps.com/{username}/{app-slug}/index.html
```

Recommended long-term:

```text
Parent showcase:
https://1promptapps.com/duc/todolist-app

Iframe app:
https://apps.1promptapps.com/duc/todolist-app/
```

The separate `apps.1promptapps.com` origin is preferred because submitted static apps contain JavaScript and should not share the same origin as the main product, admin pages, cookies, or future authenticated sessions.

---

## 5. iframe Security Model

Even though the apps are static only, iframe isolation is still recommended.

Static JavaScript can still:

* Redirect users
* Open popups
* Track users
* Call external APIs
* Attempt phishing UI
* Abuse browser APIs
* Try to communicate with the parent frame
* Load third-party scripts

### 5.1 Recommended iframe

```html
<iframe
  src="https://apps.1promptapps.com/duc/todolist-app/"
  title="Todo List App demo"
  sandbox="allow-scripts allow-forms allow-popups allow-downloads"
  referrerpolicy="strict-origin-when-cross-origin"
  loading="lazy"
></iframe>
```

### 5.2 More Compatible iframe for API-Heavy Apps

Some browser APIs and external API flows may need same-origin behavior inside the iframe.

Use this only when the iframe app is hosted on a separate origin from the parent:

```html
<iframe
  src="https://apps.1promptapps.com/duc/todolist-app/"
  title="Todo List App demo"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
  referrerpolicy="strict-origin-when-cross-origin"
  loading="lazy"
></iframe>
```

Important rule:

```text
Do not use allow-scripts + allow-same-origin when the submitted app is served from the same origin as the main 1PromptApps site.
```

---

## 6. Public Showcase Page

Route:

```text
/{username}/{app-slug}
```

Example:

```text
/duc/todolist-app
```

Purpose:

* Show the static app in an iframe
* Provide provenance and metadata
* Keep the 1PromptApps trust layer visible
* Link to the original prompt
* Link to source, if available
* Link to the app in full-screen mode
* Allow reporting problematic apps

---

## 7. Showcase Page Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1PromptApps                                                                  │
│                                                                              │
│ Todo List App                                                                │
│ Built with v0 · Model: GPT-5 · First version: 12 min · Published Jun 13, 2026 │
│ Manual edits: Minor · Category: Productivity                                 │
│                                                                              │
│ [View prompt] [View source] [Open full app] [Report]                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                            iframe demo area                                  │
│                                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Banner UX Recommendation

The thin banner is a good practice for this product.

Recommended desktop height:

```text
44px to 64px
```

Recommended mobile height:

```text
56px to 80px
```

Banner should include:

```text
App name
Builder/tool
Model, if known
Generation duration
Published date
Manual edit level
Prompt button
Source button, if available
Open full app button
Report button
```

Avoid:

```text
Large branding
Animated AI visuals
Heavy navigation
Popups
Large sidebars
Anything that makes the app feel trapped
```

The banner should feel like a thin provenance layer, not a browser inside a browser.

---

## 9. Main Screens

### 9.1 Home Page

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1PromptApps                         Apps  Builders  Submit  About           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Real static webapps built from one AI prompt.                                │
│ Browse proof-driven examples with prompts, demos, screenshots, source links, │
│ builder info, generation time, and honest edit notes.                        │
│                                                                              │
│ [Browse apps] [Submit via GitHub]                                             │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Featured Apps                                                                │
│                                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                           │
│ │ Screenshot   │ │ Screenshot   │ │ Screenshot   │                           │
│ │ App name     │ │ App name     │ │ App name     │                           │
│ │ Builder      │ │ Builder      │ │ Builder      │                           │
│ │ 12 min       │ │ 28 min       │ │ 45 min       │                           │
│ └──────────────┘ └──────────────┘ └──────────────┘                           │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ What each case study includes                                                │
│ Prompt · Static demo · Screenshots · Builder · Model · Duration · Edits      │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Submit an app                                                                │
│ Add your static HTML webapp by opening a GitHub pull request.                │
│ [Contribution guide] [Open GitHub repo]                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 9.2 Gallery Page

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1PromptApps                         Apps  Builders  Submit  About           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Apps                                                                         │
│ Static webapps built from one AI prompt.                                     │
│                                                                              │
│ Search: [ todo, dashboard, csv, finance, education...                  ]     │
│                                                                              │
│ ┌───────────────┐ ┌────────────────────────────────────────────────────────┐ │
│ │ Filters       │ │ Sort: Featured first                                  │ │
│ │               │ │                                                        │ │
│ │ Category      │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐           │ │
│ │ □ Productivity│ │ │ Screenshot │ │ Screenshot │ │ Screenshot │           │ │
│ │ □ Education   │ │ │ App name   │ │ App name   │ │ App name   │           │ │
│ │ □ Finance     │ │ │ Builder    │ │ Builder    │ │ Builder    │           │ │
│ │ □ Tools       │ │ │ 12 min     │ │ 28 min     │ │ 45 min     │           │ │
│ │               │ │ └────────────┘ └────────────┘ └────────────┘           │ │
│ │ Builder       │ │                                                        │ │
│ │ □ v0          │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐           │ │
│ │ □ Lovable     │ │ │ Screenshot │ │ Screenshot │ │ Screenshot │           │ │
│ │ □ Bolt        │ │ │ App name   │ │ App name   │ │ App name   │           │ │
│ │ □ Replit      │ │ └────────────┘ └────────────┘ └────────────┘           │ │
│ │               │ │                                                        │ │
│ │ Source        │ │                                                        │ │
│ │ □ Available   │ │                                                        │ │
│ │               │ │                                                        │ │
│ │ Manual edits  │ │                                                        │ │
│ │ □ None        │ │                                                        │ │
│ │ □ Minor       │ │                                                        │ │
│ │ □ Moderate    │ │                                                        │ │
│ └───────────────┘ └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 9.3 App Card

```text
┌────────────────────────────────────┐
│ ┌────────────────────────────────┐ │
│ │ Screenshot                      │ │
│ └────────────────────────────────┘ │
│                                    │
│ Todo List App                      │
│ Simple task tracking from one prompt│
│                                    │
│ Productivity · v0                  │
│ Model: GPT-5                       │
│ First version: 12 min              │
│ Manual edits: Minor                │
│                                    │
│ [View app] [Prompt] [Source]       │
└────────────────────────────────────┘
```

---

### 9.4 Prompt Detail Modal

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Original Prompt                                                    [Close]   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Build a simple todo list web app with local storage, filters for active and  │
│ completed tasks, a clean responsive layout, and no external dependencies...   │
│                                                                              │
│ [Copy prompt]                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

### 9.5 Submit Page

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Submit to 1PromptApps                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ The preferred way to submit is through GitHub.                               │
│                                                                              │
│ Your app must be a static HTML/CSS/JS webapp.                                │
│ It may call external APIs from the browser, but it cannot require a backend   │
│ hosted by 1PromptApps.                                                       │
│                                                                              │
│ Submission must include:                                                     │
│ - manifest.json                                                              │
│ - prompt.md                                                                  │
│ - index.html                                                                 │
│ - screenshots                                                                │
│ - license and permission metadata                                            │
│                                                                              │
│ [View contribution guide] [Open GitHub repo]                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. GitHub Repository Structure

Recommended public repo:

```text
1promptapps-gallery/
├── README.md
├── CONTRIBUTING.md
├── apps/
│   └── duc/
│       └── todolist-app/
│           ├── manifest.json
│           ├── prompt.md
│           ├── index.html
│           ├── assets/
│           │   ├── app.js
│           │   └── style.css
│           └── screenshots/
│               ├── thumbnail.png
│               ├── desktop.png
│               └── mobile.png
├── templates/
│   └── static-app/
│       ├── manifest.json
│       ├── prompt.md
│       ├── index.html
│       ├── assets/
│       └── screenshots/
├── schemas/
│   └── manifest.schema.json
├── scripts/
│   ├── validate-app.ts
│   ├── validate-all.ts
│   ├── build-registry.ts
│   └── check-unique-slugs.ts
├── generated/
│   ├── apps.json
│   ├── categories.json
│   ├── builders.json
│   └── sitemap.json
└── .github/
    ├── workflows/
    │   ├── validate-pr.yml
    │   └── build-registry.yml
    ├── PULL_REQUEST_TEMPLATE.md
    └── CODEOWNERS
```

---

## 11. App Bundle Format

Each submitted app lives at:

```text
apps/{username}/{app-slug}/
```

Example:

```text
apps/duc/todolist-app/
```

Required structure:

```text
apps/duc/todolist-app/
├── manifest.json
├── prompt.md
├── index.html
├── assets/
│   ├── app.js
│   ├── style.css
│   └── optional-image.png
└── screenshots/
    ├── thumbnail.png
    ├── desktop.png
    └── mobile.png
```

Optional:

```text
README.md
LICENSE
source-link.txt
screenshots/og-image.png
screenshots/desktop-2.png
screenshots/mobile-2.png
```

---

## 12. Manifest Format

Example:

```json
{
  "schemaVersion": "1.0.0",
  "name": "Todo List App",
  "slug": "todolist-app",
  "username": "duc",
  "tagline": "A simple task tracker built from one prompt.",
  "description": "A static todo list webapp with local storage, task filtering, and a responsive layout.",
  "category": "productivity",
  "tags": ["todo", "productivity", "local-storage"],
  "builder": "v0",
  "model": "gpt-5",
  "generationDurationMinutes": 12,
  "publishedAt": "2026-06-13T10:30:00Z",
  "promptFile": "prompt.md",
  "entrypoint": "index.html",
  "screenshots": {
    "thumbnail": "screenshots/thumbnail.png",
    "desktop": "screenshots/desktop.png",
    "mobile": "screenshots/mobile.png",
    "ogImage": "screenshots/og-image.png"
  },
  "sourceUrl": "https://github.com/duc/todolist-app",
  "externalApiDomains": [],
  "manualEditLevel": "minor",
  "whatWorked": [
    "Generated the initial UI structure correctly.",
    "Created local storage persistence without extra libraries."
  ],
  "manualEdits": [
    "Adjusted mobile spacing.",
    "Renamed a few variables for clarity."
  ],
  "knownLimitations": [
    "No cloud sync.",
    "Tasks are stored only in the browser."
  ],
  "license": "MIT",
  "permissionToFeature": true,
  "author": {
    "name": "Duc Nguyen",
    "url": "https://example.com"
  }
}
```

---

## 13. Manifest Required Fields

Required:

```text
schemaVersion
name
slug
username
tagline
description
category
builder
generationDurationMinutes
promptFile
entrypoint
screenshots.thumbnail
screenshots.desktop
manualEditLevel
license
permissionToFeature
```

Recommended:

```text
model
tags
sourceUrl
screenshots.mobile
screenshots.ogImage
externalApiDomains
whatWorked
manualEdits
knownLimitations
author.name
author.url
```

---

## 14. Slug and Username Rules

### Username

```text
Lowercase preferred
3 to 32 characters
Letters, numbers, hyphens, and underscores
Must not conflict with reserved routes
```

Reserved usernames:

```text
apps
app
admin
api
submit
about
privacy
terms
categories
builders
static
assets
_app
_next
```

### App Slug

```text
Lowercase
3 to 80 characters
Letters, numbers, and hyphens only
Must be unique within username namespace
```

Valid:

```text
todolist-app
csv-inventory-planner
habit-tracker
```

Invalid:

```text
TodoList
todo_list
todo list
admin
```

---

## 15. Generated Registry

The build process scans all app manifests and creates:

```text
generated/apps.json
```

Example:

```json
[
  {
    "id": "duc/todolist-app",
    "username": "duc",
    "slug": "todolist-app",
    "path": "/duc/todolist-app",
    "name": "Todo List App",
    "tagline": "A simple task tracker built from one prompt.",
    "description": "A static todo list webapp with local storage, task filtering, and a responsive layout.",
    "category": "productivity",
    "tags": ["todo", "productivity", "local-storage"],
    "builder": "v0",
    "model": "gpt-5",
    "generationDurationMinutes": 12,
    "publishedAt": "2026-06-13T10:30:00Z",
    "manualEditLevel": "minor",
    "sourceUrl": "https://github.com/duc/todolist-app",
    "demoUrl": "/_apps/duc/todolist-app/index.html",
    "thumbnail": "/_apps/duc/todolist-app/screenshots/thumbnail.png",
    "screenshots": {
      "desktop": "/_apps/duc/todolist-app/screenshots/desktop.png",
      "mobile": "/_apps/duc/todolist-app/screenshots/mobile.png"
    },
    "license": "MIT",
    "permissionToFeature": true
  }
]
```

Also generate:

```text
generated/categories.json
generated/builders.json
generated/search-index.json
generated/sitemap.json
```

---

## 16. Contribution Flow

```text
Contributor forks repo
  → Copies templates/static-app
  → Adds app under apps/{username}/{app-slug}
  → Adds manifest.json
  → Adds prompt.md
  → Adds index.html and assets
  → Adds screenshots
  → Opens pull request
  → GitHub Action validates submission
  → Maintainer reviews app, prompt, screenshots, metadata
  → Maintainer approves and merges
  → Registry is regenerated
  → Vercel deploys updated gallery
  → App appears at /{username}/{app-slug}
```

---

## 17. Pull Request Template

```markdown
## App Submission

### App Info

- App name:
- Username:
- App slug:
- Builder/tool used:
- Model used:
- Time to first version:
- Category:
- Source URL, if available:

### Checklist

- [ ] My app is static HTML/CSS/JS only.
- [ ] My app does not require a backend hosted by 1PromptApps.
- [ ] My app may call external APIs from the browser, and I listed them in manifest.json.
- [ ] I included `manifest.json`.
- [ ] I included `prompt.md`.
- [ ] I included `index.html`.
- [ ] I included required screenshots.
- [ ] I disclosed manual edits honestly.
- [ ] I included known limitations.
- [ ] I selected a license.
- [ ] I give 1PromptApps permission to feature this app.
- [ ] I confirm this submission does not contain secrets, private keys, or credentials.

### Notes for Reviewer

Add anything the reviewer should know.
```

---

## 18. GitHub Actions Validation

### 18.1 PR Validation Workflow

```yaml
name: Validate App Submission

on:
  pull_request:
    paths:
      - "apps/**"
      - "schemas/**"
      - "scripts/**"

permissions:
  contents: read
  pull-requests: read

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Validate submissions
        run: npm run validate
```

Important:

```text
Do not execute submitted JavaScript.
Do not run npm install inside submitted app folders.
Do not use pull_request_target for untrusted app validation.
Only parse, inspect, and validate files.
```

---

## 19. Validation Rules

CI should validate:

```text
One app folder per PR, preferred
manifest.json exists
manifest matches JSON schema
prompt.md exists
index.html exists
Required screenshots exist
Slug matches folder name
Username matches folder name
Username is not reserved
Slug is unique for that username
Required metadata exists
permissionToFeature is true
License is present
Allowed file extensions only
No hidden files
No .env files
No private keys
No credential-looking files
No symlinks
No files over max size
Total app folder under max size
External API domains are declared
Screenshot dimensions are acceptable
Image files are valid images
Prompt length is within allowed range
Manual edit level uses allowed enum
Category uses allowed enum
Builder uses allowed enum or "other"
```

---

## 20. Allowed File Types

Allowed:

```text
.html
.css
.js
.mjs
.json
.md
.txt
.png
.jpg
.jpeg
.webp
.gif
.svg
.woff
.woff2
.ico
```

Disallowed:

```text
.env
.pem
.key
.p12
.pfx
.sh
.bat
.exe
.dll
.so
.dylib
.py
.rb
.php
java
jar
dockerfile
docker-compose.yml
```

For SVG:

```text
Either sanitize SVGs or disallow them in MVP.
```

Simplest MVP recommendation:

```text
Do not allow SVG uploads initially.
Use PNG/WebP/JPEG for screenshots and images.
```

---

## 21. Size Limits

Recommended MVP limits:

```text
Maximum app folder size: 10 MB
Maximum individual file size: 2 MB
Maximum screenshot size: 2 MB
Maximum number of files per app: 100
Maximum path depth: 6
Maximum path length: 160 characters
```

Can be increased later if needed.

---

## 22. Categories

Initial categories:

```text
productivity
developer-tools
design-tools
education
finance
data-visualization
internal-tools
games
writing
personal-utilities
ecommerce
health-fitness
other
```

Display names:

```json
{
  "productivity": "Productivity",
  "developer-tools": "Developer Tools",
  "design-tools": "Design Tools",
  "education": "Education",
  "finance": "Finance",
  "data-visualization": "Data Visualization",
  "internal-tools": "Internal Tools",
  "games": "Games",
  "writing": "Writing",
  "personal-utilities": "Personal Utilities",
  "ecommerce": "E-commerce",
  "health-fitness": "Health & Fitness",
  "other": "Other"
}
```

---

## 23. Builders

Initial builders:

```text
v0
lovable
bolt
replit
cursor
claude
chatgpt
windsurf
other
```

Display names:

```json
{
  "v0": "v0",
  "lovable": "Lovable",
  "bolt": "Bolt",
  "replit": "Replit",
  "cursor": "Cursor",
  "claude": "Claude",
  "chatgpt": "ChatGPT",
  "windsurf": "Windsurf",
  "other": "Other"
}
```

---

## 24. Manual Edit Levels

Allowed values:

```text
none-claimed
minor
moderate
significant
unknown
```

Definitions:

```text
none-claimed:
Contributor claims no code edits were needed after first generation.

minor:
Small copy, styling, spacing, naming, or deployment fixes.

moderate:
Meaningful code fixes, validation work, state handling, layout correction, or API integration fixes.

significant:
Prompt produced a useful start, but final app required substantial manual work.

unknown:
Contributor did not provide enough information.
```

Display labels:

```text
None claimed
Minor edits
Moderate edits
Significant edits
Unknown
```

---

## 25. Next.js App Structure

```text
apps/web/
├── app/
│   ├── page.tsx
│   ├── apps/
│   │   └── page.tsx
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx
│   ├── builders/
│   │   └── [builder]/
│   │       └── page.tsx
│   ├── submit/
│   │   └── page.tsx
│   ├── [username]/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── editorial-policy/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── AppCard.tsx
│   ├── AppGrid.tsx
│   ├── AppFilters.tsx
│   ├── ShowcaseFrame.tsx
│   ├── ShowcaseBanner.tsx
│   ├── PromptModal.tsx
│   └── SiteHeader.tsx
├── lib/
│   ├── registry.ts
│   ├── filters.ts
│   ├── routes.ts
│   ├── seo.ts
│   └── constants.ts
├── generated/
│   ├── apps.json
│   ├── categories.json
│   └── builders.json
└── public/
    └── _apps/
        └── {username}/
            └── {app-slug}/
```

---

## 26. Static Page Generation

For each app in `generated/apps.json`, generate a route:

```text
/{username}/{slug}
```

Example pseudo-code:

```ts
export async function generateStaticParams() {
  const apps = await getApps();

  return apps.map((app) => ({
    username: app.username,
    slug: app.slug
  }));
}
```

The page loads app metadata and renders:

```text
ShowcaseBanner
ShowcaseFrame iframe
Prompt modal
SEO metadata
```

---

## 27. Showcase Page Component Structure

```text
ShowcasePage
├── Metadata/SEO
├── ShowcaseBanner
│   ├── App title
│   ├── Builder
│   ├── Model
│   ├── Duration
│   ├── Published date
│   ├── Manual edit level
│   ├── Prompt button
│   ├── Source button
│   └── Open full app button
├── ShowcaseFrame
│   └── iframe
└── PromptModal
```

---

## 28. App Detail vs Showcase Page

For MVP, the friendly URL can serve as the showcase page.

```text
/{username}/{app-slug}
```

This page includes both:

* Metadata banner
* iframe app

Later, if desired, split into:

```text
/{username}/{app-slug}
  Full case study page

/{username}/{app-slug}/demo
  iframe-focused demo page
```

MVP recommendation:

```text
Use one combined showcase page.
Keep it simple.
```

---

## 29. SEO Design

Each app page should generate:

```text
Title
Meta description
Canonical URL
Open Graph title
Open Graph description
Open Graph image
Twitter card
Structured data if useful
```

Example title:

```text
Todo List App — Static App Built from One AI Prompt | 1PromptApps
```

Example description:

```text
A static todo list webapp built from one prompt using v0. Includes the original prompt, screenshots, builder info, generation time, source link, and manual edit notes.
```

---

## 30. Search and Filtering Without a DB

For under 200 apps, client-side filtering is sufficient.

Gallery loads:

```text
generated/apps.json
```

Supported filters:

```text
Search text
Category
Builder
Model
Manual edit level
Source available
Generation duration bucket
Published date
Tags
```

Search fields:

```text
name
tagline
description
category
builder
model
tags
prompt text summary, optional
```

Sort options:

```text
Featured
Newest
Shortest generation duration
Source available first
Alphabetical
```

---

## 31. Build Registry Script

The registry build script should:

```text
Scan apps/*/*
Read manifest.json
Validate schema
Check prompt file
Check entrypoint
Check screenshots
Normalize metadata
Generate stable app ID
Generate public route
Generate iframe demo URL
Generate apps.json
Generate categories.json
Generate builders.json
Generate sitemap.json
Fail build if any app is invalid
```

Pseudo-code:

```ts
for each folder in apps/{username}/{slug}:
  read manifest.json
  validate manifest
  validate folder structure
  validate files
  normalize app metadata
  add to registry

write generated/apps.json
write generated/categories.json
write generated/builders.json
write generated/sitemap.json
```

---

## 32. Vercel Deployment

Recommended deployment flow:

```text
PR opened
  → GitHub Action validates app submission

PR merged to main
  → Build registry
  → Vercel deployment triggered
  → Static pages generated
  → App appears in gallery
```

Environment:

```text
Framework: Next.js
Host: Vercel
Data source: generated JSON files
Static apps: public files or separate static app domain
```

No production database required.

No production write API required.

No authentication required for MVP.

---

## 33. Security Headers

### 33.1 Main Site Headers

Recommended:

```text
Content-Security-Policy:
  default-src 'self';
  frame-src 'self' https://apps.1promptapps.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';

X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

### 33.2 Static App Headers

If apps are hosted on a separate app origin:

```text
Content-Security-Policy:
  default-src 'self' https: data: blob:;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' data: blob: https:;
  connect-src https:;
  font-src 'self' data: https:;
  object-src 'none';
  base-uri 'none';
  frame-ancestors https://1promptapps.com;

X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

Note:

```text
Because submitted apps may call external APIs, connect-src is intentionally broad in MVP.
Later, connect-src can be generated from externalApiDomains in manifest.json.
```

---

## 34. Trust and Moderation

Even with PR-based submission, moderation remains essential.

Maintainers should review:

```text
Does the app actually load?
Is the prompt included?
Are screenshots real and useful?
Is the app appropriate for publication?
Does the app contain suspicious scripts?
Are external API calls disclosed?
Are manual edits disclosed?
Is the source URL valid, if provided?
Is the license clear?
Did the contributor grant permission to feature it?
```

The platform should avoid claiming:

```text
Verified 100% generated by one prompt
```

Use safer wording:

```text
Submitted as built from one prompt
Original prompt included
Manual edits disclosed
Reviewed for completeness
```

---

## 35. Editorial Policy

Recommended public policy:

```text
1PromptApps showcases static webapps submitted as examples of apps built from a single AI prompt.

Each published app includes structured evidence such as the original prompt, screenshots, builder/tool used, generation duration, source link when available, and manual edit notes.

Submissions are reviewed before publication for completeness, safety, formatting, and relevance.

1PromptApps does not independently guarantee that every final app was produced exclusively from one prompt. Instead, the platform emphasizes transparency, disclosure, and reproducible evidence.

Apps may be removed if they contain harmful content, broken demos, copyright issues, exposed secrets, misleading claims, or other policy violations.
```

---

## 36. UX Writing Guidelines

Tone:

```text
Clear
Calm
Specific
Evidence-oriented
Builder-friendly
```

Avoid:

```text
Revolutionary
Insane
Magic
No-code miracle
Built instantly
10x everything
```

Use:

```text
Built from this prompt
First version in 12 minutes
Prompt included
Manual edits disclosed
Static demo available
Source available
Reviewed submission
Known limitations
```

---

## 37. Visual Design Direction

The platform should feel like:

```text
A clean editorial software gallery
A proof-driven case study library
A curated prompt-to-app archive
```

Avoid:

```text
Neon AI gradients
Robot mascots
Overhyped SaaS graphics
Flashy animations
```

Use:

```text
Neutral background
Strong typography
Subtle borders
Consistent cards
Screenshot-first layouts
Compact metadata chips
Monospace prompt blocks
Readable filters
```

---

## 38. Design Tokens

```text
Background: off-white or near-white
Surface: white
Border: neutral gray
Text primary: near-black
Text secondary: muted gray
Accent: restrained blue, slate, or green

Card radius: 12px to 16px
Button radius: 8px to 10px
Base spacing: 4px scale
Page gutters: 24px mobile, 48px to 80px desktop
Prompt font: monospace
```

---

## 39. Accessibility Requirements

Target:

```text
WCAG 2.2 AA
```

Requirements:

```text
Keyboard-accessible navigation
Visible focus states
Semantic headings
Alt text for screenshots
Accessible form labels
Sufficient color contrast
Skip-to-content link
Reduced motion support
No color-only status indicators
Prompt modal must trap and restore focus
iframe must have descriptive title
Buttons must have accessible labels
```

---

## 40. No-DB Limitations

The no-database MVP will not support:

```text
Private submission drafts
Contributor dashboards
View counts
Click counts
Favorites
Comments
Admin moderation UI
Instant publishing without Git merge
Private reviewer notes
Role-based permissions
Advanced analytics
```

This is acceptable for the first version.

The GitHub PR workflow acts as:

```text
Submission system
Moderation queue
Audit history
Contributor attribution
Approval workflow
```

---

## 41. When to Add a Database

Add a database when any of the following become important:

```text
More than 200-500 apps
Multiple submissions per day
Non-technical users need web upload
Need private moderation notes
Need user accounts
Need analytics
Need app ownership management
Need broken-link monitoring history
Need advanced search
Need instant publishing
Need admin dashboard
```

Recommended future DB:

```text
PostgreSQL
```

Possible future tables:

```text
users
apps
submissions
assets
categories
builders
moderation_decisions
audit_logs
analytics_events
```

---

## 42. Future Database Migration Path

The migration path is straightforward because each app already has a manifest.

Future import process:

```text
Read all manifest.json files
Insert or update users by username
Insert or update apps by username + slug
Import screenshots and prompt paths
Import source links
Import builder/category metadata
Store Git commit SHA and PR number
```

Future fields:

```sql
CREATE TABLE apps (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  builder TEXT NOT NULL,
  model TEXT,
  generation_duration_minutes INTEGER,
  manual_edit_level TEXT,
  prompt_text TEXT NOT NULL,
  demo_url TEXT NOT NULL,
  source_url TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  source_commit_sha TEXT,
  source_pr_number INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(username, slug)
);
```

---

## 43. MVP Acceptance Criteria

The MVP is successful when:

```text
A visitor can browse all apps.
A visitor can filter by category and builder.
A visitor can search apps.
A visitor can open /{username}/{app-slug}.
The showcase page displays a thin metadata banner.
The app runs inside an iframe.
A visitor can view the original prompt.
A visitor can open the source link when available.
A visitor can open the full static app.
A contributor can submit an app through GitHub PR.
CI validates the app folder and manifest.
Maintainers can review and merge PRs.
Merged apps appear on the Vercel site.
No database is required.
No user-submitted backend code is executed.
```

---

## 44. Recommended Build Order

### Phase 1: Static Registry

```text
Create repo structure
Define manifest schema
Create sample apps
Create validation script
Create registry generation script
Generate apps.json
```

### Phase 2: Public Website

```text
Build Next.js app on Vercel
Create home page
Create gallery page
Create app cards
Create showcase route /{username}/{slug}
Render iframe with top banner
Add prompt modal
Add SEO metadata
```

### Phase 3: Contribution Workflow

```text
Write CONTRIBUTING.md
Add app template
Add PR template
Add GitHub Actions validation
Add CODEOWNERS
Add branch protection
```

### Phase 4: Polish

```text
Add category pages
Add builder pages
Add search/filter UI
Add Open Graph images
Add sitemap
Add accessibility pass
Add security headers
```

### Phase 5: Later Enhancements

```text
Separate apps.1promptapps.com origin
Add web upload form
Add database
Add admin dashboard
Add analytics
Add link checker
Add contributor profiles
```

---

## 45. Final Recommendation

For the current stage of 1PromptApps:

```text
Use no database.
Use GitHub as the source of truth.
Use PRs as the primary submission workflow.
Require one static app bundle per submission.
Validate every submission with GitHub Actions.
Generate a static JSON registry.
Deploy the Next.js site to Vercel.
Use friendly showcase URLs like /{username}/{app-slug}.
Show each app inside an iframe.
Keep a thin top banner outside the iframe with provenance and trust metadata.
Use iframe sandboxing even though apps are static.
Move to a database only after submission volume or product needs justify it.
```

This architecture is simple, credible, cheap to operate, easy to moderate, and aligned with the curated “awesome repo” community model while still feeling like a polished product.

```
```
