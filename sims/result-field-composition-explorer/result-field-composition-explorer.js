// Result Field Composition Explorer
// Demonstrates the orthogonality of `completion` and `success` in the xAPI
// result object: each is independently true / false / unset, producing the
// four meaningful states shown in the 2x2 grid.
// CANVAS_HEIGHT: 575

let canvasWidth = 900;
let drawHeight = 320;
let controlHeight = 255;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let sliderLeftMargin = 220;
let defaultTextSize = 16;

// State
let rawScore = 7;
let minScore = 0;
let maxScore = 10;
let duration = 47;
let success = 'unset';     // 'true' | 'false' | 'unset'
let completion = 'unset';
let response = 'x = -3, x = 5';

// Controls
let rawScoreSlider, minScoreSlider, maxScoreSlider, durationSlider;
let successButton, completionButton;
let responseInput;
let presetButtons = [];

// Syntax-highlight palette (named colors are simpler, but JSON highlighting
// reads more clearly in subtle hues — these are the only hex values in this
// sim, intentional for that reason).
const KEY_COLOR = '#0b66c0';
const STRING_COLOR = '#067a3b';
const NUMBER_COLOR = '#a23a00';
const BOOLEAN_COLOR = '#7a2bbf';
const PUNCT_COLOR = '#333333';

const PRESETS = {
    passed: {
        label: 'Passed Cleanly',
        rawScore: 8.5, minScore: 0, maxScore: 10,
        success: 'true', completion: 'true',
        duration: 245, response: 'All answered correctly'
    },
    failed: {
        label: 'Failed but Finished',
        rawScore: 4, minScore: 0, maxScore: 10,
        success: 'false', completion: 'true',
        duration: 410, response: 'Several incorrect'
    },
    bailed: {
        label: 'Bailed Early',
        rawScore: 2, minScore: 0, maxScore: 10,
        success: 'false', completion: 'false',
        duration: 35, response: 'Stopped after Q3'
    },
    mastery: {
        label: 'Mastery Exit',
        rawScore: 10, minScore: 0, maxScore: 10,
        success: 'true', completion: 'true',
        duration: 90, response: 'Perfect score on first try'
    }
};

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    const sliderWidth = canvasWidth - sliderLeftMargin - margin;

    rawScoreSlider = createSlider(0, 10, 7, 0.1);
    rawScoreSlider.parent(document.querySelector('main'));
    rawScoreSlider.position(sliderLeftMargin, drawHeight + 5);
    rawScoreSlider.size(sliderWidth);

    minScoreSlider = createSlider(-5, 0, 0, 0.5);
    minScoreSlider.parent(document.querySelector('main'));
    minScoreSlider.position(sliderLeftMargin, drawHeight + 40);
    minScoreSlider.size(sliderWidth);

    maxScoreSlider = createSlider(5, 20, 10, 0.5);
    maxScoreSlider.parent(document.querySelector('main'));
    maxScoreSlider.position(sliderLeftMargin, drawHeight + 75);
    maxScoreSlider.size(sliderWidth);

    durationSlider = createSlider(0, 600, 47, 1);
    durationSlider.parent(document.querySelector('main'));
    durationSlider.position(sliderLeftMargin, drawHeight + 110);
    durationSlider.size(sliderWidth);

    successButton = createButton(toggleLabel('success', success));
    successButton.parent(document.querySelector('main'));
    successButton.position(10, drawHeight + 145);
    successButton.size(170, 26);
    successButton.mousePressed(() => { success = cycleTriState(success); });

    completionButton = createButton(toggleLabel('completion', completion));
    completionButton.parent(document.querySelector('main'));
    completionButton.position(190, drawHeight + 145);
    completionButton.size(190, 26);
    completionButton.mousePressed(() => { completion = cycleTriState(completion); });

    responseInput = createInput(response);
    responseInput.parent(document.querySelector('main'));
    responseInput.position(sliderLeftMargin, drawHeight + 180);
    responseInput.size(sliderWidth - 8);
    responseInput.input(() => { response = responseInput.value(); });

    let px = 10;
    Object.keys(PRESETS).forEach(key => {
        const btn = createButton(PRESETS[key].label);
        btn.parent(document.querySelector('main'));
        btn.position(px, drawHeight + 215);
        btn.size(140, 26);
        btn.mousePressed(() => applyPreset(key));
        presetButtons.push(btn);
        px += 150;
    });

    describe(
        'Interactive xAPI result object explorer. Sliders set raw, min, max, ' +
        'and duration values. Toggle buttons cycle the success and completion ' +
        'fields through true, false, and unset, demonstrating that the two ' +
        'fields vary independently. Preset buttons load common learner scenarios.',
        LABEL
    );
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    const sliderWidth = canvasWidth - sliderLeftMargin - margin;
    rawScoreSlider.size(sliderWidth);
    minScoreSlider.size(sliderWidth);
    maxScoreSlider.size(sliderWidth);
    durationSlider.size(sliderWidth);
    responseInput.size(sliderWidth - 8);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
    }
}

