// LRS Architecture Overview — clickable Mermaid MicroSim
// CANVAS_HEIGHT: 540
// Bloom: Understand (L2) — identify components, explain request flow
// Pattern: click-to-reveal infobox (no animation; learner-paced)

const componentInfo = {
    Client: {
        title: 'Client (Activity Provider)',
        kind: 'caller',
        body: `
            <p>The system on the <i>outside</i> of the LRS that emits or queries statements — a textbook page, a mobile app, an LMS, a simulation, or a server-side job.</p>
            <p><b>What xAPI cares about:</b> the client must send an <code>X-Experience-API-Version</code> header and authenticate (typically Basic Auth or OAuth) on every request.</p>
            <p><b>Example:</b> <code>POST /xAPI/statements</code> with a Bearer token and one JSON statement in the body.</p>`
    },
    API: {
        title: 'xAPI HTTP API Layer',
        kind: 'api',
        body: `
            <p>The front door of the LRS. Handles <b>authentication</b>, <b>version negotiation</b>, content-type validation, and routes requests to the five endpoints below.</p>
            <p><b>What xAPI cares about:</b> rejects requests missing <code>X-Experience-API-Version</code>, returns <code>409 Conflict</code> for duplicate statement IDs, and enforces conformance rules before anything touches storage.</p>
            <p><b>Example:</b> <code>GET /xAPI/about</code> returns the supported xAPI versions — the very first call most clients make.</p>`
    },
    Statements: {
        title: '/statements endpoint',
        kind: 'endpoint',
        body: `
            <p>The endpoint where the action lives. Accepts <code>POST</code> (write a new statement), <code>PUT</code> (write a statement with a known ID), <code>GET</code> (query), and <code>DELETE</code> via voiding.</p>
            <p><b>What xAPI cares about:</b> statements are <b>immutable</b> once stored. To "delete" one you must POST a voiding statement that references the original by ID.</p>
            <p><b>Example:</b> <code>GET /statements?verb=http://adlnet.gov/expapi/verbs/passed&since=2026-04-01T00:00:00Z</code></p>`
    },
    Agents: {
        title: '/agents endpoint',
        kind: 'endpoint',
        body: `
            <p>Returns a <b>Person object</b> describing a single Agent — useful when one learner has multiple identifiers (mbox, account, openid) that all resolve to the same person.</p>
            <p><b>What xAPI cares about:</b> the Agent must be identified by an <b>IFI</b> (Inverse Functional Identifier) — the LRS uses the IFI to merge equivalent identities.</p>
            <p><b>Example:</b> <code>GET /agents?agent={"mbox":"mailto:lin@example.edu"}</code></p>`
    },
    Activities: {
        title: '/activities endpoint',
        kind: 'endpoint',
        body: `
            <p>Returns the canonical <b>Activity Definition</b> (name, description, type, extensions) for a given activity IRI — the LRS merges definitions seen across many incoming statements.</p>
            <p><b>What xAPI cares about:</b> the activity is identified by its <code>id</code> (an IRI). Two statements with the same activity ID share a single canonical definition in the LRS.</p>
            <p><b>Example:</b> <code>GET /activities?activityId=http://textbook.example.org/chapters/quadratics</code></p>`
    },
    State: {
        title: '/activities/state endpoint',
        kind: 'endpoint',
        body: `
            <p>A <b>scratch space</b> for activity providers — store per-learner, per-activity, per-registration state documents (bookmarks, partial answers, last-viewed slide).</p>
            <p><b>What xAPI cares about:</b> state is <i>not</i> a statement. It is opaque key/value storage that the LRS does not parse, index, or analyze. Use it for resumable state, not analytics.</p>
            <p><b>Example:</b> <code>PUT /activities/state?stateId=bookmark&activityId=...&agent=...</code> with a JSON body.</p>`
    },
    About: {
        title: '/about endpoint',
        kind: 'endpoint',
        body: `
            <p>Returns the <b>versions</b> of the xAPI specification this LRS implements, plus optional extensions. The only endpoint that does not require authentication.</p>
            <p><b>What xAPI cares about:</b> clients call <code>/about</code> first to negotiate which version to send in <code>X-Experience-API-Version</code>.</p>
            <p><b>Example:</b> <code>GET /about</code> → <code>{ "version": ["1.0.3", "2.0.0"] }</code></p>`
    },
    Storage: {
        title: 'Storage Layer',
        kind: 'storage',
        body: `
            <p>Where the canonical bytes of every statement live. Backed by a <b>document store</b> (MongoDB, CouchDB), a <b>relational database</b> (PostgreSQL with JSONB), or a <b>hybrid</b> design — the spec is implementation-neutral.</p>
            <p><b>What xAPI cares about:</b> statements are immutable. The storage layer must guarantee that a stored statement is byte-for-byte retrievable by its UUID, forever.</p>
            <p><b>Example:</b> <code>POST /statements</code> writes the JSON document keyed by the statement's <code>id</code>.</p>`
    },
    Indexing: {
        title: 'Indexing Layer',
        kind: 'indexing',
        body: `
            <p>The <b>inverted indexes</b> that make <code>GET /statements</code> queries fast. At minimum: indexes on <code>actor</code>, <code>verb</code>, <code>object.id</code>, and <code>timestamp</code> — often also on <code>registration</code> and <code>contextActivities.parent</code>.</p>
            <p><b>What xAPI cares about:</b> filter parameters on <code>GET /statements</code> (e.g. <code>?verb=...&since=...&agent=...</code>) translate directly to index lookups. Without indexes, every query is a full scan.</p>
            <p><b>Example:</b> <code>GET /statements?agent={"mbox":"mailto:lin@example.edu"}&verb=...</code> hits the actor and verb indexes, then intersects.</p>`
    },
    PostFlow: {
        title: 'POST /statements — write path',
        kind: 'flow',
        body: `
            <p>A new statement flows through validation at the API layer, lands in the <b>Storage Layer</b> as the canonical record, <i>and</i> is pushed into the <b>Indexing Layer</b> so it becomes queryable.</p>
            <p><b>What xAPI cares about:</b> the LRS must return <code>200 OK</code> with the assigned UUID only after both writes succeed — otherwise queries could miss a statement that "exists."</p>
            <p><b>Example:</b> <code>POST /statements</code> with a complete Actor-Verb-Object body; the response carries the array of statement IDs.</p>`
    },
    GetFlow: {
        title: 'GET /statements — read path',
        kind: 'flow',
        body: `
            <p>A query first hits the <b>Indexing Layer</b> to resolve filters into a set of statement IDs, then reads the full JSON documents from the <b>Storage Layer</b>.</p>
            <p><b>What xAPI cares about:</b> the indexes are the only thing that makes <code>?since=&until=&verb=&agent=</code> queries return in milliseconds instead of minutes.</p>
            <p><b>Example:</b> <code>GET /statements?verb=...&since=...</code> returns a paginated <code>StatementResult</code> object.</p>`
    }
};

