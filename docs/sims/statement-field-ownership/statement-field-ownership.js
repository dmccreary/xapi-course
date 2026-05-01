// Statement Field Ownership — Mermaid click-to-reveal MicroSim
// CANVAS_HEIGHT: 490
// Bloom: Analyze (L4) — differentiate, attribute
// Pattern: click-to-reveal infobox distinguishing client vs LRS responsibility

const ownershipDefs = {
    actor: {
        title: 'actor',
        badge: 'ACTIVITY PROVIDER SETS',
        badgeClass: 'badge-client',
        body: `<p>The <b>actor</b> field is set by the Activity Provider (your code) at the moment the statement is built. It identifies the learner performing the action.</p>
               <p>Type: Agent or Group. Must contain exactly one IFI (<code>mbox</code>, <code>mbox_sha1sum</code>, <code>openid</code>, or <code>account</code>).</p>
               <p>Example: <code>{ "mbox": "mailto:lin@example.edu" }</code></p>`
    },
    verb: {
        title: 'verb',
        badge: 'ACTIVITY PROVIDER SETS',
        badgeClass: 'badge-client',
        body: `<p>The <b>verb</b> field is set by the Activity Provider. It identifies the action the actor performed. Must contain an <code>id</code> IRI pointing to a published verb definition.</p>
               <p>Optional <code>display</code> map provides human-readable labels in one or more languages — but the LRS indexes and queries on the IRI, not the display label.</p>
               <p>Example: <code>{ "id": "http://adlnet.gov/expapi/verbs/passed" }</code></p>`
    },
    object: {
        title: 'object',
        badge: 'ACTIVITY PROVIDER SETS',
        badgeClass: 'badge-client',
        body: `<p>The <b>object</b> field is set by the Activity Provider. It identifies what the verb was done to. Almost always an Activity, identified by an IRI.</p>
               <p>Four other object types exist: Agent, Group, SubStatement, StatementRef. Each has a different <code>objectType</code> value.</p>
               <p>Example: <code>{ "id": "http://textbook.example.org/chapters/02-statement-model" }</code></p>`
    },
    result: {
        title: 'result',
        badge: 'ACTIVITY PROVIDER SETS',
        badgeClass: 'badge-client',
        body: `<p>The <b>result</b> field is set by the Activity Provider when there is an outcome to report. It is optional but highly informative.</p>
               <p>Fields: <code>success</code>, <code>completion</code>, <code>score</code> (<code>scaled</code>, <code>raw</code>, <code>min</code>, <code>max</code>), <code>duration</code>, <code>response</code>, <code>extensions</code>.</p>
               <p><b>Common trap:</b> omitting <code>completion</code> is not the same as setting it to <code>false</code>. Always set it explicitly when you mean it — LRS query engines treat absent and false differently.</p>`
    },
    context: {
        title: 'context',
        badge: 'ACTIVITY PROVIDER SETS',
        badgeClass: 'badge-client',
        body: `<p>The <b>context</b> field is set by the Activity Provider to capture the surrounding situation: which course, which platform, which language, which group.</p>
               <p>Key sub-fields: <code>platform</code>, <code>language</code>, <code>registration</code> (UUID), <code>contextActivities</code> (parent, grouping, category, other), <code>instructor</code>, <code>team</code>, <code>extensions</code>.</p>`
    },
    id: {
        title: 'id (UUID)',
        badge: 'NEGOTIATED — client may set; LRS mints if absent',
        badgeClass: 'badge-neg',
        body: `<p>The <b>id</b> field is special: if you supply a Version 4 UUID, the LRS accepts it. If you don't, the LRS mints one and returns it in the response body.</p>
               <p><b>Best practice:</b> always generate and send the UUID from your client. This makes your POST idempotent — if the request times out and you retry, the LRS will reject the duplicate (same UUID = same statement) instead of creating a double record.</p>
               <p>Example: <code>"6690e6c9-3ef0-4ed3-8b37-7f3964730bee"</code></p>`
    },
    timestamp: {
        title: 'timestamp',
        badge: 'ACTIVITY PROVIDER SETS',
        badgeClass: 'badge-client',
        body: `<p>The <b>timestamp</b> field records when the learner <em>experienced the event</em> — not when the POST request arrived. ISO 8601 with timezone (typically UTC suffix <code>Z</code>).</p>
               <p>If omitted, the LRS defaults it to the moment the statement arrived — <em>not</em> the same moment, especially if statements were buffered offline for hours or days before sync. Always set it explicitly from your client.</p>
               <p>Example: <code>"2024-09-15T14:23:10.000Z"</code></p>`
    },
    post: {
        title: 'POST /statements',
        badge: 'THE WIRE PROTOCOL',
        badgeClass: 'badge-wire',
        body: `<p>The Activity Provider sends statements to the LRS via HTTP <b>POST</b> to the <code>/statements</code> endpoint.</p>
               <p>Required headers:</p>
               <p><code>Content-Type: application/json</code><br/>
               <code>X-Experience-API-Version: 1.0.3</code><br/>
               <code>Authorization: Basic &lt;base64 credentials&gt;</code></p>
               <p>The body is a single statement JSON object, or a JSON array for batch posting.</p>
               <p>Response: <code>200 OK</code> with a JSON array of the statement UUIDs the LRS assigned (either the client-supplied IDs or freshly minted ones).</p>
               <p>On duplicate: <code>409 Conflict</code> if a statement with the same UUID and different content already exists.</p>`
    },
    stored: {
        title: 'stored',
        badge: 'LRS SETS THIS — client value overwritten',
        badgeClass: 'badge-lrs',
        body: `<p>The <b>stored</b> field is set exclusively by the LRS. It records the ISO 8601 timestamp of when the LRS received and persisted the statement.</p>
               <p>If you include <code>stored</code> in your POST body, the LRS ignores it and overwrites it with its own timestamp — silently, with no error.</p>
               <p><b>Do not confuse with <code>timestamp</code></b>: <code>timestamp</code> is when the learner experienced the event; <code>stored</code> is when the LRS received the record. The gap between them is your offline-sync buffer in action.</p>
               <p>Use <code>stored</code> for replication, audit, and "which statements arrived since our last backup?" queries.</p>`
    },
    authority: {
        title: 'authority',
        badge: 'LRS SETS THIS — client value overwritten',
        badgeClass: 'badge-lrs',
        body: `<p>The <b>authority</b> field is set by the LRS based on the credentials used to authenticate the POST request. It identifies the agent (or two-legged OAuth group) vouching for the statement's truth.</p>
               <p>If you include <code>authority</code> in your POST body, the LRS overwrites it silently based on the actual credentials it sees. This is by design — a textbook shouldn't be able to claim it was posted by a different system.</p>
               <p>Authority is what prevents a student's textbook from impersonating a teacher: the LRS knows who actually sent the bytes, regardless of what the JSON says.</p>`
    },
    version: {
        title: 'version',
        badge: 'LRS SETS THIS — client value overwritten',
        badgeClass: 'badge-lrs',
        body: `<p>The <b>version</b> field records the xAPI specification version under which the statement was processed. It is set by the LRS, not the client.</p>
               <p>The current canonical version this book targets is <code>"1.0.3"</code>. The version field tells downstream consumers and audit logs which spec version governed the statement's storage.</p>
               <p>If you include <code>version</code> in your POST body, the LRS overwrites it with its own value — silently.</p>`
    }
};

