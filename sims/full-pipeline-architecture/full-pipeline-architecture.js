// Full Pipeline Architecture — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Analyze (L4) — trace a learner interaction across all pipeline layers

const nodeInfo = {
    Comp: {
        tag: 'Layer 1: Browser',
        color: '#1e293b',
        title: 'Component',
        chapter: 'Ch 8: Implementing in Textbooks',
        latency: '< 1ms (in-memory)',
        tooling: 'JS module wrapping the chapter widget',
        failure: 'Forgets to call <code>send()</code> on key interactions',
        body: `<p>The widget that the learner interacts with — a MicroSim,
            quiz, slider, or anchor reveal. Its only xAPI job: build a
            statement and hand it to the client library.</p>`
    },
    Client: {
        tag: 'Layer 1: Browser',
        color: '#1e293b',
        title: 'Client Library',
        chapter: 'Ch 8: Implementing in Textbooks',
        latency: '< 5ms (validation + serialize)',
        tooling: 'Custom wrapper around <code>fetch</code>, or TinCanJS',
        failure: 'Builds malformed statements that the LRS later rejects',
        body: `<p>Wraps the network. Hides offline state from the
            component. Validates the statement against the local schema
            before transmit.</p>`
    },
    Queue: {
        tag: 'Layer 1: Browser',
        color: '#1e293b',
        title: 'Offline Queue',
        chapter: 'Ch 9: Bandwidth & Offline',
        latency: '5–50ms (IndexedDB write)',
        tooling: 'IndexedDB + service worker',
        failure: 'Queue grows unbounded if flush logic is broken',
        body: `<p>Persists statements while offline so no learning event
            is lost. Replays them when connectivity returns.</p>`
    },
    Endpoint: {
        tag: 'Layer 2: LRS',
        color: '#dc2626',
        title: 'Statement Endpoint',
        chapter: 'Ch 6: LRS Architecture',
        latency: '100–500ms (over network)',
        tooling: 'Learning Locker / SQL LRS / Watershed',
        failure: 'Network drop → client retries via queue',
        body: `<p>The HTTPS POST target. Authenticates, schema-validates,
            and acknowledges receipt. The boundary between the learner's
            device and the server side.</p>`
    },
    Storage: {
        tag: 'Layer 2: LRS',
        color: '#dc2626',
        title: 'Storage',
        chapter: 'Ch 6: LRS Architecture',
        latency: '10–100ms (insert)',
        tooling: 'PostgreSQL / MongoDB / DynamoDB',
        failure: 'Disk fills; replica lag introduces stale reads',
        body: `<p>The system of record. Statements are immutable once
            stored — voiding is a separate statement, not a delete.</p>`
    },
    QueryAPI: {
        tag: 'Layer 2: LRS',
        color: '#dc2626',
        title: 'Query API',
        chapter: 'Ch 6: LRS Architecture',
        latency: '50–500ms per query',
        tooling: '<code>GET /xapi/statements?...</code>',
        failure: 'Unindexed filters cause O(n) scans → timeout',
        body: `<p>Read-side of the LRS. Used for ad-hoc lookups and by
            the dashboard layer when statements are queried directly
            instead of via OLAP.</p>`
    },
    Stream: {
        tag: 'Layer 3: Analytics',
        color: '#7c3aed',
        title: 'Stream Processor',
        chapter: 'Ch 10: Monitoring & Observability',
        latency: 'seconds (consumer lag)',
        tooling: 'Kafka + Flink, or scheduled batch SQL',
        failure: 'Consumer lag if stream processor falls behind',
        body: `<p>Reduces raw statements to time-bucketed metrics.
            Aggregations like "avg attempts per quiz per cohort per
            day" live here.</p>`
    },
    OLAP: {
        tag: 'Layer 3: Analytics',
        color: '#7c3aed',
        title: 'OLAP Aggregate Store',
        chapter: 'Ch 10: Monitoring & Observability',
        latency: 'seconds-to-minutes (refresh)',
        tooling: 'ClickHouse / DuckDB / BigQuery',
        failure: 'Aggregation bug double-counts statements',
        body: `<p>Query-optimized rollups. Dashboards read from here
            for sub-second response, not from the LRS directly.</p>`
    },
    Dash: {
        tag: 'Layer 4: Dashboard',
        color: '#16a34a',
        title: 'Dashboard (Grafana / Observable)',
        chapter: 'Ch 10: Monitoring & Observability',
        latency: 'milliseconds per panel render',
        tooling: 'Grafana for ops; Observable for educators',
        failure: 'Query timeout when an unindexed dimension is added',
        body: `<p>The end of the pipeline — what humans actually see.
            Operators get health metrics; teachers get engagement and
            outcomes.</p>`
    }
};

function showNode(key) {
    const data = nodeInfo[key];
    if (!data) return;
    const meta = `
        <div class="meta-row"><span class="lbl">Chapter:</span><span class="val">${data.chapter}</span></div>
        <div class="meta-row"><span class="lbl">Latency:</span><span class="val">${data.latency}</span></div>
        <div class="meta-row"><span class="lbl">Tooling:</span><span class="val">${data.tooling}</span></div>
        <div class="meta-row"><span class="lbl">Failure:</span><span class="val">${data.failure}</span></div>
    `;
    document.getElementById('info-display').innerHTML =
        `<span class="layer-tag" style="background:${data.color}">${data.tag}</span>
         <div class="info-title">${data.title}</div>
         ${meta}
         <div class="info-content">${data.body}</div>`;
}

window.showNode = showNode;
