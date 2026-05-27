// Statement Pattern Composer
// CANVAS_HEIGHT: 580
// Bloom: Create (L6) — compose a complete xAPI statement by selecting a pattern and filling its slots

let canvasWidth = 1000;
let drawHeight = 440;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let sliderLeftMargin = 200;

// Controls
let patternSelect, actorInput, parentSelect;
let scoreSlider, durationSlider, successButton, completionButton;
let chapterSelect;
let resetButton;

// State
let pattern = 'page-read';
let actor = 'alice@school.edu';
let parentActivity = 'http://xapi-course.org/chapters/03';
let scaledScore = 0.85;
let durationSec = 47;
let success = 'true';
let completion = 'true';

const PATTERNS = {
    'page-read': { label: 'Page-Read',           verb: 'experienced',   verbIri: 'http://adlnet.gov/expapi/verbs/experienced' },
    'quiz-submit': { label: 'Quiz-Submission',   verb: 'completed',     verbIri: 'http://adlnet.gov/expapi/verbs/completed' },
    'microsim': { label: 'MicroSim-Interaction', verb: 'interacted',    verbIri: 'http://adlnet.gov/expapi/verbs/interacted' },
    'adaptive': { label: 'Adaptive-Branching',   verb: 'progressed',    verbIri: 'http://adlnet.gov/expapi/verbs/progressed' },
    'voiding': { label: 'Voiding',               verb: 'voided',        verbIri: 'http://adlnet.gov/expapi/verbs/voided' }
};

// Each pattern declares which slots it requires (green), allows (yellow), forbids (red)
const SLOT_RULES = {
    'page-read':   { actor: 'req', verb: 'req', object: 'req', result: 'forbid', context: 'allow' },
    'quiz-submit': { actor: 'req', verb: 'req', object: 'req', result: 'req',    context: 'allow' },
    'microsim':    { actor: 'req', verb: 'req', object: 'req', result: 'allow',  context: 'req' },
    'adaptive':    { actor: 'req', verb: 'req', object: 'req', result: 'allow',  context: 'req' },
    'voiding':     { actor: 'req', verb: 'req', object: 'req', result: 'forbid', context: 'forbid' }
};

const CHAPTERS = [
    'http://xapi-course.org/chapters/01',
    'http://xapi-course.org/chapters/02',
    'http://xapi-course.org/chapters/03',
    'http://xapi-course.org/chapters/04'
];

const PALETTE = {
    bg: 'aliceblue',
    panel: '#fafbfc',
    req: '#15803d',
    allow: '#ca8a04',
    forbid: '#b91c1c',
    keyColor: '#0b66c0',
    stringColor: '#067a3b',
    numberColor: '#a23a00',
    boolColor: '#7a2bbf'
};

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    // Row 1: Pattern dropdown + Reset button
    patternSelect = createSelect();
    patternSelect.parent(document.querySelector('main'));
    Object.keys(PATTERNS).forEach(k => patternSelect.option(PATTERNS[k].label, k));
    patternSelect.selected(pattern);
    patternSelect.position(140, drawHeight + 8);
    patternSelect.size(220, 28);
    patternSelect.changed(() => { pattern = patternSelect.value(); });

    resetButton = createButton('Reset to defaults');
    resetButton.parent(document.querySelector('main'));
    resetButton.position(380, drawHeight + 8);
    resetButton.size(140, 28);
    resetButton.mousePressed(resetAll);

    // Row 2: Actor + Parent activity
    actorInput = createInput(actor);
    actorInput.parent(document.querySelector('main'));
    actorInput.position(140, drawHeight + 44);
    actorInput.size(220, 24);
    actorInput.input(() => { actor = actorInput.value(); });

    chapterSelect = createSelect();
    chapterSelect.parent(document.querySelector('main'));
    CHAPTERS.forEach(c => chapterSelect.option(c.replace('http://xapi-course.org/', ''), c));
    chapterSelect.selected(parentActivity);
    chapterSelect.position(540, drawHeight + 44);
    chapterSelect.size(260, 28);
    chapterSelect.changed(() => { parentActivity = chapterSelect.value(); });

    // Row 3: Pattern-specific slider (score) — visible for quiz/microsim/adaptive
    scoreSlider = createSlider(0, 1, 0.85, 0.05);
    scoreSlider.parent(document.querySelector('main'));
    scoreSlider.position(140, drawHeight + 80);
    scoreSlider.size(280);
    scoreSlider.input(() => { scaledScore = scoreSlider.value(); });

    durationSlider = createSlider(0, 600, 47, 1);
    durationSlider.parent(document.querySelector('main'));
    durationSlider.position(540, drawHeight + 80);
    durationSlider.size(260);
    durationSlider.input(() => { durationSec = durationSlider.value(); });

    // Row 4: Toggles
    successButton = createButton('success: ' + success);
    successButton.parent(document.querySelector('main'));
    successButton.position(140, drawHeight + 112);
    successButton.size(160, 24);
    successButton.mousePressed(() => { success = cycleTri(success); });

    completionButton = createButton('completion: ' + completion);
    completionButton.parent(document.querySelector('main'));
    completionButton.position(320, drawHeight + 112);
    completionButton.size(180, 24);
    completionButton.mousePressed(() => { completion = cycleTri(completion); });

    describe(
        'Statement Pattern Composer. Choose a pattern from the dropdown to see ' +
        'the slot-rules map (which fields are required, allowed, or forbidden) ' +
        'and the live JSON preview update. Fill in actor, score, duration, and ' +
        'completion/success to compose a valid statement of the chosen pattern.',
        LABEL
    );
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    scoreSlider.size(Math.max(80, 380 - 140));
    durationSlider.size(Math.max(80, canvasWidth - 540 - margin));
    actorInput.size(220, 24);
    chapterSelect.size(Math.max(140, canvasWidth - 540 - margin));
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) canvasWidth = container.offsetWidth;
}

