// Real-Time Dashboard Stack — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Understand (L2) — identify each layer of an xAPI dashboard pipeline

const layerInfo = {
    LRS: {
        tag: 'Source',
        color: '#1e293b',
        title: 'LRS — statements + logs',
        body: `<p>The Learning Record Store is the source of truth. Every
            interaction the textbook emits ends up here as a JSON statement,
            plus the LRS itself produces operational logs.</p>
            <p><b>Data shape:</b> arrays of xAPI statement objects, plus
            request access logs.</p>
            <pre>{ "actor": {...},
  "verb":   {...},
  "object": {...},
  "stored": "2026-04-30T10:14Z" }</pre>`
    },
    Agg: {
        tag: 'Aggregation',
        color: '#0d9488',
        title: 'Streaming aggregator (or batched query)',
        body: `<p>This layer reduces millions of raw statements down to the
            small set of metrics that drive each panel. Two common shapes:
            streaming (Kafka/Flink) for sub-second updates, or scheduled
            batch queries for cheaper near-real-time.</p>
            <p><b>Output:</b> rolled-up time-bucketed counts and rates.</p>
            <pre>SELECT verb_id,
       COUNT(*) AS n,
       AVG(result_duration_s) AS avg_dur
FROM stmts
WHERE stored > NOW() - INTERVAL 5 MIN
GROUP BY verb_id;</pre>`
    },
    OpMet: {
        tag: 'Operator branch',
        color: '#dc2626',
        title: 'Operator metrics',
        body: `<p>What the on-call team watches. These are <i>health</i>
            metrics — they tell you whether the LRS is up, fast, and
            accepting traffic.</p>
            <ul style="margin-left:18px">
              <li><b>Throughput</b>: statements/sec stored</li>
              <li><b>Latency</b>: p50 / p95 / p99 store time</li>
              <li><b>Error rate</b>: 4xx and 5xx ratios</li>
            </ul>`
    },
    EdMet: {
        tag: 'Educator branch',
        color: '#4338ca',
        title: 'Educator metrics',
        body: `<p>What teachers and instructional designers care about.
            These are <i>learning</i> metrics — they tell you whether
            students are engaging and whether the content is working.</p>
            <ul style="margin-left:18px">
              <li><b>Engagement</b>: interactions per learner-session</li>
              <li><b>Completion</b>: % reaching end-of-chapter</li>
              <li><b>Attempts</b>: avg attempts per quiz question</li>
            </ul>`
    },
    Graf: {
        tag: 'Dashboard',
        color: '#ca8a04',
        title: 'Grafana',
        body: `<p>The de facto standard for operator dashboards. Pulls from
            Prometheus, Loki, or any time-series source. Designed for
            "is the system healthy right now?" views with alerting.</p>
            <p><b>Example panel:</b> a stacked line chart of <code>2xx</code>,
            <code>4xx</code>, <code>5xx</code> over the last 24 hours.</p>`
    },
    Obs: {
        tag: 'Dashboard',
        color: '#ca8a04',
        title: 'Observable Framework',
        body: `<p>A static-site dashboard tool optimized for narrative
            data presentation — better fit for educators than Grafana's
            metrics-first style.</p>
            <p><b>Example page:</b> a per-chapter engagement heatmap
            with annotations explaining what dark and light cells mean
            in plain language.</p>`
    },
    Ops: {
        tag: 'Consumer',
        color: '#16a34a',
        title: 'Operators',
        body: `<p>The on-call team. They want to know two things at a
            glance: is the LRS healthy, and if not, where does the
            problem live?</p>
            <p>Their dashboards should make a paged engineer productive in
            under 60 seconds.</p>`
    },
    Teach: {
        tag: 'Consumer',
        color: '#16a34a',
        title: 'Teachers / Instructional Designers',
        body: `<p>The audience for educator dashboards. They want to know
            which learners are stuck and which sections of the textbook
            are performing.</p>
            <p>Their dashboards should be readable without an engineering
            degree — labels, narrative, and concrete next actions.</p>`
    }
};

function showLayer(key) {
    const data = layerInfo[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML = `
        <span class="role-tag" style="background:${data.color}">${data.tag}</span>
        <div class="info-title">${data.title}</div>
        <div class="info-content">${data.body}</div>`;
}

window.showLayer = showLayer;
