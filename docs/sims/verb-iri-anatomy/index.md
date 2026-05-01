---
title: Verb IRI Anatomy
description: Verb IRI Anatomy
status: scaffold
library: p5.js
bloom_level: "TBD"
---

# Verb IRI Anatomy
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
[Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md).

```text
Type: interactive-infographic
**sim-id:** verb-iri-anatomy<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Decompose a verb IRI into its three parts (scheme + namespace + local name), and recognize valid versus invalid verb IRIs at a glance.

**Layout:** A single horizontal IRI rendered as a string, with three colored brackets beneath it labeling each part. To the right, a side panel shows the part the user has hovered or clicked.

**Visual elements:**

- The IRI `http://adlnet.gov/expapi/verbs/passed` rendered in monospace, ~24pt
- Three colored highlight brackets: scheme (blue, `http://`), namespace (green, `adlnet.gov/expapi/verbs/`), local name (orange, `passed`)
- A right-side info panel describing the hovered/clicked part, with a one-line example
- Below the main IRI, a row of three additional IRIs the user can click to swap the active example: an ADL verb, a tincan verb, and a custom verb

**Interaction:**

- Hover over a part: that part highlights, info panel updates
- Click an alternative IRI: replaces the main IRI and updates highlighting
- Toggle "Show invalid examples": replaces the row with malformed IRIs (e.g., `passed`, `myapp:verbs/done`) and shows why each is rejected

**Default canvas:** 950×420px with media queries; falls back to a stacked layout below 700px.

Implementation: p5.js for the canvas drawing and hover detection; HTML overlay for the info panel.
```

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
