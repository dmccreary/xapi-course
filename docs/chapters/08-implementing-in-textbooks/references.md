# References: Implementing xAPI in Intelligent Textbooks

<<<<<<< HEAD
1. [Fetch API](https://en.wikipedia.org/wiki/Fetch_API) - Wikipedia - Background on the modern browser HTTP API used by xAPI client libraries, including the credentials, headers, and AbortController interactions that affect statement transmission.

2. [JavaScript](https://en.wikipedia.org/wiki/JavaScript) - Wikipedia - Language overview useful for grounding the choices the textbook client library makes (modules, async/await, Promises).

3. [Exponential Backoff](https://en.wikipedia.org/wiki/Exponential_backoff) - Wikipedia - The retry strategy used by robust xAPI clients to handle 5xx responses without hammering an unhealthy LRS, with mathematical justification of jitter.

4. JavaScript: The Definitive Guide (7th Edition) - David Flanagan - O'Reilly - Comprehensive language reference; chapters on async iteration, Promises, and modules apply directly to building a maintainable xAPI client.

5. You Don't Know JS Yet (2nd Edition) - Kyle Simpson - Independently published - Deep dives on closures, async patterns, and the event loop that affect how xAPI emit logic interacts with the rest of the page.

6. [TinCan.js](https://github.com/RusticiSoftware/TinCanJS) - Rustici Software - Reference JavaScript xAPI client library; its source is the canonical example of how to build statement objects, sign them, and POST them with retry logic.

7. [xAPI Wrapper (ADL)](https://github.com/adlnet/xAPIWrapper) - ADL Net - ADL's official lightweight JavaScript wrapper for emitting statements from a browser, smaller and easier to read than TinCanJS for first-time implementers.

8. [MDN Web Docs — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Mozilla - Authoritative documentation on `fetch`, including the patterns for setting `X-Experience-API-Version` headers and handling streaming responses.

9. [MDN Web Docs — IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Mozilla - Reference for the offline-queue storage layer; the async cursor pattern is essential for flushing batched statements.

10. [MkDocs Material Documentation](https://squidfunk.github.io/mkdocs-material/) - Material for MkDocs - Documentation for the static-site framework this textbook uses; the customization hooks are how the xAPI client library gets injected into rendered pages.
=======
1. [Fetch API](https://en.wikipedia.org/wiki/Fetch_API) - Wikipedia - The browser-native HTTP client this chapter's reference implementation is built on. Covers request/response objects, streaming, and the AbortController pattern used to cancel in-flight statements.

2. [Exponential Backoff](https://en.wikipedia.org/wiki/Exponential_backoff) - Wikipedia - The retry algorithm every production xAPI client needs when the LRS returns 429 or 5xx. Explains base, factor, jitter, and the cap that prevents pathological retry storms.

3. [TypeScript](https://en.wikipedia.org/wiki/TypeScript) - Wikipedia - The typed superset of JavaScript this chapter recommends for the client library; types for `Statement`, `Agent`, and `Activity` catch a class of bugs that pure JavaScript ships to production.

4. RESTful Web APIs - Leonard Richardson, Mike Amundsen, Sam Ruby - O'Reilly Media - The chapters on idempotency keys and safe retries inform how the chapter's client library handles network partitions during statement submission.

5. JavaScript: The Definitive Guide (7th Edition) - David Flanagan - O'Reilly Media - The deepest treatment of the modern JavaScript runtime — Promises, async/await, modules — that the reference client library uses throughout. The everyday desk reference.

6. [TinCanJS Source](https://github.com/RusticiSoftware/TinCanJS) - Rustici Software - The reference JavaScript client library; reading its retry logic, statement queue, and offline buffer is the fastest way to learn what production xAPI code looks like.

7. [xAPI Wrapper](https://github.com/adlnet/xAPIWrapper) - ADL Initiative - ADL's official lightweight xAPI client; smaller and easier to read than TinCanJS, and a good base to fork when you want a textbook-specific client.

8. [MDN Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Mozilla Developer Network - The authoritative browser-API reference for `fetch()`, request headers, CORS pre-flights, and credentials handling — all of which xAPI clients exercise in tricky ways.

9. [MkDocs Material Documentation](https://squidfunk.github.io/mkdocs-material/) - Squidfunk - The static-site generator this textbook is built on; the chapter integrates xAPI emission with Material's page-load lifecycle and theme switching.

10. [xAPI Statement Cookbook](https://xapi.com/statement-cookbook/) - Rustici Software - A library of vetted statement patterns for common interactive learning events (quiz, video, simulation, page-view). The first place to look before inventing a new pattern.
>>>>>>> d2ecc9b (iframe updates)
