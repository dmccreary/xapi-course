# Quiz: Learning Record Store Architecture and Query Endpoints

Test your understanding of LRS storage models, the five canonical endpoints, query filters, pagination, and concurrency with these review questions.

---

#### 1. How many canonical HTTP endpoints does the xAPI 1.0.3 specification define under the `/xAPI/` base path?

<div class="upper-alpha" markdown>
1. Three
2. Four
3. Five
4. Seven
</div>

??? question "Show Answer"
    The correct answer is **C**. The xAPI 1.0.3 specification defines exactly five HTTP endpoints: `/xAPI/statements`, `/xAPI/agents`, `/xAPI/activities`, `/xAPI/state`, and `/xAPI/about`. Most traffic targets `/statements`. The other four serve narrower purposes — agent profile aggregation, activity definition lookup, resumable state, and capability advertisement. Knowing all five exists matters even if `/statements` dominates day-to-day code.

    **Concept Tested:** LRS Architecture / Endpoints

---

#### 2. According to the chapter, which storage model should new LRS deployments choose?

<div class="upper-alpha" markdown>
1. Mutable, because it allows easier corrections
2. Immutable, because the audit trail stays intact and voiding remains meaningful
3. Hybrid, where statements older than 30 days become immutable
4. Mutable for state and immutable for statements
</div>

??? question "Show Answer"
    The correct answer is **B**. New deployments should always choose immutability. An immutable LRS treats every stored statement as permanent; the only way to retract is to void by emitting a new statement that references the original. This preserves the audit trail and is the model the xAPI spec implicitly assumes. Mutability undermines auditability and makes voiding semantics ambiguous (why void if you can edit?).

    **Concept Tested:** Mutable vs Immutable LRS

---

#### 3. Which HTTP header is required on every xAPI request and is "surprisingly hard to debug" if forgotten?

<div class="upper-alpha" markdown>
1. Content-Length
2. Authorization
3. X-Experience-API-Version
4. Accept-Encoding
</div>

??? question "Show Answer"
    The correct answer is **C**. The `X-Experience-API-Version` header is required on every request and is used by the LRS to decide which version of the spec to apply. Forgetting it produces a 400 response that's hard to debug if you don't know to look for it. `Authorization` is also required for non-anonymous LRSs, but the version header is the xAPI-specific gotcha. `Content-Length` and `Accept-Encoding` are general HTTP headers, not xAPI-specific requirements.

    **Concept Tested:** LRS Endpoint Configuration

---

#### 4. The LRS responds to a paginated GET with a `more` field containing a relative URL. How should the client handle this URL?

<div class="upper-alpha" markdown>
1. Issue a GET against the URL as an opaque string until `more` returns empty
2. Parse the URL to extract page numbers and synthesize the next request
3. Decode the offsetToken to determine when results are exhausted
4. Re-issue the original query with an incremented offset parameter
</div>

??? question "Show Answer"
    The correct answer is **A**. The pagination model is opaque-token, not page-number. Clients should treat the `more` URL as an opaque string and just GET it as-is until the field comes back empty. The LRS controls the encoding of pagination state — typically a cursor or stored-timestamp boundary — and may change the encoding between releases. Code that parses or synthesizes the URL is fragile and will break.

    **Concept Tested:** More IRL Pagination

---

#### 5. A team needs to query "every passed-quiz statement for one specific learner in the last 24 hours." Which combination of filters is correct?

<div class="upper-alpha" markdown>
1. `actor`, `verb`, and `timestamp`
2. `agent`, `verb`, and `since`
3. `learner`, `action`, and `from`
4. `account`, `verb`, and `since`
</div>

??? question "Show Answer"
    The correct answer is **B**. The standard query filters are `agent` (filter by actor identity, takes a JSON-encoded agent object), `verb` (verb IRI), and `since` (filter to a stored-timestamp range). There is no `actor` query parameter despite the field being named that in the statement. There is no `learner`, `action`, or `from` filter. `account` is a sub-field of an agent, not a top-level filter.

    **Concept Tested:** Statement Query Filters

