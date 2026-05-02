# References: Verb Vocabulary Design and the ADL Verb Registry

<<<<<<< HEAD
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
=======
1. [Controlled Vocabulary](https://en.wikipedia.org/wiki/Controlled_vocabulary) - Wikipedia - Foundational article on why curated vocabularies (versus free-text tags) are the prerequisite for cross-system analytics. Maps directly onto why xAPI verbs must be IRIs from a known registry.

2. [Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework) - Wikipedia - RDF's subject-predicate-object triple is the conceptual ancestor of xAPI's actor-verb-object. Reading this clarifies why xAPI verbs are IRIs and why semantic interoperability is achievable.

3. [Semantic Versioning](https://en.wikipedia.org/wiki/Software_versioning#Semantic_versioning) - Wikipedia - The major.minor.patch model that vocabulary profile maintainers must apply when evolving custom verb sets without breaking existing analytics queries.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - Chapters on schema evolution and forward/backward compatibility translate directly to vocabulary design — what happens when one team's `attempted` becomes another team's `tried`.

5. Learning Analytics: From Research to Practice (2nd Edition) - Larusson and White (Editors) - Springer - Multiple chapters discuss the consequences of inconsistent verb vocabularies on cohort comparison, the analytics problem this chapter is teaching readers to prevent.

6. [ADL Verb Vocabulary Registry](https://registry.tincanapi.com/) - ADL / Tin Can - The canonical registry of community-vetted verbs, complete with definitions, related activity types, and example usage. The reference this chapter teaches readers to consult before inventing anything.

7. [ADL xAPI Verbs](https://adlnet.gov/expapi/verbs/) - ADL Initiative - The original ADL-published verb namespace (`http://adlnet.gov/expapi/verbs/...`) that includes `experienced`, `attempted`, `passed`, `completed`, `failed`, and other foundational verbs.

8. [xAPI Profile Server](https://profiles.adlnet.gov/) - ADL Initiative - The official server hosting community xAPI profiles, including verb concepts, activity types, and Statement Templates. Where a custom verb profile ultimately gets published.

9. [cmi5 Specification — Defined Verbs](https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#90-xapi-statement-data-rules) - AICC / ADL - Worked example of a constrained vocabulary profile: cmi5 defines exactly nine verbs for LMS-launched content. A model for how to draw a tight vocabulary boundary.

10. [xAPI.com — Choosing Verbs](https://xapi.com/blog/the-anatomy-of-an-xapi-statement-part-2-the-statements-three-required-fields/) - Rustici Software - Practical advice on selecting verbs that maximize cross-platform analytics value, including the real-world cost of vocabulary fragmentation.
>>>>>>> d2ecc9b (iframe updates)
