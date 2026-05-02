# References: xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness

1. [Data pipeline](https://en.wikipedia.org/wiki/Pipeline_(computing)#Data_pipelines) - Wikipedia - The general pattern for moving data through a sequence of processing stages; xAPI pipelines (Activity Provider → LRS → analytics → dashboard) are a specialization of this pattern.

2. [Extract, transform, load](https://en.wikipedia.org/wiki/Extract,_transform,_load) - Wikipedia - The traditional batch model that xAPI's append-only event stream replaces; understanding ETL clarifies why xAPI's streaming model wins for high-frequency learner events.

3. [Site reliability engineering](https://en.wikipedia.org/wiki/Site_reliability_engineering) - Wikipedia - Google's discipline for running production systems; the SLI/SLO/error-budget framework directly informs the production-readiness review this chapter teaches.

4. Site Reliability Engineering: How Google Runs Production Systems - Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy (Editors) - O'Reilly Media - The canonical SRE book; the chapters on monitoring, alerting, and capacity planning translate directly to LRS production operations.

5. Designing Distributed Systems - Brendan Burns - O'Reilly Media - Patterns for the multi-tier xAPI pipeline architecture (sidecar, ambassador, leader-election) that this chapter assembles into a production deployment.

6. [xAPI Profile Specification](https://github.com/adlnet/xapi-profiles) - ADL Initiative - The authoritative spec for designing reusable vocabulary profiles, Statement Templates, and Patterns. The reference this chapter teaches you to author against.

7. [ADL xAPI Profile Server](https://profiles.adlnet.gov/) - ADL Initiative - The hosted profile server where community profiles are published; this chapter walks through registering a custom textbook profile here for cross-institutional reuse.

8. [Statement Forwarder Pattern](https://docs.learninglocker.net/statement-forwarding/) - Learning Locker - Documentation of the statement-forwarding feature that turns an LRS into a routing hub; central to the multi-tenant pipelines this chapter architects.

9. [Twelve-Factor App](https://12factor.net/) - Heroku / Adam Wiggins - The classic methodology for production-ready services. Every factor (config, logs, processes, disposability) applies to LRS deployments and is referenced in the production-readiness checklist.

10. [Prometheus Documentation](https://prometheus.io/docs/) - Prometheus / CNCF - The standard metrics-collection system that pairs with Grafana for LRS observability; the histogram and counter primitives are exactly what xAPI throughput dashboards need.
