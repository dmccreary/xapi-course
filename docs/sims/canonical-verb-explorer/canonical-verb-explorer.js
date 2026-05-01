// Canonical Verb Explorer — twelve ADL verbs grouped by lifecycle role
// CANVAS_HEIGHT: 600
// Bloom: Understand (L2) — recall, explain
// Pattern: click-to-reveal infobox (no animation; learner-paced)

const verbInfo = {
    Root: {
        title: 'Canonical xAPI Verbs',
        cluster: null,
        body: `
            <p>The ADL Verb Registry hosts a small set of canonical verbs that almost every intelligent textbook reuses.</p>
            <p>Twelve of them cover the lifecycle of a typical learning session, grouped here into four roles:
            <b>Content Consumption</b>, <b>Assessment</b>, <b>Progress</b>, and <b>Session Lifecycle</b>.</p>
            <p>Click any verb to see its full IRI, definition, when to emit it, and a complete example statement.</p>`
    },
    ContentConsumption: {
        title: 'Content Consumption',
        cluster: true,
        body: `
            <p>Verbs that record what a learner <i>encountered</i> — the lightweight signals you emit while a learner is moving through content.</p>
            <p>Members: <code>experienced</code>, <code>interacted</code>.</p>
            <p>Use these when you want to know <b>"did the learner see this?"</b> or <b>"did the learner touch this control?"</b> — without making any claim about success or completion.</p>`
    },
    Assessment: {
        title: 'Assessment',
        cluster: true,
        body: `
            <p>Verbs that record <i>how performance was judged</i>. These are the verbs that drive grade reports, mastery dashboards, and pass/fail analytics.</p>
            <p>Members: <code>attempted</code>, <code>passed</code>, <code>failed</code>, <code>scored</code>.</p>
            <p>Pair them with a <code>result</code> object (<code>success</code>, <code>score.scaled</code>) so downstream consumers can compute pass rates and score distributions.</p>`
    },
    Progress: {
        title: 'Progress',
        cluster: true,
        body: `
            <p>Verbs that record <i>movement through</i> an activity — milestones reached, finish lines crossed.</p>
            <p>Members: <code>progressed</code>, <code>completed</code>.</p>
            <p>Use <code>progressed</code> for milestone events with a percentage extension; reserve <code>completed</code> for the activity provider's own definition of done (and pair it with <code>result.completion: true</code>).</p>`
    },
    SessionLifecycle: {
        title: 'Session Lifecycle',
        cluster: true,
        body: `
            <p>Verbs that bracket a session — when content launched, started, ended cleanly, or got abandoned.</p>
            <p>Members: <code>launched</code>, <code>initialized</code>, <code>terminated</code>, <code>abandoned</code>.</p>
            <p>These are the backbone of CMI5 conformance: a clean session opens with <code>initialized</code> and closes with either <code>terminated</code> or (server-detected) <code>abandoned</code>.</p>`
    },

    experienced: {
        title: 'experienced',
        cluster: 'Content Consumption',
        iri: 'http://adlnet.gov/expapi/verbs/experienced',
        definition: 'The learner encountered or was exposed to an activity, with no claim about engagement or success.',
        whenToEmit: 'On page view, video play, or any "the learner saw this" signal.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/experienced",
    "display": { "en-US": "experienced" }
  },
  "object": {
    "id": "https://textbook.example.org/chapters/intro",
    "definition": { "name": { "en-US": "Chapter 1: Introduction" } }
  }
}`
    },
    interacted: {
        title: 'interacted',
        cluster: 'Content Consumption',
        iri: 'http://adlnet.gov/expapi/verbs/interacted',
        definition: 'The learner physically engaged with an activity component — slider, button, simulation parameter — without implying completion or evaluation.',
        whenToEmit: 'Whenever a control changes value or a learner clicks an interactive element. Keep the payload small; this verb fires often.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/interacted",
    "display": { "en-US": "interacted" }
  },
  "object": {
    "id": "https://textbook.example.org/sims/newtons-2nd-law#mass-slider",
    "definition": { "type": "http://adlnet.gov/expapi/activities/interaction" }
  },
  "result": { "extensions": { "https://example.org/x/value": 12.5 } }
}`
    },

    attempted: {
        title: 'attempted',
        cluster: 'Assessment',
        iri: 'http://adlnet.gov/expapi/verbs/attempted',
        definition: 'The learner began an assessed activity with intent to engage with it — the marker that an assessment session has started.',
        whenToEmit: 'At the moment a quiz, exercise, or assessed simulation opens — before any scored interactions.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/attempted",
    "display": { "en-US": "attempted" }
  },
  "object": {
    "id": "https://textbook.example.org/quizzes/chapter-04",
    "definition": { "type": "http://adlnet.gov/expapi/activities/assessment" }
  }
}`
    },
    passed: {
        title: 'passed',
        cluster: 'Assessment',
        iri: 'http://adlnet.gov/expapi/verbs/passed',
        definition: 'The learner met or exceeded the success criterion for an assessed activity.',
        whenToEmit: 'When the activity provider has computed success and the learner met threshold. Pair with <code>result.success: true</code> and a score.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/passed",
    "display": { "en-US": "passed" }
  },
  "object": { "id": "https://textbook.example.org/quizzes/chapter-04" },
  "result": {
    "success": true,
    "completion": true,
    "score": { "scaled": 0.85 }
  }
}`
    },
    failed: {
        title: 'failed',
        cluster: 'Assessment',
        iri: 'http://adlnet.gov/expapi/verbs/failed',
        definition: "The learner's performance did not meet the success criterion for an assessed activity.",
        whenToEmit: 'When the AP has computed success and the learner did NOT meet threshold. Pair with <code>result.success: false</code>.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/failed",
    "display": { "en-US": "failed" }
  },
  "object": { "id": "https://textbook.example.org/quizzes/chapter-04" },
  "result": {
    "success": false,
    "completion": true,
    "score": { "scaled": 0.55 }
  }
}`
    },
    scored: {
        title: 'scored',
        cluster: 'Assessment',
        iri: 'http://adlnet.gov/expapi/verbs/scored',
        definition: 'A specific scoring event within an activity — typically a single graded item — distinct from the overall pass/fail verdict.',
        whenToEmit: 'When you grade one question, one rubric item, or one part of a larger assessment.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/scored",
    "display": { "en-US": "scored" }
  },
  "object": {
    "id": "https://textbook.example.org/quizzes/chapter-04/q3",
    "definition": { "type": "http://adlnet.gov/expapi/activities/cmi.interaction" }
  },
  "result": { "score": { "raw": 1, "max": 1 } }
}`
    },

    progressed: {
        title: 'progressed',
        cluster: 'Progress',
        iri: 'http://adlnet.gov/expapi/verbs/progressed',
        definition: 'The learner advanced a measurable distance through an activity — a chapter, a module section, or a simulation phase.',
        whenToEmit: 'On milestone events. Carry the distance in <code>result.extensions</code> (e.g., a percentage 0.0–1.0).',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/progressed",
    "display": { "en-US": "progressed" }
  },
  "object": { "id": "https://textbook.example.org/chapters/04" },
  "result": {
    "extensions": {
      "https://w3id.org/xapi/cmi5/result/extensions/progress": 0.5
    }
  }
}`
    },
    completed: {
        title: 'completed',
        cluster: 'Progress',
        iri: 'http://adlnet.gov/expapi/verbs/completed',
        definition: "The learner finished an activity according to the activity provider's definition of completion.",
        whenToEmit: 'ONLY when the AP-defined completion condition is met. Always pair with <code>result.completion: true</code>. Never fire on page unload.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": { "en-US": "completed" }
  },
  "object": { "id": "https://textbook.example.org/chapters/04" },
  "result": { "completion": true }
}`
    },

    launched: {
        title: 'launched',
        cluster: 'Session Lifecycle',
        iri: 'http://adlnet.gov/expapi/verbs/launched',
        definition: 'A system or user initiated the startup sequence of an activity — typically sent by the launching platform before the activity itself begins.',
        whenToEmit: 'From the LMS or portal at the moment it kicks off the launch (LTI, deep link, cmi5 launch URL).',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/launched",
    "display": { "en-US": "launched" }
  },
  "object": { "id": "https://textbook.example.org/sims/newtons-2nd-law" }
}`
    },
    initialized: {
        title: 'initialized',
        cluster: 'Session Lifecycle',
        iri: 'http://adlnet.gov/expapi/verbs/initialized',
        definition: 'The activity content has loaded and initialized successfully on the learner\'s device — the official start of a session.',
        whenToEmit: 'From the activity itself, once setup is done and the learner is ready to begin. Required by CMI5.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/initialized",
    "display": { "en-US": "initialized" }
  },
  "object": { "id": "https://textbook.example.org/sims/newtons-2nd-law" }
}`
    },
    terminated: {
        title: 'terminated',
        cluster: 'Session Lifecycle',
        iri: 'http://adlnet.gov/expapi/verbs/terminated',
        definition: 'The activity content has cleanly ended a session — by learner choice or programmatic close.',
        whenToEmit: 'Before the activity unloads, after any final state has been saved. Pairs with the earlier <code>initialized</code>.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/terminated",
    "display": { "en-US": "terminated" }
  },
  "object": { "id": "https://textbook.example.org/sims/newtons-2nd-law" }
}`
    },
    abandoned: {
        title: 'abandoned',
        cluster: 'Session Lifecycle',
        iri: 'http://adlnet.gov/expapi/verbs/abandoned',
        definition: 'A session ended without a clean termination — typically because the learner closed the tab without finishing.',
        whenToEmit: 'NOT by the learner\'s client. Emitted server-side when an <code>initialized</code> session has no <code>terminated</code> within a timeout window.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/abandoned",
    "display": { "en-US": "abandoned" }
  },
  "object": { "id": "https://textbook.example.org/sims/newtons-2nd-law" },
  "context": {
    "extensions": {
      "https://w3id.org/xapi/cmi5/context/extensions/sessionid": "abc-123"
    }
  }
}`
    }
};

