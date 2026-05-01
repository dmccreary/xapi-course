# References: Learning Record Store Architecture and Query Endpoints

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
