---
title: Implementing xAPI in Intelligent Textbooks
description: A hands-on tour of building the JavaScript/TypeScript client library that ships with an MkDocs-based intelligent textbook — covering statement construction, retry-with-backoff, error handling, client-side vs. server-side emission, MicroSim and quiz instrumentation, and mobile-web compatibility.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 12:00:00
version: 0.07
---

# Implementing xAPI in Intelligent Textbooks

## Summary

Hands-on JavaScript and TypeScript client library construction, MicroSim and quiz instrumentation, retry logic, error handling, and emission strategies. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Simulation Instrumentation
2. Quiz Instrumentation
3. Adaptive Branching Instrumentation
4. Level 3 Intelligent Textbook
5. MicroSim (p5.js)
6. LRS Server Log Analysis
7. JavaScript xAPI Client Library
8. Statement Construction
9. Retry-With-Backoff Pattern
10. Fetch API (HTTP)
11. JSON Serialization
12. TypeScript Type Definitions
13. MkDocs Intelligent Textbook
14. xAPI Client Library Design
15. Client-Side xAPI Emission
16. Server-Side xAPI Emission
17. Statement Authenticity
18. xAPI Error Handling
19. 4xx Error Patterns (LRS)
20. 5xx Error Patterns (LRS)
21. xAPI for Mobile Web
22. Responsive Web xAPI
23. Browser Compatibility (xAPI)
24. Polyfill Strategy

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../01-foundations-and-standards/index.md)
- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)
- [Chapter 3: Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments](../03-advanced-statement-structure/index.md)
- [Chapter 4: Verb Vocabulary Design and the ADL Verb Registry](../04-verb-vocabulary-design/index.md)
- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../06-lrs-architecture/index.md)

---

!!! mascot-welcome "Welcome to the Code Chapter"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus opening a laptop">
    Seven chapters of theory. One chapter of code. This is where the conceptual architecture stops being a diagram and starts being TypeScript that runs in your textbook. We'll build a real client library, wire it into MicroSims and quizzes, handle the failure modes, and ship something that survives a flaky network. By the end of this chapter you'll have working mental models for every line of an xAPI emit path.

## Your New Superpower

By the end of this chapter, you'll be able to **build a production-grade xAPI client library, instrument any kind of interactive textbook component with it, and reason about every failure mode in the emit path**. That's what separates a textbook that "has xAPI" on the feature list from one whose data team trusts the data. You'll know what happens when the network drops mid-batch. You'll know what 4xx versus 5xx means, and which to retry. You'll know why some of the cleverest emit code is the most fragile.

You'll also pick up a quieter skill: knowing when *not* to emit. The best instrumented textbooks are precise, not exhaustive. Emitting a statement on every mouse move is the wrong answer; emitting one on every meaningful learning event is the right one.

## What a Level 3 Intelligent Textbook Is

A **Level 3 intelligent textbook** is, in the framing this book uses, a textbook with three properties: it renders as web content (HTML, CSS, JavaScript); it contains genuinely interactive elements that respond to learner input (MicroSims, quizzes, adaptive branching, simulations); and it captures behavioral signals from those interactions through structured instrumentation. xAPI is the standard instrumentation layer for Level 3 textbooks. Levels 1 and 2 are static and non-instrumented respectively; Level 3 is the level where the book becomes a sensor.

The project this course centers on is built on **MkDocs Material**, a static-site generator that turns markdown files into a structured website. MkDocs handles content rendering and site navigation; the interactive layer (MicroSims, quizzes, xAPI emission) is custom JavaScript that loads alongside the rendered pages. This is the **MkDocs intelligent textbook** pattern: markdown for content, JavaScript for behavior, xAPI for telemetry.

A **MicroSim (p5.js)** is a small, self-contained interactive simulation rendered with p5.js — the JavaScript port of the Processing visual-coding language. MicroSims show up throughout this textbook in `<details>` blocks; in your own deployment they'd live in iframes or shadow DOM components. Each MicroSim is a candidate emit site: when a learner manipulates it, an xAPI statement should fire.

The architecture of the whole stack:

- **Markdown content** — chapter prose, rendered by MkDocs
- **MicroSims and quizzes** — interactive components, loaded as iframes or modules
- **The xAPI client library** — a single shared module that handles statement construction, batching, retry, and authentication
- **The LRS** — your chosen platform from Chapter 7

#### Diagram: Intelligent Textbook xAPI Architecture

<details markdown="1">
<summary>Intelligent Textbook xAPI Architecture</summary>
Type: clickable-mermaid
**sim-id:** intelligent-textbook-xapi-architecture<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify each layer of an xAPI-instrumented intelligent textbook and trace how a learner's interaction propagates from a MicroSim through the client library to the LRS.

