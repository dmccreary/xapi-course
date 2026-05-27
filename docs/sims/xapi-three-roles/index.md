---
title: Activity Provider, LRS, and Activity Consumer
description: "Activity Provider, LRS, and Activity Consumer"
status: approved
library: Mermaid
bloom_level: "Understand (L2). Bloom verb- describe, classify."
---
# Activity Provider, LRS, and Activity Consumer

<iframe src="main.html" width="100%" height="682"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

- **Bloom Level:** Understand (L2). Bloom verb: describe, classify.
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Specification

The full specification below is extracted from
[Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md).

```text
Type: workflow
**sim-id:** xapi-three-roles<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Cement the three role names — Activity Provider, Learning Record Provider, Activity Consumer — and show how statements flow from creation, through the LRS, to consumption. Disambiguates the AP-vs-LRP distinction visually.

Bloom level: Understand (L2). Bloom verb: describe, classify.

Layout: Mermaid `flowchart LR` with five nodes laid out left-to-right:
1. `Activity Provider` (indigo) — produces statements
2. `Learning Record Provider` (lighter indigo, dashed border) — broader category, drawn as a superset around AP
3. `LRS` (gold, large) — central node
4. `Activity Consumer` (teal) — reads statements
5. A subordinate cluster of three example consumers under "Activity Consumer": `Dashboard`, `Recommender`, `Grade Export`.

Arrows:
- AP → LRS labeled "POST /statements" (clickable)
- LRS → Consumer labeled "GET /statements" (clickable)
- LRP envelope drawn around AP with a note "All APs are LRPs; not all LRPs are APs"

Required interactivity:
- Every node MUST have a Mermaid `click` directive opening an infobox with: role definition, HTTP verbs used, example real-world systems (e.g., AP: "your intelligent textbook, a simulation, a quiz tool"; Consumer: "Watershed dashboards, a custom Grafana board, a Canvas grade-passback script"), and a one-paragraph "common confusion" callout.
- Both arrows are clickable and reveal an infobox describing the HTTP request/response, headers, and authentication.
- Hovering the LRP envelope highlights the relationship and reveals a tooltip "Learning Record Provider — any system that provides records to an LRS, including but not limited to Activity Providers."

Sample infobox content (for `Activity Consumer`):
"**Activity Consumer** — A system that reads statements from an LRS via HTTP GET. Consumers never write statements. Examples: a real-time engagement dashboard, a personalized recommender that suggests next chapters based on completion patterns, a grade-export script that pushes final scores to an LMS gradebook. Common confusion: a system can be both an AP and a Consumer (it writes some statements and reads others), but the two roles are conceptually distinct and often have different authentication credentials."

Implementation: Mermaid `flowchart LR` with classDefs, a Mermaid `subgraph` for the LRP envelope, and `click` directives wired to a JavaScript `showRoleInfo(role)` function. Responsive width.
```

## Related Resources

- [Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md)
