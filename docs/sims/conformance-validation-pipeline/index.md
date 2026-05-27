---
title: Conformance Validation Pipeline
description: "Conformance Validation Pipeline"
status: approved
library: Mermaid
bloom_level: "Analyze"
---

# Conformance Validation Pipeline
<iframe src="main.html" width="100%" height="662" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Trace the layers of conformance validation from a single statement up
through the ADL conformance suite, identifying which layer catches which
class of bug.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace
- **Library:** Mermaid

## Specification

The full specification below is extracted from
[Chapter 12: Conformance Testing, Validation, and Competitive Standards Analysis](../../chapters/12-conformance-and-comparison/index.md).

```text
Type: workflow-diagram
**sim-id:** conformance-validation-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the layers of conformance validation from a single statement up through the ADL conformance suite, identifying which layer catches which class of bug.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node.

**Structure:**

1. `Component emits statement`
2. `Local validator (structure + required + data type)` → on failure, surface error before transmit
3. `Statement transmitted to LRS`
4. `LRS validates and persists`
5. Side: `Periodic ADL conformance run against LRS`
6. `End-to-end smoke test (synthetic emit → LRS → query → assert)`
7. `CI pipeline (gates merges on suite pass)`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing what's tested, what's not tested, and example failures.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 12: Conformance Testing, Validation, and Competitive Standards Analysis](../../chapters/12-conformance-and-comparison/index.md)
