// xAPI Statement Anatomy — Mermaid click-to-reveal MicroSim
// CANVAS_HEIGHT: 520
// Bloom: Understand (L2) — identify, explain
// Pattern: click-to-reveal definition (no animation; learner-paced)

const fieldDefs = {
    root: {
        title: 'xAPI Statement',
        badge: null,
        body: `<p>A <b>statement</b> is the fundamental unit of data in xAPI: one JSON object describing one learning event.</p>
               <p>Every statement has three required parts — <b>actor</b>, <b>verb</b>, and <b>object</b> — plus optional payload fields (<code>result</code>, <code>context</code>) and metadata fields.</p>
               <p>Click any field below to see what it carries and who sets it.</p>`
    },
    actor: {
        title: 'actor',
        badge: 'REQUIRED · Set by Activity Provider',
        badgeClass: 'req-yes',
        body: `<p><i>Who did the thing?</i></p>
               <p>An <b>Agent</b> or <b>Group</b> identified by exactly one <b>Inverse Functional Identifier (IFI)</b> — a value globally unique by its own structure, without a central registry. Four IFI types: <code>mbox</code>, <code>mbox_sha1sum</code>, <code>openid</code>, <code>account</code>.</p>
               <p>Example: <code>{ "mbox": "mailto:lin@example.edu" }</code></p>`
    },
    verb: {
        title: 'verb',
        badge: 'REQUIRED · Set by Activity Provider',
        badgeClass: 'req-yes',
        body: `<p><i>What did they do?</i></p>
               <p>Always an <b>IRI</b> in the <code>id</code> field so two systems can agree on meaning. Optional <code>display</code> map provides human-readable labels.</p>
               <p>Example: <code>{ "id": "http://adlnet.gov/expapi/verbs/passed",<br/>&nbsp;"display": { "en-US": "passed" } }</code></p>`
    },
    object: {
        title: 'object',
        badge: 'REQUIRED · Set by Activity Provider',
        badgeClass: 'req-yes',
        body: `<p><i>To what was the verb done?</i></p>
               <p>Five possible types: <b>Activity</b> (most common), <b>Agent</b>, <b>Group</b>, <b>SubStatement</b>, <b>StatementRef</b>.</p>
               <p>Activity example: <code>{ "objectType": "Activity",<br/>&nbsp;"id": "http://textbook.example.org/chapters/quadratics" }</code></p>`
    },
    result: {
        title: 'result',
        badge: 'OPTIONAL · Set by Activity Provider',
        badgeClass: 'req-no',
        body: `<p>How did it go? Fields: <code>success</code> (boolean), <code>completion</code> (boolean), <code>score</code> (object with <code>scaled</code>, <code>raw</code>, <code>min</code>, <code>max</code>), <code>duration</code> (ISO 8601), <code>response</code> (string), <code>extensions</code>.</p>
               <p><b>Common trap:</b> if you omit <code>completion</code>, it isn't <code>false</code> — it's <em>absent</em>. Most LRS query engines treat absent and false differently. Always set it explicitly.</p>
               <p>Example: <code>{ "success": true, "completion": true, "score": { "scaled": 0.92 } }</code></p>`
    },
    context: {
        title: 'context',
        badge: 'OPTIONAL · Set by Activity Provider',
        badgeClass: 'req-no',
        body: `<p>Under what circumstances? Key fields: <code>platform</code>, <code>language</code>, <code>registration</code> (UUID), <code>instructor</code>, <code>team</code>, <code>contextActivities</code>, <code>extensions</code>.</p>
               <p><code>contextActivities.parent</code> is the direct container (e.g., the chapter). <code>grouping</code> is for peer activities. <code>category</code> is for labels/tags. Get <code>parent</code> right and you can answer most "which chapter?" analytics queries.</p>`
    },
    id: {
        title: 'id',
        badge: 'NEGOTIATED · Client may set; LRS mints if absent',
        badgeClass: 'req-neg',
        body: `<p>A <b>Version 4 UUID</b> that uniquely identifies this statement. If you don't supply one, the LRS mints it and returns it in the response.</p>
               <p><b>Best practice:</b> always generate the UUID client-side and include it. That lets you safely retry a failed POST without creating duplicates — the LRS rejects a second POST with the same ID rather than creating a duplicate record.</p>
               <p>Example: <code>"6690e6c9-3ef0-4ed3-8b37-7f3964730bee"</code></p>`
    },
    timestamp: {
        title: 'timestamp',
        badge: 'OPTIONAL · Set by Activity Provider',
        badgeClass: 'req-yes',
        body: `<p>When the <b>learner experienced the event</b> — ISO 8601 with timezone (typically UTC suffix <code>Z</code>). This is the field your dashboards filter on for "events between Monday and Friday."</p>
               <p>If you don't supply it, the LRS defaults it to the moment the statement arrives — <em>not</em> the same moment, especially if statements were buffered offline for hours or days.</p>
               <p>Example: <code>"2024-09-15T14:23:10.000Z"</code></p>`
    },
    stored: {
        title: 'stored',
        badge: 'SET BY LRS · Never set by client',
        badgeClass: 'req-lrs',
        body: `<p>ISO 8601 timestamp recording when the <b>LRS received and persisted</b> the statement. Set by the LRS, never by the client.</p>
               <p>Use <code>stored</code> for replication, audit, and reconciliation ("which statements arrived since our last backup?"). Use <code>timestamp</code> for everything pedagogical ("when did the learner actually do this?").</p>
               <p>The gap between <code>timestamp</code> and <code>stored</code> is your offline-sync buffer in action.</p>`
    },
    authority: {
        title: 'authority',
        badge: 'SET BY LRS · Based on client credentials',
        badgeClass: 'req-lrs',
        body: `<p>Identifies the agent vouching for the truth of the statement. Set by the LRS based on the credentials your client used to POST — not by the client itself.</p>
               <p>Authority is what stops a textbook from impersonating a teacher: the LRS knows who actually sent the bytes, regardless of what the JSON says.</p>`
    },
    version: {
        title: 'version',
        badge: 'SET BY LRS · xAPI spec version',
        badgeClass: 'req-lrs',
        body: `<p>Records the xAPI specification version under which the statement was processed. Also LRS-set. The current canonical version targeted by this book is <code>"1.0.3"</code>.</p>
               <p>xAPI 2.0 has been published (adds JSON-LD support, tightens conformance rules) but adoption is uneven across the LRS landscape as of 2026.</p>`
    }
};

