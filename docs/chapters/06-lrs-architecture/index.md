---
title: Learning Record Store Architecture and Query Endpoints
description: How an LRS is structured internally — storage models, the five canonical endpoints, query filters, pagination, concurrency, conflict resolution, and the scalability decisions that determine whether your LRS handles a classroom or a campus.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 11:45:00
version: 0.07
---

# Learning Record Store Architecture and Query Endpoints

## Summary

Examines LRS storage models, the core endpoints, concurrency, conflict resolution, query capability, and pagination. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Mutable vs Immutable LRS
2. LRS Architecture
3. LRS Storage Models
4. Statements Endpoint
5. Agents Endpoint
6. Activities Endpoint
7. State Endpoint
8. About Endpoint
9. LRS Concurrency
10. Conflict Resolution (LRS)
11. Statement Query Filters
12. Pagination (StatementResult)
13. More IRL Pagination
14. LRS Scalability
15. LRS Query Capability
16. LRS Endpoint Configuration

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../01-foundations-and-standards/index.md)
- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)
- [Chapter 3: Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments](../03-advanced-statement-structure/index.md)
- [Chapter 5: Activities, Agents, and Learner Identity](../05-activities-agents-identity/index.md)

---

!!! mascot-welcome "Welcome to the Other Side of the Wire"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus opening a server cabinet">
    For five chapters we've talked about statements as if they fly off the textbook and disappear into a magic box. This chapter cracks open the magic box. The Learning Record Store — the LRS — is where statements actually live, get queried, get aggregated, and (eventually) get fed into dashboards. By the end of this chapter you'll be able to read the LRS the way you'd read a database: tables, indexes, query plans, the whole thing.

## Your New Superpower

By the end of this chapter, you'll be able to **send a statement to any conformant LRS, query that statement back with the right filters, and reason about how the LRS will behave under load**. That's the practical foundation for everything in the second half of this book. Once the LRS stops being a black box, every problem downstream — bandwidth tuning, observability, conformance testing, privacy review — becomes tractable.

You'll also walk away knowing the difference between a small LRS that "works on my laptop" and an LRS that handles thirty thousand concurrent learners during a state-wide assessment window. The architectural decisions are not subtle, but they are not always obvious until something goes wrong.

## What an LRS Actually Is

A **Learning Record Store** (LRS) is a server that implements the xAPI specification's HTTP API. It accepts statements via HTTP POST, stores them durably, and serves them back via HTTP GET against a small set of canonical endpoints. The xAPI specification defines exactly which endpoints must exist, what they accept, and what they return. Anything that conforms to that contract is an LRS. Anything that doesn't, isn't.

**LRS architecture** at the simplest level is three layers: an HTTP API layer that speaks the xAPI protocol, a storage layer that persists statements and other state, and (in production deployments) an indexing layer that makes queries fast. The xAPI spec is silent on the storage layer — vendors are free to build on PostgreSQL, MongoDB, Elasticsearch, ClickHouse, DynamoDB, or anything else, as long as the HTTP API behaves correctly. This silence is deliberate. It's why the LRS market has produced everything from a 200-megabyte SQLite-backed LRS that runs on a Raspberry Pi to clustered LRS deployments handling billions of statements.

The **xAPI 1.0.3 specification** defines five HTTP endpoints, all rooted at the same base path (`/xAPI/`):

- `/xAPI/statements` — the heart of the LRS; statements POST in, statements GET out
- `/xAPI/agents` — read-only endpoint for retrieving aggregated learner profiles
- `/xAPI/activities` — read-only endpoint for retrieving aggregated activity definitions
- `/xAPI/state` — read/write endpoint for per-learner activity state (resumable progress)
- `/xAPI/about` — read-only endpoint advertising LRS capabilities and supported xAPI versions

Before we look at the architecture diagram, here's the orientation. Most of your traffic will go to `/statements`. Most of your queries will go to `/statements`. Most of your debugging will involve `/statements`. The other four endpoints exist for narrower purposes and you'll rarely think about them after this chapter. We're spending most of the page-count on the heart, less on the auxiliaries — but the auxiliaries are real, and you'll be glad you know they exist when the right use case shows up.

