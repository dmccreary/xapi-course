---
title: Canonical Verb Explorer
description: An interactive Mermaid diagram of the twelve canonical ADL verbs, grouped by lifecycle role, with click-to-reveal IRIs, definitions, and example statements.
status: approved
library: Mermaid
bloom_level: Understand
---

# Canonical Verb Explorer

<iframe src="main.html" width="100%" height="602px" scrolling="no" style="border:1px solid #ccc; overflow:hidden;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Recall the twelve canonical ADL verbs used in intelligent textbooks and explain
when each is appropriate to emit. After working through this MicroSim, you can
reach for the right verb without scrolling the ADL registry by hand.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Recall, Explain
- **Library:** Mermaid

## How to Use

The diagram on the left groups the twelve canonical verbs into four roles.
Click any node to populate the side panel:

- **Cluster nodes** (Content Consumption, Assessment, Progress, Session Lifecycle)
  show the role's overview and which verbs belong to it.
- **Verb leaves** (e.g., `passed`, `terminated`) show the full IRI, a one-line
  definition, the rule for when to emit it, and a complete example xAPI
  statement you can copy as a starting point.

Hover any node for a one-line tooltip.

## The Four Clusters

| Cluster | Verbs | What it captures |
|---------|-------|-----------------|
| **Content Consumption** | `experienced`, `interacted` | What the learner saw and touched. |
| **Assessment** | `attempted`, `passed`, `failed`, `scored` | How performance was judged. |
| **Progress** | `progressed`, `completed` | How far the learner got. |
| **Session Lifecycle** | `launched`, `initialized`, `terminated`, `abandoned` | When the session opened and closed. |

## Specification

The full specification below is extracted from
[Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md).

```text
Type: interactive-infographic
sim-id: canonical-verb-explorer
Library: Mermaid

Learning objective (Bloom — Remembering / Understanding): Recall the twelve
canonical ADL verbs used in intelligent textbooks and explain when each is
appropriate.

Diagram type: Mermaid flowchart, LR direction, with click handlers on every
verb node.

Structure:
- Four colored cluster nodes labeled "Content Consumption," "Assessment,"
  "Progress," "Session Lifecycle"
- Each cluster fans out to its member verbs:
    - Content Consumption → experienced, interacted
    - Assessment → attempted, passed, failed, scored
    - Progress → progressed, completed
    - Session Lifecycle → launched, initialized, terminated, abandoned

Mermaid config: project standard (nodeSpacing: 12, rankSpacing: 60,
padding: 4, useMaxWidth: true, securityLevel: 'loose').

Click behavior: Each verb node opens a side-panel infobox showing the full
IRI, a one-line definition, a one-line "when to emit" rule, and a complete
example statement using that verb.

Default canvas: 2/3 width diagram + 1/3 side panel.
```

## Lesson Plan

1. Open the MicroSim and read the four cluster overviews in order.
2. For each verb leaf, predict aloud: *"When would I emit this?"*
3. Click the verb to check your prediction. Compare your wording to the
   "When to emit" rule.
4. Open the example statement and identify the three required parts (Actor,
   Verb, Object) plus any optional fields (Result, Context).
5. Sketch a session for one of your own learning activities. Which of the
   twelve verbs would fire, and in what order?

## References

- [ADL Verb Registry](http://adlnet.gov/expapi/verbs/)
- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
- [Glossary — xAPI verb entries](../../glossary.md)
