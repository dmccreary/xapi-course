# References: LRS Platforms, Authentication, and Hosting Models

1. [OAuth](https://en.wikipedia.org/wiki/OAuth) - Wikipedia - Coverage of OAuth 1.0a (which xAPI 1.0.3 references as a SHOULD-support) and OAuth 2.0, which most modern LRS deployments use in practice. Explains the trade-offs that drive auth-model choice.

2. [Basic Access Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) - Wikipedia - The minimum authentication mechanism every conformant LRS supports; explains why HTTPS is non-negotiable when Basic is in use, and what the `Authorization: Basic` header contains.

3. [Multitenancy](https://en.wikipedia.org/wiki/Multitenancy) - Wikipedia - The architectural pattern that determines whether a school district shares one LRS or runs an LRS per school. Critical background for evaluating hosted vs. self-hosted deployment models.

4. Designing Data-Intensive Applications - Martin Kleppmann - O'Reilly Media - The chapters on partitioning and access control map directly onto multi-tenant LRS isolation strategies, including the noisy-neighbor problems that bite shared deployments.

5. Building Secure and Reliable Systems - Heather Adkins, Betsy Beyer, Paul Blankinship, Piotr Lewandowski, Ana Oprea, Adam Stubblefield - O'Reilly Media (Google SRE) - Authoritative treatment of the access-control patterns and least-privilege principles that govern LRS credential management in production.

6. [Learning Locker Documentation](https://docs.learninglocker.net/) - HT2 Labs / Learning Pool - Reference docs for the most-deployed open-source LRS, including its multi-tenant client model, statement forwarder, and hosting topology guidance.

7. [TRAX LRS Documentation](https://traxlrs.com/docs/) - TRAX - Open-source PHP-based LRS with thorough docs on Basic Auth client setup, OAuth 2.0 access tokens, and the hosting models supported (Docker, bare-metal LAMP, hosted).

8. [Ralph LRS Documentation](https://openfun.github.io/ralph/) - France Université Numérique - Modern Python LRS with first-class OAuth 2.0 support and Helm charts for Kubernetes; the docs include a clear comparison of deployment topologies.

9. [Watershed Documentation](https://www.watershedlrs.com/help/) - Watershed - Hosted commercial LRS used widely in corporate L&D; the help center documents tenant isolation, SSO integrations, and authentication patterns at production scale.

10. [xAPI Spec — OAuth 1.0](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md#authdefinition) - ADL Initiative - The authoritative spec section on the auth methods conformant LRSs must support, including the canonical OAuth 1.0a flow and Basic Auth requirements referenced throughout this chapter.
