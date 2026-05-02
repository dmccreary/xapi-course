---
title: Bandwidth Optimization, Offline Queues, and Service Workers
description: How to keep xAPI overhead negligible on real networks — statement batching, payload minimization, offline queues backed by IndexedDB, service worker lifecycle, connectivity detection, and the bandwidth budget calculation that decides whether your instrumentation works in a 30-student classroom on a flaky school WiFi.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 12:08:00
version: 0.07
---

# Bandwidth Optimization, Offline Queues, and Service Workers

## Summary

Covers statement batching, payload minimization, delta encoding, IndexedDB and LocalStorage queues, service worker lifecycle, and bandwidth budgeting. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 21 concepts from the learning graph:

1. Statement Batching
2. HTTP/2 Multiplexing
3. Payload Minimization
4. Offline Statement Queue
5. IndexedDB Storage
6. LocalStorage (Browser)
7. Service Worker
8. Background Sync API
9. Progressive Sync Strategy
10. Delta Encoding
11. Selective Verbosity
12. Bandwidth Budget Calculation
13. Per-Statement Payload Size
14. HTTP Overhead Analysis
15. Statement Frequency Analysis
16. Service Worker Lifecycle
17. Cache-First Strategy
18. Network-First Strategy
19. Statement Queue Flushing
20. Connectivity Detection
21. Retry Logic Design

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)
- [Chapter 3: Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments](../03-advanced-statement-structure/index.md)
- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../06-lrs-architecture/index.md)
- [Chapter 8: Implementing xAPI in Intelligent Textbooks](../08-implementing-in-textbooks/index.md)

---

!!! mascot-welcome "Welcome to the Network Chapter"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus tangled in network cables">
    A textbook with great instrumentation that destroys the school's WiFi is a textbook nobody adopts. This chapter is about making xAPI invisible at the network layer — small payloads, clever batching, graceful behavior offline. You'll learn what an instrumented session actually costs, in bytes and round-trips, and how to bring that cost down by an order of magnitude when you need to.

## Your New Superpower

By the end of this chapter, you'll be able to **calculate exactly how much bandwidth your instrumentation costs per learner per session, decide whether that cost is acceptable, and apply the right techniques to bring it down**. This is the kind of analysis that turns a worried network admin into an ally. "We did the math, this textbook adds 80KB per learner per hour, here's the breakdown" is a different conversation than "trust us, it's fine."

You'll also build the offline-resilience layer that lets the textbook keep working when the network drops — a daily occurrence in real classrooms — without losing statements. This is the part of xAPI that production deployments most often skip and most often regret.

## What an Instrumented Session Costs

Before optimizing, measure. A typical xAPI statement, freshly emitted from a textbook component, lands somewhere between 700 and 1500 bytes serialized as JSON. That's the **per-statement payload size**. Add HTTP overhead — request line, headers, response — and the wire cost climbs to 1500–3000 bytes per individual statement when each one is POSTed alone. **HTTP overhead analysis** is the practice of breaking that wire cost down so you know what to attack.

Where the bytes go in a single, individually-posted statement:

- **Statement JSON body** — 700–1500 bytes (depends on extensions, attachment metadata, language map size)
- **HTTP request headers** — 400–800 bytes (Authorization, X-Experience-API-Version, Content-Type, User-Agent, Cookie, Accept)
- **HTTP response headers + body** — 200–400 bytes (the LRS returns the assigned UUID array)

So one statement, one POST, can be 1500–3000 bytes on the wire — and roughly half of that is *not* the statement itself. That's the inefficiency batching is going to attack.

**Statement frequency analysis** is the other half of the cost equation: how many statements per minute does a typical session emit? An interactive math chapter with debounced MicroSim manipulation, embedded quizzes, and adaptive branching can easily emit 30–60 statements during a 20-minute session. A page-reading-only chapter emits 5–10. A simulation-heavy physics chapter can spike to 200+. Multiply payload by frequency and you have the **bandwidth budget calculation**: total bytes per learner per session.

A worked example. A 20-minute interactive chapter session with 45 statements at 1200 bytes per statement, individually posted with 700 bytes of HTTP overhead each:

- 45 × (1200 + 700) = 85,500 bytes ≈ 85 KB per learner per chapter
- 30-student classroom × 85 KB = 2.5 MB per chapter session
- Spread over 20 minutes = ~17 KB/sec aggregate

