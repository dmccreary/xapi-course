# References: Monitoring, Observability, and xAPI Traffic Analysis

<<<<<<< HEAD
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
=======
1. [Observability (software)](https://en.wikipedia.org/wiki/Observability_(software)) - Wikipedia - The three-pillar model (metrics, logs, traces) that grounds every dashboard this chapter teaches you to build for xAPI traffic. Foundational vocabulary for the whole observability stack.

2. [HTTP Archive (HAR)](https://en.wikipedia.org/wiki/HAR_(file_format)) - Wikipedia - The JSON format browser DevTools exports for captured network sessions; xAPI traffic surfaces cleanly in HAR files and the format is what you'll feed to most analysis scripts.

3. [Network throttling](https://en.wikipedia.org/wiki/Bandwidth_throttling) - Wikipedia - Background on the bandwidth and latency simulation DevTools and Charles Proxy use to reproduce 3G/4G conditions when stress-testing a textbook's xAPI emission.

4. High Performance Browser Networking - Ilya Grigorik - O'Reilly Media - Diagnostic chapters on identifying the root cause of slow requests — TCP handshake, TLS, server processing, transfer — translate directly to interpreting an LRS waterfall.

5. Distributed Systems Observability - Cindy Sridharan - O'Reilly Media - Concise treatment of the observability mindset; the patterns translate cleanly to xAPI even though the book targets backend systems.

6. [Chrome DevTools Network Reference](https://developer.chrome.com/docs/devtools/network) - Google Chrome Developers - Authoritative reference for filtering, replaying, and exporting xAPI POST traffic from the Network panel. The first tool every textbook author should master.

7. [mitmproxy Documentation](https://docs.mitmproxy.org/stable/) - mitmproxy Project - The open-source HTTPS intercepting proxy this chapter uses for off-browser xAPI capture. Includes scripting hooks for automated statement validation in test rigs.

8. [Charles Proxy Documentation](https://www.charlesproxy.com/documentation/) - XK72 / Charles - Commercial GUI proxy with first-class HTTPS interception and bandwidth-throttling presets. The friendlier alternative to mitmproxy for one-off debugging.

9. [Observable Framework](https://observablehq.com/framework/) - Observable - Modern static-site generator for data dashboards; this chapter's example real-time engagement dashboard uses it to render xAPI throughput and verb-mix charts.

10. [Grafana Documentation](https://grafana.com/docs/grafana/latest/) - Grafana Labs - The de-facto operational dashboard tool; pairs with Prometheus or InfluxDB to chart LRS request rates, error rates, and latency percentiles in production.
>>>>>>> d2ecc9b (iframe updates)
