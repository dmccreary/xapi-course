// Hosting Model Decision Tree MicroSim
// CANVAS_HEIGHT: 620
// Bloom: Evaluate (L5) — apply criteria to choose hosting model
// Pattern: click-to-reveal explanation per node (decision steps + outcome platforms)

const nodeInfo = {
    Start: {
        title: 'New deployment',
        kind: 'start',
        body: `
            <p>You're standing at the trailhead with a fresh xAPI project and three plausible hosting paths in front of you: <b>hosted SaaS</b>, <b>self-hosted open source</b>, and <b>embedded</b>.</p>
            <p>The decision tree on the left walks you through four questions, in order. Each question eliminates options that don't fit your constraints, so by the time you reach an outcome, the remaining choice is the one your situation actually allows.</p>
            <p>Click any diamond to read why that question matters, or jump to an outcome to see which platforms typically fit there.</p>`
    },
    Q1: {
        title: 'Is the device often offline?',
        kind: 'decision',
        body: `
            <p>Some learners spend most of their time without a reliable network — field technicians, military trainees, students in low-connectivity regions, factory-floor workers, simulators on aircraft.</p>
            <p>If statements have to be captured <i>during</i> the activity and uploaded later, you need an LRS that can run <b>on-device</b> and sync upstream when a connection appears. Centralized hosting (SaaS or self-hosted) can't help you if there's no network at the moment of learning.</p>
            <p><b>Yes</b> → Embedded LRS with sync. <b>No</b> → continue down the tree.</p>`
    },
    Q2: {
        title: 'Does data sovereignty / regulation forbid third-party hosting?',
        kind: 'decision',
        body: `
            <p>Some sectors — defense, healthcare, certain government education systems, EU data with GDPR constraints, jurisdictions with strict residency laws — cannot send learner records to a third-party SaaS provider, even one with the right certifications.</p>
            <p>If a regulator, contract, or data-protection officer says learner data must stay on infrastructure <i>you control</i>, hosted SaaS is off the table by policy, regardless of cost or convenience.</p>
            <p><b>Yes</b> → Self-hosted open source. <b>No</b> → continue.</p>`
    },
    Q3: {
        title: 'Do we have ops capacity to run a database 24/7?',
        kind: 'decision',
        body: `
            <p>An LRS is a database-backed web service. Self-hosting it means somebody on your team is on the hook for backups, security patches, monitoring, scaling, certificate renewals, and the 2 a.m. page when the disk fills up.</p>
            <p>Many teams underestimate this cost. If you don't have an ops or DevOps function — and the budget to feed it — running an LRS yourself becomes a slow drain on the same engineers who should be building learning experiences.</p>
            <p><b>No</b> → Hosted SaaS LRS. <b>Yes</b> → continue.</p>`
    },
    Q4: {
        title: 'Is projected statement volume above 5k/sec sustained?',
        kind: 'decision',
        body: `
            <p>Most deployments will never see this load. A typical academic LMS generates dozens of statements per second at peak, not thousands. But large-scale corporate training, military simulation networks, or massively-multiplayer learning platforms can sustain very high write rates.</p>
            <p>At sustained volumes above ~5,000 statements/sec, hosted SaaS pricing tiers and architectural ceilings start to bite. A self-hosted, horizontally scaled stack (Ralph on ClickHouse, or a tuned Learning Locker cluster) is usually the better fit.</p>
            <p><b>Yes</b> → Self-hosted, scale-out. <b>No</b> → either fits.</p>`
    },
    Embedded: {
        title: 'Embedded LRS (with sync to central)',
        kind: 'outcome',
        body: `
            <p>The LRS runs <b>on the device</b> — phone, tablet, simulator, kiosk — capturing statements locally and pushing them to a central LRS when the network returns.</p>
            <p><b>Typical platforms:</b></p>
            <ul>
                <li><code>GrassBlade Lite</code> on mobile</li>
                <li><code>cmi5</code> launcher with offline buffering</li>
                <li>Custom Sqlite-backed LRS embedded inside a training app</li>
            </ul>
            <p><b>Watch for:</b> conflict resolution and de-duplication when devices sync stale-but-valid statements after long offline periods.</p>`
    },
    SelfHostedSov: {
        title: 'Self-hosted open source',
        kind: 'outcome',
        body: `
            <p>You install and operate the LRS on infrastructure your organization controls — on-prem, in your private cloud, or in a sovereign cloud region.</p>
            <p><b>Typical platforms:</b></p>
            <ul>
                <li><code>Ralph</code> (FUN, France Université Numérique — ClickHouse-backed)</li>
                <li><code>Learning Locker</code> Community Edition</li>
                <li><code>Yet Analytics SQL LRS</code></li>
            </ul>
            <p><b>Trade-off:</b> full data control in exchange for taking on ops, patching, and scaling yourself.</p>`
    },
    SaaS: {
        title: 'Hosted SaaS LRS',
        kind: 'outcome',
        body: `
            <p>A vendor runs the LRS for you. You authenticate, point your statements at their endpoint, and let their team handle uptime, scaling, backups, and compliance certifications.</p>
            <p><b>Typical platforms:</b></p>
            <ul>
                <li><code>Watershed LRS</code></li>
                <li><code>SCORM Cloud</code> (Rustici)</li>
                <li><code>Veracity Learning</code> hosted</li>
                <li><code>GrassBlade Cloud</code></li>
            </ul>
            <p><b>Trade-off:</b> fastest path to production and lowest ops burden, in exchange for monthly cost and external data residency.</p>`
    },
    SelfHostedScale: {
        title: 'Self-hosted open source (scaled)',
        kind: 'outcome',
        body: `
            <p>At sustained high volume, the unit economics flip: a horizontally scaled self-hosted cluster usually costs less than per-statement SaaS pricing, and you control the storage engine.</p>
            <p><b>Typical platforms:</b></p>
            <ul>
                <li><code>Ralph</code> on ClickHouse (designed for billions of statements)</li>
                <li>Scaled <code>Learning Locker</code> cluster on MongoDB shards</li>
                <li>Custom LRS on a columnar warehouse for analytics-first workloads</li>
            </ul>
            <p><b>Investment:</b> requires a team comfortable operating distributed databases at scale.</p>`
    },
    EitherFits: {
        title: 'Hosted SaaS or self-hosted (either fits)',
        kind: 'outcome',
        body: `
            <p>You're in the comfortable middle: connected devices, no sovereignty blocker, ops capacity if you want it, modest volume. Both hosted SaaS and self-hosted open source are viable.</p>
            <p><b>Decide on secondary factors:</b></p>
            <ul>
                <li><b>SaaS</b> if speed-to-launch and low ops overhead matter more than monthly cost.</li>
                <li><b>Self-hosted</b> if you want full control, custom integrations, or expect data volume to grow into the next tier.</li>
            </ul>
            <p>This is the path most academic and mid-size corporate deployments end up on.</p>`
    }
};

