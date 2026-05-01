---
title: Who Sets What — Client vs. LRS Field Ownership
description: Who Sets What — Client vs. LRS Field Ownership
status: scaffold
library: Mermaid
bloom_level: Analyze (L4). Bloom verb: differentiate, attribute.
---

# Who Sets What — Client vs. LRS Field Ownership

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** Analyze (L4). Bloom verb: differentiate, attribute.
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md).

```text
Type: diagram
**sim-id:** statement-field-ownership<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Disambiguate, at a glance, which statement fields are the client's responsibility and which are the LRS's. Eliminates a class of bugs where developers try to set `stored` or `authority` from the client and are surprised when the LRS overwrites them.

Bloom level: Analyze (L4). Bloom verb: differentiate, attribute.

Layout: Mermaid `flowchart LR` with two large `subgraph` containers side by side. Left subgraph "Activity Provider sets" contains nodes: `actor`, `verb`, `object`, `result`, `context`, `id`, `timestamp`. Right subgraph "LRS sets" contains nodes: `stored`, `authority`, `version`. A central arrow labeled "POST /statements" connects the two subgraphs and is itself clickable to reveal an infobox describing the wire protocol.

Required interactivity:
- Every node MUST have a Mermaid `click` directive that opens an infobox describing: who sets the field, when, the data type, and what happens if the client tries to set an LRS-owned field anyway (answer: the LRS overwrites it silently — a common trap).
- Hovering a subgraph header MUST highlight all nodes in that subgraph.
- The central "POST /statements" arrow is clickable and reveals an infobox describing the request/response cycle, including the Content-Type, the X-Experience-API-Version header, and the LRS's response with the assigned UUIDs.

ClassDef styling:
- `client-set` — fill #4338ca (indigo), white text
- `lrs-set` — fill #16a34a (green), white text
- `negotiated` — fill #f59e0b (amber), dark text — used for `id` (client may set, LRS will mint if absent)

Sample infobox content (for `stored`):
"**stored** — Set by the LRS, never by the client. ISO 8601 timestamp recording when the LRS received and persisted the statement. Use `stored` for replication, audit, and reconciliation. Do not confuse with `timestamp`, which is when the learner experienced the event. The gap between `timestamp` and `stored` is your offline buffer in action."

Implementation: Mermaid `flowchart LR` with classDefs and `click` directives wired to a JavaScript `showFieldOwnership(name)` function. Responsive width.
```

## Related Resources

- [Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md)
