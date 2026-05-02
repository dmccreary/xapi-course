# References: Activities, Agents, and Learner Identity

1. [Inverse Functional Property](https://en.wikipedia.org/wiki/Inverse_functional_property) - Wikipedia - The OWL property class xAPI's IFI concept inherits from. Explains why `mbox`, `openid`, `mbox_sha1sum`, and `account` can each uniquely identify an agent without a central registry.

2. [FOAF (ontology)](https://en.wikipedia.org/wiki/FOAF) - Wikipedia - The Friend-of-a-Friend vocabulary that contributed `mbox` and `mbox_sha1sum` to xAPI's identity model. Reading FOAF clarifies why xAPI's agent shape looks the way it does.

3. [Pseudonymization](https://en.wikipedia.org/wiki/Pseudonymization) - Wikipedia - The privacy technique behind opaque `account` IFIs and hashed mbox IDs. Essential background for understanding how to track a learner without storing their email address.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - The chapter on data modeling and identity foreign keys translates directly to xAPI's challenge of stitching statements together when learners use multiple devices and identifiers.

5. Learning Analytics Goes to School - Andrew Krumm, Barbara Means, Marie Bienkowski - Routledge - Practitioner-focused treatment of the K-12 identity reconciliation problems that this chapter's IFI strategies aim to solve, including parental-consent edge cases.

6. [xAPI Spec — Agents](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#agent) - ADL Initiative - The authoritative section on agent shape, IFI rules, and the equivalence comparisons an LRS performs to merge or distinguish agents.

7. [xAPI Spec — Activities](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#activitydef) - ADL Initiative - The activity object, activity definitions, activity types, and the canonical activity-type IRIs from `http://adlnet.gov/expapi/activities/...`. Required reading for instrumenting a textbook.

8. [ADL Activity Types Registry](https://registry.tincanapi.com/#home/activityTypes) - ADL / Tin Can - The community-maintained list of activity-type IRIs (`assessment`, `course`, `module`, `simulation`, etc.) you should reach for before defining a custom one.

9. [xAPI.com — Identifying Actors](https://xapi.com/blog/anatomy-xapi-statement-part-3-actor/) - Rustici Software - Real-world guidance on choosing among the four IFIs based on platform, privacy posture, and cross-device tracking needs.

10. [OpenID Connect](https://openid.net/connect/) - OpenID Foundation - The modern identity protocol that increasingly drives the `openid` IFI in higher-ed and corporate deployments. Explains the issuer/subject pattern xAPI accounts mirror.
