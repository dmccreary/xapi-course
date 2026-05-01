// Context Activity Buckets — Parent / Grouping / Category / Other
// CANVAS_HEIGHT: 460
// Bloom: Understand (L2) — identify, explain
// Pattern: click-to-reveal definition (no animation; learner-paced)

const bucketInfo = {
    Statement: {
        title: 'Statement Object',
        relation: 'the main object',
        relationClass: 'center',
        body: `
            <p>This is the <b>Activity</b> the statement is fundamentally about — the
            "to what" of the Actor-Verb-Object triple. Here, that's the
            <b>Quadratics Quiz</b>.</p>
            <p>Everything else around it (the four buckets) lives inside
            <code>context.contextActivities</code>. They don't change <i>what</i>
            the statement is about; they tell you <i>where it sits</i> in the
            broader curriculum, profile, and learning experience.</p>
            <p>One main object. Up to four buckets, each holding a list of
            related activities. Click any bucket to see its job.</p>`
    },
    Parent: {
        title: 'Parent Context Activity',
        relation: 'directly contains',
        relationClass: 'parent',
        body: `
            <p>The <b>direct instructional container</b> of the main object — the
            immediate course, module, or lesson that the activity belongs to.</p>
            <p>Use <code>parent</code> when you can say: "If this thing exists,
            it exists <i>inside</i> that thing." A quiz lives inside a unit; a
            unit lives inside a course.</p>
            <p>This is the most-used bucket in the wild. It's what powers
            "rollup" analytics — completion and progress percentages at the
            module or course level.</p>
            <p>Example: <code>"parent": [{"id": "https://acme.edu/algebra-1/unit-5"}]</code></p>`
    },
    Grouping: {
        title: 'Grouping Context Activity',
        relation: 'is a member of',
        relationClass: 'grouping',
        body: `
            <p>A <b>set the activity is a member of</b> — but not its direct
            container. Think tags, cohorts, programs, or assessment series that
            cut across the course hierarchy.</p>
            <p>The Quadratics Quiz lives <i>in</i> Unit 5 (that's the parent),
            but it's also a <i>member of</i> "Formative Assessments — Q3 2026" —
            a logical grouping that includes formative assessments from many
            different units and courses.</p>
            <p>Use <code>grouping</code> when membership is a many-to-many
            relationship rather than a single owning container.</p>
            <p>Example: <code>"grouping": [{"id": "https://acme.edu/assessments/q3-2026-formative"}]</code></p>`
    },
    Category: {
        title: 'Category Context Activity',
        relation: 'conforms to',
        relationClass: 'category',
        body: `
            <p>An activity that <b>classifies</b> the statement — most often a
            <b>profile IRI</b> declaring which xAPI profile or specification the
            statement conforms to.</p>
            <p>This is how a statement says "I'm a CMI5 statement" or
            "I'm a statement in ACME's Math Profile v2." Profile-aware tools
            and dashboards filter on this bucket to apply the right validation
            rules and reports.</p>
            <p>The <code>category</code> bucket is <b>required</b> by some
            profiles (like CMI5). Forget it and your statement may technically
            be valid xAPI but invisible to profile-specific analytics.</p>
            <p>Example: <code>"category": [{"id": "https://acme.edu/profiles/math/v2"}]</code></p>`
    },
    Other: {
        title: 'Other Context Activity',
        relation: 'associated with',
        relationClass: 'other',
        body: `
            <p>The <b>catch-all</b> for activities related to the main object that
            don't fit Parent, Grouping, or Category. Prerequisites, co-requisites,
            adjacent activities in a flow — anything you want to record as
            "associated, but I'm not committing to a stronger relationship."</p>
            <p>Here, the Quadratics Quiz is associated with the
            <i>"Pre-class warm-up flow"</i> — it ran in the same session, but
            the warm-up isn't its parent, grouping, or profile.</p>
            <p>If you find yourself reaching for <code>other</code> a lot,
            consider whether your team should standardize on a custom
            <b>extension</b> instead — extensions can carry typed, structured
            data that <code>other</code> can't.</p>
            <p>Example: <code>"other": [{"id": "https://acme.edu/flows/pre-class-warmup"}]</code></p>`
    }
};

function showBucket(name) {
    const info = bucketInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    const relationBadge = info.relation
        ? `<span class="info-relation ${info.relationClass || ''}">${info.relation}</span>`
        : '';
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${relationBadge}
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Eat our own dog food: emit an xAPI 'interacted' statement when the reader
// clicks a node. Configured via window.XAPI_LRS if present; otherwise no-op.
function emitInteractedStatement(bucketName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/context-activity-buckets#' + bucketName,
            definition: {
                name: { 'en-US': 'Context activity bucket: ' + bucketName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

const hoverHints = {
    Statement: 'The activity the statement is about — click for an overview',
    Parent: 'directly contains — the immediate container',
    Grouping: 'is a member of — a set the activity belongs to',
    Category: 'conforms to — usually a profile IRI',
    Other: 'associated with — anything that does not fit the others'
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

window.showBucket = showBucket;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
