// Verb IRI Anatomy
// CANVAS_HEIGHT: 420
// Bloom: Understand (L2) — decompose a verb IRI into scheme + namespace + local name

let canvasWidth = 900;
let drawHeight = 320;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 14;

let invalidToggle, alt1Btn, alt2Btn, alt3Btn;
let showInvalid = false;

const PALETTE = {
    scheme: '#1d4ed8',     // blue
    namespace: '#15803d',  // green
    localName: '#c2410c',  // orange
    invalid: '#b91c1c',
    bg: 'aliceblue',
    panel: '#fafbfc'
};

const VALID = [
    { id: 'adl',    label: 'ADL: passed',    iri: 'http://adlnet.gov/expapi/verbs/passed' },
    { id: 'tincan', label: 'TinCan: liked',  iri: 'http://activitystrea.ms/schema/1.0/like' },
    { id: 'custom', label: 'Custom: explored', iri: 'http://xapi-course.org/verbs/explored' }
];

const INVALID = [
    { id: 'noscheme', label: 'No scheme',    iri: 'passed', reason: 'Missing scheme — not an absolute IRI.' },
    { id: 'fakeprot', label: 'Bare colon',   iri: 'myapp:verbs/done', reason: 'Custom URI scheme — not resolvable as an IRI.' },
    { id: 'spaces',   label: 'Has spaces',   iri: 'http://adlnet.gov/exp api/verbs/passed', reason: 'Spaces are not legal in an IRI path.' }
];

// State
let activeIri = VALID[0].iri;
let activeIriId = 'adl';
let hoverPart = null;          // 'scheme' | 'namespace' | 'localName' | null
let clickedPart = null;        // sticky selection
let partRects = {};            // computed on each draw
let invalidReason = null;      // set when showInvalid + invalid IRI is currently active

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    invalidToggle = createCheckbox('Show invalid examples', false);
    invalidToggle.parent(document.querySelector('main'));
    invalidToggle.position(margin, drawHeight + 10);
    invalidToggle.changed(onToggleInvalid);

    const list = currentList();
    const btnY = drawHeight + 50;
    const btnW = 180;
    const gap = 14;
    let bx = margin;

    alt1Btn = createButton(list[0].label);
    alt1Btn.parent(document.querySelector('main'));
    alt1Btn.position(bx, btnY); alt1Btn.size(btnW, 28);
    alt1Btn.mousePressed(() => loadAlt(0));
    bx += btnW + gap;

    alt2Btn = createButton(list[1].label);
    alt2Btn.parent(document.querySelector('main'));
    alt2Btn.position(bx, btnY); alt2Btn.size(btnW, 28);
    alt2Btn.mousePressed(() => loadAlt(1));
    bx += btnW + gap;

    alt3Btn = createButton(list[2].label);
    alt3Btn.parent(document.querySelector('main'));
    alt3Btn.position(bx, btnY); alt3Btn.size(btnW, 28);
    alt3Btn.mousePressed(() => loadAlt(2));

    describe(
        'Interactive verb IRI explorer. Hover or click any of the three parts ' +
        '(scheme, namespace, local name) to see its definition. Toggle invalid ' +
        'examples to see common malformed IRIs and why each is rejected.',
        LABEL
    );
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

function currentList() { return showInvalid ? INVALID : VALID; }

function onToggleInvalid() {
    showInvalid = invalidToggle.checked();
    const list = currentList();
    alt1Btn.html(list[0].label);
    alt2Btn.html(list[1].label);
    alt3Btn.html(list[2].label);
    loadAlt(0);
}

function loadAlt(i) {
    const list = currentList();
    activeIri = list[i].iri;
    activeIriId = list[i].id;
    invalidReason = list[i].reason || null;
    clickedPart = null;
}

function decomposeValid(iri) {
    // Returns {scheme, namespace, localName} or null if not decomposable.
    const m = iri.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^?#]*\/)([^/?#]+)$/);
    if (!m) return null;
    return { scheme: m[1], namespace: m[2], localName: m[3] };
}

function draw() {
    updateCanvasSize();

    // Background regions
    fill(PALETTE.bg);
    stroke('silver');
    rect(0, 0, canvasWidth, drawHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    noStroke();

    // Title
    fill('#0f172a');
    textSize(20);
    textAlign(CENTER, TOP);
    text('Verb IRI Anatomy', canvasWidth / 2, 8);

    // Subtitle
    textSize(13);
    fill('#475569');
    text('Hover or click each part — scheme, namespace, local name', canvasWidth / 2, 36);

    // IRI display
    const iriY = 90;
    drawIri(activeIri, canvasWidth / 2, iriY);

    // Info panel below the IRI
    drawInfoPanel(margin, 200, canvasWidth - margin * 2, 110);

    // Hover detection
    hoverPart = null;
    for (const k of Object.keys(partRects)) {
        const r = partRects[k];
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
            hoverPart = k;
            break;
        }
    }
    cursor(hoverPart ? HAND : ARROW);
}

