---
title: Hosting Model Decision Tree
description: Interactive Mermaid decision tree for choosing between hosted SaaS, self-hosted open source, and embedded LRS deployments.
status: approved
library: Mermaid
bloom_level: "Evaluate"
bloom_verb: Apply
---

# Hosting Model Decision Tree

<iframe src="main.html" height="852" width="100%" scrolling="no"></iframe>

[Run the Hosting Model Decision Tree MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Learning Objective

**Bloom — Evaluating:** Apply a structured decision process to choose between
hosted SaaS, self-hosted open source, and embedded LRS for a given deployment
scenario.

- **Bloom Level:** Evaluate
- **Bloom Verb:** Apply
- **Library:** Mermaid

## About This MicroSim

This MicroSim is a clickable four-question decision tree that walks you from
"new xAPI deployment" to a concrete hosting recommendation. The four
questions — in order — are:

1. **Is the device often offline?**
2. **Does data sovereignty or regulation forbid third-party hosting?**
3. **Do we have ops capacity to run a database 24/7?**
4. **Is projected statement volume above 5,000 per second sustained?**

Each diamond and each outcome is clickable. The right-hand panel explains
*why* the question matters and, for outcomes, lists the platforms that
typically fit — Ralph, Learning Locker, Watershed, SCORM Cloud, Veracity,
GrassBlade, and the embedded patterns used for offline training.

The order of the questions is deliberate. Offline requirements are the
hardest constraint to work around (no network = no central LRS, full stop),
so they come first. Sovereignty comes next because policy almost always
trumps preference. Ops capacity is third because it's the question most
teams *underestimate*. Volume is last because it's the only one most
deployments will never hit.

## Why a Decision Tree Instead of a Comparison Table?

A comparison table tells you *what each option offers*. A decision tree
tells you *which option your situation allows*. For an Evaluating-level
objective — where the learner needs to apply criteria to a real scenario —
the tree shape is the right tool: it forces a path, not a feature shopping
list.

It also surfaces a fact that comparison tables hide: most deployments end
up in the **"either fits"** bucket. The middle path — connected, no
sovereignty constraint, modest ops, modest volume — describes the majority
of academic and corporate xAPI projects. Knowing that you're in that bucket
is itself a useful answer; it tells you the decision is now about
secondary factors (cost, time-to-launch, integration depth), not hard
constraints.

## How to Use

**For independent reading:**

1. Click **New deployment** to read the orientation.
2. Walk through the four diamonds in order. After each, predict the
   outcome before you click the next.
3. Visit each outcome to see which platforms map to that branch.
4. Re-run the tree mentally for a project you actually work on — which
   path do you land on?

**For classroom use:**

Project the MicroSim and present three short scenarios:

1. *A military training app for tablets used in low-connectivity field
   exercises.*
2. *A US university LMS plugin for a 30,000-student campus.*
3. *A Fortune-500 internal training platform with a strict EU data
   residency requirement.*

Have students predict the outcome path for each before clicking through.
Discuss disagreements — especially around the ops-capacity question, where
optimism about internal capability is the most common error.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/hosting-model-decision-tree/main.html"
        height="622px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

College / Professional Development (developers, instructional designers,
LMS administrators, IT decision-makers selecting an LRS hosting model).

### Duration

20–25 minutes (5 minutes to introduce, 10 minutes for guided exploration,
10 minutes for the scenario exercise).

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **List** the four primary criteria that distinguish LRS hosting models.
2. **Apply** the four-question decision tree to a concrete deployment
   scenario and justify the resulting recommendation.
3. **Identify** at least one representative platform in each of the three
   hosting categories (SaaS, self-hosted, embedded).
4. **Recognize** that "either fits" is a legitimate and common outcome,
   and articulate the secondary factors that should drive the choice in
   that case.

### Prerequisites

- Basic familiarity with what an LRS does (stores xAPI statements).
- A working sense of what "self-hosted" vs. "SaaS" means in any
  software context.

### Activities

1. **Orientation (3 min).** Read the chapter prose introducing hosting
   models. Glance at the diagram without clicking.
2. **Tree walkthrough (7 min).** Click each node from top to bottom. After
   each diamond, the learner writes down what would change about the
   recommendation if the answer flipped.
3. **Scenario exercise (10 min).** Given three deployment scenarios (see
   "Classroom use" above), the learner traces the tree for each and
   defends the outcome in one sentence.
4. **Pitfall discussion (5 min).** Re-open the **ops capacity** node and
   discuss why teams routinely overestimate this capability. What's the
   evidence for "yes, we can run it ourselves" — and is that evidence
   real?

### Assessment

Learners should be able to:

- Recite the four questions in order and explain why offline comes first.
- Map a real or hypothetical deployment to one of the five outcomes.
- Name at least one SaaS LRS, one self-hosted LRS, and one embedded
  pattern.
- Defend an "either fits" answer by listing the secondary factors that
  would tip the decision.

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3.*
   [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. France Université Numérique (FUN). *Ralph: an LRS for the modern web.*
   [https://github.com/openfun/ralph](https://github.com/openfun/ralph)
3. Learning Pool / HT2 Labs. *Learning Locker.*
   [https://www.learningpool.com/products/learning-locker](https://www.learningpool.com/products/learning-locker)
4. Watershed LRS. [https://www.watershedlrs.com/](https://www.watershedlrs.com/)
5. Rustici Software. *SCORM Cloud as an LRS.*
   [https://cloud.scorm.com/](https://cloud.scorm.com/)

## Related Resources

- [Chapter 7: LRS Platforms, Authentication, and Hosting Models](../../chapters/07-lrs-platforms-and-auth/index.md)
