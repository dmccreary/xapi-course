# References: Learning Record Store Architecture and Query Endpoints

<<<<<<< HEAD
1. [Learning Record Store](https://en.wikipedia.org/wiki/Learning_Record_Store) - Wikipedia - Definition, history, and architectural variants of the LRS, including the read/write split and the relationship between the LRS and external analytics tools.

2. [Representational State Transfer (REST)](https://en.wikipedia.org/wiki/REST) - Wikipedia - Architectural style underlying the xAPI HTTP API, useful background for understanding the design of the five canonical endpoints and their idempotency properties.

3. [Optimistic Concurrency Control](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) - Wikipedia - The strategy xAPI uses for the State and Profile resources — etags + If-Match — explained alongside the alternative pessimistic approaches.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - The LRS chapters cover endpoint semantics with example request/response pairs and explain the conformance distinction between an LRS and a generic xAPI store.

5. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly - Foundational text on the storage and consistency trade-offs every LRS implementer faces; chapters on replication, partitioning, and secondary indexes apply directly to LRS scaling decisions.

6. [xAPI Communication Specification](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md) - ADL Net - The authoritative spec for the five LRS endpoints, including pagination via `more`, the consistent-read header, and the rules for filtering on `since`, `until`, and `agent`.

7. [Learning Locker GitHub](https://github.com/LearningLocker/learninglocker) - HT2 Labs / Learning Pool - Open-source MongoDB-backed LRS implementation. Reading the storage and query modules makes the architecture chapter concrete.

8. [TRAX LRS GitHub](https://github.com/trax-project/trax-lrs) - TRAX Project - Open-source PHP/MySQL LRS, useful as a small-scale comparison point to Learning Locker's NoSQL design.

9. [Ralph LRS GitHub](https://github.com/openfun/ralph) - France Université Numérique - Open-source Python/Postgres LRS designed for scalability, with documented benchmarks against ClickHouse-backed analytics stores.

10. [SQL LRS Reference (DataShop)](https://pslcdatashop.web.cmu.edu/about/sql-lrs.html) - Carnegie Mellon University - Reference SQL-backed LRS used in research, with publications detailing query optimization for very-large statement corpora.
=======
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
>>>>>>> d2ecc9b (iframe updates)
