# References: Bandwidth Optimization, Offline Queues, and Service Workers

<<<<<<< HEAD
1. [Service Worker](https://en.wikipedia.org/wiki/Service_worker) - Wikipedia - Overview of the browser-resident worker thread that intercepts network requests — the foundation of xAPI offline queues that survive page reloads and tab close.

2. [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) - Wikipedia - Background on the durable client-side storage API used to hold queued statements while offline, including its transaction model and quota behavior.

3. [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) - Wikipedia - Multiplexing, header compression, and other transport-level features that affect xAPI batching trade-offs — useful for reasoning about overhead amortization beyond the application layer.

4. High Performance Browser Networking - Ilya Grigorik - O'Reilly - Authoritative reference on browser networking; chapters on TCP, TLS, and HTTP/2 apply directly to reasoning about xAPI bandwidth and latency.

5. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly - Chapters on batch and stream processing illuminate the engineering principles behind statement batching and the offline-queue replay design.

6. [MDN Web Docs — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - Mozilla - Authoritative reference for the service worker lifecycle, fetch interception, and the background sync API that drives offline statement flushing.

7. [MDN Web Docs — Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB) - Mozilla - Step-by-step tutorial for IndexedDB transactions, cursors, and the patterns most relevant to a statement queue.

8. [Workbox](https://developer.chrome.com/docs/workbox) - Google Chrome Developers - Open-source library that abstracts service worker patterns; the BackgroundSync plugin maps cleanly onto xAPI offline-queue requirements.

9. [Chrome DevTools Network Throttling](https://developer.chrome.com/docs/devtools/network/) - Google Chrome Developers - Documentation for simulating constrained networks (3G, slow 4G, offline) when validating that xAPI bandwidth budgets hold under realistic conditions.

10. [Web.dev — Offline Cookbook](https://web.dev/articles/offline-cookbook) - Google web.dev - Recipes for service worker caching and queue strategies, several of which translate directly to xAPI emit-and-replay logic.
=======
1. [Service Worker](https://en.wikipedia.org/wiki/Service_worker) - Wikipedia - The browser feature that powers xAPI offline queues; covers lifecycle events (install, activate, fetch), scope, and the security constraints that govern background sync.

2. [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) - Wikipedia - The persistent client-side database every serious offline xAPI queue eventually uses; explains object stores, transactions, and the key/index model the chapter's queue implementation relies on.

3. [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) - Wikipedia - The protocol that makes statement multiplexing cheap and changes the bandwidth math for high-frequency events. Required reading before deciding how aggressively to batch.

4. High Performance Browser Networking - Ilya Grigorik - O'Reilly Media - The single most relevant book for this chapter; chapters on TCP, TLS, HTTP/2, and mobile networks ground every bandwidth-optimization decision a textbook author makes.

5. Web Performance in Action - Jeremy Wagner - Manning Publications - Practical playbook for measuring and reducing payload size, optimizing critical paths, and the field-validated patterns that apply directly to xAPI traffic.

6. [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - Mozilla Developer Network - Authoritative reference for service worker registration, lifecycle, and the `fetch` event; the spec is hard, this docs site is approachable.

7. [MDN IndexedDB Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Mozilla Developer Network - Step-by-step guide to opening databases, structuring transactions, and the upgrade-version migration pattern xAPI offline queues need when the schema evolves.

8. [Workbox](https://developer.chrome.com/docs/workbox) - Google Chrome Developers - High-level service-worker library that handles the boilerplate around runtime caching and background sync; valuable for textbook authors who don't want to write a queue from scratch.

9. [web.dev — Offline Cookbook](https://web.dev/articles/offline-cookbook) - Google web.dev - Curated collection of offline patterns (cache-first, network-first, stale-while-revalidate) with code samples. Maps directly onto xAPI flush strategies.

10. [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) - Mozilla Developer Network - The browser API that lets a service worker flush a queued xAPI batch the next time the device is online, without needing the original tab to be open.
>>>>>>> d2ecc9b (iframe updates)
