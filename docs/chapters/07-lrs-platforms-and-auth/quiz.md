# Quiz: LRS Platforms, Authentication, and Hosting Models

Test your understanding of the major LRS platforms, hosting models, authentication schemes, and access control patterns with these review questions.

---

#### 1. Which LRS platform is described as Python-based with a ClickHouse backend, purpose-built for very high ingestion rates?

<div class="upper-alpha" markdown>
1. TRAX
2. Learning Locker
3. Ralph
4. Watershed
</div>

??? question "Show Answer"
    The correct answer is **C**. Ralph is a self-hosted open source LRS written in Python (FastAPI), backed by ClickHouse (a columnar OLAP database). It's purpose-built for very high ingestion rates and very large historical volumes, suitable for state- or country-scale education deployments. TRAX is PHP/Laravel with MySQL/PostgreSQL. Learning Locker is Node.js with MongoDB. Watershed is the original hosted SaaS LRS.

    **Concept Tested:** Ralph LRS

---

#### 2. A district must keep all learner data on its own hardware due to local regulations. Which hosting model is required?

<div class="upper-alpha" markdown>
1. Hosted SaaS
2. Self-hosted open source
3. Embedded
4. Hybrid SaaS with on-prem cache
</div>

??? question "Show Answer"
    The correct answer is **B**. A self-hosted open source LRS runs on the customer's own infrastructure, satisfying data sovereignty requirements that forbid third-party hosting. Hosted SaaS sends data to the vendor. Embedded LRSs run on-device — useful for offline scenarios but not the typical answer for a district-wide deployment. The chapter's decision tree explicitly routes "data sovereignty forbids third-party hosting" to self-hosted.

    **Concept Tested:** Self-Hosted Open Source LRS

---

#### 3. What is the chapter's recommendation about putting Basic Auth credentials in browser-shipped JavaScript?

<div class="upper-alpha" markdown>
1. It is acceptable as long as the URL uses HTTPS
2. It is acceptable for read-only credentials
3. Basic Auth credentials should never appear in browser-shipped JavaScript
4. It is the xAPI spec's recommended browser pattern
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter is unambiguous: Basic Auth credentials should never appear in browser-shipped JavaScript. The right pattern is a backend proxy where the textbook's frontend POSTs to your backend, and the backend authenticates against the LRS using stored credentials. Basic Auth is fine for backend-to-backend calls only. HTTPS protects in transit but not credentials embedded in shipped code that anyone can view-source.

    **Concept Tested:** Basic Auth (xAPI)

---

#### 4. Most production browser-emitting deployments use which authentication scheme, despite it not being formally part of xAPI 1.0.3?

<div class="upper-alpha" markdown>
1. Token-based authentication (Bearer tokens)
2. Mutual TLS with client certificates
3. Cookie-based session authentication
4. API key authentication via query string
</div>

??? question "Show Answer"
    The correct answer is **A**. Token-based authentication is what most production deployments actually use. The LRS issues an opaque bearer token that the client sends in `Authorization: Bearer <token>`. Tokens can be scoped, rotated, and revoked centrally and can be issued per-session at page load by the backend. This is not part of xAPI 1.0.3 spec but every major LRS supports it as an extension. The other options are not standard xAPI auth patterns.

    **Concept Tested:** Token-Based Authentication

---

#### 5. Watershed is described in the chapter as which type of LRS?

<div class="upper-alpha" markdown>
1. Self-hosted open source PHP-based LRS
2. The original hosted SaaS LRS, with the deepest dashboard tooling
3. An embedded LRS for offline simulators
4. A multi-tenant Python framework
</div>

??? question "Show Answer"
    The correct answer is **B**. Watershed is the original hosted SaaS LRS, operated by Watershed (the company, formerly tied to Saba). It's commercial, mature, and has the deepest dashboard tooling of any LRS in the market. The trade-off is vendor lock-in and per-statement pricing above generous thresholds. TRAX is the PHP/Laravel option. Embedded LRSs are for offline contexts. Watershed is hosted SaaS, not Python.

    **Concept Tested:** Watershed LRS

---

