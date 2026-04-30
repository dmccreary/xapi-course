---
title: Activity Naming and Occurrence Fields
description: Activity Naming and Occurrence Fields
status: scaffold
library: p5.js
bloom_level: TBD
---

# Activity Naming and Occurrence Fields

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
**sim-id:** activity-naming-and-occurrence-fields<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Distinguish the four fields that name an activity occurrence (`object.id`, `object.definition.type`, `context.registration`, `object.definition.revision`, `context.platform`), and identify which question each one answers.

**Layout:** A single annotated JSON statement on the left (2/3) with five colored highlight boxes drawn around the relevant fields; a side panel on the right (1/3) explaining the highlighted field.

**Visual elements:**

- A worked statement rendered as syntax-highlighted JSON
- Five colored highlights:
    - Blue around `object.id` — "Which activity?"
    - Green around `object.definition.type` — "What kind of activity?"
    - Orange around `context.registration` — "Which attempt?"
    - Purple around `object.definition.revision` — "Which version of the activity?"
    - Red around `context.platform` — "Which host environment?"
- Side panel updates on hover/click of any highlight, showing: the field's plain-English question, when to set it, and a one-line example value

**Interaction:**

- Hover or click a highlight to update the side panel
- Toggle "Compare two attempts" — swaps the JSON for two side-by-side statements and emphasizes which fields differ between them (registration changes; activity IRI stays the same)

**Default canvas:** 1000×500px, responsive.

Implementation: p5.js for the highlight overlay and hover detection; HTML overlay for the JSON syntax highlighting and the side panel.
```

## Related Resources

- [Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md)
