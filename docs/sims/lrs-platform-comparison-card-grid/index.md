---
title: LRS Platform Comparison Card Grid
description: Compare TRAX, Learning Locker, Ralph, and Watershed across five dimensions and pick the right LRS for a given deployment scenario.
status: built
library: p5.js
bloom_level: "Evaluating"
---

# LRS Platform Comparison Card Grid
<iframe src="main.html" width="100%" height="622" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Compare the four major LRS platforms across multiple dimensions and select the
appropriate platform for a given deployment scenario.

- **Bloom Level:** Evaluating
- **Bloom Verb:** Compare / Select
- **Library:** p5.js

## How to Use

- **Hover or click a card** to update the side panel with that platform's
  when-to-use guidance, when-not-to-use cautions, an example deployment, and
  the canonical link.
- **Click a scenario button** ("Single school," "State-wide assessment platform,"
  "Corporate L&D") to highlight the recommended platform with an orange
  ribbon and surface deployment-specific reasoning in the side panel.
- **Click "Clear"** to remove the scenario highlight and explore freely.

Each card shows a 5-axis radar chart so you can see at a glance where each
platform is strong and where it is weak. The axes are:

1. **Ingestion ceiling** - How many statements/sec the platform can absorb.
2. **Query speed** - How quickly analytical queries return.
3. **Operational simplicity** - Lower ops burden = higher score (we invert
   "operational complexity" so that bigger is always better on the radar).
4. **Multi-tenant maturity** - How well the platform isolates orgs/tenants.
5. **Dashboard depth** - Out-of-the-box visualization and reporting power.

## Specification

The full specification below is extracted from
[Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md).

```text
Type: interactive-infographic
sim-id: lrs-platform-comparison-card-grid
Library: p5.js
Status: Built

Learning objective (Bloom - Evaluating): Compare the four major LRS platforms
across multiple dimensions and select the appropriate platform for a given
deployment scenario.

Layout: A 2x2 grid of cards on the left (2/3) representing TRAX, Learning
Locker, Ralph, Watershed; a side panel on the right (1/3) showing the selected
card's detail.

Each card shows: platform name in a header bar, hosting-model badge
(Self-hosted / Hosted SaaS), a 5-axis radar chart (ingestion ceiling, query
speed, operational simplicity, multi-tenant maturity, dashboard depth), and a
one-line summary.

Side panel shows: when-to-use guidance, when-not-to-use cautions, an example
deployment scenario, and the canonical install or signup link.

Interaction: Hover or click a card to update the side panel. Three preset
scenario buttons across the bottom - "Single school," "State-wide assessment
platform," "Corporate L&D" - highlight the recommended platform and update the
side panel with deployment-specific reasoning.
```

## Related Resources

- [Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md)
- [TRAX LRS](https://github.com/trax-project/trax-lrs)
- [Learning Locker](https://www.learningpool.com/solutions/learning-record-store-learning-locker)
- [Ralph LRS](https://openfun.github.io/ralph/)
- [Watershed LRS](https://www.watershedlrs.com/)
