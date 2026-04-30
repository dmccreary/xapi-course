---
title: Batching Wire-Cost Comparison
description: Batching Wire-Cost Comparison
status: scaffold
library: p5.js
bloom_level: TBD
---

# Batching Wire-Cost Comparison

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: Bandwidth Optimization, Offline Queues, and Service Workers](../../chapters/09-bandwidth-and-offline/index.md).

```text
Type: interactive-infographic
**sim-id:** batching-wire-cost-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Compare individual-POST and batched-POST traffic patterns visually, recognizing how HTTP overhead amortizes as batch size grows.

**Layout:** Two side-by-side timelines (top: "Individual POST", bottom: "Batched POST"); a side panel on the right shows numerical comparison.

**Visual elements:**

- Each timeline shows a sequence of HTTP request/response pairs over a 10-second window
- Individual POST: 30 request/response pairs, each with overhead bands shown distinctly from payload bands (different colors)
- Batched POST: 3 request/response pairs (10 statements each), each clearly larger but with the same overhead band
- Stacked bar at the right of each timeline showing total bytes broken into "overhead" and "payload"

**Interaction:**

- Slider: number of statements (5 – 100)
- Slider: batch size (1 – 50)
- Both timelines re-render to reflect the new values
- Side panel shows: individual total, batched total, percentage saved

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the timeline rendering and animated re-layout on slider change.
```

## Related Resources

- [Chapter 9: Bandwidth Optimization, Offline Queues, and Service Workers](../../chapters/09-bandwidth-and-offline/index.md)
