---
title: Result Field Composition Explorer
description: Result Field Composition Explorer
status: scaffold
library: p5.js
bloom_level: "TBD"
---

# Result Field Composition Explorer
<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md).

```text
Type: micro-sim
**sim-id:** result-field-composition-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Given a learner scenario (e.g., "passed the quiz with 85%"), the student selects appropriate values for each `result` sub-field and sees the rendered JSON update in real time, reinforcing the orthogonality of `completion` and `success`.

**Layout:** 2/3 + 1/3 panel split with responsive design that re-flows on window resize. Left panel: input controls. Right panel: live-rendered JSON `result` object with syntax highlighting.

**Controls (left panel):**

- Slider: Raw score (0 – 10, default 7)
- Slider: Min score (-5 – 0, default 0)
- Slider: Max score (5 – 20, default 10)
- Computed display: Scaled score (auto-updates from raw/min/max)
- Toggle: success (true / false / unset)
- Toggle: completion (true / false / unset)
- Slider: duration in seconds (0 – 600, default 47)
- Text input: response (default `x = -3, x = 5`)
- Preset buttons: "Passed Cleanly", "Failed but Finished", "Bailed Early", "Mastery Exit"

**Visual elements:**

- Live JSON output with monospace font, color-coded keys/values
- A 2×2 grid showing the four completion×success states, with the current state highlighted
- Duration shown both as ISO 8601 string and human-readable form

**Interaction:** Every control change recomputes the JSON immediately and redraws the 2×2 grid. Preset buttons populate all controls at once for quick exploration.

**Default canvas:** 900×500px with media queries for narrower viewports.

Implementation: p5.js with a JSON renderer; no external dependencies beyond the p5.js CDN.
```

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)