const clusterColors = {
    'Content Consumption': '#4338ca',
    'Assessment': '#be185d',
    'Progress': '#0d9488',
    'Session Lifecycle': '#b45309'
};

function showVerbInfo(name) {
    const info = verbInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;

    if (info.cluster === null || info.cluster === true) {
        // Root or cluster node — overview content only.
        display.innerHTML = `
            <div class="info-title">${info.title}</div>
            ${info.cluster ? '<span class="info-tag tag-cluster">CLUSTER</span>' : ''}
            <div class="info-content">${info.body}</div>
        `;
    } else {
        // Verb leaf node — full IRI, definition, when to emit, example statement.
        const color = clusterColors[info.cluster] || '#475569';
        display.innerHTML = `
            <div class="info-title">${info.title}</div>
            <span class="info-tag tag-verb" style="background:${color}">${info.cluster}</span>
            <div class="info-content">
                <p><b>IRI:</b> <code>${info.iri}</code></p>
                <p><b>Definition.</b> ${info.definition}</p>
                <p><b>When to emit.</b> ${info.whenToEmit}</p>
                <p><b>Example statement:</b></p>
                <pre>${info.example}</pre>
            </div>
        `;
    }
    emitInteractedStatement(name);
}

// Demonstrate the standard the textbook is teaching: emit an xAPI 'interacted'
// statement when the reader clicks a verb. The endpoint is configured via the
// global window.XAPI_LRS object if present; otherwise this is a no-op.
function emitInteractedStatement(name) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/canonical-verb-explorer#' + name,
            definition: {
                name: { 'en-US': 'Canonical verb explorer node: ' + name },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

const hoverHints = {
    Root: 'The twelve canonical verbs — click any leaf for details',
    ContentConsumption: 'Verbs for "what did the learner encounter?"',
    Assessment: 'Verbs for "how was performance judged?"',
    Progress: 'Verbs for "how far did the learner get?"',
    SessionLifecycle: 'Verbs that bracket a session',
    experienced: 'The learner saw it — no engagement claim',
    interacted: 'The learner touched a control — fires often',
    attempted: 'Assessment session started',
    passed: 'Met the success criterion',
    failed: 'Did not meet the success criterion',
    scored: 'A single graded item within an assessment',
    progressed: 'Reached a milestone — carry % in extension',
    completed: 'AP-defined done — pair with result.completion',
    launched: 'Sent by the launching platform (LMS)',
    initialized: 'Sent by the activity once it is ready',
    terminated: 'Clean session end',
    abandoned: 'Session timed out without a clean end'
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

// Expose globally so Mermaid `click ... call showVerbInfo(...)` can resolve it.
window.showVerbInfo = showVerbInfo;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
