# Quiz: xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness

Test your understanding of vocabulary profile design, the full xAPI pipeline, security best practices, and the production readiness review with these review questions.

---

#### 1. According to the chapter, a complete vocabulary profile must include verbs, activity types, extensions, examples, and what other component?

<div class="upper-alpha" markdown>
1. Statement patterns documenting approved combinations
2. A list of allowed LRS vendors
3. The dashboard query templates
4. The browser compatibility matrix
</div>

??? question "Show Answer"
    The correct answer is **A**. The chapter notes that a profile documenting only verbs, activity types, and extensions is incomplete because emit sites can still produce inconsistent statements. Statement patterns — the approved combinations of verb, activity type, and required result/context fields — are what turn the vocabulary into actionable consistency. The other options describe artifacts that may exist alongside a profile but are not part of the profile itself.

    **Concept Tested:** xAPI Vocabulary Profile Design

---

#### 2. The chapter recommends versioning extension namespaces from day one. What is the canonical pattern?

<div class="upper-alpha" markdown>
1. `https://textbook.example.org/<extension-name>`
2. `urn:extension:<extension-name>`
3. `https://textbook.example.org/extensions/v1/<extension-name>`
4. `<extension-name>@v1`
</div>

??? question "Show Answer"
    The correct answer is **C**. The pattern that has aged best is `https://textbook.example.org/extensions/v1/<extension-name>`. The `v1` segment is non-negotiable because the day a schema needs to change incompatibly, you'll create `v2` and run both for a transition period. Without versioning, there is no migration path. The unversioned URL (option A), URN (option B), and Maven-style suffix (option D) are not the chapter's recommendation.

    **Concept Tested:** Extension Namespace Design

---

#### 3. The full xAPI pipeline has four logical layers. Which sequence reflects the data flow correctly?

<div class="upper-alpha" markdown>
1. Activity Provider → LRS → Analytics Layer → Dashboard Layer
2. Dashboard → Analytics Layer → LRS → Activity Provider
3. LRS → Activity Provider → Dashboard → Analytics
4. Analytics → LRS → Dashboard → Activity Provider
</div>