function showHostingNode(name) {
    const info = nodeInfo[name];
    const display = document.getElementById('info-display');
    if (!info || !display) return;
    let badge = '';
    if (info.kind === 'decision') {
        badge = '<span class="info-required req-decision">DECISION</span>';
    } else if (info.kind === 'outcome') {
        badge = '<span class="info-required req-outcome">OUTCOME</span>';
    } else if (info.kind === 'start') {
        badge = '<span class="info-required req-start">START</span>';
    }
    display.innerHTML = `
        <div class="info-title">${info.title}</div>
        ${badge}
        <div class="info-content">${info.body}</div>
    `;
    emitInteractedStatement(name);
}

// Emit an xAPI 'interacted' statement when a node is clicked.
function emitInteractedStatement(nodeName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: 'http://textbook.example.org/sims/hosting-model-decision-tree#' + nodeName,
            definition: {
                name: { 'en-US': 'Hosting decision node: ' + nodeName },
                type: 'http://adlnet.gov/expapi/activities/interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) { /* swallow — not critical */ }
}

const hoverHints = {
    Start: 'Begin here — a fresh xAPI deployment',
    Q1: 'Decision: offline devices?',
    Q2: 'Decision: data sovereignty / regulation',
    Q3: 'Decision: ops capacity for 24/7 database',
    Q4: 'Decision: sustained statement volume',
    Embedded: 'Outcome — Embedded LRS with sync',
    SelfHostedSov: 'Outcome — Self-hosted open source',
    SaaS: 'Outcome — Hosted SaaS LRS',
    SelfHostedScale: 'Outcome — Self-hosted, scaled',
    EitherFits: 'Outcome — Either SaaS or self-hosted fits'
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

// Expose globally so Mermaid `click ... call showHostingNode(...)` can resolve it.
window.showHostingNode = showHostingNode;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
    setTimeout(waitForMermaid, 100);
}