That number is small enough to be invisible on a campus connection and large enough to be noticeable on a school's shared 100 Mbps link during peak hours. Now we'll attack it.

#### Diagram: Bandwidth Budget Calculator MicroSim


<iframe src="../../sims/bandwidth-budget-calculator-microsim/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Bandwidth Budget Calculator MicroSim Fullscreen](../../sims/bandwidth-budget-calculator-microsim/main.html)

<details markdown="1">
<summary>Bandwidth Budget Calculator MicroSim</summary>
Type: micro-sim
**sim-id:** bandwidth-budget-calculator-microsim<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Estimate the total bandwidth cost of an xAPI deployment by adjusting per-statement size, frequency, batch size, and concurrent learner count.

**Layout:** 2/3 (left) input controls + 1/3 (right) live output panel.

**Controls:**

- Slider: Per-statement payload size (500 – 3000 bytes, default 1200)
- Slider: HTTP overhead per request (300 – 1500 bytes, default 700)
- Slider: Statements per learner per session (5 – 200, default 45)
- Slider: Session duration in minutes (5 – 120, default 20)
- Slider: Concurrent learners (1 – 1000, default 30)
- Slider: Batch size — statements per POST (1 – 50, default 1; demonstrates the impact of batching)

**Right panel output:**

- Total bytes per learner per session
- Total bytes for the cohort
- Average bytes per second during the session
- Comparison bar showing this vs. one of three reference loads ("classroom WiFi headroom", "10 Mbps cellular tether", "1 Gbps campus link")
- A green/yellow/red headroom badge based on the reference load

**Interaction:**

- Adjusting any slider re-computes all outputs in real time
- Preset buttons across the bottom: "Reading-only chapter", "Interactive math chapter", "Simulation-heavy physics chapter", "30-student assessment window"

**Default canvas:** 1000×600px, responsive.

Implementation: p5.js for the sliders, layout, and dynamic computations; HTML overlay for the output panel.
</details>

## Statement Batching

**Statement batching** is the practice of buffering multiple statements client-side and POSTing them together as a single array, exploiting the LRS's atomic-batch semantics (Chapter 6). Batching is the single highest-leverage bandwidth optimization in xAPI, and the easiest to implement.

The math, with the numbers from the worked example. Forty-five statements posted individually cost 45 × 1900 ≈ 85 KB. Forty-five statements posted in three batches of 15 cost 3 × (15 × 1200 + 700) = 56 KB — a 34% reduction with no information loss. Push the batch size to a single batch of 45 and the cost drops to 1 × (45 × 1200 + 700) = 54.7 KB — almost exactly the raw statement payload, with HTTP overhead amortized to near-zero.

The implementation is small. The client library buffers incoming statements and flushes when one of three conditions is met: the batch reaches a configured size limit, a timer expires, or `flush()` is called explicitly (typically at page-unload):

```typescript
class BatchingClient {
  private buffer: Statement[] = [];
  private timer: number | null = null;

  constructor(private cfg: ClientConfig) {}

  send(s: Statement): Promise<void> {
    this.buffer.push(s);
    if (this.buffer.length >= this.cfg.batchSize) return this.flush();
    if (!this.timer) {
      this.timer = window.setTimeout(() => this.flush(), this.cfg.batchDelayMs);
    }
    return Promise.resolve();
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    const batch = this.buffer.splice(0);
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    await sendWithRetry(batch, this.cfg);
  }
}
```

Three pieces to internalize. The buffer drains atomically (`splice(0)`) so concurrent `send` calls don't share a half-drained buffer. The timer is canceled when the buffer drains so the next `send` starts a fresh window. And `flush()` is idempotent on an empty buffer — safe to call from `beforeunload` listeners that fire whether or not buffered data exists.

Tunable parameters: a batch size of 25 and a batch delay of 5 seconds works well for most textbooks. Smaller batches mean less aggregation benefit; larger batches mean events are delayed reaching the LRS, which can confuse real-time dashboards. Five seconds is short enough that the dashboard still feels live; 25 is large enough to amortize HTTP overhead nicely.

### HTTP/2 Multiplexing

**HTTP/2 multiplexing** is the protocol-level feature that lets a single HTTP/2 connection carry multiple concurrent requests and responses without the head-of-line blocking that hurt HTTP/1.1. It's relevant to xAPI because it changes the math on whether to batch *across* requests as well as within them.

