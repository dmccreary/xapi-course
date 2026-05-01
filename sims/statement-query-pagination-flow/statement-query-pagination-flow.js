// Statement Query and Pagination Flow MicroSim
// CANVAS_HEIGHT: 560
// Bloom: Apply (L3) — trace, identify
// Pattern: click-to-reveal step infobox with TypeScript snippet

const stepInfo = {
    Build: {
        title: 'Build initial GET',
        kind: 'action',
        body: `
            <p>The client constructs the first request to <code>/xAPI/statements</code> with whatever filters narrow the result set: <code>verb</code>, <code>activity</code>, <code>since</code>, <code>agent</code>, <code>limit</code>, and so on.</p>
            <p>Filters live in the query string. The LRS will apply them to the full statement store before paginating.</p>
            <p><b>Snippet:</b></p>
            <pre><code>const url = \`\${LRS}/statements?verb=\${encodeURIComponent(VERB_PASSED)}&since=\${iso}\`;</code></pre>`
    },
    SendInitial: {
        title: 'Send GET /xAPI/statements?...',
        kind: 'action',
        body: `
            <p>Issue the first HTTP <code>GET</code> with the auth header and xAPI version header. The LRS responds with a <b>StatementResult</b> object: <code>{ statements: [...], more: "..." }</code>.</p>
            <p>The <code>more</code> field is either an empty string (you have everything) or a relative URL pointing to the next page.</p>
            <p><b>Snippet:</b></p>
            <pre><code>let res = await fetch(url, { headers: { 'X-Experience-API-Version': '1.0.3', Authorization } });</code></pre>`
    },
    Decision: {
        title: 'Response has non-empty more URL?',
        kind: 'decision',
        body: `
            <p>This is the central control-flow question of every paginated xAPI client. The LRS signals "there is more" by returning a non-empty <code>more</code> string. An empty string means the result set is exhausted.</p>
            <p><b>Note:</b> <code>more</code> is empty <i>string</i> when done — not <code>null</code>, not missing. A truthiness check (<code>if (data.more)</code>) works because <code>""</code> is falsy, but be explicit if your linter complains.</p>
            <p><b>Snippet:</b></p>
            <pre><code>while (data.more && data.more.length > 0) { /* keep going */ }</code></pre>`
    },
    Process: {
        title: 'Process statements array',
        kind: 'action',
        body: `
            <p>Iterate the <code>statements</code> array on the current page. Validate, transform, or stash each statement before fetching the next page — pages can be large and you don't want to hold them all in memory.</p>
            <p>This is also where you typically hand statements off to the dashboard, an aggregation pipeline, or a downstream queue (see the side branch).</p>
            <p><b>Snippet:</b></p>
            <pre><code>for (const stmt of data.statements) { dashboard.ingest(stmt); }</code></pre>`
    },
    SendMore: {
        title: 'Send GET <more URL>',
        kind: 'action',
        body: `
            <p>The <code>more</code> URL is <b>relative to the LRS endpoint</b>, not absolute. Resolve it against your base URL, then GET it. Carry forward the same auth and version headers.</p>
            <p><b>Note:</b> <code>more</code> URLs are opaque — do not parse, edit, or "improve" them. The LRS encodes its pagination cursor inside, and editing breaks the cursor silently.</p>
            <p><b>Snippet:</b></p>
            <pre><code>res = await fetch(new URL(data.more, LRS), { headers });</code></pre>`
    },
    Done: {
        title: 'Done — all results retrieved',
        kind: 'terminal',
        body: `
            <p>Empty <code>more</code> means the LRS has no further pages for this query. Your client has the complete (filtered) result set.</p>
            <p>Now — and only now — is it safe to compute totals, render dashboards, or trigger any "complete" downstream effect that depends on having all the data.</p>
            <p><b>Snippet:</b></p>
            <pre><code>return allStatements; // safe: pagination loop terminated</code></pre>`
    },
    Handoff: {
        title: 'Hand off to dashboard / aggregation',
        kind: 'sidebranch',
        body: `
            <p>This is a <i>side branch</i>, not part of the loop. As each page is processed, statements typically flow out to a dashboard, an analytics pipeline, a data warehouse, or an LRP (Learning Record Provider) downstream of the LRS.</p>
            <p>Streaming statements page-by-page (rather than waiting for the loop to finish) keeps the UI responsive and lets large queries surface partial results immediately.</p>
            <p><b>Snippet:</b></p>
            <pre><code>analytics.publish('statements.page', data.statements);</code></pre>`
    }
};

function showStep(name) {
    const info = stepInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    let badge = '';
    if (info.kind === 'action') {
        badge = '<span class="info-required req-action">ACTION</span>';
    } else if (info.kind === 'decision') {
        badge = '<span class="info-required req-decision">DECISION</span>';
    } else if (info.kind === 'terminal') {
        badge = '<span class="info-required req-terminal">DONE</span>';
    } else if (info.kind === 'sidebranch') {
        badge = '<span class="info-required req-side">SIDE BRANCH</span>';
    }
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${badge}
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Eat-our-own-dog-food: every click emits an xAPI 'interacted' statement
// to a configured LRS (window.XAPI_LRS). No-op if not configured.
function emitInteractedStatement(stepName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/statement-query-pagination-flow#' + stepName,
            definition: {
                name: { 'en-US': 'Pagination flow step: ' + stepName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow */ }
}

// Hover hints — short one-liners shown as native SVG <title> tooltips.
const hoverHints = {
    Build: 'Construct the initial query URL with filters',
    SendInitial: 'Send the first HTTP GET to /xAPI/statements',
    Decision: 'Is the more URL non-empty? Loop or stop',
    Process: 'Iterate the current page of statements',
    SendMore: 'Fetch the next page using the more URL',
    Done: 'Empty more — pagination is complete',
    Handoff: 'Side branch — emit pages to the dashboard'
};

function setupHoverHints() {
    document.querySelectorAll('.node').forEach(node => {
        const id = node.id.replace('flowchart-', '').split('-')[0];
        if (hoverHints[id]) {
            const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            titleEl.textContent = hoverHints[id];
            node.appendChild(titleEl);
        }
    });
}

function waitForMermaid() {
    const svg = document.querySelector('.mermaid svg');
    const nodes = document.querySelectorAll('.node');
    if (svg && nodes.length > 0) {
        setupHoverHints();
    } else {
        setTimeout(waitForMermaid, 100);
    }
}

// Expose globally so Mermaid `click ... call showStep(...)` can resolve it.
window.showStep = showStep;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
