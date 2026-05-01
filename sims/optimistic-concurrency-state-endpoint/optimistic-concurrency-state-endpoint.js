// Optimistic Concurrency on the State Endpoint MicroSim
// CANVAS_HEIGHT: 620
// Bloom: Analyze (L4) — trace concurrent writes and identify winner / 412 / recovery
// Pattern: click-to-reveal HTTP message detail (no animation; learner-paced)

const stepInfo = {
    A_GET: {
        title: "Client A — GET /activities/state",
        lane: "Client A",
        kind: "request",
        body: `
            <p><b>HTTP message</b></p>
            <pre>GET /xAPI/activities/state?activityId=...&amp;agent={...}&amp;stateId=progress
Authorization: Basic ...
X-Experience-API-Version: 1.0.3</pre>
            <p><b>LRS response</b></p>
            <pre>200 OK
ETag: "v1"
Content-Type: application/json

{ "completedSlides": [1, 2, 3] }</pre>
            <p><b>Robust client behavior:</b> always store the <code>ETag</code> alongside the document body. The ETag is your only proof of which version you read.</p>`
    },
    A_MOD: {
        title: "Client A — modify locally",
        lane: "Client A",
        kind: "local",
        body: `
            <p>Client A mutates its in-memory copy of the state document — for example, appending slide <code>4</code> to <code>completedSlides</code>.</p>
            <p>No HTTP traffic happens here. The server still believes the document is at version <code>v1</code>.</p>
            <p><b>Robust client behavior:</b> compute the modified document <i>without</i> discarding the original. If the upcoming PUT fails with 412, you'll need both the old base and the new edits to merge.</p>`
    },
    A_PUT: {
        title: "Client A — PUT with If-Match: \"v1\"",
        lane: "Client A",
        kind: "request",
        body: `
            <p><b>HTTP message</b></p>
            <pre>PUT /xAPI/activities/state?activityId=...&amp;agent={...}&amp;stateId=progress
If-Match: "v1"
Content-Type: application/json
X-Experience-API-Version: 1.0.3

{ "completedSlides": [1, 2, 3, 4] }</pre>
            <p>The <code>If-Match</code> header tells the LRS: <i>"only accept this write if the stored document is still at version v1."</i></p>
            <p><b>Robust client behavior:</b> never PUT without <code>If-Match</code>. Omitting it is a silent footgun — the LRS may accept the write and clobber a concurrent update.</p>`
    },
    A_OK: {
        title: "LRS — 200 OK, new ETag \"v2\"",
        lane: "LRS",
        kind: "success",
        body: `
            <p><b>LRS response</b></p>
            <pre>204 No Content
ETag: "v2"</pre>
            <p>The precondition matched. The state document is now at version <code>v2</code> with Client A's edits. Client A wins the race.</p>
            <p><b>Robust client behavior:</b> capture the new ETag from the response header and store it. The next PUT must use <code>If-Match: "v2"</code>.</p>`
    },
    B_GET: {
        title: "Client B — GET /activities/state",
        lane: "Client B",
        kind: "request",
        body: `
            <p><b>HTTP message</b></p>
            <pre>GET /xAPI/activities/state?activityId=...&amp;agent={...}&amp;stateId=progress
X-Experience-API-Version: 1.0.3</pre>
            <p><b>LRS response (read concurrently with A's read)</b></p>
            <pre>200 OK
ETag: "v1"

{ "completedSlides": [1, 2, 3] }</pre>
            <p>Client B happens to read the document at the same version (<code>v1</code>) as Client A. Both clients now believe they hold the latest state — but only one of them does.</p>`
    },
    B_MOD: {
        title: "Client B — modify locally",
        lane: "Client B",
        kind: "local",
        body: `
            <p>Client B mutates its own copy independently — for example, recording the learner's quiz score by setting <code>"quizScore": 0.92</code>.</p>
            <p>This change is unrelated to A's slide edits, but the LRS doesn't know that. To the LRS, both edits target the same version <code>v1</code>.</p>
            <p><b>Robust client behavior:</b> keep track of <i>what</i> you changed, not just the resulting document. Field-level diffs make merging dramatically easier when the precondition fails.</p>`
    },
    B_PUT1: {
        title: "Client B — PUT with If-Match: \"v1\"",
        lane: "Client B",
        kind: "request",
        body: `
            <p><b>HTTP message</b></p>
            <pre>PUT /xAPI/activities/state?activityId=...&amp;agent={...}&amp;stateId=progress
If-Match: "v1"
Content-Type: application/json

{ "completedSlides": [1, 2, 3], "quizScore": 0.92 }</pre>
            <p>Client B's PUT also claims the base version is <code>v1</code> — but by now the LRS has already accepted A's write and the document is at <code>v2</code>.</p>
            <p>The precondition will fail.</p>`
    },
    B_412: {
        title: "LRS — 412 Precondition Failed",
        lane: "LRS",
        kind: "fail",
        body: `
            <p><b>LRS response</b></p>
            <pre>412 Precondition Failed
ETag: "v2"</pre>
            <p>The current ETag is <code>"v2"</code>, not <code>"v1"</code>. The LRS refuses the write to protect Client A's update from being silently overwritten.</p>
            <p><b>Robust client behavior:</b> a 412 is <i>not</i> a fatal error — it's a "please reconcile" signal. Catch it specifically and trigger the recovery path. Do not treat it like a 5xx and retry blindly.</p>`
    },
    B_GET2: {
        title: "Client B — GET /activities/state (recovery)",
        lane: "Client B",
        kind: "request",
        body: `
            <p><b>HTTP message</b></p>
            <pre>GET /xAPI/activities/state?activityId=...&amp;agent={...}&amp;stateId=progress</pre>
            <p><b>LRS response</b></p>
            <pre>200 OK
ETag: "v2"

{ "completedSlides": [1, 2, 3, 4] }</pre>
            <p>Client B fetches the latest version of the document, including A's slide-4 edit.</p>
            <p><b>Robust client behavior:</b> always re-read after a 412. Never assume the server's state matches what you previously held.</p>`
    },
    B_MERGE: {
        title: "Client B — merge edits",
        lane: "Client B",
        kind: "local",
        body: `
            <p>Client B reapplies its own change (<code>quizScore: 0.92</code>) on top of the freshly fetched <code>v2</code> document.</p>
            <p>The merged document now contains both edits: <code>completedSlides: [1, 2, 3, 4]</code> <i>and</i> <code>quizScore: 0.92</code>.</p>
            <p><b>Robust client behavior:</b> implement a domain-specific merge function for state documents that can take concurrent edits — last-write-wins is rarely what learners want for progress data.</p>`
    },
    B_PUT2: {
        title: "Client B — PUT with If-Match: \"v2\"",
        lane: "Client B",
        kind: "request",
        body: `
            <p><b>HTTP message</b></p>
            <pre>PUT /xAPI/activities/state?activityId=...&amp;agent={...}&amp;stateId=progress
If-Match: "v2"
Content-Type: application/json

{ "completedSlides": [1, 2, 3, 4], "quizScore": 0.92 }</pre>
            <p>This time the precondition matches. The LRS responds with <code>204 No Content</code> and a new ETag <code>"v3"</code>.</p>
            <p>Both edits are now durably persisted. Neither client lost data — that is the entire point of optimistic concurrency.</p>`
    },
    B_OK: {
        title: "LRS — 204 No Content, new ETag \"v3\"",
        lane: "LRS",
        kind: "success",
        body: `
            <p><b>LRS response</b></p>
            <pre>204 No Content
ETag: "v3"</pre>
            <p>The retry succeeded. Document is at <code>v3</code> with both clients' edits preserved.</p>
            <p><b>Robust client behavior:</b> bound the retry loop. If you see five 412s in a row, something is wrong (a stuck client, a runaway script) — surface the problem instead of looping forever.</p>`
    }
};