function cycleTri(v) {
    if (v === 'unset') return 'true';
    if (v === 'true') return 'false';
    return 'unset';
}

function resetAll() {
    pattern = 'page-read';
    actor = 'alice@school.edu';
    parentActivity = CHAPTERS[2];
    scaledScore = 0.85;
    durationSec = 47;
    success = 'true';
    completion = 'true';
    patternSelect.selected(pattern);
    actorInput.value(actor);
    chapterSelect.selected(parentActivity);
    scoreSlider.value(scaledScore);
    durationSlider.value(durationSec);
}

function draw() {
    updateCanvasSize();

    // Update toggle button labels
    successButton.html('success: ' + success);
    completionButton.html('completion: ' + completion);

    // Backgrounds
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
    text('Statement Pattern Composer', canvasWidth / 2, 8);

    // Subtitle
    textSize(12);
    fill('#475569');
    text('Pattern → slot map → live JSON preview', canvasWidth / 2, 34);

    // Layout: ~half left for slot map, ~half right for JSON (IRIs need width)
    const splitX = max(canvasWidth * 0.52, 420);
    drawSlotMap(margin, 60, splitX - margin * 2, drawHeight - 70);
    drawJson(splitX, 60, canvasWidth - splitX - margin, drawHeight - 70);

    // Control labels
    drawControlLabels();
}

function drawSlotMap(x, y, w, h) {
    // Panel background
    fill(PALETTE.panel);
    stroke('#dee2e6');
    rect(x, y, w, h, 6);
    noStroke();

    fill('#0f172a');
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Pattern Slot Map: ' + PATTERNS[pattern].label, x + 12, y + 10);
    textStyle(NORMAL);

    const rules = SLOT_RULES[pattern];
    const slotOrder = ['actor', 'verb', 'object', 'result', 'context'];
    const rowH = (h - 100) / slotOrder.length;
    let cy = y + 36;

    slotOrder.forEach(slot => {
        const status = rules[slot];
        const color = status === 'req' ? PALETTE.req : status === 'allow' ? PALETTE.allow : PALETTE.forbid;
        const label = status === 'req' ? 'REQUIRED' : status === 'allow' ? 'ALLOWED' : 'FORBIDDEN';

        // Slot name
        fill('#0f172a');
        textSize(13);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text(slot, x + 16, cy + rowH / 2);
        textStyle(NORMAL);

        // Status badge
        fill(color);
        rect(x + 110, cy + rowH / 2 - 9, 80, 18, 4);
        fill(255);
        textSize(10);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(label, x + 150, cy + rowH / 2);
        textStyle(NORMAL);

        // Slot-specific note
        fill('#475569');
        textSize(11);
        textAlign(LEFT, CENTER);
        text(slotNote(slot, status), x + 200, cy + rowH / 2);

        cy += rowH;
    });

    // Validation badge at bottom
    const valid = isValidStatement();
    const vY = y + h - 36;
    fill(valid ? PALETTE.req : PALETTE.forbid);
    rect(x + 12, vY, w - 24, 26, 4);
    fill(255);
    textSize(13);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(valid ? '✓ Pattern Valid' : '✗ Missing Required Slot', x + w / 2, vY + 13);
    textStyle(NORMAL);
}

function slotNote(slot, status) {
    if (slot === 'actor') return 'who did it (always required by xAPI)';
    if (slot === 'verb') return 'pattern fixes the verb to ' + PATTERNS[pattern].verb;
    if (slot === 'object') return 'parent activity is the object';
    if (slot === 'result') {
        if (status === 'req') return 'pattern requires score / completion';
        if (status === 'allow') return 'optional — extensions may add detail';
        return 'pattern rule: do not emit a result';
    }
    if (slot === 'context') {
        if (status === 'req') return 'pattern requires extensions or parent';
        if (status === 'allow') return 'optional grouping / parent activity';
        return 'pattern rule: do not emit context';
    }
    return '';
}

