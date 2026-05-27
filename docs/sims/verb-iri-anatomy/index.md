---
title: Verb IRI Anatomy
description: "Interactive p5.js explorer that decomposes a verb IRI into its three parts (scheme, namespace, local name). Hover or click each part to see what it means; toggle to see invalid IRIs and why they're rejected."
status: approved
library: p5.js
bloom_level: Understand
image: /sims/verb-iri-anatomy/verb-iri-anatomy.png
og:image: /sims/verb-iri-anatomy/verb-iri-anatomy.png
twitter:image: /sims/verb-iri-anatomy/verb-iri-anatomy.png
social:
  cards: false
---

# Verb IRI Anatomy

<iframe src="main.html" height="422" width="100%" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/verb-iri-anatomy/main.html"
        height="422px" width="100%" scrolling="no"></iframe>
```

## Learning Objective

Decompose a verb IRI into its three parts (scheme + namespace + local name),
and recognize valid versus invalid verb IRIs at a glance.

- **Bloom Level:** Understand
- **Bloom Verb:** Decompose / Identify
- **Library:** p5.js

## Description

Every xAPI verb is identified by an **IRI** — an Internationalized Resource
Identifier. To the eye, the IRI looks like a single string; to xAPI, it has
internal structure. Understanding that structure is the difference between
debugging "why does my custom verb collide with the ADL one?" in five minutes
versus five hours.

This sim shows the three parts of a verb IRI:

- **Scheme** (blue) — the protocol, almost always `http://` or `https://`
- **Namespace** (green) — the publisher's path: e.g. `adlnet.gov/expapi/verbs/`
- **Local name** (orange) — the verb itself: `passed`, `experienced`, etc.

Hover any colored part to see what it means in the info panel. Click to lock
the selection. Use the buttons to swap in a TinCan verb or a custom verb and
see how each follows the same three-part pattern.

Toggle "Show invalid examples" to see common mistakes — a bare local name
without a scheme, a custom URI scheme like `myapp:`, or an IRI with spaces —
and read why each is rejected.

## Lesson Plan

**Suggested length:** 5–8 minutes.

1. **Identify the parts (2 min).** Default IRI is the canonical
   `passed` verb. Hover each colored part. Notice that the same English word
   "passed" only matters because of the namespace it lives under.
2. **Compare publishers (2 min).** Click TinCan, then Custom. Same shape;
   different namespace. The verb identity is the *whole* IRI, not the local
   name.
3. **Spot the failures (2 min).** Toggle invalid examples. Predict why each
   is rejected before reading the explanation.
4. **Discussion (1–2 min).** Why does xAPI require IRIs instead of plain
   strings like SCORM did? Why does the namespace matter even though most
   IRIs never resolve to a live page?

## Try This

- Two textbooks define a verb at `http://example.com/verbs/passed`. Same IRI,
  same namespace, same local name. Are these the same verb? (Yes — IRI
  equality is the definition.)
- Your team registers a custom verb at `https://corp.example/verbs/explored`
  and another at `http://corp.example/verbs/explored`. Are these the same
  verb? (No — `http://` and `https://` differ in the scheme.)
- Why does ADL's namespace not include a port number, language tag, or query
  string? What would change about IRI comparison if it did?

## Related Resources

- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../../chapters/04-verb-vocabulary-design/index.md)
- [ADL Verb Registry](https://registry.tincanapi.com/)

## References

- xAPI 2.0 Specification, §4.1.4.1 *Verb*
- RFC 3987 *Internationalized Resource Identifiers (IRIs)*
