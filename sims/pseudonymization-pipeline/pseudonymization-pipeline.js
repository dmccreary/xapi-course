// Pseudonymization Pipeline — LMS to LRS Identity Flow
// CANVAS_HEIGHT: 450
// Bloom: Analyze (L4) — trace the flow of identity information
// Pattern: click-to-reveal infobox per pipeline hop (no animation; learner-paced)

const hopInfo = {
    LMS: {
        title: 'LMS user record',
        privacy: 'red',
        body: `
            <p><b>Where it lives:</b> Inside the Learning Management System database.</p>
            <p><b>What's stored:</b> Full personally identifying information — real name, email address, role, often phone number, photo, and student ID.</p>
            <p><b>Who can see it:</b> Registrar, instructors, IT admins, anyone with LMS admin credentials.</p>
            <p><b>Privacy posture:</b> <span style="color:#b91c1c"><b>HIGH RISK</b></span>. This is the only place in the pipeline where the learner is directly identifiable. Treat it like a vault — every other hop should avoid touching it.</p>`
    },
    Launch: {
        title: 'LMS launch — pseudonym only',
        privacy: 'green',
        body: `
            <p><b>What happens:</b> The LMS launches the textbook (typically via LTI) and passes only an opaque pseudonym such as <code>stu-8f3a2b1c</code> as the user identifier.</p>
            <p><b>What's exposed:</b> The pseudonym, plus optional context like course ID and role. <b>No</b> name, <b>no</b> email.</p>
            <p><b>Why this matters:</b> The textbook never learns who the learner actually is. If the textbook code or its database is breached, the attacker gets pseudonyms — not a roster.</p>
            <p><b>Privacy posture:</b> <span style="color:#15803d"><b>LOW RISK</b></span>. This is the chokepoint that makes the rest of the pipeline safe.</p>`
    },
    Emit: {
        title: 'Textbook emit site',
        privacy: 'green',
        body: `
            <p><b>What happens:</b> The textbook constructs xAPI statements and places the pseudonym in <code>actor.account.name</code>.</p>
            <p><b>Example:</b></p>
            <p><code>"actor": { "account": { "homePage": "https://lms.example.edu", "name": "stu-8f3a2b1c" } }</code></p>
            <p><b>What's exposed:</b> Only the pseudonym. The <code>homePage</code> tells the LRS which LMS issued it but not who the person is.</p>
            <p><b>Privacy posture:</b> <span style="color:#15803d"><b>LOW RISK</b></span>. Statements can be shared, archived, or replicated without leaking identity.</p>`
    },
    LRS: {
        title: 'LRS storage',
        privacy: 'green',
        body: `
            <p><b>What happens:</b> The Learning Record Store stores every statement keyed by the pseudonymous actor.</p>
            <p><b>What's stored:</b> Pseudonyms, verbs, activity IRIs, results, timestamps. No emails, no names.</p>
            <p><b>Who can query it:</b> Authenticated dashboards and analytics services — using the pseudonym, not the human identity.</p>
            <p><b>Privacy posture:</b> <span style="color:#15803d"><b>LOW RISK</b></span>. Even if the LRS is exfiltrated, the attacker still needs the LMS to map pseudonyms back to people.</p>`
    },
    Dashboard: {
        title: 'Dashboard query',
        privacy: 'green',
        body: `
            <p><b>What happens:</b> Analytics dashboards compute per-learner statistics — completion rates, time-on-task, mastery — using the pseudonym as the join key.</p>
            <p><b>What's exposed:</b> Aggregated and per-pseudonym metrics. The dashboard sees that <code>stu-8f3a2b1c</code> finished Chapter 4, not that "Maya Chen" did.</p>
            <p><b>Why this works:</b> Most pedagogical questions ("which sections trip students up?") don't require identity at all — they only need a stable per-learner key.</p>
            <p><b>Privacy posture:</b> <span style="color:#15803d"><b>LOW RISK</b></span>.</p>`
    },
    Reidentify: {
        title: 'Re-identification lookup',
        privacy: 'red',
        body: `
            <p><b>What happens:</b> A privileged user (an instructor of record, an academic-integrity officer) needs to know which human is behind <code>stu-8f3a2b1c</code>. The lookup goes back through the LMS.</p>
            <p><b>When it's justified:</b> Grade reporting, accommodations, integrity investigations, FERPA-compliant academic action.</p>
            <p><b>Required controls:</b></p>
            <ul style="margin-left:18px">
                <li>An <b>audit log</b> that records who looked up whom, when, and why</li>
                <li>Role-based access (not every dashboard user gets the lookup button)</li>
                <li>A documented institutional policy the lookup is performed under</li>
            </ul>
            <p><b>Privacy posture:</b> <span style="color:#b91c1c"><b>HIGH RISK</b></span>. Re-identification is the moment the pipeline becomes identifying again. Audit it like you'd audit access to medical records.</p>`
    }
};

function showHop(name) {
    const info = hopInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    let badge = '';
    if (info.privacy === 'red') {
        badge = '<span class="info-badge badge-red">IDENTIFYING</span>';
    } else if (info.privacy === 'green') {
        badge = '<span class="info-badge badge-green">PSEUDONYMOUS</span>';
    }
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${badge}
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Eat-our-own-dog-food: every click emits an xAPI 'interacted' statement to
// the configured LRS, demonstrating the same pseudonymization the diagram
// teaches. The endpoint is configured via window.XAPI_LRS if present.
function emitInteractedStatement(hopName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { account: { homePage: 'https://textbook.example.org', name: 'stu-anon-reader' } },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/pseudonymization-pipeline#' + hopName,
            definition: {
                name: { 'en-US': 'Pipeline hop: ' + hopName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

// One-line hover hints supplement the click-to-reveal infobox.
const hoverHints = {
    LMS: 'Identifying — name, email, role live here',
    Launch: 'Pseudonymous — only stu-8f3a2b1c crosses the boundary',
    Emit: 'Pseudonymous — pseudonym goes into actor.account.name',
    LRS: 'Pseudonymous — statements stored by pseudonym',
    Dashboard: 'Pseudonymous — analytics work without identity',
    Reidentify: 'Identifying — audited lookup back to the LMS'
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

// Expose globally so Mermaid `click ... call showHop(...)` resolves it.
window.showHop = showHop;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
