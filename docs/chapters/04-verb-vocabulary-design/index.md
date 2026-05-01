---
title: Verb Vocabulary Design and the ADL Verb Registry
description: A working tour of xAPI verb IRIs — what makes a verb canonical, how the ADL and tincan registries work, when to design a custom verb profile, and how to use the canonical interactive-textbook verbs without painting yourself into an analytics corner.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 11:32:00
version: 0.07
---

# Verb Vocabulary Design and the ADL Verb Registry

## Summary

Teaches verb IRI namespacing, the ADL and tincan registries, custom verb profiles, and the canonical verbs used inside intelligent textbooks. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. ADL Verb Registry
2. Tincan Verb Vocabulary
3. Custom Verb Profiles
4. Verb IRI Namespace
5. Verb Vocabulary Design
6. Interactive Component Instrumentation
7. Interacted Verb
8. Progressed Verb
9. Completed Verb
10. Attempted Verb
11. Passed Verb
12. Failed Verb
13. Experienced Verb
14. Scored Verb
15. Launched Verb
16. Initialized Verb
17. Terminated Verb
18. Abandoned Verb

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../01-foundations-and-standards/index.md)
- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)
- [Chapter 3: Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments](../03-advanced-statement-structure/index.md)

---

!!! mascot-welcome "Welcome to the Verb Workshop"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus standing at a workbench">
    Verbs are the soul of an xAPI statement. The actor and object answer "who" and "to what" — the verb answers "what happened," and that's the question every analytics dashboard is ultimately built on. This chapter is a workshop. We'll examine the canonical verbs, learn the rules of the registries, and design a custom verb profile for a textbook the right way. Every interaction tells a story — and this is where you choose the right word.

## Your New Superpower

By the end of this chapter, you'll be able to **pick the right verb for any learner event in an intelligent textbook, defend that choice, and document it so future contributors don't drift**. That sounds modest. It isn't. Verb sprawl is the single most common reason xAPI deployments end up with analytics that nobody trusts. When ten developers each invent their own verb for "the learner clicked something useful," the dashboard team can't write a single query that means anything stable.

You'll also learn when *not* to invent a verb. Most teams reach for a custom verb on day three and regret it on day three hundred. The canonical ADL verbs cover roughly 80% of the events an intelligent textbook will ever emit, and using the canonical set means your data immediately interoperates with every off-the-shelf xAPI tool.

## A Verb Is an IRI

Chapter 2 said the verb component has an `id` field that's an IRI. We were brief about it. Let's slow down. A **verb IRI** is a fully-qualified Internationalized Resource Identifier — in practice, almost always an `http://` or `https://` URL — that uniquely names a verb across the entire web of xAPI deployments. Two verbs with the same IRI are *the same verb*, no matter who emitted them. Two verbs with different IRIs are *different verbs*, even if they have identical English display strings. The IRI is the identity. The display string is just for humans.

Here's the verb component for a `passed` statement, with each part labeled in plain language:

```json
"verb": {
  "id": "http://adlnet.gov/expapi/verbs/passed",
  "display": {
    "en-US": "passed",
    "es-MX": "aprobó"
  }
}
```

The `id` is the verb's globally unique identity. The `display` is a language map — a JSON object whose keys are language tags and whose values are the verb's display string in that language. The LRS uses the `id` for indexing and queries. The dashboard uses `display` for what gets shown to humans. The *only* part you should ever match against in code is the `id`.

A **verb IRI namespace** is the part of the IRI before the verb's local name — the path prefix that signals "this verb belongs to a particular registry or vocabulary." The ADL verbs all live under `http://adlnet.gov/expapi/verbs/`. The tincan verbs (older, but still seen in legacy data) live under `http://activitystrea.ms/schema/1.0/`. A custom verb you design for your textbook should live under a namespace you own — `https://textbook.example.org/xapi/verbs/` is fine; `myverbs/` is not.

#### Diagram: Verb IRI Anatomy

<details markdown="1">
<summary>Verb IRI Anatomy</summary>
Type: interactive-infographic
**sim-id:** verb-iri-anatomy<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Decompose a verb IRI into its three parts (scheme + namespace + local name), and recognize valid versus invalid verb IRIs at a glance.

**Layout:** A single horizontal IRI rendered as a string, with three colored brackets beneath it labeling each part. To the right, a side panel shows the part the user has hovered or clicked.

**Visual elements:**

