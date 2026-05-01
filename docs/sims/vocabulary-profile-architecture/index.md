---
title: Vocabulary Profile Architecture
description: Vocabulary Profile Architecture
status: implemented
library: Mermaid
bloom_level: "Understand"
---

# Vocabulary Profile Architecture
<iframe src="main.html" width="100%" height="542" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Identify the components of a complete xAPI vocabulary profile and how
they relate to one another.

- **Bloom Level:** Understand
- **Bloom Verb:** Identify
- **Library:** Mermaid

## Specification

The full specification below is extracted from
[Chapter 13: xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness](../../chapters/13-pipeline-and-production/index.md).

```text
Type: clickable-mermaid
**sim-id:** vocabulary-profile-architecture<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify the components of a complete xAPI vocabulary profile and how they relate to one another.

**Diagram type:** Mermaid flowchart (TD direction). Click handlers on every node.

**Structure:**

- Top: `Profile (JSON-LD document at stable URL)`
- Three branches downstream:
    - `Verbs` — list of canonical + custom verbs with IRIs
    - `Activity Types` — list of canonical + custom types with IRIs
    - `Extensions` — namespaced extensions with schema
- Bottom: `Statement Patterns` — combines verbs, types, and extensions into approved emit shapes
- Side: `Profile Server (publishes JSON-LD at stable URL)` connected to `Profile`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the component, an example excerpt, and the chapter section that covers it.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 13: xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness](../../chapters/13-pipeline-and-production/index.md)
