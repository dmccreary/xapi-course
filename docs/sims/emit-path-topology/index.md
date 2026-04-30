---
title: Emit-Path Topology
description: Emit-Path Topology
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Emit-Path Topology

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
**sim-id:** emit-path-topology<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Compare client-side, server-side, and hybrid emission topologies and identify which events belong on which path for a given deployment.

**Diagram type:** Mermaid flowchart with three labeled subgraphs side by side: `Client-side`, `Server-side`, `Hybrid (recommended)`. Click handlers on every node.

**Subgraph contents:**

- Client-side: `Browser` → `LRS`. Annotation: "Low latency. Forgeable. Use for analytics."
- Server-side: `Browser` → `Backend` → `LRS`. Annotation: "Higher latency. Authoritative. Use for grades."
- Hybrid: `Browser` → `LRS` (analytics path) AND `Browser` → `Backend` → `LRS` (graded path). Annotation: "Mix and match. Production default."

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with examples of statements that flow through that path and the security implications.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with three subgraphs and click directives.
```

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
