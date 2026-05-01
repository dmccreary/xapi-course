// Activity Naming and Occurrence Fields — interactive JSON highlight MicroSim
// CANVAS_HEIGHT: 540
// Bloom: Understand (L2) — distinguish, identify
// Pattern: hover/click annotated JSON fields to reveal which question each answers

const fieldDefs = {
    intro: {
        title: 'Five fields name an activity occurrence',
        color: '#475569',
        body: `<p>Click or hover any colored field on the left to learn which question it answers.</p>
               <p>Together, these five fields tell an LRS <em>exactly</em> which activity, which kind, which version, which attempt, and which host environment a learning event happened in.</p>
               <p><b>Try it:</b> toggle "Compare two attempts" to see what changes between two registrations of the same activity.</p>`
    },
    'object.id': {
        title: 'object.id',
        color: '#2563eb',
        question: 'Which activity?',
        body: `<p><b>Plain English:</b> <em>Which activity is this statement about?</em></p>
               <p><b>When to set:</b> Always. Every Activity object requires an <code>id</code> — and it must be a globally unique IRI.</p>
               <p><b>Stable across attempts:</b> If two learners take the same lesson on different days, the <code>object.id</code> is identical for both.</p>
               <p><b>Example:</b> <code>"https://textbook.example.org/chapters/quadratics"</code></p>`
    },
    'object.definition.type': {
        title: 'object.definition.type',
        color: '#16a34a',
        question: 'What kind of activity?',
        body: `<p><b>Plain English:</b> <em>What category of thing is this?</em> A lesson? A quiz question? A media clip?</p>
               <p><b>When to set:</b> Whenever you want LRS dashboards to group activities by type. Use a registered ADL or community type IRI when one exists.</p>
               <p><b>Why it matters:</b> Reports like "average score across all <i>assessments</i>" rely on this field to filter the right statements.</p>
               <p><b>Example:</b> <code>"http://adlnet.gov/expapi/activities/lesson"</code></p>`
    },
    'context.registration': {
        title: 'context.registration',
        color: '#ea580c',
        question: 'Which attempt?',
        body: `<p><b>Plain English:</b> <em>Which run-through of the activity is this?</em> One learner doing the same lesson three times produces three different registrations.</p>
               <p><b>When to set:</b> Whenever a learner can attempt the same activity more than once and you need to keep the attempts separate. Generate a fresh UUID at attempt start.</p>
               <p><b>Format:</b> A UUID (v4 recommended).</p>
               <p><b>Example:</b> <code>"6690e6c9-3ef0-4ed3-8b37-7f3964730bee"</code></p>`
    },
    'object.definition.revision': {
        title: 'object.definition.revision',
        color: '#9333ea',
        question: 'Which version of the activity?',
        body: `<p><b>Plain English:</b> <em>Which edition of this activity did the learner see?</em> When you fix a typo or rewrite a question, the revision changes.</p>
               <p><b>When to set:</b> Whenever the activity content has been edited since the last release and you want analytics to separate "before-fix" from "after-fix" data.</p>
               <p><b>Footgun:</b> If you forget to bump the revision after editing, all your old and new statements collapse into one bucket — you lose the ability to A/B compare.</p>
               <p><b>Example:</b> <code>"2024-09-15-edit-3"</code></p>`
    },
    'context.platform': {
        title: 'context.platform',
        color: '#dc2626',
        question: 'Which host environment?',
        body: `<p><b>Plain English:</b> <em>Where was this activity delivered?</em> The textbook site, the mobile app, an LMS, a kiosk?</p>
               <p><b>When to set:</b> Whenever the same activity can be delivered through more than one front-end. The platform string lets you slice analytics by delivery channel.</p>
               <p><b>Stable across attempts on the same channel:</b> Two attempts on the textbook site share <code>"intelligent-textbook"</code>; an attempt on a mobile app would say <code>"xapi-mobile-app"</code>.</p>
               <p><b>Example:</b> <code>"intelligent-textbook"</code></p>`
    }
};

