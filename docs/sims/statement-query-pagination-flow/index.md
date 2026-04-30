---
title: Statement Query and Pagination Flow
description: Statement Query and Pagination Flow
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Statement Query and Pagination Flow

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
**sim-id:** statement-query-pagination-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Trace the round-trip flow of a paginated statement query, identifying when the client should follow the `more` URL and when to stop.

**Diagram type:** Mermaid flowchart (TD direction) representing the client-side loop. Click handlers on every node.

**Structure:**

1. Start: `Client builds initial GET with filters`
2. Action: `Send GET /xAPI/statements?...`
3. Decision diamond: `Response has non-empty more URL?` → No → `Done — all results retrieved`
4. From Yes → `Process statements array`
5. → `Send GET <more URL>` → loop back to decision

**Edges:** Solid arrows for the main loop; a side branch from "Process statements array" to "Hand off to dashboard / aggregation" indicates the data destination, not the loop.

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the step, with a one-line code snippet showing how a typical TypeScript client would implement that step.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md)
