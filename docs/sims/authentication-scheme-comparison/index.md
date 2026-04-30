---
title: Authentication Scheme Comparison
description: Authentication Scheme Comparison
status: scaffold
library: p5.js
bloom_level: TBD
---

# Authentication Scheme Comparison

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
**sim-id:** authentication-scheme-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare HTTP Basic, OAuth 1.0a, and token-based authentication across security posture, browser-safety, implementation cost, and revocation support, and pick the appropriate scheme for a deployment scenario.

**Layout:** Three side-by-side columns, one per scheme; a side panel on the right showing the selected scheme's detail.

**Each column shows:**

- Scheme name in a header bar (Basic / OAuth 1.0a / Token-based)
- A security badge (Yellow: Basic, Green-with-caveat: OAuth, Green: Token)
- A 4-axis bar chart: browser-safe, implementation effort, revocation, spec-mandated
- A one-line summary

**Side panel shows:** When-to-use guidance, the canonical request example, common pitfalls, and a one-line note on how the scheme is typically configured in each of the four major LRS platforms.

**Interaction:**

- Hover or click a column to update the side panel
- Toggle "Show common pitfall" — overlays the column with a callout about the most frequent implementation mistake for that scheme

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the column rendering, bar charts, and selection state; HTML overlay for the side panel.
```

## Related Resources

- [Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md)
