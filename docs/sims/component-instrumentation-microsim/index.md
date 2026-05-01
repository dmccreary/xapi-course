---
title: Component Instrumentation MicroSim
description: Manipulate a fake interactive textbook component (slider, button, quiz) and watch xAPI statements stream out in real time, building intuition for which UI events map to which verbs.
status: implemented
library: p5.js
bloom_level: Apply
---

# Component Instrumentation MicroSim

## Learning Objective

Manipulate a fake interactive textbook component (slider, button, quiz item)
and observe the resulting xAPI statements appear in a side panel — building
intuition for which verbs map to which UI events, and for the difference
between events worth instrumenting and events that should stay silent.

- **Bloom Level:** Apply
- **Bloom Verb:** Manipulate
- **Library:** p5.js + HTML overlay

## Preview

<iframe src="main.html" width="100%" height="622" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## How to Use This MicroSim

The left panel is a **mock textbook component** — the kind of thing a real
intelligent textbook might embed: a parabola plot driven by a slider, a
"Run Simulation" button, and a small quiz. The right panel is a **live xAPI
statement log** showing the most recent ten statements that the component
emits as you interact with it.

Try these in order and watch what shows up in the log:

1. **Drag the slider.** Notice that the log fills with `interacted`
   statements — but only after you stop dragging. The slider is debounced
   at 250 ms so you don't flood your LRS with one statement per pixel.
2. **Click *Run Simulation*.** A single `experienced` statement appears.
3. **Pick a quiz answer (but don't submit yet).** Nothing happens in the
   log. Selecting a radio button is *component-internal state* — it isn't
   worth a statement on its own.
4. **Click *Submit Quiz*.** Three statements emit in a burst:
   `attempted` → `scored` → either `passed` or `failed` depending on
   whether you chose the correct answer.
5. **Click any log entry** to expand the full xAPI JSON for that
   statement. This is the actual shape your LRS would receive.

## Why These Verb Choices?

| UI event | Verb emitted | Reason |
|----------|--------------|--------|
| Slider drag (debounced) | `interacted` | Generic UI manipulation; debounced so we capture intent, not jitter |
| "Run Simulation" click | `experienced` | A discrete consumption event — the learner saw the simulation play |
| Radio selection | *(none)* | Internal state — only the *submission* commits the choice |
| "Submit Quiz" click | `attempted` + `scored` + `passed`/`failed` | The standard ADL three-step pattern for a graded interaction |

The most important pattern here is the silence: **not every UI change
deserves a statement.** Component-internal state changes — selecting a
radio, opening an accordion, hovering a tooltip — are usually noise.
Emit when the learner *commits* to a meaningful action, not when they
twiddle a control.

## Specification

The full specification below is extracted from
[Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md).

```text
Type: micro-sim
**sim-id:** component-instrumentation-microsim
**Library:** p5.js
**Status:** Specified

**Learning objective (Bloom — Applying):** Manipulate a fake interactive
textbook component (slider, button, quiz item) and observe the resulting
xAPI statements appear in a side panel — building intuition for which
verbs map to which UI events.

**Layout:** 2/3 (left) interactive textbook component + 1/3 (right) live
statement log, responsive.

**Visual elements (left panel):**

- A slider labeled "Parabola coefficient `a`" that updates a small
  parabola plot
- A button labeled "Run Simulation"
- A quiz radio-group with three options
- A button labeled "Submit Quiz"

**Visual elements (right panel):**

- A scrolling log of the most recent ten statements emitted by the
  component
- Each entry shows verb (highlighted), object IRI (truncated), and
  timestamp
- Click an entry to expand the full statement JSON

**Interaction:**

- Sliding the parabola control emits debounced `interacted` statements
  (250ms)
- Clicking "Run Simulation" emits an `experienced` statement
- Selecting a radio option emits no statement (component-internal state)
- Clicking "Submit Quiz" emits `attempted`, then `scored`, then either
  `passed` or `failed` based on the selected radio

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the parabola plot and the slider/button visuals;
HTML radio inputs and statement log overlay.
```

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
- [ADL Verb Registry](https://registry.tincanapi.com/)
