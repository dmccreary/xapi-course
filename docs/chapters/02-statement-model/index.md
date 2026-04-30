---
title: The xAPI Statement Model — Actor, Verb, Object, Result, and Context
description: Walks through the anatomy of an xAPI statement field-by-field, the metadata that makes statements queryable, and the three ecosystem roles (Activity Provider, Learning Record Provider, Activity Consumer) that move statements through the world.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 08:19:27
version: 0.08
---

# The xAPI Statement Model: Actor, Verb, Object, Result, and Context

## Summary

Walks through the core anatomy of an xAPI statement, the canonical fields, and the roles of Activity Provider, Learning Record Provider, and Activity Consumer. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. xAPI Statement Model
2. Actor Component
3. Verb Component
4. Object Component
5. Result Component
6. Context Component
7. Statement ID (UUID)
8. Timestamp Field
9. Stored Timestamp
10. Authority Field
11. Statement Version Field
12. xAPI 1.0.3 Specification
13. Activity Provider (AP)
14. Learning Record Provider (LRP)
15. Activity Consumer
16. xAPI Conformance

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../01-foundations-and-standards/index.md)

---

!!! mascot-welcome "Welcome to the Statement Model!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus waving hello">
    Last chapter we said xAPI is built around a sentence: Actor, Verb, Object. This chapter is where that sentence grows up. We're going to crack open a real statement, name every field inside it, and meet the three job titles in the xAPI ecosystem who pass these statements around. By the time we're done, you'll be able to read a raw xAPI statement the way a sommelier reads a wine label.

## Your New Superpower

By the end of this chapter, you'll be able to do something that surprisingly few developers can do confidently on day one: **read any well-formed xAPI statement and explain, field by field, what every line means and why it's there**. That's not just an academic skill. The moment you can fluently read a statement, you can debug a statement, validate a statement, transform a statement, and — eventually — generate hundreds of thousands of synthetic ones for load testing without inventing nonsense data. Statement fluency is the foundation skill for everything else in this book.

We'll work bottom-up. First, the irreducible core: the three required fields. Then the optional-but-powerful payload fields (`result`, `context`). Then the metadata fields the LRS uses to keep your statements honest (`id`, `timestamp`, `stored`, `authority`, `version`). And finally, the three human-and-system roles that turn a statement from a JSON object on a textbook page into a queryable record in a permanent ledger.

## What Counts as a Statement

A **statement** is the fundamental unit of data in xAPI. It is a JSON object that describes one learning event — one thing that one actor did, one time, to one object. The xAPI 1.0.3 specification (the canonical version this book targets) defines exactly which fields are allowed inside a statement, which are required, and what their data types must be. Anything that conforms to that schema is a statement; anything that doesn't, isn't. There is no "kind of a statement." This binary character is one of the standard's quiet superpowers.

Before we pull a real one apart, let's see the whole thing once. Below is a complete, conformant xAPI 1.0.3 statement. Everything in this chapter will be a deeper explanation of one of these lines:

```json
{
  "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
  "actor": {
    "objectType": "Agent",
    "name": "Lin Park",
    "mbox": "mailto:lin@example.edu"
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/passed",
    "display": { "en-US": "passed" }
  },
  "object": {
    "objectType": "Activity",
    "id": "http://textbook.example.org/chapters/quadratics/quiz",
    "definition": {
      "name": { "en-US": "Quadratics Chapter Quiz" },
      "type": "http://adlnet.gov/expapi/activities/assessment"
    }
  },
  "result": {
    "success": true,
    "completion": true,
    "score": { "scaled": 0.92 }
  },
  "context": {
    "platform": "Intelligent Algebra Textbook",
    "language": "en-US",
    "contextActivities": {
      "parent": [{
        "id": "http://textbook.example.org/courses/algebra-1",
        "objectType": "Activity"
      }]
    }
  },
  "timestamp": "2026-04-15T18:32:14.512Z",
  "stored": "2026-04-15T18:32:15.001Z",
  "authority": {
    "objectType": "Agent",
    "account": {
      "homePage": "https://lrs.example.org",
      "name": "intelligent-algebra-client"
    }
  },
  "version": "1.0.3"
}
```