**Diagram type:** Mermaid flowchart (TD direction). Click handlers on every node.

**Structure:**

- Top layer: `Markdown content (MkDocs Material)`
- Component layer (three nodes side by side): `MicroSim`, `Quiz`, `Adaptive Branching`
- Each component layer node arrows down to: `xAPI Client Library` (single node)
- Client library arrows to: `Statement Builder`, `Batch Buffer`, `Retry Manager`, `Auth Header Manager` (four parallel nodes)
- All four arrow into: `Fetch API → LRS HTTP API`
- Final node: `LRS Storage`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the component's responsibility, the chapter section that covers it, and a one-line code reference.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
</details>

## The xAPI Client Library

A **JavaScript xAPI client library** is the single shared module that every emit site in your textbook calls into. It exists because the alternative — letting every component construct, authenticate, and POST its own statements — produces wildly inconsistent emissions, scattered duplication, and a maintenance nightmare. **xAPI client library design** boils down to one rule: every emit site says *what happened*, the library handles *how to send it*.

Good library design separates these four responsibilities:

1. **Statement construction** — building a conformant statement object from per-event inputs (verb, activity, learner, optional result/context/extensions)
2. **Authentication** — attaching the right `Authorization` header without exposing credentials to component code
3. **Batching and delivery** — buffering statements briefly, POSTing in batches, retrying on failure (Chapter 9)
4. **Error handling** — distinguishing recoverable from unrecoverable errors and surfacing the right signal to operators

Here's the public surface of a small but production-shaped client library written in TypeScript. **TypeScript type definitions** matter here because the xAPI statement schema is rich enough that typos and shape errors are easy to produce; types catch most of them at compile time.

```typescript
// xapi/types.ts — statement shape and supporting types
export type Iri = string;

export interface Agent {
  objectType?: "Agent";
  account: { homePage: Iri; name: string };
  name?: string;
}

export interface Verb { id: Iri; display: Record<string, string>; }

export interface Activity {
  objectType?: "Activity";
  id: Iri;
  definition?: {
    name?: Record<string, string>;
    type?: Iri;
    revision?: string;
  };
}

export interface Statement {
  id?: string;
  actor: Agent;
  verb: Verb;
  object: Activity | Statement;     // SubStatement support
  result?: Result;
  context?: Context;
  timestamp?: string;
}

export interface XapiClient {
  send(statement: Statement): Promise<void>;
  flush(): Promise<void>;
}
```

The client surface is two methods: `send` (queue a statement for delivery) and `flush` (force any buffered statements to be sent immediately, used at page-unload time). Components don't see the LRS URL, the auth token, or the retry logic. Those concerns are entirely the library's.

**Statement construction** is implemented as small builder functions, one per recurring pattern (Chapter 3). The library's job is to fill in the pieces every statement needs (`actor`, `timestamp`, `version`, `platform`) so emit sites only specify what's specific to the event:

```typescript
// xapi/builders.ts
export function buildInteractedStatement(opts: {
  learner: Agent;
  activityIri: Iri;
  registration?: string;
  extension?: Record<Iri, unknown>;
}): Statement {
  return {
    actor: opts.learner,
    verb: {
      id: "http://adlnet.gov/expapi/verbs/interacted",
      display: { "en-US": "interacted" }
    },
    object: { objectType: "Activity", id: opts.activityIri },
    timestamp: new Date().toISOString(),
    context: {
      platform: "Intelligent Textbook (web)",
      registration: opts.registration,
      ...(opts.extension && { extensions: opts.extension })
    }
  };
}
```

The builder is small, focused, and the only path through which an `interacted` statement gets created. If the verb IRI ever changes or the platform name needs updating, you change it once.

**JSON serialization** of a statement is `JSON.stringify` — simple enough that you barely think about it. The two gotchas: ISO 8601 timestamps must end in `Z` (UTC), not a numeric offset, for maximum LRS compatibility; and the `extensions` value can contain anything serializable but should not contain circular references (the serializer will throw). Always test extension payloads with `JSON.stringify` round-trip in unit tests; it catches non-serializable values before they reach production.

The **Fetch API (HTTP)** is the underlying transport. Modern browsers all support it; older ones (pre-Edge, IE11) need polyfills (covered later in this chapter). The Fetch shape used by the library:

