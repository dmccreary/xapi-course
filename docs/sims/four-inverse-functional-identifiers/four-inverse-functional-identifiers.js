// The Four Inverse Functional Identifiers — IFI comparison MicroSim
// CANVAS_HEIGHT: 600
// Bloom: Evaluating (L5) — compare, select
// Pattern: 2x2 card grid (p5.js) + HTML side panel + preset scenario buttons

// Canvas dimensions — the p5 canvas occupies a dedicated card-area container
// (left 2/3 of the layout). The right 1/3 is an HTML side panel; the top row
// is HTML preset-scenario buttons.
let canvasWidth = 600;       // Will be reset from the .card-area container width
let drawHeight = 540;        // Full canvas height (card grid only — no preset bar inside canvas)
let canvasHeight = drawHeight;
let margin = 16;

let mouseOverCanvas = false;
let hoveredCard = -1;
let selectedCard = 0;        // start with mbox selected so panel isn't empty

// --- IFI data --------------------------------------------------------------
const ifis = [
    {
        key: 'mbox',
        name: 'mbox',
        privacy: 'red',
        privacyLabel: 'DIRECT IDENTIFIER',
        summary: 'A mailto: IRI containing the learner\'s actual email address.',
        example: '{\n  "mbox": "mailto:alice@school.edu",\n  "name": "Alice"\n}',
        full: 'mbox is the simplest IFI — a mailto: IRI carrying the learner\'s real email address. It is human-readable, trivial to debug, and works without any extra infrastructure.',
        whenToUse: 'Adult learners with institutional email accounts, internal pilots, debugging dashboards, and contexts where you already have lawful basis to store the email address.',
        whenNotToUse: 'Children (COPPA, FERPA), public LRSs, any deployment where the email address would leak PII outside the organization. Once an mbox lands in the LRS it is permanently joined to every statement the learner ever sent.',
        worked: 'agent = {\n  "mbox": "mailto:alice@school.edu",\n  "name": "Alice Lee",\n  "objectType": "Agent"\n}'
    },
    {
        key: 'mbox_sha1sum',
        name: 'mbox_sha1sum',
        privacy: 'yellow',
        privacyLabel: 'REVERSIBLE HASH',
        summary: 'The SHA-1 hash of "mailto:" + the learner\'s lowercased email.',
        example: '{\n  "mbox_sha1sum":\n    "ebd31e95054c..."\n}',
        full: 'mbox_sha1sum hashes the mailto: IRI with SHA-1, so the LRS never sees the raw address. Two providers that hash the same email produce the same hash, allowing cross-system joins without sharing PII directly.',
        whenToUse: 'Cross-organization analytics where you want a stable join key but cannot share raw email. Compliance contexts that require pseudonymization but still need linkability across systems.',
        whenNotToUse: 'Treat as anonymous data — it is NOT. A short rainbow table reverses any common email in seconds. Never publish mbox_sha1sum data to an unauthenticated audience and never use it for child accounts.',
        worked: 'const mbox = "mailto:alice@school.edu";\nconst sha1 = sha1Hex(mbox.toLowerCase());\nagent = { "mbox_sha1sum": sha1 };'
    },
    {
        key: 'openid',
        name: 'openid',
        privacy: 'yellow',
        privacyLabel: 'FEDERATED IDENTITY',
        summary: 'A URL identifying the learner via an OpenID/OIDC provider.',
        example: '{\n  "openid":\n    "https://idp.school.edu/u/42"\n}',
        full: 'openid is a URL-shaped IFI tied to an OpenID Connect provider. The IdP — not the LRS — owns the canonical identity, and the learner can be looked up via the standard discovery endpoint.',
        whenToUse: 'Enterprise and university deployments that already have OIDC SSO. You get one identity per learner across every tool that federates with the IdP, with no PII in the LRS itself.',
        whenNotToUse: 'Deployments without an existing IdP — standing one up just to satisfy xAPI is overkill. Also avoid when the OpenID URL itself encodes PII (e.g., contains the username).',
        worked: 'agent = {\n  "openid": "https://idp.school.edu/u/42",\n  "objectType": "Agent"\n}'
    },
    {
        key: 'account',
        name: 'account',
        privacy: 'green',
        privacyLabel: 'CONFIGURABLE',
        summary: 'A {homePage, name} pair — opaque ID scoped to a system.',
        example: '{\n  "account": {\n    "homePage": "https://lms.k12.us",\n    "name": "student-7f3c"\n  }\n}',
        full: 'account is a structured IFI: a homePage URL identifying the issuing system, and a name that is unique within that system. The name can be a UUID, a sequence number, or any opaque token — making this the most privacy-flexible IFI.',
        whenToUse: 'K-12 deployments, COPPA-regulated products, any context where you want to expose zero PII. Pair an opaque random ID with a separate roster service that maps IDs back to learners only inside the secure boundary.',
        whenNotToUse: 'Cross-organization analytics — accounts are scoped to a single homePage, so joining across systems requires an out-of-band mapping table. Also avoid putting PII (real names, emails) in the name field; that defeats the entire purpose.',
        worked: 'agent = {\n  "account": {\n    "homePage": "https://lms.k12.us",\n    "name": "student-7f3c-9a1d"\n  },\n  "objectType": "Agent"\n}'
    }
];

