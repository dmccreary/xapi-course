// Load Testing Pipeline — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Analyze (L4) — trace flow of a load test from generation to report

const stepInfo = {
    Spec: {
        title: 'Cohort spec',
        body: `<p>Inputs to the test run: how many learners, how long the
            run is, and what archetype mix to model.</p>
            <pre>{ "size": 250,
  "duration_min": 45,
  "mix": { "fast": 0.20, "struggling": 0.30,
           "disengaged": 0.20, "relearner": 0.10,
           "mastery": 0.20 } }</pre>`
    },
    Gen: {
        title: 'Claude Code generation',
        body: `<p>An LLM-driven generator turns the spec into realistic xAPI
            statements per archetype. Use a deterministic seed so runs are
            reproducible.</p>
            <p><b>Tooling:</b> Claude API or any structured-output LLM, plus
            a thin Python/JS wrapper that streams output to a corpus file.</p>`
    },
    Corpus: {
        title: 'Synthetic statement corpus (JSON)',
        body: `<p>The generated dataset, stored as newline-delimited JSON
            (NDJSON) for streaming replay.</p>
            <pre>{"actor":...,"verb":...}
{"actor":...,"verb":...}
...</pre>
            <p>For load tests, sizes range from 10K (smoke) to 100M+ (peak).</p>`
    },
    Valid: {
        title: 'Conformance validator',
        body: `<p>Strip malformed statements before they reach the LRS.
            Catches generator drift early — if 0.1% of generated statements
            are bad, you'll otherwise see baked-in 4xx noise in your metrics.</p>
            <p><b>Tooling:</b> JSON Schema validator with the xAPI 1.0.3
            schema, or a CLI like <code>xapi-validate</code>.</p>`
    },
    Runner: {
        title: 'Load runner',
        body: `<p>Replays the corpus against the LRS at a configurable rate.
            Common shapes: constant TPS, ramp, spike, or session-modeled
            (mirrors real cohort timing).</p>
            <p><b>Tooling:</b> k6, Locust, or a homegrown async Python script
            using <code>httpx</code> with concurrency limits.</p>
            <pre>k6 run --vus 100 --rps 500 \\
   replay.js</pre>`
    },
    LRS: {
        title: 'LRS under test',
        body: `<p>The system you're trying to break. Run against a staging
            environment that mirrors prod — same shape, different data.</p>
            <p><b>Footgun:</b> running load tests against prod LRS will
            pollute real learner records. Always isolate.</p>`
    },
    Instr: {
        title: 'LRS instrumentation',
        body: `<p>Captures the response side: per-request latency, error
            class, and aggregate TPS. Should run as a sidecar or middleware
            so the runner doesn't have to compute these.</p>
            <p><b>Example metrics:</b></p>
            <ul style="margin-left:18px">
              <li><code>http_request_duration_seconds</code> (p50/p95/p99)</li>
              <li><code>http_requests_total{status="5xx"}</code></li>
              <li><code>statements_stored_per_second</code></li>
            </ul>`
    },
    TSDB: {
        title: 'Time-series metric store',
        body: `<p>Where the metrics live for the duration of the test (and a
            retention window after). Prometheus or InfluxDB are typical.</p>
            <p>Both load-runner metrics and dashboard-query metrics flow
            in here so you can correlate.</p>`
    },
    Dash: {
        title: 'Dashboard / report',
        body: `<p>The output. Compares observed metrics against the SLOs
            you set up front.</p>
            <p><b>Example pass-fail:</b></p>
            <ul style="margin-left:18px">
              <li>p95 store latency &lt; 200ms ✓</li>
              <li>5xx rate &lt; 0.1% ✓</li>
              <li>throughput at target ≥ 5000 stmts/sec ✗ (got 4200)</li>
            </ul>`
    },
    DashQ: {
        title: 'Periodic dashboard queries',
        body: `<p>Real LRS deployments are read-and-write. Realistic load
            tests should include the read side: dashboards polling the
            LRS for metrics on a schedule.</p>
            <p>Skipping this leg leads to write-only tests that pass while
            production crawls because dashboard queries saturate the same
            DB connection pool.</p>`
    }
};

function showStep(key) {
    const data = stepInfo[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML =
        `<div class="info-title">${data.title}</div>
         <div class="info-content">${data.body}</div>`;
}

window.showStep = showStep;
