---
title: Pseudonymization Pipeline
description: "Interactive Mermaid pipeline showing how learner identity flows from the LMS through the textbook into the LRS, and which hops expose identifying data."
status: approved
library: Mermaid
bloom_level: "Analyze"
bloom_verb: Trace
---

# Pseudonymization Pipeline

<iframe src="main.html" height="582" width="100%" scrolling="no"></iframe>

[Run the Pseudonymization Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Learning Objective

**Bloom — Analyzing:** Trace the flow of identity information from the LMS
through the textbook into the LRS, identifying at each hop what level of
identifying detail is exposed.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace
- **Library:** Mermaid

## About This MicroSim

This MicroSim renders the **pseudonymization pipeline** — the path a learner's
identity takes from the registrar's database, through the launch handshake,
into xAPI statements, into the LRS, and finally into a dashboard. Click any
hop to see what data exists at that point, who has access, and what the
privacy posture is.

Two hops are colored **red** (identifying): the LMS user record at the start,
and the audited re-identification lookup at the end. Everything in between is
**green** (pseudonymous) — the textbook, the statements, the LRS, and the
dashboard never need to know that <code>stu-8f3a2b1c</code> is Maya Chen.

The dashed arrow back to the LMS represents the rare, audited path used when a
human really does need to be re-identified — for grade reporting, an academic
integrity case, or accommodations. Clicking that node surfaces the audit-log
requirement that distinguishes lawful re-identification from unauthorized
de-anonymization.

## Why This Pipeline Matters

Learners often assume "pseudonymous" means "anonymous." It doesn't. A
pseudonym is a **stable, opaque key** that lets the analytics pipeline do its
job (joining statements per-learner, computing mastery, tracking progress)
without ever learning who the learner is. Two properties matter:

1. **The mapping exists, but it lives in exactly one place** — the LMS. The
   LRS, the dashboard, and the textbook code can all be breached without
   leaking real names. That's the point.
2. **The mapping is auditable.** When someone *does* re-identify a learner,
   the institution can see who looked up whom and why. Re-identification
   without an audit trail is the failure mode FERPA was designed to prevent.

This MicroSim makes those two properties visible side-by-side.

## How to Use

1. Click **LMS user record** first. Note the red badge — this is the only
   place where the learner is directly identifiable.
2. Walk left-to-right through Launch, Emit, LRS, and Dashboard. Each one is
   green. Ask yourself: "What pedagogical question can I still answer at this
   hop, even without knowing the learner's name?"
3. Click **Re-identification**. Read the required controls. Discuss: which of
   those controls is the easiest to forget, and what's the consequence?

## Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/pseudonymization-pipeline/main.html"
        height="452px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

College / Professional Development (developers, instructional designers,
privacy officers, LMS administrators, data engineers building learning
analytics pipelines).

### Duration

45–60 minutes for a full guided session, or 15–20 minutes for a quick
self-study walk-through.

### Materials Needed

- This MicroSim, projected or shared with each learner.
- Whiteboard or shared doc for the chokepoint diagram and the
  re-identification scenario.
- Optional: a handout with a blank pipeline (six empty boxes) so learners
  can fill in (a) what data exists, (b) who has access, and (c) the privacy
  posture at each hop before clicking.
- Optional: the project glossary entries for *pseudonym*, *re-identification*,
  *FERPA*, and *audit log*.

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Trace** the path of learner identity from LMS through LRS to dashboard
   and identify which hops expose identifying data.
2. **Distinguish** pseudonymous storage from anonymous storage and explain
   why pseudonymization is sufficient for most learning analytics work.
3. **Identify** the three audit controls required at the re-identification
   step and explain why removing any one of them is a FERPA-relevant defect.
4. **Recognize** the chokepoint architecture: identity is concentrated in
   the LMS so the rest of the pipeline can be safely shared and replicated.
5. **Defend** the design choice of putting an opaque pseudonym (not a name
   or email) into `actor.account.name` when given a counter-proposal that
   sounds convenient ("but emails are easier to read in the dashboard").

### Prerequisites

- Familiarity with the xAPI statement triple (Actor, Verb, Object).
- Awareness that an `actor.account.name` field exists in xAPI and can hold
  an arbitrary string — it does not have to be human-readable.
- Basic mental model of FERPA or comparable student-privacy regulation
  (helpful but not strictly required).
- Comfort with the idea of an LMS launching a tool via a redirect with
  signed parameters (LTI-style handshake). The launch protocol details
  don't matter for this lesson — only what crosses the boundary.

### Lesson Structure

#### 1. Hook — The Roster Question (5 min)

Open by posing the question: *"If a hostile actor stole the entire LRS
database tomorrow morning, would they have a class roster?"* Give learners
60 seconds to vote yes/no and write a one-sentence justification. Don't
reveal the answer — let the MicroSim do that.

#### 2. Pipeline Walk-Through (10 min)

Project the MicroSim. Click each hop in order, left to right, reading the
infobox aloud. After each click, pause and ask the class:

- "What pedagogical question can a teacher still answer with the data at
  this hop, even without knowing the learner's name?"
- "What question can they *not* answer here?"

The intended takeaway: almost every interesting analytics question
(completion rate, time-on-task, sticky concepts, mastery growth) only
needs a stable per-learner key — not a name.

#### 3. Spot the Chokepoint (5 min)

Ask: *"Of the six hops, which one is doing the most security work?"* Walk
the class to the answer: **LMS launch**. It is the one place where the
system *voluntarily declines* to forward identifying data, even though it
has it. Every downstream privacy guarantee in the pipeline depends on this
step doing its job correctly. If the launch handshake leaks the email by
mistake, the entire downstream pipeline becomes identifying — retroactively.

This is also a great moment to introduce the **chokepoint pattern** as a
general security principle: concentrate sensitive data in one place so you
have one place to audit, encrypt, monitor, and breach-investigate.

#### 4. Re-identification Scenario (10 min)

Pose this scenario: *"An instructor suspects academic dishonesty on a
quiz. They want to know which human submitted the statement keyed to
`stu-8f3a2b1c`."* Walk through:

- **Who** is allowed to perform the lookup? (Not every dashboard user —
  RBAC must gate the lookup button.)
- **What** must be logged? (Who looked up whom, when, and why.)
- **Under which policy** is this lawful? (The institution's documented
  re-identification policy — typically tied to FERPA legitimate
  educational interest.)

Then flip the scenario: *"A vendor's marketing team wants to know which
students have the lowest completion rates so they can target them with a
study-skills upsell."* Discuss why this is **not** a lawful re-identification,
even though the technical lookup is identical. The control that
distinguishes the two is policy, not code.

#### 5. Failure-Mode Discussion (10 min)

Run through three failure modes. For each, ask the class to predict the
blast radius before you reveal the answer:

- **The LMS leaks the pseudonym-to-name mapping table.** Every historical
  xAPI statement is now retroactively identifying. The pipeline cannot be
  "un-leaked" by rotating pseudonyms after the fact, because old statements
  are still keyed by the old pseudonyms.
- **The audit log is missing or never reviewed.** Re-identification still
  happens, but the institution cannot tell who looked up whom or why —
  which is precisely the FERPA violation the audit log is designed to
  prevent.
- **A well-meaning developer puts the learner's email into
  `actor.account.name` "to make the dashboard easier to read."** The entire
  LRS is now PII storage. Every backup, every replicated read-replica,
  every analytics partner who receives a statement export, suddenly has a
  roster.

The third one is the most common real-world failure. It looks like a
quality-of-life improvement and ships through code review with a thumbs-up
emoji.

#### 6. Wrap-Up — Eat Your Own Dog Food (5 min)

Close by pointing out the small twist hiding in this MicroSim's source
code: every click on the diagram **emits an xAPI statement of its own** to
a configurable LRS, using exactly the pseudonymous pattern the diagram
teaches. See the *Inside the Code* section below for the details. The
MicroSim is not just a lecture about pseudonymization — it is itself a
pseudonymous learning-analytics emitter. Learners can open their browser
console and watch the statements being constructed in real time.

### Discussion Questions

Use these for breakout groups, asynchronous discussion boards, or written
reflections.

1. Why is "pseudonymous" a stronger guarantee than the LRS having no PII
   *today*? (Hint: think about what a future engineer might add.)
2. The LRS sees the pseudonym `stu-8f3a2b1c` thousands of times across
   thousands of statements. Could the LRS itself, without ever talking to
   the LMS, *infer* who that learner is? Under what conditions? (Hint:
   linkage attacks, quasi-identifiers, time-of-day patterns.)
3. The dashed arrow in the diagram goes back to the LMS, not to the LRS.
   Why is that the right architecture? Why not let the dashboard hold its
   own copy of the pseudonym-to-name mapping for "convenience"?
4. Suppose your institution's privacy officer asks you to delete every
   statement belonging to a specific student under a right-to-be-forgotten
   request. Walk through the steps. What goes wrong if the LMS deleted the
   pseudonym mapping *before* the LRS deleted the statements?

### Assessment

Learners should be able to:

- Point to the two red hops in the pipeline and explain why each one is
  identifying.
- Explain the difference between *pseudonymous* and *anonymous* in their
  own words, with at least one example of an analytics question that works
  pseudonymously and one that requires re-identification.
- Name the three required controls on re-identification (audit log, RBAC,
  documented policy) and identify which one is the most commonly skipped
  in practice.
- Recognize that the security posture of the entire pipeline depends on
  the LMS launch step doing its job, and articulate what "doing its job"
  means concretely (forwarding the pseudonym, withholding the name and
  email).
- Spot, in a code review, an `actor.account.name` field that holds an
  email address rather than a pseudonym, and explain why it is a defect.

### Extension Activities

- **Code review drill:** Hand out a one-file pull request that adds
  `actor.name = student.fullName` to a statement-emit helper. Ask learners
  to write the review comment. Bonus points for explaining the *why* in a
  way the original author won't take personally.
- **Audit-log design:** Ask learners to design the schema for the audit
  table that backs the re-identification lookup. What columns? What
  retention policy? Who can query it?
- **Threat model:** Pick one hop and write a one-page threat model
  (STRIDE-lite is fine) for that hop. Trade with a partner and critique.

## Inside the Code: Why `emitInteractedStatement` Lives in the JavaScript

Open [pseudonymization-pipeline.js](pseudonymization-pipeline.js) and you
will find a function named `emitInteractedStatement(hopName)` that fires
every time a learner clicks one of the pipeline hops. It looks like a
small, almost easy-to-miss helper — but it is doing real instructional
work. Here is why it is there.

### The "Eat Your Own Dog Food" Principle

This MicroSim teaches the pseudonymization pipeline. The MicroSim itself
is *part of* a learning textbook. So it would be a strange omission if the
MicroSim did not emit xAPI statements about its own learners — and stranger
still if the statements it did emit leaked PII. By emitting a textbook xAPI
statement on every interaction, the MicroSim **demonstrates the very
pattern it is trying to teach**. Learners can:

1. Read the diagram and understand the pseudonymization pipeline conceptually.
2. Open their browser's network tab, click a hop, and watch a real xAPI
   statement get constructed and posted — using exactly the pseudonymous
   `actor.account.name` shape the diagram describes.
3. Confirm that no name, email, or other identifying field appears in the
   outgoing payload.

This is the same teaching trick used elsewhere in the textbook (the
verb-explorer MicroSim, the optimistic-concurrency state simulator): make
the artifact behave like the system it explains, so the learner can
instrument and inspect it.

### What the Function Actually Does

```javascript
function emitInteractedStatement(hopName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || {
            account: {
                homePage: 'https://textbook.example.org',
                name: 'stu-anon-reader'
            }
        },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/pseudonymization-pipeline#' + hopName,
            definition: {
                name: { 'en-US': 'Pipeline hop: ' + hopName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow */ }
}
```

Walk through the design choices line by line:

- **`if (!window.XAPI_LRS) return;`** — The function is a no-op when no LRS
  is configured. The MicroSim still works as a static educational diagram
  even with no telemetry stack behind it. This keeps the sim portable: it
  drops cleanly into the MkDocs site, into a standalone classroom demo, or
  into a fully instrumented production textbook, with zero code changes.
- **`actor: window.XAPI_LRS.actor || { ...stu-anon-reader }`** — The actor
  is supplied by the host page when the textbook has been launched with a
  real pseudonym. When it has not been (a casual reader on the public
  site), the fallback is `stu-anon-reader` — still pseudonymous, never a
  real identity. **There is no code path in this function that puts a name
  or email into the statement.** That is intentional and load-bearing: it
  is what the function is *teaching*.
- **`verb: 'interacted'`** — The ADL standard verb for "the learner did
  something with this activity, but we are not asserting completion or
  mastery." Click events are textbook (no pun intended) `interacted`
  statements.
- **`object.id`** — A unique IRI per pipeline hop, so the LRS can later
  answer: "Which hops do learners click most often? Which do they skip?
  Which hops correlate with later quiz performance on the privacy chapter?"
  This is real downstream analytics value, not decoration.
- **`try { ... } catch (e) { /* swallow */ }`** — Telemetry must never
  break the learner's experience. If the LRS endpoint is down, returns
  500, or rejects the statement, the diagram still works. **This is a
  rule for all client-side xAPI emitters:** failed telemetry is a
  monitoring problem, never a user-facing error.

### Note: Silent Telemetry Failures

The `catch` block above swallows errors so the UI keeps working — that is
correct behavior for client-side telemetry. But silent failures are a
classic source of "we thought we had data and we don't." If you adopt this
pattern in a production textbook, pair the swallow with **server-side
visibility**: log failed POSTs at the LRS gateway, alert on a non-zero
failure rate, and surface "no statements received in the last N hours" in
your operational dashboard. The client should never error; the operations
team should never be surprised.

### Why It Lives in the MicroSim Code, Not in a Shared Library

A reasonable question: shouldn't this emitter be a shared utility imported
by every MicroSim, instead of inlined here? In a production textbook with
dozens of sims, yes — and the textbook does have a shared emitter layer
that real production deployments would use. The function is inlined in
*this* MicroSim for two reasons:

1. **Pedagogical visibility.** A reader who opens the source file sees the
   complete, runnable, ~20-line implementation of "how to emit a
   pseudonymous xAPI statement." Hiding it behind an import would make
   the MicroSim less useful as a code-reading exercise. The teaching
   goal of this file is *show me the smallest correct example*.
2. **Drop-in portability.** Because the function has no imports, the
   entire MicroSim directory can be copied into another project, served
   from a different host, or pasted into the p5.js editor for
   experimentation, and it still works without resolving a module graph.

When you are ready to instrument a textbook for real, lift this function
into a shared client (`emitStatement`, `emitInteracted`, `emitCompleted`,
etc.) so every MicroSim points to one well-tested implementation — and
one place to fix when the LRS endpoint moves.

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section 4.1.2
   (Actor / Account). [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. U.S. Department of Education. *Family Educational Rights and Privacy Act
   (FERPA) — Guidance on De-Identification of Student Records*.
3. IMS Global. *Learning Tools Interoperability (LTI) Advantage* — privacy
   guidance on user identifier claims.
4. NIST SP 800-188. *De-Identifying Government Datasets* — pseudonymization
   patterns and re-identification risk.

## Related Resources

- [Chapter 5: Activities, Agents, and Learner Identity](../../chapters/05-activities-agents-identity/index.md)