function showStep(name) {
    const info = stepInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;

    let kindClass = '';
    let kindLabel = '';
    if (info.kind === 'request') { kindClass = 'kind-request'; kindLabel = 'HTTP REQUEST'; }
    else if (info.kind === 'local') { kindClass = 'kind-local'; kindLabel = 'LOCAL ACTION'; }
    else if (info.kind === 'success') { kindClass = 'kind-success'; kindLabel = 'SUCCESS RESPONSE'; }
    else if (info.kind === 'fail') { kindClass = 'kind-fail'; kindLabel = 'FAILURE RESPONSE'; }

    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        <div class="info-tags">
            <span class="info-lane">${info.lane}</span>
            <span class="info-kind ${kindClass}">${kindLabel}</span>
        </div>
        <div class="info-content">${info.body}</div>
    `;
}

// Hover hints — short one-liners shown as native SVG <title> tooltips.
const hoverHints = {
    A_GET:   "Client A reads — receives ETag v1",
    A_MOD:   "Client A mutates its local copy",
    A_PUT:   "Client A writes with If-Match: v1",
    A_OK:    "200 OK — Client A wins, ETag advances to v2",
    B_GET:   "Client B reads — also receives ETag v1",
    B_MOD:   "Client B mutates its local copy",
    B_PUT1:  "Client B writes with If-Match: v1",
    B_412:   "412 Precondition Failed — base version is stale",
    B_GET2:  "Client B re-reads — receives ETag v2",
    B_MERGE: "Client B merges its edit on top of v2",
    B_PUT2:  "Client B retries with If-Match: v2",
    B_OK:    "204 No Content — both edits preserved at v3"
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

// Expose globally so Mermaid `click ... call showStep(...)` directives can resolve it.
window.showStep = showStep;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