- The IRI `http://adlnet.gov/expapi/verbs/passed` rendered in monospace, ~24pt
- Three colored highlight brackets: scheme (blue, `http://`), namespace (green, `adlnet.gov/expapi/verbs/`), local name (orange, `passed`)
- A right-side info panel describing the hovered/clicked part, with a one-line example
- Below the main IRI, a row of three additional IRIs the user can click to swap the active example: an ADL verb, a tincan verb, and a custom verb

**Interaction:**

- Hover over a part: that part highlights, info panel updates
- Click an alternative IRI: replaces the main IRI and updates highlighting
- Toggle "Show invalid examples": replaces the row with malformed IRIs (e.g., `passed`, `myapp:verbs/done`) and shows why each is rejected

**Default canvas:** 950×420px with media queries; falls back to a stacked layout below 700px.

Implementation: p5.js for the canvas drawing and hover detection; HTML overlay for the info panel.
</details>

## The ADL Verb Registry

The **ADL Verb Registry** is the canonical, ADL-maintained list of standard verbs that the xAPI community has agreed to share. ADL stands for Advanced Distributed Learning — the U.S. Department of Defense initiative that originally sponsored the xAPI specification. The registry lives at `http://adlnet.gov/expapi/verbs/` and contains a curated set of verbs that cover the common kinds of learning events: completion, attempts, assessment outcomes, content consumption, and session lifecycle.

You should reach for an ADL verb first, every time. The registry is small, deliberate, and intentionally not exhaustive — its size is a feature. A verb that exists in the ADL registry has a well-defined meaning, has been used in production by thousands of deployments, and works out-of-the-box with most xAPI dashboards and reporting tools. A verb you invented yesterday has none of those properties.

The twelve ADL verbs you'll meet most often in an intelligent textbook break into four functional groups. Before we list them, the four groups in plain language so the table afterward summarizes rather than introduces:

- **Content-consumption verbs** describe a learner engaging with material without an explicit assessment outcome. These are the verbs you'll emit on every page view, video play, or simulation hover.
- **Assessment verbs** describe attempts at structured tasks with a pass/fail outcome — quizzes, tests, exercises that expect a "right answer."
- **Progress verbs** describe forward motion through structured material when there's no single pass/fail moment — adaptive flows, self-paced reading, scaffolded exercises.
- **Session-lifecycle verbs** mark the formal beginning and end of a tracked session, and exist primarily for cmi5 compatibility.

| Group            | Verb           | IRI suffix        | When to emit                                                              |
|------------------|----------------|-------------------|---------------------------------------------------------------------------|
|Content consumption|`experienced`| `/verbs/experienced`| Learner observed or interacted with content without a pass/fail outcome      |
|Content consumption|`interacted` | `/verbs/interacted` | Learner manipulated an interactive element (slider, button, MicroSim control)|
|Assessment         |`attempted`  | `/verbs/attempted`  | Learner began an activity with a defined outcome                             |
|Assessment         |`passed`     | `/verbs/passed`     | Learner met the success criteria for an attempted activity                   |
|Assessment         |`failed`     | `/verbs/failed`     | Learner did not meet the success criteria                                    |
|Assessment         |`scored`     | `/verbs/scored`     | A score was recorded against an activity (often paired with passed/failed)   |
|Progress           |`progressed` | `/verbs/progressed` | Learner moved forward through structured material; partial state             |
|Progress           |`completed`  | `/verbs/completed`  | Learner reached the end of an activity, regardless of pass/fail              |
|Session lifecycle  |`launched`   | `/verbs/launched`   | A learning session was opened by an external launcher (cmi5)                 |
|Session lifecycle  |`initialized`| `/verbs/initialized`| Activity Provider has finished setup and is ready to record statements       |
|Session lifecycle  |`terminated` | `/verbs/terminated` | Activity Provider closed the session cleanly                                 |
|Session lifecycle  |`abandoned`  | `/verbs/abandoned`  | Session ended without a clean termination (timeout, tab close)               |

The pairings to internalize. `passed` and `failed` always travel with `attempted`, in that temporal order. `completed` is independent of both — a learner can complete and pass, complete and fail, or complete with no success/failure judgment at all. `scored` is most useful when you want to record a score *without* committing to a pass/fail interpretation — automatic graders that will be reviewed later, peer-assessed work, formative assessments without a cutoff. And the four session-lifecycle verbs are best thought of as a group: cmi5 sessions canonically follow `launched → initialized → (one or more progress/assessment statements) → completed/passed/failed → terminated`, with `abandoned` substituting for `terminated` when the learner walked away.

