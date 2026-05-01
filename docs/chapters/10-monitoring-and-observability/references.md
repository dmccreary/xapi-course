# References: Monitoring, Observability, and xAPI Traffic Analysis

1. [Observability (software)](https://en.wikipedia.org/wiki/Observability_(software)) - Wikipedia - Definition of observability versus monitoring, covering the three signals (metrics, logs, traces) that an xAPI deployment should expose at every pipeline layer.

2. [Service Level Objective](https://en.wikipedia.org/wiki/Service-level_objective) - Wikipedia - Background on SLOs and SLIs — the framework for setting target latency and error rates that operator dashboards measure against.

3. [Grafana](https://en.wikipedia.org/wiki/Grafana) - Wikipedia - Overview of the dashboard tool most commonly used for operator-facing xAPI metrics, including its data-source ecosystem.

4. Site Reliability Engineering - Betsy Beyer, Chris Jones, Jennifer Petoff & Niall Richard Murphy - O'Reilly / Google - The canonical reference on service monitoring; chapters on the four golden signals and SLO design apply directly to LRS operations.

5. Observability Engineering - Charity Majors, Liz Fong-Jones & George Miranda - O'Reilly - Modern treatment of high-cardinality observability, useful for understanding why per-learner xAPI metrics need careful aggregation strategy.

6. [Chrome DevTools Network Panel](https://developer.chrome.com/docs/devtools/network/) - Google Chrome Developers - Reference for inspecting xAPI request/response pairs in the browser, with filters and import/export workflows useful for sharing repro cases.

7. [mitmproxy Documentation](https://docs.mitmproxy.org/stable/) - mitmproxy project - Open-source HTTPS intercepting proxy for inspecting and rewriting xAPI traffic in flight, with Python scripting hooks for custom analysis.

8. [Charles Proxy](https://www.charlesproxy.com/documentation/) - Karl von Randow - Commercial HTTP proxy widely used for mobile xAPI debugging, including SSL pinning workarounds for inspecting native-app traffic.

9. [Observable Framework](https://observablehq.com/framework/) - Observable Inc. - Static-dashboard framework well-suited to educator-facing engagement reporting; complements Grafana's operator-first model.

10. [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/) - Prometheus / CNCF - Time-series monitoring system commonly used for collecting LRS health metrics; the query language `PromQL` is essential for building operator dashboards.
