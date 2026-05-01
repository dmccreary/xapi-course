# Quiz: Implementing xAPI in Intelligent Textbooks

Test your understanding of the JavaScript/TypeScript client library, retry logic, error handling, and instrumentation patterns with these review questions.

---

#### 1. Which three properties define a Level 3 intelligent textbook in this book's framing?

<div class="upper-alpha" markdown>
1. PDF format, hyperlinks, and bookmarks
2. Web rendering, genuine interactivity, and structured behavioral instrumentation
3. Animations, audio narration, and quiz banks
4. Adaptive sequencing, video lectures, and proctoring
</div>

??? question "Show Answer"
    The correct answer is **B**. A Level 3 intelligent textbook renders as web content (HTML/CSS/JavaScript), contains genuinely interactive elements that respond to learner input (MicroSims, quizzes, adaptive branching), and captures behavioral signals from those interactions through structured instrumentation. xAPI is the standard instrumentation layer for Level 3. Levels 1 and 2 are static and non-instrumented respectively. The other options describe surface features but miss the instrumentation requirement.

    **Concept Tested:** Level 3 Intelligent Textbook

---

#### 2. According to the chapter, an xAPI client library has four responsibilities. Which of the following is NOT one of them?

<div class="upper-alpha" markdown>
1. Statement construction
2. Authentication
3. Rendering interactive UI components
4. Batching and delivery
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter lists four client library responsibilities: statement construction, authentication, batching and delivery, and error handling. UI rendering is the responsibility of the components that call into the library — MicroSims, quizzes, adaptive branching widgets — not the client library itself. The library's design rule is "every emit site says what happened, the library handles how to send it."

    **Concept Tested:** xAPI Client Library Design

---

#### 3. A 5xx error is returned from the LRS for a batch POST. What is the correct client behavior?

<div class="upper-alpha" markdown>
1. Drop the batch and surface a permanent error
2. Retry with exponential backoff and jitter
3. Re-authenticate and re-issue immediately
4. Ignore and proceed to the next batch
</div>

??? question "Show Answer"
    The correct answer is **B**. 5xx errors indicate the LRS had a transient problem (overload, bad gateway, deploy in progress). The same payload may succeed seconds from now, so the right behavior is retry with exponential backoff plus random jitter. The jitter prevents thundering-herd retries after a global outage. 4xx errors should not be retried (option A is what you do for 4xx). Re-authentication isn't typically needed for 5xx (option C). Ignoring loses data (option D).

    **Concept Tested:** Retry-With-Backoff Pattern / 5xx Error Patterns

---

#### 4. Why should a `passed`/`failed` statement that ties to a learner's official grade be emitted server-side rather than client-side?

<div class="upper-alpha" markdown>
1. Server-side emission has lower latency
2. The browser would not be able to construct a valid Statement object
3. Statement authenticity — the browser cannot forge a server-side credential
4. xAPI 1.0.3 forbids client-side emission
</div>

??? question "Show Answer"
    The correct answer is **C**. Statement authenticity is the deciding factor. Anyone with developer tools can construct and send statements from the browser as if they were the learner; client-side emission is fine for analytics but should not be the source of truth for grades or certifications. Server-side emission uses a backend credential the browser doesn't have, so the browser cannot forge it. Server-side emission has higher (not lower) latency. Client-side emission is permitted by the spec.

    **Concept Tested:** Server-Side xAPI Emission / Statement Authenticity

---

#### 5. Which HTTP status code should NOT trigger a retry in a robust client library?

<div class="upper-alpha" markdown>
1. 503 Service Unavailable
2. 502 Bad Gateway
3. 504 Gateway Timeout
4. 401 Unauthorized
</div>

??? question "Show Answer"
    The correct answer is **D**. 4xx errors (including 401 Unauthorized) indicate a client problem — bad credentials, malformed payload, duplicate UUID, failed precondition. Retrying with the same payload will fail the same way. Retrying 4xx in a tight loop is the most common way to accidentally DDOS your own LRS. The 5xx codes (503, 502, 504) all indicate transient server problems and should be retried with backoff.

    **Concept Tested:** 4xx Error Patterns

