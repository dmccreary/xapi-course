---
title: Full Pipeline Architecture
description: Full Pipeline Architecture
status: approved
library: Mermaid
bloom_level: "Analyze"
---

# Full Pipeline Architecture
<iframe src="main.html" width="100%" height="802" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Trace a learner interaction from emit through every pipeline layer to its
appearance on a dashboard, identifying the responsibilities and typical
latencies of each layer.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace
- **Library:** Mermaid

## Specification

The full specification below is extracted from
[Chapter 13: xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness](../../chapters/13-pipeline-and-production/index.md).

```text
Type: clickable-mermaid
**sim-id:** full-pipeline-architecture<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace a learner interaction from emit through every pipeline layer to its appearance on a dashboard, identifying the responsibilities and typical latencies of each layer.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node.

**Structure:**

- Layer 1: `Browser (Component → Client Library → Offline Queue)`
- Layer 2: `LRS (Statement Endpoint → Storage → Query API)`
- Layer 3: `Stream Processor → OLAP Aggregate Store`
- Layer 4: `Dashboard (Grafana / Observable)`

**Annotations on edges:**

- Browser → LRS: typical latency 100–500ms; failure mode: network drop
- LRS → Stream: typical latency seconds; failure mode: consumer lag
- Stream → OLAP: typical latency seconds-to-minutes; failure mode: aggregation bug
- OLAP → Dashboard: typical latency milliseconds; failure mode: query timeout

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the component's responsibility, the chapter that covers it, the typical implementation tooling, and the most common failure mode.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 13: xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness](../../chapters/13-pipeline-and-production/index.md)
