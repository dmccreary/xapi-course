---
title: Voiding Lifecycle Flow
description: "Interactive Mermaid pipeline tracing the lifecycle of a voided xAPI statement — from emit, through error discovery, voiding statement, LRS flagging, to default-query filtering and audit-path inspection."
status: approved
library: Mermaid
bloom_level: Analyze
image: /sims/voiding-lifecycle-flow/voiding-lifecycle-flow.png
og:image: /sims/voiding-lifecycle-flow/voiding-lifecycle-flow.png
twitter:image: /sims/voiding-lifecycle-flow/voiding-lifecycle-flow.png
social:
  cards: false
---

# Voiding Lifecycle Flow

<iframe src="main.html" width="100%" height="640" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/voiding-lifecycle-flow/main.html"
        height="940px" width="100%" scrolling="no"></iframe>
```

## Learning Objective

Trace the lifecycle of a statement that gets voided, identifying which
records persist in the LRS and which are filtered from default queries.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace / Identify
- **Library:** Mermaid

## Description

Voiding is one of xAPI's most misunderstood features. New authors often
expect "void" to mean "delete" — but xAPI never deletes. A voiding
statement is a *second* statement that references the first by UUID and
asks the LRS to flag it. Both records persist; the flag changes which
queries see the original.

This sim walks the eight-step lifecycle as a left-to-right pipeline:

1. AP emits the original statement with `uuid=fd41…`
2. LRS stores it
3. Default queries see it
4. AP discovers the error (out-of-band)
5. AP emits a *voiding* statement (`verb=voided`, `StatementRef=fd41…`)
6. LRS flags `fd41…` (without rewriting its bytes)
7. Default queries now filter out `fd41…`
8. Audit queries (`voided=true`) still see both

The dashed arrow from step 7 back to step 8 indicates that operators can
inspect voided records on demand — voiding is auditable, not destructive.

Click any node to read the operational and pedagogical details for that
step.

## Lesson Plan

**Suggested length:** 8–12 minutes.

1. **Set the trap (1 min).** Before clicking anything, ask: "if a
   statement is voided, is it deleted from the LRS?" Most learners say
   yes. Click step 6 — the LRS flags but doesn't rewrite. Click step 8 —
   audit queries still see the original.
2. **Walk steps 1–4 (3 min).** Discuss what "discovers error" means
   operationally. Why isn't the discovery part of xAPI itself?
3. **Walk steps 5–6 carefully (3 min).** The voiding statement *is*
   itself a permanent record. The original statement's bytes are not
   rewritten. Both observations matter; both are easy to forget.
4. **Compare default vs. audit query (2 min).** Step 7 vs step 8 — why
   does xAPI default to filtering voided records? Why is the audit path
   essential?
5. **Discussion (2 min).** What goes wrong if an LRS *did* delete on
   void? What goes wrong if it kept voided records visible to default
   queries by default?

## Try This

- Find the trap in step 5 (who is authorized to void what?). Discuss
  the security implications of unrestricted voiding rights.
- A learner argues "we should just have used PATCH." Refute or support.
- Map this lifecycle to a non-xAPI system you've worked with — how do
  GitHub revert commits, database tombstones, or accounting reversal
  entries embody the same pattern?

## Related Resources

- [Chapter 3: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments](../../chapters/03-advanced-statement-structure/index.md)

## References

- xAPI 2.0 Specification, §4.3 *Voiding Statements*
- xAPI 2.0 Specification, §4.1.4.6 *StatementRef*
