# References: The xAPI Statement Model — Actor, Verb, Object, Result, and Context

<<<<<<< HEAD
1. [Experience API (xAPI)](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia - The statement-model section covers Actor/Verb/Object structure with worked JSON examples and explains the use of IRIs as globally unique identifiers.

2. [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD) - Wikipedia - Background on the linked-data conventions xAPI inherits, including how IRIs identify verbs and activities without a central registry — foundational for understanding why statements are portable across LRSs.

3. [Internationalized Resource Identifier (IRI)](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier) - Wikipedia - Detailed explanation of IRIs, how they generalize URIs/URLs, and why xAPI uses them to identify verbs and activities globally without DNS resolution.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - Chapters on statement anatomy walk through every required and optional field with side-by-side beginner and advanced examples that match this chapter's progression.

5. The xAPI Companion - Megan Bowe & Aaron Silvers - HT2 Labs - Practical reference covering the three xAPI roles (Activity Provider, LRP, Activity Consumer), with emphasis on what each role is responsible for verifying about a statement.

6. [xAPI Statement Format Specification](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) - ADL Net - Authoritative specification for every statement field, including the rules for `id`, `stored`, `timestamp`, and `authority` that this chapter's metadata section depends on.

7. [ADL Verb Registry](https://registry.tincanapi.com/#home/verbs) - Rustici Software / ADL - The community-curated list of canonical verb IRIs. Useful for testing your understanding of how the verb field is populated in real statements.

8. [TinCan.js GitHub Repository](https://github.com/RusticiSoftware/TinCanJS) - Rustici Software - Open-source reference JavaScript client. Reading the `Statement.js`, `Agent.js`, and `Verb.js` modules makes the statement model concrete in code form.

9. [SCORM Cloud xAPI Statement Viewer](https://cloud.scorm.com/) - Rustici Software - Free LRS test environment that lets you POST statements and inspect how each field round-trips, including `stored` and `authority` fields the LRS adds.

10. [xAPI Cookbook — Statement Examples](https://xapi.com/statements-101/) - Rustici Software / xAPI.com - Concrete worked examples of well-formed statements for many common learning scenarios, paired with notes on why each chose the specific verbs and activity types it did.
=======
1. [JSON](https://en.wikipedia.org/wiki/JSON) - Wikipedia - Reference for the data format every xAPI statement is built in, including type rules, escaping, and the conventions xAPI inherits. Essential background for reading and constructing statement payloads.

2. [Internationalized Resource Identifier](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier) - Wikipedia - Explains the IRI / IRI-reference syntax used for verb IDs, activity IDs, and extension keys. Clarifies why xAPI identifiers look URL-shaped but aren't required to resolve.

3. [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) - Wikipedia - The timestamp format xAPI mandates for the `timestamp` and `stored` fields, including timezone offsets and fractional seconds. Critical for getting "when did this happen" right.

4. RESTful Web APIs - Leonard Richardson, Mike Amundsen, Sam Ruby - O'Reilly Media - Foundational treatment of resource-oriented design, hypermedia, and JSON-based APIs that grounds the choices xAPI's statement endpoints inherit.

5. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - Chapter on event sourcing and immutable append-only logs explains exactly why xAPI statements are designed to be immutable once stored.

6. [xAPI Spec Part Two — Experience API](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md) - ADL Initiative - The authoritative section on statement structure, required and optional properties, data types, and equivalence rules. The reference this chapter is teaching readers how to read.

7. [xAPI Statements 101](https://xapi.com/statements-101/) - Rustici Software - Walks through actor / verb / object construction with annotated JSON examples and common-mistake warnings. Pairs perfectly with this chapter's field-by-field tour.

8. [TinCanJS Library](https://github.com/RusticiSoftware/TinCanJS) - Rustici Software - The most-used JavaScript helper for constructing and validating xAPI statements; reading its source clarifies what the spec means in practice.

9. [ADL xAPI Lab](https://lrs.adlnet.gov/lab) - ADL Initiative - A live web tool that lets you build, send, and inspect xAPI statements against a hosted LRS sandbox. Hands-on companion to this chapter's worked examples.

10. [JSON Schema](https://json-schema.org/) - JSON Schema Organization - The validation language used by community-maintained xAPI statement schemas; useful for adding statement validation in CI before statements ever reach an LRS.
>>>>>>> d2ecc9b (iframe updates)
