# References: LRS Platforms, Authentication, and Hosting Models

<<<<<<< HEAD
1. [OAuth](https://en.wikipedia.org/wiki/OAuth) - Wikipedia - Detailed coverage of OAuth 1.0a (the authentication scheme xAPI 1.0.x specifies) and OAuth 2.0, including signature methods and the cryptographic differences that matter for LRS deployments.

2. [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) - Wikipedia - Background on the simplest authentication scheme most LRS deployments use, including its security limitations and why TLS is non-negotiable when it's in play.

3. [Multi-tenancy](https://en.wikipedia.org/wiki/Multitenancy) - Wikipedia - Architectural background relevant to LRS hosting models, including the trade-offs between shared-nothing isolation and shared-database multi-tenancy that shape LRS pricing and security.

4. xAPI: An Introduction - Megan Bowe & ADL contributors - Advanced Distributed Learning - LRS-platform chapters cover the practical differences between hosted, self-hosted, and embedded deployments with deployment-time checklists.

5. Web Application Hacker's Handbook (2nd Edition) - Dafydd Stuttard & Marcus Pinto - Wiley - Authoritative reference on web authentication failure modes; chapters on session management, token handling, and authorization apply directly to securing LRS endpoints.

6. [Learning Locker](https://learningpool.com/solutions/learning-record-store-lrs-learning-locker) - Learning Pool - Vendor-hosted LRS with extensive documentation on multi-tenant deployment patterns and OAuth 2.0 token management.

7. [Watershed LRS](https://www.watershedlrs.com/) - Watershed - Commercial LRS with public documentation on enterprise SSO integration, OAuth flows, and large-cohort access-control patterns.

8. [Ralph LRS Documentation](https://openfun.github.io/ralph/) - France Université Numérique - Open-source LRS documentation covering Basic and OIDC authentication, plus deployment guides for Kubernetes and bare-metal environments.

9. [SCORM Cloud](https://cloud.scorm.com/) - Rustici Software - Hosted LRS-as-a-service with developer documentation on credential rotation, scoped tokens, and statement-forwarding configurations.

10. [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - OWASP Foundation - Practical security guidance on credential storage, token expiration, and rate limiting that every LRS operator should follow.
=======
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
>>>>>>> d2ecc9b (iframe updates)
