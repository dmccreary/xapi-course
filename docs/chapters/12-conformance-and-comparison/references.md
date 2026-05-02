# References: Conformance Testing, Validation, and Competitive Standards Analysis

1. [Conformance testing](https://en.wikipedia.org/wiki/Conformance_testing) - Wikipedia - The general practice of black-box testing an implementation against a spec; gives the vocabulary and rationale behind the ADL xAPI conformance test suite this chapter teaches you to run.

2. [SCORM 2004](https://en.wikipedia.org/wiki/Sharable_Content_Object_Reference_Model) - Wikipedia - Detailed coverage of SCORM 2004's runtime API, content packaging, and sequencing model — the legacy standard this chapter teaches you to map into xAPI verbs.

3. [Total Cost of Ownership](https://en.wikipedia.org/wiki/Total_cost_of_ownership) - Wikipedia - The procurement-relevant framework for comparing xAPI, IMS Caliper, SCORM 2004, and proprietary SDKs head-to-head, which this chapter assembles into a structured rubric.

4. The Really Useful eLearning Instruction Manual - Rob Hubbard (Editor) - Wiley - Has chapters comparing the major learning standards from a practitioner's procurement angle; useful counterpoint to the spec-centric view this chapter teaches.

5. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - The schema-evolution chapters apply directly to the SCORM-to-xAPI mapping problem, where two standards must coexist during a multi-year migration.

6. [ADL LRS Conformance Test Suite](https://github.com/adlnet/lrs-conformance-test-suite) - ADL Initiative - The reference test suite for LRS conformance with xAPI 1.0.3. The single most important resource for proving an implementation conforms to spec.

7. [ADL xAPI Conformance Tests for Adopters](https://github.com/adlnet/xapi-conformance-tests) - ADL Initiative - Statement-level conformance tests an Activity Provider can run against its own emitted statements before they reach an LRS. Catches a class of bugs before they become production-data.

8. [cmi5 Specification](https://github.com/AICC/CMI-5_Spec_Current) - AICC / ADL - The constrained xAPI profile with its own conformance requirements. This chapter teaches the cmi5 lifecycle (initialized → completed/passed → terminated) and the verbs that gate conformance.

9. [IMS Caliper Analytics — Sensor API Implementation Guide](https://www.imsglobal.org/spec/caliper/v1p2) - 1EdTech (formerly IMS Global) - The competing event specification this chapter compares against xAPI on vocabulary richness, LMS-vendor support, and implementation cost.

10. [SCORM-to-xAPI Mapping Guide](https://adlnet.gov/projects/scorm-and-xapi/) - ADL Initiative - The official guidance for migrating SCORM 1.2 / SCORM 2004 courses to xAPI, including the canonical mapping of completion-status and score events to xAPI statement patterns.
