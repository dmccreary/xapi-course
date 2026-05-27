---
title: LRS Architecture Overview
description: "Interactive Mermaid MicroSim showing the components of a conformant Learning Record Store and how a request flows through them."
status: approved
library: Mermaid
bloom_level: "Understand"
bloom_verb: Identify
---

# LRS Architecture Overview

<iframe src="main.html" height="642" width="100%" scrolling="no"></iframe>

[Run the LRS Architecture Overview MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## Learning Objective

Identify the major components of a conformant LRS — the HTTP API layer, the
five endpoints, the storage layer, and the indexing layer — and explain how a
request flows through each.

- **Bloom Level:** Understand
- **Bloom Verb:** Identify
- **Library:** Mermaid

## About This MicroSim

This MicroSim renders the architecture of a conformant Learning Record Store
(LRS) as a clickable left-to-right flowchart. A **Client** (the Activity
Provider — a textbook page, an LMS, a mobile app) talks to the **xAPI HTTP
API** layer, which handles authentication and version negotiation before
fanning out to the five conformant endpoints: `/statements`, `/agents`,
`/activities`, `/activities/state`, and `/about`. Below the endpoints sit the
two implementation layers every LRS must have: a **Storage Layer** that holds
the canonical bytes of every statement, and an **Indexing Layer** of inverted
indexes that makes filtered queries fast.

The two flow nodes — **POST flow** and **GET flow** — make the read/write
asymmetry visible: a `POST /statements` writes to *both* Storage and Indexing
in the same transaction, while a `GET /statements` hits Indexing first to
resolve filters into IDs, then reads the full JSON documents from Storage.
Click any node to see what the component does, which xAPI fields it cares
about, and a one-line example request that exercises it.

## Why This Diagram Matters

xAPI specifies *what an LRS must do* without specifying *how it must be
built*. That can leave readers uncertain about what's actually inside the
black box. This diagram makes the inside concrete:

1. **The five endpoints are not interchangeable.** `/statements` is where the
   action lives; `/activities/state` is opaque key/value scratch space and is
   *not* a place to put analytics. Conflating the two is one of the most
   common architectural mistakes for teams new to xAPI.

2. **Storage and Indexing are separate concerns.** A statement is not "in"
   the LRS until it lives in *both* layers. Forgetting the indexing write is
   how a statement becomes silently unqueryable — present in the database,
   absent from every dashboard.

3. **The POST and GET paths are asymmetric.** Visualizing the two flow nodes
   side-by-side is what makes that click. Once a learner sees that GET hits
   Indexing first, the reason `?since=`, `?verb=`, and `?agent=` exist as
   first-class query parameters becomes obvious.

## How to Use

1. Click **Client** and **API** first to anchor the outside-in view.
2. Click each of the five endpoints in turn. After each, ask: *what is the
   one job this endpoint does that no other endpoint does?*
3. Click **Storage** and **Indexing**, then click **POST flow** and **GET
   flow**. The two flow nodes are the payoff — they explain why the
   architecture has both layers instead of one.

## Lesson Plan

### Grade Level

College / Professional Development (developers, instructional designers, and
LMS administrators learning the LRS contract).

### Duration

15–20 minutes.

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Name** the five conformant xAPI endpoints and the primary purpose of each.
2. **Distinguish** the Storage Layer from the Indexing Layer and explain why
   both are required.
3. **Trace** a `POST /statements` request and a `GET /statements` query
   through the LRS, identifying which layers each touches and in what order.
4. **Recognize** the `/activities/state` endpoint as scratch storage rather
   than analytics.

### Prerequisites

- Familiarity with HTTP verbs (GET, POST, PUT, DELETE).
- A working mental model of "JSON document store" vs "inverted index."
- Completion of the [xAPI Statement Triple](../xapi-statement-triple/index.md)
  MicroSim is recommended.

### Assessment

Learners should be able to answer:

- *Which endpoint would you call to bookmark a learner's last-viewed slide?*
  (Answer: `/activities/state` — and explain why it is **not** `/statements`.)
- *A statement was written successfully but does not appear in
  `GET /statements?verb=...`. What could have gone wrong?*
  (Answer: the indexing write may have failed even though the storage write
  succeeded — the two layers must stay in sync.)
- *Why does a GET query touch the Indexing Layer before the Storage Layer?*
  (Answer: indexes resolve the filter parameters into a small set of
  statement IDs; the storage layer is then read by ID, which is fast.)

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section 7
   (Communication). [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. ADL. *LRS Conformance Requirements*.
   [https://adlnet.gov/projects/xapi/xapi-lrs-conformance-requirements/](https://adlnet.gov/projects/xapi/xapi-lrs-conformance-requirements/)
3. Rustici Software. *Learning Record Store: A Technical Overview*.
   [https://xapi.com/learning-record-store/](https://xapi.com/learning-record-store/)

## Related Resources

- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md)
- [The xAPI Statement Triple](../xapi-statement-triple/index.md)
