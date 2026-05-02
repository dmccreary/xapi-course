# References: The xAPI Statement Model — Actor, Verb, Object, Result, and Context

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
