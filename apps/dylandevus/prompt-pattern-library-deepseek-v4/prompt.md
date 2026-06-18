# Original Prompt

Build a self-contained single-file HTML app called 'Prompt Pattern Library' - an interactive reference of proven prompt engineering techniques. Requirements:

1. Each pattern is a card showing: name, category badge, short description, best-for note, an editable example (contenteditable), copy button, and tag chips.
2. Include at least 12 patterns: Chain-of-Thought, Persona Prompting, Few-Shot, System Prompt/Meta Instructions, Structured Output (JSON/XML), Zero-Shot Chain-of-Thought, Roleplay with Constraints, Tree-of-Thought, Refusal/Negative Prompting, Iterative Refinement, Delimiter-Based Extraction, Emotion/Urgency Prompting.
3. Category filter buttons (All, Reasoning, Role/Persona, Few-Shot, Structured, Zero-Shot).
4. Search input that filters by name, description, or tags.
5. Click a card to open a detail modal with: full description, how-it-works explanation, the full example in a pre/code block, and a pro tip section.
6. Copy button copies the example text to clipboard with visual feedback.
7. Dark theme with purple accent (#7c5cfc). Modern, clean UI with card hover effects.
8. Fully responsive: desktop grid (auto-fill, min 360px) and single-column on mobile.
9. Zero external dependencies — no CDN, no libraries, no fonts. Everything inline.
10. Smooth modal open/close animation. Close on Escape key or clicking overlay.
11. Accessible: aria-labels on interactive elements, semantic HTML.
12. Header with gradient title and subtitle.
