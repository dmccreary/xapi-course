---
title: Pseudonymization Pipeline
description: Pseudonymization Pipeline
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Pseudonymization Pipeline

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
[Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md).

```text
Type: workflow-diagram
**sim-id:** pseudonymization-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the flow of identity information from the LMS through the textbook into the LRS, identifying at each hop what level of identifying detail is exposed.

**Diagram type:** Mermaid flowchart (LR direction) representing the pipeline. Click handlers on every node.

**Nodes (left to right):**

1. `LMS user record` (contains: name, email, role) — privacy badge: Red
2. `LMS launch — pseudonym only` (the LMS hands the textbook only `stu-8f3a2b1c`) — privacy badge: Green
3. `Textbook emit site` (constructs xAPI statement with the pseudonym in `account.name`) — privacy badge: Green
4. `LRS storage` (stores statements keyed by pseudonym) — privacy badge: Green
5. `Dashboard query` (computes per-learner stats using the pseudonym) — privacy badge: Green
6. `Re-identification lookup` (rare; goes back to LMS, audited) — privacy badge: Red, dashed line back to node 1

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing what data exists at that hop, who has access, and what the privacy posture is. The dashed re-identification edge has its own infobox emphasizing the audit-log requirement.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel.
```

## Related Resources

- [Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md)
