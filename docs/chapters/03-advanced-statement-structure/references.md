# References: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments

<<<<<<< HEAD
1. [Experience API (xAPI)](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia - Sections on result, context, voiding, and extensions cover the optional statement parts this chapter focuses on, with examples of how statements gain precision when these fields are populated correctly.

2. [JSON Schema](https://en.wikipedia.org/wiki/JSON) - Wikipedia - Background on JSON structure, helpful for understanding how xAPI extension fields are validated and why the schema-flexibility of extensions cuts both ways.

3. [Universally Unique Identifier (UUID)](https://en.wikipedia.org/wiki/Universally_unique_identifier) - Wikipedia - The format used for statement IDs and registration values, including version 4 randomness guarantees that make voiding-by-id safe.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - The advanced-statement chapters cover voiding semantics, sub-statements, and the registration field with longer worked examples than the spec itself provides.

5. The xAPI Companion - Megan Bowe & Aaron Silvers - HT2 Labs - Particularly strong on context activities (parent / grouping / category / other) and the design questions that determine which bucket each context activity belongs in.

6. [xAPI-Spec — Voiding and Sub-Statements](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#voided) - ADL Net - Authoritative description of the voided verb and the rules around what may and may not be voided, plus the sub-statement constraints that prevent statements-of-statements-of-statements.

7. [xAPI Profiles Specification](https://github.com/adlnet/xapi-profiles) - ADL Net - Profiles formalize statement patterns and reusable extensions; this is the canonical reference once you move beyond ad-hoc context activities.

8. [Profile Server (Reference Implementation)](https://github.com/adlnet/xapi-profile-server) - ADL Net - A working profile server that publishes JSON-LD profiles at stable URLs — useful for understanding how extensions and patterns should be documented externally.

9. [xAPI Statement Examples — Veracity Learning](https://www.yetanalytics.com/blog) - Yet Analytics - Industry blog with practical statement-design walk-throughs covering attachments, signed statements, and complex context activities for real deployments.

10. [Rustici Software xAPI Documentation](https://xapi.com/) - Rustici Software - Practitioner-focused documentation on extensions, attachments, and statement signing, with clear guidance on when to use each and the cost they impose on consumers.
=======
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
>>>>>>> d2ecc9b (iframe updates)
