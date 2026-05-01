# References: Implementing xAPI in Intelligent Textbooks

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
