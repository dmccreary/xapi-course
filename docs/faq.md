# xAPI for Intelligent Textbooks FAQ

A curated, searchable set of answers to the questions that come up most often when learners and engineers first encounter the xAPI standard, the LRS ecosystem, and the practical work of instrumenting an intelligent textbook. Questions are grouped by category and progress from orientation through everyday concepts, deep technical detail, common pitfalls, best practices, and advanced topics.

## Getting Started Questions

### What is this course about?

This is a course for software professionals who are building or extending Level 3 interactive intelligent textbooks and want to instrument them with the **Experience API (xAPI)** for detailed learner analytics. It covers the full pipeline: the Actor/Verb/Object statement model, the Learning Record Store (LRS) ecosystem, verb vocabulary design, bandwidth optimization, monitoring, conformance testing, synthetic data generation with Claude Code, and the privacy frameworks (FERPA, COPPA, GDPR) that decide whether your textbook ships at all. The framing across the book is consistent: xAPI is the *nervous system* of a modern intelligent textbook — every meaningful learner interaction becomes a structured, queryable record. See the full [course description](course-description.md) for outcomes, prerequisites, and topic coverage.

### Who is this course for?

The course targets web developers, instructional technologists, learning engineers, and platform architects working on intelligent textbook projects. It assumes proficiency in at least one web programming language (JavaScript or TypeScript preferred), familiarity with REST and HTTP/JSON, and basic database concepts. Experience with generative AI coding assistants such as Claude Code is helpful but not required. No prior knowledge of xAPI, SCORM, or the broader learning standards ecosystem is assumed — Chapter 1 establishes that foundation. See the [course description](course-description.md) for the full prerequisites list.

### What will I be able to do after finishing the course?

You will be able to read any well-formed xAPI statement field by field, design a verb vocabulary profile that does not collapse into chaos, configure and query a conformant LRS, build a JavaScript or TypeScript xAPI client library that batches and retries on flaky networks, generate realistic synthetic learner cohorts with Claude Code, monitor and debug xAPI traffic with browser DevTools and proxy tools, and ship an instrumented textbook through a defensible privacy review. The capstone is instrumenting a complete textbook chapter with a production-quality xAPI implementation, including offline support, batched delivery, a custom verb profile, and a monitoring dashboard.

### Do I need to know SCORM before learning xAPI?

No. SCORM background helps with context — Chapter 12 maps SCORM 2004's completion and score model into xAPI verbs — but it is not a prerequisite. The course explicitly assumes no prior knowledge of any learning standard. Chapter 1 introduces the [foundations and the broader standards landscape](chapters/01-foundations-and-standards/index.md), including SCORM, AICC, CMI5, IMS Caliper, LTI, and QTI, so readers from any background land in the same place by the end of the chapter.

### What programming languages does the course use?

JavaScript and TypeScript are the primary languages. The xAPI client library built across [Chapter 8](chapters/08-implementing-in-textbooks/index.md) is TypeScript, and the textbook examples emit statements from the browser using the `fetch` API. Some code samples use small TypeScript validators or Python tooling for synthetic data generation, but the production instrumentation path is browser-based JavaScript or TypeScript.

### What is a Level 3 interactive intelligent textbook?

A Level 3 intelligent textbook is a textbook with three properties: it renders as web content (HTML, CSS, JavaScript); it contains genuinely interactive elements such as MicroSims, quizzes, simulations, and adaptive branching; and it captures behavioral signals from those interactions through structured instrumentation. xAPI is the standard instrumentation layer for Level 3 textbooks. Levels 1 and 2 are static and non-instrumented respectively; Level 3 is the level where the textbook becomes a *sensor*. See [Chapter 8](chapters/08-implementing-in-textbooks/index.md) for the full architecture.

### Why should I care about xAPI when SCORM still exists?

SCORM constrains learning to browser-locked modules with a narrow completion/score model that was designed when the LMS was the entire universe. xAPI generalizes to *any* digital experience — a quiz, a simulation, a watched video, a mobile interaction, an AI-tutored conversation — and emits structured statements into a queryable Learning Record Store. The granularity is dramatically higher, the vocabulary is open and extensible, and the data lives in a system designed to be queried, not just totaled. xAPI is the only open standard with sufficient granularity to capture the full richness of intelligent textbook interactions. See the [course description](course-description.md) for the broader rationale.

### What hardware or software do I need?

A modern web browser with DevTools (Chrome, Firefox, or Safari), Node.js (for running the client library and conformance test suite), and a local LRS for hands-on practice. Open-source options covered in [Chapter 7](chapters/07-lrs-platforms-and-auth/index.md) — TRAX, Learning Locker, and Ralph — all run on a developer laptop. A proxy tool such as Charles or `mitmproxy` is useful for the [monitoring chapter](chapters/10-monitoring-and-observability/index.md) but not strictly required.

### How long does it take to complete the course?

The book has 14 chapters covering 250 concepts, plus quizzes, MicroSims, and a capstone project. A motivated developer can read the chapters in roughly two to three weeks, with another two to four weeks for the hands-on practice (standing up an LRS, instrumenting a chapter, generating synthetic data, running the conformance suite). The capstone project — instrumenting a complete chapter with offline support, batching, a custom verb profile, and a dashboard — typically adds another one to two weeks.

### Where do I start if I am brand new to xAPI?

