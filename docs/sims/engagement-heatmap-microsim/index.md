---
title: Engagement Heatmap MicroSim
description: Engagement Heatmap MicroSim
status: approved
library: p5.js
bloom_level: "Analyze"
---

# Engagement Heatmap MicroSim
<iframe src="main.html" width="100%" height="502" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Read an engagement heatmap to identify under-engaged sections of a chapter,
and adjust input parameters (cohort size, time window, verb filter) to see
how the visualization responds.

- **Bloom Level:** Analyze
- **Bloom Verb:** Read
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 10: Monitoring, Observability, and xAPI Traffic Analysis](../../chapters/10-monitoring-and-observability/index.md).

```text
Type: micro-sim
**sim-id:** engagement-heatmap-microsim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Read an engagement heatmap to identify under-engaged sections of a chapter, and adjust input parameters (cohort size, time window, verb filter) to see how the visualization responds.

**Layout:** 2/3 (left) heatmap canvas + 1/3 (right) controls and reading guide.

**Visual elements (left):**

- A vertically-arranged grid of 8 chapter sections, each rendered as a row
- Each row colored on a gradient (light-yellow to dark-red) based on per-section interaction counts
- Row labels showing section name and interaction count
- A legend bar at the bottom showing the color scale

**Controls (right):**

- Slider: Cohort size (10 – 500 learners)
- Slider: Time window (1 – 30 days)
- Dropdown: Verb filter (`all`, `experienced`, `interacted`, `attempted`)
- A "Synthesize new data" button that re-randomizes the per-section counts using a realistic distribution
- A reading-guide panel below the controls explaining what dark vs. light rows typically mean

**Interaction:**

- Adjusting any control re-computes the heatmap colors and counts
- Clicking a row in the heatmap opens a side-detail showing the exact statements aggregated into that count

**Default canvas:** 1000×600px, responsive.

Implementation: p5.js for the heatmap rendering, color gradients, and synthetic data generation.
```

## Related Resources

- [Chapter 10: Monitoring, Observability, and xAPI Traffic Analysis](../../chapters/10-monitoring-and-observability/index.md)