function showOwnership(name) {
    const def = ownershipDefs[name];
    const display = document.getElementById('info-display');
    if (!def || !display) return;

    display.innerHTML =
        '<div class="info-title">' + def.title + '</div>' +
        '<span class="info-badge ' + (def.badgeClass || '') + '">' + def.badge + '</span>' +
        '<div class="info-content">' + def.body + '</div>';

    emitInteracted(name);
}

function emitInteracted(fieldName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
        object: {
            id: 'http://textbook.example.org/sims/statement-field-ownership#' + fieldName,
            definition: { name: { 'en-US': 'xAPI field ownership: ' + fieldName } }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) {}
}

const hoverHints = {
    actor:      'Required — set by Activity Provider — identifies the learner',
    verb:       'Required — set by Activity Provider — the action (IRI)',
    object:     'Required — set by Activity Provider — what the verb was done to',
    result:     'Optional — set by Activity Provider — success, score, completion',
    context:    'Optional — set by Activity Provider — platform, parent activity',
    id:         'Negotiated — client may set; LRS mints a UUID if absent',
    timestamp:  'Optional — set by Activity Provider — WHEN the learner experienced it',
    POST:       'Click to see the HTTP request/response cycle',
    stored:     'LRS ONLY — when the LRS received the statement — never set this from client',
    authority:  'LRS ONLY — who vouches for the statement — LRS derives from credentials',
    version:    'LRS ONLY — xAPI spec version — currently 1.0.3'
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

window.showOwnership = showOwnership;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
