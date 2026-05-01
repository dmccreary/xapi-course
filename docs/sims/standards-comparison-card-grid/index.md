---
title: Standards Comparison Card Grid
description: Standards Comparison Card Grid
status: implemented
library: p5.js
bloom_level: "Evaluate"
---

# Standards Comparison Card Grid
<iframe src="main.html" width="100%" height="662" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Compare xAPI against four alternative standards (IMS Caliper, SCORM 2004,
cmi5, proprietary SDKs) across six procurement-relevant dimensions, and
select an appropriate standard for a given deployment.

- **Bloom Level:** Evaluate
- **Bloom Verb:** Compare
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 12: Conformance Testing, Validation, and Competitive Standards Analysis](../../chapters/12-conformance-and-comparison/index.md).

```text
Type: interactive-infographic
**sim-id:** standards-comparison-card-grid<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare xAPI against four alternative standards (IMS Caliper, SCORM 2004, cmi5, proprietary SDKs) across six procurement-relevant dimensions, and select an appropriate standard for a given deployment.

**Layout:** Five cards arranged in a row across the top (one per standard); a side panel below showing the selected standard's full radar chart and detail.

**Each card shows:**

- Standard name
- Year of relevant version
- A short tagline
- A 6-axis radar mini-chart on axes: instrumentation granularity, vendor support breadth, vendor lock-in risk (inverted: lower is better), implementation cost (inverted), LMS integration depth, ecosystem flexibility

**Side panel:**

- A larger version of the radar chart for the selected standard
- The dimension-by-dimension scoring rationale
- A "Recommended scenario" line: which deployment context favors this standard

**Interaction:**

- Click a card to update the side panel
- Toggle "Compare two": brings up two radar charts overlaid for direct comparison

**Default canvas:** 1100×600px, responsive.

Implementation: p5.js for the radar charts, card layout, and overlay comparison; HTML overlay for the rationale text.
```

## Related Resources

- [Chapter 12: Conformance Testing, Validation, and Competitive Standards Analysis](../../chapters/12-conformance-and-comparison/index.md)
