// xAPI Three Roles — Mermaid click-to-reveal MicroSim
// CANVAS_HEIGHT: 480
// Bloom: Understand (L2) — classify, describe
// Pattern: click-to-reveal infobox showing AP, LRS, and Consumer responsibilities

const roleDefs = {
    ap: {
        title: 'Activity Provider (AP)',
        badge: 'LEARNING RECORD PROVIDER',
        badgeClass: 'badge-ap',
        body: `<p>The <b>Activity Provider</b> is any system that generates learning data — an LMS, a textbook, a simulation, a mobile app, or a custom-built training tool.</p>
               <p>It is the <em>producer</em> of xAPI statements. When a learner does something worth recording, the AP builds a statement and POSTs it to the LRS.</p>
               <p><b>Responsibilities:</b></p>
               <ul>
                 <li>Build conformant statements (actor + verb + object, valid IRIs, correct UUID)</li>
                 <li>Authenticate against the LRS (Basic auth or OAuth)</li>
                 <li>Set <code>timestamp</code> to when the event occurred, not when the POST happens</li>
                 <li>Generate a Version 4 UUID for <code>id</code> to make retries idempotent</li>
               </ul>
               <p>The AP is part of the broader <b>Learning Record Provider (LRP)</b> category — a term that also covers agents and data bridges that route statements from one system to another.</p>`
    },
    post: {
        title: 'POST /statements',
        badge: 'HTTP WIRE PROTOCOL',
        badgeClass: 'badge-wire',
        body: `<p>The Activity Provider sends statements to the LRS using an HTTP <b>POST</b> request to the <code>/statements</code> endpoint.</p>
               <p><b>Required headers:</b></p>
               <p><code>Content-Type: application/json</code><br/>
               <code>X-Experience-API-Version: 1.0.3</code><br/>
               <code>Authorization: Basic &lt;base64 credentials&gt;</code></p>
               <p>The body is a single statement JSON object, or a JSON array for batch posting.</p>
               <p><b>Responses:</b></p>
               <ul>
                 <li><code>200 OK</code> — statement accepted; body contains array of statement UUIDs</li>
                 <li><code>400 Bad Request</code> — malformed statement (missing required field, invalid IRI)</li>
                 <li><code>401 Unauthorized</code> — bad or missing credentials</li>
                 <li><code>409 Conflict</code> — statement with same UUID but different content already exists</li>
               </ul>`
    },
    lrs: {
        title: 'Learning Record Store (LRS)',
        badge: 'THE HUB',
        badgeClass: 'badge-lrs',
        body: `<p>The <b>Learning Record Store</b> is the central repository for xAPI statements. It accepts statements from Activity Providers, persists them immutably, and serves them back to Activity Consumers on demand.</p>
               <p><b>What the LRS adds:</b></p>
               <ul>
                 <li><code>stored</code> — ISO 8601 timestamp of when the record arrived</li>
                 <li><code>authority</code> — the identity of the system that posted the statement (from credentials)</li>
                 <li><code>version</code> — the xAPI spec version under which the statement was processed</li>
               </ul>
               <p><b>What the LRS never does:</b></p>
               <ul>
                 <li>Modify <code>actor</code>, <code>verb</code>, <code>object</code>, <code>result</code>, or <code>context</code> — these are immutable after acceptance</li>
                 <li>Delete individual statements (only voiding via a Void statement is allowed)</li>
               </ul>
               <p>Commercial examples: SCORM Cloud, Learning Locker, Watershed, WATERSHED, ADL LRS.</p>`
    },
    get: {
        title: 'GET /statements',
        badge: 'HTTP WIRE PROTOCOL',
        badgeClass: 'badge-wire',
        body: `<p>Activity Consumers retrieve statements from the LRS using HTTP <b>GET</b> requests to the <code>/statements</code> endpoint.</p>
               <p><b>Required headers:</b></p>
               <p><code>X-Experience-API-Version: 1.0.3</code><br/>
               <code>Authorization: Basic &lt;base64 credentials&gt;</code></p>
               <p><b>Common query parameters:</b></p>
               <ul>
                 <li><code>agent</code> — filter by actor (JSON-encoded Agent/Group)</li>
                 <li><code>verb</code> — filter by verb IRI</li>
                 <li><code>activity</code> — filter by object activity IRI</li>
                 <li><code>since</code> / <code>until</code> — filter by <code>stored</code> timestamp range</li>
                 <li><code>limit</code> — max statements per page (default varies by LRS)</li>
               </ul>
               <p>The response includes a <code>statements</code> array and optionally a <code>more</code> URL for pagination.</p>`
    },
    consumer: {
        title: 'Activity Consumer',
        badge: 'LEARNING RECORD CONSUMER',
        badgeClass: 'badge-consumer',
        body: `<p>The <b>Activity Consumer</b> reads statements from the LRS and transforms them into insight. It is the <em>audience</em> for all the data the Activity Provider has been collecting.</p>
               <p>Consumers authenticate against the LRS just like providers do — with their own credentials (typically read-only). They query the <code>/statements</code> endpoint with filters to pull only the records they need.</p>
               <p><b>Common consumer patterns:</b></p>
               <ul>
                 <li><b>Dashboards</b> — visualize learner progress, completion rates, score distributions</li>
                 <li><b>Recommenders</b> — surface next-best-activity based on past interactions</li>
                 <li><b>Grade Export</b> — pass completion and score data back to an SIS or gradebook</li>
                 <li><b>Compliance Reports</b> — verify that required training was completed by deadline</li>
               </ul>
               <p>The same system can be both a provider and a consumer — an adaptive textbook both POSTs "attempted" statements and GETs prior history to personalize the next module.</p>`
    },
    dashboard: {
        title: 'Dashboard',
        badge: 'CONSUMER EXAMPLE',
        badgeClass: 'badge-consumer',
        body: `<p>A <b>dashboard</b> is the most common Activity Consumer. It polls the LRS for statements, aggregates them, and renders charts, tables, or heatmaps for instructors, administrators, or learners.</p>
               <p><b>Typical queries:</b></p>
               <ul>
                 <li>All statements for a given activity IRI (how many learners attempted this module?)</li>
                 <li>All statements by a given actor (what has this learner done this week?)</li>
                 <li>All "passed" / "failed" statements for a course (pass rate over time)</li>
               </ul>
               <p><b>Design note:</b> dashboards should query by <code>stored</code> timestamp (when the LRS received the record) for incremental sync, not <code>timestamp</code> (when the event happened). Using <code>since=</code> on <code>stored</code> ensures you never miss a late-arriving offline statement.</p>`
    },
    recommender: {
        title: 'Recommender',
        badge: 'CONSUMER EXAMPLE',
        badgeClass: 'badge-consumer',
        body: `<p>A <b>recommender</b> is an Activity Consumer that reads a learner's statement history and uses it to surface the most relevant next activity.</p>
               <p><b>How it works:</b></p>
               <ul>
                 <li>GETs all statements for a specific <code>agent</code> (the current learner)</li>
                 <li>Identifies which activities were completed, passed, or failed</li>
                 <li>Applies a recommendation algorithm (collaborative filtering, knowledge-space theory, etc.)</li>
                 <li>Returns a ranked list of activity IRIs</li>
               </ul>
               <p><b>xAPI advantage over SCORM:</b> because xAPI statements are stored centrally and carry rich context (platform, course, language, grouping), a recommender can draw on data from <em>every system</em> the learner has used — not just the current LMS session.</p>`
    },
    grade: {
        title: 'Grade Export',
        badge: 'CONSUMER EXAMPLE',
        badgeClass: 'badge-consumer',
        body: `<p>A <b>grade export consumer</b> reads <code>result.score</code> and <code>result.completion</code> fields from xAPI statements and writes them back to an external gradebook (SIS, LMS grade column, compliance system).</p>
               <p><b>Typical query:</b> GET all statements where <code>verb = completed</code> or <code>verb = passed</code> for a given activity, filtered to a specific cohort of agents.</p>
               <p><b>Key fields:</b></p>
               <ul>
                 <li><code>result.score.scaled</code> — normalized score (-1.0 to 1.0); multiply by 100 for a percentage</li>
                 <li><code>result.score.raw</code> — actual points earned</li>
                 <li><code>result.completion</code> — boolean; true means the learner finished</li>
                 <li><code>result.success</code> — boolean; true means they met the passing threshold</li>
               </ul>
               <p><b>Note:</b> omitting <code>result.completion</code> is NOT the same as <code>false</code>. Grade exporters should treat an absent field as "unknown," not "incomplete."</p>`
    }
};

