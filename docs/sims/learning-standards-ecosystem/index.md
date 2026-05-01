---
title: The Learning Standards Ecosystem
description: The Learning Standards Ecosystem
status: built
library: vis-network
bloom_level: TBD
---

# The Learning Standards Ecosystem

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** vis-network

## Preview

<iframe src="main.html" width="100%" height="452"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../../chapters/01-foundations-and-standards/index.md).

```text
Type: interactive infographic
**sim-id:** learning-standards-ecosystem<br/>
**Library:** vis-network<br/>
**Status:** Specified

An interactive vis-network graph that visualizes the full learning-standards ecosystem and shows which standards play together vs. which compete. Hover behavior shows a glossary-aligned definition for each node; clicking a node highlights its connected standards.

Nodes (with grouping color):

- **Content / packaging family** (gold): AICC, SCORM 1.2, SCORM 2004, QTI
- **Launch + identity family** (teal): LTI 1.1, LTI 1.3 / LTI Advantage
- **Behavior / analytics family** (indigo): xAPI, CMI5 (xAPI profile), IMS Caliper
- **Storage / infrastructure** (gray): LRS, LMS, Analytics platform

Edges (labeled):

- LMS — *launches* — SCORM 1.2 / SCORM 2004 / CMI5 / LTI tools
- LTI Tool — *can emit* — xAPI / Caliper
- CMI5 — *is a profile of* — xAPI
- SCORM 2004 — *successor to* — SCORM 1.2
- SCORM 1.2 — *evolved from* — AICC
- xAPI / Caliper — *delivered to* — LRS / Analytics platform
- QTI — *imported by* — LMS / authoring tools
- xAPI — *competes with* — Caliper (dashed edge)

Layout: vis-network `physics` with `barnesHut` solver, default edges slightly arrowed. Initial node Y offset of 10px on horizontally-aligned edges to avoid the vis-network edge-label rendering bug. Responsive width that triggers `network.fit()` on `resize`.

Learning objective (Bloom — Analyze): The reader can decompose a real intelligent-textbook deployment into the standards in play, identify which standards cooperate vs. compete, and predict which standard would be added to fill a missing capability.

Required interactivity:
- Every node MUST be clickable. Clicking a node dims unrelated nodes, highlights its direct neighbors, and opens a side-panel infobox containing: standard name, family, sponsoring organization, year of first release, the problem it solves, which standards it cooperates with, which standards it competes with, and a one-paragraph plain-English definition aligned with the chapter glossary.
- Every edge MUST be clickable. Clicking an edge MUST open an infobox describing the relationship (e.g., "*is a profile of*: CMI5 reuses xAPI's wire format and statement schema, but constrains how statements are used inside an LMS launch flow").
- Hovering a node MUST show a tooltip with the standard's full name and a one-line description.
- A "Show only what I emit" filter MUST be present and functional, hiding all nodes except the behavior/analytics family on demand.
- A family-filter legend MUST allow the reader to toggle each of the four families (content/packaging, launch/identity, behavior/analytics, storage/infrastructure) independently.
- Selecting a node MUST emit an xAPI `interacted` statement to the chapter's LRS, recording which standard the reader explored.
- Pan and zoom MUST be enabled (mouse wheel + drag), and a "Reset view" button MUST be present to return to the default layout.

Sample infobox content (for `CMI5 (xAPI profile)`):
"**CMI5** — Behavior/analytics family. Published by AICC (now part of 1EdTech) in 2016. A profile *on top of* xAPI that defines a strict session lifecycle (`launched` → `initialized` → `passed`/`failed` → `completed` → `terminated`), so an LMS can launch a course and know when it finished while the course itself emits rich xAPI statements. Cooperates with: xAPI, LMS launch protocols. Competes with: SCORM 2004 in modern deployments."

Implementation: vis-network with `groups` for the four families, hover tooltip via `title` HTML, click handlers on both nodes and edges, infobox rendered into a side panel. Responsive container; physics disabled after stabilization for a calm initial layout.
```

## Related Resources

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../../chapters/01-foundations-and-standards/index.md)