Under HTTP/1.1, each unbatched POST opened a new TCP connection (roughly), serialized requests, and paid the TCP slow-start cost on each. Batching was a major win because every avoided POST avoided a connection setup. Under HTTP/2, a single connection carries many concurrent requests cheaply — so the marginal cost of an extra POST is much lower. Batching is still a win because of header compression and amortized parsing, but the win is smaller (roughly 30–50% bandwidth reduction under HTTP/2 vs. 60–80% under HTTP/1.1).

The takeaway: **batching is still worth doing under HTTP/2** — the savings are smaller but real, and the offline-queueing logic depends on having a single point of submission. Don't skip batching just because you're on HTTP/2.

#### Diagram: Batching Wire-Cost Comparison


<iframe src="../../sims/batching-wire-cost-comparison/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Batching Wire-Cost Comparison Fullscreen](../../sims/batching-wire-cost-comparison/main.html)

<details markdown="1">
<summary>Batching Wire-Cost Comparison</summary>
Type: interactive-infographic
**sim-id:** batching-wire-cost-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Compare individual-POST and batched-POST traffic patterns visually, recognizing how HTTP overhead amortizes as batch size grows.

**Layout:** Two side-by-side timelines (top: "Individual POST", bottom: "Batched POST"); a side panel on the right shows numerical comparison.

**Visual elements:**

- Each timeline shows a sequence of HTTP request/response pairs over a 10-second window
- Individual POST: 30 request/response pairs, each with overhead bands shown distinctly from payload bands (different colors)
- Batched POST: 3 request/response pairs (10 statements each), each clearly larger but with the same overhead band
- Stacked bar at the right of each timeline showing total bytes broken into "overhead" and "payload"

**Interaction:**

- Slider: number of statements (5 – 100)
- Slider: batch size (1 – 50)
- Both timelines re-render to reflect the new values
- Side panel shows: individual total, batched total, percentage saved

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the timeline rendering and animated re-layout on slider change.
</details>

## Payload Minimization

**Payload minimization** is the practice of trimming unnecessary bytes from each statement before sending. The constraints: don't break conformance, don't lose information the LRS needs, don't make debugging painful. Two techniques fit those constraints.

**Selective verbosity** is the policy of populating optional fields only when they carry actual signal. The most common offender is the language map on `verb.display`. The xAPI spec allows multiple language tags; many auto-generated builders include `en-US` plus four other languages "to be safe." If your textbook is monolingual, you only need `en-US`. Trimming four extra languages from `verb.display`, `object.definition.name`, and `object.definition.description` shaves 200–400 bytes off every statement.

```typescript
// Verbose — 480 bytes
"verb": { "id": "...", "display": {
  "en-US": "passed", "es-MX": "aprobó",
  "fr-FR": "réussi", "de-DE": "bestanden",
  "ja-JP": "合格しました"
}}

// Selective — 70 bytes
"verb": { "id": "...", "display": { "en-US": "passed" }}
```

**Delta encoding** is the practice of omitting fields that haven't changed between statements in a batch. xAPI itself doesn't support delta encoding at the spec level, but if the same `actor`, `context.platform`, `context.registration`, and `context.contextActivities.parent` repeat across every statement in a batch (which is typical for one learner working through one chapter), some custom client libraries implement a private encoding that strips the repeats client-side and reconstructs them server-side via a thin proxy. The trade-off: this is non-conformant on the wire, requires a proxy that re-inflates the statements before the LRS sees them, and adds operational complexity. Most teams skip it. Mention it here so you know it exists; the higher-leverage win is selective verbosity.

The simpler version of "delta encoding" — and the one teams should reach for first — is just *not putting redundant data in extensions*. If your extensions duplicate fields already in `actor` or `context`, fix that first.

## Offline Statement Queue

A **service worker** is a JavaScript module that runs in the background of a web page, separate from the main thread, and intercepts network requests on behalf of the page. Service workers are the foundation of offline-capable web apps; they're how your textbook can keep emitting statements when the network drops.

A **service worker lifecycle** has four states: registered, installing, activated, and (in case of update) updating. The simple version: on first page load, the service worker file is fetched, parsed, and installed. After installation, it activates and starts intercepting requests. On subsequent loads, the browser checks for an updated service worker; if one exists, it installs alongside the old one and activates after the page closes.

**Service workers** intercept requests in two modes:

