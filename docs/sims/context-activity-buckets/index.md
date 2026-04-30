---
title: Context Activity Buckets
description: Context Activity Buckets
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Context Activity Buckets

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md).

```text
Type: clickable-mermaid
**sim-id:** context-activity-buckets<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify the role of each context activity bucket and explain how a single statement's main object can be related to multiple activities through different bucket relationships.

**Diagram type:** Mermaid flowchart, LR direction, with click handlers on every node opening an infobox containing the term's definition.

**Structure:**

- Center node: "Statement Object: Quadratics Quiz"
- Four labeled fan-outs to:
    - Parent: "Algebra 1, Unit 5" (edge label `directly contains`)
    - Grouping: "Formative Assessments — Q3 2026" (edge label `is a member of`)
    - Category: "ACME Math Profile v2" (edge label `conforms to`)
    - Other: "Pre-class warm-up flow" (edge label `associated with`)

**Mermaid config (project standard):**

```js
flowchart: {
    useMaxWidth: true, htmlLabels: true, curve: 'basis',
    nodeSpacing: 12, rankSpacing: 60, padding: 4
}
```

**Click behavior:** Each node opens a side-panel infobox showing the term, its definition (drawn from the project glossary when available), and a one-line example. The center node's infobox explains the statement's main object.

**Default canvas:** 2/3 width for the diagram, 1/3 for the side panel. Responsive — re-flows to stacked layout below 700px.

Implementation: Mermaid with `securityLevel: 'loose'` to enable click handlers, plus a small JavaScript layer that renders the side panel from a `data.json` keyed by node id.
```

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)