function showRoleInfo(name) {
    const def = roleDefs[name];
    const display = document.getElementById('info-display');
    if (!def || !display) return;

    display.innerHTML =
        '<div class="info-title">' + def.title + '</div>' +
        '<span class="info-badge ' + (def.badgeClass || '') + '">' + def.badge + '</span>' +
        '<div class="info-content">' + def.body + '</div>';

    emitInteracted(name);
}

function emitInteracted(roleName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
        object: {
            id: 'http://textbook.example.org/sims/xapi-three-roles#' + roleName,
            definition: { name: { 'en-US': 'xAPI Three Roles: ' + roleName } }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) {}
}

const hoverHints = {
    AP:       'Activity Provider — builds and POSTs statements to the LRS',
    LRPEnv:   'Learning Record Provider — broader category that includes the AP',
    POST:     'POST /statements — HTTP endpoint used to send statements to the LRS',
    LRS:      'Learning Record Store — stores statements immutably, serves them on demand',
    GET:      'GET /statements — HTTP endpoint used to retrieve statements from the LRS',
    AC:       'Activity Consumer — reads statements and generates insight',
    Dash:     'Dashboard — visualizes learner progress and completion',
    Rec:      'Recommender — suggests next-best activity based on history',
    Grade:    'Grade Export — writes completion and score data to a gradebook'
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

window.showRoleInfo = showRoleInfo;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