function drawIri(iri, cx, cy) {
    textFont('Courier New');
    const decomp = decomposeValid(iri);

    // Render either as 3 colored parts (valid) or as a single red string (invalid)
    if (decomp) {
        const parts = [
            { key: 'scheme',    text: decomp.scheme,    color: PALETTE.scheme },
            { key: 'namespace', text: decomp.namespace, color: PALETTE.namespace },
            { key: 'localName', text: decomp.localName, color: PALETTE.localName }
        ];

        textSize(22);
        textStyle(BOLD);
        const totalW = parts.reduce((a, p) => a + textWidth(p.text), 0);
        let x = cx - totalW / 2;
        const baseline = cy;
        partRects = {};

        for (const p of parts) {
            const w = textWidth(p.text);
            const isHover = (hoverPart === p.key) || (clickedPart === p.key);
            // Highlight background pill
            if (isHover) {
                noStroke();
                fill(p.color + '33');  // ~20% opacity hex append
                rect(x - 4, baseline - 18, w + 8, 32, 4);
            }
            // Underline bracket
            stroke(p.color);
            strokeWeight(3);
            noFill();
            line(x, baseline + 18, x + w, baseline + 18);
            line(x, baseline + 14, x, baseline + 18);
            line(x + w, baseline + 14, x + w, baseline + 18);
            // Text
            noStroke();
            fill(p.color);
            textAlign(LEFT, BASELINE);
            text(p.text, x, baseline + 6);
            // Label below bracket
            textStyle(NORMAL);
            textSize(11);
            textFont('Arial');
            textAlign(CENTER, TOP);
            text(p.key === 'localName' ? 'local name' : p.key, x + w / 2, baseline + 26);
            textFont('Courier New');
            textSize(22);
            textStyle(BOLD);
            // Save hit-rect (covers both text and bracket area)
            partRects[p.key] = { x: x - 4, y: baseline - 20, w: w + 8, h: 60 };
            x += w;
        }
        textStyle(NORMAL);
    } else {
        // Invalid IRI: render in red, no parts
        textSize(22);
        textStyle(BOLD);
        fill(PALETTE.invalid);
        textAlign(CENTER, BASELINE);
        text(iri, cx, cy + 6);
        // Strikethrough
        stroke(PALETTE.invalid);
        strokeWeight(2);
        const w = textWidth(iri);
        line(cx - w / 2, cy - 4, cx + w / 2, cy - 4);
        textStyle(NORMAL);
        partRects = {};
    }

    textFont('Arial');
    noStroke();
}

function drawInfoPanel(x, y, w, h) {
    fill(PALETTE.panel);
    stroke('#dee2e6');
    rect(x, y, w, h, 6);
    noStroke();

    const partInfo = {
        scheme: {
            title: 'Scheme',
            color: PALETTE.scheme,
            body: 'The protocol — almost always "http://" or "https://" for verb IRIs. Tells consumers this is a URL-like identifier, even though the URL may not actually resolve to a live document.'
        },
        namespace: {
            title: 'Namespace',
            color: PALETTE.namespace,
            body: 'The path that identifies the publisher (or registry) and the kind of resource. For ADL verbs: adlnet.gov/expapi/verbs/. Two verbs in different namespaces are different verbs even if they share a local name.'
        },
        localName: {
            title: 'Local name',
            color: PALETTE.localName,
            body: 'The verb itself — typically a past-tense English word like "passed", "completed", "experienced". The local name is what your eye reads, but the full IRI (including namespace) is what xAPI compares.'
        }
    };

    fill('#0f172a');
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    const heading = invalidReason
        ? 'Why this IRI is rejected'
        : (clickedPart ? 'Selected: ' : (hoverPart ? 'Hovering: ' : 'Click or hover a part'));
    text(heading + (invalidReason ? '' : (clickedPart || hoverPart || '')), x + 10, y + 8);
    textStyle(NORMAL);

    if (invalidReason) {
        fill(PALETTE.invalid);
        textSize(13);
        text(invalidReason, x + 10, y + 32, w - 20);
        return;
    }

    const active = clickedPart || hoverPart;
    if (active && partInfo[active]) {
        const info = partInfo[active];
        fill(info.color);
        textSize(13);
        textStyle(BOLD);
        text(info.title, x + 10, y + 32);
        textStyle(NORMAL);
        fill('#334155');
        text(info.body, x + 10, y + 52, w - 20);
    } else {
        fill('#475569');
        textSize(12);
        textStyle(ITALIC);
        text('Hover any colored part above. Click to lock the selection.', x + 10, y + 36);
        textStyle(NORMAL);
    }
}

function mousePressed() {
    if (hoverPart) {
        clickedPart = (clickedPart === hoverPart) ? null : hoverPart;
    }
}