Eleven top-level fields. Three are required (`actor`, `verb`, `object`); the rest are optional, generated by the LRS, or technically required-but-defaulted depending on which clause of the spec you read on which day. We'll walk every one. Before we look at the visual breakdown, here's the field roster as a quick reference:

| Field | Required? | Who sets it | What it answers |
|-------|-----------|-------------|-----------------|
| `actor` | Yes | Activity Provider | Who did it? |
| `verb` | Yes | Activity Provider | What did they do? |
| `object` | Yes | Activity Provider | To what? |
| `result` | No | Activity Provider | How did it go? |
| `context` | No | Activity Provider | Under what circumstances? |
| `timestamp` | No (defaulted) | Activity Provider | When did the learner experience it? |
| `stored` | Set by LRS | LRS | When did the LRS receive it? |
| `id` | No (LRS will mint one) | Either | Unique identifier for this record |
| `authority` | Set by LRS | LRS | Who vouches for this record? |
| `version` | Set by LRS | LRS | Which xAPI spec version stored it? |

Now the diagram view. Click any field to read its formal definition.

#### Diagram: xAPI Statement Anatomy

<details markdown="1">
<summary>Clickable anatomy of every field in an xAPI 1.0.3 statement</summary>
Type: diagram
**sim-id:** xapi-statement-anatomy<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Give the reader an interactive map of the eleven top-level fields of an xAPI 1.0.3 statement. Every node is clickable; clicking a node reveals an infobox containing the field's name, whether it is required, who sets it, the data type, and a one-paragraph plain-English definition pulled from the chapter glossary.

Bloom level: Understand (L2). Bloom verb: identify, explain.

Layout: Mermaid `flowchart TB` with a root node "xAPI Statement" at the top. Three required fields (`actor`, `verb`, `object`) branch immediately below in indigo fill. Two optional payload fields (`result`, `context`) branch as a second tier in teal fill. Five metadata fields (`id`, `timestamp`, `stored`, `authority`, `version`) form a third tier in lighter gray fill, grouped in a Mermaid `subgraph` labeled "Metadata".

Required interactivity:
- Every node MUST have a Mermaid `click` directive: `click <nodeId> call showFieldInfo("<field-name>")`.
- Clicking a node MUST open a side-panel infobox containing: field name, required status, data type, who sets the value, plain-English definition, and a sample value taken from the example statement in the chapter prose.
- Hovering a node MUST highlight the node and show a one-line tooltip with the field's plain-English definition.
- The infobox MUST emit an xAPI `interacted` statement when opened (foreshadowing how this textbook itself uses the standard it teaches).

ClassDef styling:
- `required` — fill #4338ca (indigo), white text, bold border
- `optional` — fill #0d9488 (teal), white text
- `metadata` — fill #e5e7eb (gray-200), dark text, dashed border

Sample infobox content (for `verb`):
"**verb** — Required. Object. Set by the Activity Provider. Identifies the action the actor performed. Must contain an IRI in the `id` field; the IRI should resolve to a published verb definition. Optional `display` map provides human-readable labels in one or more languages. Example: `{ id: 'http://adlnet.gov/expapi/verbs/passed', display: { 'en-US': 'passed' } }`."

Implementation: Mermaid `flowchart TB` with classDefs and `click` directives wired to a JavaScript `showFieldInfo(name)` function that reads from a JSON dictionary of field definitions and renders the infobox in a side panel. Responsive width via `<div style="width:100%">` wrapper.
</details>

## Actor — Who Did It

The **Actor component** identifies the agent that performed the action recorded in the statement. In xAPI, an actor is almost always one of three things: an individual learner (an `Agent`), a named group (a `Group`), or — occasionally — an automated process acting on behalf of a learner. The Actor field is required in every statement; a sentence with no subject is not a sentence.

Here is the catch that surprises new xAPI implementers: an actor is not identified by a database primary key. It is identified by an **Inverse Functional Identifier**, or **IFI** — a value that is globally unique on its own, with no central registry. xAPI defines exactly four IFI types, and an actor must use exactly one:

