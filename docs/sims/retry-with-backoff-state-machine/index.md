---
title: Retry-With-Backoff State Machine
description: Retry-With-Backoff State Machine
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Retry-With-Backoff State Machine

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
Type: workflow-diagram
**sim-id:** retry-with-backoff-state-machine<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the state transitions of a statement batch through the retry-with-backoff pipeline and identify which response codes lead to which outcomes.

**Diagram type:** Mermaid stateDiagram-v2 (or flowchart equivalent if state diagrams don't support click handlers). Click handlers on every node.

**States:**

1. `Buffering` — statement appended to in-memory batch
2. `Sending` — POST in flight
3. `Success (2xx)` — terminal success state
4. `Client Error (4xx)` — terminal failure state, surfaces error
5. `Backoff` — scheduled retry after exponential delay
6. `Offline Queue` — terminal handoff state after max retries

**Transitions:**

- Buffering → Sending (on flush or batch full)
- Sending → Success (2xx)
- Sending → Client Error (4xx)
- Sending → Backoff (5xx or network error)
- Backoff → Sending (on timer)
- Backoff → Offline Queue (after max retries)

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each state opens a side-panel infobox describing what happens in that state and the typical duration the state lasts.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with state-like nodes and click directives.
```

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
