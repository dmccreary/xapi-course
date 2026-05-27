---
title: Statement Pattern Composer
description: "Interactive p5.js composer for xAPI statement patterns. Pick a pattern (Page-Read, Quiz-Submission, MicroSim-Interaction, Adaptive-Branching, Voiding) and watch the slot-rule map update — required slots in green, allowed in yellow, forbidden in red — alongside a live JSON preview that reflects every control change."
status: approved
library: p5.js
bloom_level: Create
image: /sims/statement-pattern-composer/statement-pattern-composer.png
og:image: /sims/statement-pattern-composer/statement-pattern-composer.png
twitter:image: /sims/statement-pattern-composer/statement-pattern-composer.png
social:
  cards: false
---

# Statement Pattern Composer

<iframe src="main.html" height="582" width="100%" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/statement-pattern-composer/main.html"
        height="582px" width="100%" scrolling="no"></iframe>
```

## Learning Objective

Compose a complete xAPI statement by selecting a pattern, filling in
pattern-specific slots, and observing the rendered statement to learn how
patterns enforce consistency across emit sites.

- **Bloom Level:** Create
- **Bloom Verb:** Compose / Construct
- **Library:** p5.js

## Description

A *statement pattern* is a templated shape — a constraint over which slots a
statement is required to fill, allowed to fill, and forbidden from filling.
Without patterns, every team that emits xAPI invents its own
statement-shape conventions, and downstream analytics break the moment two
teams shape the same event differently.

This sim shows five common patterns side by side:

- **Page-Read** — `experienced` a chapter; no result, optional context
- **Quiz-Submission** — `completed` a quiz; required result with score
- **MicroSim-Interaction** — `interacted`; required context, optional result
- **Adaptive-Branching** — `progressed`; required context for the branch
- **Voiding** — `voided` a prior statement; no result, no context

Pick a pattern from the dropdown. The **slot map** updates to show which
slots that pattern requires (green badges), allows (yellow), or forbids
(red). The **live JSON** panel re-renders to match — fields the pattern
forbids vanish from the JSON entirely.

Fill in the actor, parent activity, score, duration, and completion/success
toggles. The validation badge turns green when the statement satisfies the
pattern's required-slot rules.

## Lesson Plan

**Suggested length:** 10–15 minutes.

1. **Compare patterns side by side (3 min).** Cycle through all five
   patterns watching the slot map. Note that `actor`, `verb`, and
   `object` are required for *every* pattern — those are xAPI's own
   requirements. The patterns differ in what they say about `result`
   and `context`.
2. **Fill a Quiz-Submission (3 min).** Drag the score slider; toggle
   completion. Watch the JSON update. Set both completion and success to
   "unset" — note that the validation badge flips to "Missing Required
   Slot" because the pattern requires a result.
3. **Fill a Voiding statement (2 min).** Switch to the Voiding pattern.
   Note that `result` and `context` are forbidden — and they vanish from
   the JSON. Voiding intentionally has the simplest possible shape.
4. **Discussion (3 min).** Why have patterns at all? What goes wrong if
   one team emits a quiz-completion event with a result and another team
   emits the same event without one?
5. **Design exercise (3 min).** Sketch a sixth pattern for "video
   playback events" with required `context` (the chapter), optional
   `result` (timestamp reached), and forbidden... what? Discuss.

## Try This

- Switch to "Page-Read" and try to put a score in. The pattern says
  result is forbidden — note that the score slider is still functional
  but the result section disappears from the JSON.
- Set the actor field to empty. The validation badge should flip — actor
  is xAPI-required for every pattern.
- Compare a MicroSim-Interaction statement to an Adaptive-Branching one.
  Both require `context` — what would distinguish them in practice?

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)

## References

- xAPI 2.0 Specification, §4.1 *Statement Properties*
- xAPI Profile Server documentation on statement-template patterns