Start at [Chapter 1: Foundations](chapters/01-foundations-and-standards/index.md), which establishes vocabulary and orients you in the standards landscape. Then read [Chapter 2: The Statement Model](chapters/02-statement-model/index.md) carefully — fluency with the Actor/Verb/Object triple is the foundation skill for everything else in the book. The chapters are sequenced so that every concept's prerequisites have already been introduced; reading in order is the path of least friction.

### What is the textbook's mascot for?

Xavi the octopus appears at chapter openings, key concepts, common pitfalls, and chapter endings. The mascot has exactly six jobs: welcoming readers, prompting reflection, sharing tips, warning about mistakes, encouraging through difficult sections, and celebrating chapter completions. Xavi's catchphrase, "Every interaction tells a story," summarizes the book's framing: xAPI exists to turn fleeting learner interactions into durable, queryable records.

### Is the course material free?

The textbook is published under a Creative Commons Attribution-NonCommercial-ShareAlike license. You may read, share, and adapt the material for non-commercial use with attribution. See the [license page](license.md) for the complete terms.

## Core Concepts

### What is an xAPI statement?

A statement is the fundamental unit of data in xAPI — a JSON object describing one learning event: one thing one actor did, one time, to one object. Every conformant statement contains three required fields: `actor` (who did it), `verb` (what they did), and `object` (what they did it to). It may optionally carry `result`, `context`, `id`, `timestamp`, `stored`, `authority`, and `version`. Anything that conforms to the schema is a statement; anything that doesn't, isn't. There is no "kind of a statement." See [Chapter 2](chapters/02-statement-model/index.md) for the full anatomy.

**Example:** A minimal conformant statement says *Lin Park passed the Quadratics Quiz* with `actor.mbox = "mailto:lin@example.edu"`, `verb.id = "http://adlnet.gov/expapi/verbs/passed"`, and `object.id = "http://textbook.example.org/chapters/quadratics/quiz"`.

### What does Actor / Verb / Object mean in xAPI?

It is the irreducible core of every xAPI statement, modeled on the grammar of an English sentence. The **Actor** is who performed the action (a learner, a group, an automated agent), the **Verb** is what they did (`experienced`, `attempted`, `passed`, `completed`), and the **Object** is what they did it to (an activity, another agent, content). Everything else in the statement — `result`, `context`, timestamps, authority — is decoration that adds precision. The triple itself is what makes a statement a statement. See [Chapter 2](chapters/02-statement-model/index.md).

### What is a Learning Record Store?

A Learning Record Store (LRS) is a server that implements the xAPI HTTP API. It accepts statements via POST, stores them durably, and serves them back via GET against a small set of canonical endpoints (`/statements`, `/agents`, `/activities`, `/state`, `/about`). Anything that conforms to the contract is an LRS; anything that doesn't, isn't. Architecturally, an LRS has three layers: an HTTP API layer, a storage layer (which can be PostgreSQL, MongoDB, ClickHouse, or anything else — the spec is silent), and an indexing layer that makes queries fast. See [Chapter 6](chapters/06-lrs-architecture/index.md) for storage models and endpoints.

### How is an LRS different from a Learning Management System?

An LMS (Canvas, Moodle, Blackboard) is a learning *delivery* and *gradebook* system; an LRS is a learning *event ledger*. The LMS hosts courses, enrolls students, and records final grades. The LRS captures the fine-grained behavioral stream behind those grades — every interaction, every attempt, every progression event — and makes that stream queryable. An LMS typically integrates with one or more LRSs; the LRS receives the granular signals while the LMS keeps the gradebook of record. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### What is a verb in xAPI?

A verb describes the action an actor performed and is identified by a fully-qualified IRI (Internationalized Resource Identifier) — almost always an HTTPS URL such as `http://adlnet.gov/expapi/verbs/passed`. Two verbs with the same IRI are *the same verb* across the entire xAPI ecosystem, regardless of who emitted them. Two verbs with different IRIs are *different verbs*, even if they have identical English display strings. The IRI is the identity. The display string is just for humans. See [Chapter 4](chapters/04-verb-vocabulary-design/index.md).

### What is an activity in xAPI?

An activity is the thing a verb is happening *to* — a quiz, a chapter, a simulation, a video, anything that can be uniquely named. Like verbs, activities are identified by IRIs. The naming rule that matters is that **activity IRIs are durable, not generated**: the same activity has the same IRI today, tomorrow, and in five years. The IRI does not contain a learner ID, a session ID, a build hash, or a timestamp. Everything else in the activity object — name, description, type — is metadata that may vary between statements. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### What is a verb IRI namespace?

A verb IRI namespace is the path prefix that signals "this verb belongs to a particular registry or vocabulary." The ADL verbs all live under `http://adlnet.gov/expapi/verbs/`. The older tincan verbs live under `http://activitystrea.ms/schema/1.0/`. Custom verbs you mint for your textbook should live under a namespace you own — `https://textbook.example.org/xapi/verbs/` is fine; `myverbs/` is not. Namespaces prevent two organizations from coining the same local verb name and meaning different things. See [Chapter 4](chapters/04-verb-vocabulary-design/index.md).

### What is the ADL Verb Registry?

The ADL Verb Registry, hosted under `http://adlnet.gov/expapi/verbs/`, is the curated set of canonical verbs maintained by the Advanced Distributed Learning Initiative. It includes `experienced`, `attempted`, `completed`, `passed`, `failed`, `scored`, `interacted`, `progressed`, `launched`, `initialized`, `terminated`, and `abandoned`, among others. Using ADL-registered verbs makes your statements interoperate immediately with off-the-shelf xAPI tools and dashboards. The canonical set covers roughly 80% of events an intelligent textbook will ever emit. See [Chapter 4](chapters/04-verb-vocabulary-design/index.md).