// --- Scenarios -------------------------------------------------------------
const scenarios = {
    'k12': {
        recommendKey: 'account',
        title: 'K-12 Elementary',
        reasoning: 'Children under 13 are protected by COPPA in the US and GDPR-K in the EU. You cannot store an email address (mbox) or a hashed email (mbox_sha1sum is reversible). Use <b>account</b> with an opaque random name like <code>student-7f3c</code> and keep the roster mapping inside your secure boundary. This is the only IFI form that exposes zero PII to the LRS.'
    },
    'university': {
        recommendKey: 'openid',
        title: 'University LMS',
        reasoning: 'Universities almost always have an institutional Identity Provider (Shibboleth, Okta, Azure AD). Use <b>openid</b> so each learner has one identity across the LMS, the library, the assessment platform, and any third-party tool. The IdP — not the LRS — owns the canonical identity, and you avoid both raw email and roster-mapping overhead.'
    },
    'corporate': {
        recommendKey: 'mbox',
        title: 'Corporate L&D',
        reasoning: 'Adult employees with corporate email accounts and a legitimate-interest legal basis under GDPR. Use <b>mbox</b> for human-readable debugging and easy joins to the HRIS. If you operate across borders or want to publish aggregate dashboards externally, fall back to <b>mbox_sha1sum</b> — but remember it is reversible, not anonymous.'
    }
};

// --- p5.js lifecycle -------------------------------------------------------
function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    canvas.mouseOver(() => mouseOverCanvas = true);
    canvas.mouseOut(() => mouseOverCanvas = false);

    // Initialize side panel with the default selection
    updateSidePanel(ifis[selectedCard], null);
    wirePresetButtons();

    describe(
        'A 2-by-2 grid of cards comparing the four xAPI Inverse Functional Identifiers: mbox, mbox_sha1sum, openid, and account. Each card shows a privacy badge, a one-sentence summary, and an example agent JSON block. Click a card to load its full details into the side panel on the right. Three preset buttons across the top recommend an IFI for K-12, university, and corporate scenarios.',
        LABEL
    );
}

function draw() {
    // Background of the whole p5 canvas region
    noStroke();
    fill('#f8fafc');
    rect(0, 0, canvasWidth, canvasHeight);

    drawCardGrid();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
    }
}

// --- Card grid drawing -----------------------------------------------------
function drawCardGrid() {
    // Card grid: 2 columns x 2 rows filling the entire canvas
    const gap = 12;
    const innerPad = 14;
    const colW = (canvasWidth - innerPad * 2 - gap) / 2;
    const rowH = (canvasHeight - innerPad * 2 - gap) / 2;

    const positions = [
        { x: innerPad,                  y: innerPad },
        { x: innerPad + colW + gap,     y: innerPad },
        { x: innerPad,                  y: innerPad + rowH + gap },
        { x: innerPad + colW + gap,     y: innerPad + rowH + gap }
    ];

    for (let i = 0; i < ifis.length; i++) {
        drawCard(positions[i].x, positions[i].y, colW, rowH, ifis[i], i);
    }
}

function drawCard(x, y, w, h, ifi, idx) {
    const isSelected = idx === selectedCard;
    const isHovered = idx === hoveredCard;

    // Card body
    noStroke();
    if (isSelected) {
        stroke('#0d9488');
        strokeWeight(3);
        fill('white');
    } else if (isHovered) {
        stroke('#94a3b8');
        strokeWeight(2);
        fill('#fefefe');
    } else {
        stroke('#e2e8f0');
        strokeWeight(1);
        fill('white');
    }
    rect(x, y, w, h, 8);

    // Header bar
    const headerH = 30;
    noStroke();
    fill(isSelected ? '#0d9488' : '#1e293b');
    rect(x, y, w, headerH, 8, 8, 0, 0);

    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(ifi.name, x + 10, y + headerH / 2);
    textStyle(NORMAL);

    // Privacy badge (top-right of header)
    drawPrivacyBadge(x + w - 10, y + headerH / 2, ifi.privacy);

    // Summary text
    fill('#334155');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(NORMAL);
    text(ifi.summary, x + 10, y + headerH + 8, w - 20, 40);

    // Example JSON block
    const codeY = y + headerH + 56;
    const codeH = h - headerH - 64;
    fill('#f1f5f9');
    stroke('#e2e8f0');
    strokeWeight(1);
    rect(x + 8, codeY, w - 16, codeH, 4);

    noStroke();
    fill('#0f172a');
    textFont('Menlo, Consolas, monospace');
    textSize(11);
    textAlign(LEFT, TOP);
    text(ifi.example, x + 14, codeY + 8, w - 28, codeH - 16);
    textFont('Arial, Helvetica, sans-serif');
}