```typescript
async function postBatch(batch: Statement[], cfg: ClientConfig): Promise<Response> {
  return fetch(`${cfg.endpoint}statements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Experience-API-Version": "1.0.3",
      "Authorization": `Bearer ${cfg.authToken}`
    },
    body: JSON.stringify(batch)
  });
}
```

Three details matter. The `X-Experience-API-Version` header is required (Chapter 6); forgetting it produces an unhelpful 400. The auth token comes from configuration that was loaded from environment variables (Chapter 7), never hardcoded. And the body is a JSON array — the LRS will store the batch atomically (Chapter 6).

## Client-Side vs. Server-Side Emission

**Client-side xAPI emission** sends statements directly from the learner's browser to the LRS. **Server-side xAPI emission** sends them from your application's backend, which has received some signal from the browser. Most production deployments use a mix.

Client-side is the obvious default for high-frequency events: MicroSim manipulations, page navigations, hint requests. The browser observes the event, constructs the statement, sends it. No backend round-trip, no latency tax. The trade-off is **statement authenticity** — anyone with developer tools can construct and send statements as if they were the learner. Client-side emission is fine for analytics and personalization, but should not be the source of truth for grades, certifications, or anything with high-stakes consequences.

Server-side emission is where the high-stakes events go. The browser tells your backend "the learner submitted answer X to question Y"; the backend grades the submission, decides whether the learner passed, and emits the authoritative statement (with the backend's credential). The browser cannot forge a server-side statement because the browser doesn't have the backend's credential. The trade-off is round-trip latency and the operational cost of running a backend grading service.

The pattern most textbooks settle into: client-side emission for everything except graded-assessment outcomes; server-side emission for the `passed`/`failed`/`scored` statements that tie to grades. The browser may still emit a client-side `attempted` statement for the dashboard to show progress, but the *outcome* statements come from the backend.

#### Diagram: Emit-Path Topology

<details markdown="1">
<summary>Emit-Path Topology</summary>
Type: workflow-diagram
**sim-id:** emit-path-topology<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Compare client-side, server-side, and hybrid emission topologies and identify which events belong on which path for a given deployment.

**Diagram type:** Mermaid flowchart with three labeled subgraphs side by side: `Client-side`, `Server-side`, `Hybrid (recommended)`. Click handlers on every node.

**Subgraph contents:**

- Client-side: `Browser` → `LRS`. Annotation: "Low latency. Forgeable. Use for analytics."
- Server-side: `Browser` → `Backend` → `LRS`. Annotation: "Higher latency. Authoritative. Use for grades."
- Hybrid: `Browser` → `LRS` (analytics path) AND `Browser` → `Backend` → `LRS` (graded path). Annotation: "Mix and match. Production default."

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with examples of statements that flow through that path and the security implications.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with three subgraphs and click directives.
</details>

## Retry-With-Backoff and Error Handling

Networks fail. LRSs hiccup. Tokens expire mid-flight. A robust client library handles all three without losing statements. The standard pattern is the **retry-with-backoff pattern**: when a delivery fails, wait, retry, double the wait, retry again, eventually give up and surface the failure.

Before the implementation, the rule for *what* to retry. **xAPI error handling** distinguishes two error categories:

- **4xx error patterns (LRS)** — client error. The request was malformed, unauthenticated, or otherwise wrong. Retrying with the same payload will fail the same way. Most 4xx errors are unrecoverable from the client's perspective: 400 (bad statement), 401 (bad credentials), 409 (duplicate UUID), 412 (failed precondition). Surface them, log them, do not retry.
- **5xx error patterns (LRS)** — server error. The LRS had a bad day. The same payload may succeed five seconds from now. Retry with backoff. Common cases: 500 (internal server error), 502 (bad gateway, often during deploys), 503 (overloaded), 504 (timeout downstream).

Network-level failures (request never completed) are treated like 5xx — retry with backoff.

The implementation:

```typescript
async function sendWithRetry(batch: Statement[], cfg: ClientConfig): Promise<void> {
  let attempt = 0;
  while (attempt < cfg.retryAttempts) {
    try {
      const res = await postBatch(batch, cfg);
      if (res.ok) return;                      // 2xx — done
      if (res.status >= 400 && res.status < 500) {
        throw new XapiClientError(res.status, await res.text());
      }
      // 5xx — fall through to retry
    } catch (e) {
      if (e instanceof XapiClientError) throw e;   // 4xx — don't retry
      // network error — fall through to retry
    }
    const delay = Math.min(2 ** attempt * 1000, 30000) + Math.random() * 1000;
    await new Promise(r => setTimeout(r, delay));
    attempt++;
  }
  throw new XapiDeliveryFailure(batch);
}
```

The math: attempt 0 waits ~1s, attempt 1 waits ~2s, attempt 2 ~4s, capped at 30s. The random jitter prevents many clients from retrying in lockstep after a global outage — the **thundering herd problem**. After `retryAttempts` (typically 5), the batch is escalated to the offline queue (Chapter 9) for delivery later, and an error is logged.

#### Diagram: Retry-With-Backoff State Machine

<details markdown="1">
<summary>Retry-With-Backoff State Machine</summary>
Type: workflow-diagram
**sim-id:** retry-with-backoff-state-machine<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the state transitions of a statement batch through the retry-with-backoff pipeline and identify which response codes lead to which outcomes.

**Diagram type:** Mermaid stateDiagram-v2 (or flowchart equivalent if state diagrams don't support click handlers). Click handlers on every node.

**States:**

1. `Buffering` — statement appended to in-memory batch
2. `Sending` — POST in flight
3. `Success (2xx)` — terminal success state
4. `Client Error (4xx)` — terminal failure state, surfaces error
5. `Backoff` — scheduled retry after exponential delay
6. `Offline Queue` — terminal handoff state after max retries

**Transitions:**

- Buffering → Sending (on flush or batch full)
- Sending → Success (2xx)
- Sending → Client Error (4xx)
- Sending → Backoff (5xx or network error)
- Backoff → Sending (on timer)
- Backoff → Offline Queue (after max retries)

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each state opens a side-panel infobox describing what happens in that state and the typical duration the state lasts.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with state-like nodes and click directives.
</details>

!!! mascot-warning "Common Pitfall — Retrying 4xx Errors"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Xavi cautioning against bad retries">
    Retrying a 4xx error in a tight loop is the most common way to accidentally DDOS your own LRS. A learner with a malformed extension keeps emitting the same broken statement, the client retries it 100 times a minute, the LRS rejects it 100 times a minute, and your alerts go off. Treat 4xx as terminal at the client layer. Surface the error, drop the batch, and move on.

## Component Instrumentation Patterns

The shape of instrumentation is consistent across component types. Three concrete examples — quiz, MicroSim, adaptive branching — share the same skeleton: identify the event, look up the verb, build the statement, hand it to the client. The differences are in *which* events each component cares about.

**Quiz instrumentation** emits a small choreographed sequence: `attempted` when the learner starts the quiz, `scored` when an answer is graded, then either `passed` or `failed` based on the score, and `completed` when the learner finishes. All four share a single `registration` UUID minted at quiz start.

```typescript
async function startQuiz(quizIri: Iri) {
  const registration = uuidv4();
  await xapiClient.send(buildAttemptedStatement({ learner, activityIri: quizIri, registration }));
  return registration;
}

