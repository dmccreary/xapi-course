// Intelligent Textbook xAPI Architecture MicroSim
// CANVAS_HEIGHT: 700
// Bloom: Understand (L2) — identify, trace
// Pattern: click-to-reveal layered architecture (no animation; learner-paced)

const componentInfo = {
    Markdown: {
        title: 'Markdown Content (MkDocs Material)',
        layer: 'Content layer',
        body: `
            <p>The chapter prose, headings, admonitions, and embedded MicroSim iframes — all authored in Markdown and rendered by <b>MkDocs Material</b>.</p>
            <p>This layer is what the learner reads. It also <i>hosts</i> the interactive elements below: every MicroSim, quiz, and adaptive branch lives inside an iframe embedded by the Markdown page.</p>
            <p><b>Chapter section:</b> 8.1 — Embedding Interactive Content<br/>
            <b>Code reference:</b> <code>docs/chapters/&lt;n&gt;/index.md</code> with <code>&lt;iframe src="../../sims/&hellip;/main.html"&gt;</code></p>`
    },
    PageViews: {
        title: 'Page Views',
        layer: 'Component layer',
        body: `
            <p>The most universal source of xAPI events in a textbook: <b>which page</b> the learner opened, <b>how long</b> they stayed, and <b>how far</b> they scrolled. Every chapter page emits these signals — even pages with no MicroSim or quiz.</p>
            <p>Common verbs: <code>experienced</code> (page viewed), <code>progressed</code> (scroll depth milestones such as 25/50/75/100%), and <code>exited</code> with a <code>result.duration</code> in ISO 8601 format.</p>
            <p>Together these statements reconstruct the learner's reading path, flag pages that get abandoned early, and surface sections where attention drops off — none of which a MicroSim or quiz alone can tell you.</p>
            <p><b>Chapter section:</b> 8.2 — Page-Level Engagement Signals<br/>
            <b>Code reference:</b> <code>xapi.page.view(); xapi.page.scroll(depth); xapi.page.exit(duration)</code></p>`
    },
    MicroSim: {
        title: 'MicroSim',
        layer: 'Component layer',
        body: `
            <p>An interactive visualization rendered inside an iframe — p5.js, Mermaid, vis-network, Chart.js, etc. Each click, hover, or parameter change is a candidate xAPI event.</p>
            <p>MicroSims call the xAPI client library directly; they don't need to know the LRS endpoint or auth details.</p>
            <p><b>Chapter section:</b> 8.3 — Instrumenting MicroSims<br/>
            <b>Code reference:</b> <code>microsim.on('interact', e =&gt; xapi.send(e))</code></p>`
    },
    Quiz: {
        title: 'Quiz',
        layer: 'Component layer',
        body: `
            <p>End-of-section multiple-choice or short-answer questions. Each submission produces an xAPI <code>answered</code> statement; each completed quiz produces a <code>passed</code> or <code>failed</code> statement with a <code>result.score</code>.</p>
            <p>Quizzes are the easiest source of high-quality assessment data — the verb vocabulary is well-defined and the result schema is unambiguous.</p>
            <p><b>Chapter section:</b> 8.4 — Quiz Statements<br/>
            <b>Code reference:</b> <code>xapi.quiz.submit(quizId, answers)</code></p>`
    },
    Branching: {
        title: 'Adaptive Branching',
        layer: 'Component layer',
        body: `
            <p>Logic that decides what the learner sees next based on prior statements — skip a section if mastery is shown, route to remediation if a concept is missed.</p>
            <p>Adaptive branching both <b>reads</b> from the LRS (to query the learner's history) and <b>writes</b> to it (recording the path taken). It's the feedback loop that turns a textbook into a tutor.</p>
            <p><b>Chapter section:</b> 8.5 — Adaptive Pathways<br/>
            <b>Code reference:</b> <code>xapi.query({ actor, verb: 'mastered' })</code></p>`
    },
    ClientLib: {
        title: 'xAPI Client Library',
        layer: 'Client layer',
        body: `
            <p>The single entry point that components use to record learning events. Hides the messy details — actor identity, statement formatting, batching, retry, auth headers — behind a clean <code>send(statement)</code> API.</p>
            <p>Without this layer, every MicroSim would have to re-implement the same plumbing. Centralizing it means a textbook can swap LRS providers by changing one config object.</p>
            <p><b>Chapter section:</b> 8.6 — The Client Library<br/>
            <b>Code reference:</b> <code>const xapi = new XAPIClient(config)</code></p>`
    },
    Builder: {
        title: 'Statement Builder',
        layer: 'Client internals',
        body: `
            <p>Converts a partial event ("the learner clicked node Verb") into a fully-formed xAPI statement with actor, verb IRI, object IRI, timestamp, and context activities filled in.</p>
            <p>This is where the textbook's verb vocabulary is enforced — only registered verbs get a clean IRI; unknown verbs raise a warning at build time.</p>
            <p><b>Chapter section:</b> 8.7 — Building Valid Statements<br/>
            <b>Code reference:</b> <code>buildStatement(event, context)</code></p>`
    },
    Buffer: {
        title: 'Batch Buffer',
        layer: 'Client internals',
        body: `
            <p>Collects statements in memory (and in <code>localStorage</code>) and flushes them to the LRS in batches — typically every few seconds or when the buffer reaches a size threshold.</p>
            <p>Batching protects the LRS from a chatty client and keeps the textbook usable when the network blips. Statements survive a page reload because they're persisted before they're sent.</p>
            <p><b>Chapter section:</b> 8.8 — Batching and Offline Survival<br/>
            <b>Code reference:</b> <code>buffer.enqueue(stmt); buffer.flushIfReady()</code></p>`
    },
    Retry: {
        title: 'Retry Manager',
        layer: 'Client internals',
        body: `
            <p>Wraps each network POST with exponential backoff. A failed batch is retried with growing delays (1s, 2s, 4s, &hellip;) up to a cap, then escalated to an error queue the user can inspect.</p>
            <p>Retry-on-failure plus persistent buffering is what lets a learner work on an airplane and have all their statements arrive intact when they reconnect.</p>
            <p><b>Chapter section:</b> 8.9 — Resilient Delivery<br/>
            <b>Code reference:</b> <code>retry(fetchCall, { maxAttempts: 6 })</code></p>`
    },
    Auth: {
        title: 'Auth Header Manager',
        layer: 'Client internals',
        body: `
            <p>Attaches the right credentials to every LRS request — typically an HTTP Basic header for the textbook's machine credential, or an OAuth bearer token for per-learner identity.</p>
            <p>The auth manager also rotates tokens before they expire and refuses to send statements if no valid credential is present (rather than silently failing later).</p>
            <p><b>Chapter section:</b> 8.10 — Authentication and Identity<br/>
            <b>Code reference:</b> <code>headers.Authorization = auth.currentHeader()</code></p>`
    },
    Fetch: {
        title: 'Fetch API → LRS HTTP API',
        layer: 'Transport layer',
        body: `
            <p>The actual network call: a <code>POST</code> (or <code>PUT</code>) to <code>/statements</code> on the LRS, carrying a JSON array of statements with the auth header and the required <code>X-Experience-API-Version: 1.0.3</code> header.</p>
            <p>This is the only place the textbook talks to the outside world. Everything above this line is in-browser; everything below is on the LRS.</p>
            <p><b>Chapter section:</b> 8.11 — The Wire Format<br/>
            <b>Code reference:</b> <code>fetch(lrsUrl + '/statements', { method: 'POST', headers, body })</code></p>`
    },
    LRS: {
        title: 'LRS Storage',
        layer: 'Storage layer',
        body: `
            <p>The Learning Record Store — the durable backend that validates each incoming statement, assigns it a UUID and authority, and stores it in a queryable database.</p>
            <p>From here, dashboards, adaptive logic, and research tooling read the textbook's complete behavioral history. The LRS is what turns ephemeral clicks into a permanent record of learning.</p>
            <p><b>Chapter section:</b> 8.12 — Inside the LRS<br/>
            <b>Code reference:</b> <code>GET /statements?agent={...}&amp;verb={...}</code></p>`
    }
};

