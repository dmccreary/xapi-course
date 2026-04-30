---
title: Hosting Model Decision Tree
description: Hosting Model Decision Tree
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Hosting Model Decision Tree

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
[Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md).

```text
Type: workflow-diagram
**sim-id:** hosting-model-decision-tree<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Apply a structured decision process to choose between hosted SaaS, self-hosted open source, and embedded LRS for a given deployment scenario.

**Diagram type:** Mermaid flowchart (TD direction) with diamond decision nodes and rectangular outcome nodes. Click handlers on every node.

**Decision flow:**

1. Start: `New deployment`
2. Diamond: `Is the device often offline?` → Yes → `Embedded LRS (with sync to central)` / No → next
3. Diamond: `Does data sovereignty / regulation forbid third-party hosting?` → Yes → `Self-hosted open source` / No → next
4. Diamond: `Do we have ops capacity to run a database 24/7?` → No → `Hosted SaaS LRS` / Yes → next
5. Diamond: `Is the projected statement volume above 5k/sec sustained?` → Yes → `Self-hosted open source (Ralph or scaled Learning Locker)` / No → `Hosted SaaS or self-hosted (either fits)`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with a brief explanation, plus the typical platforms that match that branch.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md)
