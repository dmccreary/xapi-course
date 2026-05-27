---
title: Result Field Composition Explorer
description: "Interactive p5.js MicroSim that lets learners compose an xAPI `result` object field-by-field and see the JSON, scaled score, ISO 8601 duration, and completion×success state update in real time."
status: approved
library: p5.js
bloom_level: Apply
image: /sims/result-field-composition-explorer/result-field-composition-explorer.png
og:image: /sims/result-field-composition-explorer/result-field-composition-explorer.png
twitter:image: /sims/result-field-composition-explorer/result-field-composition-explorer.png
social:
  cards: false
---

# Result Field Composition Explorer

<iframe src="main.html" height="577px" width="100%" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/result-field-composition-explorer/main.html"
        height="577px" width="100%" scrolling="no"></iframe>
```

## Learning Objective

Given a learner scenario (e.g., "passed the quiz with 85%"), the student
selects appropriate values for each `result` sub-field and sees the rendered
JSON update in real time, reinforcing the orthogonality of `completion` and
`success`.

- **Bloom Level:** Apply
- **Bloom Verb:** Apply / Select
- **Library:** p5.js

## Description

The `result` object is one of the most expressive parts of an xAPI statement,
and it is also where new authors most often get tangled up. The two most
commonly confused fields, `completion` and `success`, are *independent* — each
can be `true`, `false`, or simply not set. That gives four meaningful states,
not two.

This MicroSim lets the learner compose a result object one field at a time:

- **Score sliders** (raw, min, max) — the scaled score is computed live as
  `(raw - min) / (max - min)` and clamped to the xAPI range.
- **Toggle buttons** for `success` and `completion` cycle through
  `true → false → unset`. The 2×2 grid on the left highlights the current
  combination so the learner can *see* that the two fields vary independently.
- **Duration slider** — shown both as an ISO 8601 string (`PT4M5S`) and a
  human-readable form (`4m 5s`).
- **Response field** — accepts free-form text, mirrored into the JSON.
- **Preset buttons** populate every control at once for four common
  scenarios: *Passed Cleanly*, *Failed but Finished*, *Bailed Early*,
  *Mastery Exit*.

Every change immediately re-renders the right-hand JSON panel with
syntax-highlighted keys, strings, numbers, and booleans, so the learner sees
exactly what would land in the LRS.

## Lesson Plan

**Suggested length:** 10–15 minutes of guided exploration.

1. **Warm-up (1 min).** Load the sim. Note the default state — `success` and
   `completion` both `unset`. Ask: *Why are no cells highlighted in the 2×2
   grid?*
2. **The big idea: orthogonality (3 min).** Click the "Failed but Finished"
   preset. Both `completion: true` and `success: false` are valid xAPI —
   the learner finished the quiz but did not pass. Have students explain in
   one sentence why this is not a contradiction.
3. **Score scaling (3 min).** Set raw=7, min=0, max=10. Note `scaled = 0.70`.
   Now change min to -5. Predict the new scaled value before releasing the
   slider, then confirm. (Answer: `(7 - (-5)) / (10 - (-5)) = 0.80`.)
4. **Duration formats (2 min).** Slide duration from 47 to 90 to 245 to 410.
   Watch both representations update. Ask: *Why does xAPI prefer the ISO 8601
   form for storage?*
5. **Wrap-up challenge (3–5 min).** Without using the presets, build a
   result object for: "The student watched 80% of the video and the system
   has no opinion on whether they 'passed' it." Discuss why
   `success: unset, completion: false` is the correct shape.

## Try This

- Set `completion = true, success = unset`. What real-world learner scenario
  fits? *(A learner finished a tutorial that doesn't have a pass/fail
  outcome.)*
- Set `completion = false, success = true`. Does this combination make
  pedagogical sense? When? *(Rare — perhaps a learner mastered the material
  early and bailed out before the formal end of the activity.)*
- Drag the raw score above the max. The scaled score clamps at 1.00. Why
  does xAPI require this clamp?

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)

## References

- xAPI 2.0 Specification, §4.1.4.2 *Result Object*
- ISO 8601 duration format
