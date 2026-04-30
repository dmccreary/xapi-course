---
title: Verb Selection Decision Tree
description: Verb Selection Decision Tree
status: scaffold
library: Mermaid
bloom_level: TBD
---

# Verb Selection Decision Tree

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md).

```text
Type: workflow-diagram
**sim-id:** verb-selection-decision-tree<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Apply a structured decision process to choose between an ADL verb, a canonical verb plus extension, or a custom verb for any new emit site.

**Diagram type:** Mermaid flowchart (TD direction) with diamond decision nodes and rectangular outcome nodes. Click handlers on every node.

**Decision flow:**

1. Start: "New event to emit"
2. Diamond: "Is there an ADL verb that fits?" → Yes → "Use ADL verb (done)" / No → next
3. Diamond: "Is there an ADL verb that fits with an extension?" → Yes → "Use ADL verb + extension (preferred)" / No → next
4. Diamond: "Will the cost of a custom verb (governance, profile, training) be lower than the cost of forcing an ADL fit?" → No → "Force the ADL fit, document the strain" / Yes → next
5. Diamond: "Is the verb already in the project profile?" → Yes → "Use existing custom verb" / No → "Open a profile-update PR (custom verb requires steward review)"

**Mermaid config:** project standard with `securityLevel: 'loose'` for click handlers.

**Click behavior:** Each node opens a side-panel infobox with a brief explanation and one or two real-world examples for that decision branch.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel.
```

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
