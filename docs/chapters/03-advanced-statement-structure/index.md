---
title: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments
description: Goes deeper into the optional parts of an xAPI statement — result fields, context activities, voiding semantics, sub-statements, attachments, extensions, statement references, and reusable patterns — that turn a basic statement into a precise, queryable record of what really happened.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 11:25:11
version: 0.07
---

# Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments

## Summary

Covers result fields, context activities, voiding semantics, sub-statements, attachments, extensions, and reusable statement patterns. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Statement Voiding
2. Context Activities
3. Grouping Context Activity
4. Parent Context Activity
5. Category Context Activity
6. Other Context Activity
7. Result Score
8. Result Success
9. Result Completion
10. Result Duration
11. Result Response
12. Extensions (xAPI)
13. Attachment Object
14. Sub-Statement
15. Statement References
16. xAPI Statement Patterns

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)

---

!!! mascot-welcome "Welcome to the Deep End of the Statement"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus diving in">
    Last chapter we built a basic, conformant statement and called it good. This chapter is where we take that same statement and ask harder questions: How did the learner do, exactly? Where in the course did this happen? What if the activity provider sent the wrong statement and needs a do-over? What if a single learning event is actually a story made of several events? Every interaction tells a story — and now we'll learn how to tell complicated ones.

## Your New Superpower

By the end of this chapter, you'll be able to **express precise pedagogical meaning in a single statement, and recover gracefully when something is wrong**. Most teams spend their first three months in xAPI emitting flat statements that look correct and convey almost no useful analytics. The difference between an LRS full of "Lin experienced the chapter" and an LRS full of "Lin scored 0.92 on the quadratics quiz, which is part of Algebra 1, which is part of the 9th-grade math sequence, after a 47-second attempt, having previously failed once" is everything you're about to learn.

You'll also pick up the rarer skill of **fixing past mistakes without erasing them** — a property that makes xAPI auditable in ways most analytics pipelines aren't. We don't delete bad statements. We void them, on the record. The void is itself a statement. The trail stays intact.

Everything in this chapter slots into the optional parts of the statement we already built: `result`, `context`, `attachments`, plus the special-case statement shapes that reference or replace other statements. The required core (`actor`, `verb`, `object`) does not change. We're decorating the cake, not rebuilding the oven.

## Result, in Detail

Chapter 2 introduced `result` as the field that answers "How did it go?" but didn't crack it open. The `result` object has five standard sub-fields, each addressing a different facet of how an activity ended. Before we look at a worked example, let's define each one in plain language.

- **`score`** — a numeric performance measure. xAPI lets you express it as a `scaled` value (between -1 and 1, normalized), a `raw` value (the actual points earned), and a `min`/`max` range. The scaled form is what dashboards usually graph because it doesn't depend on the test's point structure.
- **`success`** — a boolean that answers "did the learner pass the bar set by the activity?" This is independent of completion. A learner can complete a quiz and not pass it.
- **`completion`** — a boolean that answers "did the learner finish the activity?" Independent of success. A learner can fail the quiz but still finish it.
- **`duration`** — how long the activity took, encoded as an ISO 8601 duration string like `PT47S` (47 seconds) or `PT3M12S` (3 minutes, 12 seconds). The `PT` prefix means "period of time" — yes, really.
- **`response`** — a free-form string the learner produced. Useful for fill-in-the-blank, short answers, code submissions, or any artifact you want preserved verbatim alongside the score.

Notice that `success` and `completion` are deliberately separate booleans. The xAPI authors learned from SCORM, where conflating these two led to years of confused gradebooks. Treating them as orthogonal axes — completion × success — produces four meaningful states:

| Completion | Success | Meaning                                                       |
|------------|---------|---------------------------------------------------------------|
| `true`     | `true`  | Finished and passed                                            |
| `true`     | `false` | Finished and failed                                            |
| `false`    | `true`  | Bailed early but met the bar (rare; usually a mastery exit)    |
| `false`    | `false` | Bailed early without meeting the bar                           |

Here's how all five sub-fields fit together in a real result block. Lin attempted a 4-question quiz on factoring quadratics, spent 47 seconds, got 3 of 4 right, and submitted "x = -3, x = 5" as their final response:

```json
"result": {
  "score": {
    "scaled": 0.75,
    "raw": 3,
    "min": 0,
    "max": 4
  },
  "success": true,
  "completion": true,
  "duration": "PT47S",
  "response": "x = -3, x = 5"
}
```

