---
title: References
description: Key websites, specifications, and announcements referenced throughout xAPI for Intelligent Textbooks.
---

# References

The following references collect the primary sources cited across this
textbook — specifications, conformance suites, registries, and the
governance pages that explain who maintains what. Use this page when you
need an authoritative link for a procurement memo, a citation, or your
own implementation work.

## xAPI Governance and Stewardship

[I2IDL: Status Update](https://www.i2idl.org/news/i2idl-status-update) - 2026-01-16 - i2idl.org - Founding update from the Institute for Infrastructure and Interoperable Data in Learning explaining why I2IDL was created, what changed at ADL, and which open-source xAPI / TLA assets the new nonprofit has taken stewardship of.

[Announcing the Inaugural I2IDL Technical Steering Committee](https://www.i2idl.org/news/tsc) - 2026-01-30 - i2idl.org - Announcement of the inaugural 25+ member I2IDL TSC, including representatives from ADL, Rustici Software, the CERT Division at the Software Engineering Institute, and the University of Florida; defines the TSC's advisory role for open-source policy and conformance testing.

[I2IDL Home](https://www.i2idl.org/) - 2026 - i2idl.org - Landing page for I2IDL describing its mission as an independent, non-governmental, non-profit organization advancing open-source data systems for learning, training, and education.

[I2IDL News](https://www.i2idl.org/news) - 2026 - i2idl.org - Index of I2IDL announcements, webinars, and predictions about the learning-data ecosystem; the canonical source for tracking governance updates after the ADL transition.

## xAPI Specification and Standard

[IEEE Std 9274.1.1-2023](https://standards.ieee.org/ieee/9274.1.1/7321/) - 2023-10 - IEEE Standards Association - The formally ratified IEEE version of xAPI; the standard this book targets at the specification level. Cite this when a procurement framework or curriculum standard requires an IEEE reference.

[xAPI Specification on GitHub (adlnet/xAPI-Spec)](https://github.com/adlnet/xAPI-Spec) - 2016 (1.0.3) - GitHub / ADL - The community-edited source-of-truth for xAPI 1.0.3, including the full statement schema, communication API, and document API. Open-source stewardship is in the process of transitioning to I2IDL.

[ADL xAPI Project Overview](https://adlnet.gov/projects/xapi/) - 2024 - Advanced Distributed Learning Initiative - ADL's overview of xAPI, its motivation, and its relationship to the Total Learning Architecture. Useful as the historical "why" reference even after the I2IDL transition.

## Conformance, Profiles, and Registries

[ADL LRS Conformance Test Suite](https://github.com/adlnet/lrs-conformance-test-suite) - 2024 - GitHub / ADL - The official validation harness that exercises an LRS implementation against the xAPI specification; passing this suite is the baseline requirement for claiming LRS conformance.

[ADL xAPI Profile Server](https://profiles.adlnet.gov/) - 2024 - Advanced Distributed Learning Initiative - Public registry of xAPI profiles (machine-readable JSON-LD documents defining vocabulary, statement patterns, and extensions for specific learning domains). The reference implementation is among the open-source assets I2IDL now stewards.

[ADL Verb Registry](http://adlnet.gov/expapi/verbs/) - 2024 - Advanced Distributed Learning Initiative - The canonical registry of common xAPI verb IRIs (`completed`, `attempted`, `passed`, `failed`, `experienced`, etc.). Use these IRIs rather than custom verbs whenever possible to maximize cross-system interoperability.

[xAPI Adopters Registry](https://adopters.adlnet.gov/) - 2024 - Advanced Distributed Learning Initiative - List of products, platforms, and authoring tools that emit or consume xAPI statements; useful when evaluating vendors or building a stack-compatibility matrix.

[ADL Conformant LRS List](https://adlnet.gov/projects/xapi/learning-record-stores/) - 2024 - Advanced Distributed Learning Initiative - Curated list of LRS implementations that have demonstrated conformance, spanning open-source (TRAX, Learning Locker, Ralph) and commercial offerings.

## Related Standards

[1EdTech Consortium (formerly IMS Global)](https://www.1edtech.org/) - 2024 - 1edtech.org - Standards body for IMS LTI, IMS Caliper, and IMS QTI; the home of xAPI's main interoperability peers in the higher-ed ecosystem.

[IMS Caliper Analytics Specification](https://www.1edtech.org/standards/caliper) - 2020 (Caliper 1.2) - 1edtech.org - The competing learning-analytics standard against which xAPI is most often compared; relevant for higher-ed deployments where Canvas or D2L Brightspace already emit Caliper natively.

[IMS LTI Advantage (LTI 1.3)](https://www.1edtech.org/standards/lti) - 2019 - 1edtech.org - The launch and identity layer for handing learners off from an LMS to an external tool (such as an intelligent textbook); complementary to xAPI rather than competing with it.

[IMS QTI Specification](https://www.1edtech.org/standards/qti) - 2024 - 1edtech.org - The portable, vendor-neutral assessment format for exchanging quiz items and tests between authoring tools, item banks, and delivery platforms.

[CMI5 Specification](https://github.com/AICC/CMI-5_Spec_Current) - 2016 (CMI5 1.0) - GitHub / AICC - The xAPI profile that defines an LMS-launch session lifecycle (`launched` → `initialized` → `passed`/`failed` → `completed` → `terminated`); the diplomat between SCORM-shaped LMSs and modern xAPI content.

## Historical and Community Context

[Tin Can API (Rustici Software)](https://tincanapi.com/) - 2013–present - Rustici Software - The long-running community reference site that originated as Project Tin Can; still the most accessible "how does this work?" resource for newcomers, even though "Tin Can API" and "xAPI" now mean the same thing.

[Rustici Software](https://rusticisoftware.com/) - 2024 - rusticisoftware.com - The vendor that ran the ADL-commissioned research project (2010–2013) that produced xAPI, and which continues to maintain SCORM Cloud and several reference implementations.

[Total Learning Architecture (TLA)](https://adlnet.gov/projects/tla/) - 2024 - Advanced Distributed Learning Initiative - The U.S. federal vision for cross-system learner data that xAPI was designed to support; I2IDL has taken over open-source stewardship of the TLA reference implementations.

## Industry Context

[ATD 2024 State of the Industry Report](https://www.td.org/research-reports/2024-state-of-the-industry) - 2024 - Association for Talent Development - Annual benchmark on U.S. corporate training spending; cited in this book to ground the market-scale argument for instrumentation.
