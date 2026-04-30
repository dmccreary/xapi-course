---
title: Component Instrumentation Pattern Browser
description: Component Instrumentation Pattern Browser
status: scaffold
library: p5.js
bloom_level: TBD
---

# Component Instrumentation Pattern Browser

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md).

```text
Type: micro-sim
**sim-id:** component-instrumentation-pattern-browser<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Browse the canonical instrumentation pattern for each component type (quiz, simulation, adaptive branching) and observe the resulting xAPI statement sequence in a side panel.

**Layout:** 2/3 (left) tabbed component preview + 1/3 (right) live statement sequence.

**Tabs (left panel):**

- Quiz tab: a 3-question quiz with submit button. Submitting fires the canonical sequence (`attempted`, `scored`, `passed`/`failed`, `completed`).
- Simulation tab: a slider-driven simulation. Adjusting the slider fires debounced `interacted` statements; a "Run" button fires `experienced`.
- Adaptive Branching tab: a branch decision UI showing two paths. Clicking a path fires a `progressed` statement with a branch-decision extension.

**Right panel:**

- Sequential list of statements emitted, each shown with verb, activity, and a one-line summary
- Click an entry to expand the full JSON statement
- Each entry is annotated with the registration UUID so learners can see attempts grouped

**Default canvas:** 1000×600px, responsive.

Implementation: p5.js for the simulation tab; HTML for the quiz and branching tabs and the statement list.
```

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