#### Diagram: LRS Architecture Overview

<details markdown="1">
<summary>LRS Architecture Overview</summary>
Type: clickable-mermaid
**sim-id:** lrs-architecture-overview<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Identify the major components of a conformant LRS — HTTP API layer, the five endpoints, the storage layer, and the indexing layer — and explain how a request flows through each.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node open a side-panel infobox.

**Structure:**

- Client (Activity Provider) on the left
- HTTP API layer (single node) labeled "xAPI HTTP API (auth + version negotiation)"
- The five endpoint nodes branching from the API layer: `/statements`, `/agents`, `/activities`, `/state`, `/about`
- A single "Storage Layer" node downstream of the endpoints, labeled "Document/Relational/Hybrid"
- An "Indexing Layer" node parallel to storage, labeled "Inverted indexes on actor, verb, object, timestamp"
- An arrow from `/statements` POST flowing through both Storage and Indexing
- An arrow from `/statements` GET flowing through Indexing first, then Storage

**Mermaid config:** project standard (`nodeSpacing: 12`, `rankSpacing: 60`, `padding: 4`, `useMaxWidth: true`, `securityLevel: 'loose'`).

**Click behavior:** Each node opens a side-panel infobox describing the component, what xAPI fields it cares about, and a one-line example of a request that exercises it.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives bound to a side panel populated from `data.json`.
</details>

## Storage Models — Mutable vs Immutable

**LRS storage models** are the architectural decisions an LRS vendor makes about how statements are stored physically and what operations are allowed on them after storage. The most consequential decision is mutability.

A **mutable LRS** allows existing statements to be modified in place. This sounds convenient and is, in fact, almost never what you want. Mutability undermines the audit trail, makes voiding semantics ambiguous (if you can modify a statement, why void?), and tends to attract requirements ("can you also let me edit timestamps?") that erode the credibility of the data. Mutable LRSs exist in the market, but the gravitational pull of the xAPI ecosystem is strongly toward immutability.

An **immutable LRS** treats every stored statement as permanent. The only way to retract a statement is to void it (Chapter 3) by emitting a new statement that references the original. The original is still there, queryable with `voided=true`, but excluded from default queries. This is the model the xAPI spec implicitly assumes and the model that makes auditability work. New deployments should always choose immutability, full stop.

| Property                  | Mutable LRS                                        | Immutable LRS                                      |
|---------------------------|----------------------------------------------------|----------------------------------------------------|
| Edit existing statements? | Yes                                                | No                                                 |
| Retract a statement       | Edit or delete in place                            | Emit a voiding statement                           |
| Audit trail               | Weakened — what you read may not be what was sent  | Intact — every record is the original              |
| Conformance with xAPI 1.0.3 | Permitted but discouraged                        | Standard                                           |
| Recommended for new deployments | No                                          | Yes                                                |

The implementation choice underneath the storage model is independent. An immutable LRS can be backed by an append-only log, by a relational database with `INSERT`-only access, by an event-sourced store, or by any other mechanism that ensures statements aren't modified after write. The xAPI spec doesn't care — it cares about the contract the HTTP API enforces.

## The Statements Endpoint

The **`/xAPI/statements` endpoint** is where almost everything happens. It accepts:

- `POST /xAPI/statements` — submit a single statement or an array of statements
- `PUT /xAPI/statements?statementId=...` — submit a statement with a client-chosen UUID
- `GET /xAPI/statements?<filters>` — query stored statements
- `GET /xAPI/statements?statementId=...` — fetch one statement by UUID

A POST that submits an array of statements stores them atomically — either all of them go in, or none of them do. This is the property that makes statement batching (Chapter 9) safe: a partial-failure outcome is impossible at the LRS layer. If the LRS rejects one statement in the batch (because, say, one had a malformed UUID), it rejects the whole batch and returns an error.

The response to a successful POST is the array of UUIDs assigned to the submitted statements, in the order they were submitted. If the client included an `id` on a statement, the LRS uses it; if not, the LRS mints a fresh UUID and returns it. Either way, after the POST, every statement has a stable identity the client can reference later.