- **Cache-first strategy** — the worker checks its cache first; if the resource is cached, return it without touching the network. Used for static assets the textbook depends on (HTML, CSS, JS, images) so the textbook keeps loading offline.
- **Network-first strategy** — the worker tries the network first; if it succeeds, return the response and update the cache. If the network fails, fall back to the cache. Used for content that should be fresh when possible.

For xAPI specifically, neither cache-first nor network-first quite fits — xAPI POSTs aren't requests the worker should serve from cache; they're writes that need to reach the LRS eventually. The right pattern for xAPI is **queue-and-flush**: the worker intercepts the POST, queues it in **IndexedDB storage** if the network is unavailable, and re-attempts delivery when connectivity returns.

**IndexedDB storage** is a browser-provided transactional database for structured data, good for hundreds of megabytes and well-suited to queue persistence. **LocalStorage (browser)** is its simpler cousin — synchronous key-value storage limited to ~5 MB per origin, fine for tiny configuration data but a bad fit for a statement queue (synchronous, small, and slow under load). Use IndexedDB for the offline queue. Use LocalStorage for the per-browser learner UUID and other tiny state, if anything.

The **offline statement queue** is therefore an IndexedDB store the service worker (and the main-thread client library) both write to. The flow:

1. Client library calls `send(statement)`.
2. Library checks `navigator.onLine`. If true, attempt POST normally.
3. If POST fails with a network error or the worker can't reach the LRS, write the statement to IndexedDB.
4. When connectivity returns (detected by an `online` event or a periodic poll), the worker reads queued statements from IndexedDB, POSTs them, and removes successfully-sent ones from the queue.

```typescript
async function sendOrQueue(statement: Statement) {
  if (navigator.onLine) {
    try { return await postBatch([statement], cfg); } catch { /* fall through */ }
  }
  await queueStatement(statement);   // write to IndexedDB
}

window.addEventListener("online", () => flushQueue());
```

This is the simplest workable design. Real implementations also handle: timer-based retries while online but unable to reach the LRS (the network is "up" but the LRS is unreachable), distinguishing recoverable from unrecoverable queue entries, and bounding the queue size to avoid unbounded growth on extended outages.

#### Diagram: Service Worker and Offline Queue Flow


<iframe src="../../sims/service-worker-offline-queue-flow/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run Service Worker and Offline Queue Flow Fullscreen](../../sims/service-worker-offline-queue-flow/main.html)

<details markdown="1">
<summary>Service Worker and Offline Queue Flow</summary>
Type: workflow-diagram
**sim-id:** service-worker-offline-queue-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the path of a statement emitted while offline through the IndexedDB queue and back to the LRS when connectivity returns.

**Diagram type:** Mermaid flowchart (TD direction). Click handlers on every node.

**Structure:**

1. Start: `Component calls xapiClient.send(stmt)`
2. Decision: `navigator.onLine?` → No → branch to queue
3. Yes branch: `Attempt POST to LRS` → Success → `Done` / Failure → branch to queue
4. Queue branch: `Write statement to IndexedDB`
5. Background: `online event fires` → `Worker reads queue` → `POST batch to LRS` → on success → `Remove from queue`
6. Loop: while queue is non-empty and online, continue flushing

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with the relevant code snippet and the typical edge cases at that step.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
</details>

## Background Sync API

The **Background Sync API** is the modern browser API for "do this when the user has connectivity, even if the page is closed." A service worker registers a sync event with a tag; when the browser detects connectivity, the worker is woken (if asleep) and the registered sync handler runs. This lets your textbook flush its offline queue *after* the learner has closed the tab — the quintessential use case being the learner who finishes a chapter on the train, closes the laptop, gets home thirty minutes later, and the laptop wakes up.

```typescript
// In the page
const reg = await navigator.serviceWorker.ready;
await reg.sync.register("xapi-flush");

// In the service worker
self.addEventListener("sync", (event) => {
  if (event.tag === "xapi-flush") {
    event.waitUntil(flushQueueFromIndexedDB());
  }
});
```

Browser support for Background Sync is good in Chrome and Edge, partial in Firefox, and historically absent in Safari. The right strategy: register the sync, but don't *rely* on it. The page's main-thread `online` event handler is your primary flush mechanism; Background Sync is a bonus that helps your queue drain even when the tab isn't active.

## Connectivity Detection

