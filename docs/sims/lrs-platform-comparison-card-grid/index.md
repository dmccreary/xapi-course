---
title: LRS Platform Comparison Card Grid
description: LRS Platform Comparison Card Grid
status: scaffold
library: p5.js
bloom_level: TBD
---

# LRS Platform Comparison Card Grid

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
[Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md).

```text
Type: interactive-infographic
**sim-id:** lrs-platform-comparison-card-grid<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare the four major LRS platforms across multiple dimensions and select the appropriate platform for a given deployment scenario.

**Layout:** A 2×2 grid of cards on the left (2/3) representing TRAX, Learning Locker, Ralph, Watershed; a side panel on the right (1/3) showing the selected card's detail.

**Each card shows:**

- Platform name in a header bar
- Hosting-model badge (Self-hosted / Hosted SaaS)
- A 5-axis radar chart with axes: ingestion ceiling, query speed, operational complexity, multi-tenant maturity, dashboard depth
- A one-line summary

**Side panel shows:** When-to-use guidance, when-not-to-use cautions, an example deployment scenario, and the canonical install or signup link.

**Interaction:**

- Hover or click a card to update the side panel
- Three preset scenario buttons across the top — "Single school," "State-wide assessment platform," "Corporate L&D" — that highlight the recommended platform and update the side panel with deployment-specific reasoning

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the cards, the radar charts, and selection state; HTML overlay for the side panel and preset buttons.
```

## Related Resources

- [Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md)
