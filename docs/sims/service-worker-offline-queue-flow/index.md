---
title: Service Worker and Offline Queue Flow
description: Service Worker and Offline Queue Flow
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Service Worker and Offline Queue Flow

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
[Chapter 9: Bandwidth Optimization, Offline Queues, and Service Workers](../../chapters/09-bandwidth-and-offline/index.md).

```text
Type: workflow-diagram
**sim-id:** service-worker-offline-queue-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the path of a statement emitted while offline through the IndexedDB queue and back to the LRS when connectivity returns.

**Diagram type:** Mermaid flowchart (TD direction). Click handlers on every node.

**Structure:**

1. Start: `Component calls xapiClient.send(stmt)`
2. Decision: `navigator.onLine?` → No → branch to queue
3. Yes branch: `Attempt POST to LRS` → Success → `Done` / Failure → branch to queue
4. Queue branch: `Write statement to IndexedDB`
5. Background: `online event fires` → `Worker reads queue` → `POST batch to LRS` → on success → `Remove from queue`
6. Loop: while queue is non-empty and online, continue flushing

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with the relevant code snippet and the typical edge cases at that step.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 9: Bandwidth Optimization, Offline Queues, and Service Workers](../../chapters/09-bandwidth-and-offline/index.md)