- **`mbox`** — a `mailto:` URI. Example: `"mailto:lin@example.edu"`. The most common.
- **`mbox_sha1sum`** — the SHA-1 hash of an `mbox` value. Use when you want pseudonymity but consistent identity.
- **`openid`** — an OpenID URI from an OpenID provider.
- **`account`** — a structured object with a `homePage` URL and a `name` string. Use when you have a learner ID inside a specific platform but no email.

We'll go deeper on identity in Chapter 5. For now, what you need to remember is that the Actor field carries enough information to recognize the same learner across two systems that have never spoken to each other before — provided they both use the same IFI shape for that learner.

!!! mascot-thinking "Why IFIs and not database IDs?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Xavi thinking">
    Database IDs are local. They mean "row 4172 in *my* `users` table." That's worthless to a different system. An IFI is global by construction — `mailto:lin@example.edu` means the same thing in your LRS, in mine, and in the LRS that gets stood up next year. xAPI's identity model assumes data will outlive applications, which is exactly the right assumption for a learning ledger.

## Verb — What They Did

The **Verb component** is the action. Every verb in xAPI is identified by an **IRI** — an Internationalized Resource Identifier, which is just a fancy URL — that points (at least conceptually) to a published definition somewhere on the public internet. The point of using IRIs instead of strings is that two different systems can independently use the verb `http://adlnet.gov/expapi/verbs/passed` and be confident they mean the same thing, because there is one canonical definition at that address.

Verbs come from **vocabularies**: published collections of verbs with formal definitions. The most common are:

- **ADL Vocabulary** — `http://adlnet.gov/expapi/verbs/...` — the original "official" verbs (`experienced`, `attempted`, `passed`, `completed`, `answered`, `interacted`, etc.)
- **TinCan Registry** — `http://activitystrea.ms/schema/1.0/...` — older verbs from the Activity Streams spec
- **Custom organizational verbs** — verbs you mint yourself for domain-specific actions, hosted at a URL you control

A verb object also includes an optional `display` map — human-readable labels in one or more languages — which is how dashboards render `passed` instead of the full IRI. The `display` field is purely cosmetic; the LRS matches and indexes on the IRI in `id`.

We'll spend an entire chapter (Chapter 4) on verb vocabulary design, because picking the wrong verbs early is one of the easiest ways to wreck the analytics value of an xAPI deployment. For now, the verb explorer below lets you preview the canonical ADL verbs you'll be reaching for most often.

#### Diagram: ADL Verb Vocabulary Explorer

<details markdown="1">
<summary>Interactive explorer for the canonical ADL xAPI verb vocabulary</summary>
Type: infographic
**sim-id:** adl-verb-vocabulary-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Let the reader explore the canonical ADL xAPI verbs by category, understand which verb is appropriate for which kind of learning event, and copy the verb's full IRI and `display` block in one click. Reinforces that verbs are IRIs, not strings.

Bloom level: Understand (L2). Bloom verb: classify, exemplify.

Canvas layout (responsive, default 760px wide × 480px tall):
- Left panel (60% width): a grid of verb chips arranged in five colored category bands — Engagement (blue), Assessment (gold), Progression (green), Social (purple), Lifecycle (gray).
- Right panel (40% width): an infobox that updates when the reader clicks a chip. Shows: full IRI, English display label, one-paragraph definition, two example use-cases drawn from intelligent-textbook scenarios, and a "Copy verb JSON" button.

Required interactivity:
- Every verb chip is clickable. Clicking populates the right-side infobox.
- A category-filter dropdown at the top of the left panel narrows the visible chips.
- A free-text filter input narrows chips by substring match on the verb name.
- "Copy verb JSON" button copies a `{ id, display }` block to the clipboard.
- Hovering a chip shows a one-line tooltip with the verb's English label.
- Clicking the "Copy verb JSON" button MUST emit an xAPI `interacted` statement to the chapter's LRS.

Sample verb dataset (16 verbs, drawn from the ADL registry):
- Engagement: `experienced`, `interacted`, `progressed`, `launched`
- Assessment: `attempted`, `answered`, `passed`, `failed`, `scored`
- Progression: `completed`, `mastered`, `voided`
- Social: `shared`, `commented`
- Lifecycle: `initialized`, `terminated`

Default state: category dropdown set to "All", no chip selected, infobox shows a one-paragraph "Click any verb to see its definition" placeholder.

