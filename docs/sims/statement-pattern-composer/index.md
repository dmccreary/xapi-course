---
title: Statement Pattern Composer
description: Statement Pattern Composer
status: scaffold
library: p5.js
bloom_level: TBD
---

# Statement Pattern Composer

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
[Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md).

```text
Type: micro-sim
**sim-id:** statement-pattern-composer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Creating):** Compose a complete xAPI statement by selecting a pattern, filling in pattern-specific slots, and observing the rendered statement to learn how patterns enforce consistency across emit sites.

**Layout:** 2/3 (left) form + 1/3 (right) live JSON preview, responsive, re-flowing on resize.

**Controls:**

- Dropdown: pattern type (Page-Read, Quiz-Submission, MicroSim-Interaction, Adaptive-Branching, Voiding)
- Dynamic form fields that change based on the selected pattern (e.g., Quiz-Submission shows score sliders, success toggle, duration; Page-Read shows only chapter selector)
- Static fields visible for all patterns: actor (text), parent activity (dropdown of fake textbook chapters)

**Visual elements:**

- Live JSON preview of the resulting statement, syntax-highlighted
- A "Pattern Slot Map" that highlights which fields the pattern enforces, which are optional, and which are forbidden — color-coded green / yellow / red
- Validation badge ("Pattern Valid" / "Missing Required Slot") that updates live

**Interaction:** Selecting a different pattern re-renders the form and the slot map. Filling in slots re-renders the JSON. Invalid combinations are flagged but not blocked — this is a learning tool, not a validator.

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the canvas drawing of the slot map; HTML form controls overlaid for accessible inputs. JSON preview rendered into a styled `<pre>` element.
```

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)
