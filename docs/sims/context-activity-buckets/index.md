---
title: Context Activity Buckets — Parent, Grouping, Category, Other
description: Interactive Mermaid MicroSim showing how a single xAPI statement's main object can be related to multiple activities through the four context activity buckets.
image: /sims/context-activity-buckets/context-activity-buckets.png
og:image: /sims/context-activity-buckets/context-activity-buckets.png
twitter:image: /sims/context-activity-buckets/context-activity-buckets.png
social:
   cards: false
status: approved
library: Mermaid
bloom_level: Understand
bloom_verb: Identify, Explain
---

# Context Activity Buckets — Parent, Grouping, Category, Other

<iframe src="main.html" height="462" width="100%" scrolling="no"></iframe>

[Run the Context Activity Buckets MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim renders the four **context activity buckets** as a clickable
flowchart radiating out from a single statement's main object — here, a
"Quadratics Quiz." Each fan-out shows one of the four typed relationships an
xAPI statement can express through `context.contextActivities`:

- **Parent** — the activity that *directly contains* the main object
- **Grouping** — a set the main object *is a member of*
- **Category** — a classifier (usually a profile IRI) the statement *conforms to*
- **Other** — a catch-all for anything else *associated with* the main object

Click any node to see that bucket's job, the relationship it expresses, and a
realistic JSON example. The center node (the main object itself) explains the
big picture: one main object, up to four buckets, each holding a list of
related activities.

Like the other interactive elements in this textbook, this MicroSim eats its
own dog food — every click emits an xAPI `interacted` statement to the
configured Learning Record Store (`window.XAPI_LRS`) when one is present.

## Why This Diagram Earns Its Keep

The four context activity buckets are one of those parts of xAPI that the
spec describes in a few crisp sentences and that quietly trips up almost
every team building their first integration. The trouble is that all four
buckets carry **lists of activities** with the same JSON shape — the only
thing distinguishing `parent` from `grouping` from `category` from `other`
is the property name and the relationship that name implies.

That's a lot of meaning to load onto four English words.

A few reasons this MicroSim is worth a few minutes:

1. **It makes the relationships first-class.** A static diagram of four
   arrows would teach the *shape* but not the *semantics*. Click "Parent"
   and the panel says "directly contains." Click "Grouping" and it says
   "is a member of." Those phrases stick because they're tied to a node
   the learner just touched.

2. **It uses one realistic main object across all four buckets.** The
   Quadratics Quiz isn't redesigned for each bucket — it's the *same* quiz
   sitting inside four different relationships at once. Learners see that
   buckets aren't mutually exclusive; a single statement uses all four
   simultaneously when it's well-instrumented.

3. **It separates "container" from "membership" from "classifier."** This
   is the core insight: Parent is structural (where it lives), Grouping is
   set membership (what it's a part of), Category is type-tagging (what
   kind of statement this is), Other is "everything else." Conflating any
   two of these is how dashboards end up with broken rollups.

4. **It surfaces the profile-IRI use case for Category.** Most teams
   discover the `category` bucket the hard way — by failing a CMI5
   conformance check. The infobox calls this out directly so learners meet
   the gotcha *before* it bites them in production.

5. **It establishes vocabulary used by every later chapter.** Statement
   Patterns, profile authoring, and the whole conformance pipeline assume
   the reader can fluently name and distinguish the four buckets. This
   MicroSim is where that fluency forms.

## How to Use

**For independent reading:**

1. Click the dark center node first. Read what it means for an activity
   to be the statement's *main object* — and why the four buckets sit in
   `context.contextActivities` rather than replacing the object itself.
2. Click each of the four buckets in order: **Parent**, **Grouping**,
   **Category**, **Other**. After each, try to articulate the relationship
   in your own words *before* moving to the next.
3. After visiting all five nodes, ask yourself: *for an activity in my own
   domain, what would each of these four buckets contain?* If you can
   answer that, you've internalized the model.
4. Re-read the **Other** infobox carefully. The advice to consider an
   **extension** instead of `other` for typed, structured data is one of
   the most common pieces of feedback senior xAPI implementers give
   beginners.

**For classroom use:**

Project the MicroSim and pose the question *before* clicking each node:
"What's the difference between Parent and Grouping?" Get learners to
predict, then click to reveal. The Parent vs. Grouping distinction is
where most of the productive disagreement happens — the rest of the
discussion tends to follow naturally from there.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/context-activity-buckets/main.html"
        height="462px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

College / Professional Development (developers, instructional designers,
LMS administrators building or maintaining xAPI-emitting systems).

### Duration

15–20 minutes (5 minutes to introduce, 10 minutes for guided exploration,
5 minutes for the writing exercise below).

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Identify** the four context activity buckets by name and recall the
   relationship each expresses (`directly contains`, `is a member of`,
   `conforms to`, `associated with`).
2. **Distinguish** Parent (structural container) from Grouping (set
   membership), and explain why a single activity can be in only one
   parent but in many groupings simultaneously.
3. **Recognize** that the `category` bucket is how a statement declares
   conformance to an xAPI **profile**, and that some profiles (like CMI5)
   *require* a category context activity.
4. **Decide** when to use the `other` bucket vs. a custom extension for
   recording activity relationships that don't fit the first three.

### Prerequisites

- Familiarity with the xAPI statement triple (Actor, Verb, Object). The
  [xAPI Statement Triple MicroSim](../xapi-statement-triple/index.md) is
  the recommended prerequisite.
- Comfort reading short JSON snippets.
- A working mental model of "IRI" — context activities are identified by
  IRIs, the same URL-shaped identifiers used for verbs and activity types.

### Activities

1. **Orientation (3 min).** Read the chapter prose introducing
   `contextActivities`. Observe the diagram in passing — do not click yet.

2. **Center-out walkthrough (4 min).** Click the center node first to read
   the overview, then click each of the four buckets in order. After each,
   the learner pauses and writes down: (a) the relationship phrase, and
   (b) one example from their own domain that would fit that bucket.

3. **Distinguishing Parent from Grouping (4 min).** In pairs, learners
   complete this prompt: *"For a video lesson titled 'Forces in Two
   Dimensions,' the* parent *is ___ and a* grouping *might be ___."*
   Discuss the answers — the parent is unique; multiple groupings are
   possible.

4. **Profile-IRI exercise (5 min).** Given the prompt *"Your team has been
   asked to mark every formative assessment statement as conforming to
   CMI5 and to your school's local Math Profile,"* the learner writes the
   `category` array with the two IRIs. Surface the question: should
   profile A and profile B *both* go in `category`? (Yes — `category` is a
   list.)

5. **Pitfall discussion (3 min).** Re-open the **Other** infobox and read
   the advice about using extensions instead. Discuss: when does typed,
   structured extension data win over a generic `other` activity?

### Assessment

Learners should be able to:

- Look at a JSON statement's `contextActivities` block and immediately
  name which bucket each entry sits in and what relationship it expresses.
- Explain in one sentence why the same activity can appear in multiple
  buckets simultaneously without contradiction.
- Recall, unprompted, that `category` is where profile IRIs go and that
  some profiles require it.
- Distinguish a use case for `other` from a use case for a custom
  extension.

A short-answer quiz item at the end of the chapter ("In the statement
below, which bucket is missing and what conformance check might fail as a
result?") closes the loop.

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)
- [The xAPI Statement Triple MicroSim](../xapi-statement-triple/index.md) — recommended prerequisite

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section
   4.1.6.2 (Context Activities). [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. ADL. *CMI5 Specification* — required `category` context activity for
   conformance. [https://github.com/AICC/CMI-5_Spec_Current](https://github.com/AICC/CMI-5_Spec_Current)
3. xAPI Profile Server documentation on profile IRIs and the `category`
   bucket.
4. Rustici Software. *xAPI Statement Cookbook* — practical examples of
   `contextActivities` usage. [https://xapi.com/statements-101/](https://xapi.com/statements-101/)
