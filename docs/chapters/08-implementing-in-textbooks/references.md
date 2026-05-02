# References: Implementing xAPI in Intelligent Textbooks

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