## The Tincan Verb Vocabulary

Before xAPI 1.0 was finalized in 2013, the spec was called Tin Can API and used a different verb vocabulary maintained at `http://activitystrea.ms/schema/1.0/`. That older registry — the **Tincan Verb Vocabulary** — predates xAPI and was inherited from a more general "activity stream" specification used outside learning. It contains many verbs that don't quite fit learning analytics (`favorite`, `friend`, `tag`) alongside some that do (`attended`, `commented`).

You'll see tincan verbs in two situations: legacy data from pre-2013 deployments that nobody migrated, and modern deployments that adopted them early and stuck with them out of inertia. New textbooks should not emit tincan verbs. If you inherit a deployment that does, leave existing data alone (statements are immutable anyway), but switch new emissions to the ADL registry. Mixed registries inside one deployment makes dashboards confusing — `http://activitystrea.ms/schema/1.0/complete` and `http://adlnet.gov/expapi/verbs/completed` are different verbs that any reasonable human would consider the same.

## A Tour of the Twelve

We just listed the canonical twelve. Now let's see them in action — a sequence of statements describing one learner's journey through a single textbook chapter, in the order they'd actually be emitted. Read top to bottom; each statement's verb is highlighted by the comment.

```json
// 1. Learner opens the chapter — content-consumption
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/experienced",
            "display": { "en-US": "experienced" } },
  "object": { "id": "http://textbook.example.org/chapters/quadratics" } }

// 2. Learner manipulates an interactive grapher MicroSim
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/interacted",
            "display": { "en-US": "interacted" } },
  "object": { "id": "http://textbook.example.org/microsims/parabola-grapher" } }

// 3. Learner advances past the warm-up section
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/progressed",
            "display": { "en-US": "progressed" } },
  "object": { "id": "http://textbook.example.org/chapters/quadratics/section-2" },
  "result": { "completion": false } }

// 4. Learner starts the quiz
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/attempted",
            "display": { "en-US": "attempted" } },
  "object": { "id": "http://textbook.example.org/chapters/quadratics/quiz" } }

// 5. Learner gets the score recorded
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/scored",
            "display": { "en-US": "scored" } },
  "object": { "id": "http://textbook.example.org/chapters/quadratics/quiz" },
  "result": { "score": { "scaled": 0.92 } } }

// 6. Learner passes the quiz
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/passed",
            "display": { "en-US": "passed" } },
  "object": { "id": "http://textbook.example.org/chapters/quadratics/quiz" } }

// 7. Learner finishes the chapter
{ "verb": { "id": "http://adlnet.gov/expapi/verbs/completed",
            "display": { "en-US": "completed" } },
  "object": { "id": "http://textbook.example.org/chapters/quadratics" } }
```

That single learner's chapter generated seven statements with six different verbs. A second learner who failed the quiz would emit the same first five statements, then `failed` instead of `passed`, and possibly never emit `completed`. The patterns are starting to look obvious — and that's exactly the point. Once you know the canonical verbs, reading these sequences becomes second nature.

#### Diagram: Canonical Verb Explorer

<details markdown="1">
<summary>Canonical Verb Explorer</summary>
Type: interactive-infographic
**sim-id:** canonical-verb-explorer<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Remembering / Understanding):** Recall the twelve canonical ADL verbs used in intelligent textbooks and explain when each is appropriate.

**Diagram type:** Mermaid flowchart, LR direction, with click handlers on every verb node.

**Structure:**

- Four colored cluster nodes labeled "Content Consumption," "Assessment," "Progress," "Session Lifecycle"
- Each cluster fans out to its member verbs:
    - Content Consumption → `experienced`, `interacted`
    - Assessment → `attempted`, `passed`, `failed`, `scored`
    - Progress → `progressed`, `completed`
    - Session Lifecycle → `launched`, `initialized`, `terminated`, `abandoned`