```
POST /xAPI/statements
Authorization: Basic dXNlcjpwYXNz
Content-Type: application/json
X-Experience-API-Version: 1.0.3

[
  { "actor": ..., "verb": ..., "object": ... },
  { "actor": ..., "verb": ..., "object": ... }
]

→ HTTP 200 OK
[ "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
  "8a1f3c4d-2b9e-4c7a-9d6f-1e8a7b4c2d5f" ]
```

Note the `X-Experience-API-Version` header — it's required on every request. The LRS uses it to decide which version of the spec to apply. Forget the header and you get a 400 response that's surprisingly hard to debug if you don't know to look for it.

## Statement Query Filters

The GET form of `/statements` accepts a defined set of filter parameters that the LRS indexes on. These are the **statement query filters**, and they are deliberately limited — the xAPI spec doesn't allow arbitrary "give me all statements where some extension equals X" queries, because doing so would require the LRS to index every possible extension, which it can't. The supported filters answer the questions every analytics dashboard actually needs to ask. Before the worked example, here's what each filter does in plain language:

- **`agent`** — filter to statements involving this agent (as actor, as object, or in context)
- **`verb`** — filter to statements with this verb IRI
- **`activity`** — filter to statements involving this activity IRI
- **`registration`** — filter to a specific attempt UUID
- **`since`** / **`until`** — filter to a stored-timestamp range
- **`related_activities`** / **`related_agents`** — broaden the agent/activity filters to include context activities and group members
- **`voided`** — include voided statements (default `false`)
- **`limit`** — max statements per response (LRS may impose its own ceiling)
- **`ascending`** — order by stored timestamp ascending (default is descending)

A typical query for "every passed-quiz statement for Lin in the last 24 hours" looks like this:

```
GET /xAPI/statements?
  agent={"account":{"homePage":"https://canvas.university.edu","name":"stu-8f3a2b1c"}}
  &verb=http://adlnet.gov/expapi/verbs/passed
  &since=2026-04-29T00:00:00Z
```

Two annoyances worth flagging. First, the `agent` filter takes a JSON-encoded agent object as a query string parameter — yes, really, JSON-in-a-query-string. URL-encode it carefully. Second, the spec defines the *minimum* set of filters; many LRSs support additional non-standard filters via vendor extensions. Stick to the standard filters for portable queries.

## Pagination — `StatementResult` and `more` IRL

The response to a successful GET against `/statements` is a JSON object called a **StatementResult**, not a bare array. The shape:

```json
{
  "statements": [ /* array of statement objects */ ],
  "more": "/xAPI/statements?offsetToken=..."
}
```

The `statements` array contains up to `limit` statements (or whatever ceiling the LRS imposes — many cap at 1000). The `more` field is the **More IRL Pagination** mechanism: if the query had additional results beyond what fit in this response, the LRS provides a relative URL the client can GET to retrieve the next page. The client follows the chain by issuing GETs against the `more` URL until the field comes back as an empty string.

```
GET /xAPI/statements?verb=http://adlnet.gov/expapi/verbs/completed&limit=500
  → 500 statements + "more": "/xAPI/statements?offsetToken=abc123"

GET /xAPI/statements?offsetToken=abc123
  → 500 statements + "more": "/xAPI/statements?offsetToken=def456"

GET /xAPI/statements?offsetToken=def456
  → 117 statements + "more": ""   (no more results)
```

The pagination model is **opaque-token**, not page-number. The client should treat the `more` URL as an opaque string and just GET it as-is. The LRS controls the encoding of pagination state inside that URL — typically a cursor or stored-timestamp boundary — and may change the encoding between releases. Code that parses the `more` URL and synthesizes its own offset is fragile and will break.

#### Diagram: Statement Query and Pagination Flow

<details markdown="1">
<summary>Statement Query and Pagination Flow</summary>
Type: workflow-diagram
**sim-id:** statement-query-pagination-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Trace the round-trip flow of a paginated statement query, identifying when the client should follow the `more` URL and when to stop.

