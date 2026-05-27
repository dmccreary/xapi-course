---
title: MicroSim Verb Explorer
description: "An interactive Mermaid diagram of the eight xAPI verbs we recommend for MicroSim interactions, grouped by Session, Engagement, and Mastery."
status: approved
library: Mermaid
bloom_level: Understand
---

# MicroSim Verb Explorer

<iframe src="main.html" width="100%" height="762px" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Choose the right xAPI verb for each kind of MicroSim interaction — Start/Pause
buttons, parameter sliders, clicked Mermaid nodes, hovered Chart.js points,
selected vis-network nodes, vis-timeline events, Plotly zooms, and hot-zone
clicks on interactive infographic overlays — using a tight set of just eight
verbs that still supports mastery assessment.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Recall, Explain, Choose
- **Library:** Mermaid

## How to Use

The diagram on the left groups the eight recommended verbs into three roles.
Click any node to populate the side panel:

- **Cluster nodes** (Session, Engagement, Mastery) show the role's design
  rationale and which verbs belong to it.
- **Verb leaves** (e.g., `interacted`, `answered`) show the full IRI, a
  one-line definition, when to emit it, the MicroSim types that typically
  emit it, and a complete example xAPI statement you can copy.

Hover any node for a one-line tooltip.

## The Three Clusters

| Cluster | Verbs | Purpose |
|---------|-------|---------|
| **Session** | `launched`, `initialized`, `terminated` | Bracket the MicroSim session for duration and lifecycle analytics. |
| **Engagement** | `experienced`, `interacted` | Capture viewing and control changes — the workhorses of MicroSim instrumentation. |
| **Mastery** | `answered`, `completed`, `passed` | Turn an exploratory sim into an assessable learning object. |

## MicroSim Type → Verb Cheat Sheet

A quick guide to which verbs each MicroSim type usually emits:

| MicroSim Type | Typical Verbs |
|---------------|---------------|
| **p5.js simulation** with Start/Pause buttons | `initialized`, `interacted` (Start/Pause/sliders), `terminated`, `completed` if goal-driven |
| **Mermaid** with clickable nodes | `initialized`, `interacted` (node clicks), `experienced` if any node is auto-revealed |
| **Chart.js** with hover tooltips | `initialized`, `interacted` (hover/click), `experienced` (chart rendered) |
| **vis-network** | `initialized`, `interacted` (node/edge selection), `completed` if all nodes explored |
| **vis-timeline** | `initialized`, `interacted` (event clicks, range pans), `experienced` (range visible) |
| **Plotly.js** | `initialized`, `interacted` (zoom, select, legend toggle) |
| **Interactive infographic overlay** with hot zones | `initialized`, `experienced` (hot zone in viewport), `interacted` (hot zone clicked), `answered` if "name this region", `completed` if all regions visited |

## Why Only Eight Verbs?

Verb sprawl is a real problem. The ADL Verb Registry has dozens of verbs, and
custom verbs proliferate fast. Most analytics consumers only care about a
small core, and adding more verbs makes pattern detection harder, not easier.

This curated set deliberately leaves out:

- **`attempted`** — overkill for sims that aren't quizzes; `interacted` covers
  the "the learner started doing something" signal for exploratory sims.
- **`failed`** / **`scored`** — folded into `passed` with `result.success: false`
  for sim-as-assessment cases. `scored` is for per-item grading inside a quiz,
  which most MicroSims don't do.
- **`progressed`** — most MicroSims are short enough that `completed` suffices.
  Bring `progressed` back only for multi-stage sims with meaningful milestones.
- **`abandoned`** — emitted server-side when an `initialized` session times out
  with no `terminated`. Not something a MicroSim author writes.

## Recommended Pattern: Start / Pause Simulation Buttons

Many p5.js MicroSims have **"Start Simulation"** and **"Pause Simulation"**
buttons. Both should emit `interacted`, not `launched` or `initialized`:

```javascript
// On Start button click
xapi.send({
  verb: { id: "http://adlnet.gov/expapi/verbs/interacted",
          display: { "en-US": "interacted" } },
  object: {
    id: "https://textbook.example.org/sims/projectile-motion#start-button",
    definition: { type: "http://adlnet.gov/expapi/activities/interaction" }
  },
  result: { extensions: { "https://example.org/x/control": "start" } }
});
```

The `extensions.control` value (`"start"`, `"pause"`, `"reset"`) lets analytics
distinguish button presses without inventing new verbs.

## Lesson Plan

1. Read the three cluster overviews in order to understand the design.
2. Open the seven MicroSim types listed in the cheat sheet above and identify
   their controls.
3. For each control type (button, slider, hovered chart point, hot zone),
   predict aloud which verb you would emit.
4. Click the verb leaves to check your predictions and inspect the example
   statements.
5. Sketch the verb sequence for one of your own MicroSims, from `initialized`
   through `terminated`. Which mastery verb (if any) does it justify?

## References

- [Canonical Verb Explorer](../canonical-verb-explorer/index.md) — the full
  twelve canonical ADL verbs this set was distilled from.
- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
- [ADL Verb Registry](http://adlnet.gov/expapi/verbs/)
