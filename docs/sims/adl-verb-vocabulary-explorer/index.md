---
title: ADL Verb Vocabulary Explorer
description: ADL Verb Vocabulary Explorer
status: approved
library: p5.js
bloom_level: "Understand (L2). Bloom verb: classify, exemplify."
---

# ADL Verb Vocabulary Explorer
<iframe src="main.html" width="100%" height="542"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

TBD

- **Bloom Level:** Understand (L2). Bloom verb: classify, exemplify.
- **Bloom Verb:** TBD
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md).

```text
Type: infographic
**sim-id:** adl-verb-vocabulary-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let the reader explore the canonical ADL xAPI verbs by category, understand which verb is appropriate for which kind of learning event, and copy the verb's full IRI and `display` block in one click. Reinforces that verbs are IRIs, not strings.

Bloom level: Understand (L2). Bloom verb: classify, exemplify.

Canvas layout (responsive, default 760px wide × 480px tall):
- Left panel (60% width): a grid of verb chips arranged in five colored category bands — Engagement (blue), Assessment (gold), Progression (green), Social (purple), Lifecycle (gray).
- Right panel (40% width): an infobox that updates when the reader clicks a chip. Shows: full IRI, English display label, one-paragraph definition, two example use-cases drawn from intelligent-textbook scenarios, and a "Copy verb JSON" button.

Required interactivity:
- Every verb chip is clickable. Clicking populates the right-side infobox.
- A category-filter dropdown at the top of the left panel narrows the visible chips.
- A free-text filter input narrows chips by substring match on the verb name.
- "Copy verb JSON" button copies a `{ id, display }` block to the clipboard.
- Hovering a chip shows a one-line tooltip with the verb's English label.
- Clicking the "Copy verb JSON" button MUST emit an xAPI `interacted` statement to the chapter's LRS.

Sample verb dataset (16 verbs, drawn from the ADL registry):
- Engagement: `experienced`, `interacted`, `progressed`, `launched`
- Assessment: `attempted`, `answered`, `passed`, `failed`, `scored`
- Progression: `completed`, `mastered`, `voided`
- Social: `shared`, `commented`
- Lifecycle: `initialized`, `terminated`

Default state: category dropdown set to "All", no chip selected, infobox shows a one-paragraph "Click any verb to see its definition" placeholder.

Visual style: rounded chips with slight drop shadow, category color band running down the left edge of each chip, monospace font for IRIs in the infobox, clear visual distinction between chips and infobox.

Implementation: p5.js with `createButton`, `createSelect`, and `createInput` builtin controls. Chip layout uses a flexbox-like algorithm in `draw()`. Verb dataset loaded from a local JSON file. Responsive — calls `updateCanvasSize()` first thing in `setup()`.
```

## Related Resources

- [Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md)
