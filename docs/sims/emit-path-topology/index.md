---
title: Emit-Path Topology
description: Interactive Mermaid MicroSim comparing client-side, server-side, and hybrid xAPI emission topologies, with click-to-reveal infoboxes describing the statements and security trade-offs of each path.
status: approved
library: Mermaid
bloom_level: "Analyze"
---

# Emit-Path Topology
<iframe src="main.html" height="582" width="100%" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Compare client-side, server-side, and hybrid emission topologies and identify
which events belong on which path for a given deployment.

- **Bloom Level:** Analyze
- **Bloom Verb:** Compare
- **Library:** Mermaid

## About This MicroSim

Three side-by-side topologies show every way a learner's interaction can become
an xAPI statement in the Learning Record Store:

- **Client-side** (teal): the browser POSTs straight to the LRS. Fast, but the
  credential lives in the browser and the payload can be edited in DevTools.
  Use it for analytics events where forgery is annoying but not catastrophic.
- **Server-side** (indigo): the browser tells your backend what happened, and
  the backend constructs and signs the statement. Higher latency, but the
  `authority` field reflects a credential the learner cannot reach. Use it
  for grades, completions, and credentials.
- **Hybrid** (rose): the same page does both. Analytics go directly to the
  LRS; graded events route through the backend. This is the production
  default, and the topology this course recommends for any system that
  mixes engagement tracking with grading.

Click any node — Browser, Backend, or LRS — in any topology to see examples of
the statements that flow through it and the security implications of that
path.

## Why This MicroSim Exists

The three-topology comparison is the single most important architectural
decision a team makes when adopting xAPI, and most teams make it implicitly —
by accident, not by analysis. They either ship credentials to the browser
because it's easy, or they route every interaction through their backend
because it's "secure," and live with the latency. Both are footguns dressed
as defaults.

This MicroSim makes the trade-off visual: low latency vs. authority,
forgeable vs. trustworthy. Once a learner can point at the right path for a
given event ("a hover is client-side, a passing grade is server-side"), they
have internalized the production pattern that the rest of the implementation
chapter assumes.

## Specification

The full specification below is extracted from
[Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md).

```text
Type: workflow-diagram
sim-id: emit-path-topology
Library: Mermaid
Status: Built

Learning objective (Bloom — Analyzing): Compare client-side, server-side, and
hybrid emission topologies and identify which events belong on which path for
a given deployment.

Diagram type: Mermaid flowchart with three labeled subgraphs side by side:
Client-side, Server-side, Hybrid (recommended). Click handlers on every node.

Subgraph contents:
- Client-side: Browser -> LRS. Annotation: "Low latency. Forgeable. Use for analytics."
- Server-side: Browser -> Backend -> LRS. Annotation: "Higher latency. Authoritative. Use for grades."
- Hybrid: Browser -> LRS (analytics path) AND Browser -> Backend -> LRS (graded path). Annotation: "Mix and match. Production default."

Mermaid config: project standard with securityLevel: 'loose'.

Click behavior: Each node opens a side-panel infobox with examples of statements
that flow through that path and the security implications.

Default canvas: 2/3 width diagram + 1/3 side panel.
```

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
- [The xAPI Statement Triple — Actor / Verb / Object](../xapi-statement-triple/index.md)
- [Statement Field Ownership](../statement-field-ownership/index.md)