**Connectivity detection** is the simple-sounding question of "is the browser online?" — and it's surprisingly subtle. The `navigator.onLine` property and the `online`/`offline` events are the obvious answer, but they only detect *network-level* connectivity. They don't tell you if the LRS is reachable, if your authentication is still valid, or if a captive portal is intercepting your traffic.

The robust pattern is layered:

1. **`navigator.onLine`** — fast first check; if it's false, definitely don't try.
2. **Recent successful POST** — track when the last successful LRS interaction was; if it was within ~30 seconds, optimistically try.
3. **Health probe** — if `navigator.onLine` is true but you haven't talked to the LRS recently, GET `/xAPI/about` as a cheap probe before flushing the queue.
4. **POST attempt with short timeout** — finally, if the probe succeeds, attempt the queued POSTs with a tight timeout (5–10 seconds) so a stuck connection doesn't block.

This staircase costs almost nothing in the common case and avoids the "online but actually offline" trap that captive portals create.

## Progressive Sync Strategy

**Progressive sync strategy** is the policy for *when* to flush the offline queue, what to flush in what order, and how to handle queues that have grown large. The rule of thumb that fits most textbooks:

1. **Flush in chronological order.** Queue insertion order is queue flush order. Statements emitted earlier should reach the LRS earlier, preserving the temporal narrative.
2. **Flush in batches sized to the configured `batchSize`.** Large queues should be drained in `batchSize`-sized chunks, not all at once.
3. **Pause briefly between batches.** Don't flood the LRS — pause 500ms–2s between batches to give other clients a chance and to avoid triggering rate-limit responses.
4. **Bound the queue.** If the queue grows past a configured limit (say, 10,000 statements), drop the oldest entries with a logged warning. An unbounded queue eventually breaks IndexedDB.

**Statement queue flushing** wraps these rules into the worker's flush logic:

```typescript
async function flushQueueFromIndexedDB() {
  while (true) {
    const batch = await readNextBatch(cfg.batchSize);
    if (batch.length === 0) break;
    try {
      await postBatch(batch, cfg);
      await removeFromQueue(batch);
    } catch (e) {
      if (isPermanent(e)) await markAsFailed(batch);
      else break;     // recoverable — leave in queue, will retry later
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}
```

## Retry Logic Design Revisited

Chapter 8 introduced retry-with-backoff for in-flight POSTs. **Retry logic design** at this layer extends that pattern across the offline boundary: in-flight retries are bounded (5 attempts, then escalate); offline-queue retries are unbounded but periodic (every 60 seconds while offline, every 5 seconds while online). Together, the two layers ensure that no statement is dropped by a transient failure and no statement spins forever in a tight loop.

The full retry hierarchy:

1. In-flight retry-with-backoff (1s → 30s, 5 attempts)
2. After max attempts, escalate to offline queue
3. Online-poll flush every 5 seconds while connected and the queue is non-empty
4. Periodic re-probe every 60 seconds while disconnected, in case `navigator.onLine` is wrong
5. Background Sync wake-up for tab-closed re-attempts

!!! mascot-thinking "Xavi's Insight — Lossy Is Worse Than Slow"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Xavi pondering data loss">
    A network optimization that loses 1% of statements is far worse than one that delays them by an hour. xAPI's value depends on the data being complete enough that aggregate queries don't lie. Optimize for *eventual delivery*, not *immediate delivery*. The dashboard can wait an hour. The dashboard cannot reconstruct missing data.

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 10.

- You can compute a bandwidth budget for an instrumented session given per-statement size, frequency, and learner count.
- You can describe how statement batching reduces wire cost, and quantify the savings under HTTP/1.1 vs HTTP/2.
- You can apply selective verbosity to trim unnecessary bytes from each statement.
- You can sketch the architecture of an offline statement queue using IndexedDB and a service worker.
- You can describe the difference between cache-first and network-first strategies, and explain why xAPI emits use neither directly.
- You can implement layered connectivity detection that handles "online but actually offline" cases.
- You can define a progressive sync strategy that flushes in order, in batches, with backoff, without flooding the LRS.

!!! mascot-celebration "Invisible at the Network Layer"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating an empty network meter">
    Your textbook now plays nice with school WiFi, cellular tethers, and laptops that go to sleep on the train. That's the bar most production deployments fail to clear. Chapter 10 turns from "how to send statements without breaking the network" to "how to watch the statements flow once they're in motion" — the observability layer that turns raw traffic into operational signal.

## References

[See Annotated References](./references.md)
