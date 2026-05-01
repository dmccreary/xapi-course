---
title: Learner Archetype Profiles
description: Learner Archetype Profiles
status: approved
library: p5.js
bloom_level: "Understand"
---
# Learner Archetype Profiles

<iframe src="main.html" width="100%" height="502" scrolling="no" style="border:1px solid #ddd;border-radius:4px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Distinguish the five canonical learner archetypes by their behavioral
signatures, and recognize which archetype dominates a given session pattern.

- **Bloom Level:** Understand
- **Bloom Verb:** Distinguish
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 11: Synthetic Data Generation and AI-Assisted LRS Testing](../../chapters/11-synthetic-data-and-ai-testing/index.md).

```text
Type: interactive-infographic
**sim-id:** learner-archetype-profiles<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Distinguish the five canonical learner archetypes by their behavioral signatures, and recognize which archetype dominates a given session pattern.

**Layout:** Five horizontal cards stacked vertically (one per archetype) on the left (2/3); a side panel on the right (1/3) showing the selected archetype's full detail.

**Each card shows:**

- Archetype name in a header bar
- Three small bar charts side by side: typical statement count, typical session length, typical first-try pass rate
- A one-line summary
- An archetype-color band (Fast: blue, Struggling: red, Disengaged: gray, Re-learner: purple, Mastery-seeker: green)

**Side panel shows:**

- Full description of the archetype
- The verb-frequency profile expected from that archetype (a small bar chart of the eight ADL verbs from Chapter 4)
- A worked example session (5–10 statements) representative of that archetype

**Interaction:**

- Hover or click a card to update the side panel
- Slider at the bottom: cohort mix (five sliders summing to 100%) — adjusts the recommended cohort composition

**Default canvas:** 1000×650px, responsive.

Implementation: p5.js for the cards, charts, and selection state; HTML overlay for the side panel and mix sliders.
```

## Related Resources

- [Chapter 11: Synthetic Data Generation and AI-Assisted LRS Testing](../../chapters/11-synthetic-data-and-ai-testing/index.md)
