---
title: Activity Naming and Occurrence Fields
description: Click or hover the five colored fields in a worked xAPI statement to see which question each one answers — and toggle compare mode to see what changes between two attempts of the same activity.
status: built
library: HTML/CSS/JavaScript
bloom_level: "Understand"
---

# Activity Naming and Occurrence Fields
<iframe src="main.html" width="100%" height="542" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Distinguish the five fields that name an activity occurrence — `object.id`,
`object.definition.type`, `object.definition.revision`, `context.registration`,
and `context.platform` — and identify which question each one answers.

- **Bloom Level:** Understand
- **Bloom Verb:** Distinguish
- **Library:** HTML/CSS/JavaScript (interactive infographic overlay)

## How to Use

1. **Hover or click** any of the five colored fields in the JSON statement on
   the left. The right-hand panel updates with the field's plain-English
   question, when to set it, and a one-line example value.
2. **Toggle "Compare two attempts"** in the top-right to swap the single
   statement for two side-by-side statements representing two registrations of
   the same activity. The pulsing orange highlight marks the field that
   *changes* (`context.registration`); the green inset highlight marks the
   field that *stays the same* (`object.id`).

## Why It Matters

These five fields are the difference between an LRS that can answer "how many
learners completed Chapter 4?" and one that can answer "how many learners
completed Chapter 4 *on the mobile app*, *on revision 3*, *on their second
attempt*?". Get the naming right at write-time and you get analytical superpowers
at query-time — for free.

## Related Resources

- [Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md)
