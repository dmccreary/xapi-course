// Conformance Validation Pipeline — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Analyze (L4) — trace conformance layers and which layer catches what

const layerInfo = {
    Comp: {
        tag: 'Source',
        color: '#1e293b',
        title: 'Component emits statement',
        body: `<p>The application code calls into the xAPI client. At this
            point, the statement object lives in memory only — no validation
            has happened yet, and a buggy builder can produce anything.</p>
            <p><b>Caught here:</b> nothing.</p>
            <p><b>Common bugs that escape:</b> wrong field names, missing
            verb IRI, stringified objects.</p>`
    },
    LocalV: {
        tag: 'Layer 1: Local',
        color: '#ca8a04',
        title: 'Local validator (in the client)',
        body: `<p>A schema check before the statement goes on the wire.
            Catches structural and type bugs immediately.</p>
            <p><b>Catches:</b></p>
            <ul style="margin-left:18px">
              <li>Missing required fields (actor, verb, object)</li>
              <li>Wrong types (string where object is required)</li>
              <li>Malformed IRIs and IFIs</li>
            </ul>
            <p><b>Misses:</b> semantic bugs — the statement is well-formed
            but means the wrong thing.</p>`
    },
    Trans: {
        title: 'Statement transmitted to LRS',
        tag: 'Transport',
        color: '#0d9488',
        body: `<p>HTTPS POST. The transport layer doesn't validate semantics
            but enforces auth, content-type, and xAPI version headers.</p>
            <p><b>Catches:</b> auth failures (401), missing
            <code>X-Experience-API-Version</code>.</p>`
    },
    LRSV: {
        tag: 'Layer 2: LRS',
        color: '#ca8a04',
        title: 'LRS validates and persists',
        body: `<p>The LRS does its own schema check (defense in depth).
            Even if your client's local validator is buggy, the LRS will
            still reject malformed statements with 4xx.</p>
            <p><b>Catches:</b> everything Layer 1 catches, plus
            cross-statement constraints (duplicate ids, time ordering).</p>
            <p><b>Misses:</b> still no semantic validation — there's no
            standard for "this verb is appropriate for this activity."</p>`
    },
    ADL: {
        tag: 'Layer 3: Audit',
        color: '#7c3aed',
        title: 'Periodic ADL conformance run',
        body: `<p>The official ADL test suite. Runs canonical scenarios
            against your LRS and asserts standard-compliant behavior.
            Heavyweight (hundreds of tests) — usually nightly, not
            on every commit.</p>
            <p><b>Catches:</b> deviations from the xAPI spec —
            edge cases in pagination, voiding, statement-id conflicts.</p>
            <p><b>Misses:</b> bugs in your specific application.</p>`
    },
    E2E: {
        tag: 'Layer 4: Audit',
        color: '#7c3aed',
        title: 'End-to-end smoke test',
        body: `<p>Synthetic emit → LRS → query → assert. Covers the bits
            of <i>your</i> stack the standard test suite doesn't know
            about: your verb vocabulary, your activity IRIs, your
            dashboard queries.</p>
            <pre>// pseudocode
client.emit(syntheticStmt);
sleep(2);
const found = lrs.query(syntheticStmt.id);
assert.deepEqual(found.verb.id, syntheticStmt.verb.id);</pre>`
    },
    CI: {
        tag: 'Gate',
        color: '#16a34a',
        title: 'CI pipeline gates merges',
        body: `<p>Wire the conformance + smoke suites into your CI so a
            failing test blocks merges. Without this, regressions slip
            in between nightly runs.</p>
            <p><b>Cadence:</b></p>
            <ul style="margin-left:18px">
              <li>Local + LRS validators: per-PR (fast)</li>
              <li>Smoke test: per-PR (medium)</li>
              <li>ADL conformance: nightly (slow)</li>
            </ul>`
    }
};

function showLayer(key) {
    const data = layerInfo[key];
    if (!data) return;
    const tagHtml = data.tag
        ? `<span class="layer-tag" style="background:${data.color || '#1e293b'}">${data.tag}</span>`
        : '';
    document.getElementById('info-display').innerHTML =
        `${tagHtml}
         <div class="info-title">${data.title}</div>
         <div class="info-content">${data.body}</div>`;
}

window.showLayer = showLayer;
