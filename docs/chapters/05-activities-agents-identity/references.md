# References: Activities, Agents, and Learner Identity

1. [Inverse Function](https://en.wikipedia.org/wiki/Inverse_function) - Wikipedia - Mathematical foundation behind xAPI's "inverse functional identifier" concept — why these identifiers must round-trip uniquely from agent to identifier and back.

2. [OpenID](https://en.wikipedia.org/wiki/OpenID) - Wikipedia - The federated-identity protocol underlying the `openid` IFI, with discussion of why it lets you identify a learner without operating an identity service yourself.

3. [Pseudonymization](https://en.wikipedia.org/wiki/Pseudonymization) - Wikipedia - Privacy technique relevant to the `account` IFI strategy — how a project-scoped opaque identifier protects PII while still enabling per-learner analytics.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - The agent and activity chapters work through all four IFIs with worked examples and the pitfalls of mixing them within a single learner record.

5. The xAPI Companion - Megan Bowe & Aaron Silvers - HT2 Labs - Includes design exercises on activity IRI structure, registration use, and the boundary between `revision` and `platform` context fields that this chapter unpacks.

6. [xAPI-Spec — Agent and Activity Definitions](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#agent) - ADL Net - The authoritative spec for actor, group, agent IFIs, activity IRIs, and activity types — the precise rules consumers rely on for identity matching.

7. [FERPA Overview](https://studentprivacy.ed.gov/ferpa) - U.S. Department of Education - Government-published overview of the Family Educational Rights and Privacy Act, the regulation that constrains how K-12 and higher-ed deployments may use the four IFIs.

8. [Mailto URI Scheme (RFC 6068)](https://www.rfc-editor.org/rfc/rfc6068) - IETF - The exact specification for the `mailto:` URIs used by the `mbox` IFI — useful for understanding why `mbox` values must be lowercased and have no extra whitespace.

9. [xAPI.com — Identifying Agents](https://xapi.com/agents/) - Rustici Software - Practitioner-friendly guide to choosing among the four IFIs, with concrete recommendations for K-12, higher ed, and corporate deployments.

10. [Yet Analytics Blog — Identity in xAPI](https://www.yetanalytics.com/blog) - Yet Analytics - Industry articles on registration semantics, multi-device identity, and the operational consequences of changing IFI strategy mid-deployment.
