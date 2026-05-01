// Engagement Heatmap MicroSim
// CANVAS_HEIGHT: 600
// Bloom: Analyze (L4) — read a heatmap to identify under-engaged sections

let canvasWidth = 800;
let drawHeight = 460;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;

const SECTIONS = [
    '1. Introduction',
    '2. Core Concept',
    '3. Worked Example',
    '4. MicroSim Practice',
    '5. Common Pitfalls',
    '6. Advanced Topic',
    '7. Quiz',
    '8. Reflection'
];

let cohortSlider, windowSlider, verbSelect, regenBtn;
let cohortLbl, windowLbl;
let counts = [];
let selectedSection = -1;

const VERBS = ['all', 'experienced', 'interacted', 'attempted'];

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.querySelector('main'));

    cohortLbl = createDiv('Cohort size: 100');
    cohortLbl.parent(document.querySelector('main'));
    cohortLbl.style('font-size', '12px');
    cohortLbl.style('margin', '4px 12px 0');
    cohortSlider = createSlider(10, 500, 100, 1);
    cohortSlider.parent(document.querySelector('main'));
    cohortSlider.style('width', '92%');
    cohortSlider.style('margin', '0 12px');

    windowLbl = createDiv('Time window: 7 days');
    windowLbl.parent(document.querySelector('main'));
    windowLbl.style('font-size', '12px');
    windowLbl.style('margin', '4px 12px 0');
    windowSlider = createSlider(1, 30, 7, 1);
    windowSlider.parent(document.querySelector('main'));
    windowSlider.style('width', '92%');
    windowSlider.style('margin', '0 12px');

    const verbWrap = createDiv('');
    verbWrap.parent(document.querySelector('main'));
    verbWrap.style('margin', '6px 12px');
    verbWrap.style('font-size', '12px');
    const verbLbl = createSpan('Verb filter: ');
    verbLbl.parent(verbWrap);
    verbSelect = createSelect();
    verbSelect.parent(verbWrap);
    for (const v of VERBS) verbSelect.option(v);
    verbSelect.changed(redraw);

    regenBtn = createButton('Synthesize new data');
    regenBtn.parent(verbWrap);
    regenBtn.style('margin-left', '10px');
    regenBtn.style('padding', '3px 10px');
    regenBtn.style('font-size', '12px');
    regenBtn.mousePressed(() => { synthesizeData(); redraw(); });

    cohortSlider.input(redraw);
    windowSlider.input(redraw);

    synthesizeData();
    textFont('Segoe UI');
    noLoop();
    redraw();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    redraw();
}

function synthesizeData() {
    counts = SECTIONS.map(() => Math.random());
    counts[0] = 0.85 + Math.random() * 0.1;
    counts[2] = 0.75 + Math.random() * 0.15;
    counts[5] = 0.20 + Math.random() * 0.20;
    counts[7] = 0.30 + Math.random() * 0.25;
}

function getCounts() {
    const cohort = cohortSlider.value();
    const days = windowSlider.value();
    const verbMult = verbSelect.value() === 'all' ? 1.0
        : verbSelect.value() === 'experienced' ? 0.55
        : verbSelect.value() === 'interacted' ? 0.30
        : 0.18;
    return counts.map(p => Math.round(p * cohort * days * 4 * verbMult));
}

function colorForRatio(r) {
    const c1 = color(255, 247, 188);
    const c2 = color(178, 24, 43);
    return lerpColor(c1, c2, constrain(r, 0, 1));
}

