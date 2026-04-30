---
title: Optimistic Concurrency on the State Endpoint
description: Optimistic Concurrency on the State Endpoint
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Optimistic Concurrency on the State Endpoint

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
Type: workflow-diagram
**sim-id:** optimistic-concurrency-state-endpoint<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace two concurrent clients writing to the same state document and identify which writer wins, which gets a 412, and what the losing client must do to recover.

**Diagram type:** Mermaid flowchart (TD direction) showing two parallel client lanes converging on a single LRS lane. Click handlers on every node.

**Structure:**

- Two parallel lanes labeled `Client A` and `Client B`, each starting with `GET /state → ETag v1`
- Both lanes modify locally
- Client A: `PUT with If-Match: v1` → LRS returns `200, ETag v2`
- Client B: `PUT with If-Match: v1` → LRS returns `412 Precondition Failed`
- Client B then `GET /state → ETag v2`, merge, `PUT with If-Match: v2` → LRS returns `200, ETag v3`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox showing the HTTP message in detail, plus a one-line note on what a robust client implementation does at that step.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with two parallel subgraphs and click directives.
```

## Related Resources

- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md)