#### 6. According to the chapter, why should a team consider multi-tenancy at design time rather than as an afterthought?

<div class="upper-alpha" markdown>
1. The xAPI specification mandates multi-tenancy
2. Multi-tenancy is the only way to achieve scale beyond 1000 statements/sec
3. Single-tenant LRSs cannot legally accept POSTs from external Activity Providers
4. Most real-world deployments are multi-tenant whether teams realized it or not
</div>

??? question "Show Answer"
    The correct answer is **D**. The chapter notes that most real-world deployments are multi-tenant whether the team initially realized it or not — district-wide LRSs, vendor-hosted LRSs, and consortium LRSs are all multi-tenant by construction. Skipping multi-tenancy at design time often forces re-architecture in year two. The xAPI spec doesn't mandate multi-tenancy (option A); scale doesn't require it (option B); and external POSTs are perfectly legal in single-tenant LRSs (option C).

    **Concept Tested:** Multi-Tenant LRS

---

#### 7. A textbook embeds the LRS endpoint URL and a long-lived bearer token directly in its JavaScript bundle. Which configuration mistake does this represent?

<div class="upper-alpha" markdown>
1. The xAPI version header is missing
2. Credentials are hardcoded into source rather than pulled from environment configuration
3. The bearer token format is not spec-compliant
4. The endpoint URL must include the port number explicitly
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter calls out hardcoding LRS URLs and credentials into the textbook's JavaScript bundle as the most common avoidable mistake — and the most common reason LRS credentials end up in public Git history. Configuration belongs in environment variables or a runtime configuration service, never in source code. Browser-shipped tokens should be short-lived, issued per-session by the backend, never long-lived secrets.

    **Concept Tested:** Activity Provider Configuration

---

#### 8. The chapter's default recommendation for setting the `authority` field on outgoing statements is what?

<div class="upper-alpha" markdown>
1. The AP should always include an explicit authority object in every statement
2. The AP should set authority to the learner's actor IFI
3. The AP should usually let the LRS attach authority based on credentials
4. The AP should rotate authority per statement to prevent forgery
</div>

??? question "Show Answer"
    The correct answer is **C**. The default rule is: don't set `authority` explicitly; let the LRS attach it based on the credentials used to authenticate. This ties every statement to the credential that posted it — exactly the audit trail you want. Setting authority client-side means the textbook code is claiming to be the one vouching, which is almost never correct. Setting authority to the learner's IFI (option B) confuses actor with vouching authority. Per-statement rotation (option D) is meaningless.

    **Concept Tested:** Statement Authority Configuration

---

#### 9. A small school district needs a self-hosted LRS with basic LAMP-stack ops capacity and peak ingestion in the hundreds-per-second range. Which platform is the best fit?

<div class="upper-alpha" markdown>
1. TRAX
2. Ralph
3. Watershed
4. An embedded LRS on each device
</div>

??? question "Show Answer"
    The correct answer is **A**. TRAX is the PHP/Laravel LRS that fits in a single Docker container — easy to install, low operational cost, and well-suited to schools and small districts with basic LAMP ops capacity. Ralph is overkill for hundreds-per-second; it shines at thousands-per-second sustained. Watershed is hosted SaaS, not self-hosted. Embedded LRSs are for offline scenarios, not district-wide deployments.

    **Concept Tested:** LRS Platform Comparison

---

#### 10. The chapter notes that MongoDB-backed and ClickHouse-backed LRSs differ in query strengths. Which workload is ClickHouse particularly good at?

<div class="upper-alpha" markdown>
1. Single-statement lookups by UUID
2. Per-learner profile retrieval
3. Cohort-wide aggregate queries across millions of statements
4. Real-time state document updates
</div>

??? question "Show Answer"
    The correct answer is **C**. ClickHouse is a columnar OLAP database that excels at aggregate queries across millions of statements — cohort-wide analytics, time-series rollups, large GROUP BY operations. MongoDB excels at single-statement lookups and small per-learner queries (options A and B). State document updates are not a database-engine differentiator (option D). The chapter's advice: match the engine to the query shape your dashboard needs most.

    **Concept Tested:** LRS Platform Comparison

---
