---
title: The xAPI Statement Triple — Actor / Verb / Object
description: Interactive Mermaid MicroSim for the xapi statement triple — actor / verb / object.
image: /sims/xapi-statement-triple/xapi-statement-triple.png
og:image: /sims/xapi-statement-triple/xapi-statement-triple.png
twitter:image: /sims/xapi-statement-triple/xapi-statement-triple.png
social:
   cards: false
quality_score: 95
status: approved
---

# The xAPI Statement Triple — Actor / Verb / Object

<iframe src="main.html" height="512" width="100%" scrolling="no"></iframe>

[Run the The xAPI Statement Triple — Actor / Verb / Object MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim renders the anatomy of a single xAPI **statement** as a clickable
flowchart. The dark "xAPI Statement" node at the center represents one
JSON-encoded learning event. Branching off it are the eight fields a statement
can carry: the three **required** parts (Actor, Verb, Object) shown in indigo,
and four optional-but-powerful parts (Result, Context, Timestamp, Authority)
shown in teal. Clicking any field reveals a definition, whether the field is
required, and a concrete example — including the failure modes that bite real implementers.

The MicroSim also eats its own dog food: every click emits an xAPI
`interacted` statement to the configured Learning Record Store
(`window.XAPI_LRS`). The textbook is teaching the standard *with* the standard.

## Why This Diagram Is Critical to Understanding xAPI

If a learner remembers nothing else about xAPI, they should remember this:
**every statement is Actor-Verb-Object, and everything else is decoration.**
That single sentence collapses an intimidating 100-page specification into a
shape that fits in working memory. Once the triple clicks, the rest of the
spec stops feeling like a wall of jargon and starts feeling like *modifiers*
hanging off a grammatically simple core.

A few reasons this triple deserves its own MicroSim:

1. **It maps to natural language.** "Lin passed the quadratics quiz" is
   already an Actor-Verb-Object triple. The standard didn't invent the shape;
   it just gave each part a JSON home, a globally unique identifier, and a
   way to attach evidence. Learners who see the linguistic parallel stop
   memorizing field names and start *reading* statements.

2. **It separates the irreducible from the optional.** Many xAPI tutorials
   throw all the fields at the reader at once and let them sort it out.
   The color-coded split (indigo = required, teal = optional, slate =
   the whole) makes the hierarchy visual: drop a required field and the
   statement is invalid; drop an optional field and the statement is just
   less interesting.

3. **It surfaces the pitfalls that lose people.** The infoboxes don't just
   define each field — they call out the silent failure modes: *if you
   forget `result.completion`, it isn't `false`, it's absent, and most LRSs
   treat absent and false differently.* Those gotchas usually live three
   chapters deep in the spec; this MicroSim brings them forward.

4. **It establishes the vocabulary the rest of the book will use.** Chapters
   on the Statement Model, Verb Vocabularies, Actor identification (IFIs),
   and Authority all assume the reader has internalized the triple. The
   MicroSim is where that internalization happens — through clicks, not
   prose.

5. **It demonstrates the "interactive textbook" thesis in miniature.** A
   static SVG of these eight fields would teach almost nothing. The same
   eight fields, made clickable with definitions and examples, become a
   reference the reader will return to throughout the course. That contrast
   — static-image-as-decoration vs. interactive-element-as-tool — is what
   the whole textbook is trying to demonstrate.

## How to Use

**For independent reading:**

1. Start by clicking **xAPI Statement** in the center to read the overview.
2. Visit the three required fields (Actor, Verb, Object) in order. After
   each, try to articulate in your own words what role that field plays in
   the sentence "Who did what to what?"
3. Visit the optional fields next. As you click each one, ask: "What
   question would I be unable to answer if this field were missing?"
4. Re-read the example values aloud. xAPI uses **IRIs** (URL-shaped
   identifiers) for verbs and activity types — getting comfortable with
   that visual shape early will save confusion in later chapters.

**For classroom use:**

Project the MicroSim on a screen and have the class predict — *before* you
click — what each field will say. Surface the disagreements before revealing
the definition. The Actor and Verb fields are usually predicted correctly;
**Authority** and the absent-vs-false issue in Result are the ones that
spark productive discussion.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/xapi-statement-triple/main.html"
        height="512px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

College / Professional Development (developers, instructional designers,
LMS administrators encountering xAPI for the first time).

### Duration

15–20 minutes (5 minutes to introduce, 10 minutes for guided exploration,
5 minutes for the writing exercise below).

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Identify** the three required fields of an xAPI statement and explain
   why each is necessary.
2. **Distinguish** required fields from optional fields, and articulate at
   least two questions that optional fields like Context and Timestamp let
   analysts answer.
3. **Translate** a plain-English description of a learning event ("Maya
   completed Chapter 4 yesterday at 2pm") into the corresponding triple of
   Actor, Verb, and Object values.
4. **Recognize** at least one common mistake in statement construction
   (e.g., the absent-vs-`false` distinction in `result.completion`).

### Prerequisites

- Basic familiarity with JSON syntax (objects, keys, strings).
- A working mental model of "URL" — verbs and activity types are identified
  by IRIs, which are URL-shaped.
- No prior xAPI knowledge required. This is typically the *first* MicroSim
  a learner encounters in the course.

### Activities

1. **Orientation (3 min).** Read the chapter prose introducing the triple.
   Observe the diagram in passing — do not click yet.

2. **Required-fields walkthrough (4 min).** Click **Actor**, then **Verb**,
   then **Object** in that order. After each, the learner pauses and writes
   down (a) what question the field answers, and (b) one example value
   relevant to their own domain.

3. **Optional-fields exploration (4 min).** Click each of the four optional
   fields. For each, the learner notes: "If I omit this field, what
   analytics question can I no longer answer?"

4. **Translate-and-write exercise (5 min).** Given the prompt
   *"Yesterday at 2pm, Maya from the engineering cohort scored 88% on the
   Recursion quiz on the practice platform,"* the learner identifies which
   parts of that sentence map to which xAPI fields. (Answer: Actor = Maya;
   Verb = scored/passed; Object = the Recursion quiz; Result = 0.88; Context
   = engineering cohort + practice platform; Timestamp = yesterday 2pm.)

5. **Pitfall discussion (3 min).** Re-open the **Result** infobox and read
   the note aloud. Discuss: why might an LRS treat
   `completion: false` differently from `completion` being absent? What
   would a dashboard report show in each case?

### Assessment

Learners should be able to:

- Look at a JSON statement and immediately point to the Actor, Verb, and
  Object — even when surrounded by optional fields.
- Explain in one sentence why an Actor is identified by an **Inverse
  Functional Identifier (IFI)** rather than a username.
- Name at least one optional field and the analytics question it unlocks.
- Recall, unprompted, the absent-vs-`false` distinction in Result.

A short-answer quiz at the end of the chapter ("In the statement below,
which field is missing and what's the consequence?") closes the loop.

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section 4
   (Statements). [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. ADL Verb Vocabulary. [https://registry.tincanapi.com/](https://registry.tincanapi.com/)
3. Rustici Software. *xAPI Statement Cookbook* — practical examples of
   statement construction. [https://xapi.com/statements-101/](https://xapi.com/statements-101/)
4. xAPI Profile Server documentation on Inverse Functional Identifiers (IFIs).
