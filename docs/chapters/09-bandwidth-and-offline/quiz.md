# Quiz: Bandwidth Optimization, Offline Queues, and Service Workers

Test your understanding of statement batching, payload minimization, offline queues, service workers, and bandwidth budgeting with these review questions.

---

#### 1. According to the chapter, a typical xAPI statement serialized as JSON lands in which size range?

<div class="upper-alpha" markdown>
1. 50 to 200 bytes
2. 700 to 1500 bytes
3. 5,000 to 10,000 bytes
4. 20,000 to 40,000 bytes
</div>

??? question "Show Answer"
    The correct answer is **B**. A typical xAPI statement is 700 to 1500 bytes serialized as JSON, depending on extensions, attachment metadata, and language map size. Add HTTP overhead and the wire cost climbs to 1500 to 3000 bytes per individually-posted statement. The other ranges are off by an order of magnitude — statements are bigger than tweets and smaller than typical web page payloads.

    **Concept Tested:** Per-Statement Payload Size

---

#### 2. Which optimization is described as "the single highest-leverage bandwidth optimization in xAPI"?

<div class="upper-alpha" markdown>
1. HTTP/2 multiplexing
2. Service worker caching
3. Statement batching
4. SHA-2 attachment compression
</div>

??? question "Show Answer"
    The correct answer is **C**. Statement batching exploits the LRS's atomic-batch semantics by buffering multiple statements client-side and POSTing them as a single array. The chapter shows that 45 individually-posted statements cost ~85 KB, while one batch of 45 costs ~55 KB — most of the HTTP overhead vanishes. HTTP/2 multiplexing reduces but does not eliminate the win. Service worker caching is for static assets, not statement transport. SHA-2 hashes don't compress payloads.

    **Concept Tested:** Statement Batching

---

#### 3. Which browser storage mechanism is the right choice for an offline statement queue, and why?

<div class="upper-alpha" markdown>
1. LocalStorage, because it is synchronous and fastest to read
2. IndexedDB, because it is transactional and scales to hundreds of megabytes
3. SessionStorage, because it persists across tabs
4. Cookies, because they are sent with every request
</div>

??? question "Show Answer"
    The correct answer is **B**. IndexedDB is a browser-provided transactional database good for hundreds of megabytes — well-suited to queue persistence across long offline periods. LocalStorage is synchronous, capped at ~5 MB, and slow under load — a bad fit for a statement queue. SessionStorage doesn't persist across tab close (useless for offline-resilient queues). Cookies are sent with every request and would add to the bandwidth problem.

    **Concept Tested:** IndexedDB Storage

---

#### 4. A service worker intercepts xAPI POST requests when the network is unavailable. Which strategy is correct for handling these requests?

<div class="upper-alpha" markdown>
1. Cache-first — return a cached success response
2. Network-first — wait for the network indefinitely
3. Queue-and-flush — write to IndexedDB and re-attempt when connectivity returns
4. Discard the request silently
</div>

??? question "Show Answer"
    The correct answer is **C**. Neither cache-first nor network-first fits xAPI POSTs — they are writes that need to reach the LRS eventually, not reads that can be served from cache. The right pattern is queue-and-flush: the worker queues the statement in IndexedDB and re-attempts delivery when connectivity returns. Returning a cached success would be lying to the client. Waiting indefinitely blocks the UI. Discarding loses data.

    **Concept Tested:** Service Worker / Offline Statement Queue

---

#### 5. A textbook is monolingual (English only) but the auto-generated builder includes five languages in `verb.display`. According to the chapter's selective verbosity guidance, what should the team do?

<div class="upper-alpha" markdown>
1. Keep all five languages for forward compatibility
2. Move the unused languages into a top-level extension
3. Encode the language map as base64 to compress it
4. Trim the language map to only `en-US` to save 200-400 bytes per statement
</div>

??? question "Show Answer"
    The correct answer is **D**. Selective verbosity is the policy of populating optional fields only when they carry actual signal. Trimming four extra languages from `verb.display`, `object.definition.name`, and `object.definition.description` shaves 200-400 bytes off every statement. Forward compatibility (option A) is not a strong argument when the bytes are paid for every statement. Moving them to extensions doesn't reduce the size. Base64 increases size, not decreases it.

    **Concept Tested:** Selective Verbosity / Payload Minimization

