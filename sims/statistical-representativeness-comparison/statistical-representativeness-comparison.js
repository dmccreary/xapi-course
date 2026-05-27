// Statistical Representativeness Comparison
// CANVAS_HEIGHT: 660
// Bloom: Evaluate (L5) — compare synthetic to real along verb freq + duration

let canvasWidth = 800;
let drawHeight = 480;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;

const VERBS = ['experienced', 'interacted', 'attempted', 'completed', 'passed', 'failed', 'mastered', 'asked'];

// Real distribution (target)
const REAL_VERBS = { experienced: 0.30, interacted: 0.20, attempted: 0.18,
    completed: 0.06, passed: 0.13, failed: 0.07, mastered: 0.04, asked: 0.02 };
// Real session duration histogram (12 buckets, 0-60 min in 5-min steps)
const REAL_DUR = [0.05, 0.10, 0.15, 0.18, 0.16, 0.12, 0.10, 0.06, 0.04, 0.02, 0.01, 0.01];

let tolSlider, tolLbl;
let regenBtn, presetBtns = [];
let synthVerbs = {}, synthDur = [];
let currentPreset = 'match';

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.querySelector('main'));

    tolLbl = createDiv('Tolerance: 15%');
    tolLbl.parent(document.querySelector('main'));
    tolLbl.style('font-size', '12px');
    tolLbl.style('margin', '6px 12px 0');

    tolSlider = createSlider(5, 30, 15, 1);
    tolSlider.parent(document.querySelector('main'));
    tolSlider.style('width', '92%');
    tolSlider.style('margin', '0 12px');
    tolSlider.input(redraw);

    const presetWrap = createDiv('');
    presetWrap.parent(document.querySelector('main'));
    presetWrap.style('margin', '8px 12px');
    presetWrap.style('font-size', '12px');

    const lbl = createSpan('Preset: ');
    lbl.parent(presetWrap);
    const presets = [
        ['match',     'Match real cohort'],
        ['over',      'Over-engaged synthetic'],
        ['under',     'Under-engaged synthetic'],
        ['skewed',    'Skewed-archetype synthetic']
    ];
    for (const [k, label] of presets) {
        const b = createButton(label);
        b.parent(presetWrap);
        b.style('margin', '0 4px 0 0');
        b.style('padding', '3px 8px');
        b.style('font-size', '11px');
        b.mousePressed(() => { applyPreset(k); });
        presetBtns.push({k, btn: b});
    }

    applyPreset('match');
    textFont('Segoe UI');
    noLoop();
    redraw();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    redraw();
}

function applyPreset(k) {
    currentPreset = k;
    synthVerbs = {};
    if (k === 'match') {
        for (const v of VERBS) synthVerbs[v] = REAL_VERBS[v] * (0.96 + Math.random() * 0.08);
    } else if (k === 'over') {
        for (const v of VERBS) synthVerbs[v] = REAL_VERBS[v] * (0.95 + Math.random() * 0.1);
        synthVerbs.attempted *= 1.5;
        synthVerbs.passed *= 1.4;
        synthVerbs.mastered *= 1.6;
    } else if (k === 'under') {
        for (const v of VERBS) synthVerbs[v] = REAL_VERBS[v] * (0.95 + Math.random() * 0.1);
        synthVerbs.experienced *= 1.6;
        synthVerbs.attempted *= 0.4;
        synthVerbs.completed *= 0.3;
    } else if (k === 'skewed') {
        for (const v of VERBS) synthVerbs[v] = REAL_VERBS[v] * (0.5 + Math.random() * 1.0);
    }
    // normalize
    const tot = VERBS.reduce((s, v) => s + synthVerbs[v], 0);
    for (const v of VERBS) synthVerbs[v] /= tot;

    synthDur = REAL_DUR.map((p, i) => {
        if (k === 'match') return p * (0.95 + Math.random() * 0.1);
        if (k === 'over')  return p * (i >= 6 ? 1.4 : 0.7);
        if (k === 'under') return p * (i <= 2 ? 1.8 : 0.5);
        return p * (0.5 + Math.random() * 1.5);
    });
    const dt = synthDur.reduce((a, b) => a + b, 0);
    synthDur = synthDur.map(p => p / dt);
    redraw();
}