function showFieldInfo(name) {
    const def = fieldDefs[name];
    const display = document.getElementById('info-display');
    if (!def || !display) return;

    let badgeHtml = '';
    if (def.badge) {
        badgeHtml = `<span class="info-badge ${def.badgeClass || ''}">${def.badge}</span>`;
    }
    display.innerHTML = `
        <div class="info-title">${def.title}</div>
        ${badgeHtml}
        <div class="info-content">${def.body}</div>
    `;
    emitInteracted(name);
}

function emitInteracted(fieldName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
        object: {
            id: 'http://textbook.example.org/sims/xapi-statement-anatomy#' + fieldName,
            definition: { name: { 'en-US': 'xAPI Statement field: ' + fieldName } }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow */ }
}

const hoverHints = {
    Root:       'The complete xAPI statement — click for an overview',
    Actor:      'Required — who performed the action',
    Verb:       'Required — what action was performed (IRI)',
    Object:     'Required — what the verb was done to',
    Result:     'Optional — success, completion, score, duration',
    Context:    'Optional — platform, parent activity, registration',
    Id:         'Negotiated UUID — always send from client for safe retries',
    Timestamp:  'When the learner experienced the event (not when it was sent)',
    Stored:     'Set by LRS — when the statement was received',
    Authority:  'Set by LRS — who vouches for the statement',
    Version:    'Set by LRS — xAPI spec version (currently 1.0.3)'
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

window.showFieldInfo = showFieldInfo;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