### What is xAPI context?

The `context` field carries information about the *circumstances* of a statement: which course, which learning session, which platform, which language, which instructor, which preceding activity. It is what lets analytics group, filter, and stitch together related statements that would otherwise look isolated. The most important sub-field is `contextActivities`, which has four buckets — `parent`, `grouping`, `category`, and `other` — each describing a different relationship to other activities. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### What is the result field?

The `result` field answers "how did the activity end?" It has five standard sub-fields: `score` (numeric performance, including `scaled`, `raw`, `min`, and `max`), `success` (boolean — did the learner pass the bar?), `completion` (boolean — did they finish?), `duration` (ISO 8601 string like `PT47S`), and `response` (free-form learner output). Critically, `success` and `completion` are *separate* booleans because conflating them — as SCORM did for years — produces confused gradebooks. A learner can finish without passing, or pass without finishing.

**Example:** `"result": {"score": {"scaled": 0.75, "raw": 3, "min": 0, "max": 4}, "success": true, "completion": true, "duration": "PT47S"}`. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### What are the three xAPI ecosystem roles?

xAPI defines three roles that move statements through the world. An **Activity Provider (AP)** generates statements and POSTs them to an LRS — it is the system closest to the learner. A **Learning Record Provider (LRP)** is the broader category that includes APs and any other system that asserts authority over statements. An **Activity Consumer** reads statements back from the LRS to power dashboards, analytics, recommendation engines, or downstream pipelines. An intelligent textbook is an AP; an Observable Framework dashboard is an Activity Consumer; the LRS itself is the durable middle layer. See [Chapter 2](chapters/02-statement-model/index.md).

### What is an inverse functional identifier?

