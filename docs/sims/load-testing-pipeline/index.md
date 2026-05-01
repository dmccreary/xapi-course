---
title: Load Testing Pipeline
description: Load Testing Pipeline
status: implemented
library: Mermaid
bloom_level: Analyze
---

# Load Testing Pipeline

## Learning Objective

Trace the flow of a load test from synthetic data generation through
LRS ingestion to metric capture and result analysis.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="542" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Synthetic Data Generation and AI-Assisted LRS Testing](../../chapters/11-synthetic-data-and-ai-testing/index.md).

```text
Type: workflow-diagram
**sim-id:** load-testing-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the flow of a load test from synthetic data generation through LRS ingestion to metric capture and result analysis.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node.

**Structure:**

1. `Cohort spec (size, archetype mix, duration)`
2. `Claude Code generation` → `Synthetic statement corpus (JSON)`
3. `Conformance validator (drop malformed)`
4. `Load runner (replay at configured rate)` → `LRS under test`
5. `LRS instrumentation (POST latency, error rate, throughput)` → `Time-series metric store`
6. `Dashboard / report (pass/fail vs SLOs)`
7. Side branch: `Periodic dashboard queries` → also feeds metric store

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the component, the typical tooling at that step, and an example metric or output.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 11: Synthetic Data Generation and AI-Assisted LRS Testing](../../chapters/11-synthetic-data-and-ai-testing/index.md)
