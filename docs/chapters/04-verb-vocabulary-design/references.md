# References: Verb Vocabulary Design and the ADL Verb Registry

1. [Controlled Vocabulary](https://en.wikipedia.org/wiki/Controlled_vocabulary) - Wikipedia - General principles of controlled vocabulary design, with examples from library science that illuminate why xAPI deliberately *doesn't* enforce a fixed verb list.

2. [Internationalized Resource Identifier (IRI)](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier) - Wikipedia - The identifier scheme that makes verbs portable. Understanding IRI semantics is essential for designing custom verbs that won't collide with anyone else's.

3. [Linked Data](https://en.wikipedia.org/wiki/Linked_data) - Wikipedia - Background on the dereferencable-URL design philosophy that xAPI inherits — why a verb IRI ideally resolves to a definition document, and what happens when it doesn't.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - Chapters on verb selection cover the trade-offs between canonical and custom verbs with case studies from real adoption efforts.

5. The xAPI Companion - Megan Bowe & Aaron Silvers - HT2 Labs - Includes a verb-design decision framework: when to reuse, when to extend, and when a new verb is genuinely needed — with examples of common over-customization mistakes.

6. [ADL Verb Registry](https://registry.tincanapi.com/#home/verbs) - Rustici Software / ADL - Browse-and-search interface to the canonical ADL verbs plus community-submitted verbs, with usage statistics and example statements for each.

7. [xAPI Vocabulary on xapi.com](https://xapi.com/about/vocabulary/) - Rustici Software - Practitioner-friendly index of well-known verb categories (interactive, social, mobile, simulation) with guidance on which to prefer for each use case.

8. [xAPI Profiles Specification](https://github.com/adlnet/xapi-profiles) - ADL Net - The mechanism for publishing a custom vocabulary as a JSON-LD profile, including the metadata fields every verb definition should carry.

9. [DCMI Metadata Terms](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) - Dublin Core Metadata Initiative - Reference for the metadata vocabulary (title, description, creator, etc.) that profile servers reuse when documenting custom verbs.

10. [W3C JSON-LD Best Practices](https://www.w3.org/TR/json-ld11-api/) - World Wide Web Consortium - Authoritative guidance on JSON-LD context design, useful when authoring profile documents that must remain interpretable years after publication.
