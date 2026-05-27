---
title: xAPI Statement Builder MicroSim
description: "Given an English description of a learning event, the reader can construct a conformant xAPI 1.0.3 statement by selecting an actor, verb, and object, and optionally adding result, context, and metadata fields. Reinforces field-level understanding through hands-on assembly. Bloom level: Apply (L3). Bloom verb: construct, implement."
status: approved
library: p5.js
bloom_level: "TBD"
---

# xAPI Statement Builder MicroSim
<iframe src="main.html" width="100%" height="902"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

Given an English description of a learning event, the reader can construct a conformant xAPI 1.0.3 statement by selecting an actor, verb, and object, and optionally adding result, context, and metadata fields. Reinforces field-level understanding through hands-on assembly. Bloom level: Apply (L3). Bloom verb: construct, implement.

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** p5.js

## Specification

The full specification below is extracted from
[Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md).

```text
Type: microsim
**sim-id:** xapi-statement-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective: Given an English description of a learning event, the reader can construct a conformant xAPI 1.0.3 statement by selecting an actor, verb, and object, and optionally adding result, context, and metadata fields. Reinforces field-level understanding through hands-on assembly. Bloom level: Apply (L3). Bloom verb: construct, implement.

Instructional Rationale: The Apply level requires the learner to use field knowledge in a new situation. A passive read-through of the spec produces recognition; building a statement and seeing live conformance feedback produces application. Step-by-step assembly with running JSON output lets the learner see, concretely, how each field they add changes the resulting object — without ever leaving the textbook page.

Canvas layout (responsive, default 800px wide × 600px tall):
- Left column (45%): control panel with grouped sections — Actor (IFI selector + value input), Verb (vocabulary dropdown + free-IRI input), Object (type selector + IRI + name + activity-type), Result (collapsible: success, completion, score), Context (collapsible: platform, language, parent activity), Metadata (id auto-generated with regenerate button, timestamp auto-now with override).
- Right column (55%): live JSON preview, monospace font, syntax-highlighted, with red squiggle underlines under any field that fails conformance.
- Bottom strip: "Validate against xAPI 1.0.3" button, "Reset" button, "Copy JSON" button. A status bar shows pass/fail with a count of conformance issues.

Required interactivity:
- Every control updates the JSON preview in real time as the user types or selects.
- The "Validate" button runs a conformance check and reports specific spec violations with line-level highlighting.
- The "Copy JSON" button copies the current statement to the clipboard.
- The "Regenerate UUID" button mints a new Version 4 UUID for the `id` field.
- The "Set timestamp to now" button sets `timestamp` to the current ISO 8601 time.
- Hovering a field label in the control panel shows a one-line tooltip describing what that field is for.
- Clicking the "Copy JSON" button MUST emit an xAPI `interacted` statement to the chapter's LRS.

Default state: actor IFI = `mbox`, IFI value = `mailto:learner@example.edu`; verb = `experienced`; object = the current chapter's IRI; result and context collapsed; id auto-generated; timestamp = now.

Conformance checks performed:
- Actor has exactly one IFI
- Verb `id` is a valid IRI
- Object `objectType` matches `id` shape (Agent vs. Activity vs. SubStatement)
- `result.score.scaled` is between -1.0 and 1.0 (if present)
- `id` is a valid UUID (if present)
- `timestamp` is a valid ISO 8601 string (if present)

Implementation: p5.js with `createSelect`, `createInput`, `createCheckbox`, `createButton` builtin controls. JSON preview rendered into a styled `<pre>` element overlaid on the canvas. UUID generation via `crypto.randomUUID()`. Conformance rules embedded as a small ruleset object. Responsive — `updateCanvasSize()` called first thing in `setup()`.
```

## Related Resources

- [Chapter 2: The xAPI Statement Model — Actor, Verb, Object, Result, and Context](../../chapters/02-statement-model/index.md)
