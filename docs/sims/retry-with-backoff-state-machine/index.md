---
title: Retry-With-Backoff State Machine
description: Interactive Mermaid state diagram showing how an xAPI client batches, sends, retries, and offline-queues statements based on HTTP response codes.
status: built
library: Mermaid
bloom_level: Analyze
---

# Retry-With-Backoff State Machine

<iframe src="main.html" height="522" width="100%" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Trace the state transitions of a statement batch through the retry-with-backoff
pipeline and identify which HTTP response codes lead to which outcomes.

- **Bloom Level:** Analyze
- **Bloom Verb:** Trace
- **Library:** Mermaid

## About This MicroSim

A production xAPI client never sends statements one at a time, and it never
trusts the network to be reliable. Instead, it batches statements in memory,
flushes them as a group, and reacts to the LRS's response with one of three
strategies depending on what came back.

This MicroSim renders that decision flow as a clickable state diagram. Six
states cover the full lifecycle of a batch:

- **Buffering** — statements pile up in memory waiting for a flush trigger
- **Sending** — the POST is in flight (the only state with branching outcomes)
- **Success (2xx)** — terminal: the batch is durably stored on the LRS
- **Client Error (4xx)** — terminal: the request itself is wrong, do not retry
- **Backoff** — schedule a retry after an exponentially growing delay
- **Offline Queue** — terminal handoff: persist to local storage for later

Click any state to read what happens there, how long it typically lasts, and
which response codes drive its transitions.

## Why This Diagram Matters

The retry-with-backoff loop is where well-meaning xAPI integrations quietly
fail. The three most common production bugs all live in this state machine:

1. **Retrying 4xx responses.** A 400 Bad Request will *never* succeed no
   matter how many times you re-send it. Treating 4xx like 5xx wastes
   bandwidth and fills logs with noise. The state diagram makes the
   distinction visible: 4xx and 5xx leave the **Sending** state through
   different doors.

2. **Constant-delay retries.** Hammering an overloaded LRS every second
   makes recovery slower, not faster. Exponential backoff with jitter is
   the structural fix. The **Backoff** infobox spells out the formula.

3. **No offline queue.** Dropping the batch after max retries means
   statements are lost silently — the user sees nothing wrong, the LRS
   sees no data, and the analytics dashboard quietly under-counts. The
   **Offline Queue** terminal state is what makes the pipeline durable
   across flaky networks.

Once you can trace a batch through this diagram, you can reason about
client reliability without rereading the spec.

## How to Use

1. **Start at Buffering** and click each transient state in order
   (Buffering → Sending → Backoff). Note that Sending is the only state
   with more than one outgoing edge — every branching decision in the
   pipeline happens there.
2. **Visit each terminal state** (Success, Client Error, Offline Queue).
   For each, ask: "What does the client do next?" The answer is "nothing
   for this batch" — terminal states are where the batch's journey ends.
3. **Trace a scenario.** Imagine the LRS is briefly down (returning 503).
   Walk the diagram: Buffering → Sending → Backoff → Sending → ...
   How many round trips before the batch ends up in the Offline Queue?
   What if the failure is a typo in a verb IRI instead?

## Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/retry-with-backoff-state-machine/main.html"
        height="522px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

College / Professional Development (developers and instructional designers
implementing xAPI clients).

### Duration

15–20 minutes.

### Learning Objectives

By the end of this lesson, learners will be able to:

1. **Identify** the three transient states and the three terminal states in
   the retry-with-backoff pipeline.
2. **Trace** a batch through the diagram given an HTTP response code,
   correctly predicting the next state at each step.
3. **Distinguish** the response codes that should trigger a retry (5xx,
   network errors) from those that should not (4xx).
4. **Explain** why retries use exponential backoff with jitter rather than
   a constant delay.
5. **Recognize** the role of the Offline Queue in surviving network outages
   without dropping statements.

### Prerequisites

- Familiarity with HTTP status codes (2xx, 4xx, 5xx).
- Basic understanding of asynchronous JavaScript (Promises, timers).
- Completion of the chapter on the xAPI Statement Model.

### Activities

1. **Predict-then-click (5 min).** Before reading any infobox, students
   predict what happens in each state and write down their prediction.
   Then they click and compare.

2. **Scenario tracing (5 min).** The instructor names a scenario; students
   trace the path through the diagram on paper:
   - "The LRS returns 200 on the first try." (Buffering → Sending → Success)
   - "The LRS returns 401 because the API key expired." (Buffering → Sending → Client Error)
   - "The LRS returns 503 five times in a row." (Buffering → Sending → Backoff → ... → Offline Queue)

3. **Pitfall discussion (5 min).** Discuss: what would go wrong if the
   client treated 4xx like 5xx? What would go wrong if there were no
   Offline Queue? What would go wrong with constant 1-second retries
   during an LRS outage?

### Assessment

Learners should be able to:

- Given an HTTP status code, name the next state without consulting the
  diagram.
- Explain in one sentence why 4xx and 5xx are routed differently.
- Identify at least one production bug that the Offline Queue state
  prevents.

## References

1. ADL. *Experience API (xAPI) Specification, Version 1.0.3* — Section 7
   (Communication). [https://github.com/adlnet/xAPI-Spec](https://github.com/adlnet/xAPI-Spec)
2. Google SRE Workbook. *Handling Overload* — chapter on exponential backoff
   and jitter. [https://sre.google/workbook/](https://sre.google/workbook/)
3. MDN Web Docs. *Background Sync API* — pattern for offline queues in the
   browser. [https://developer.mozilla.org/](https://developer.mozilla.org/)

## Related Resources

- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../../chapters/08-implementing-in-textbooks/index.md)
