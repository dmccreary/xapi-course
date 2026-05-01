# Final MicroSim Generation — Chapters 9–14

Built and shipped 18 MicroSims across Chapters 9–14 in 19 commits (one
per sim plus a final mkdocs nav update). Each sim follows the project
conventions:

- Mermaid sims use the project's compact flowchart config
  (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`) with click handlers
  on every node and an info-panel that opens with code snippets, edge
  cases, or chapter references.
- p5.js sims use the standard `<main>` parent pattern with
  `updateCanvasSize()` and a `// CANVAS_HEIGHT:` comment for the
  iframe-height tooling.
- HTML/JS sims (bandwidth calculator, PII surface) use plain interactive
  forms where p5 would have been overkill.

## By Chapter

### Chapter 9 — Bandwidth, Offline Queues, and Service Workers

| sim-id | Library | Bloom | Description |
|---|---|---|---|
| `bandwidth-budget-calculator-microsim` | HTML/JS | Apply | 6 sliders + 4 chapter presets, headroom badge vs three reference link speeds |
| `batching-wire-cost-comparison` | p5.js | Analyze | Side-by-side timelines (individual vs batched POSTs) with overhead/payload bands |
| `service-worker-offline-queue-flow` | Mermaid | Analyze | Statement path through online check, IndexedDB queue, online event, batched flush |

### Chapter 10 — Monitoring and Observability

| sim-id | Library | Bloom | Description |
|---|---|---|---|
| `devtools-driven-xapi-debugging-flow` | Mermaid | Apply | Decision tree for localizing xAPI bugs via DevTools (Network, body, status) |
| `engagement-heatmap-microsim` | p5.js | Analyze | 8-section yellow→red heatmap, cohort/window/verb sliders, click row for verb breakdown |
| `real-time-dashboard-stack` | Mermaid | Understand | LRS → aggregator → operator (Grafana) / educator (Observable) → consumer pipeline |

### Chapter 11 — Synthetic Data and AI Testing

| sim-id | Library | Bloom | Description |
|---|---|---|---|
| `learner-archetype-profiles` | p5.js | Understand | Five archetype cards (Fast / Struggling / Disengaged / Re-learner / Mastery-seeker) with mini bars + verb signature |
| `load-testing-pipeline` | Mermaid | Analyze | Cohort spec → Claude generation → conformance → load runner → LRS → metrics → report |
| `statistical-representativeness-comparison` | p5.js | Evaluate | Paired bar chart + histogram (real vs synthetic) with green tolerance band, 4 presets |

### Chapter 12 — Conformance and Comparison

| sim-id | Library | Bloom | Description |
|---|---|---|---|
| `cmi5-session-lifecycle` | Mermaid | Understand | LMS launch → auth → launched → initialized → learning verbs → terminated/abandoned |
| `conformance-validation-pipeline` | Mermaid | Analyze | Four conformance layers (local validator, LRS validator, ADL suite, smoke test) gated by CI |
| `standards-comparison-card-grid` | p5.js | Evaluate | Radar comparison of xAPI / IMS Caliper / SCORM 2004 / cmi5 / proprietary across 6 dimensions |

### Chapter 13 — Pipeline and Production

| sim-id | Library | Bloom | Description |
|---|---|---|---|
| `full-pipeline-architecture` | Mermaid | Analyze | Four-layer pipeline (Browser, LRS, Analytics, Dashboards) as labeled subgraphs |
| `production-readiness-checklist` | p5.js | Evaluate | Four-column checklist (Vocabulary / Pipeline / Observability / Security) with status bar + alpha/beta/GA presets |
| `vocabulary-profile-architecture` | Mermaid | Understand | JSON-LD profile → verbs / activity types / extensions → statement patterns; profile server feed |

### Chapter 14 — Privacy and Compliance

| sim-id | Library | Bloom | Description |
|---|---|---|---|
| `instructional-design-feedback-loop` | Mermaid | Create | Cyclic loop: usage → emit → analytics → review → prioritize → update → next cohort |
| `pii-surface-in-an-xapi-statement` | HTML/JS | Analyze | Worked statement with red (actor) and yellow (extensions) shaded regions; default / clean / worst-case toggles |
| `three-context-comparison` | p5.js | Evaluate | K-12 / Higher Ed / Corporate L&D radar columns with optional GDPR overlay |

## Workflow Notes

For each sim:

1. Read the spec from the chapter's `index.md`.
2. Replace the scaffolded placeholder `main.html` with the working
   markup (loads the .js file, sets up info panels, embeds Mermaid /
   p5.js as needed).
3. Write `<sim-id>.js` with the `// CANVAS_HEIGHT:` comment in the
   first 10 lines.
4. Update `index.md` frontmatter (status: implemented, library, Bloom
   level) and replace the scaffold warning with a real iframe at the
   correct height.
5. Run `add-iframes-to-chapter.py` once per chapter to insert chapter
   iframes (skipped for chapters where this had already happened).
6. Capture a screenshot via `bk-capture-screenshot . 3 <height>` and
   rename it from the script's default `..png` to `<sim-id>.png`.
7. `git commit` (with a per-sim message describing what shipped) +
   `git push`.

Final step after all 18 sims:
`update-mkdocs-nav.py` regenerated the MicroSims navigation section to
include all 48 sims now in `docs/sims/`.

## Footguns Encountered

- **`bk-capture-screenshot` writes `./..png`** when invoked with `.` as
  the directory argument. The script silently produces a hidden-ish
  filename instead of the expected `<sim-name>.png`. Fix: rename
  immediately after capture in the same shell invocation. Structural fix
  would be to default the output filename to the directory's basename.
- **Chained `cd && bk-capture && cd .. && git add`** — the `cd` doesn't
  unwind across a single Bash call, so subsequent `git add` paths are
  resolved against the sim subdirectory, not the project root. Workaround
  used absolute paths or a fresh `cd /Users/dan/Documents/ws/xapi-course`.