A few worked details to internalize. The `scaled` value equals `raw / max` only when `min` is 0; otherwise the spec normalizes against the full range, so a raw of 3 in a -2 to 4 range gives a `scaled` of \( (3 - (-2)) / (4 - (-2)) \), or roughly 0.83. The duration must be a valid ISO 8601 duration; `PT47S` parses, but `47s` does not. And the LRS does not validate that the response *makes sense* for the activity — that semantic check is your job.

#### Diagram: Result Field Composition Explorer

<details markdown="1">
<summary>Result Field Composition Explorer</summary>
Type: micro-sim
**sim-id:** result-field-composition-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Given a learner scenario (e.g., "passed the quiz with 85%"), the student selects appropriate values for each `result` sub-field and sees the rendered JSON update in real time, reinforcing the orthogonality of `completion` and `success`.

**Layout:** 2/3 + 1/3 panel split with responsive design that re-flows on window resize. Left panel: input controls. Right panel: live-rendered JSON `result` object with syntax highlighting.

**Controls (left panel):**

- Slider: Raw score (0 – 10, default 7)
- Slider: Min score (-5 – 0, default 0)
- Slider: Max score (5 – 20, default 10)
- Computed display: Scaled score (auto-updates from raw/min/max)
- Toggle: success (true / false / unset)
- Toggle: completion (true / false / unset)
- Slider: duration in seconds (0 – 600, default 47)
- Text input: response (default `x = -3, x = 5`)
- Preset buttons: "Passed Cleanly", "Failed but Finished", "Bailed Early", "Mastery Exit"

**Visual elements:**

- Live JSON output with monospace font, color-coded keys/values
- A 2×2 grid showing the four completion×success states, with the current state highlighted
- Duration shown both as ISO 8601 string and human-readable form

**Interaction:** Every control change recomputes the JSON immediately and redraws the 2×2 grid. Preset buttons populate all controls at once for quick exploration.

**Default canvas:** 900×500px with media queries for narrower viewports.

Implementation: p5.js with a JSON renderer; no external dependencies beyond the p5.js CDN.
</details>

## Context, in Detail

Where `result` answers "how did it go?", `context` answers "under what circumstances?". Chapter 2 introduced `context` and mentioned `platform`, `language`, and `contextActivities`. We'll spend most of this section on `contextActivities` because it's the structurally interesting part — and the source of most cross-platform analytics confusion when teams get it wrong.

A **context activity** is an activity that's *associated with* the statement's main object but is not the main object itself. The xAPI spec sorts these associated activities into four named buckets: `parent`, `grouping`, `category`, and `other`. Each bucket has a clear semantic meaning and each is an array, so a single statement can declare multiple parents, multiple groupings, and so on. Before we draw the relationship diagram, let's define each bucket in prose.

- **Parent context activity** — the activity that *directly contains* this object as a logical component. If the object is "Quiz on Quadratics," the parent might be "Algebra 1, Unit 5." The parent is the immediately enclosing scope.
- **Grouping context activity** — a broader collection the object belongs to. Where parent is the parent in a tree, grouping is membership in a set. The same quiz might be `grouping`-ed under "All formative assessments in Algebra 1" — a horizontal collection rather than a containing scope.
- **Category context activity** — declares conformance to a *profile* or *vocabulary*. This is how implementations advertise that they follow, say, the cmi5 profile or a custom vocabulary profile. Categories are the xAPI equivalent of "I'm using the 2026 ACME math vocabulary."
- **Other context activity** — anything related but doesn't fit the three above. Use sparingly; if you find yourself relying on `other`, ask whether you should design a custom category instead.

These buckets matter because LRS query filters operate on them. Your dashboard team will eventually want to ask "show me every statement whose parent is `algebra-1-unit-5`," and the answer will be fast because the LRS indexes these buckets. Putting an activity in the wrong bucket isn't a syntax error — it's a slow-creeping analytics bug that won't surface until quarter three.

#### Diagram: Context Activity Buckets

<iframe src="../../sims/context-activity-buckets/main.html" height="462" width="100%" scrolling="no"></iframe>

<details markdown="1">
<summary>Context Activity Buckets</summary>
Type: clickable-mermaid
**sim-id:** context-activity-buckets<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify the role of each context activity bucket and explain how a single statement's main object can be related to multiple activities through different bucket relationships.