**Diagram type:** Mermaid flowchart (TD direction) representing the client-side loop. Click handlers on every node.

**Structure:**

1. Start: `Client builds initial GET with filters`
2. Action: `Send GET /xAPI/statements?...`
3. Decision diamond: `Response has non-empty more URL?` → No → `Done — all results retrieved`
4. From Yes → `Process statements array`
5. → `Send GET <more URL>` → loop back to decision

**Edges:** Solid arrows for the main loop; a side branch from "Process statements array" to "Hand off to dashboard / aggregation" indicates the data destination, not the loop.

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the step, with a one-line code snippet showing how a typical TypeScript client would implement that step.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
</details>

## The Auxiliary Endpoints

The four other endpoints handle narrower concerns. We'll cover each briefly so you know they exist and what they're for; you'll rarely write code that hits them directly.

The **`/xAPI/agents` endpoint** returns the LRS's aggregated view of a specific agent — typically all the IFI variants the LRS has seen for that agent and any agent profile data stored against them. You query it by passing an agent object as a JSON parameter, the same way you'd filter `/statements`. Use case: an admin tool that wants to display "everything we know about this learner." Almost never used inside an emit path.

The **`/xAPI/activities` endpoint** returns the LRS's aggregated activity definition for a specific activity IRI. Different statements about the same activity may have arrived with slightly different definitions over time (different `name` translations, an updated description); the LRS aggregates them and returns the canonical view. Use case: a content authoring tool that wants to look up an activity's official name.

The **`/xAPI/state` endpoint** is read/write storage for per-learner-per-activity state. It's the resumable-progress mechanism: a textbook that wants to remember "Lin scrolled to paragraph 47 and stopped" can PUT a state document keyed by `{agent, activity, stateId}` and GET it back next session. State is opaque to the LRS — it stores whatever JSON document you give it and returns it untouched. Use cases include resumable simulations, partial form submissions, and any UI state that needs to persist across sessions without going into the user's local storage.

The **`/xAPI/about` endpoint** returns a small JSON document describing what the LRS supports. The most important field is `version`, an array of xAPI versions the LRS accepts. Activity Providers should query `/about` once at startup, confirm the LRS supports the version the client wants to send, and warn or fail if not. This is what **xAPI version negotiation** looks like in practice:

```
GET /xAPI/about
→ HTTP 200
{
  "version": ["1.0.3", "1.0.2", "1.0.1"],
  "extensions": {}
}
```

A small but real concern: some LRSs return version arrays that include `2.0.0` (the next major version, in active development); clients should explicitly check for `1.0.3` rather than just using the first element of the array.

## LRS Concurrency and Conflict Resolution

**LRS concurrency** is the property that an LRS handles multiple simultaneous writes correctly. xAPI deployments routinely have hundreds of concurrent Activity Providers (browser tabs, mobile clients, simulation engines) all POSTing to the same LRS. The LRS has to ingest those POSTs without losing data, without corrupting state, and without serializing all writes through a single bottleneck.

The interesting concurrency case is the State endpoint. Two browser tabs from the same learner can both PUT to `/xAPI/state?activityId=quiz-1&stateId=progress` at almost the same moment. Without a concurrency mechanism, one tab's update silently overwrites the other's. The xAPI spec mandates HTTP `If-Match` and `If-None-Match` headers carrying ETag values for State operations, exactly to handle this case. The pattern:

1. Client GETs the state, receives the document plus an `ETag` header.
2. Client modifies the document locally.
3. Client PUTs the new document with `If-Match: <previous-ETag>`.
4. If the document hasn't changed on the server, the LRS accepts the PUT and returns a new ETag.
5. If the document has changed, the LRS returns `412 Precondition Failed` and the client must re-fetch and retry.

**Conflict resolution (LRS)** at the State endpoint is therefore optimistic — concurrent writers don't block each other; the second writer just gets a 412 and is responsible for resolving the conflict. At the Statements endpoint, conflict resolution is simpler: statements are immutable, so concurrent POSTs of *different* statements never conflict; concurrent POSTs of the *same* statement (same UUID) result in the LRS storing the first and rejecting subsequent duplicates with `409 Conflict`.

