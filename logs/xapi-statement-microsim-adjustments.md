---
title: xAPI Statement Triple MicroSim — Layout Adjustments and Lesson Plan
date: 2026-04-30
session_type: post-generation refinement
target_sim: docs/sims/xapi-statement-triple/
---

# xAPI Statement Triple MicroSim — Session Summary

This session refined the `xapi-statement-triple` MicroSim (a Mermaid 2/3 + 1/3
diagram-and-info-panel sim built earlier in the day by the
`microsim-generator` skill). The work covered three areas: tightening the
flowchart layout, sizing the canvas correctly, and replacing the scaffold's
TODO placeholders in `index.md` with real prose, a "why this diagram matters"
section, and a full lesson plan.

## Files Modified

| File | Change |
|------|--------|
| `docs/sims/xapi-statement-triple/main.html` | Added `nodeSpacing`, `rankSpacing`, `padding` to Mermaid flowchart config |
| `docs/sims/xapi-statement-triple/xapi-statement-triple.js` | `CANVAS_HEIGHT` updated 520 → 510 |
| `docs/sims/xapi-statement-triple/index.md` | Replaced scaffold TODOs with About / Why / How / Lesson Plan / References |
| `docs/sims/xapi-statement-triple/xapi-statement-triple.png` | Regenerated screenshot at final dimensions |
| `docs/chapters/01-foundations-and-standards/index.md` | Iframe height updated to 512px |
| `CLAUDE.md` | New **Mermaid MicroSim Layout Rules** section |

## Layout Adjustments

The initial Mermaid render had Mermaid's default `nodeSpacing` (~50px) and
`padding` (~15px), which produced a sprawling diagram with cavernous gaps
between sibling nodes and puffy boxes around 1–2 lines of label text.
Tightened to:

```js
flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 12,    // was ~50 default
    rankSpacing: 60,    // was ~80 default
    padding: 4          // was ~15 default
}
```

Result: the 8 nodes (1 root + 3 required + 4 optional) fit in roughly 2/3 the
vertical space they did before, and the boxes hug the text.

## Canvas Height Iteration

The height-fitting required several attempts. Documented here because the
process is non-obvious — Mermaid silently clips when the canvas is too short.

| Attempt | CANVAS_HEIGHT | Iframe height | Result |
|---------|---------------|---------------|--------|
| Initial (pre-tighten) | 520 | 522px | Worked but with ~80px wasted space at top |
| First trim | 420 | 422px | **Authority node clipped** — bottom row hidden |
| Second trim | 480 | 482px | Authority still partially clipped |
| Final | 510 | 512px | All 8 nodes fully visible, minimal whitespace |

### Why the clipping was silent

The diagram-panel CSS sets `overflow: hidden` so the SVG can't show a
scrollbar when its natural aspect ratio exceeds the panel height. Mermaid's
`useMaxWidth: true` scales the SVG to fit container *width*, then height
follows from the natural aspect ratio. If the panel is shorter than the
scaled SVG, the bottom of the diagram disappears with no warning.

This is a footgun pattern: silent (no error), easy to trigger (just set
CANVAS_HEIGHT too low), and the damage is invisible (no scrollbar, no
console message). Captured in CLAUDE.md so the next Mermaid sim doesn't
repeat the loop.

## index.md Rewrite

Replaced the scaffold's six TODO blocks with substantive content:

- **About This MicroSim** — describes the diagram, the indigo/teal/slate
  color coding, and notes that the sim emits its own `interacted` statements
  (the textbook teaches the standard *with* the standard).
- **Why This Diagram Is Critical to Understanding xAPI** — five-point
  argument: maps to natural language; separates irreducible from optional;
  surfaces footguns inline; establishes vocabulary for later chapters;
  demonstrates the interactive-textbook thesis in miniature.
- **How to Use** — independent-reading walkthrough plus a classroom
  "predict before click" pattern.
- **Lesson Plan** — audience corrected from the scaffold's "High School
  Geometry" to College / Professional Development; 15–20 min duration;
  4 measurable learning objectives; 5 activities including a
  translate-and-write exercise (*"Yesterday at 2pm, Maya from the engineering
  cohort scored 88% on the Recursion quiz…"*) and a footgun discussion on
  absent-vs-`false` in `result.completion`.
- **References** — ADL spec §4 (Statements), ADL Verb Vocabulary, Rustici
  cookbook, IFI documentation.
- Iframe embed snippet in the docs corrected from `450px` → `512px` so
  copy-paste produces a working embed.

## CLAUDE.md Update

Added a new **Mermaid MicroSim Layout Rules** section between the
"Diagrams Must Be Interactive" rule and the Xavi mascot section. It
documents:

- The exact `flowchart` config values (`nodeSpacing: 12`, `rankSpacing: 60`,
  `padding: 4`) as project-wide defaults for Mermaid sims.
- The rationale for each value (so future-me can judge when to deviate).
- A canvas-height heuristic (4–5 nodes ≈ 380–420px; 6–8 nodes ≈ 480–520px;
  9+ nodes ≈ measure empirically).
- The `overflow: hidden` clipping footgun, named explicitly so the next sim
  doesn't repeat the iteration loop.

## Final State

- Validation: 98/A (only deduction is the p5.js `<main>` convention check,
  which doesn't apply to Mermaid layouts).
- Screenshot: `xapi-statement-triple.png` (48K) shows all 8 nodes with
  minimal whitespace.
- Iframe heights consistent at 512px in both `docs/sims/xapi-statement-triple/index.md`
  and `docs/chapters/01-foundations-and-standards/index.md`.
- Embed-code snippet in the docs matches the actual deployed height.

## Pending / Not Done

- `test-iframe-heights.py` Playwright check was not run this session (the
  height-fitting was verified visually via `bk-capture-screenshot` instead).
- Other chapter-1 diagrams (`learning-standards-timeline`,
  `learning-standards-ecosystem`) have iframes inserted but their underlying
  sims have not yet been generated — they are the next candidates for the
  microsim-generator skill.