function draw() {
    background(248, 250, 252);
    tolLbl.html('Tolerance: ' + tolSlider.value() + '%');

    const tol = tolSlider.value() / 100;
    const padX = 12;
    const sideW = 220;
    const chartsW = canvasWidth - sideW - padX * 3;

    // Title
    fill(30, 41, 59); noStroke(); textSize(13); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Synthetic vs real — verb frequency and session duration', padX, 4);
    textStyle(NORMAL);

    // Top: verb chart
    drawVerbChart(padX, 26, chartsW, 200, tol);
    // Bottom: duration histogram
    drawDurChart(padX, 240, chartsW, drawHeight - 240 - 8, tol);

    // Side panel
    drawSidePanel(canvasWidth - sideW - padX, 26, sideW, drawHeight - 32, tol);
}

function drawVerbChart(x, y, w, h, tol) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 4); noStroke();
    fill(30, 41, 59); textStyle(BOLD); textSize(11); textAlign(LEFT, TOP);
    text('Verb frequency', x + 8, y + 6);
    textStyle(NORMAL);

    const chartX = x + 8;
    const chartY = y + 30;
    const chartW = w - 16;
    const chartH = h - 50;
    const barWPair = chartW / VERBS.length;
    const realC = '#0d9488', synC = '#dc2626';

    let maxV = 0;
    for (const v of VERBS) {
        maxV = Math.max(maxV, REAL_VERBS[v] * (1 + tol), synthVerbs[v]);
    }

    for (let i = 0; i < VERBS.length; i++) {
        const v = VERBS[i];
        const baseX = chartX + i * barWPair + 4;
        // tolerance band
        const target = REAL_VERBS[v];
        const tolHi = (target * (1 + tol)) / maxV * chartH;
        const tolLo = (target * (1 - tol)) / maxV * chartH;
        fill(220, 252, 231, 180);
        rect(baseX, chartY + chartH - tolHi, barWPair - 8, tolHi - tolLo);
        // real bar
        const rh = REAL_VERBS[v] / maxV * chartH;
        const sh = synthVerbs[v] / maxV * chartH;
        const bw = (barWPair - 12) / 2;
        fill(realC); rect(baseX, chartY + chartH - rh, bw, rh, 2);
        fill(synC);  rect(baseX + bw + 4, chartY + chartH - sh, bw, sh, 2);

        fill(60); textSize(9); textAlign(CENTER, TOP);
        text(v, baseX + (barWPair - 8) / 2, chartY + chartH + 2);
    }

    // legend
    fill(realC); rect(x + 8, y + h - 14, 10, 10, 2);
    fill(60); textAlign(LEFT, TOP); textSize(10); text('real', x + 22, y + h - 14);
    fill(synC); rect(x + 60, y + h - 14, 10, 10, 2);
    fill(60); text('synthetic', x + 74, y + h - 14);
    fill('#bbf7d0'); rect(x + 130, y + h - 14, 10, 10, 2);
    fill(60); text('tolerance band', x + 144, y + h - 14);
}

