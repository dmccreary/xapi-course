// Retry-With-Backoff State Machine MicroSim
// CANVAS_HEIGHT: 520
// Bloom: Analyze (L4) — trace state transitions, identify response-code outcomes
// Pattern: click-to-reveal state details (no animation; learner-paced)

const stateInfo = {
    Buffering: {
        title: 'Buffering',
        kind: 'transient',
        duration: 'Milliseconds to a few seconds',
        body: `
            <p>Statements arrive from the textbook (clicks, completions, scores) and are appended to an <b>in-memory batch</b>. Nothing has been sent to the LRS yet.</p>
            <p>The batch flushes when one of three things happens: the batch hits its size limit (commonly 25–50 statements), a flush timer fires (typically every 5–10 seconds), or the page is about to unload.</p>
            <p><b>Why batch at all?</b> Sending one HTTP request per statement is wasteful and noisy. Batching trades a tiny amount of latency for a huge reduction in network chatter and LRS load.</p>`
    },
    Sending: {
        title: 'Sending',
        kind: 'transient',
        duration: 'Until the HTTP response arrives (typically 50–500 ms)',
        body: `
            <p>A POST request is in flight to the LRS endpoint <code>/xAPI/statements</code> carrying the batch as a JSON array.</p>
            <p>The next state is determined entirely by the HTTP response status (or lack thereof):</p>
            <ul style="margin-left:18px">
                <li><b>2xx</b> → Success</li>
                <li><b>4xx</b> → Client Error (do not retry — the request itself is wrong)</li>
                <li><b>5xx or network error</b> → Backoff (retry with delay)</li>
            </ul>
            <p>This is the <i>only</i> branching point in the pipeline — every other state has exactly one outgoing edge.</p>`
    },
    Success: {
        title: 'Success (2xx)',
        kind: 'terminal-good',
        duration: 'Terminal — batch is acknowledged and discarded',
        body: `
            <p>The LRS returned a <b>200 OK</b> (or <b>204 No Content</b>) and an array of statement IDs. The batch is now durably stored on the server side.</p>
            <p>The client can safely discard the in-memory batch and begin buffering the next one.</p>
            <p><b>Note:</b> A 2xx status means the LRS <i>accepted</i> the statements — not that they're correct, useful, or analytically interesting. Authority and validation rules are the LRS's job; semantic correctness is yours.</p>`
    },
    ClientError: {
        title: 'Client Error (4xx)',
        kind: 'terminal-bad',
        duration: 'Terminal — surfaces the error and stops',
        body: `
            <p>The LRS returned <b>400 Bad Request</b>, <b>401 Unauthorized</b>, <b>403 Forbidden</b>, or similar. The request is structurally wrong and retrying won't fix it.</p>
            <p>Common 4xx causes:</p>
            <ul style="margin-left:18px">
                <li>Malformed JSON or missing required field (Actor, Verb, Object)</li>
                <li>Invalid IRI in <code>verb.id</code> or <code>object.id</code></li>
                <li>Bad credentials (401) or insufficient scope (403)</li>
                <li>Statement ID conflict (409 — already exists with different content)</li>
            </ul>
            <p>The client should <b>surface the error</b> (log it, alert the developer console, or report to a monitoring channel) rather than silently retrying. Retrying a 4xx wastes bandwidth and never succeeds.</p>`
    },
    Backoff: {
        title: 'Backoff',
        kind: 'transient',
        duration: 'Exponentially increasing: 1s, 2s, 4s, 8s, 16s, ...',
        body: `
            <p>The send failed transiently — a <b>5xx server error</b>, a network timeout, or no response at all. The batch is held in memory and a retry is scheduled after a delay.</p>
            <p>The delay grows exponentially: <code>delay = baseDelay × 2^attempt</code>, typically with a small random jitter so a thundering herd of clients doesn't all retry at the same instant.</p>
            <p>After the timer fires, the batch returns to <b>Sending</b>. If the retry counter exceeds <code>maxRetries</code> (commonly 5–7), the batch transitions to the <b>Offline Queue</b> instead.</p>
            <p><b>Why exponential and not constant?</b> If the LRS is overloaded, hammering it every second makes things worse. Backoff gives the server room to recover.</p>`
    },
    OfflineQueue: {
        title: 'Offline Queue',
        kind: 'terminal-bad',
        duration: 'Terminal handoff — persists until network returns',
        body: `
            <p>After exhausting all retries, the batch is handed off to a <b>persistent offline queue</b> — typically <code>localStorage</code>, <code>IndexedDB</code>, or a service worker cache.</p>
            <p>A separate background process (or the next page load) drains the queue: it watches for <code>navigator.onLine</code> to flip to <code>true</code>, then re-enters the pipeline at <b>Sending</b> with a fresh retry budget.</p>
            <p>This is what lets a learner work on a plane, in a basement, or on flaky cafe Wi-Fi and still have their statements arrive at the LRS hours later.</p>
            <p><b>Footgun:</b> If you forget the offline queue, you lose statements silently. The user sees no error, the LRS sees no data, and the analytics dashboard quietly under-counts. Build the queue from day one.</p>`
    }
};

function showStatePart(name) {
    const info = stateInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;

    let badge = '';
    if (info.kind === 'transient') {
        badge = '<span class="info-required req-transient">TRANSIENT</span>';
    } else if (info.kind === 'terminal-good') {
        badge = '<span class="info-required req-good">TERMINAL — SUCCESS</span>';
    } else if (info.kind === 'terminal-bad') {
        badge = '<span class="info-required req-bad">TERMINAL — STOPS HERE</span>';
    }

    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${badge}
        <div class="info-duration"><b>Typical duration:</b> ${info.duration}</div>
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Demonstrate the standard the textbook is teaching: emit an xAPI 'interacted'
// statement when the reader clicks a state. The endpoint is configured via the
// global window.XAPI_LRS object if present; otherwise this is a no-op.
function emitInteractedStatement(stateName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/retry-with-backoff-state-machine#' + stateName,
            definition: {
                name: { 'en-US': 'Retry-With-Backoff state: ' + stateName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

// Hover hints: short one-liner per state on hover.
const hoverHints = {
    Buffering: 'In-memory batch — nothing sent yet',
    Sending: 'POST in flight to the LRS',
    Success: '2xx response — batch acknowledged',
    ClientError: '4xx — request is wrong; do not retry',
    Backoff: '5xx or network error — wait, then retry',
    OfflineQueue: 'Max retries exceeded — handed off to persistent storage'
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

// Expose globally so Mermaid `click ... call showStatePart(...)` can resolve it.
window.showStatePart = showStatePart;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
