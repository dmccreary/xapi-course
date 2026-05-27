---
title: Three-Context Comparison
description: "Three-Context Comparison"
status: approved
library: p5.js
bloom_level: "Evaluate"
---

# Three-Context Comparison
<iframe src="main.html" width="100%" height="622" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Compare K-12, higher education, and corporate L&D xAPI deployment
contexts across regulatory burden, deployment timeline, and analytics
permissibility.

- **Bloom Level:** Evaluate
- **Bloom Verb:** Compare
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 14: Privacy, Compliance, and Organizational Context](../../chapters/14-privacy-and-compliance/index.md).

```text
Type: interactive-infographic
**sim-id:** three-context-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare K-12, higher education, and corporate L&D xAPI deployment contexts across regulatory burden, deployment timeline, and analytics permissibility.

**Layout:** Three vertical columns, one per context; a side panel below showing the selected context's full profile.

**Each column shows:**

- Context name in a header bar (K-12, Higher Ed, Corporate L&D)
- A 4-axis radar mini-chart: regulatory burden, deployment timeline, analytics permissibility, vendor flexibility
- Top three regulatory frameworks that apply (FERPA, COPPA, state laws / FERPA, IRB / GDPR, country labor law)
- A one-line summary

**Side panel shows:**

- Full context description
- Typical procurement path
- Common analytics use cases
- Common pitfalls

**Interaction:**

- Click a column to update the side panel
- Toggle "Add EU enrollees" — overlays GDPR's additional constraints on each context

**Default canvas:** 1100×600px, responsive.

Implementation: p5.js for the columns, radar charts, and selection state; HTML overlay for the side panel.
```

## Related Resources

- [Chapter 14: Privacy, Compliance, and Organizational Context](../../chapters/14-privacy-and-compliance/index.md)