Visual style: rounded chips with slight drop shadow, category color band running down the left edge of each chip, monospace font for IRIs in the infobox, clear visual distinction between chips and infobox.

Implementation: p5.js with `createButton`, `createSelect`, and `createInput` builtin controls. Chip layout uses a flexbox-like algorithm in `draw()`. Verb dataset loaded from a local JSON file. Responsive — calls `updateCanvasSize()` first thing in `setup()`.
</details>

## Object — To What

The **Object component** answers the third question: what was the verb done to? In the vast majority of xAPI statements, the object is an **Activity** — a piece of content, a chapter, a quiz, a simulation, a video, an exercise, a discussion thread. An Activity is identified by an IRI (its `id`) and may carry a `definition` block describing its name, type, and other metadata in human-readable form.

But the object doesn't have to be an Activity. It can also be an `Agent` or `Group` (for statements like "the instructor commended the student"), a `SubStatement` (for nested statements like "the tutor reported that the learner answered correctly"), or a `StatementRef` (a pointer to another statement, used for voiding and threading). The four object types cover essentially every relationship you'd want to record between learners and the things they encounter.

The list below names the four object types and when each is appropriate, so the table that follows it organizes what we already understand:

- **Activity** — content, assessments, courses, lessons, simulations. The default and most common.
- **Agent** — another individual, used when one person acts on another person.
- **Group** — a collection of agents, used for team or cohort interactions.
- **SubStatement** — a complete statement-shaped record nested inside another, used for "X said that Y did Z" patterns.
- **StatementRef** — a UUID pointer to another statement, used by voiding and by statements that reference earlier events.

| Object Type | Required `objectType` value | Typical use case | Example |
|-------------|----------------------------|------------------|---------|
| Activity | `"Activity"` (often omitted; default) | Learner interacts with content | `"id": "http://textbook.example.org/chapters/quadratics"` |
| Agent | `"Agent"` | One person acts on another | Instructor commends learner |
| Group | `"Group"` | Action affects a cohort | Cohort completed an assignment |
| SubStatement | `"SubStatement"` | Nested reporting | Tutor reports learner's answer |
| StatementRef | `"StatementRef"` | Reference an earlier statement | Voiding a prior statement |

In this book — and in nearly every real-world intelligent textbook deployment — you'll spend 95% of your time emitting statements whose object is an Activity. The other four object types are rarely needed, but they're in your toolbox when you need them.

## Result — How It Went

The **Result component** is optional, but it's where the analytical gold often hides. Result describes the outcome of the verb-on-object event: did the learner succeed? Did they complete the activity? What score did they earn? How long did it take? Did they enter a free-text response? All of those questions live in `result`.

The standard `result` fields are:

- **`success`** (boolean) — did the action succeed?
- **`completion`** (boolean) — was the activity completed in full?
- **`score`** (object) — a nested object containing `raw`, `min`, `max`, and `scaled` (a value between -1.0 and 1.0). `scaled` is the most analytically useful and the one most dashboards consume.
- **`duration`** (ISO 8601 duration string, e.g., `"PT5M30S"` for five minutes thirty seconds) — how long the action took.
- **`response`** (string) — the learner's free-text or selection response, when applicable.
- **`extensions`** (object) — a map of IRIs to arbitrary JSON values, for any custom result data that doesn't fit the standard fields.

!!! mascot-warning "The footgun in `result.completion`"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Xavi raising a warning tentacle">
    `result.completion` is a boolean. If you forget to set it, it isn't `false` — it's *absent*, which is a different thing entirely from `false`. Most LRS query engines treat absent and `false` differently when filtering. This is the textbook **footgun pattern**: silent (no error), easy to trigger (just leave it off), and damaging far from the cause (your "completion rate" report a month later mysteriously undercounts everything). Always set `completion` explicitly when you mean it.

## Context — Under What Circumstances

The **Context component** captures the surrounding situation: which course this statement belongs to, which platform emitted it, which language the learner was using, which other activities this one is grouped with. Context is what lets your analytics team answer questions like "show me all `passed` statements for the algebra textbook, but only for learners in the Tuesday cohort, taken in Spanish." Without context, every statement is an island.

The most useful context fields are:

