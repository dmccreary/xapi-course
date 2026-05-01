---
title: Canonical Verb Explorer
description: Canonical Verb Explorer
status: scaffold
library: Mermaid
bloom_level: "TBD"
---

# Canonical Verb Explorer
<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Specification

The full specification below is extracted from
[Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md).

```text
Type: interactive-infographic
**sim-id:** canonical-verb-explorer<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Remembering / Understanding):** Recall the twelve canonical ADL verbs used in intelligent textbooks and explain when each is appropriate.

**Diagram type:** Mermaid flowchart, LR direction, with click handlers on every verb node.

**Structure:**

- Four colored cluster nodes labeled "Content Consumption," "Assessment," "Progress," "Session Lifecycle"
- Each cluster fans out to its member verbs:
    - Content Consumption → `experienced`, `interacted`
    - Assessment → `attempted`, `passed`, `failed`, `scored`
    - Progress → `progressed`, `completed`
    - Session Lifecycle → `launched`, `initialized`, `terminated`, `abandoned`

**Mermaid config:** project standard (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`, `useMaxWidth: true`, `securityLevel: 'loose'`).

**Click behavior:** Each verb node opens a side-panel infobox showing the full IRI, a one-line definition, a one-line "when to emit" rule, and a complete example statement using that verb.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel. The side panel pulls content from a `data.json` keyed by verb local name; pre-populating that JSON from the project glossary is recommended.
```

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
