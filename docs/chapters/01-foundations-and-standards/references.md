# References: Foundations of xAPI and the Learning Standards Landscape

<<<<<<< HEAD
1. [Experience API (xAPI)](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia - Comprehensive overview of xAPI's history, design goals, and the transition from Tin Can API. Covers the relationship to ADL and the broader e-learning standards family.

2. [Sharable Content Object Reference Model (SCORM)](https://en.wikipedia.org/wiki/Sharable_Content_Object_Reference_Model) - Wikipedia - Background on the standard xAPI was designed to succeed. Essential for understanding why xAPI's Actor/Verb/Object model was a deliberate departure from SCORM's browser-locked completion tracking.

3. [Learning Record Store](https://en.wikipedia.org/wiki/Learning_Record_Store) - Wikipedia - Definition of the LRS role in the xAPI ecosystem, common storage and query characteristics, and references to popular open-source and commercial implementations.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - Foundational primer covering the spec's history, statement-as-sentence metaphor, and the Activity Provider / LRS / Activity Consumer triangle that frames the rest of the course.

5. The Tin Can API: A Practical Guide - Aaron Silvers - Float Mobile Learning - Accessible walk-through of the original Project Tin Can vision, the limitations of SCORM that motivated it, and early adoption case studies that shaped the standard.

6. [xAPI Specification (1.0.3)](https://github.com/adlnet/xAPI-Spec) - ADL Net - Canonical specification document on GitHub, including the full statement schema, the four LRS resource endpoints, and conformance requirements that every implementation must meet.

7. [xAPI.com — What is xAPI?](https://xapi.com/overview/) - Rustici Software - Industry-friendly overview of xAPI's value proposition, with concrete examples of statements that SCORM cannot express (mobile, simulations, informal learning).

8. [ADL xAPI Resources](https://adlnet.gov/projects/xapi/) - Advanced Distributed Learning - The standard's official home page, including links to the spec, the verb registry, the LRS conformance test suite, and ADL's reference profile catalog.

9. [IMS Global / 1EdTech Standards](https://www.1edtech.org/standards) - 1EdTech (formerly IMS Global) - Index of the LTI, Caliper, and QTI standards that xAPI interoperates with. Useful for placing xAPI inside the broader educational-data standards landscape.

10. [cmi5 Project Page](https://aicc.github.io/CMI-5_Spec_Current/) - AICC / ADL - Specification for the LMS-launch wrapper that lets xAPI behave like SCORM inside an LMS, useful background for how xAPI inherited the launch lifecycle from earlier standards.
=======
1. [Experience API (xAPI)](https://en.wikipedia.org/wiki/Experience_API) - Wikipedia - Comprehensive overview of xAPI's history, predecessors (SCORM, AICC), the actor/verb/object statement model, and the Learning Record Store concept. Essential foundation for the standards landscape introduced in this chapter.

2. [Sharable Content Object Reference Model](https://en.wikipedia.org/wiki/Sharable_Content_Object_Reference_Model) - Wikipedia - Detailed explanation of SCORM 1.2 and SCORM 2004, the runtime API, the content packaging model, and the historical context that motivated the move to xAPI.

3. [Learning Tools Interoperability](https://en.wikipedia.org/wiki/Learning_Tools_Interoperability) - Wikipedia - Coverage of LTI 1.x and LTI Advantage, the IMS Global standards family, and how LTI complements (rather than competes with) xAPI for course-tool integration.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - Chapters on derived data and event streams provide the systems-thinking grounding that makes xAPI's "ledger of learning events" model click for software professionals.

5. Learning Analytics: From Research to Practice (2nd Edition) - Johann Ari Larusson and Brandon White (Editors) - Springer - Surveys the analytics layer that consumes xAPI data, including the organizational realities of K-12, higher ed, and corporate L&D contexts.

6. [xAPI Specification (1.0.3) on GitHub](https://github.com/adlnet/xAPI-Spec) - ADL Initiative - The canonical xAPI 1.0.3 specification organized into Part One (about), Part Two (statements), and Part Three (data and APIs). The authoritative source the rest of this course refers back to.

7. [xAPI 101 — Statements 101](https://xapi.com/statements-101/) - Rustici Software - Plain-English walkthrough of the actor-verb-object pattern with annotated JSON examples. Excellent supplement when the spec language gets dense.

8. [ADL Initiative xAPI Resources](https://adlnet.gov/projects/xapi/) - Advanced Distributed Learning Initiative - The U.S. Department of Defense agency that authored xAPI; collects specifications, conformance tools, and sample profiles for the wider standards landscape.

9. [IMS Caliper Analytics Specification](https://www.imsglobal.org/activity/caliper) - 1EdTech (formerly IMS Global) - Official Caliper Analytics overview, the rival event-stream specification with stronger LMS-vendor backing. Useful for the head-to-head comparison this chapter introduces.

10. [cmi5 Specification](https://github.com/AICC/CMI-5_Spec_Current) - AICC / ADL - The constrained xAPI profile that makes xAPI usable from inside an LMS launch context. Read alongside SCORM history to see exactly what cmi5 fixes.
>>>>>>> d2ecc9b (iframe updates)
