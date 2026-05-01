# References: The xAPI Statement Model — Actor, Verb, Object, Result, and Context

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