function showComponent(name) {
    const info = componentInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        <div class="info-layer">${info.layer}</div>
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Practice what we preach: emit an xAPI 'interacted' statement when the reader
// clicks a node. The endpoint is configured via window.XAPI_LRS if present;
// otherwise this is a no-op so the sim works standalone.
function emitInteractedStatement(componentName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/intelligent-textbook-xapi-architecture#' + componentName,
            definition: {
                name: { 'en-US': 'xAPI architecture component: ' + componentName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

// Hover hints: a one-liner native SVG <title> tooltip per node, in addition
// to the click-to-reveal infobox.
const hoverHints = {
    Markdown: 'The chapter page authored in Markdown — hosts every iframe',
    PageViews: 'Page view, time-on-page, and scroll depth — every chapter page emits these',
    MicroSim: 'Interactive visualization (p5.js, Mermaid, etc.)',
    Quiz: 'Multiple-choice and short-answer questions',
    Branching: 'Reads + writes the LRS to choose the next page',
    ClientLib: 'Single entry point — hides actor, batching, retry, auth',
    Builder: 'Turns events into fully-formed xAPI statements',
    Buffer: 'In-memory + localStorage queue, flushed in batches',
    Retry: 'Exponential backoff for failed POSTs',
    Auth: 'Attaches Basic / OAuth credentials to every request',
    Fetch: 'POST /statements over the wire',
    LRS: 'The durable, queryable Learning Record Store'
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