---

#### 6. The chapter's retry-with-backoff implementation includes random jitter (`Math.random() * 1000`). What problem does the jitter solve?

<div class="upper-alpha" markdown>
1. It prevents many clients from retrying in lockstep after a global outage (thundering herd)
2. It compensates for clock skew between client and server
3. It satisfies an xAPI specification requirement
4. It improves SHA-2 hash entropy for attachment verification
</div>

??? question "Show Answer"
    The correct answer is **A**. The random jitter prevents the thundering-herd problem — without jitter, all clients that backed off the same amount will retry simultaneously when the LRS recovers, immediately re-overloading it. With jitter, retries spread across a window. The xAPI spec doesn't mandate jitter. Clock skew is unrelated. Hash entropy is unrelated to retry timing.

    **Concept Tested:** Retry-With-Backoff Pattern

---

#### 7. A textbook supports both modern browsers and IE11. What is the chapter's recommended polyfill strategy?

<div class="upper-alpha" markdown>
1. Always ship the full polyfill bundle to every browser for safety
2. Detect older browsers at runtime and dynamically import polyfills only when needed
3. Refuse to serve the textbook to older browsers
4. Manually rewrite Fetch calls as XMLHttpRequest
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter recommends conditional dynamic imports: `if (!("fetch" in window)) { await import("whatwg-fetch"); }`. These imports cost nothing in modern browsers (the condition is false) and rescue older ones. Always shipping polyfills bloats the bundle for every learner. Refusing service is a poor accessibility outcome. Manual XHR rewrites bypass the value of having a clean Fetch-based library.

    **Concept Tested:** Polyfill Strategy / Browser Compatibility

---

#### 8. A quiz instrumentation pattern emits four statements per attempt. Which sequence is correct, and what ties them together?

<div class="upper-alpha" markdown>
1. attempted, scored, passed/failed, completed — tied by a shared registration UUID
2. completed, attempted, scored, passed/failed — tied by the activity IRI
3. interacted, scored, completed, terminated — tied by the platform name
4. attempted, completed, passed/failed, scored — tied by the timestamp range
</div>

??? question "Show Answer"
    The correct answer is **A**. The canonical quiz sequence is `attempted` (start), `scored` (a score is recorded), then `passed` or `failed` (success outcome), then `completed`. All four share a single `registration` UUID minted at quiz start, which is the analytics-friendly correlation key. The other sequences either reorder these incorrectly or use the wrong tie-key (the activity IRI, platform name, or timestamps are not designed for per-attempt correlation).

    **Concept Tested:** Quiz Instrumentation

---

#### 9. The xAPI client library exposes two public methods: `send` and `flush`. What is `flush` for?

<div class="upper-alpha" markdown>
1. Forcing buffered statements to be sent immediately, typically at page-unload
2. Removing all statements from the LRS that match a query
3. Flushing browser cache to prevent stale credentials
4. Triggering a full re-authentication handshake
</div>

??? question "Show Answer"
    The correct answer is **A**. `flush` forces any buffered statements to be sent immediately, used at page-unload time so in-flight events aren't lost when the learner closes the tab. `send` queues a statement for delivery. The library buffers and batches by default for efficiency. The other options misdescribe `flush` — it does not affect the LRS's stored data, browser cache, or authentication state.

    **Concept Tested:** JavaScript xAPI Client Library

---

#### 10. A team is investigating production health by querying LRS server logs. A sudden spike in 401 status codes most likely indicates what?

<div class="upper-alpha" markdown>
1. A recent code change broke statement construction
2. The LRS itself is unhealthy
3. A client credential expired or was revoked
4. The xAPI version header is missing
</div>

??? question "Show Answer"
    The correct answer is **C**. 401 Unauthorized means the credential was rejected — typically because a token expired, was revoked, or never made it to the request. A spike in 400 (bad request) would suggest a code change broke statement construction. A spike in 5xx would indicate LRS health issues. Missing version headers usually produce 400, not 401. The chapter's log-analysis playbook explicitly maps each status-code pattern to its likely cause.

    **Concept Tested:** LRS Server Log Analysis

---
