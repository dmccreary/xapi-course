---
title: Intelligent Textbook xAPI Architecture
description: Intelligent Textbook xAPI Architecture
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Intelligent Textbook xAPI Architecture

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
[Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md).

```text
Type: clickable-mermaid
**sim-id:** intelligent-textbook-xapi-architecture<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify each layer of an xAPI-instrumented intelligent textbook and trace how a learner's interaction propagates from a MicroSim through the client library to the LRS.

**Diagram type:** Mermaid flowchart (TD direction). Click handlers on every node.

**Structure:**

- Top layer: `Markdown content (MkDocs Material)`
- Component layer (three nodes side by side): `MicroSim`, `Quiz`, `Adaptive Branching`
- Each component layer node arrows down to: `xAPI Client Library` (single node)
- Client library arrows to: `Statement Builder`, `Batch Buffer`, `Retry Manager`, `Auth Header Manager` (four parallel nodes)
- All four arrow into: `Fetch API → LRS HTTP API`
- Final node: `LRS Storage`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the component's responsibility, the chapter section that covers it, and a one-line code reference.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
