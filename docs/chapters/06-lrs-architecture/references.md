# References: Learning Record Store Architecture and Query Endpoints

1. [Representational State Transfer](https://en.wikipedia.org/wiki/REST) - Wikipedia - The architectural style every LRS implements; covers resources, HTTP verbs, status codes, and statelessness — all of which xAPI inherits and constrains for the `/statements` endpoint.

2. [HTTP ETag](https://en.wikipedia.org/wiki/HTTP_ETag) - Wikipedia - The optimistic-concurrency mechanism the xAPI state and agent-profile endpoints use via `If-Match` and `If-None-Match`. Critical for understanding how to avoid lost updates without pessimistic locking.

3. [Pagination](https://en.wikipedia.org/wiki/Pagination#In_computing) - Wikipedia - Background on cursor-based pagination, the model xAPI's StatementResult `more` field implements. Explains why offset-based paging breaks for high-write event streams.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - The most relevant single book for this chapter; storage engines, indexes, replication, and partitioning all show up directly in real LRS implementations.

5. RESTful Web APIs - Leonard Richardson, Mike Amundsen, Sam Ruby - O'Reilly Media - Resource modeling and hypermedia patterns that explain why the xAPI endpoint set (`/statements`, `/agents`, `/activities`, `/state`, `/about`) is shaped the way it is.

6. [xAPI Spec Part Three — Data Processing, Validation, and Security](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md) - ADL Initiative - The authoritative section on LRS endpoints, query parameters, headers, voiding behavior, and conformance requirements that this chapter teaches you to implement against.

7. [ADL LRS Conformance Test Suite](https://github.com/adlnet/lrs-conformance-test-suite) - ADL Initiative - The reference test suite an LRS must pass to claim conformance. The single best resource for understanding what an LRS is required to do at the wire level.

8. [TRAX LRS Documentation](https://traxlrs.com/docs/) - TRAX - The open-source LRS used as a reference implementation throughout this course; the docs cover schema choices, store layout, and query indexing strategies.

9. [Ralph LRS Documentation](https://openfun.github.io/ralph/) - France Université Numérique - Modern Python-based LRS with a clean architecture; the source is short enough to read end-to-end and clarifies the implementation choices the spec leaves open.

10. [HTTP/1.1 Conditional Requests (RFC 7232)](https://www.rfc-editor.org/rfc/rfc7232) - IETF - The precise semantics of `If-Match`, `If-None-Match`, and the 412 Precondition Failed response that xAPI's state endpoint relies on for safe concurrent writes.
