---
title: Component Instrumentation MicroSim
description: Component Instrumentation MicroSim
status: scaffold
library: p5.js
bloom_level: TBD
---

# Component Instrumentation MicroSim

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
[Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md).

```text
Type: micro-sim
**sim-id:** component-instrumentation-microsim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Manipulate a fake interactive textbook component (slider, button, quiz item) and observe the resulting xAPI statements appear in a side panel — building intuition for which verbs map to which UI events.

**Layout:** 2/3 (left) interactive textbook component + 1/3 (right) live statement log, responsive.

**Visual elements (left panel):**

- A slider labeled "Parabola coefficient `a`" that updates a small parabola plot
- A button labeled "Run Simulation"
- A quiz radio-group with three options
- A button labeled "Submit Quiz"

**Visual elements (right panel):**

- A scrolling log of the most recent ten statements emitted by the component
- Each entry shows verb (highlighted), object IRI (truncated), and timestamp
- Click an entry to expand the full statement JSON

**Interaction:**

- Sliding the parabola control emits debounced `interacted` statements (250ms)
- Clicking "Run Simulation" emits an `experienced` statement
- Selecting a radio option emits no statement (component-internal state)
- Clicking "Submit Quiz" emits `attempted`, then `scored`, then either `passed` or `failed` based on the selected radio

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the parabola plot and the slider/button visuals; HTML radio inputs and statement log overlay.
```

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
