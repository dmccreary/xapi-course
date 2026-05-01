# References: Advanced Statement Structure — Voiding, Sub-Statements, Extensions, and Attachments

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