async function submitQuiz(quizIri: Iri, registration: string, score: number) {
  await xapiClient.send(buildScoredStatement({ learner, activityIri: quizIri, registration, score }));
  await xapiClient.send(score >= 0.7
    ? buildPassedStatement({ learner, activityIri: quizIri, registration })
    : buildFailedStatement({ learner, activityIri: quizIri, registration })
  );
  await xapiClient.send(buildCompletedStatement({ learner, activityIri: quizIri, registration }));
}
```

**Simulation instrumentation** emits `experienced` when the learner opens the simulation, `interacted` (debounced) for parameter changes, and optionally `completed` if the simulation defines an end condition. MicroSim instrumentation is a special case of simulation instrumentation; the same builders apply.

**Adaptive branching instrumentation** is more interesting. Adaptive content presents different paths based on learner state — and the *decision* itself is a learning signal. The pattern: emit a `progressed` statement at every branch decision, with a context extension capturing which branch was taken and why.

```typescript
function recordBranchDecision(branchPoint: Iri, chosenBranch: Iri, signal: string) {
  xapiClient.send({
    actor: learner,
    verb: { id: "http://adlnet.gov/expapi/verbs/progressed",
            display: { "en-US": "progressed" } },
    object: { objectType: "Activity", id: branchPoint },
    context: {
      registration,
      extensions: {
        "https://textbook.example.org/extensions/v1/branch-decision": {
          chosen: chosenBranch,
          signal: signal     // "passed-prereq", "struggled-on-A", "fast-track"
        }
      }
    }
  });
}
```

The extension captures *why* the branch was taken in machine-readable form. The dashboard team can later query "show me every learner who took the fast-track branch" and get a clean answer.

#### Diagram: Component Instrumentation Pattern Browser

<details markdown="1">
<summary>Component Instrumentation Pattern Browser</summary>
Type: micro-sim
**sim-id:** component-instrumentation-pattern-browser<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Browse the canonical instrumentation pattern for each component type (quiz, simulation, adaptive branching) and observe the resulting xAPI statement sequence in a side panel.

**Layout:** 2/3 (left) tabbed component preview + 1/3 (right) live statement sequence.

**Tabs (left panel):**

- Quiz tab: a 3-question quiz with submit button. Submitting fires the canonical sequence (`attempted`, `scored`, `passed`/`failed`, `completed`).
- Simulation tab: a slider-driven simulation. Adjusting the slider fires debounced `interacted` statements; a "Run" button fires `experienced`.
- Adaptive Branching tab: a branch decision UI showing two paths. Clicking a path fires a `progressed` statement with a branch-decision extension.

**Right panel:**

- Sequential list of statements emitted, each shown with verb, activity, and a one-line summary
- Click an entry to expand the full JSON statement
- Each entry is annotated with the registration UUID so learners can see attempts grouped

**Default canvas:** 1000×600px, responsive.

Implementation: p5.js for the simulation tab; HTML for the quiz and branching tabs and the statement list.
</details>

## Mobile Web, Responsive, Browser Compatibility

Intelligent textbooks are read on phones, tablets, and desktops. **xAPI for Mobile Web** isn't fundamentally different from desktop — same Fetch API, same statement structure — but a few details matter at small viewports and on flaky cellular networks.

**Responsive Web xAPI** mostly means: the textbook layout adapts, so should the instrumentation. Some events are page-shape-dependent (e.g., a "scrolled to end of chapter" event has different geometry on a phone). Don't tie the *meaning* of an event to a specific viewport; tie it to the learner's intent. "Reached end of chapter" is the same event on phone and desktop, even though the pixel coordinates differ.

**Browser compatibility (xAPI)** is mostly about which browsers your textbook supports. The Fetch API is supported by every browser shipped after ~2017; for older browsers you need a **polyfill strategy**. The two polyfills you'll likely need:

- `whatwg-fetch` — Fetch API polyfill for IE11 and older Safari versions
- `core-js` — broader ES2020+ feature polyfill, often pulled in via Babel transforms during build

The tactical advice: don't ship polyfills to modern browsers. Use a build-time differential bundle (modern browsers get the slim bundle; older browsers get the polyfilled bundle). Most modern build tools (Vite, esbuild, Webpack with `@babel/preset-env`) handle this with a one-line config.

A concrete example of a polyfill conditional in the client library entry:

```typescript
if (!("fetch" in window)) {
  await import("whatwg-fetch");
}
if (!("structuredClone" in window)) {
  await import("core-js/actual/structured-clone");
}
```

These dynamic imports cost nothing in modern browsers (the conditional is `false`, the import never runs) and rescue the older ones.

## LRS Server Log Analysis

When something goes wrong in production — and something always goes wrong in production — you'll spend time in **LRS server log analysis**. The LRS records every request and response: timestamp, endpoint, status code, payload size, response time, and (depending on the platform) the authentication identity that made the request.

The four queries you'll run most often:

1. **By status code** — what's the 4xx rate? The 5xx rate? A spike in 401 means a credential expired; a spike in 400 means a recent code change broke statement construction; a spike in 5xx means the LRS itself is unhealthy.
2. **By endpoint** — which endpoints are getting hit? Unexpected traffic on `/state` or `/agents` often signals a misbehaving client.
3. **By identity** — which client credentials are emitting? A new credential appearing without coordination usually means someone forked the code and is emitting from staging.
4. **By payload size** — outliers indicate batch-size misconfigurations or extension-bloat bugs.

Most LRS platforms expose logs as either a file (TRAX, Ralph) or a structured query interface (Watershed, Learning Locker). The shape of analysis is the same: filter, aggregate, compare to baseline.

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 9.

- You can describe the four responsibilities of an xAPI client library and why each is separated.
- You can read the TypeScript types for a Statement and explain what `Agent`, `Verb`, and `Activity` contain.
- You can choose between client-side, server-side, and hybrid emission for a given event, citing statement authenticity as the deciding factor.
- You can implement retry-with-backoff with the right rules for 4xx vs. 5xx vs. network errors.
- You can sketch the instrumentation pattern for a quiz, a MicroSim, and an adaptive branch.
- You can describe a polyfill strategy that delivers minimal payload to modern browsers while still supporting older ones.
- You can list the four most useful queries against LRS server logs and what each tells you about deployment health.

!!! mascot-celebration "From Diagram to Working Code"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating with a finished build">
    The architecture is now code. Every emit site you'll add to your textbook from here will be a small, predictable extension of patterns you just saw. Chapter 9 turns to the question that decides whether your instrumentation survives a thirty-student classroom on a flaky school network: bandwidth.

[See Annotated References](./references.md)
