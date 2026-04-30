---
title: PII Surface in an xAPI Statement
description: PII Surface in an xAPI Statement
status: scaffold
library: p5.js
bloom_level: TBD
---

# PII Surface in an xAPI Statement

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
[Chapter 14: Privacy, Compliance, and Organizational Context](../../chapters/14-privacy-and-compliance/index.md).

```text
Type: interactive-infographic
**sim-id:** pii-surface-in-an-xapi-statement<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Identify the regions of an xAPI statement most likely to contain personally identifiable information, and apply per-region mitigations.

**Layout:** A worked statement rendered as syntax-highlighted JSON on the left (2/3) with three colored shaded regions; a side panel on the right (1/3) describing the selected region's PII risks and mitigations.

**Visual elements:**

- A worked statement JSON
- Three shaded regions with colored borders:
    - Red shade around `actor` (highest direct PII risk)
    - Yellow shade around `result.extensions` (medium, depends on content)
    - Yellow shade around `context.extensions` (medium, depends on content)
- A toggle "Show clean version" that swaps the JSON for one with `account` IFI and minimized extensions
- A toggle "Show worst-case version" that swaps for one with name, mbox, full keystroke trace, and over-eager context extensions

**Interaction:**

- Hover or click a shaded region to update the side panel
- Toggles re-render the JSON; the side panel updates with comparison commentary
- Side panel shows: PII risks, recommended mitigation, and the relevant regulatory framework that applies

**Default canvas:** 1100×600px, responsive.

Implementation: p5.js for the highlight overlays and JSON rendering; HTML overlay for the side panel and toggles.
```

## Related Resources

- [Chapter 14: Privacy, Compliance, and Organizational Context](../../chapters/14-privacy-and-compliance/index.md)