function drawDurChart(x, y, w, h, tol) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 4); noStroke();
    fill(30, 41, 59); textStyle(BOLD); textSize(11); textAlign(LEFT, TOP);
    text('Session duration histogram (5-minute buckets, 0–60 min)', x + 8, y + 6);
    textStyle(NORMAL);

    const chartX = x + 8;
    const chartY = y + 30;
    const chartW = w - 16;
    const chartH = h - 50;
    const barWPair = chartW / REAL_DUR.length;

    let maxV = 0;
    for (let i = 0; i < REAL_DUR.length; i++) {
        maxV = Math.max(maxV, REAL_DUR[i] * (1 + tol), synthDur[i]);
    }

    for (let i = 0; i < REAL_DUR.length; i++) {
        const baseX = chartX + i * barWPair + 4;
        const target = REAL_DUR[i];
        const tolHi = (target * (1 + tol)) / maxV * chartH;
        const tolLo = (target * (1 - tol)) / maxV * chartH;
        fill(220, 252, 231, 180);
        rect(baseX, chartY + chartH - tolHi, barWPair - 8, tolHi - tolLo);
        const rh = REAL_DUR[i] / maxV * chartH;
        const sh = synthDur[i] / maxV * chartH;
        const bw = (barWPair - 12) / 2;
        fill('#0d9488'); rect(baseX, chartY + chartH - rh, bw, rh, 2);
        fill('#dc2626'); rect(baseX + bw + 4, chartY + chartH - sh, bw, sh, 2);
        fill(60); textSize(9); textAlign(CENTER, TOP);
        text((i * 5) + '–' + ((i + 1) * 5), baseX + (barWPair - 8) / 2, chartY + chartH + 2);
    }
}

function drawSidePanel(x, y, w, h, tol) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 6); noStroke();
    fill(30, 41, 59); textStyle(BOLD); textSize(13); textAlign(LEFT, TOP);
    text('Pass / fail report', x + 10, y + 10);
    textStyle(NORMAL);

    let yy = y + 32;

    // Verb pass/fail
    let verbPass = true; let worstV = null; let worstVDev = 0;
    for (const v of VERBS) {
        const dev = Math.abs(synthVerbs[v] - REAL_VERBS[v]) / REAL_VERBS[v];
        if (dev > tol) verbPass = false;
        if (dev > worstVDev) { worstVDev = dev; worstV = v; }
    }
    drawBadge(x + 10, yy, w - 20, 'Verb frequency', verbPass);
    yy += 32;
    fill('#475569'); textSize(11);
    text('Worst verb: ' + (worstV || '-'), x + 14, yy);
    fill(verbPass ? '#16a34a' : '#dc2626');
    text((worstVDev * 100).toFixed(1) + '% off', x + 14, yy + 14);
    yy += 38;

    // Duration pass/fail
    let durPass = true; let worstB = -1; let worstBDev = 0;
    for (let i = 0; i < REAL_DUR.length; i++) {
        const dev = Math.abs(synthDur[i] - REAL_DUR[i]) / Math.max(REAL_DUR[i], 0.001);
        if (dev > tol) durPass = false;
        if (dev > worstBDev) { worstBDev = dev; worstB = i; }
    }
    drawBadge(x + 10, yy, w - 20, 'Session duration', durPass);
    yy += 32;
    fill('#475569'); textSize(11);
    const bucketLbl = worstB >= 0 ? (worstB * 5) + '–' + ((worstB + 1) * 5) + ' min' : '-';
    text('Worst bucket: ' + bucketLbl, x + 14, yy);
    fill(durPass ? '#16a34a' : '#dc2626');
    text((worstBDev * 100).toFixed(1) + '% off', x + 14, yy + 14);
    yy += 38;

    // Overall
    fill(30, 41, 59); textStyle(BOLD); textSize(12);
    text('Overall', x + 14, yy);
    yy += 16;
    const overallPass = verbPass && durPass;
    drawBadge(x + 10, yy, w - 20, overallPass ? 'PASS' : 'FAIL', overallPass);
}

function drawBadge(x, y, w, label, pass) {
    fill(pass ? '#16a34a' : '#dc2626');
    rect(x, y, w, 26, 4);
    fill(255); textSize(12); textStyle(BOLD); textAlign(LEFT, CENTER);
    text(label, x + 8, y + 13);
    textAlign(RIGHT, CENTER);
    text(pass ? '✓ PASS' : '✗ FAIL', x + w - 8, y + 13);
    textStyle(NORMAL);
}
