---
title: Authentication Scheme Comparison
description: "Compare HTTP Basic, OAuth 1.0a, and token-based authentication for xAPI across security, browser-safety, implementation cost, and revocation."
status: approved
library: p5.js
bloom_level: "Evaluate (L5)"
hide:
  toc
---

# Authentication Scheme Comparison
<iframe src="main.html" width="100%" height="602" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Compare HTTP Basic, OAuth 1.0a, and token-based authentication across
security posture, browser-safety, implementation cost, and revocation
support, and pick the appropriate scheme for a deployment scenario.

- **Bloom Level:** Evaluate (L5)
- **Bloom Verb:** Compare
- **Library:** p5.js

## How to Use

- **Click any column** (HTTP Basic, OAuth 1.0a, Token-based) to update the
  detail panel on the right with when-to-use guidance, the canonical HTTP
  request, and per-platform configuration notes.
- **Toggle "Show common pitfall"** to overlay the most frequent
  implementation mistake on the currently selected column.
- **Reset selection** restores the default (Token-based, the recommended
  scheme for most modern deployments).

## What Each Bar Means

Each column shows a 4-segment bar across four axes:

- **Browser-safe** — Can credentials be safely used from front-end code?
- **Easy to implement** — How much engineering effort is required?
- **Easy to revoke** — How quickly can a leaked credential be invalidated?
- **Spec mandated** — Is the scheme required by the xAPI 1.0.3 specification?

A 4/4 bar is best on that axis; a 1/4 bar is worst.

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