function draw() {
    background(248, 250, 252);
    cohortLbl.html('Cohort size: ' + cohortSlider.value());
    windowLbl.html('Time window: ' + windowSlider.value() + ' day' + (windowSlider.value() === 1 ? '' : 's'));

    const heatX = 14;
    const heatY = 10;
    const sidePanelW = 240;
    const heatW = canvasWidth - sidePanelW - heatX * 3;
    const heatH = drawHeight - heatY - 60;
    const rowH = heatH / SECTIONS.length;

    // Title
    fill(30, 41, 59); noStroke(); textSize(13); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Engagement heatmap — interactions per chapter section', heatX, 0);
    textStyle(NORMAL); textSize(10); fill(100, 116, 139);
    text('Click any row for the breakdown.', heatX, 18);

    // Rows
    const cs = getCounts();
    const maxC = Math.max(...cs, 1);
    for (let i = 0; i < SECTIONS.length; i++) {
        const y = heatY + 22 + i * rowH;
        const ratio = cs[i] / maxC;
        fill(colorForRatio(ratio));
        stroke(selectedSection === i ? '#1e293b' : '#e2e8f0');
        strokeWeight(selectedSection === i ? 2 : 1);
        rect(heatX, y, heatW, rowH - 4, 3);
        noStroke();
        // Label
        fill(ratio > 0.6 ? 255 : 30);
        textSize(12); textAlign(LEFT, CENTER); textStyle(BOLD);
        text(SECTIONS[i], heatX + 8, y + (rowH - 4) / 2);
        textStyle(NORMAL);
        textAlign(RIGHT, CENTER);
        text(cs[i].toLocaleString() + ' interactions', heatX + heatW - 8, y + (rowH - 4) / 2);
    }

    // Legend bar at bottom of heatmap
    const legY = heatY + 22 + heatH + 4;
    const legSteps = 60;
    const legW = heatW;
    for (let s = 0; s < legSteps; s++) {
        fill(colorForRatio(s / (legSteps - 1)));
        noStroke();
        rect(heatX + s * (legW / legSteps), legY, legW / legSteps + 1, 14);
    }
    fill(60); textSize(10); textAlign(LEFT, TOP); textStyle(NORMAL);
    text('Less engaged', heatX, legY + 18);
    textAlign(RIGHT, TOP);
    text('More engaged', heatX + legW, legY + 18);

    // Side panel
    drawSidePanel(canvasWidth - sidePanelW - heatX, heatY, sidePanelW, drawHeight - heatY - 10, cs);
}

function drawSidePanel(x, y, w, h, cs) {
    fill(255); stroke('#e2e8f0'); strokeWeight(1); rect(x, y, w, h, 6);
    noStroke();
    fill(30, 41, 59); textStyle(BOLD); textSize(13); textAlign(LEFT, TOP);
    text('Reading guide', x + 10, y + 10);
    textStyle(NORMAL);

    if (selectedSection >= 0) {
        const i = selectedSection;
        textSize(12); fill('#4338ca'); textStyle(BOLD);
        text(SECTIONS[i], x + 10, y + 32);
        textStyle(NORMAL); textSize(11); fill(60);
        text('Interactions: ' + cs[i].toLocaleString(), x + 10, y + 50);

        // Synthetic breakdown
        const breakdown = [
            ['experienced', 0.55],
            ['interacted', 0.28],
            ['attempted', 0.12],
            ['completed',  0.05]
        ];
        let yy = y + 72;
        textSize(11);
        for (const [v, p] of breakdown) {
            const cnt = Math.round(cs[i] * p);
            fill('#64748b');
            text(v, x + 10, yy);
            fill('#1e293b'); textStyle(BOLD);
            textAlign(RIGHT, TOP);
            text(cnt.toLocaleString(), x + w - 10, yy);
            textAlign(LEFT, TOP); textStyle(NORMAL);
            yy += 16;
        }
    } else {
        textSize(11); fill('#475569');
        text('Dark red rows: high engagement —\noften easy / fun sections.', x + 10, y + 32);
        text('Light yellow rows: low engagement —\ncandidates for redesign.', x + 10, y + 76);
        text('Watch the gap between adjacent\nsections — sudden drops often\nflag a confusing transition.', x + 10, y + 124);
        text('Click any row for verb breakdown.', x + 10, y + 200);
    }
}

function mousePressed() {
    const heatX = 14;
    const heatY = 10;
    const sidePanelW = 240;
    const heatW = canvasWidth - sidePanelW - heatX * 3;
    const heatH = drawHeight - heatY - 60;
    const rowH = heatH / SECTIONS.length;

    if (mouseX < heatX || mouseX > heatX + heatW) return;
    for (let i = 0; i < SECTIONS.length; i++) {
        const y = heatY + 22 + i * rowH;
        if (mouseY >= y && mouseY < y + rowH - 4) {
            selectedSection = (selectedSection === i) ? -1 : i;
            redraw();
            return;
        }
    }
}
