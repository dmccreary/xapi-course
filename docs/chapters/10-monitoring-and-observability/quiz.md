# Quiz: Monitoring, Observability, and xAPI Traffic Analysis

Test your understanding of browser DevTools, proxy tools, LRS request logs, dashboards, and engagement metrics with these review questions.

---

#### 1. Which tool is described as "the cheapest and most underused observability tool in xAPI development"?

<div class="upper-alpha" markdown>
1. mitmproxy
2. Charles Proxy
3. Browser DevTools Network panel
4. Grafana
</div>

??? question "Show Answer"
    The correct answer is **C**. The browser DevTools Network panel ships with every modern browser, requires no installation, and shows every HTTP request the page makes — including every xAPI POST. Filtering by `method:POST domain:lrs.example.org` produces an instant view of all emit traffic. Charles and mitmproxy are more flexible but require setup. Grafana is a synthesis layer, not a per-request inspection tool.

    **Concept Tested:** Browser DevTools Network Panel

---

#### 2. The chapter recommends keeping DevTools throttled to which preset during normal development, to catch bandwidth bugs early?

<div class="upper-alpha" markdown>
1. Slow 3G
2. Fast 3G
3. Offline
4. No throttling on a fiber connection
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter explicitly suggests keeping DevTools throttled to Fast 3G (~1.6 Mbps down, 562ms latency) during normal development. That way, you'll never accidentally ship code that depends on gigabit speed. Slow 3G is useful for stress-testing retry logic but is too slow for daily work. Offline is for testing the offline queue specifically. No throttling masks real-world performance issues.

    **Concept Tested:** Network Throttling Simulation

---

#### 3. A team needs to script a repeatable failure-injection test: every third request to the LRS returns a 503. Which tool is the best fit?

<div class="upper-alpha" markdown>
1. Charles Proxy
2. mitmproxy
3. Browser DevTools alone
4. Grafana
</div>

??? question "Show Answer"
    The correct answer is **B**. mitmproxy is the open-source command-line equivalent with a Python scripting layer for programmable interception rules — exactly what's needed for repeatable failure-injection in CI. Charles is great for quick interactive debugging but harder to script. DevTools cannot rewrite responses or inject failures. Grafana is a dashboard tool, not a traffic interceptor. The chapter's table positions mitmproxy as "for repeatable scripted tests."

    **Concept Tested:** mitmproxy / HTTP Intercept

---

#### 4. According to the chapter, why must TLS-intercepting proxy tools (Charles, mitmproxy) only be used on systems you own?

<div class="upper-alpha" markdown>
1. They are illegal to install in any context
2. Intercepting TLS traffic on systems you don't own is a security violation regardless of intent
3. They permanently disable HTTPS on the device
4. They violate the xAPI 1.0.3 specification
</div>

??? question "Show Answer"
    The correct answer is **B**. Both tools require you to install a TLS certificate to intercept HTTPS — a step that's easy on a development machine and explicitly forbidden on production deployments. The chapter is clear: intercepting TLS traffic on systems you don't own is a security violation regardless of intent. The other options are factually wrong: the tools are legal in personal/owned-system contexts; they don't disable HTTPS permanently; the xAPI spec is silent on debugging tools.

    **Concept Tested:** Charles Proxy / mitmproxy

---

#### 5. Which dashboard tool is described as the operations-flavored choice with strong alerting integration and a large library of pre-built panels?

<div class="upper-alpha" markdown>
1. Observable Framework
2. Tableau
3. Splunk
4. Grafana
</div>

??? question "Show Answer"
    The correct answer is **D**. Grafana is the operations-flavored dashboarding tool, originally built for time-series metrics. Its strengths are an enormous library of pre-built panels, alerting integration, and operational maturity. Observable Framework excels at custom interactive visualizations but is less ops-centric. Tableau and Splunk are not in the chapter's recommended xAPI dashboard tools. The chapter's pragmatic recommendation is to use both Grafana (ops) and Observable (educators).

    **Concept Tested:** Grafana Dashboard

---

