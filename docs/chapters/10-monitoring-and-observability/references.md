# References: Monitoring, Observability, and xAPI Traffic Analysis

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