function showComponent(name) {
    const info = componentInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    let badge = '';
    const badgeMap = {
        caller: ['Caller', 'badge-caller'],
        api: ['API Layer', 'badge-api'],
        endpoint: ['Endpoint', 'badge-endpoint'],
        storage: ['Storage', 'badge-storage'],
        indexing: ['Indexing', 'badge-indexing'],
        flow: ['Request Flow', 'badge-flow']
    };
    if (info.kind && badgeMap[info.kind]) {
        const [label, cls] = badgeMap[info.kind];
        badge = `<span class="info-badge ${cls}">${label}</span>`;
    }
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${badge}
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Eat our own dog food: emit an xAPI 'interacted' statement when a node is
// clicked, if a global window.XAPI_LRS object is configured. Otherwise no-op.
function emitInteractedStatement(componentName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/lrs-architecture-overview#' + componentName,
            definition: {
                name: { 'en-US': 'LRS Architecture component: ' + componentName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

// Hover hints — short one-liner per node (in addition to the click infobox).
const hoverHints = {
    Client: 'The activity provider — emits and queries statements',
    API: 'Auth + version negotiation; the front door',
    Statements: 'POST/GET/PUT — where the action lives',
    Agents: 'Resolve a learner across multiple identifiers',
    Activities: 'Canonical definition for a given activity IRI',
    State: 'Per-learner scratch space (not analytics)',
    About: 'Version negotiation; no auth required',
    Storage: 'Document/Relational/Hybrid — immutable records',
    Indexing: 'Inverted indexes on actor, verb, object, timestamp',
    PostFlow: 'POST writes to Storage and Indexing',
    GetFlow: 'GET hits Indexing first, then Storage'
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

// Expose globally so Mermaid `click ... call showComponent(...)` can resolve it.
window.showComponent = showComponent;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
