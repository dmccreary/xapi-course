// MicroSim Verb Explorer — recommended xAPI verbs for MicroSim interactions
// CANVAS_HEIGHT: 600
// Bloom: Understand (L2) — recall, explain, choose
// Pattern: click-to-reveal infobox (no animation; learner-paced)

// Curated set of 8 verbs (3 clusters) chosen to assess mastery of MicroSim
// concepts WITHOUT bloating the vocabulary. See index.md for the design notes
// and the verbs we deliberately left out.

const verbInfo = {
    Root: {
        title: 'Recommended Verbs for MicroSims',
        cluster: null,
        body: `
            <p>A MicroSim is a small interactive learning object — a p5.js simulation, a Mermaid diagram with click handlers, a Chart.js visualization, a vis-network graph, a vis-timeline, a Plotly plot, or an interactive infographic with hot-zone overlays.</p>
            <p>This explorer recommends a tight set of <b>eight</b> xAPI verbs that cover almost every MicroSim interaction worth tracking — without drowning your analytics in verb sprawl.</p>
            <p>Click any cluster for the design rationale, or any verb for its IRI, when-to-emit rule, the MicroSim types that typically emit it, and an example statement.</p>`
    },
    Session: {
        title: 'Session',
        cluster: true,
        body: `
            <p>Three verbs that bracket a MicroSim session. They answer "did the learner open this sim, and how did the session end?"</p>
            <p>Members: <code>launched</code>, <code>initialized</code>, <code>terminated</code>.</p>
            <p>Pair these with a <code>context.registration</code> UUID so you can stitch the session back together later. The duration between <code>initialized</code> and <code>terminated</code> is your most reliable "time on sim" measure.</p>`
    },
    Engagement: {
        title: 'Engagement',
        cluster: true,
        body: `
            <p>The two workhorse verbs for MicroSim instrumentation. <b>Almost every MicroSim emits at least one of these.</b></p>
            <p>Members: <code>experienced</code>, <code>interacted</code>.</p>
            <p>Use <code>experienced</code> for passive viewing (a MicroSim opened to its default state). Use <code>interacted</code> for any control change — Start/Pause buttons, sliders, dropdowns, clicked nodes, hot-zone clicks, hovered chart regions.</p>`
    },
    Mastery: {
        title: 'Mastery',
        cluster: true,
        body: `
            <p>The verbs that turn an exploratory sim into an assessable learning object. Skip them for purely exploratory MicroSims; emit them when the sim has a learning goal.</p>
            <p>Members: <code>answered</code>, <code>completed</code>, <code>passed</code>.</p>
            <p>If you only emit one mastery verb per sim, make it <code>completed</code> — and pair it with <code>result.completion: true</code>.</p>`
    },

    launched: {
        title: 'launched',
        cluster: 'Session',
        iri: 'http://adlnet.gov/expapi/verbs/launched',
        definition: 'A launching system (LMS, portal, parent course page) initiated the MicroSim startup sequence.',
        whenToEmit: 'From the launching platform <i>before</i> the MicroSim itself loads. Most MicroSim authors don\'t emit this — the LMS does.',
        emittedBy: 'LMS / portal launching the MicroSim. The MicroSim itself usually does NOT emit launched.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/launched",
    "display": { "en-US": "launched" }
  },
  "object": { "id": "https://textbook.example.org/sims/projectile-motion" }
}`
    },
    initialized: {
        title: 'initialized',
        cluster: 'Session',
        iri: 'http://adlnet.gov/expapi/verbs/initialized',
        definition: 'The MicroSim has loaded, set up its initial state, and is ready for the learner.',
        whenToEmit: 'Once, from inside the MicroSim, after setup() / DOMContentLoaded handlers have run and before any user interaction.',
        emittedBy: 'Every MicroSim type — p5.js, Mermaid, Chart.js, vis-network, vis-timeline, Plotly, infographic-overlay.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/initialized",
    "display": { "en-US": "initialized" }
  },
  "object": { "id": "https://textbook.example.org/sims/projectile-motion" }
}`
    },
    terminated: {
        title: 'terminated',
        cluster: 'Session',
        iri: 'http://adlnet.gov/expapi/verbs/terminated',
        definition: 'The MicroSim session ended cleanly — by learner choice, navigation away with a beforeunload handler, or programmatic close.',
        whenToEmit: 'On <code>beforeunload</code> or when the learner explicitly exits. Always paired with the earlier <code>initialized</code>.',
        emittedBy: 'MicroSim types that can detect unload — usually any type embedded in a controlled launcher; harder for plain iframe embeds.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/terminated",
    "display": { "en-US": "terminated" }
  },
  "object": { "id": "https://textbook.example.org/sims/projectile-motion" },
  "result": {
    "duration": "PT4M27S"
  }
}`
    },

    experienced: {
        title: 'experienced',
        cluster: 'Engagement',
        iri: 'http://adlnet.gov/expapi/verbs/experienced',
        definition: 'The learner saw the MicroSim or a region of it without engaging — a "this rendered to screen" signal.',
        whenToEmit: 'When a MicroSim opens to a default state and the learner views without touching anything, or when a hot zone enters the viewport.',
        emittedBy: 'Infographic-overlay (regions scrolled into view), Chart.js (chart rendered), vis-timeline (range visible), Mermaid (diagram rendered).',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/experienced",
    "display": { "en-US": "experienced" }
  },
  "object": {
    "id": "https://textbook.example.org/sims/cell-anatomy#nucleus-region",
    "definition": { "name": { "en-US": "Cell Anatomy — nucleus region" } }
  }
}`
    },
    interacted: {
        title: 'interacted',
        cluster: 'Engagement',
        iri: 'http://adlnet.gov/expapi/verbs/interacted',
        definition: 'The learner physically engaged with a MicroSim control — Start/Pause buttons, sliders, dropdowns, clicked nodes, hot zones, hovered chart points.',
        whenToEmit: 'On every meaningful control change. <b>This is the most-used MicroSim verb.</b> Keep payloads small — it fires often.',
        emittedBy: 'Every MicroSim type. p5.js (Start/Pause buttons, parameter sliders), Mermaid (clicked nodes), Chart.js (hovered points), vis-network (selected nodes/edges), vis-timeline (clicked events), Plotly (zoom/select), infographic-overlay (hot-zone clicks).',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/interacted",
    "display": { "en-US": "interacted" }
  },
  "object": {
    "id": "https://textbook.example.org/sims/projectile-motion#start-button",
    "definition": { "type": "http://adlnet.gov/expapi/activities/interaction" }
  },
  "result": {
    "extensions": {
      "https://example.org/x/control": "start",
      "https://example.org/x/angle-deg": 45
    }
  }
}`
    },

    answered: {
        title: 'answered',
        cluster: 'Mastery',
        iri: 'http://adlnet.gov/expapi/verbs/answered',
        definition: 'The learner responded to a question or prompt embedded in the MicroSim — a "what does this region represent?" click, a multiple-choice overlay, a numeric estimate.',
        whenToEmit: 'On submission of an embedded question. Pair with <code>result.response</code> and <code>result.success</code>.',
        emittedBy: 'Quiz-style p5.js sims, infographic-overlay sims with "name this region" prompts, Mermaid sims with "click the verb that means X" prompts.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/answered",
    "display": { "en-US": "answered" }
  },
  "object": {
    "id": "https://textbook.example.org/sims/cell-anatomy/q1",
    "definition": {
      "type": "http://adlnet.gov/expapi/activities/cmi.interaction",
      "interactionType": "choice",
      "correctResponsesPattern": ["nucleus"]
    }
  },
  "result": {
    "response": "nucleus",
    "success": true
  }
}`
    },
    completed: {
        title: 'completed',
        cluster: 'Mastery',
        iri: 'http://adlnet.gov/expapi/verbs/completed',
        definition: 'The learner finished the MicroSim according to the activity provider\'s definition of completion — reached the end state, met the goal, or worked through every required region.',
        whenToEmit: 'ONLY when the AP-defined completion condition is met. <b>Never on page unload.</b> Always pair with <code>result.completion: true</code>.',
        emittedBy: 'Goal-driven MicroSims of any type. p5.js (e.g., particle simulation reached steady state), infographic-overlay (all hot zones explored), Mermaid (all canonical verbs visited), vis-timeline (all events reviewed).',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": { "en-US": "completed" }
  },
  "object": { "id": "https://textbook.example.org/sims/cell-anatomy" },
  "result": {
    "completion": true,
    "duration": "PT6M12S"
  }
}`
    },
    passed: {
        title: 'passed',
        cluster: 'Mastery',
        iri: 'http://adlnet.gov/expapi/verbs/passed',
        definition: 'The learner met the success threshold for an assessable MicroSim — got a sufficient fraction of embedded questions correct, or hit a target state with a high enough score.',
        whenToEmit: 'When the MicroSim has a defined success threshold and the learner crossed it. Pair with <code>result.success: true</code> and a score.',
        emittedBy: 'MicroSims used as assessments. Quiz-style p5.js, infographic-overlay with scored region identification, Mermaid drag-and-classify sims.',
        example: `{
  "actor": { "mbox": "mailto:lin@example.edu" },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/passed",
    "display": { "en-US": "passed" }
  },
  "object": { "id": "https://textbook.example.org/sims/cell-anatomy" },
  "result": {
    "success": true,
    "completion": true,
    "score": { "scaled": 0.88 }
  }
}`
    }
};

const clusterColors = {
    'Session':     '#b45309',
    'Engagement':  '#4338ca',
    'Mastery':     '#be185d'
};

function showVerbInfo(name) {
    const info = verbInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;

    if (info.cluster === null || info.cluster === true) {
        display.innerHTML = `
            <div class="info-title">${info.title}</div>
            ${info.cluster ? '<span class="info-tag tag-cluster">CLUSTER</span>' : ''}
            <div class="info-content">${info.body}</div>
        `;
    } else {
        const color = clusterColors[info.cluster] || '#475569';
        display.innerHTML = `
            <div class="info-title">${info.title}</div>
            <span class="info-tag tag-verb" style="background:${color}">${info.cluster}</span>
            <div class="info-content">
                <p><b>IRI:</b> <code>${info.iri}</code></p>
                <p><b>Definition.</b> ${info.definition}</p>
                <p><b>When to emit.</b> ${info.whenToEmit}</p>
                <p><b>Typically emitted by.</b> ${info.emittedBy}</p>
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
            id: 'http://textbook.example.org/sims/microsim-verb-explorer#' + name,
            definition: {
                name: { 'en-US': 'MicroSim verb explorer node: ' + name },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

const hoverHints = {
    Root: 'Eight recommended verbs for MicroSim interactions',
    Session: 'Bracket the session — launched, initialized, terminated',
    Engagement: 'The workhorses — experienced, interacted',
    Mastery: 'Assessment signals — answered, completed, passed',
    launched: 'LMS started the sim (rarely emitted by the sim itself)',
    initialized: 'Sim loaded and ready — every type emits this',
    terminated: 'Clean session end — pair with duration',
    experienced: 'Saw without engaging — passive view',
    interacted: 'Touched a control — most-used MicroSim verb',
    answered: 'Responded to an embedded prompt — pair with result.response',
    completed: 'Hit the AP-defined goal — pair with result.completion',
    passed: 'Met the success threshold — pair with result.success and score'
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

window.showVerbInfo = showVerbInfo;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
