---
title: Voiding Lifecycle Flow
description: Voiding Lifecycle Flow
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Voiding Lifecycle Flow

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
[Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md).

```text
Type: workflow-diagram
**sim-id:** voiding-lifecycle-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the lifecycle of a statement that gets voided, identifying which records persist in the LRS and which are filtered from default queries.

**Diagram type:** Mermaid flowchart (LR direction) representing the temporal sequence as a left-to-right pipeline. Click handlers open an infobox for every node.

**Nodes (left to right):**

1. `AP emits original statement` (uuid=fd41…)
2. `LRS stores original`
3. `Default /statements query — original visible`
4. `AP discovers error`
5. `AP emits voiding statement` (StatementRef → fd41…, verb=voided)
6. `LRS stores voiding statement and flags fd41…`
7. `Default /statements query — original filtered out, voiding statement visible`
8. `voided=true query — both visible`

**Edges:** Solid arrows for the main flow; a dashed arrow loops from node 7 back to node 8 to indicate that operators can still inspect voided records on demand.

**Mermaid config:** project standard (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`, `useMaxWidth: true`, `securityLevel: 'loose'`).

**Click behavior:** Each node opens a side-panel infobox keyed off `data.json`. Glossary terms (`StatementRef`, `voided`, `authority`, `audit trail`) link to their full glossary definitions.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel. The side panel is a vanilla JS component that swaps content based on the clicked node id.
```

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)
