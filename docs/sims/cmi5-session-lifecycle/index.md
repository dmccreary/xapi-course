---
title: CMI5 Session Lifecycle
description: CMI5 Session Lifecycle
status: scaffold
library: Mermaid
bloom_level: TBD
---

# CMI5 Session Lifecycle

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
[Chapter 12: Conformance Testing, Validation, and Competitive Standards Analysis](../../chapters/12-conformance-and-comparison/index.md).

```text
Type: workflow-diagram
**sim-id:** cmi5-session-lifecycle<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Recall the cmi5 session lifecycle states and the legal transitions between them.

**Diagram type:** Mermaid flowchart (TD direction) representing the state sequence. Click handlers on every node.

**States:**

1. `LMS launches AP` (with cmi5 launch parameters)
2. `AP fetches auth token`
3. `AP emits launched`
4. `AP emits initialized`
5. `AP emits learning statements (progressed / passed / failed / completed / scored)`
6. Decision: `AP closes cleanly?` → Yes → `AP emits terminated` → `Session ends` / No → `LMS times out → emits abandoned (server-side)`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox showing the verb IRI, when it's emitted, and a one-line example statement.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 12: Conformance Testing, Validation, and Competitive Standards Analysis](../../chapters/12-conformance-and-comparison/index.md)