function drawPrivacyBadge(rightX, centerY, privacy) {
    let bgColor, label;
    if (privacy === 'red') {
        bgColor = '#dc2626';
        label = 'RED';
    } else if (privacy === 'yellow') {
        bgColor = '#eab308';
        label = 'YELLOW';
    } else {
        bgColor = '#16a34a';
        label = 'GREEN';
    }

    textStyle(BOLD);
    textSize(10);
    textAlign(CENTER, CENTER);
    const padding = 8;
    const labelWidth = textWidth(label) + padding * 2;
    const labelHeight = 16;

    noStroke();
    fill(bgColor);
    rect(rightX - labelWidth, centerY - labelHeight / 2, labelWidth, labelHeight, 8);

    fill('white');
    text(label, rightX - labelWidth / 2, centerY);
    textStyle(NORMAL);
}

// --- Mouse interaction -----------------------------------------------------
function mouseMoved() {
    hoveredCard = cardAtMouse();
}

function mousePressed() {
    const idx = cardAtMouse();
    if (idx >= 0) {
        selectedCard = idx;
        updateSidePanel(ifis[idx], null);
        emitInteracted('card-' + ifis[idx].key);
    }
}

function cardAtMouse() {
    if (mouseX < 0 || mouseX > canvasWidth) return -1;
    if (mouseY < 0 || mouseY > canvasHeight) return -1;

    const innerPad = 14;
    const gap = 12;
    const colW = (canvasWidth - innerPad * 2 - gap) / 2;
    const rowH = (canvasHeight - innerPad * 2 - gap) / 2;

    for (let i = 0; i < 4; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = innerPad + col * (colW + gap);
        const cy = innerPad + row * (rowH + gap);
        if (mouseX >= cx && mouseX <= cx + colW && mouseY >= cy && mouseY <= cy + rowH) {
            return i;
        }
    }
    return -1;
}

// --- HTML side panel -------------------------------------------------------
function updateSidePanel(ifi, scenarioInfo) {
    const display = document.getElementById('info-display');
    if (!display) return;

    const badgeColor = ifi.privacy === 'red' ? '#dc2626'
                     : ifi.privacy === 'yellow' ? '#eab308' : '#16a34a';

    let scenarioBlock = '';
    if (scenarioInfo) {
        scenarioBlock =
            '<div class="scenario-card">' +
              '<div class="scenario-title">Recommended for: ' + scenarioInfo.title + '</div>' +
              '<div class="scenario-body">' + scenarioInfo.reasoning + '</div>' +
            '</div>';
    }

    display.innerHTML =
        scenarioBlock +
        '<div class="info-title">' + ifi.name + '</div>' +
        '<span class="info-badge" style="background:' + badgeColor + '">' + ifi.privacyLabel + '</span>' +
        '<div class="info-content">' +
          '<p>' + ifi.full + '</p>' +
          '<p><b>When to use:</b> ' + ifi.whenToUse + '</p>' +
          '<p><b>When NOT to use:</b> ' + ifi.whenNotToUse + '</p>' +
          '<p><b>Worked example:</b></p>' +
          '<pre class="worked">' + ifi.worked + '</pre>' +
        '</div>';
}

function findIfiByKey(key) {
    return ifis.find(i => i.key === key);
}

function wirePresetButtons() {
    const buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.scenario;
            const scenario = scenarios[key];
            if (!scenario) return;

            const recommendIdx = ifis.findIndex(i => i.key === scenario.recommendKey);
            if (recommendIdx >= 0) {
                selectedCard = recommendIdx;
                updateSidePanel(ifis[recommendIdx], scenario);
                emitInteracted('scenario-' + key);
            }

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// --- xAPI hook (optional) --------------------------------------------------
function emitInteracted(target) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
        object: {
            id: 'http://textbook.example.org/sims/four-inverse-functional-identifiers#' + target,
            definition: { name: { 'en-US': 'Four IFI MicroSim: ' + target } }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) {}
}
