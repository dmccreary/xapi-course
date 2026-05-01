---
title: Real-Time Dashboard Stack
description: Real-Time Dashboard Stack
status: approved
library: Mermaid
bloom_level: "Understand"
---

# Real-Time Dashboard Stack
<iframe src="main.html" width="100%" height="542" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Identify each layer of a real-time xAPI dashboard pipeline and recognize
where statements transform into engagement metrics.

- **Bloom Level:** Understand
- **Bloom Verb:** Identify
- **Library:** Mermaid

## Specification

The full specification below is extracted from
[Chapter 10: Monitoring, Observability, and xAPI Traffic Analysis](../../chapters/10-monitoring-and-observability/index.md).

```text
Type: clickable-mermaid
**sim-id:** real-time-dashboard-stack<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify each layer of a real-time xAPI dashboard pipeline and recognize where statements transform into engagement metrics.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node.

**Structure:**

- Source: `LRS (statements + logs)`
- Aggregation layer: `Streaming aggregator (or batched query)` with two parallel branches:
    - Branch 1: `Operator metrics — throughput, latency, errors`
    - Branch 2: `Educator metrics — engagement, completion, attempts`
- Dashboard layer: `Grafana` (operator) + `Observable Framework` (educator)
- Consumer layer: `Operators` and `Teachers / Instructional Designers`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the layer's role, the data shape at that layer, and a one-line example of a metric or query at that layer.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 10: Monitoring, Observability, and xAPI Traffic Analysis](../../chapters/10-monitoring-and-observability/index.md)
