---
title: Instructional Design Feedback Loop
description: Instructional Design Feedback Loop
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Instructional Design Feedback Loop

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
[Chapter 14: Privacy, Compliance, and Organizational Context](../../chapters/14-privacy-and-compliance/index.md).

```text
Type: workflow-diagram
**sim-id:** instructional-design-feedback-loop<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Creating):** Trace the full feedback loop from learner interaction through analytics to instructional design changes and back to subsequent cohorts.

**Diagram type:** Mermaid flowchart with a circular structure (LR direction with a return edge). Click handlers on every node.

**Cycle:**

1. `Learners use textbook (cohort N)`
2. `xAPI statements emitted to LRS`
3. `Analytics aggregations (completion, struggle, engagement)`
4. `Dashboards reviewed by instructional designers`
5. `Findings prioritized for content changes`
6. `Content updated in next release`
7. Loop back to step 1: `Learners use textbook (cohort N+1)`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the activity, the role responsible, and the typical cadence (per-session, per-month, per-semester).

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives and a return edge to indicate the cyclic nature.
```

## Related Resources

- [Chapter 14: Privacy, Compliance, and Organizational Context](../../chapters/14-privacy-and-compliance/index.md)