// JSON template fragments. Each highlighted field is wrapped in a <span data-field="..."> for hover/click.
function buildSingleJSON(reg) {
    return `{
  <span class="json-key">"actor"</span>: { <span class="json-key">"mbox"</span>: <span class="json-string">"mailto:lin@example.edu"</span> },
  <span class="json-key">"verb"</span>: {
    <span class="json-key">"id"</span>: <span class="json-string">"http://adlnet.gov/expapi/verbs/completed"</span>,
    <span class="json-key">"display"</span>: { <span class="json-key">"en-US"</span>: <span class="json-string">"completed"</span> }
  },
  <span class="json-key">"object"</span>: {
    <span class="json-key">"objectType"</span>: <span class="json-string">"Activity"</span>,
    <span class="json-key">"id"</span>: <span class="hl hl-id" data-field="object.id"><span class="json-string">"https://textbook.example.org/chapters/quadratics"</span></span>,
    <span class="json-key">"definition"</span>: {
      <span class="json-key">"type"</span>: <span class="hl hl-type" data-field="object.definition.type"><span class="json-string">"http://adlnet.gov/expapi/activities/lesson"</span></span>,
      <span class="json-key">"revision"</span>: <span class="hl hl-rev" data-field="object.definition.revision"><span class="json-string">"2024-09-15-edit-3"</span></span>,
      <span class="json-key">"name"</span>: { <span class="json-key">"en-US"</span>: <span class="json-string">"Quadratics"</span> }
    }
  },
  <span class="json-key">"context"</span>: {
    <span class="json-key">"registration"</span>: <span class="hl hl-reg" data-field="context.registration"><span class="json-string">"${reg}"</span></span>,
    <span class="json-key">"platform"</span>: <span class="hl hl-plat" data-field="context.platform"><span class="json-string">"intelligent-textbook"</span></span>
  },
  <span class="json-key">"timestamp"</span>: <span class="json-string">"2024-09-15T14:23:10Z"</span>
}`;
}

const REG_A = '6690e6c9-3ef0-4ed3-8b37-7f3964730bee';
const REG_B = 'a1c4f9d8-22b7-4e15-9c6e-1f0d8a3b5e42';

function renderSingle() {
    const json = document.getElementById('json-display');
    json.innerHTML = `<pre class="json-block"><code>${buildSingleJSON(REG_A)}</code></pre>`;
    attachFieldHandlers();
    clearDiffEmphasis();
}

function renderCompare() {
    const json = document.getElementById('json-display');
    json.innerHTML = `
        <div class="compare-pair">
            <div class="compare-col">
                <div class="compare-label">Attempt 1 (registration A)</div>
                <pre class="json-block"><code>${buildSingleJSON(REG_A)}</code></pre>
            </div>
            <div class="compare-col">
                <div class="compare-label">Attempt 2 (registration B)</div>
                <pre class="json-block"><code>${buildSingleJSON(REG_B)}</code></pre>
            </div>
        </div>`;
    attachFieldHandlers();
    // emphasize that registration differs while activity id stays the same
    document.querySelectorAll('.hl-reg').forEach(el => el.classList.add('diff-changes'));
    document.querySelectorAll('.hl-id').forEach(el => el.classList.add('diff-stable'));
    showFieldInfo('context.registration');
}

function clearDiffEmphasis() {
    document.querySelectorAll('.diff-changes, .diff-stable').forEach(el => {
        el.classList.remove('diff-changes', 'diff-stable');
    });
}

function showFieldInfo(name) {
    const def = fieldDefs[name] || fieldDefs.intro;
    const display = document.getElementById('info-display');
    if (!display) return;
    const colorBar = `<div class="color-bar" style="background:${def.color}"></div>`;
    const questionLine = def.question
        ? `<div class="info-question">${def.question}</div>`
        : '';
    display.innerHTML = `
        ${colorBar}
        <div class="info-title">${def.title}</div>
        ${questionLine}
        <div class="info-content">${def.body}</div>
    `;
    // visually mark the active highlight
    document.querySelectorAll('.hl').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`.hl[data-field="${name}"]`).forEach(el => el.classList.add('active'));
    emitInteracted(name);
}

function attachFieldHandlers() {
    document.querySelectorAll('.hl').forEach(el => {
        const name = el.getAttribute('data-field');
        if (!name) return;
        el.addEventListener('mouseenter', () => showFieldInfo(name));
        el.addEventListener('click', () => showFieldInfo(name));
        el.addEventListener('focus', () => showFieldInfo(name));
        el.setAttribute('tabindex', '0');
    });
}

function emitInteracted(fieldName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
        object: {
            id: 'http://textbook.example.org/sims/activity-naming-and-occurrence-fields#' + fieldName,
            definition: { name: { 'en-US': 'Activity naming field: ' + fieldName } }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow */ }
}

function init() {
    const toggle = document.getElementById('compare-toggle');
    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                renderCompare();
            } else {
                renderSingle();
                showFieldInfo('intro');
            }
        });
    }
    renderSingle();
    showFieldInfo('intro');
}

window.showFieldInfo = showFieldInfo;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