**Mermaid config:** project standard (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`, `useMaxWidth: true`, `securityLevel: 'loose'`).

**Click behavior:** Each verb node opens a side-panel infobox showing the full IRI, a one-line definition, a one-line "when to emit" rule, and a complete example statement using that verb.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel. The side panel pulls content from a `data.json` keyed by verb local name; pre-populating that JSON from the project glossary is recommended.
</details>

## When to Design a Custom Verb

Custom verbs exist for the cases the canonical registry doesn't cover. Some textbooks genuinely need them — a physics simulation might want a `calibrated` verb that no canonical equivalent really captures. Most textbooks don't.

Before you design a custom verb, run through this filter:

1. **Is there an ADL verb that's "close enough"?** "Close enough" usually wins. `interacted` plus a result extension that captures the *kind* of interaction is almost always better than inventing `clicked-on-thing-1`.
2. **Will another team's dashboard need to query this?** If yes, custom verbs raise the cost. Cross-team analytics requires shared vocabulary.
3. **Will this verb still make sense in two years?** Verbs designed around the implementation details of a specific UI don't age well. Verbs designed around the *learner's intent* age fine.
4. **Could this be expressed by combining a canonical verb with an extension?** A canonical verb plus an extension is almost always more interoperable than a brand-new verb.

If you've answered "no, no, yes, no" — you have a case for a custom verb. Otherwise, lean on the canonical set.

!!! mascot-warning "Common Pitfall — Verb Sprawl"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Xavi raising a tentacle in caution">
    The single most common verb-vocabulary mistake is letting every developer mint verbs ad-hoc. Within a year you'll have `clicked`, `clicked-on`, `pressed`, `pressed-button`, and `tapped` — five verbs for one event, and dashboards that have to OR them all together. Pick a verb steward on day one. Make verb additions a pull request, not a personal decision.

## Custom Verb Profiles — Doing It Right

A **custom verb profile** is a documented set of custom verbs (and often custom activity types and extensions) that a project has formally adopted. The profile lives at a stable URL inside a namespace the project owns, contains both human-readable definitions and machine-readable metadata, and is referenced from statements via the `category` context activity bucket (Chapter 3) so that consumers can detect which profile a statement was authored under.

A minimal profile is a JSON-LD document at a stable URL. Here's a stripped-down example for a fictional `calibrated` verb that an interactive physics textbook might define:

```json
{
  "@context": "https://w3id.org/xapi/profiles/context",
  "id": "https://textbook.example.org/profiles/physics-v1",
  "type": "Profile",
  "prefLabel": { "en": "Interactive Physics Textbook Profile v1" },
  "definition": { "en": "Custom verbs for instrumented physics simulations." },
  "concepts": [{
    "id": "https://textbook.example.org/xapi/verbs/calibrated",
    "type": "Verb",
    "prefLabel": { "en": "calibrated" },
    "definition": {
      "en": "Indicates the learner adjusted simulation parameters to match a target reading or condition before running the simulation."
    }
  }]
}
```

The fields worth understanding before you write your own:

- **`@context`** — the JSON-LD context that tells consumers how to interpret the rest of the document. Use the canonical xAPI Profiles context shown above; don't invent your own.
- **`id`** — the profile's IRI. Use a namespace you control. Versioning the path (`/profiles/physics-v1`) is the right move; you'll want a v2 someday.
- **`concepts`** — the array of verbs (and activity types and extensions) the profile defines. Each entry has its own IRI, type, label, and definition.

A profile is a contract. Once a verb is in a published profile, treat it as if you can never change its meaning — you can only deprecate it and add a successor. That discipline is what makes profiles useful for multi-team analytics.

## Verb Vocabulary Design — Putting It Together

**Verb vocabulary design** is the engineering discipline of choosing, documenting, and governing the verbs your textbook will emit. It's a small but high-leverage piece of the implementation. Done well, it costs you a half-day at the start of the project and saves months of dashboard rework. Done poorly, it produces an LRS full of statements nobody can confidently aggregate.

A reasonable vocabulary-design process for a new intelligent textbook:

1. **Inventory the events.** List every learner interaction the textbook will emit a statement for: page reads, MicroSim manipulations, quiz attempts, video plays, hint requests, navigation jumps, and so on.
2. **Map each event to a canonical verb.** Use the ADL verb that best fits. Note where the fit is strained.
3. **Identify the gaps.** For events with no good canonical match, decide whether an extension on a canonical verb solves the problem.
4. **Mint custom verbs only for genuine gaps.** For each, document: IRI, definition, when to emit, when *not* to emit, an example statement.
5. **Publish the profile.** A real URL, a real version, a real changelog.
6. **Wire it into code review.** New emit sites that don't use a vocabulary verb are blocked at PR time.

Before we look at the decision-tree diagram, here's the design principle in one sentence: *every emit site should be able to point at the documented verb it uses and the project profile that vouches for it*. If a developer has to invent a verb to ship a feature, the feature waits for a vocabulary update.

#### Diagram: Verb Selection Decision Tree

<details markdown="1">
<summary>Verb Selection Decision Tree</summary>
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
</details>

## Interactive Component Instrumentation

**Interactive component instrumentation** is the practice of wiring xAPI emit calls into the interactive elements of an intelligent textbook — MicroSims, quizzes, branching activities, video players, drag-and-drop exercises, and anything else that produces an event when the learner touches it. The verbs from this chapter are the vocabulary you'll use; the instrumentation is where they meet code.

The pattern, at the level of a single interactive element, is small and repeatable:

1. The component identifies the kind of event (interaction, attempt, completion).
2. The component looks up the project-approved verb for that event kind.
3. The component constructs a statement using the project's pattern for that verb (Chapter 3).
4. The component hands the statement to a shared client library that handles batching, retry, and authentication (Chapters 7–9).

The component itself stays narrow. It knows what just happened in the UI and which verb describes it. Everything else — the activity IRI, the parent context, the actor identity — comes from the surrounding page context and the shared client library. This separation matters because it keeps the verb-vocabulary decisions concentrated in a few well-reviewed files instead of scattered across hundreds of components.

Here's a minimal JavaScript handler for a MicroSim slider that emits an `interacted` statement when the learner stops adjusting (debounced) — the kind of code that ends up running in dozens of places once the textbook is mature. Note the imported helpers: `getCurrentLearner` and `xapiClient` are project-wide singletons defined elsewhere; `buildInteractedStatement` is a builder that implements the project's pattern.

```javascript
import { getCurrentLearner } from "../identity.js";
import { xapiClient } from "../xapi/client.js";
import { buildInteractedStatement } from "../xapi/patterns.js";

let debounce;

slider.addEventListener("input", () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const stmt = buildInteractedStatement({
      learner: getCurrentLearner(),
      activityIri: "http://textbook.example.org/microsims/parabola-grapher",
      extension: {
        "https://textbook.example.org/extensions/v1/slider-value": slider.value
      }
    });
    xapiClient.send(stmt);
  }, 250);
});
```

The component knows three things: which slider, what the new value is, and that an interaction happened. It does not know the learner's identity, the LRS endpoint, the authentication header, or how to retry on failure. Those concerns live elsewhere. That's the point.

#### Diagram: Component Instrumentation MicroSim

<details markdown="1">
<summary>Component Instrumentation MicroSim</summary>
Type: micro-sim
**sim-id:** component-instrumentation-microsim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Manipulate a fake interactive textbook component (slider, button, quiz item) and observe the resulting xAPI statements appear in a side panel — building intuition for which verbs map to which UI events.

**Layout:** 2/3 (left) interactive textbook component + 1/3 (right) live statement log, responsive.

**Visual elements (left panel):**

- A slider labeled "Parabola coefficient `a`" that updates a small parabola plot
- A button labeled "Run Simulation"
- A quiz radio-group with three options
- A button labeled "Submit Quiz"

**Visual elements (right panel):**

- A scrolling log of the most recent ten statements emitted by the component
- Each entry shows verb (highlighted), object IRI (truncated), and timestamp
- Click an entry to expand the full statement JSON

**Interaction:**

- Sliding the parabola control emits debounced `interacted` statements (250ms)
- Clicking "Run Simulation" emits an `experienced` statement
- Selecting a radio option emits no statement (component-internal state)
- Clicking "Submit Quiz" emits `attempted`, then `scored`, then either `passed` or `failed` based on the selected radio

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the parabola plot and the slider/button visuals; HTML radio inputs and statement log overlay.
</details>

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 5.

- You can read a verb IRI and identify its scheme, namespace, and local name.
- You know the twelve canonical ADL verbs an intelligent textbook will use most often, and you can match each to the kind of event it describes.
- You can spot a tincan verb in legacy data and explain why a new deployment shouldn't emit them.
- You can apply the verb-selection decision tree to a new event and justify your choice.
- You can describe what a custom verb profile contains and why publishing one matters.
- You can outline a vocabulary-design process for a new textbook from inventory through code-review enforcement.
- You can sketch the wiring between a UI component and the shared xAPI client library.

!!! mascot-celebration "Words, Chosen Carefully"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating the right word choice">
    Verbs are how learning shows up in your data. The team that picks them carefully gets dashboards that mean something. The team that doesn't ends up rebuilding their analytics layer in year two. You are now in the first camp. Chapter 5 turns to the *other* part of the statement subject — the actor — and the deceptively deep question of how you identify a learner across devices, sessions, and years without leaking who they are.