---

#### 6. A learner finishes a chapter on a train, closes the laptop, and gets home thirty minutes later. Which API allows the queued statements to flush even after the tab is closed?

<div class="upper-alpha" markdown>
1. Background Sync API
2. SharedWorker API
3. WebSocket API
4. Page Visibility API
</div>

??? question "Show Answer"
    The correct answer is **A**. The Background Sync API lets a service worker register a sync event with a tag; when the browser detects connectivity, it wakes the worker and runs the registered handler — even if the page is closed. This is exactly the train-to-home scenario. SharedWorker is for cross-tab coordination. WebSocket is for live duplex communication. Page Visibility detects tab focus, not the closed state.

    **Concept Tested:** Background Sync API

---

#### 7. Why is `navigator.onLine` insufficient for connectivity detection in production?

<div class="upper-alpha" markdown>
1. It is removed in modern browsers
2. It only detects network-level connectivity, not LRS reachability or captive portals
3. It returns true only on cellular networks
4. It requires an HTTPS endpoint to function
</div>

??? question "Show Answer"
    The correct answer is **B**. `navigator.onLine` only detects network-level connectivity. It cannot tell you if the LRS is reachable, if your authentication is still valid, or if a captive portal is intercepting your traffic. The robust pattern is layered: navigator.onLine first, then a recent-success heuristic, then a health probe to `/xAPI/about`, then a POST attempt with a tight timeout. The other options are factually wrong.

    **Concept Tested:** Connectivity Detection

---

#### 8. A team computes that 30 students × 85 KB per chapter = 2.5 MB over a 20-minute session. Which deployment scenario matches this load best?

<div class="upper-alpha" markdown>
1. The session would saturate a 100 Mbps school link and require an upgrade
2. The session would exceed mobile data caps for every student
3. The session adds about 17 KB/sec aggregate, invisible on a campus connection but possibly noticeable on a saturated school link
4. The session cannot be supported on any standard school WiFi
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter's worked example computes 30 students × 85 KB = 2.5 MB over 20 minutes, or ~17 KB/sec aggregate. That is small enough to be invisible on a campus connection and large enough to be noticeable on a school's shared 100 Mbps link during peak hours. The other options overstate the impact — 17 KB/sec is well within any classroom WiFi's capacity, even saturated school networks.

    **Concept Tested:** Bandwidth Budget Calculation

---

#### 9. The chapter recommends a progressive sync strategy when flushing a large offline queue. Which rule is part of that strategy?

<div class="upper-alpha" markdown>
1. Flush all queued statements in a single POST to minimize requests
2. Flush in random order to balance load across the LRS
3. Flush in chronological order, in batches sized to the configured batchSize, with brief pauses between batches
4. Flush in reverse chronological order so newer events appear first
</div>

??? question "Show Answer"
    The correct answer is **C**. Progressive sync flushes in chronological order (preserving the temporal narrative), in batches sized to `batchSize` (matching normal client behavior), with pauses (500ms-2s) between batches to avoid flooding the LRS or triggering rate-limit responses. Single-shot flushing of a large queue can overwhelm the LRS. Random or reverse order breaks the temporal narrative the analytics layer relies on.

    **Concept Tested:** Progressive Sync Strategy

---

#### 10. Under HTTP/2 multiplexing, the bandwidth savings from batching are typically how much smaller than under HTTP/1.1?

<div class="upper-alpha" markdown>
1. Roughly the same
2. Smaller — 30 to 50 percent reduction under HTTP/2 vs 60 to 80 percent under HTTP/1.1
3. Larger — HTTP/2 amplifies batching gains
4. Negative — batching becomes counterproductive under HTTP/2
</div>

??? question "Show Answer"
    The correct answer is **B**. Under HTTP/1.1, each unbatched POST roughly opened a new TCP connection and paid the slow-start cost, so batching saved 60-80%. Under HTTP/2, a single connection multiplexes many concurrent requests cheaply, so the marginal cost of an extra POST is much lower — batching savings drop to 30-50%. Batching is still worth doing under HTTP/2 (header compression, amortized parsing), but the win is smaller.

    **Concept Tested:** HTTP/2 Multiplexing

---
