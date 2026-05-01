---
title: Bandwidth Budget Calculator MicroSim
description: Bandwidth Budget Calculator MicroSim
status: implemented
library: HTML/JS
bloom_level: "Apply"
---

# Bandwidth Budget Calculator MicroSim
<iframe src="main.html" width="100%" height="542" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Estimate the total bandwidth cost of an xAPI deployment by adjusting
per-statement size, frequency, batch size, and concurrent learner count.

- **Bloom Level:** Apply
- **Bloom Verb:** Estimate
- **Library:** HTML/JS

## Specification

The full specification below is extracted from
[Chapter 9: Bandwidth Optimization, Offline Queues, and Service Workers](../../chapters/09-bandwidth-and-offline/index.md).

```text
Type: micro-sim
**sim-id:** bandwidth-budget-calculator-microsim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Estimate the total bandwidth cost of an xAPI deployment by adjusting per-statement size, frequency, batch size, and concurrent learner count.

**Layout:** 2/3 (left) input controls + 1/3 (right) live output panel.

**Controls:**

- Slider: Per-statement payload size (500 – 3000 bytes, default 1200)
- Slider: HTTP overhead per request (300 – 1500 bytes, default 700)
- Slider: Statements per learner per session (5 – 200, default 45)
- Slider: Session duration in minutes (5 – 120, default 20)
- Slider: Concurrent learners (1 – 1000, default 30)
- Slider: Batch size — statements per POST (1 – 50, default 1; demonstrates the impact of batching)

**Right panel output:**

- Total bytes per learner per session
- Total bytes for the cohort
- Average bytes per second during the session
- Comparison bar showing this vs. one of three reference loads ("classroom WiFi headroom", "10 Mbps cellular tether", "1 Gbps campus link")
- A green/yellow/red headroom badge based on the reference load

**Interaction:**

- Adjusting any slider re-computes all outputs in real time
- Preset buttons across the bottom: "Reading-only chapter", "Interactive math chapter", "Simulation-heavy physics chapter", "30-student assessment window"

**Default canvas:** 1000×600px, responsive.

Implementation: p5.js for the sliders, layout, and dynamic computations; HTML overlay for the output panel.
```

## Related Resources

- [Chapter 9: Bandwidth Optimization, Offline Queues, and Service Workers](../../chapters/09-bandwidth-and-offline/index.md)