function cycleTriState(v) {
    if (v === 'unset') return 'true';
    if (v === 'true') return 'false';
    return 'unset';
}

function toggleLabel(name, value) {
    return name + ': ' + value;
}

function applyPreset(key) {
    const p = PRESETS[key];
    rawScore = p.rawScore;
    minScore = p.minScore;
    maxScore = p.maxScore;
    success = p.success;
    completion = p.completion;
    duration = p.duration;
    response = p.response;
    rawScoreSlider.value(rawScore);
    minScoreSlider.value(minScore);
    maxScoreSlider.value(maxScore);
    durationSlider.value(duration);
    responseInput.value(response);
}

function draw() {
    updateCanvasSize();

    // Pull current slider values
    rawScore = rawScoreSlider.value();
    minScore = minScoreSlider.value();
    maxScore = maxScoreSlider.value();
    duration = durationSlider.value();

    // Refresh toggle labels
    successButton.html(toggleLabel('success', success));
    completionButton.html(toggleLabel('completion', completion));

    // Drawing area background
    fill('aliceblue');
    stroke('silver');
    rect(0, 0, canvasWidth, drawHeight);
    // Control area background
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    noStroke();
    fill('black');
    textSize(20);
    textAlign(CENTER, TOP);
    text('Result Field Composition Explorer', canvasWidth / 2, 8);

    // Compute scaled score, capped to [-1, 1] per xAPI spec
    const scaled = computeScaled(rawScore, minScore, maxScore);

    // Split: 2x2 grid on the left, JSON on the right
    const splitX = max(canvasWidth * 0.55, 380);
    drawStateGrid(margin, 38, splitX - margin * 2, drawHeight - 50);
    drawJsonPanel(splitX + margin / 2, 38, canvasWidth - splitX - margin, drawHeight - 50, scaled);

    // Control labels
    drawControlLabels(scaled);
}

function computeScaled(raw, mn, mx) {
    if (mx === mn) return 0;
    let s = (raw - mn) / (mx - mn);
    return constrain(s, -1, 1);
}

function drawStateGrid(x, y, w, h) {
    // Title
    noStroke();
    fill('black');
    textSize(14);
    textAlign(LEFT, TOP);
    text('completion x success', x, y);

    // Reserve space for axis labels — wide enough for "completion: false"
    const axisOffset = 110;
    const cellArea = {
        x: x + axisOffset,
        y: y + 28,
        w: w - axisOffset,
        h: h - 80
    };
    const cellW = cellArea.w / 2;
    const cellH = cellArea.h / 2;

    // Column headers (success)
    textAlign(CENTER, BOTTOM);
    textSize(13);
    fill('#555');
    text('success: true', cellArea.x + cellW / 2, cellArea.y - 4);
    text('success: false', cellArea.x + cellW + cellW / 2, cellArea.y - 4);

    // Row labels (completion) — drawn vertically aligned to cell centers
    textAlign(RIGHT, CENTER);
    fill('#555');
    text('completion: true', cellArea.x - 4, cellArea.y + cellH / 2);
    text('completion: false', cellArea.x - 4, cellArea.y + cellH + cellH / 2);

    // Four cells
    const cellMeta = [
        { row: 0, col: 0, completion: 'true', success: 'true', label: 'Mastery / Pass' },
        { row: 0, col: 1, completion: 'true', success: 'false', label: 'Failed but Finished' },
        { row: 1, col: 0, completion: 'false', success: 'true', label: 'Partial Win (rare)' },
        { row: 1, col: 1, completion: 'false', success: 'false', label: 'Bailed Early' }
    ];

    cellMeta.forEach(c => {
        const cx = cellArea.x + c.col * cellW;
        const cy = cellArea.y + c.row * cellH;
        const isCurrent = (c.completion === completion && c.success === success);

        if (isCurrent) {
            fill('#fff3bf');
            stroke('#f08c00');
            strokeWeight(2);
        } else {
            fill('white');
            stroke('#dee2e6');
            strokeWeight(1);
        }
        rect(cx + 2, cy + 2, cellW - 4, cellH - 4, 6);

        noStroke();
        fill(isCurrent ? '#5a3a00' : '#495057');
        textAlign(CENTER, CENTER);
        textSize(13);
        text(c.label, cx + cellW / 2, cy + cellH / 2);
    });
    strokeWeight(1);

    // "Current state" caption below the grid
    const captionY = cellArea.y + cellArea.h + 12;
    noStroke();
    fill('#212529');
    textAlign(LEFT, TOP);
    textSize(13);
    let stateText;
    if (success === 'unset' && completion === 'unset') {
        stateText = 'Both fields unset — no cell is highlighted.';
    } else if (success === 'unset' || completion === 'unset') {
        stateText = 'One field is unset — the highlighted state is ambiguous.';
    } else {
        const match = cellMeta.find(c => c.completion === completion && c.success === success);
        stateText = 'Current state: ' + match.label;
    }
    text(stateText, x, captionY);

    // Duration shown both ways
    textSize(13);
    fill('#212529');
    text('Duration: ' + isoDuration(duration) + '   (' + humanDuration(duration) + ')', x, captionY + 22);
}

