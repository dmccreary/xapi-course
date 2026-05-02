---
title: Activities, Agents, and Learner Identity
description: How xAPI names the things learners interact with (activity IRIs, activity types, registration, revision, platform) and the people who interact with them (agents, groups, the four inverse functional identifiers, and the strategies for tracking learners while protecting their privacy).
generated_by: claude skill chapter-content-generator
date: 2026-04-30 11:38:00
version: 0.07
---

# Activities, Agents, and Learner Identity

## Summary

Covers activity IRIs, activity types, agent and group objects, identifier forms, registration fields, and pseudonymization. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Activity IRI
2. Activity Type
3. Agent Object
4. Group Object
5. Anonymous Group
6. Identified Group
7. mbox Identifier
8. mbox_sha1sum Identifier
9. openid Identifier
10. Account Identifier
11. Activity Registration
12. Learner Identity Management
13. Anonymous Learner Tracking
14. Pseudonymization
15. xAPI Registration Field
16. Revision Field (xAPI)
17. Platform Field (xAPI)

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)

---

!!! mascot-welcome "Welcome to the Naming Chapter"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus pointing at a name tag">
    The verb tells you what happened. This chapter tells you *who it happened to* and *what it happened with* — and that's where xAPI gets surprisingly subtle. Naming a learner without leaking who they are, naming an activity in a way that lets a future textbook re-use it, naming a learning session so you can stitch fragmented events back together — every one of those is a deliberate design decision. Every interaction tells a story; first you have to name the cast.

## Your New Superpower

By the end of this chapter, you'll be able to **uniquely identify any learner, any activity, and any learning session in xAPI without exposing personally identifiable information you didn't intend to expose**. That's three superpowers stacked. Most teams nail one of them and accidentally torch the other two. The textbook that uses learner email addresses everywhere and then has to comply with FERPA finds out the hard way. The textbook that gives every activity a fresh UUID per page-load finds out that no analytics queries work. The textbook that forgets to set the `registration` field can't tell three quiz attempts apart from one.

You'll also leave this chapter knowing which **inverse functional identifier** to pick for which deployment context, the difference between an agent and a group (and when to use which), and the simplest workable approach to **pseudonymization** that doesn't break analytics. These are the boring-sounding decisions that determine whether your deployment passes a privacy audit.

## Activities, Properly Named

Chapter 2 introduced the activity object — the thing a verb is happening *to*. We focused on the required `id` field. This chapter covers the rest of the activity-shaped real estate, plus three top-level statement fields (`registration`, `revision`, `platform`) that finish naming the *occurrence* of the activity, not just the activity itself.

An **activity IRI** is the globally unique identifier for an activity. Like a verb IRI, it's a fully-qualified IRI — almost always an `http://` or `https://` URL — in a namespace you own. Two activities with the same IRI are *the same activity* across the entire xAPI ecosystem. Two activities with different IRIs are *different activities*, even if they look identical to a human reader. The IRI is the identity. Everything else in the activity object — its name, its description, its type — is metadata that may vary between statements.

The naming rule that matters: **activity IRIs are durable, not generated**. An activity's IRI is the same today, tomorrow, and in five years. It does not contain the learner's ID, the session ID, the build hash of the textbook, or the timestamp of the page render. It names the activity itself — the abstract thing called "Quadratics Quiz, Algebra 1" — not the particular instance of that thing being attempted on Thursday afternoon.

```json
"object": {
  "objectType": "Activity",
  "id": "http://textbook.example.org/chapters/quadratics/quiz",
  "definition": {
    "name": { "en-US": "Quadratics Chapter Quiz" },
    "description": { "en-US": "Four-question formative assessment on factoring quadratics." },
    "type": "http://adlnet.gov/expapi/activities/assessment"
  }
}
```

The `definition.type` field — the **activity type** — is itself an IRI. It classifies the activity into a category (`assessment`, `course`, `module`, `simulation`, `lesson`) so dashboards can group like with like. ADL maintains a registry of canonical activity types at `http://adlnet.gov/expapi/activities/`, and the same advice applies as for verbs: use canonical types when you can, mint custom types only when you must, and document them in your project profile.

Three top-level statement fields complete the picture by naming the *occurrence* of the activity, not just the activity itself. Before we look at the diagram, let's define each one in plain language so the diagram lands as a summary rather than an introduction.