An inverse functional identifier (IFI) is the field that uniquely identifies an actor (or agent). xAPI defines exactly four kinds: `mbox` (mailto URI), `mbox_sha1sum` (a SHA-1 hash of an mbox, for privacy), `openid` (an OpenID URL), and `account` (a `homePage` plus `name` pair, where `homePage` is the identity provider's URL and `name` is the identifier within that system). An agent must have *exactly one* IFI — not zero, not two. The IFI determines whether two statements describe the same learner. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

**Example:** `"actor": {"objectType": "Agent", "account": {"homePage": "https://canvas.example.edu", "name": "stu-8f3a2b1c"}}` identifies a learner by a pseudonymous Canvas ID rather than by name or email.

### What is statement voiding?

Voiding is xAPI's *audit-preserving retraction* mechanism. You never delete a statement. If a statement was emitted by mistake, you emit a new statement with verb `http://adlnet.gov/expapi/verbs/voided` whose object is a `StatementRef` pointing at the original UUID. The voided statement is still stored in the LRS, queryable with `voided=true`, but excluded from default queries. The trail stays intact, which is the property that makes xAPI auditable in ways most analytics pipelines aren't. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### What is CMI5?

CMI5 is a *profile* on top of xAPI — a constrained set of rules that an LMS-launched activity is expected to follow. It defines a session lifecycle (`launched`, `initialized`, `passed`, `failed`, `completed`, `terminated`, `abandoned`), specifies how activities are launched from an LMS, requires a registration UUID, and pins down statement patterns that LMS gradebooks can interpret consistently. CMI5 is *not* a competitor to xAPI; it is xAPI used in a particular disciplined way. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

### What is the difference between xAPI and IMS Caliper?

Both are modern learning-event standards, but they take different shapes. xAPI is more flexible (open vocabulary, custom verbs welcome) and more granular (can describe almost any digital interaction). IMS Caliper is more constrained (fixed event types, fixed property schemas) and has stronger native LMS-vendor support. xAPI's flexibility is its superpower and its risk — verb sprawl is the most common failure mode. Caliper's constraints make queries simpler but limit expressiveness. See [Chapter 12](chapters/12-conformance-and-comparison/index.md) for the full head-to-head.

### What is statement batching and why does it matter?

Statement batching is the practice of buffering several statements in memory briefly, then POSTing them as a JSON array in a single HTTP request. xAPI's `/statements` endpoint accepts arrays natively, so the protocol cost is zero. The wire savings are large: the per-statement HTTP overhead (headers, TLS handshake amortization) is paid once per batch instead of once per statement. A 20-statement batch can be roughly 10× cheaper on the wire than 20 individual posts. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md) for the bandwidth math.

### What is an offline statement queue?

An offline statement queue is a client-side store (typically IndexedDB, with LocalStorage as a fallback) that holds statements when the network is unavailable. The xAPI client library writes every emit into the queue first, then flushes the queue to the LRS when connectivity is detected. A service worker can do the same flushing in the background using the Background Sync API. The result is that the textbook keeps working — and keeps capturing data — through the daily WiFi outages of a real classroom. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### What is a service worker in the xAPI context?

A service worker is a browser-level script that runs independently of the page and intercepts network requests. In xAPI deployments, a service worker can detect when the network is down, queue outgoing statements locally, and flush them automatically when connectivity returns — even if the original page has been closed. This is the foundation of offline-resilient textbook instrumentation. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### What is pseudonymization?

Pseudonymization is the practice of replacing real-world identifiers (names, emails, student IDs) with opaque tokens that allow analytics to link statements together without exposing identity. The recommended pattern is to use the `account` IFI with a stable per-deployment pseudonym (`{"account": {"homePage": "https://...", "name": "stu-8f3a2b1c"}}`). The mapping from pseudonym to real identity lives in a separate, access-controlled system, not in the LRS. Pseudonymization is the cheapest privacy upgrade most deployments can make. See [Chapter 5](chapters/05-activities-agents-identity/index.md) and [Chapter 14](chapters/14-privacy-and-compliance/index.md).

### What is xAPI conformance?

Conformance is the verifiable claim that a piece of software (an LRS, an Activity Provider, or both) implements the xAPI 1.0.3 specification correctly. The official test harness is the ADL Conformance Test Suite, hosted at `https://github.com/adlnet/lrs-conformance-test-suite`. Passing the suite is the baseline requirement for claiming conformance; it does not test performance or scalability, only correctness against the spec. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

### What is an MicroSim?

A MicroSim is a small, self-contained interactive simulation embedded in the textbook — typically rendered with p5.js, Mermaid, or Chart.js — that learners can manipulate. Each MicroSim is a candidate emit site: when a learner adjusts a slider, drags a node, or completes a guided exploration, the textbook emits an xAPI statement. MicroSims are how Level 3 textbooks turn passive reading into instrumented learning. The course covers MicroSim instrumentation in [Chapter 8](chapters/08-implementing-in-textbooks/index.md).

### What is mutable vs immutable LRS storage?

A **mutable** LRS allows existing statements to be modified after storage. An **immutable** LRS treats every stored statement as permanent — the only way to retract is voiding (a new statement that references the original). Immutable storage is the model the xAPI specification implicitly assumes and the model that makes auditability work. Mutable LRSs exist in the market, but the gravitational pull of the ecosystem is strongly toward immutability. New deployments should always choose immutable. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### What is the xAPI registration field?

The `registration` field is a UUID placed in `context.registration` that ties together a sequence of statements describing one *attempt* at an activity. If the same learner takes the quadratics quiz three times, each attempt should have its own registration UUID. The activity IRI stays the same; the registration changes. Registration is required for CMI5 and is essential for attempt-level analytics such as time-on-task per attempt and score progression across retries. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### What is statement authority?

The `authority` field names the entity that vouches for a statement's truthfulness. It is usually set by the LRS at storage time based on the credentials used to POST the statement. Authority matters when statements arrive from multiple sources — a textbook AP, an instructor's manual override, an LMS gradebook reconciliation. Two statements with different authorities asserting different things about the same learner can both be valid; consumers decide which to trust. See [Chapter 2](chapters/02-statement-model/index.md).

## Technical Detail Questions

### What are the five LRS endpoints?

The xAPI 1.0.3 specification defines five HTTP endpoints, all rooted at the same base path: **`/xAPI/statements`** is the heart — statements POST in, statements GET out. **`/xAPI/agents`** returns aggregated learner profile data. **`/xAPI/activities`** returns aggregated activity definitions. **`/xAPI/state`** is read/write per-learner activity state for resumable progress. **`/xAPI/about`** advertises supported xAPI versions and capabilities. Most traffic goes to `/statements`; the others exist for narrower purposes. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### What HTTP authentication does xAPI use?

xAPI 1.0.3 specifies two authentication mechanisms: **Basic Auth** (a base64-encoded `username:password` in the `Authorization` header — simple, widely supported, suitable for development and for production deployments using HTTPS-only credentials provisioned per AP) and **OAuth 1.0a** (signature-based, more complex, more flexible). In practice most production deployments use Basic Auth over HTTPS with credentials managed as secrets. Many vendors also offer **token-based authentication** as an extension. See [Chapter 7](chapters/07-lrs-platforms-and-auth/index.md).

### What is a typical xAPI statement payload size?

A freshly-emitted xAPI statement, serialized as JSON, lands somewhere between **700 and 1500 bytes** depending on extensions, attachment metadata, and language map size. Add HTTP overhead (request line, headers, response) and the wire cost climbs to **1500–3000 bytes per individual statement** when each is POSTed alone. Roughly half of that wire cost is *not* the statement itself, which is the inefficiency batching attacks. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### What is the X-Experience-API-Version header?

`X-Experience-API-Version` is a required HTTP header on every xAPI request, naming the version of the spec the client is using (typically `1.0.3`). The LRS uses it for version negotiation: it may accept a request, reject it, or downgrade behavior based on the declared version. Forgetting the header is the most common reason a first xAPI POST returns 400 with an unhelpful error. See [Chapter 7](chapters/07-lrs-platforms-and-auth/index.md).

### What ISO 8601 format does xAPI use for durations?

The `result.duration` field uses the ISO 8601 *duration* format, which starts with `PT` (period of time) and uses unit suffixes: `S` for seconds, `M` for minutes, `H` for hours. **`PT47S`** means 47 seconds. **`PT3M12S`** means 3 minutes 12 seconds. **`PT1H30M`** means one and a half hours. A bare number (`47s`, `47`) does *not* parse and will be rejected by the LRS. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### What is the difference between mbox and mbox_sha1sum?

`mbox` carries the learner's actual email address as a `mailto:` URI: `"mbox": "mailto:lin@example.edu"`. `mbox_sha1sum` carries a SHA-1 hash of that same string: `"mbox_sha1sum": "ebd31e95054c1f5b0e9f70e8e3e12a51e7cb6a5d"`. The hash form lets two systems prove they are talking about the same learner without either exposing the email in the LRS — useful when one system already knows the email and the LRS does not need to. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### What is the difference between an Agent and a Group in xAPI?

An **Agent** has `objectType: "Agent"` and represents a single individual or system, identified by exactly one IFI. A **Group** has `objectType: "Group"` and represents a collection of agents. Groups come in two flavors: an **identified group** has its own IFI (the group itself is identifiable), and an **anonymous group** has no IFI and is identified only by its `member` array. Use a group as an actor when the *collective* performed the action and there is no meaningful individual to credit. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### What does a context activity look like in JSON?

`context.contextActivities` is an object with up to four keys — `parent`, `grouping`, `category`, `other` — each holding an array of activity objects.

**Example:**

```json
"context": {
  "contextActivities": {
    "parent":   [{"id": "http://textbook.example.org/chapters/quadratics"}],
    "grouping": [{"id": "http://textbook.example.org/courses/algebra-1"}],
    "category": [{"id": "http://textbook.example.org/profiles/v1"}]
  }
}
```

`parent` is the immediate container; `grouping` is the broader course or program; `category` typically points at a profile or vocabulary; `other` is anything else relevant. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### What is an extension in xAPI?

Extensions are namespaced custom fields that you can attach to a statement, an activity, a result, or a context. They live as a JSON object whose keys are IRIs you own (so two organizations cannot collide on the same key) and whose values are arbitrary JSON. Extensions are how you carry data the spec does not standardize — a quiz's question text, a simulation's parameter values, a learner's chosen branch — without breaking conformance.

**Example:** `"extensions": {"https://textbook.example.org/xapi/ext/branch-taken": "remediation-path-A"}`. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### How do I query statements from the LRS?

You GET `/xAPI/statements` with query parameters as filters: `agent` (a JSON-encoded actor), `verb` (a verb IRI), `activity` (an activity IRI), `since` and `until` (ISO 8601 timestamps), `registration`, `related_activities`, `related_agents`, `format`, and others. The response is a `StatementResult` object with a `statements` array and an optional `more` IRL for pagination. Always include `X-Experience-API-Version` and remember to URL-encode JSON parameters. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### What is the More IRL for pagination?

When a query returns more statements than the LRS chooses to send in a single response, the response includes a `more` field whose value is an IRL (Internationalized Resource Locator) — essentially a relative URL. To get the next page, GET that IRL. Page size is at the LRS's discretion; clients should not assume a particular size and should keep following `more` until it is absent or empty. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### How does the xAPI state endpoint work?

The `/xAPI/state` endpoint is read/write key-value storage scoped to a learner-and-activity pair. APs use it to persist resumable progress (current page, last quiz answers, simulation parameters) so the learner can pick up where they left off. State is keyed by `agent`, `activity`, an optional `registration`, and a state ID. It is *not* the right place for analytics — it is private working memory for the AP. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### What are 4xx vs 5xx errors from an LRS?

**4xx errors** are client-side problems — the LRS is fine, the request is wrong. 400 means malformed JSON, missing required fields, or invalid types; 401 means bad credentials; 403 means valid credentials but no permission; 409 means conflict (e.g., a statement with a duplicate UUID and different content). 4xx errors should *not* be retried — they will fail the same way every time. **5xx errors** are server-side — the LRS is in trouble (500 internal error, 502 bad gateway, 503 unavailable). 5xx errors *should* be retried with exponential backoff. See [Chapter 8](chapters/08-implementing-in-textbooks/index.md).

### How does retry-with-backoff work for xAPI?

Retry-with-backoff is the pattern of resending a failed request after a delay that grows exponentially with each attempt. A typical sequence is: first retry after 1 second, then 2, then 4, then 8, with jitter (random fractional offset) added so a thundering herd of clients does not synchronize. After a small number of attempts (3–5), give up and queue the statement to disk. Retries happen only on 5xx and certain network errors, never on 4xx. See [Chapter 8](chapters/08-implementing-in-textbooks/index.md).

### What is HTTP/2 multiplexing in the xAPI context?

HTTP/2 multiplexing lets a single TCP connection carry many concurrent requests interleaved at the frame level. For xAPI clients, this means many small POSTs on the same connection do not pay the full TCP and TLS handshake cost each time. The practical effect on bandwidth is modest compared to batching, but the latency improvement on lossy networks can be large. Most LRSs and CDNs in front of them speak HTTP/2 by default in 2026. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### What is delta encoding for xAPI?

Delta encoding sends only the *difference* from a previous statement instead of a full new statement. For high-frequency events (slider drags, simulation tick-by-tick parameter changes) this can shrink payloads by an order of magnitude. The cost is that the LRS must reconstruct the full statement before storage, which the standard does not natively support — delta encoding is therefore implemented at the AP and a server-side reassembly proxy that emits full statements to the LRS. Use sparingly, and only after batching. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### What does the about endpoint return?

`GET /xAPI/about` returns a small JSON object that declares the LRS's supported xAPI versions and any extensions it supports. It is used by APs for version negotiation before committing to a particular request format.

**Example:** `{"version": ["1.0.3", "1.0.2"]}` informs the AP that the LRS accepts both versions. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### What is the xAPI 1.0.3 specification?

xAPI 1.0.3 is the canonical version of the specification this textbook targets. It defines the statement schema, the LRS HTTP API, the conformance requirements, and the data types and validation rules. xAPI 2.0 exists as a draft from IEEE but adoption in 2026 still trails 1.0.3 substantially; new deployments are best advised to ship 1.0.3 first and migrate later. See [Chapter 2](chapters/02-statement-model/index.md) and [Chapter 12](chapters/12-conformance-and-comparison/index.md).

## Common Challenge Questions

### Why was my first xAPI POST rejected with a 400?

The four most common causes, in rough order of frequency: (1) missing `X-Experience-API-Version` header — xAPI requires it on every request; (2) missing or malformed required field — `actor`, `verb`, or `object` is absent or shaped wrong; (3) the actor has zero or multiple IFIs (it must have exactly one); (4) `verb.id` or `object.id` is not a valid IRI. Run a structured validator on the statement client-side before emitting; the round-trip cost of debugging via 400 responses is much higher. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

### Why are my statements showing up with the wrong actor?

The most common cause is inconsistent IFI selection across emit sites — one component uses `mbox`, another uses `account`, a third uses `mbox_sha1sum` — so the LRS sees them as three different learners. The fix is to pick *one* IFI strategy in the AP configuration and apply it uniformly everywhere. The `account` IFI with a per-deployment pseudonym is the recommended default. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### Why does my dashboard show no data even though statements are flowing?

Dashboards typically query statements by verb IRI. If your textbook is emitting `experienced` while the dashboard is filtering for `viewed`, the dashboard sees nothing — both are valid verbs, but they have different IRIs. The fix is verb vocabulary discipline: agree on a project verb profile (Chapter 13), stick to it everywhere, and document any custom verb in the profile. *Verb sprawl* is the single most common reason xAPI deployments end up with analytics nobody trusts. See [Chapter 4](chapters/04-verb-vocabulary-design/index.md).

### Why is my offline queue losing statements?

The most common causes: (1) the queue uses LocalStorage (which has a 5–10 MB cap and string-only storage) instead of IndexedDB (much larger and structured); (2) the service worker is not actually registered, or is registered with the wrong scope; (3) the queue flush logic deletes statements before confirming the LRS accepted them. Always treat a flush as transactional: dequeue only after a 2xx response, and re-queue on any 5xx. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### How do I avoid emitting a statement on every mouse move?

By distinguishing *raw input events* from *meaningful learning events*. A slider drag fires hundreds of input events; the meaningful learning event is "the learner settled on a value." Debounce the input stream (typically 250–500 ms after the last event), then emit one statement summarizing the final state. The best instrumented textbooks are *precise, not exhaustive*. Emitting a statement on every mouse move is the wrong answer; emitting one on every meaningful learning event is the right one. See [Chapter 8](chapters/08-implementing-in-textbooks/index.md).

### Why does my LRS query timeout under load?

Three common causes. (1) Missing indexes on `actor`, `verb`, `object`, or `timestamp` — the LRS storage layer needs them to filter at scale. (2) Queries that ignore `since`/`until` and scan the entire statement history. (3) A single-instance LRS that does not horizontally scale with load. The fix begins with measurement: capture a slow-query log, identify the missing index or the unbounded scan, and address one before guessing at the next. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### Why are my synthetic learners all behaving identically?

The generator probably collapsed to the happy path: every learner finishes every chapter, every quiz is passed on the first try, every session is exactly the average length. Real cohorts have a long tail. The fix is to model **learner archetypes** — fast learner, struggling learner, disengaged, re-learner, mastery-seeker — with different verb frequency distributions and session duration histograms, and sample your synthetic cohort from a mixture. See [Chapter 11](chapters/11-synthetic-data-and-ai-testing/index.md).

### Why does my xAPI client library expose credentials in the browser?

Because the client library is constructing the `Authorization` header in JavaScript that runs in the browser, where any user can open DevTools and read it. The fix is one of three patterns: (1) put the AP behind a thin server-side proxy that injects credentials, (2) issue per-session short-lived tokens minted by a server, or (3) use an LRS that accepts unauthenticated POSTs from a known origin and do origin validation server-side. Never ship long-lived shared credentials inside the textbook bundle. See [Chapter 7](chapters/07-lrs-platforms-and-auth/index.md).

### Why does my conformance test suite fail on a passing-looking implementation?

The conformance suite is exhaustive in places that hand-testing rarely covers: PUT vs POST semantics for new statements, cursor stability across `more` IRLs, exact behavior on duplicate UUIDs, voiding semantics, the precise contents of an `agents` aggregation. Pass a cursory hand-test, and you have probably nailed the happy path; pass the conformance suite, and you have nailed the edge cases too. Read the failure messages carefully — they are usually precise about which sub-clause was violated. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

### Why are my context activities not showing up in queries?

The xAPI query API filters by *primary* activity (the statement's `object`), not by context activities, unless the query uses `related_activities=true`. With that flag, the LRS expands the search to also match activities in `context.contextActivities.parent`, `grouping`, `category`, and `other`. Without it, a statement whose `object` is a quiz but whose `parent` is the chapter will not match a query for the chapter. See [Chapter 6](chapters/06-lrs-architecture/index.md).

### How do I avoid breaking analytics when I change activity content?

Use the `revision` field. The activity IRI stays stable across content changes (so all historical analytics still resolve to the same activity), and `revision` records which version of the content the learner saw. Bump `revision` whenever the content meaningfully changes — typically on a date string or semver. Dashboards that need to compare cohorts before and after a content update can filter on `revision`. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### What do I do when the LRS rejects a statement my client thinks is valid?

Capture the raw POST body and the LRS's full error response, then run the body through a separate validator. The most common gap is a difference between *spec-correct* and *LRS-tolerant*. Some LRSs reject statements with extra unknown top-level fields, even though the spec is silent; others enforce stricter language tag formats. Read the LRS's documentation for known strictness, and when in doubt, prefer the more conservative interpretation of the spec. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

## Best Practice Questions

### When should I use ADL canonical verbs versus a custom verb?

**Use canonical verbs by default.** The ADL set covers roughly 80% of intelligent textbook events, and using them means your data interoperates immediately with every off-the-shelf xAPI tool. Mint a custom verb only when no canonical verb fits *and* the distinction matters for analytics. Document every custom verb in your project's vocabulary profile. Most teams reach for a custom verb on day three and regret it on day three hundred. See [Chapter 4](chapters/04-verb-vocabulary-design/index.md).

### How should I structure my activity IRIs?

Use a stable, dereferenceable, namespace-controlled URL pattern. A good pattern is `https://textbook.example.org/<book>/<chapter>/<activity>` — the base is yours, the path is human-readable, and the URL would resolve to a meaningful page if dereferenced. Avoid IRIs that contain learner IDs, session IDs, build hashes, or timestamps. Activity IRIs are durable identifiers, not URLs to particular page renders. See [Chapter 5](chapters/05-activities-agents-identity/index.md).

### What is the right batching window for xAPI?

A common starting point is **5 seconds OR 20 statements, whichever comes first**. The 5-second cap bounds latency for downstream consumers; the 20-statement cap bounds payload size on bursty interactions. Tune both per deployment. A simulation-heavy chapter may want a longer time window and larger batch; a quiz-only chapter may not need batching at all. Always measure before tuning. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### Should I emit xAPI from the client or from the server?

**Both, for different reasons.** Client-side emission captures the full granularity of learner interaction and works without a server-side game loop, but exposes credentials and is vulnerable to forged statements. Server-side emission is more trustworthy (the AP is the server, not the browser) and easier to audit, but loses fine-grained interaction signal. Most production deployments do client-side emission for routine interactions, server-side emission for anything that affects a gradebook. See [Chapter 8](chapters/08-implementing-in-textbooks/index.md).

### Which IFI should I use for K-12 deployments?

Use the **`account` IFI with a per-deployment pseudonym** — for example, `{"account": {"homePage": "https://district.example.edu", "name": "stu-uuid-8f3a"}}`. This keeps real names and emails out of the LRS while preserving analytics linkability across statements. The pseudonym-to-identity mapping lives in a separate access-controlled system that only authorized personnel can query. This pattern satisfies FERPA, COPPA, and most district data policies. See [Chapter 5](chapters/05-activities-agents-identity/index.md) and [Chapter 14](chapters/14-privacy-and-compliance/index.md).

### How do I build a vocabulary profile that survives team growth?

Three rules. (1) **Name an owner.** Every profile needs a single human accountable for additions. (2) **Document every verb, activity type, and extension** with IRI, definition, intended use, and a worked example. (3) **Run a periodic profile review** — typically quarterly — that compares emitted statements against the profile and flags drift. Profiles that aren't enforced rot. See [Chapter 13](chapters/13-pipeline-and-production/index.md).

### When should I use a sub-statement?

Use a sub-statement when the meaningful learning event is *one agent observing another agent doing something*. A teacher reviews a student's submission; a peer rates a peer's response; a tutor signs off on a recorded attempt. The outer statement records the observation, the sub-statement records the observed event. Sub-statements are powerful and frequently overused — most teams will go their entire xAPI career without needing one. See [Chapter 3](chapters/03-advanced-statement-structure/index.md).

### What is the right hosting model for a small textbook deployment?

For a single textbook with under 10,000 learners and a small operational team, a **hosted SaaS LRS** is usually the right choice. The cost is predictable, there are no servers to run, and the vendor handles backups, scaling, and uptime. Self-hosting (TRAX, Learning Locker, Ralph) makes sense when data sovereignty requires it or when scale and cost cross over the SaaS pricing model. Embedded LRSs are niche — kiosks, offline simulators, military training. See [Chapter 7](chapters/07-lrs-platforms-and-auth/index.md).

### How do I budget bandwidth for a 30-student classroom?

Multiply per-statement payload by per-session frequency by class size. A worked example: 1200 bytes per statement × 45 statements per 20-minute session × 30 learners ≈ 1.6 MB per chapter session, or roughly 1.5 KB/s aggregate. Then layer in batching (cuts wire cost roughly in half), payload minimization (15–25%), and offline queues (smooths bursts). Most deployments come in well under 100 KB per learner per hour with these optimizations. See [Chapter 9](chapters/09-bandwidth-and-offline/index.md).

### How do I keep my LRS free of personally identifiable information?

Layer five practices. (1) Use `account` IFIs with pseudonyms, never raw emails or names. (2) Audit `result.response` — free-form learner text frequently leaks names. (3) Audit context extensions — the easiest place for unintentional PII to creep in. (4) Set retention policies that age out raw statements after a defined window (typically one academic year). (5) Run a periodic PII surface scan on a random sample of statements. The PII surface in xAPI is the union of every place a free-form string can land. See [Chapter 14](chapters/14-privacy-and-compliance/index.md).

### How do I monitor xAPI traffic in development?

Open the **browser DevTools Network panel**, filter for `/statements`, and watch. It is the cheapest and most underused observability tool in xAPI development. Every modern browser ships with it, no installation, and it shows every POST with method, URL, status code, payload size, response time, and a timing waterfall. For network-layer inspection — TLS contents, retries, header behavior — add **Charles Proxy** or **mitmproxy**. See [Chapter 10](chapters/10-monitoring-and-observability/index.md).

### How do I validate my xAPI data is statistically realistic?

Compare three distributions between your synthetic dataset and a known-good reference (a real production sample, or a published cohort study). (1) **Verb frequency distribution** — what fraction of statements are `attempted` vs `passed` vs `experienced`? (2) **Session duration histogram** — how long do sessions actually run? (3) **Per-learner statement count distribution** — heavy-tailed, with a small number of learners producing most events. If all three match within 5–10%, the dataset is realistic enough to test against. See [Chapter 11](chapters/11-synthetic-data-and-ai-testing/index.md).

## Advanced Topic Questions

### How should I architect a multi-tenant LRS deployment?

A multi-tenant LRS isolates statements from different organizations (schools, districts, employers) while sharing infrastructure. The two common patterns are **logical tenancy** (one database, every row carries a tenant ID, queries are tenant-scoped at the API layer) and **physical tenancy** (one database per tenant, fully isolated storage). Logical is cheaper and easier to operate; physical is simpler to reason about for compliance and easier to migrate per-tenant. Pick logical for most cases; pick physical when individual tenants have data-residency requirements. See [Chapter 7](chapters/07-lrs-platforms-and-auth/index.md).

### How do I design a custom xAPI vocabulary profile from scratch?

Five steps. (1) **Inventory the events** the textbook actually emits — a list of "the learner did X" sentences. (2) **Map each event to a canonical verb and activity type first**, only minting custom IRIs for events with no canonical fit. (3) **Define a single owned namespace** under a domain you control: `https://textbook.example.org/xapi/`. (4) **Document every verb, activity type, extension, and statement pattern** with IRI, definition, and an example. (5) **Publish the profile** — ideally on a profile server that downstream consumers can dereference. See [Chapter 13](chapters/13-pipeline-and-production/index.md).

### How do I architect cross-platform analytics across multiple textbooks?

Cross-platform analytics — pulling together data from many textbooks under one report — depends on **profile discipline**. Every textbook in the program emits statements that conform to a *shared* vocabulary profile (or to disjoint profiles whose verbs share canonical roots). Activity IRIs use a shared structure that lets dashboards cluster equivalent activities across books. The LRS layer is either shared or federated through a query proxy. The analytics layer treats statements from different sources as a single uniform stream. See [Chapter 13](chapters/13-pipeline-and-production/index.md).

### What is the right approach to GDPR right-to-erasure for an immutable LRS?

Immutability and right-to-erasure look like a contradiction; they are not. Three patterns reconcile them. (1) **Pseudonymization-only storage** — the LRS never holds the real identity, only an opaque pseudonym; deletion happens by destroying the pseudonym-to-identity mapping in a separate system. (2) **Tombstoning** — the statement is replaced with a metadata-only record that preserves the count but erases the content. (3) **Per-tenant deletion windows** — a scheduled job that removes statements older than a defined retention period. Most production deployments use (1) plus (3). See [Chapter 14](chapters/14-privacy-and-compliance/index.md).

### How do I design xAPI emission for adaptive branching?

Adaptive branching produces *two* meaningful events per branch decision: the **trigger** (the learner's performance that caused the branch) and the **branch taken** (the path the system selected). Emit both. The trigger statement is a normal `result`-bearing statement — the failed quiz, the timed-out simulation. The branch statement uses the verb `progressed` with a context extension recording the rule fired and the path chosen. Together, the pair lets analytics ask "did this branching rule actually help learners?" — which is the only question that matters about adaptive logic. See [Chapter 8](chapters/08-implementing-in-textbooks/index.md).

### How do I migrate from xAPI 1.0.3 to xAPI 2.0 (IEEE)?

In 2026, most production LRSs and APs are still on 1.0.3, with 2.0 adoption growing slowly. The pragmatic path is: keep emitting 1.0.3 statements (they remain valid in 2.0-aware LRSs), monitor the IEEE WG3.4 work, and wait until both your LRS vendor and your dashboard tooling claim 2.0 support. The differences are mostly clarifications and a few new optional fields, not breaking changes. Don't be the first to migrate; don't be the last. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

### How do I evaluate vendor lock-in risk for an LRS choice?

Score the candidate on five axes. (1) **Conformance** — does it pass the ADL test suite? (2) **Export** — can you bulk-export every statement as standard JSON? (3) **Query API breadth** — does it support all five canonical endpoints with full filter support? (4) **Custom extensions** — does the vendor pressure you to use proprietary fields that won't survive migration? (5) **Cost trajectory** — does the per-statement price scale linearly, or punitively? An LRS that scores well on all five is migrate-able. One that fails (2) or (5) is a trap. See [Chapter 12](chapters/12-conformance-and-comparison/index.md).

### How do I design a production-readiness checklist for an xAPI deployment?

The minimum viable checklist has eight items. (1) **Conformance suite passes** end-to-end. (2) **HTTPS-only** for every emit and query path. (3) **Credentials in a secret manager**, not in the bundle. (4) **Offline queue** with verified flush behavior. (5) **Monitoring dashboard** with statement throughput, error rate, and queue depth. (6) **Vocabulary profile** documented and version-pinned. (7) **Retention policy** in place and tested. (8) **PII surface scan** on a random sample. Anything below this bar is not production-ready, regardless of how well it demos. See [Chapter 13](chapters/13-pipeline-and-production/index.md).
