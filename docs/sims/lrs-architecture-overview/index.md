---
title: LRS Architecture Overview
description: LRS Architecture Overview
status: scaffold
library: Mermaid
bloom_level: TBD
---

# LRS Architecture Overview

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
[Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md).

```text
Type: clickable-mermaid
**sim-id:** lrs-architecture-overview<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify the major components of a conformant LRS — HTTP API layer, the five endpoints, the storage layer, and the indexing layer — and explain how a request flows through each.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node open a side-panel infobox.

**Structure:**

- Client (Activity Provider) on the left
- HTTP API layer (single node) labeled "xAPI HTTP API (auth + version negotiation)"
- The five endpoint nodes branching from the API layer: `/statements`, `/agents`, `/activities`, `/state`, `/about`
- A single "Storage Layer" node downstream of the endpoints, labeled "Document/Relational/Hybrid"
- An "Indexing Layer" node parallel to storage, labeled "Inverted indexes on actor, verb, object, timestamp"
- An arrow from `/statements` POST flowing through both Storage and Indexing
- An arrow from `/statements` GET flowing through Indexing first, then Storage

**Mermaid config:** project standard (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`, `useMaxWidth: true`, `securityLevel: 'loose'`).

**Click behavior:** Each node opens a side-panel infobox describing the component, what xAPI fields it cares about, and a one-line example of a request that exercises it.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel populated from `data.json`.
```

## Related Resources

- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md)