- **`platform`** (string) — a short label for the platform that emitted the statement (e.g., `"Intelligent Algebra Textbook"`)
- **`language`** (string) — the IETF BCP 47 language tag for the learner's session
- **`contextActivities`** (object) — a map with four keys (`parent`, `grouping`, `category`, `other`), each holding an array of Activities that contextualize this statement
- **`registration`** (UUID) — a unique ID for the learner's instance of an activity (often used to thread together multiple attempts at the same quiz)
- **`instructor`** (Agent) — who is teaching this session
- **`team`** (Group) — which group this learner is part of right now
- **`extensions`** — same idea as `result.extensions`: an IRI-keyed map for custom context

The four `contextActivities` arrays are subtly different and frequently confused. Here's the rule: `parent` is for the *direct container* (the chapter that contains this quiz), `grouping` is for *peer activities* the statement is grouped with, `category` is for *labels and tags* (like "formative-assessment" or "section-3.4"), and `other` is the catch-all for anything else. Get `parent` right and you can already answer most "which chapter?" questions in your analytics.

## Statement Metadata — `id`, `timestamp`, `stored`, `authority`, `version`

The five metadata fields are what turn a statement from a JSON object into a record in a queryable ledger. Some of these you set; some the LRS sets for you; some are required and some are optional. Knowing who sets what is one of the things that separates a confident xAPI engineer from a confused one.

The **Statement ID (UUID)** is a Version 4 UUID that uniquely identifies the statement. If you don't supply one when you POST the statement, the LRS will mint one and return it. In production code, you should *always* generate the UUID client-side and include it — that lets you safely retry a failed POST without creating duplicates, because the LRS will reject a second POST with the same ID rather than store the same event twice.

The **Timestamp Field** records when the *learner* experienced the event, in ISO 8601 format with timezone (typically UTC, suffix `Z`). This is the field your dashboards filter on for "events between Monday and Friday." If you don't supply it, the LRS will default it to the moment the statement arrives — which is *not* the same moment, especially if your statements were buffered offline for hours or days before sync.

The **Stored Timestamp** is set by the LRS, never by the client. It records when the LRS received and persisted the statement. You'll use `stored` for replication and audit ("which statements arrived after our last backup?"), and you'll use `timestamp` for everything pedagogical ("when did the learner actually do this?"). Confusing these two is a classic rookie mistake; the gap between them is your offline-sync buffer in action.

!!! mascot-tip "Always send `id` and `timestamp` from the client"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Xavi giving a tip">
    Two habits will save you weeks of debugging. First, always generate the statement's UUID at the moment of the event, not later. Second, always set `timestamp` to the wall-clock time when the learner experienced the event, not when your code happens to call `fetch()`. Together, these two habits make your offline queue, your retry logic, and your "did the learner study this on Tuesday or Wednesday?" report all behave correctly without any extra plumbing.

The **Authority Field** identifies the agent vouching for the truth of the statement. You almost never set this yourself — the LRS sets it based on the credentials your client used to POST. If your client authenticated as `intelligent-algebra-client`, every statement that client POSTs gets `authority` set to that account. Authority is what stops a textbook from impersonating a teacher; the LRS knows who actually sent the bytes, regardless of what the JSON claims.

