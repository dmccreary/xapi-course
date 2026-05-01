---
title: Optimistic Concurrency on the State Endpoint
description: Interactive Mermaid MicroSim that traces two concurrent clients writing to the same xAPI state document, illustrating ETag-based optimistic concurrency, the 412 Precondition Failed response, and the recovery path the losing client must take.
status: built
library: Mermaid
bloom_level: Analyze
bloom_verb: Trace
---

# Optimistic Concurrency on the State Endpoint

<iframe src="main.html" height="622" width="100%" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Trace two concurrent clients writing to the same state document and identify
which writer wins, which gets a 412 Precondition Failed, and what the losing
client must do to recover without overwriting the winner's data.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace
- **Library:** Mermaid

## About This MicroSim

This MicroSim renders the canonical optimistic concurrency dance on the xAPI
**state endpoint** as a clickable flowchart. Two parallel client lanes
(Client A and Client B) read the same state document, each receiving the
same `ETag: "v1"`. Both modify their local copies. Client A's `PUT` with
`If-Match: "v1"` arrives first, so the LRS accepts it and advances the ETag
to `v2`. Client B's `PUT` — also claiming `If-Match: "v1"` — now hits a stale
precondition and is rejected with `412 Precondition Failed`.

Click each node in the diagram to see the exact HTTP message at that step,
plus a one-line note on what a robust client implementation should do.

The recovery path is the part most learners need to internalize: a 412 is
*not* a fatal error. The losing client must re-read (`GET → ETag v2`),
**merge** its edits on top of the new base version, and retry the PUT with
`If-Match: "v2"`. Done correctly, no data is lost. Done incorrectly — say,
by retrying without merging, or by omitting `If-Match` entirely — the
winning client's edits get silently clobbered.

## Why This Matters

The state endpoint is where xAPI clients store free-form learner state
documents (think: where the learner is in a multi-page activity, which
checkboxes they've ticked, partial quiz responses). Unlike the
statements endpoint, which is append-only, the state endpoint supports
**arbitrary updates**. That makes it the one place in the xAPI surface
area where two well-behaved clients can step on each other's writes.

ETags + `If-Match` are the standard's answer. The MicroSim makes the
machinery visible: the version that's stored, the version each client
*thinks* is stored, and the moment those two diverge.

## How to Use

1. Click each node along **Client A's** lane in order. Notice that A's path
   is the "happy path" — read, modify, write, success.
2. Click each node along **Client B's** lane. Pause at the **412** node and
   read the LRS response carefully — the body is empty but the **`ETag` header
   tells Client B exactly what version it should reconcile against**.
3. Follow the recovery path: GET, merge, PUT with `If-Match: "v2"`. Note that
   the second PUT carries *both* clients' edits.
4. Try predicting: what happens if Client B retries with `If-Match: "v1"`
   instead of `v2`? (Answer: another 412 — the precondition check is exact,
   not "anything newer than v1.")

## Lesson Plan

### Grade Level

College / Professional Development (developers and instructional designers
implementing xAPI clients against a Learning Record Store).

### Duration

15–25 minutes (5 minutes to introduce, 10 minutes for guided exploration,
10 minutes for the reasoning exercises below).

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Trace** the sequence of HTTP requests and responses when two clients
   concurrently update the same state document.
2. **Identify** which client wins a concurrent write, which receives a 412,
   and why the LRS responds the way it does at each step.
3. **Describe** the recovery procedure a losing client must implement —
   re-read, merge, retry with the updated `If-Match` header.
4. **Recognize** the silent failure mode of omitting `If-Match` entirely
   (last-write-wins, with the earlier writer's edits lost forever).

### Prerequisites

- Familiarity with HTTP request/response anatomy (methods, headers, status codes).
- A working mental model of resource versioning. ETags are not required
  prior knowledge — this MicroSim is a reasonable place to learn them.
- Awareness of the xAPI **state endpoint** at a conceptual level (i.e.
  "the LRS exposes a key-value store for arbitrary learner state").

### Activities

1. **Read the diagram silently (2 min).** Before clicking anything, ask
   the class: *"Which client do you predict will win? Why?"* Most learners
   correctly guess that the timing decides — but cannot explain the
   mechanism. That's the gap the MicroSim closes.

2. **Walk Client A's lane (3 min).** Click each node along the left lane.
   At each step, the learner notes the version the client believes it
   holds vs. the version the LRS holds. They should be the same throughout
   A's lane.

3. **Walk Client B's lane to the 412 (4 min).** Click `B_GET`, `B_MOD`,
   `B_PUT1`, `B_412`. At `B_412`, the learner explicitly writes down: *"At
   this moment, Client B believes the document is at v1, but the LRS holds
   v2."* Naming the divergence in their own words is the key insight.

4. **Walk the recovery path (3 min).** Click `B_GET2`, `B_MERGE`, `B_PUT2`,
   `B_OK`. Pause on `B_MERGE` to discuss: *"What if Client B's edit
   conflicts with Client A's edit on the same field? Whose change wins?"*
   The honest answer — *the merge function decides, and you must write
   that merge function for your domain* — is more important than memorizing
   any HTTP detail.

5. **Pitfall discussion (5 min).** Discuss two failure modes the diagram
   doesn't show:
   - *Client B omits the `If-Match` header entirely.* The PUT succeeds and
     A's edits are lost without warning. (This is the canonical "footgun"
     — silent, easy to trigger, damaging.)
   - *Client B retries with `If-Match: "v1"` after the 412.* It just gets
     another 412, forever, until it re-reads. Treating a 412 like a
     transient 5xx error is a real bug pattern in production xAPI clients.

### Assessment

Learners should be able to:

- Look at a 412 response and articulate, unprompted, what state the LRS
  is in vs. what state the client thought the LRS was in.
- Sketch the four-step recovery sequence (re-read, merge, retry with new
  `If-Match`, verify success) without referring to the diagram.
- Explain in one sentence why omitting `If-Match` is dangerous, even
  when "everything appears to work."
- Name at least one merge strategy (last-write-wins, field-level union,
  domain-specific reconciliation) and one situation where each is
  appropriate.

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section 7.4
   (State Resource), Section 6.2 (Concurrency).
   [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. RFC 7232. *Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests* —
   the canonical specification for `ETag` and `If-Match`.
   [https://www.rfc-editor.org/rfc/rfc7232](https://www.rfc-editor.org/rfc/rfc7232)
3. Rustici Software. *xAPI State API explained.*
   [https://xapi.com/state-resource/](https://xapi.com/state-resource/)

## Related Resources

- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md)