---

#### 6. Two browser tabs from the same learner both PUT to the same `/state` document at nearly the same time. The LRS uses ETags with `If-Match`. What happens to the second writer?

<div class="upper-alpha" markdown>
1. The second PUT silently overwrites the first
2. The LRS merges the two documents automatically
3. The LRS queues the second PUT until the first commits
4. The second PUT receives `412 Precondition Failed` and must re-fetch and retry
</div>

??? question "Show Answer"
    The correct answer is **D**. The state endpoint uses optimistic concurrency. The first writer's PUT with `If-Match: <previous-ETag>` succeeds and produces a new ETag. The second writer's PUT with the now-stale ETag receives `412 Precondition Failed` and must GET the latest document, merge changes locally, and PUT again. There is no automatic merge; concurrent writers don't block each other; conflict resolution is the client's responsibility.

    **Concept Tested:** LRS Concurrency / Conflict Resolution

---

#### 7. A POST to `/statements` submits an array of three statements. What is the LRS's behavior if the second statement has a malformed UUID?

<div class="upper-alpha" markdown>
1. The first statement is stored; the second and third are rejected
2. All three statements are stored, with a warning header
3. None of the three statements are stored; the entire batch is rejected
4. The first and third are stored; the second is logged but skipped
</div>

??? question "Show Answer"
    The correct answer is **C**. A POST that submits an array of statements stores them atomically — either all of them go in, or none of them do. If the LRS rejects one statement (because of a malformed UUID, for example), it rejects the whole batch and returns an error. This atomicity is what makes statement batching safe at the LRS layer; partial-failure outcomes are impossible.

    **Concept Tested:** Statements Endpoint / Atomic Batches

---

#### 8. Which endpoint should an Activity Provider query at startup to confirm xAPI version compatibility?

<div class="upper-alpha" markdown>
1. /xAPI/statements
2. /xAPI/about
3. /xAPI/agents
4. /xAPI/activities
</div>

??? question "Show Answer"
    The correct answer is **B**. The `/xAPI/about` endpoint returns a small JSON document describing what the LRS supports, with a `version` field listing supported xAPI versions. Activity Providers should query `/about` once at startup, confirm the LRS supports the version the client wants to send, and warn or fail if not. The `/statements` endpoint is for actual statement traffic. The `/agents` and `/activities` endpoints serve aggregation queries, not capability discovery.

    **Concept Tested:** About Endpoint

---

#### 9. A district plans to deploy an intelligent textbook to 800,000 students for a year. Which scalability dimension is most likely to surprise a team that benchmarked only on a single laptop?

<div class="upper-alpha" markdown>
1. The number of distinct verbs supported
2. The size of the agent IFI string
3. Query latency under simultaneous peak ingestion
4. The HTTP response status codes returned
</div>

??? question "Show Answer"
    The correct answer is **C**. Query latency under peak ingestion is one of the most commonly missed scalability dimensions. Ingestion and queries compete for the same indexes, and a badly-tuned LRS sees query latency spike the moment ingestion does. A laptop demo with one user never exposes this. The other options are not real scalability constraints — verb count is unbounded, IFI strings are short, and HTTP status codes don't change with scale.

    **Concept Tested:** LRS Scalability

---

#### 10. The State endpoint's intended purpose is best summarized as which of the following?

<div class="upper-alpha" markdown>
1. Aggregating learner profiles across the LRS
2. Storing per-learner-per-activity opaque state for resumable progress
3. Returning the canonical activity definition for an IRI
4. Reporting LRS capability and supported xAPI versions
</div>

??? question "Show Answer"
    The correct answer is **B**. The `/xAPI/state` endpoint is read/write storage for per-learner-per-activity state, keyed by `{agent, activity, stateId}`. It's the resumable-progress mechanism — a textbook can persist "Lin scrolled to paragraph 47" and retrieve it next session. The state is opaque to the LRS, which stores whatever JSON the client provides. Option A describes `/agents`. Option C describes `/activities`. Option D describes `/about`.

    **Concept Tested:** State Endpoint

---