function drawJsonPanel(x, y, w, h, scaled) {
    // Panel background
    stroke('#dee2e6');
    fill('#fafbfc');
    rect(x, y, w, h, 6);

    // Heading
    noStroke();
    fill('#495057');
    textSize(13);
    textAlign(LEFT, TOP);
    textFont('monospace');
    text('"result": {', x + 12, y + 10);

    const lines = buildJsonLines(scaled);
    let cy = y + 30;
    const indent = x + 26;

    lines.forEach(line => {
        // line.parts: array of { text, color }
        let cx = indent;
        line.parts.forEach(part => {
            fill(part.color);
            text(part.text, cx, cy);
            cx += textWidth(part.text);
        });
        cy += 18;
    });

    // Closing brace
    fill('#495057');
    text('}', x + 12, cy + 2);

    textFont('Arial');
}

function buildJsonLines(scaled) {
    const lines = [];

    // score sub-object
    lines.push({ parts: [
        { text: '"', color: PUNCT_COLOR },
        { text: 'score', color: KEY_COLOR },
        { text: '": {', color: PUNCT_COLOR }
    ]});
    lines.push({ parts: [
        { text: '  "', color: PUNCT_COLOR },
        { text: 'scaled', color: KEY_COLOR },
        { text: '": ', color: PUNCT_COLOR },
        { text: scaled.toFixed(2), color: NUMBER_COLOR },
        { text: ',', color: PUNCT_COLOR }
    ]});
    lines.push({ parts: [
        { text: '  "', color: PUNCT_COLOR },
        { text: 'raw', color: KEY_COLOR },
        { text: '": ', color: PUNCT_COLOR },
        { text: numFmt(rawScore), color: NUMBER_COLOR },
        { text: ',', color: PUNCT_COLOR }
    ]});
    lines.push({ parts: [
        { text: '  "', color: PUNCT_COLOR },
        { text: 'min', color: KEY_COLOR },
        { text: '": ', color: PUNCT_COLOR },
        { text: numFmt(minScore), color: NUMBER_COLOR },
        { text: ',', color: PUNCT_COLOR }
    ]});
    lines.push({ parts: [
        { text: '  "', color: PUNCT_COLOR },
        { text: 'max', color: KEY_COLOR },
        { text: '": ', color: PUNCT_COLOR },
        { text: numFmt(maxScore), color: NUMBER_COLOR }
    ]});
    lines.push({ parts: [{ text: '},', color: PUNCT_COLOR }] });

    // success
    if (success !== 'unset') {
        lines.push({ parts: [
            { text: '"', color: PUNCT_COLOR },
            { text: 'success', color: KEY_COLOR },
            { text: '": ', color: PUNCT_COLOR },
            { text: success, color: BOOLEAN_COLOR },
            { text: ',', color: PUNCT_COLOR }
        ]});
    }

    // completion
    if (completion !== 'unset') {
        lines.push({ parts: [
            { text: '"', color: PUNCT_COLOR },
            { text: 'completion', color: KEY_COLOR },
            { text: '": ', color: PUNCT_COLOR },
            { text: completion, color: BOOLEAN_COLOR },
            { text: ',', color: PUNCT_COLOR }
        ]});
    }

    // duration
    lines.push({ parts: [
        { text: '"', color: PUNCT_COLOR },
        { text: 'duration', color: KEY_COLOR },
        { text: '": "', color: PUNCT_COLOR },
        { text: isoDuration(duration), color: STRING_COLOR },
        { text: '",', color: PUNCT_COLOR }
    ]});

    // response
    const respText = response.length > 32 ? response.slice(0, 30) + '...' : response;
    lines.push({ parts: [
        { text: '"', color: PUNCT_COLOR },
        { text: 'response', color: KEY_COLOR },
        { text: '": "', color: PUNCT_COLOR },
        { text: respText, color: STRING_COLOR },
        { text: '"', color: PUNCT_COLOR }
    ]});

    return lines;
}

function numFmt(n) {
    return Number.isInteger(n) ? n.toString() : (+n).toFixed(1);
}

function isoDuration(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    if (s === 0) return 'PT0S';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    let out = 'PT';
    if (h > 0) out += h + 'H';
    if (m > 0) out += m + 'M';
    if (sec > 0 || (h === 0 && m === 0)) out += sec + 'S';
    return out;
}

function humanDuration(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m === 0) return sec + 's';
    return m + 'm ' + sec + 's';
}

function drawControlLabels(scaled) {
    noStroke();
    fill('black');
    textFont('Arial');
    textAlign(LEFT, CENTER);
    textSize(14);

    text('Raw score: ' + numFmt(rawScore), 10, drawHeight + 18);
    text('Min: ' + numFmt(minScore) + '  Scaled: ' + scaled.toFixed(2), 10, drawHeight + 53);
    text('Max: ' + numFmt(maxScore), 10, drawHeight + 88);
    text('Duration (s): ' + Math.round(duration), 10, drawHeight + 123);

    text('Response:', 10, drawHeight + 193);
}