??? question "Show Answer"
    The correct answer is **A**. The pipeline flows from Activity Provider integration (the textbook's instrumentation), through the LRS (storage and query), to the analytics layer (post-processing into queryable aggregates), and finally to the dashboard layer (visualization). The other orderings reverse or scramble the flow. Data is born at emit and consumed at the dashboard.

    **Concept Tested:** xAPI Pipeline Architecture

---

#### 4. A team's stream processor falls behind the LRS write rate, so dashboard aggregates are stale. Which pipeline failure point does this describe?

<div class="upper-alpha" markdown>
1. Browser → LRS network failure
2. LRS authentication failure
3. Stream processor lag
4. Dashboard query timeout
</div>

??? question "Show Answer"
    The correct answer is **C**. Stream processor lag is the named failure point where the consumer falls behind the LRS write rate, aggregates become stale, and dashboards show old numbers. Recovery is by scaling the consumer or shedding load. Network failures (option A) prevent emit, not aggregation. Auth failures (option B) surface as 401. Query timeouts (option D) describe the dashboard's inability to run a query, not the aggregator falling behind.

    **Concept Tested:** Pipeline Failure Points

---

#### 5. Cross-platform analytics — rolling up data across multiple textbooks — requires which set of conditions?

<div class="upper-alpha" markdown>
1. A shared LRS vendor across all participating textbooks
2. Identical user-interface frameworks across all textbooks
3. Shared verb vocabulary, shared activity-type vocabulary, shared learner identity, and shared extension namespace conventions
4. A single shared dashboard team owning all the textbooks
</div>

??? question "Show Answer"
    The correct answer is **C**. The four conditions for cross-platform analytics are: shared verbs (same verbs for same kinds of events), shared activity types, shared learner identity (same `account.name` and `homePage`), and shared extension conventions. None of these require a single LRS vendor (option A wrong), identical UI (option B wrong), or shared dashboard ownership (option D wrong). Profile discipline is the substrate.

    **Concept Tested:** Cross-Platform Analytics

---

#### 6. A team's profile validator finds that a statement uses verb `https://textbook.example.org/verbs/scrolled`, which is not in the project profile. What is the correct response?

<div class="upper-alpha" markdown>
1. Accept the statement; xAPI conformance is what matters, not profile conformance
2. Treat the statement as a profile-non-conformance bug; fail the build and block merge
3. Add the verb to the profile silently in CI
4. Convert the verb to `interacted` automatically before storage
</div>

??? question "Show Answer"
    The correct answer is **B**. Profile validation is a layer above raw xAPI conformance. A statement can be xAPI-conformant but profile-non-conformant. The chapter recommends running profile validation in CI on representative samples and treating failures as bugs that block merge. Silent profile mutations (option C) defeat the contract. Auto-converting verbs (option D) corrupts the data. Accepting (option A) negates the value of the profile.

    **Concept Tested:** Profile Validation

---

#### 7. Which security practice does the chapter describe as "non-negotiable, including in development and staging"?

<div class="upper-alpha" markdown>
1. Daily credential rotation
2. HTTPS for every xAPI endpoint
3. Mutual TLS with client certificates
4. WebAuthn for learner authentication
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter is unambiguous: HTTPS for xAPI is non-negotiable, including in development and staging. Plain HTTP for xAPI is an interception risk that's not worth taking. Daily rotation (option A) is good practice but not the universal non-negotiable. Mutual TLS (option C) is a more advanced posture, not the baseline. WebAuthn (option D) is a learner-side authentication method, not an xAPI transport requirement.

    **Concept Tested:** HTTPS for xAPI / xAPI Security Best Practices

---

#### 8. The production readiness review covers four areas. A deployment passes vocabulary, pipeline, and security but lacks observability. According to the chapter, is the deployment production-ready?

<div class="upper-alpha" markdown>
1. Yes, since three of four areas pass
2. Yes, observability can be added post-launch
3. No, the four areas are interdependent and any single failure blocks readiness
4. Only if the missing area is documented as out-of-scope
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter is explicit: a deployment that fails any one of the four areas isn't production-ready, even if the other three are perfect. The areas are interdependent — an observability gap means you can't catch a vocabulary drift; a security gap means a vocabulary leak becomes a privacy leak. Three-of-four (option A), post-launch addition (option B), and "out-of-scope" labeling (option D) all violate the readiness gate.

    **Concept Tested:** Production Readiness Checklist / xAPI Implementation Review

---

#### 9. As a deployment scales, the chapter describes a typical analytics-layer evolution. What is the most likely first migration?

<div class="upper-alpha" markdown>
1. Replace the LRS with a custom database
2. Add a stream processor that pre-aggregates statements into a fast OLAP store
3. Move all queries from the dashboard to the Activity Provider
4. Eliminate the dashboard layer entirely
</div>

??? question "Show Answer"
    The correct answer is **B**. Initially, dashboards query the LRS directly — fast enough at small scale. As volume grows, direct LRS queries get slow because LRSs are optimized for ingestion, not OLAP. The team adds a stream processor (Kafka, Kinesis) that pre-computes aggregates and writes them to a fast analytical store (ClickHouse, BigQuery, Snowflake). Replacing the LRS (option A), moving queries client-side (option C), and eliminating dashboards (option D) are not standard scaling patterns.

    **Concept Tested:** Analytics Layer / Pipeline Architecture

---

#### 10. A pipeline latency budget targets 60 seconds end-to-end. The breakdown is 1s emit, 5s LRS-to-stream, 30s stream-to-aggregate, 5s dashboard query. Total observed latency is 90 seconds, with stream-to-aggregate measured at 55 seconds. Which layer is the offender?

<div class="upper-alpha" markdown>
1. The Activity Provider — emit is too slow
2. The LRS — ingestion is over budget
3. The dashboard — query is too expensive
4. The stream-to-aggregate layer — measured at 55s vs 30s budget
</div>

??? question "Show Answer"
    The correct answer is **D**. Pipeline latency analysis decomposes the total budget across layers. With stream-to-aggregate measured at 55s against a 30s budget, that layer is 25 seconds over budget — the rest of the layers are within their allocations. The breakdown points to the offender. The other layers' budgets (emit 1s, LRS 5s, dashboard 5s) are within allowance.

    **Concept Tested:** Pipeline Latency Analysis

---
