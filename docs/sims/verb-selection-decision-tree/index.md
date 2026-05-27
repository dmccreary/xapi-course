---
title: Verb Selection Decision Tree
description: "Interactive Mermaid decision tree that walks the four questions for choosing between an ADL verb, an ADL verb plus extension, or a custom verb for any new emit site."
status: approved
library: Mermaid
bloom_level: Evaluate
image: /sims/verb-selection-decision-tree/verb-selection-decision-tree.png
og:image: /sims/verb-selection-decision-tree/verb-selection-decision-tree.png
twitter:image: /sims/verb-selection-decision-tree/verb-selection-decision-tree.png
social:
  cards: false
---

# Verb Selection Decision Tree

<iframe src="main.html" width="100%" height="1080" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/verb-selection-decision-tree/main.html"
        height="1000px" width="100%" scrolling="no"></iframe>
```

## Learning Objective

Apply a structured decision process to choose between an ADL verb, a
canonical verb plus extension, or a custom verb for any new emit site.

- **Bloom Level:** Evaluate
- **Bloom Verb:** Apply / Evaluate
- **Library:** Mermaid

## Description

The hardest design decision in xAPI is rarely "what verb?" — it's "how
hard should I look before I invent one?". Custom verbs are easy to add and
expensive to live with: every one creates documentation debt, governance
load, and a new term every analyst has to learn.

This decision tree compresses that judgment into four questions, asked in
order from cheapest outcome to most expensive:

1. **Is there an ADL verb that fits?** — search the registry first.
2. **ADL verb + extension covers it?** — capture the variation in a
   structured extension instead of inventing a verb.
3. **Custom verb cost < cost of forcing ADL fit?** — be honest about the
   real ongoing cost of a new term.
4. **Already in project profile?** — someone may already have made this
   call.

Click any node to read when to take that branch and a real-world example
for both directions.

## Lesson Plan

**Suggested length:** 8–12 minutes.

1. **Warm-up (1 min).** Click the start node. Note that the tree's first
   instinct is to *not* invent a verb. Why?
2. **Walk a known case (3 min).** A learner clicks "Submit" on a quiz.
   Trace the tree; you should land at *Use ADL verb (done)* via D1 → yes.
   Discuss why the registry is the right first stop.
3. **Walk an extension case (3 min).** A learner re-runs a MicroSim with
   new slider values. Trace; you should land at *Use ADL verb +
   extension* via D1 → no, D2 → yes. Discuss what the extension carries
   that the verb does not.
4. **Walk a custom-verb case (3 min).** A learner deliberately voids
   their last attempt and starts over. Walk to D3 and ask: is a custom
   verb cheaper than forcing `voided` here? (No — `voided` is itself an
   ADL verb. This is a trap to teach the question.)
5. **Discuss the steward role (2 min).** Why does node 5 (*Open
   profile-update PR*) require steward review? What goes wrong without
   one?

## Try This

- Trace a *bad* event you've seen instrumented in another product and
  decide which branch the original team should have taken.
- Pick any custom verb in your project profile. Could it have been an
  ADL verb plus extension instead? If yes, was the cost-comparison
  honest at the time?
- The tree has no "use someone else's profile's custom verb" branch.
  Should it?

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
- [ADL Verb Registry](https://registry.tincanapi.com/)

## References

- xAPI 2.0 Specification, §4.1.4.1 *Verb*
- ADL Verb Registry community profile
