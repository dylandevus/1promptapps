- Keep docs concise: plain text, short prose, ASCII diagrams over verbose explanations.
- Apps may be light or dark theme — both accepted. Require `theme: light | dark | auto` in the manifest.

## Adding a new app

```
1. Create folder + copy HTML
   mkdir -p apps/<username>/<slug>/screenshots
   cp <source>.html apps/<username>/<slug>/index.html

2. Write manifest.json  (copy from templates/static-app/manifest.json, fill all fields)
   Key prompt fields: builtWith, model, modelId, provider, effort,
   generationDurationSeconds, followUpCount, followUpPrompts, errorFixes, toolsUsed

3. Write prompt.md  (exact original prompt)

4. Take screenshots  (requires npm run dev on port 3030)
   npm run screenshot <username>/<slug>
   → writes screenshots/thumbnail.png (1280×800) + desktop.png (full-page)

5. Validate
   npm run validate

6. Build + preview
   npm run build && npm run dev
   → check http://localhost:3030/<username>/<slug>

7. Commit + push
   git add -A
   git commit -m "Add <slug>"
   git push
```
