---
title: Statistical Representativeness Comparison
description: Statistical Representativeness Comparison
status: implemented
library: p5.js
bloom_level: Evaluate
---

# Statistical Representativeness Comparison

## Learning Objective

Compare a synthetic dataset to a reference real dataset across verb
frequency and session duration, identifying where the synthetic falls
outside the acceptable tolerance.

- **Bloom Level:** Evaluate
- **Bloom Verb:** Compare
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="662" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Synthetic Data Generation and AI-Assisted LRS Testing](../../chapters/11-synthetic-data-and-ai-testing/index.md).

```text
Type: interactive-infographic
**sim-id:** statistical-representativeness-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare a synthetic dataset to a reference real dataset across verb frequency and session duration, identifying where the synthetic falls outside the acceptable tolerance.

**Layout:** Two side-by-side bar-chart pairs (top: verb frequency; bottom: session duration histogram); a tolerance-bar overlay; a side panel reporting pass/fail.

**Visual elements:**

- Top: side-by-side bar charts, each verb a pair (real left, synthetic right), with a tolerance band shown as a shaded background
- Bottom: side-by-side histogram bins (5-minute buckets, 0–60 min), real left, synthetic right
- Side panel: pass/fail badge per dimension, with the worst-deviating verb or bucket highlighted

**Interaction:**

- Slider: tolerance percentage (5% – 30%)
- Slider: synthetic-archetype mix (five sliders) — adjusting the mix re-generates the synthetic data and re-renders the comparison
- Preset buttons: "Match real cohort", "Over-engaged synthetic", "Under-engaged synthetic", "Skewed-archetype synthetic"

**Default canvas:** 1000×650px, responsive.

Implementation: p5.js for the bar charts, histogram rendering, and live re-computation when sliders change.
```

## Related Resources

- [Chapter 11: Synthetic Data Generation and AI-Assisted LRS Testing](../../chapters/11-synthetic-data-and-ai-testing/index.md)
