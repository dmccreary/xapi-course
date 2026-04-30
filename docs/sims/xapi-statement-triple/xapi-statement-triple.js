// xAPI Statement Triple — Actor / Verb / Object MicroSim
// CANVAS_HEIGHT: 510
// Bloom: Understand (L2) — identify, classify
// Pattern: click-to-reveal definition (no animation; learner-paced)

const fieldInfo = {
    Statement: {
        title: 'xAPI Statement',
        required: null,
        body: `
            <p>A <b>statement</b> is the fundamental unit of data in xAPI: one JSON object describing one learning event.</p>
            <p>Every statement is built from three required parts — <b>Actor</b>, <b>Verb</b>, and <b>Object</b> — plus optional but powerful fields like <code>result</code>, <code>context</code>, <code>timestamp</code>, and <code>authority</code>.</p>
            <p>Click any of the fields branching off the statement to see what each one carries.</p>`
    },
    Actor: {
        title: 'Actor',
        required: true,
        body: `
            <p><i>Who did the thing?</i></p>
            <p>The agent that performed the action — a learner, a group, or an automated process. Identified by an <b>Inverse Functional Identifier (IFI)</b> that is globally unique without any central registry.</p>
            <p>Example: <code>{ "mbox": "mailto:lin@example.edu" }</code></p>`
    },
    Verb: {
        title: 'Verb',
        required: true,
        body: `
            <p><i>What did they do?</i></p>
            <p>A standardized action like <code>experienced</code>, <code>attempted</code>, <code>passed</code>, or <code>completed</code>. Identified by an <b>IRI</b> (a URL-shaped identifier) so two systems can agree on what the verb means.</p>
            <p>Example: <code>http://adlnet.gov/expapi/verbs/passed</code></p>`
    },
    Object: {
        title: 'Object',
        required: true,
        body: `
            <p><i>To what was the verb done?</i></p>
            <p>Almost always an <b>Activity</b> — a piece of content, a quiz, a chapter, a simulation. Can also be an Agent, Group, SubStatement, or StatementRef.</p>
            <p>Example: <code>http://textbook.example.org/chapters/quadratics</code></p>`
    },
    Result: {
        title: 'Result',
        required: false,
        body: `
            <p>How did it go? Captures success, completion, score, duration, response, and custom extensions.</p>
            <p>Example: <code>{ "success": true, "completion": true, "score": { "scaled": 0.92 } }</code></p>
            <p><b>Footgun:</b> if you forget <code>completion</code>, it isn't <code>false</code> — it's absent. Most LRSs treat absent and false differently.</p>`
    },
    Context: {
        title: 'Context',
        required: false,
        body: `
            <p>Under what circumstances? Captures the platform, language, parent activity, instructor, team, and registration UUID.</p>
            <p><code>contextActivities.parent</code> is what lets you answer "which chapter did this come from?" in your analytics.</p>`
    },
    Timestamp: {
        title: 'Timestamp',
        required: false,
        body: `
            <p>When the <b>learner</b> experienced the event, in ISO 8601 with timezone (typically <code>...Z</code> for UTC).</p>
            <p>If you don't supply it, the LRS defaults it to receipt time — which is <i>not</i> the same moment if statements were buffered offline.</p>`
    },
    Authority: {
        title: 'Authority',
        required: false,
        body: `
            <p>Who vouches for the truth of the statement. Set by the LRS based on the credentials your client used to POST.</p>
            <p>Authority is what stops a textbook from impersonating a teacher: the LRS knows who actually sent the bytes, regardless of what the JSON claims.</p>`
    }
};

function showStatementPart(name) {
    const info = fieldInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    let badge = '';
    if (info.required === true) {
        badge = '<span class="info-required req-yes">REQUIRED</span>';
    } else if (info.required === false) {
        badge = '<span class="info-required req-no">OPTIONAL</span>';
    }
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${badge}
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Demonstrate the standard the textbook is teaching: emit an xAPI 'interacted'
// statement when the reader clicks a field. The endpoint is configured via the
// global window.XAPI_LRS object if present; otherwise this is a no-op.
function emitInteractedStatement(fieldName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/xapi-statement-triple#' + fieldName,
            definition: {
                name: { 'en-US': 'xAPI Statement field: ' + fieldName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

// Hover tooltip: short one-liner per field on hover (in addition to the
// click-to-reveal infobox).
const hoverHints = {
    Statement: 'The full xAPI statement — click for an overview',
    Actor: 'Required — who did it',
    Verb: 'Required — what they did',
    Object: 'Required — to what',
    Result: 'Optional — how it went',
    Context: 'Optional — under what circumstances',
    Timestamp: 'Optional — when the learner experienced it',
    Authority: 'Set by the LRS — who vouches for the record'
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

// Expose globally so Mermaid `click ... call showStatementPart(...)` can resolve it.
window.showStatementPart = showStatementPart;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
