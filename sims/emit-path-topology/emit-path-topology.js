// Emit-Path Topology — Client / Server / Hybrid xAPI emission MicroSim
// CANVAS_HEIGHT: 460
// Bloom: Analyze (L4) — compare topologies, identify which events go where
// Pattern: click-to-reveal infobox describing each node's role, examples,
// and security implications across three side-by-side topology subgraphs.

const nodeInfo = {
    // ── Client-side topology ────────────────────────────────────────────────
    CB: {
        title: 'Client-side: Browser',
        path: 'client',
        body: `
            <p>The learner's browser (or mobile app) builds an xAPI statement
            in JavaScript and POSTs it directly to the LRS using a short-lived
            credential.</p>
            <p><b>Latency:</b> very low — no server hop.</p>
            <p><b>Trust:</b> low — the user can open DevTools and edit the
            payload before it leaves the page.</p>
            <p><b>Best for:</b> hover, scroll, time-on-page, MicroSim
            interactions, navigation events, completion of ungraded reading.</p>`
    },
    CL: {
        title: 'Client-side: LRS',
        path: 'client',
        body: `
            <p>The Learning Record Store receives the statement directly from
            the browser. The LRS authenticates the request using whatever
            credential the page was given (typically a scoped OAuth token).</p>
            <p><b>Footgun:</b> any credential shipped to the browser is a
            credential the learner can read. Scope it tightly: write-only,
            limited to a specific actor, expiring in minutes — not days.</p>
            <p><b>Example statements that flow here:</b><br/>
            <code>experienced</code> a chapter, <code>interacted</code> with a
            MicroSim, <code>viewed</code> a video.</p>`
    },

    // ── Server-side topology ────────────────────────────────────────────────
    SB: {
        title: 'Server-side: Browser',
        path: 'server',
        body: `
            <p>The browser does <i>not</i> talk to the LRS. It POSTs a plain
            event ("Lin submitted answer X for question 12") to your own
            backend, which then constructs and signs the xAPI statement.</p>
            <p><b>Why bother with a hop?</b> The browser is untrusted. The
            backend can verify the answer, compute the score, and stamp the
            statement with an authority the learner cannot forge.</p>`
    },
    SS: {
        title: 'Server-side: Backend',
        path: 'server',
        body: `
            <p>Your application server receives the event, validates it,
            computes any derived fields (score, success, completion), and
            constructs the xAPI statement with its own LRS credentials.</p>
            <p><b>Trust:</b> high — the credential never reaches the client,
            and the backend can refuse to emit a statement that doesn't match
            its own record of what happened.</p>
            <p><b>Latency:</b> higher — every emission costs a server hop.
            Acceptable for low-frequency, high-stakes events.</p>`
    },
    SL: {
        title: 'Server-side: LRS',
        path: 'server',
        body: `
            <p>The LRS receives statements only from your backend. The
            statement's <code>authority</code> field reflects your backend's
            credential, so downstream consumers know this record is
            authoritative — not learner-generated.</p>
            <p><b>Example statements that flow here:</b><br/>
            <code>passed</code>, <code>failed</code>, <code>scored</code>,
            <code>completed</code> with a graded outcome, certification
            issuance, exam attempt finalization.</p>`
    },

    // ── Hybrid topology ─────────────────────────────────────────────────────
    HB: {
        title: 'Hybrid: Browser',
        path: 'hybrid',
        body: `
            <p>The browser emits two kinds of events on two different paths:
            <b>analytics</b> events go straight to the LRS for low latency,
            and <b>graded</b> events go through the backend for trust.</p>
            <p>The same page can do both. A reading-completion ping is
            client-side; a quiz submission is server-side. The trick is
            deciding correctly which is which — when in doubt, route through
            the backend.</p>`
    },
    HS: {
        title: 'Hybrid: Backend',
        path: 'hybrid',
        body: `
            <p>The graded path. Receives high-stakes events from the browser,
            verifies them, and emits authoritative xAPI statements with the
            backend's own credentials.</p>
            <p><b>Rule of thumb:</b> if the statement could change a grade,
            issue a credential, or unlock content, it goes through here.</p>`
    },
    HL: {
        title: 'Hybrid: LRS',
        path: 'hybrid',
        body: `
            <p>One LRS, two writers. Statements arrive from both the browser
            (analytics) and the backend (grades). The <code>authority</code>
            field tells consumers which is which, so a dashboard can filter
            "show me only authoritative grade events" and trust the answer.</p>
            <p><b>This is the production default</b> for any system that
            mixes engagement analytics with grading. It is the topology this
            course recommends.</p>`
    }
};

const pathSummaries = {
    client: {
        label: 'Client-side path',
        color: '#0d9488',
        line: 'Low latency. Forgeable. Use for analytics — hovers, views, MicroSim interactions.'
    },
    server: {
        label: 'Server-side path',
        color: '#4338ca',
        line: 'Higher latency. Authoritative. Use for grades, completions, and credentials.'
    },
    hybrid: {
        label: 'Hybrid path (recommended)',
        color: '#be185d',
        line: 'Mix and match: analytics straight to LRS, graded events through the backend. Production default.'
    }
};

function showNodeInfo(name) {
    const info = nodeInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    const meta = pathSummaries[info.path];
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        <div class="info-pathtag" style="background:${meta.color}">${meta.label}</div>
        <div class="info-pathline">${meta.line}</div>
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Eat our own dog food: emit an xAPI 'interacted' statement when the reader
// clicks a node, so the textbook teaches the standard *with* the standard.
function emitInteractedStatement(nodeName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/emit-path-topology#' + nodeName,
            definition: {
                name: { 'en-US': 'Emit-path topology node: ' + nodeName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow */ }
}

// Hover hints — quick one-liner per node in addition to the click infobox.
const hoverHints = {
    CB: 'Browser POSTs straight to LRS — fast but forgeable',
    CL: 'LRS receives client-signed statements (analytics)',
    SB: 'Browser POSTs to your backend — not the LRS',
    SS: 'Backend builds and signs the xAPI statement',
    SL: 'LRS receives backend-signed statements (authoritative)',
    HB: 'Browser splits traffic: analytics vs graded',
    HS: 'Backend handles the graded path only',
    HL: 'One LRS receives both client and server writes'
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

// Expose globally so Mermaid `click ... call showNodeInfo(...)` resolves.
window.showNodeInfo = showNodeInfo;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