#### Diagram: Optimistic Concurrency on the State Endpoint

<details markdown="1">
<summary>Optimistic Concurrency on the State Endpoint</summary>
Type: workflow-diagram
**sim-id:** optimistic-concurrency-state-endpoint<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace two concurrent clients writing to the same state document and identify which writer wins, which gets a 412, and what the losing client must do to recover.

**Diagram type:** Mermaid flowchart (TD direction) showing two parallel client lanes converging on a single LRS lane. Click handlers on every node.

**Structure:**

- Two parallel lanes labeled `Client A` and `Client B`, each starting with `GET /state → ETag v1`
- Both lanes modify locally
- Client A: `PUT with If-Match: v1` → LRS returns `200, ETag v2`
- Client B: `PUT with If-Match: v1` → LRS returns `412 Precondition Failed`
- Client B then `GET /state → ETag v2`, merge, `PUT with If-Match: v2` → LRS returns `200, ETag v3`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox showing the HTTP message in detail, plus a one-line note on what a robust client implementation does at that step.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with two parallel subgraphs and click directives.
</details>

## LRS Scalability

**LRS scalability** is the architectural property that a single LRS deployment can serve more concurrent learners and store more cumulative statements without falling over. Scalability is where LRS vendors differentiate most heavily — and where deployment decisions cost or save the most money.

The dimensions to think about:

- **Ingestion rate** — peak statements per second the LRS can absorb without dropping requests. Classroom deployments need 10–100 statements/sec sustained, district-wide deployments may need 5–20k statements/sec during assessment windows.
- **Query latency under load** — how long the median `/statements` query takes when ingestion is also at peak. The two workloads compete for the same indexes, and badly-tuned LRSs see query latency spike the moment ingestion does.
- **Storage volume** — total statements accumulated over the deployment lifetime. A single 9th-grade textbook used by a state of 800,000 students for a year can produce 5–50 billion statements. Storage planning matters.
- **Query capability** — the breadth of indexed filters and the speed of compound queries. **LRS query capability** varies wildly between platforms — some support only the spec-mandated filters, some add full-text search, some support GraphQL or SQL passthrough.

The **LRS endpoint configuration** that ties this together is, at minimum: a base URL, an authentication credential, and a chosen xAPI version. In production deployments, it's typically more — connection pool sizes, read replicas, batch limits, retry policies. Activity Providers and clients are configured with this information at startup and re-validate against `/about` periodically to detect upgrades.

!!! mascot-warning "Common Pitfall — Choosing the LRS Last"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Xavi raising a tentacle in caution">
    Many teams pick an LRS by demoing the smallest open-source one on a laptop, building all their instrumentation around it, and discovering during pilot that it doesn't scale. Pick your LRS *with* your scale targets in mind, not after. Chapter 7 walks through the platforms; the wrong choice here can cost a re-platform.

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 7.

- You can describe the three layers of an LRS architecture and the role of each.
- You can explain why immutability is the standard for new LRS deployments and what the alternative costs you.
- You can name and describe the five canonical xAPI endpoints (`/statements`, `/agents`, `/activities`, `/state`, `/about`).
- You can construct a `/statements` GET query with the standard filters and parse the resulting `StatementResult`.
- You can follow a `more` IRL pagination chain correctly without parsing the URL.
- You can explain optimistic concurrency at the State endpoint, including when a 412 is the *correct* response and how a robust client recovers from it.
- You can articulate the three or four scalability dimensions that matter when evaluating an LRS for a real deployment.

!!! mascot-celebration "The Black Box Is Open"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating an open black box">
    The LRS is no longer mysterious. You can now look at any conformant deployment, sketch its architecture, predict how it will behave under load, and write portable code against its endpoints. Chapter 7 picks up where this one stops: which actual LRS platforms exist on the market today, how they differ, and how authentication works on each.

<<<<<<< HEAD
=======
## References

>>>>>>> d2ecc9b (iframe updates)
[See Annotated References](./references.md)