#### 6. A teacher's heatmap shows that section 3 of a chapter has 8 unique learners out of a 30-student cohort. What is the likely action signal?

<div class="upper-alpha" markdown>
1. The cohort is too small to draw conclusions
2. Section 3 is performing as expected; high engagement is a sign of confusion
3. 73% of the cohort never engaged with section 3 — investigate the content
4. The interaction count tells the analyst nothing without statement throughput
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter's worked example explicitly states that 8 of 30 learners reaching section 3 (73% missing) is a content signal the educator should investigate immediately — possibly boring, skipped, or confusing. The cohort size of 30 is large enough for actionable signal in a heatmap context. Statement throughput is an operator metric, not the relevant signal here. Confusion as a sign of high engagement is sometimes valid but doesn't apply here — the issue is low engagement.

    **Concept Tested:** Engagement Heatmap

---

#### 7. Which of the following questions can the LRS request logs answer that DevTools cannot?

<div class="upper-alpha" markdown>
1. The exact JSON sent in one specific POST
2. The connection setup time for a single request
3. Aggregate failure rates over time across all sessions
4. Whether the request was initiated by a click handler or a timer
</div>

??? question "Show Answer"
    The correct answer is **C**. LRS logs aggregate across all sessions over time, letting analysts spot trends in failure rates that DevTools (single-session only) cannot reveal. DevTools shows the exact JSON of any captured POST (option A is something DevTools does well). DevTools shows connection setup timing in the waterfall (option B). DevTools shows the JavaScript initiator (option D). The chapter explicitly lists aggregate failure rates over time as a query DevTools cannot answer.

    **Concept Tested:** LRS Request Logs

---

#### 8. The chapter distinguishes "instrumentation" from "learning analytics." Which statement best captures the distinction?

<div class="upper-alpha" markdown>
1. Instrumentation is the data layer; learning analytics is what you do with the data
2. They are synonyms in the xAPI ecosystem
3. Learning analytics replaces instrumentation in modern systems
4. Instrumentation is for educators; learning analytics is for engineers
</div>

??? question "Show Answer"
    The correct answer is **A**. The chapter is explicit: xAPI is the data layer (instrumentation); learning analytics is what you do with the data — engagement, completion, mastery, equity questions. Many teams confuse "we have xAPI" with "we have analytics." They are different skill sets. The other options misframe the relationship — they are not synonyms, neither replaces the other, and the audiences overlap.

    **Concept Tested:** Learning Analytics Overview

---

#### 9. A statement is emitted, the LRS returns 200, but the dashboard shows incorrect numbers. Following the three-flavor debugging playbook, what should the engineer do first?

<div class="upper-alpha" markdown>
1. Roll back the most recent code deploy
2. Check the browser console for client-side errors
3. Check the LRS query the dashboard runs and run it manually against the LRS
4. Restart the LRS process
</div>

??? question "Show Answer"
    The correct answer is **C**. Per the playbook for "statements accepted but dashboard wrong": check the LRS query the dashboard runs, then run it manually against the LRS. If the LRS returns the right data, the bug is in the dashboard. If wrong, the bug is in the query or the statements. Rolling back deploys is a heavy hammer for a localized bug. Browser console issues would prevent emit, not produce wrong dashboard numbers. Restarting the LRS doesn't fix incorrect data.

    **Concept Tested:** xAPI Debugging Techniques

---

#### 10. An operator dashboard's "primary signal" — the metric most likely to surface problems before users notice — is what?

<div class="upper-alpha" markdown>
1. Statement throughput broken down by credential, verb, and status
2. Total cumulative statements stored in the LRS
3. The number of distinct verbs in the registry
4. The size of the engagement heatmap
</div>

??? question "Show Answer"
    The correct answer is **A**. Statement throughput is the operator's primary signal: statements per second, broken down by credential, verb, and status. A sudden drop often precedes user-visible failure by minutes — a token expired, a service worker bug shipped, a regional CDN issue. Cumulative storage is an inventory metric, not a real-time health signal. Distinct verb count rarely changes. Heatmap size is for educators, not operators.

    **Concept Tested:** Statement Throughput / Real-Time Dashboard

---