**Diagram type:** Mermaid flowchart, LR direction, with click handlers on every node opening an infobox containing the term's definition.

**Structure:**

- Center node: "Statement Object: Quadratics Quiz"
- Four labeled fan-outs to:
    - Parent: "Algebra 1, Unit 5" (edge label `directly contains`)
    - Grouping: "Formative Assessments — Q3 2026" (edge label `is a member of`)
    - Category: "ACME Math Profile v2" (edge label `conforms to`)
    - Other: "Pre-class warm-up flow" (edge label `associated with`)

**Mermaid config (project standard):**

```js
flowchart: {
    useMaxWidth: true, htmlLabels: true, curve: 'basis',
    nodeSpacing: 12, rankSpacing: 60, padding: 4
}
```

**Click behavior:** Each node opens a side-panel infobox showing the term, its definition (drawn from the project glossary when available), and a one-line example. The center node's infobox explains the statement's main object.

**Default canvas:** 2/3 width for the diagram, 1/3 for the side panel. Responsive — re-flows to stacked layout below 700px.

Implementation: Mermaid with `securityLevel: 'loose'` to enable click handlers, plus a small JavaScript layer that renders the side panel from a `data.json` keyed by node id.
</details>

Here's a `context` block that exercises three of the four buckets — every textbook quiz statement should look something like this:

```json
"context": {
  "platform": "Intelligent Algebra Textbook",
  "language": "en-US",
  "contextActivities": {
    "parent": [{
      "id": "http://textbook.example.org/algebra-1/unit-5",
      "objectType": "Activity"
    }],
    "grouping": [{
      "id": "http://textbook.example.org/assessments/formative-q3-2026",
      "objectType": "Activity"
    }],
    "category": [{
      "id": "http://textbook.example.org/profiles/acme-math-v2",
      "objectType": "Activity",
      "definition": {
        "type": "http://adlnet.gov/expapi/activities/profile"
      }
    }]
  }
}
```

Notice the `category` entry has a `definition.type` of `profile` — that type IRI is the convention for declaring that the category bucket is signaling profile conformance, not just a related activity. Different bucket, different convention.

!!! mascot-tip "Xavi's Tip — Pick a Bucket and Stick With It"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Xavi giving a tip">
    Inconsistent bucket choice across a textbook is the number-one thing that makes cross-platform analytics painful later. Decide early: chapters are `parent`, the textbook itself is the deepest `parent`, vocabulary profiles are `category`. Write it down. Audit it. Future-you will send present-you a thank-you note.

## Extensions — The Sanctioned Escape Hatch

xAPI gives you a sanctioned way to attach arbitrary data to a statement: **extensions**. An extension is a key-value pair where the key is an IRI you own and the value is any JSON. Extensions can appear inside `result`, inside `context`, or inside an activity's `definition`. They exist because no fixed schema can predict every kind of data a learning experience might want to record, and the alternative — overloading existing fields — is worse.

Before we use one, the rules. The key must be a full IRI in a namespace you control. `temperature` is not a valid extension key. `https://textbook.example.org/extensions/scratchpad-keystrokes` is. The value can be any JSON — string, number, object, array, even a deeply nested structure — but the LRS will treat the whole thing as opaque. It will store it, return it on query, and not interpret it.

Here's a `result` block with an extension that records the keystroke trail a learner produced inside a code-editor MicroSim. The `keystrokes` array is your private payload; the LRS round-trips it without judgment:

```json
"result": {
  "completion": true,
  "success": true,
  "score": { "scaled": 1.0 },
  "extensions": {
    "https://textbook.example.org/extensions/v1/code-editor-trace": {
      "keystrokes": [
        {"t": 0.00, "key": "f"},
        {"t": 0.12, "key": "u"},
        {"t": 0.24, "key": "n"}
      ],
      "errors-before-success": 2,
      "language": "python"
    }
  }
}
```

When designing extensions, two pieces of advice from teams who have lived through five years of an xAPI deployment. First, version your namespace from day one — `extensions/v1/code-editor-trace` not `extensions/code-editor-trace`. The day you need to change the schema, you'll thank yourself. Second, document every extension key in a single place inside your codebase so future maintainers can find them. Extensions buried in twenty different statement-builder functions become orphan data within months.

## Attachments — When You Need Real Bytes

