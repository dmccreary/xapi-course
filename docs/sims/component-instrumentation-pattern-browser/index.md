---
title: Component Instrumentation Pattern Browser
description: "Browse the canonical xAPI instrumentation pattern for each component type (quiz, simulation, adaptive branching) and watch the resulting xAPI statement sequence appear live in a side panel."
status: approved
library: p5.js
bloom_level: "Apply"
bloom_verb: apply
---

# Component Instrumentation Pattern Browser
<iframe src="main.html" width="100%" height="722"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Browse the canonical instrumentation pattern for each component type (quiz,
simulation, adaptive branching) and observe the resulting xAPI statement
sequence in a side panel. Each interaction fires the verb sequence a
production-grade implementation would emit, with statements grouped by a
shared `registration` UUID so attempts stay together.

- **Bloom Level:** Apply
- **Bloom Verb:** apply
- **Library:** p5.js (with HTML/CSS for tabbed UI and statement list)

## How to Use

1. Pick a tab on the left: **Quiz**, **Simulation**, or **Adaptive Branching**.
2. Interact with the component:
    - Submit the quiz to see the canonical four-statement sequence.
    - Drag the simulation slider to watch debounced `interacted` statements
      fire, then click **Run simulation** for an `experienced` statement.
    - Pick a branching path to fire a `progressed` statement with a
      branch-decision context extension.
3. Watch the right panel fill with statements. Click any entry to expand
   the full JSON.
4. The shared `registration` UUID at the top groups every statement of the
   current attempt. Click **Reset attempt** to mint a new registration and
   start over.

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