The **Statement Version Field** records the xAPI specification version under which the statement was processed. This is also LRS-set. The current canonical version is `1.0.3`, which is what this book targets throughout. (xAPI 2.0 has been published, but adoption is still uneven across the LRS landscape; we'll discuss the differences in Chapter 12.)

#### Diagram: Who Sets What — Client vs. LRS Field Ownership

<details markdown="1">
<summary>Interactive diagram showing which fields are set by the client and which by the LRS</summary>
Type: diagram
**sim-id:** statement-field-ownership<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Disambiguate, at a glance, which statement fields are the client's responsibility and which are the LRS's. Eliminates a class of bugs where developers try to set `stored` or `authority` from the client and are surprised when the LRS overwrites them.

Bloom level: Analyze (L4). Bloom verb: differentiate, attribute.

Layout: Mermaid `flowchart LR` with two large `subgraph` containers side by side. Left subgraph "Activity Provider sets" contains nodes: `actor`, `verb`, `object`, `result`, `context`, `id`, `timestamp`. Right subgraph "LRS sets" contains nodes: `stored`, `authority`, `version`. A central arrow labeled "POST /statements" connects the two subgraphs and is itself clickable to reveal an infobox describing the wire protocol.

Required interactivity:
- Every node MUST have a Mermaid `click` directive that opens an infobox describing: who sets the field, when, the data type, and what happens if the client tries to set an LRS-owned field anyway (answer: the LRS overwrites it silently — another classic footgun).
- Hovering a subgraph header MUST highlight all nodes in that subgraph.
- The central "POST /statements" arrow is clickable and reveals an infobox describing the request/response cycle, including the Content-Type, the X-Experience-API-Version header, and the LRS's response with the assigned UUIDs.

ClassDef styling:
- `client-set` — fill #4338ca (indigo), white text
- `lrs-set` — fill #16a34a (green), white text
- `negotiated` — fill #f59e0b (amber), dark text — used for `id` (client may set, LRS will mint if absent)

Sample infobox content (for `stored`):
"**stored** — Set by the LRS, never by the client. ISO 8601 timestamp recording when the LRS received and persisted the statement. Use `stored` for replication, audit, and reconciliation. Do not confuse with `timestamp`, which is when the learner experienced the event. The gap between `timestamp` and `stored` is your offline buffer in action."

Implementation: Mermaid `flowchart LR` with classDefs and `click` directives wired to a JavaScript `showFieldOwnership(name)` function. Responsive width.
</details>

## Build a Statement Yourself

Reading statements is half the skill. Building them is the other half. The MicroSim below lets you assemble a complete xAPI statement piece by piece, watch the JSON construct itself, and see live conformance feedback as you go.

#### Diagram: xAPI Statement Builder MicroSim

<details markdown="1">
<summary>Interactive statement builder with live JSON output and conformance checking</summary>
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
</details>

!!! mascot-encourage "If conformance feels picky, that's the point"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Xavi being encouraging">
    The first time you run the validator and watch it complain about your perfectly reasonable-looking statement, it's tempting to feel that xAPI is being uptight. It's actually doing you a favor. Strict conformance is what lets two systems on opposite sides of the world agree on what a statement *means*. Loose schemas are the reason previous learning standards quietly drifted out of interoperability over the decade after their release. We'll lean into the strictness — your future analytics dashboards will thank you.

## The Three Roles in the xAPI Ecosystem

A statement is a noun. It just sits there. To make anything *happen*, you need three roles to act on statements — and the spec gives them job titles. These three roles will appear in nearly every system diagram you draw for the rest of this book, so let's name them now.

The **Activity Provider (AP)** is the system that *creates* statements. Your intelligent textbook is an Activity Provider. A simulation is an Activity Provider. A quiz tool is an Activity Provider. The AP's job is to detect a learning event, build a conformant statement describing it, and POST that statement to an LRS.

The **Learning Record Provider (LRP)** is a more general term for any system that *provides* records to an LRS. Every Activity Provider is also a Learning Record Provider, but not every LRP is an AP — for example, an LMS that imports a batch of historical statements from an old SCORM database is acting as an LRP without ever having generated those statements itself. In practice, "AP" and "LRP" are often used interchangeably, but the spec keeps them separate for the case where the source of the statements isn't the same as the system reporting them.

The **Activity Consumer** is the system that *reads* statements back out of the LRS. Dashboards, analytics pipelines, recommender systems, and grade exports are all Activity Consumers. An Activity Consumer never writes statements — it queries them, aggregates them, and turns them into reports, scores, and decisions.

The diagram below lays the three roles out with the LRS in the middle. Click any role to see its responsibilities, the HTTP verbs it uses, and an example real-world system that fills that role.

#### Diagram: Activity Provider, LRS, and Activity Consumer

<details markdown="1">
<summary>The three xAPI ecosystem roles and how statements flow between them</summary>
Type: workflow
**sim-id:** xapi-three-roles<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Purpose: Cement the three role names — Activity Provider, Learning Record Provider, Activity Consumer — and show how statements flow from creation, through the LRS, to consumption. Disambiguates the AP-vs-LRP distinction visually.

Bloom level: Understand (L2). Bloom verb: describe, classify.

Layout: Mermaid `flowchart LR` with five nodes laid out left-to-right:
1. `Activity Provider` (indigo) — produces statements
2. `Learning Record Provider` (lighter indigo, dashed border) — broader category, drawn as a superset around AP
3. `LRS` (gold, large) — central node
4. `Activity Consumer` (teal) — reads statements
5. A subordinate cluster of three example consumers under "Activity Consumer": `Dashboard`, `Recommender`, `Grade Export`.

Arrows:
- AP → LRS labeled "POST /statements" (clickable)
- LRS → Consumer labeled "GET /statements" (clickable)
- LRP envelope drawn around AP with a note "All APs are LRPs; not all LRPs are APs"

Required interactivity:
- Every node MUST have a Mermaid `click` directive opening an infobox with: role definition, HTTP verbs used, example real-world systems (e.g., AP: "your intelligent textbook, a simulation, a quiz tool"; Consumer: "Watershed dashboards, a custom Grafana board, a Canvas grade-passback script"), and a one-paragraph "common confusion" callout.
- Both arrows are clickable and reveal an infobox describing the HTTP request/response, headers, and authentication.
- Hovering the LRP envelope highlights the relationship and reveals a tooltip "Learning Record Provider — any system that provides records to an LRS, including but not limited to Activity Providers."

Sample infobox content (for `Activity Consumer`):
"**Activity Consumer** — A system that reads statements from an LRS via HTTP GET. Consumers never write statements. Examples: a real-time engagement dashboard, a personalized recommender that suggests next chapters based on completion patterns, a grade-export script that pushes final scores to an LMS gradebook. Common confusion: a system can be both an AP and a Consumer (it writes some statements and reads others), but the two roles are conceptually distinct and often have different authentication credentials."

Implementation: Mermaid `flowchart LR` with classDefs, a Mermaid `subgraph` for the LRP envelope, and `click` directives wired to a JavaScript `showRoleInfo(role)` function. Responsive width.
</details>

## xAPI 1.0.3 and Conformance

The **xAPI 1.0.3 Specification** is the version this book targets. It is the most widely deployed version in production LRSs as of 2026 and the version that all major open-source and commercial LRS platforms support without caveat. xAPI 2.0 has been published — it adds JSON-LD support, clarifies a number of edge cases, and tightens some conformance rules — but adoption is uneven and many production systems still target 1.0.3 for compatibility reasons. When this book says "xAPI", we mean 1.0.3 unless we explicitly note otherwise.

**xAPI Conformance** is the property of being a valid implementation of the spec. The ADL maintains a conformance test suite that probes an LRS or AP for spec compliance: does it accept all required statement shapes? Does it reject malformed ones with the correct HTTP status codes? Does it return the correct fields in the correct format from the `/statements` GET endpoint? An LRS that passes the suite earns the right to call itself conformant; one that doesn't is, technically, just *xAPI-flavored*.

We'll run the conformance suite against an open-source LRS in Chapter 12. For now, the takeaway is this: when you build an Activity Provider, conformance is not an aspiration — it is a binary property your code either has or doesn't have. The statement builder above gives you a glimpse of that strictness; the conformance suite formalizes it.

## What You Just Leveled Up

You started this chapter able to recognize the Actor-Verb-Object triple. You're leaving it able to read every line of an eleven-field xAPI 1.0.3 statement, name who sets each field and when, distinguish the three ecosystem roles, and articulate why xAPI's identity model is built on globally unique IFIs instead of database keys. That's a serious foundation, and every chapter that follows will lean on it.

The next chapter goes deeper into the structural patterns you'll need for real-world data: nested SubStatements, voiding, signed statements, attachments, and the language map convention that makes xAPI multilingual by default. After that, we'll spend a full chapter on verb vocabulary design — the single highest-leverage decision you'll make on any xAPI deployment.

!!! mascot-celebration "You can read xAPI fluently now!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating with tentacles in the air">
    Eleven fields. Three required, two optional-but-powerful, five metadata. Three ecosystem roles. Four IFI shapes. One conformance suite. **You just earned your statement-reading license.** From here on, when someone shows you a raw xAPI payload in a debugger, you'll see structure where most engineers see noise. Every interaction tells a story — and now you can read every word.
