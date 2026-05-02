# References: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments

1. [MIME (Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/MIME) - Wikipedia - Background on the multipart/mixed envelope xAPI uses when statements carry binary attachments. Explains content types, boundaries, and the SHA-2 hashing model.

2. [Universally Unique Identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) - Wikipedia - Covers UUID versions and generation rules; the xAPI spec mandates UUIDs for statement IDs and registrations, and clients must generate them client-side without coordination.

3. [SHA-2](https://en.wikipedia.org/wiki/SHA-2) - Wikipedia - The cryptographic hash family xAPI uses to bind attachments to their statements via `sha2`. Helpful for understanding why the hash is required and how to compute it.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - The chapter on transaction processing and event ordering grounds why voiding (rather than deletion) is the right design for an append-only learning ledger.

5. RESTful Web APIs - Leonard Richardson, Mike Amundsen, Sam Ruby - O'Reilly Media - Discussion of resource versioning and "compensating events" gives xAPI's voiding pattern a much wider engineering context than the spec alone.

6. [xAPI Spec — Voiding Statements](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#voided) - ADL Initiative - The specification's authoritative description of the voiding verb, statement references, and the rules governing what can and cannot be voided. The source of truth for this chapter.

7. [xAPI Spec — Attachments](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#attachments) - ADL Initiative - Detailed rules for the attachments object, the multipart envelope, content types, and the canonical `sha2` validation requirement.

8. [xAPI Profile Specification](https://github.com/adlnet/xapi-profiles) - ADL Initiative - Defines Statement Templates and Patterns — the reusable structures that turn ad-hoc statements into a machine-checkable shape. Required reading before designing a custom profile.

9. [xAPI.com — Sub-Statements](https://xapi.com/blog/deep-dive-substatement/) - Rustici Software - A clear deep-dive blog post on when sub-statements are appropriate and when they are not, with realistic examples. Pairs well with this chapter's voiding/sub-statement comparison.

10. [ADL Verb Vocabulary Registry](https://registry.tincanapi.com/) - ADL / Tin Can - The community registry that includes the canonical voiding verb and other verbs that interact with advanced statement features. The lookup tool this chapter assumes you know.