Sometimes a learning experience produces an artifact that doesn't compress nicely into JSON: an essay PDF, a screenshot of a final design, a recorded audio answer. The **attachment object** is xAPI's mechanism for shipping that artifact alongside the statement. An attachment isn't a URL pointing at a file somewhere — it's an actual binary blob delivered as part of a multipart HTTP POST, with a metadata header describing it.

Attachments are powerful and *structurally annoying*. Most LRS clients use `application/json` POSTs for plain statements; the moment you add an attachment, the request becomes `multipart/mixed`, the parser needs a boundary, and many off-the-shelf HTTP libraries get fussy. Save attachments for cases where the artifact genuinely needs to live with the statement and can't reasonably live behind a URL. Here's the metadata block that describes an attached PDF essay:

```json
"attachments": [{
  "usageType": "http://adlnet.gov/expapi/attachments/signature",
  "display": { "en-US": "Final essay submission" },
  "description": { "en-US": "PDF of the learner's final essay, signed digitally." },
  "contentType": "application/pdf",
  "length": 84231,
  "sha2": "672fa5fa658017f1b72d65036f13379c6ab05d4ab3b6664908d8acf0b6a0c634"
}]
```

The `sha2` field is what links the metadata to the actual binary. The binary is shipped in a separate part of the multipart POST, identified by the same SHA-2 hash. The LRS verifies the hash on receipt; if the bytes don't match the hash, the LRS rejects the whole statement.

!!! mascot-warning "Common Pitfall — Attachments and Privacy"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Xavi raising a tentacle in caution">
    Attachments often contain identifiable learner work — handwriting, voice, faces in screenshots. They flow into the same LRS as the rest of your statements but typically aren't covered by the same retention controls unless you've built that explicitly. Decide your attachment policy *before* you start collecting them, not after.

## Statement References — Pointing at Other Statements

A **statement reference** is a special kind of statement object that points to another statement by its UUID. Where a normal statement's `object` is an activity (like a quiz), a statement-reference statement's object *is another statement*. This is how xAPI expresses statement-about-statements relationships — the most important of which is voiding (next section), but there are other uses too: marking a statement as graded, marking a statement as appealed, marking a statement as the canonical one of three near-duplicates.

The shape is simple. The `objectType` is `StatementRef` and the only required field is the target statement's `id`. Here a teacher records a `graded` statement that points at Lin's earlier quiz attempt by UUID:

```json
{
  "actor": { "mbox": "mailto:teacher@example.edu" },
  "verb": {
    "id": "http://textbook.example.org/verbs/graded",
    "display": { "en-US": "graded" }
  },
  "object": {
    "objectType": "StatementRef",
    "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0"
  },
  "result": { "score": { "raw": 4 } }
}
```

The original is not modified — statements are immutable in a conformant LRS. The `graded` statement is a new record that *talks about* the original.

## Voiding — Cancellation Without Deletion

A conformant LRS never deletes a statement. If a statement was sent in error — wrong learner, wrong score, wrong activity — the way to retract it is to **void** it. Voiding is implemented as a statement reference with a special verb: `http://adlnet.gov/expapi/verbs/voided`. The voiding statement points at the bad statement's UUID and says, in effect, "this previous statement should no longer be considered."

The original statement is still there. It still has its UUID. It still appears if you query for it directly. But it will not be returned in a normal `/statements` query unless you explicitly ask for voided statements (`voided=true` filter). Voiding is non-destructive cancellation — the audit trail stays intact, but the analytics layer behaves as if the statement isn't there.

Here's a voiding statement that retracts Lin's earlier quiz statement, perhaps because the activity provider sent the wrong score:

```json
{
  "actor": {
    "objectType": "Agent",
    "account": {
      "homePage": "https://lrs.example.org",
      "name": "intelligent-algebra-client"
    }
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/voided",
    "display": { "en-US": "voided" }
  },
  "object": {
    "objectType": "StatementRef",
    "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0"
  }
}
```

Voiding has subtle rules. Only the *original* `authority` of a statement (or an LRS admin acting on its behalf) should void it — anyone voiding statements they didn't author is a security smell. Voided statements cannot themselves be voided ("un-voiding" is not a thing in xAPI; if you need to reinstate a voided statement, you re-emit it as a new statement with a new UUID). And the LRS may or may not let an Activity Provider modify the original — that depends on whether the LRS implements mutable or immutable storage. In an immutable LRS, voiding is the *only* path to retraction.

