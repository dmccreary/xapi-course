---
title: xAPI Statement Anatomy
description: xAPI Statement Anatomy
status: built
library: Mermaid
bloom_level: Understand (L2). Bloom verb: identify, explain.
---

# xAPI Statement Anatomy

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** Understand (L2). Bloom verb: identify, explain.
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="522"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md).

```text
Type: diagram
**sim-id:** xapi-statement-anatomy<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Give the reader an interactive map of the eleven top-level fields of an xAPI 1.0.3 statement. Every node is clickable; clicking a node reveals an infobox containing the field's name, whether it is required, who sets it, the data type, and a one-paragraph plain-English definition pulled from the chapter glossary.

Bloom level: Understand (L2). Bloom verb: identify, explain.

Layout: Mermaid `flowchart TB` with a root node "xAPI Statement" at the top. Three required fields (`actor`, `verb`, `object`) branch immediately below in indigo fill. Two optional payload fields (`result`, `context`) branch as a second tier in teal fill. Five metadata fields (`id`, `timestamp`, `stored`, `authority`, `version`) form a third tier in lighter gray fill, grouped in a Mermaid `subgraph` labeled "Metadata".

Required interactivity:
- Every node MUST have a Mermaid `click` directive: `click <nodeId> call showFieldInfo("<field-name>")`.
- Clicking a node MUST open a side-panel infobox containing: field name, required status, data type, who sets the value, plain-English definition, and a sample value taken from the example statement in the chapter prose.
- Hovering a node MUST highlight the node and show a one-line tooltip with the field's plain-English definition.
- The infobox MUST emit an xAPI `interacted` statement when opened (foreshadowing how this textbook itself uses the standard it teaches).

ClassDef styling:
- `required` — fill #4338ca (indigo), white text, bold border
- `optional` — fill #0d9488 (teal), white text
- `metadata` — fill #e5e7eb (gray-200), dark text, dashed border

Sample infobox content (for `verb`):
"**verb** — Required. Object. Set by the Activity Provider. Identifies the action the actor performed. Must contain an IRI in the `id` field; the IRI should resolve to a published verb definition. Optional `display` map provides human-readable labels in one or more languages. Example: `{ id: 'http://adlnet.gov/expapi/verbs/passed', display: { 'en-US': 'passed' } }`."

Implementation: Mermaid `flowchart TB` with classDefs and `click` directives wired to a JavaScript `showFieldInfo(name)` function that reads from a JSON dictionary of field definitions and renders the infobox in a side panel. Responsive width via `<div style="width:100%">` wrapper.
```

## Related Resources

- [Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md)
