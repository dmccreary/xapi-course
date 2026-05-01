# References: LRS Platforms, Authentication, and Hosting Models

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
