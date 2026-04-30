---
title: The Four Inverse Functional Identifiers
description: The Four Inverse Functional Identifiers
status: scaffold
library: p5.js
bloom_level: TBD
---

# The Four Inverse Functional Identifiers

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
[Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md).

```text
Type: interactive-infographic
**sim-id:** four-inverse-functional-identifiers<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare the four IFI forms across identification strength, privacy posture, and integration cost, and select the appropriate one for a given deployment scenario.

**Layout:** A 2×2 grid of cards on the left (2/3), each card representing one IFI form; a side panel on the right (1/3) showing the selected card's full detail.

**Each card shows:**

- IFI name in a header bar (`mbox`, `mbox_sha1sum`, `openid`, `account`)
- A privacy badge (Red = direct identifying, Yellow = reversible, Green = configurable)
- A one-sentence summary
- A short example agent JSON block

**Interaction:**

- Hover a card to highlight; click to select. Side panel shows: full description, when-to-use guidance, when-not-to-use cautions, and a worked example
- Three preset scenario buttons across the top — "K-12 elementary," "University LMS," "Corporate L&D" — that recommend an IFI by highlighting the appropriate card and updating the side panel with deployment-specific reasoning

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the card rendering and selection state; HTML overlay for the side panel and preset buttons.
```

## Related Resources

- [Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md)