function isValidStatement() {
    const rules = SLOT_RULES[pattern];
    if (rules.actor === 'req' && (!actor || actor.length < 3)) return false;
    if (rules.result === 'req') {
        if (success === 'unset' && completion === 'unset') return false;
    }
    return true;
}

function drawJson(x, y, w, h) {
    // Panel background
    fill('#1e293b');
    stroke('#0f172a');
    rect(x, y, w, h, 6);
    noStroke();

    // Heading
    fill('#a5b4fc');
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Live JSON', x + 12, y + 10);
    textStyle(NORMAL);

    // Build JSON lines
    const rules = SLOT_RULES[pattern];
    const lines = [];
    lines.push([['{', '#ffffff']]);
    lines.push([['  "', '#cbd5e1'], ['actor', PALETTE.keyColor], ['": { "', '#cbd5e1'], ['mbox', PALETTE.keyColor], ['": "', '#cbd5e1'], ['mailto:' + actor, PALETTE.stringColor], ['" },', '#cbd5e1']]);
    lines.push([['  "', '#cbd5e1'], ['verb', PALETTE.keyColor], ['": { "', '#cbd5e1'], ['id', PALETTE.keyColor], ['": "', '#cbd5e1'], [PATTERNS[pattern].verbIri, PALETTE.stringColor], ['" },', '#cbd5e1']]);
    lines.push([['  "', '#cbd5e1'], ['object', PALETTE.keyColor], ['": { "', '#cbd5e1'], ['id', PALETTE.keyColor], ['": "', '#cbd5e1'], [parentActivity, PALETTE.stringColor], ['" },', '#cbd5e1']]);

    if (rules.result !== 'forbid') {
        lines.push([['  "', '#cbd5e1'], ['result', PALETTE.keyColor], ['": {', '#cbd5e1']]);
        lines.push([['    "', '#cbd5e1'], ['score', PALETTE.keyColor], ['": { "', '#cbd5e1'], ['scaled', PALETTE.keyColor], ['": ', '#cbd5e1'], [scaledScore.toFixed(2), PALETTE.numberColor], [' },', '#cbd5e1']]);
        if (success !== 'unset') {
            lines.push([['    "', '#cbd5e1'], ['success', PALETTE.keyColor], ['": ', '#cbd5e1'], [success, PALETTE.boolColor], [',', '#cbd5e1']]);
        }
        if (completion !== 'unset') {
            lines.push([['    "', '#cbd5e1'], ['completion', PALETTE.keyColor], ['": ', '#cbd5e1'], [completion, PALETTE.boolColor], [',', '#cbd5e1']]);
        }
        lines.push([['    "', '#cbd5e1'], ['duration', PALETTE.keyColor], ['": "PT', '#cbd5e1'], [String(Math.round(durationSec)), PALETTE.numberColor], ['S"', '#cbd5e1']]);
        lines.push([['  },', '#cbd5e1']]);
    }

    if (rules.context !== 'forbid') {
        lines.push([['  "', '#cbd5e1'], ['context', PALETTE.keyColor], ['": { "', '#cbd5e1'], ['contextActivities', PALETTE.keyColor], ['": { "', '#cbd5e1'], ['parent', PALETTE.keyColor], ['": [...] } }', '#cbd5e1']]);
    }

    lines.push([['}', '#ffffff']]);

    // Render lines
    textFont('Courier New');
    textSize(11);
    textStyle(NORMAL);
    let cy = y + 32;
    const lineH = 16;
    for (const line of lines) {
        let cx = x + 12;
        for (const part of line) {
            const [str, col] = part;
            fill(col);
            textAlign(LEFT, TOP);
            // Truncate long IRI strings to avoid overflow
            const displayStr = (textWidth(str) > w - (cx - x) - 12) ?
                truncateToWidth(str, w - (cx - x) - 12) : str;
            text(displayStr, cx, cy);
            cx += textWidth(displayStr);
            if (cx > x + w - 12) break;
        }
        cy += lineH;
        if (cy > y + h - lineH) break;
    }
    textFont('Arial');
}

function truncateToWidth(str, maxW) {
    if (textWidth(str) <= maxW) return str;
    let s = str;
    while (s.length > 4 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
    return s + '…';
}

function drawControlLabels() {
    noStroke();
    fill('#0f172a');
    textSize(13);
    textAlign(LEFT, CENTER);
    text('Pattern:', 16, drawHeight + 22);
    text('Actor:', 16, drawHeight + 56);
    text('Parent:', 380, drawHeight + 56);
    text('Score: ' + scaledScore.toFixed(2), 16, drawHeight + 92);
    text('Duration: ' + Math.round(durationSec) + 's', 380, drawHeight + 92);
}
