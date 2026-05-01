---
title: Intelligent Textbook xAPI Architecture
description: Interactive Mermaid MicroSim showing how a learner's interaction in an intelligent textbook propagates from a MicroSim, quiz, or adaptive branch through the xAPI client library to the LRS.
status: built
library: Mermaid
bloom_level: Understand
bloom_verb: Identify
---

# Intelligent Textbook xAPI Architecture

## Learning Objective

Identify each layer of an xAPI-instrumented intelligent textbook and trace how
a learner's interaction propagates from a MicroSim through the client library
to the LRS.

- **Bloom Level:** Understand
- **Bloom Verb:** Identify
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="702" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## About This MicroSim

This clickable Mermaid diagram is a layered map of an intelligent textbook
that has been wired up for xAPI. The flow runs top-to-bottom, in the same
order a single learner interaction travels at runtime:

1. **Markdown content** at the top — the chapter the learner is reading,
   rendered by MkDocs Material.
2. **Component layer** — the three places interactions originate: a
   **MicroSim**, a **Quiz**, or **Adaptive Branching** logic.
3. **xAPI Client Library** — the single API that all components call. From
   the component's point of view, recording an event is one function call.
4. **Client internals** — what the client library does behind the curtain:
   the **Statement Builder** assembles a valid xAPI statement, the **Batch
   Buffer** queues it, the **Retry Manager** handles transient network
   failures, and the **Auth Header Manager** stamps each request with the
   right credentials.
5. **Fetch API → LRS HTTP API** — the actual `POST /statements` over the
   wire.
6. **LRS Storage** — the durable, queryable Learning Record Store.

Click any node to see the component's responsibility, the chapter section
that covers it, and a one-line code reference.

## Why This Architecture View Matters

When developers first read the xAPI specification, the reaction is often
"there's a lot here." A layered architecture diagram is the cure: it shows
that each layer has *one job*, and that the messy parts (auth, retry,
batching, statement formatting) are isolated in the client library so the
component code stays small.

A few things worth noticing as you click around:

1. **Three components, one client.** Whether the event comes from a
   MicroSim, a quiz, or branching logic, it goes through the same library.
   That's the abstraction that lets a textbook swap LRS providers by
   changing one config object.

2. **Internals fan out, then fan in.** The client library splits the work
   across four specialists (build, buffer, retry, auth) and then the Fetch
   API joins them back together for the actual HTTP call. The fan-out is
   why the code stays testable; the fan-in is why there's exactly one place
   that talks to the network.

3. **The line between in-browser and on-server.** Everything above
   `Fetch API → LRS HTTP API` is JavaScript running in the learner's tab.
   Everything below it is the LRS. Knowing which side of that line you're
   on determines what failure modes you need to handle.

## How to Use

**For independent reading:**

1. Click each node from top to bottom in the order shown. Read the
   responsibility, the chapter section, and the code reference.
2. Re-trace the flow for a single concrete event — e.g., "the learner
   submits answer C on quiz Q3." At each layer, ask: *what does this
   component do for that one event?*
3. Identify the layer you'd touch first if a real-world bug appeared:
   - Statements arriving without a timestamp → Statement Builder
   - Statements lost when the laptop closes → Batch Buffer / persistence
   - 401 responses from the LRS → Auth Header Manager
   - Statements duplicated after a flaky network → Retry Manager

**For classroom use:**

Project the diagram and have students predict, before clicking, which
layer is responsible for each of the four bug scenarios above. The
discussion that follows is usually richer than the answers themselves.

## Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/intelligent-textbook-xapi-architecture/main.html"
        height="702px"
        width="100%"
        scrolling="no"></iframe>
```

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
- [The xAPI Statement Triple — Actor / Verb / Object](../xapi-statement-triple/index.md)
- [xAPI Statement Anatomy](../xapi-statement-anatomy/index.md)

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section 7
   (Communication). [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. Rustici Software. *xAPI Best Practices* — guidance on client library
   design and statement batching.
3. MkDocs Material documentation — embedding interactive content via
   iframes. [https://squidfunk.github.io/mkdocs-material/](https://squidfunk.github.io/mkdocs-material/)
