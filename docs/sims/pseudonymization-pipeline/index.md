---
title: Pseudonymization Pipeline
description: Interactive Mermaid pipeline showing how learner identity flows from the LMS through the textbook into the LRS, and which hops expose identifying data.
status: built
library: Mermaid
bloom_level: "Analyze"
bloom_verb: Trace
---

# Pseudonymization Pipeline

<iframe src="main.html" height="452" width="100%" scrolling="no"></iframe>

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
privacy officers, LMS administrators).

### Duration

15–20 minutes.

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Trace** the path of learner identity from LMS through LRS to dashboard
   and identify which hops expose identifying data.
2. **Distinguish** pseudonymous storage from anonymous storage and explain
   why pseudonymization is sufficient for most analytics.
3. **Identify** the audit controls required at the re-identification step
   and explain why each one matters.
4. **Recognize** the chokepoint architecture: identity is concentrated in
   the LMS so the rest of the pipeline can be safely shared and replicated.

### Prerequisites

- Familiarity with the xAPI statement triple (Actor, Verb, Object).
- Awareness that an `actor.account.name` field exists in xAPI and can hold an
  arbitrary string.
- Basic mental model of FERPA or comparable student-privacy regulation
  (helpful but not required).

### Activities

1. **Walk the pipeline (5 min).** Click each hop in order, left to right.
   For each, write down (a) what data exists at that hop, and (b) who has
   access.
2. **Spot the chokepoint (3 min).** Ask the class: "Why is the LMS launch
   step the most important security boundary in this whole pipeline?"
   (Answer: it's the one place where identifying data is voluntarily *not*
   handed over.)
3. **Re-identification scenario (5 min).** Pose the scenario: "An instructor
   suspects academic dishonesty on a quiz. They want to know which student
   submitted statement <code>stu-8f3a2b1c</code>." Walk through which audit
   controls fire, who approves, and what gets logged.
4. **Failure-mode discussion (5 min).** Ask: "What goes wrong if the LMS
   leaks the pseudonym-to-name mapping?" (Answer: every historical xAPI
   statement is now retroactively identifying.) "What goes wrong if the
   audit log is missing?" (Answer: re-identification still happens, but you
   can't tell who did it or why — and FERPA is unhappy.)

### Assessment

Learners should be able to:

- Point to the two red hops in the pipeline and explain why each one is
  identifying.
- Explain the difference between pseudonymous and anonymous in their own
  words.
- Name the three required controls on re-identification (audit log, RBAC,
  documented policy).
- Recognize that the security posture of the entire pipeline depends on the
  LMS launch step doing its job.

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