#### Diagram: Voiding Lifecycle Flow

<details markdown="1">
<summary>Voiding Lifecycle Flow</summary>
Type: workflow-diagram
**sim-id:** voiding-lifecycle-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the lifecycle of a statement that gets voided, identifying which records persist in the LRS and which are filtered from default queries.

**Diagram type:** Mermaid flowchart (LR direction) representing the temporal sequence as a left-to-right pipeline. Click handlers open an infobox for every node.

**Nodes (left to right):**

1. `AP emits original statement` (uuid=fd41…)
2. `LRS stores original`
3. `Default /statements query — original visible`
4. `AP discovers error`
5. `AP emits voiding statement` (StatementRef → fd41…, verb=voided)
6. `LRS stores voiding statement and flags fd41…`
7. `Default /statements query — original filtered out, voiding statement visible`
8. `voided=true query — both visible`

**Edges:** Solid arrows for the main flow; a dashed arrow loops from node 7 back to node 8 to indicate that operators can still inspect voided records on demand.

**Mermaid config:** project standard (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`, `useMaxWidth: true`, `securityLevel: 'loose'`).

**Click behavior:** Each node opens a side-panel infobox keyed off `data.json`. Glossary terms (`StatementRef`, `voided`, `authority`, `audit trail`) link to their full glossary definitions.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel. The side panel is a vanilla JS component that swaps content based on the clicked node id.
</details>

## Sub-Statements — Statements Inside Statements

A **sub-statement** is a statement that appears as the `object` of another statement. Where a statement reference points at an existing statement by UUID, a sub-statement *embeds* a full statement object inline. Sub-statements are how xAPI expresses statements that describe *what someone said about a learning event*, rather than the learning event itself.

This is one of the harder parts of xAPI to internalize. Read it twice and don't worry if it doesn't click immediately.

Concretely: Lin attempts a quiz. That's one statement, with Lin as the actor. A teacher then watches Lin attempt the quiz and observes "Lin showed strong reasoning skills during the attempt." The teacher's observation is its own statement — actor: teacher, verb: observed — but the *object* of the teacher's observation is the entire act of Lin attempting the quiz. That entire act, including its actor and verb and object, is embedded as a sub-statement.

```json
{
  "actor": { "mbox": "mailto:teacher@example.edu" },
  "verb": {
    "id": "http://textbook.example.org/verbs/observed",
    "display": { "en-US": "observed" }
  },
  "object": {
    "objectType": "SubStatement",
    "actor": { "mbox": "mailto:lin@example.edu" },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/attempted",
      "display": { "en-US": "attempted" }
    },
    "object": {
      "objectType": "Activity",
      "id": "http://textbook.example.org/chapters/quadratics/quiz"
    }
  },
  "result": {
    "response": "Strong algebraic reasoning. Tried symbolic factoring before guess-and-check."
  }
}
```

Sub-statements have two structural rules. They cannot themselves contain sub-statements (no recursion — a sub-statement object's `object` must be a regular activity or a statement reference). And they cannot have an `id`, `stored`, `version`, or `authority` field — those metadata fields belong only to the outer statement, because the sub-statement is *embedded* and not independently stored as a record. It only exists as part of its parent.

When to use a sub-statement vs. a statement reference is the question that trips up most teams. After the prose above, this comparison should now read as a summary, not an introduction:

| You want to say...                                              | Use                |
|-----------------------------------------------------------------|--------------------|
| "X did this, and here's exactly what they did"                  | Sub-statement      |
| "X did this thing that I already wrote down separately"         | Statement reference|
| "I'm grading / annotating / appealing a previous record"        | Statement reference|
| "I observed / planned / predicted a hypothetical event"         | Sub-statement      |

!!! mascot-encourage "This Part Is Tricky — That's Normal"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Xavi encouraging the reader">
    Sub-statements vs. statement references is the part of xAPI that needs the most rereads. If your first instinct after this section is "I think I get it, but I'd want to look at three real examples before betting money on which one to use," that's the right instinct. Bookmark this section — you'll come back.

## Composing the Pieces — xAPI Statement Patterns

An **xAPI statement pattern** is a reusable template for emitting statements that describe a recurring kind of learning event. Patterns are not part of the formal spec — they're a community practice. Every mature xAPI implementation eventually develops a small library of patterns that the team agrees to use whenever a particular event occurs. This is how teams achieve cross-platform analytics consistency without manually reviewing every emit site.

A pattern combines decisions about: which verb to use, which activity type, which context activity buckets to populate, which result fields are mandatory, which extensions are allowed, and which optional fields the team agrees to always include even though the spec doesn't require them. Once written down, a pattern lives in your codebase as a function (often a TypeScript builder) that other code calls. The pattern enforces consistency by being the only path to a particular kind of statement.

Five patterns that show up in nearly every intelligent textbook deployment:

1. **Page-Read pattern** — verb `experienced`, activity type `chapter` or `page`, parent context activity = textbook root, no result.
2. **Quiz-Submission pattern** — verb `attempted`, then `passed`/`failed`, with `result` containing `score`, `success`, `completion`, `duration`, and `response`. Parent = chapter, grouping = assessment cohort.
3. **MicroSim-Interaction pattern** — verb `interacted`, custom activity type, result extension for the interaction trace, parent = chapter.
4. **Adaptive-Branching pattern** — verb `progressed`, with a context extension for the branch decision, parent = adaptive activity root.
5. **Voiding pattern** — verb `voided`, object = `StatementRef`, no result, no context activities. Strict by design.

The payoff of writing patterns down is that your dashboard team gets to write *one* query per pattern, not one query per emit site. That's the leap from "we're emitting xAPI" to "we have working learning analytics."

#### Diagram: Statement Pattern Composer

<details markdown="1">
<summary>Statement Pattern Composer</summary>
Type: micro-sim
**sim-id:** statement-pattern-composer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Creating):** Compose a complete xAPI statement by selecting a pattern, filling in pattern-specific slots, and observing the rendered statement to learn how patterns enforce consistency across emit sites.

**Layout:** 2/3 (left) form + 1/3 (right) live JSON preview, responsive, re-flowing on resize.

**Controls:**

- Dropdown: pattern type (Page-Read, Quiz-Submission, MicroSim-Interaction, Adaptive-Branching, Voiding)
- Dynamic form fields that change based on the selected pattern (e.g., Quiz-Submission shows score sliders, success toggle, duration; Page-Read shows only chapter selector)
- Static fields visible for all patterns: actor (text), parent activity (dropdown of fake textbook chapters)

**Visual elements:**

- Live JSON preview of the resulting statement, syntax-highlighted
- A "Pattern Slot Map" that highlights which fields the pattern enforces, which are optional, and which are forbidden — color-coded green / yellow / red
- Validation badge ("Pattern Valid" / "Missing Required Slot") that updates live

**Interaction:** Selecting a different pattern re-renders the form and the slot map. Filling in slots re-renders the JSON. Invalid combinations are flagged but not blocked — this is a learning tool, not a validator.

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the canvas drawing of the slot map; HTML form controls overlaid for accessible inputs. JSON preview rendered into a styled `<pre>` element.
</details>

## What You Just Leveled Up

Walk through this checklist. If any of these are unfamiliar, that's where to reread before moving to Chapter 4.

- You can populate a `result` object that distinguishes *completion* from *success*, formats `duration` as ISO 8601, and uses `scaled` correctly when `min` is non-zero.
- You can slot context activities into the right bucket (`parent`, `grouping`, `category`, `other`) and explain why each bucket exists.
- You can attach arbitrary structured data with `extensions`, using IRIs you own and versioning your namespace.
- You can ship a binary artifact with an `attachment` and you know why you'll usually wish you hadn't.
- You can void a bad statement without deleting it, preserving the audit trail.
- You can choose between a statement reference (point at an existing statement) and a sub-statement (embed a hypothetical or observed statement) for the right reasons.
- You can articulate why your team needs a small library of statement patterns and what would be in it.

That's a lot of vocabulary in one chapter. The good news: you'll spend the rest of the book using these tools, not learning new shapes of the same statement. Chapter 4 turns to the verbs themselves — what makes a good verb vocabulary, how to design one for your textbook, and how to avoid the classic verb-design mistakes that turn a sharp analytics setup into a fuzzy one.

!!! mascot-celebration "Eight Tentacles Up"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating with all eight tentacles">
    You just took the longest, densest section of the xAPI spec and turned it into working knowledge. From here, every chapter builds *outward* — verbs, identities, LRS architecture, instrumentation, networks. The hard schema work is behind you. The data never lies — but the schema might, and now you know how to make yours tell the truth.