- **`registration`** — a UUID that ties together a sequence of statements describing one *attempt* at an activity. If the same learner takes the quadratics quiz three times, each attempt should have its own registration UUID. The activity IRI stays the same; the registration changes.
- **`revision`** — a string identifying the version of the activity. Useful when content changes over time and you want to be able to ask "show me everyone who took version 2 of the quiz." Free-form, but conventionally semver or a date.
- **`platform`** — a string identifying the host environment that emitted the statement. Useful when the same textbook ships in multiple platforms (web, embedded LMS frame, kiosk) and you want to slice analytics by platform.

These three fields cohabit the statement at different levels — `registration` and `platform` live in `context`, `revision` lives inside the activity definition. They sound similar in passing and are easy to confuse, which is exactly why the diagram below sorts them by where they live and what question each answers.

#### Diagram: Activity Naming and Occurrence Fields

<details markdown="1">
<summary>Activity Naming and Occurrence Fields</summary>
Type: interactive-infographic
**sim-id:** activity-naming-and-occurrence-fields<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Distinguish the four fields that name an activity occurrence (`object.id`, `object.definition.type`, `context.registration`, `object.definition.revision`, `context.platform`), and identify which question each one answers.

**Layout:** A single annotated JSON statement on the left (2/3) with five colored highlight boxes drawn around the relevant fields; a side panel on the right (1/3) explaining the highlighted field.

**Visual elements:**

- A worked statement rendered as syntax-highlighted JSON
- Five colored highlights:
    - Blue around `object.id` — "Which activity?"
    - Green around `object.definition.type` — "What kind of activity?"
    - Orange around `context.registration` — "Which attempt?"
    - Purple around `object.definition.revision` — "Which version of the activity?"
    - Red around `context.platform` — "Which host environment?"
- Side panel updates on hover/click of any highlight, showing: the field's plain-English question, when to set it, and a one-line example value

**Interaction:**

- Hover or click a highlight to update the side panel
- Toggle "Compare two attempts" — swaps the JSON for two side-by-side statements and emphasizes which fields differ between them (registration changes; activity IRI stays the same)

**Default canvas:** 1000×500px, responsive.

Implementation: p5.js for the highlight overlay and hover detection; HTML overlay for the JSON syntax highlighting and the side panel.
</details>

## Activity Registration — The Attempt UUID

The **xAPI registration field** is a context-level UUID that ties together every statement describing one specific attempt at an activity. **Activity registration** is the practice of generating that UUID at the start of an attempt, attaching it to every statement emitted during the attempt, and not changing it until the attempt ends.

This pattern lets the dashboard team answer questions that would otherwise be hard or impossible:

- "Show me every statement from the third time Lin attempted the quadratics quiz."
- "How long did the median attempt take, end to end?"
- "Which attempts ended without a `passed`/`failed` statement?"

Without a registration UUID, those questions become "approximate by timestamp clustering and pray," which is exactly as reliable as it sounds. With a registration UUID, they become trivial filters.

The implementation is small. When the learner begins an activity, mint a UUID, store it in the page's session state, and attach it to every statement until the activity ends:

```javascript
import { v4 as uuidv4 } from "uuid";
const registration = uuidv4();

function buildAttemptStatement(verb, activityIri) {
  return {
    actor: getCurrentLearner(),
    verb: verb,
    object: { objectType: "Activity", id: activityIri },
    context: { registration }
  };
}
```

`uuidv4` produces a random 128-bit UUID — the kind that looks like `fd41c918-b88b-4b20-a0a5-a4c32391aaa0`. Random UUIDs are appropriate here because we don't want the registration ID to leak when the attempt happened or which learner it was. It's an opaque correlation handle, nothing more.

## Agents — Naming Learners

Chapter 2 introduced the actor field and showed that an actor is either an agent (a single person) or a group (multiple people). This chapter cracks open both. Let's start with **agents**.

An **agent object** represents a single learner. It has an optional `name` (for human readability — never used for matching), an `objectType` of `Agent` (often omitted, since `Agent` is the default), and exactly *one* of four possible **inverse functional identifiers** (IFIs). An IFI is a field whose value uniquely identifies the agent across the entire LRS — two agents with the same IFI value are the same person.

The four IFI types, with the rule that only *one* may be present per agent:

- **`mbox`** — an email address as a `mailto:` URI. The most common IFI in early xAPI deployments and the most privacy-leaky. The agent's email is, by definition, identifying.
- **`mbox_sha1sum`** — the lowercase hex SHA-1 hash of the email address. A pseudonymization step over `mbox`. Looks opaque but is reversible if the attacker can guess the email and hash it; treat it as obscured, not anonymized.
- **`openid`** — an OpenID URL identifying the learner. Useful when the deployment integrates with an OpenID identity provider; rare in practice today.
- **`account`** — a structured object containing a `homePage` URL (the identity provider's base URL) and a `name` string (the identifier within that system). The most flexible IFI and the right default for new deployments.

Before we look at the comparison, here's the rule that determines which one you pick: **the IFI you choose is a privacy decision, not a convenience decision**. Your security and compliance teams should be in the conversation, especially in K-12 contexts where FERPA constrains what can flow through your LRS.

| IFI form         | Identifying? | LMS-integration friendliness | Cross-deployment portability | Recommended for new textbooks?            |
|------------------|--------------|------------------------------|------------------------------|-------------------------------------------|
| `mbox`           | Yes (direct) | High                         | High                         | Only when learners are adults and consent |
| `mbox_sha1sum`   | Reversible   | Medium                       | High                         | Rarely — looks pseudonymous but isn't     |
| `openid`         | Depends      | Low (OpenID providers rare)  | Medium                       | Niche                                     |
| `account`        | Configurable | High                         | Low (homePage-scoped)        | **Yes** — most flexible default            |

The `account` form is the strongest default for textbooks. It lets you pair a stable namespace (`homePage`) with an opaque identifier (`name`) that your LMS or identity provider chooses. The result is a learner ID that's stable enough for analytics but doesn't leak the learner's name, email, or institutional role. Here's an `account`-based agent:

```json
"actor": {
  "objectType": "Agent",
  "account": {
    "homePage": "https://canvas.university.edu",
    "name": "stu-8f3a2b1c"
  }
}
```

Two statements with that exact account block — same `homePage`, same `name` — are about the same learner. The LRS will index them together, queries will join them correctly, and a determined attacker who somehow gets the LRS will see only an opaque code, not the learner's identity.

#### Diagram: The Four Inverse Functional Identifiers

<details markdown="1">
<summary>The Four Inverse Functional Identifiers</summary>
Type: interactive-infographic
**sim-id:** four-inverse-functional-identifiers<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare the four IFI forms across identification strength, privacy posture, and integration cost, and select the appropriate one for a given deployment scenario.

**Layout:** A 2×2 grid of cards on the left (2/3), each card representing one IFI form; a side panel on the right (1/3) showing the selected card's full detail.

**Each card shows:**

- IFI name in a header bar (`mbox`, `mbox_sha1sum`, `openid`, `account`)
- A privacy badge (Red = direct identifying, Yellow = reversible, Green = configurable)
- A one-sentence summary
- A short example agent JSON block

**Interaction:**

- Hover a card to highlight; click to select. Side panel shows: full description, when-to-use guidance, when-not-to-use cautions, and a worked example
- Three preset scenario buttons across the top — "K-12 elementary," "University LMS," "Corporate L&D" — that recommend an IFI by highlighting the appropriate card and updating the side panel with deployment-specific reasoning

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the card rendering and selection state; HTML overlay for the side panel and preset buttons.
</details>

## Groups — When the Actor Isn't One Person

A **group object** represents multiple agents acting together. The `objectType` is `Group`, and the group has an optional `member` array containing agent objects. Groups exist because some learning events legitimately involve more than one person — a small-group lab exercise, a peer-review session, a team submission.

xAPI distinguishes two flavors of group, and the difference matters for what the LRS can and can't do with the data.

An **identified group** has its own IFI (any of the four IFI forms) plus an optional `member` array. The IFI uniquely identifies the group itself, the way an agent IFI uniquely identifies a person. A history class section, a study cohort, a corporate training pod — anything with a stable identity that exists independently of any single member — is an identified group.

```json
"actor": {
  "objectType": "Group",
  "name": "Algebra 1, Section 3",
  "account": {
    "homePage": "https://canvas.university.edu",
    "name": "section-alg1-s3-fall2026"
  },
  "member": [
    { "account": { "homePage": "https://canvas.university.edu", "name": "stu-8f3a2b1c" } },
    { "account": { "homePage": "https://canvas.university.edu", "name": "stu-9a4d3f7e" } }
  ]
}
```

An **anonymous group** has *no* IFI — it is identified only by its membership. The same set of members today and tomorrow is the same anonymous group; a different set is a different group, even if you'd describe them with the same name. Anonymous groups are useful for ad-hoc collaborations that don't have a persistent identity (the three students who happened to work together on Thursday's lab).

```json
"actor": {
  "objectType": "Group",
  "member": [
    { "account": { "homePage": "https://canvas.university.edu", "name": "stu-8f3a2b1c" } },
    { "account": { "homePage": "https://canvas.university.edu", "name": "stu-7c2e1d4f" } }
  ]
}
```

The decision is straightforward: if the group has a name people would recognize and a stable identity, it's identified. If it's a transient combination of individuals with no organizational existence, it's anonymous. Most intelligent textbooks emit very few group statements compared to agent statements; groups are the exception, not the rule.

!!! mascot-thinking "Xavi's Insight — Groups Are for Collective Action"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Xavi pondering a group dynamic">
    A common confusion: "I want to query all the statements from Section 3, so I should make Section 3 the actor." No. The actor is *who did the thing*. If a single student in Section 3 took a quiz, the actor is that student. Section 3 belongs in `context.team` or as a grouping context activity. Use a group actor only when the *action itself* was collective.

## Learner Identity Management

**Learner identity management** is the set of decisions that determine how learners are identified across the lifetime of a textbook deployment — across devices, sessions, courses, and years. Get this right and your analytics queries are clean. Get it wrong and you discover that 60% of your "learners" are duplicates the day you try to compute course-completion rates.

The non-negotiable property: **the same learner must have the same actor IFI in every statement, across every device, across every session**. If Lin uses the textbook on a desktop in the morning and a phone in the afternoon, both sessions emit statements with the same `account.name`. If you let the actor IFI vary by device, you've shattered Lin's record into pieces no analytics can stitch back together.

The way teams achieve consistency: a single source of truth for the learner ID. In an LMS-integrated deployment, that source of truth is the LMS — Canvas hands the textbook a learner ID at launch, the textbook caches it, every emit uses it. In a standalone deployment, the source of truth is whatever identity provider the textbook authenticates against. In a fully anonymous deployment (no login), the source of truth is a per-browser UUID stored in `localStorage` or a cookie, with the explicit understanding that the same learner on a different browser will appear as a different person.

## Anonymous Learner Tracking

**Anonymous learner tracking** is the practice of recording learner activity without ever associating it to a real-world identity. The use case is open-content textbooks — public-facing, no login, anyone can read — where you still want analytics on which sections engage readers and which don't. xAPI supports this cleanly through the `account` IFI: the `homePage` is your textbook's domain, and the `name` is a per-browser UUID minted on first visit and stored locally.

```json
"actor": {
  "objectType": "Agent",
  "account": {
    "homePage": "https://textbook.example.org",
    "name": "anon-c4f9b1e2-7a83-4b6d-a0c5-9e1f8d3b2a47"
  }
}
```

The UUID is generated on the learner's device and never sent anywhere except inside xAPI statements. There's no email, no name, no institutional ID. The same browser on the same machine continues to use the same UUID for as long as the local storage isn't cleared. Different browsers, different machines, or a cleared cache produce a different UUID — at which point that "learner" appears as a new person to the analytics layer.

This is the right tool for the right job. It's not appropriate for graded courses (where you do need to tie statements to a specific student), but it's perfect for an open math textbook where you want to know which chapters readers complete and which they bail out of.

## Pseudonymization — Useful Without Being Identifying

**Pseudonymization** is the practice of replacing direct identifiers with stable but opaque codes, so that statements remain queryable per-learner without exposing who any particular learner is. It sits between fully identified data (real names and emails) and fully anonymous data (no per-learner identity at all). Most production deployments operate in this middle zone, because it's the zone where analytics works *and* the privacy team is happy.

The classic pattern: the LMS knows learner Lin Park is `stu-8f3a2b1c`. The LMS hands the textbook only the opaque code. The textbook emits xAPI statements with `account.name = "stu-8f3a2b1c"`. The LRS stores those statements. The dashboard team writes queries against `stu-8f3a2b1c` and gets correct per-learner analytics. Nobody touching the LRS or the dashboard sees Lin's name, email, or institutional role. To resolve `stu-8f3a2b1c` back to a real person, you need to query the LMS — and that lookup is logged, audited, and restricted to authorized roles.

The properties that make this work:

- **Stable:** the same learner always gets the same code. Otherwise per-learner analytics break.
- **Opaque:** the code reveals nothing about the learner. Otherwise it's not pseudonymization.
- **One-way at the analytics tier:** the LRS and dashboard cannot recover the real identity from the code. Re-identification requires a separate, audited lookup against the LMS or identity provider.
- **Revocable:** if an account is deleted, the LMS can refuse to resolve future lookups. The historical statements remain, anchored only to the opaque code.

#### Diagram: Pseudonymization Pipeline

<details markdown="1">
<summary>Pseudonymization Pipeline</summary>
Type: workflow-diagram
**sim-id:** pseudonymization-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the flow of identity information from the LMS through the textbook into the LRS, identifying at each hop what level of identifying detail is exposed.

**Diagram type:** Mermaid flowchart (LR direction) representing the pipeline. Click handlers on every node.

**Nodes (left to right):**

1. `LMS user record` (contains: name, email, role) — privacy badge: Red
2. `LMS launch — pseudonym only` (the LMS hands the textbook only `stu-8f3a2b1c`) — privacy badge: Green
3. `Textbook emit site` (constructs xAPI statement with the pseudonym in `account.name`) — privacy badge: Green
4. `LRS storage` (stores statements keyed by pseudonym) — privacy badge: Green
5. `Dashboard query` (computes per-learner stats using the pseudonym) — privacy badge: Green
6. `Re-identification lookup` (rare; goes back to LMS, audited) — privacy badge: Red, dashed line back to node 1

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing what data exists at that hop, who has access, and what the privacy posture is. The dashed re-identification edge has its own infobox emphasizing the audit-log requirement.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel.
</details>

!!! mascot-encourage "Privacy Is Engineering, Not Paperwork"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Xavi encouraging careful privacy work">
    The instinct to treat privacy as "the part the legal team handles after we ship" is the single biggest source of expensive xAPI rework. The IFI choice, the pseudonymization design, and the re-identification flow are *engineering decisions* you make on day one. Get them right and your privacy review takes a meeting. Get them wrong and your privacy review takes a quarter.

## Tying It Together — A Worked Statement

Everything in this chapter shows up in a single statement when you put it all together. Here's a complete statement from a hypothetical session: Lin Park (pseudonymized as `stu-8f3a2b1c`) attempts version 2 of the Quadratics Quiz inside the Intelligent Algebra Textbook on the web platform, on the third try. Read top to bottom and you should now recognize every field's role:

```json
{
  "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
  "actor": {
    "objectType": "Agent",
    "account": {
      "homePage": "https://canvas.university.edu",
      "name": "stu-8f3a2b1c"
    }
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
      "type": "http://adlnet.gov/expapi/activities/assessment",
      "revision": "2.0"
    }
  },
  "result": {
    "score": { "scaled": 0.92 },
    "success": true,
    "completion": true
  },
  "context": {
    "platform": "Intelligent Algebra Textbook (web)",
    "registration": "8a1f3c4d-2b9e-4c7a-9d6f-1e8a7b4c2d5f"
  },
  "timestamp": "2026-04-15T18:32:14.512Z"
}
```

Every choice is now intentional. The `account` IFI uses the LMS's opaque code, never Lin's email. The activity IRI is the durable name for the quiz, not a per-page-render UUID. The activity type classifies it as an assessment so dashboards group it correctly. The revision distinguishes it from version 1.0. The platform identifies the host environment. The registration ties this `passed` statement to the matching `attempted` and `scored` statements from the same attempt. There's nothing in this statement that exposes Lin's real identity, and nothing missing that the analytics layer needs.

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 6.

- You can construct a durable activity IRI and choose an appropriate activity type from the canonical registry.
- You can use `registration`, `revision`, and `platform` to distinguish *occurrences* of activities from the activities themselves.
- You can list the four inverse functional identifier forms and pick the right one for a given deployment context.
- You can construct an `account`-IFI agent that pseudonymizes a learner without breaking per-learner analytics.
- You can distinguish an identified group from an anonymous group and explain when each is appropriate.
- You can describe the four properties that make pseudonymization work (stable, opaque, one-way at the analytics tier, revocable).
- You can sketch the identity flow from LMS to textbook to LRS to dashboard, and explain what data is visible at each hop.

!!! mascot-celebration "The Cast Is Named"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating with all eight tentacles raised">
    You've just learned the part of xAPI that protects the people inside your data. Most teams skip this chapter, copy-paste an `mbox` example from a tutorial, and find out two years later that they have to re-identify their entire LRS. You won't. Chapter 6 zooms out from individual statements to the system that stores them — the LRS itself — and starts answering the question "where do these statements actually live?"

## References

[See Annotated References](./references.md)
