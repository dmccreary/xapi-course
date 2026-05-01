// Learner Archetype Profiles
// CANVAS_HEIGHT: 620
// Bloom: Understand (L2) — distinguish five canonical learner archetypes

let canvasWidth = 800;
let canvasHeight = 620;

const ARCHETYPES = [
    { id: 'fast', name: 'Fast Learner', color: '#3b82f6',
        stmts: 0.55, sessLen: 0.45, passRate: 0.92,
        summary: 'Quick to read, moves on after first-try success.',
        description: 'Reads the chapter once, attempts most interactives, gets them right on the first try, and moves on. Sessions are short (15–25 min), per-chapter statement counts are below average, and pass rates are at or near ceiling.',
        verbProfile: { experienced: 0.20, interacted: 0.20, attempted: 0.20, completed: 0.10, passed: 0.18, failed: 0.02, mastered: 0.08, asked: 0.02 },
        example: ['experienced page-1', 'interacted slider-A', 'attempted q-1', 'passed q-1', 'completed chapter']
    },
    { id: 'struggling', name: 'Struggling Learner', color: '#dc2626',
        stmts: 0.95, sessLen: 0.85, passRate: 0.42,
        summary: 'Many attempts, multiple sessions, lower pass rates.',
        description: 'Returns to the same section repeatedly. Many failed attempts before passing. Often re-watches MicroSims and re-reads passages. Not the same as disengaged — high effort, low first-try success.',
        verbProfile: { experienced: 0.25, interacted: 0.18, attempted: 0.32, completed: 0.05, passed: 0.08, failed: 0.10, mastered: 0.01, asked: 0.01 },
        example: ['experienced page-1', 'attempted q-1', 'failed q-1', 'experienced page-1', 'attempted q-1', 'failed q-1', 'attempted q-1', 'passed q-1']
    },
    { id: 'disengaged', name: 'Disengaged', color: '#64748b',
        stmts: 0.20, sessLen: 0.25, passRate: 0.30,
        summary: 'Rarely returns; few interactions per session.',
        description: 'Opens the textbook briefly, scrolls through a page or two, may click one MicroSim, then leaves. Doesn\'t come back. The lowest signal-to-noise group — easy to miss without verb diversity analysis.',
        verbProfile: { experienced: 0.65, interacted: 0.10, attempted: 0.08, completed: 0.02, passed: 0.05, failed: 0.05, mastered: 0.00, asked: 0.05 },
        example: ['experienced page-1', 'experienced page-2', 'interacted slider-A']
    },
    { id: 'relearner', name: 'Re-learner', color: '#7c3aed',
        stmts: 0.60, sessLen: 0.40, passRate: 0.78,
        summary: 'Returns to refresh; targeted, fast re-reads.',
        description: 'Already learned this material before; coming back to refresh. Sessions are short but verb-dense — they jump to the section they need, do a few quick checks, and leave satisfied.',
        verbProfile: { experienced: 0.30, interacted: 0.10, attempted: 0.18, completed: 0.05, passed: 0.20, failed: 0.05, mastered: 0.10, asked: 0.02 },
        example: ['experienced page-7', 'attempted q-7', 'passed q-7', 'experienced page-9', 'mastered concept-9']
    },
    { id: 'mastery', name: 'Mastery-seeker', color: '#16a34a',
        stmts: 0.85, sessLen: 0.70, passRate: 0.88,
        summary: 'Long sessions, tries every interactive, asks often.',
        description: 'Engages deeply with every section. Tries each MicroSim multiple times to explore parameter space. Uses the chatbot or asks instructor questions. High effort AND high success.',
        verbProfile: { experienced: 0.20, interacted: 0.25, attempted: 0.20, completed: 0.05, passed: 0.15, failed: 0.04, mastered: 0.06, asked: 0.05 },
        example: ['experienced page-1', 'interacted slider-A', 'interacted slider-A', 'asked chatbot', 'attempted q-1', 'passed q-1', 'mastered concept-1', 'completed chapter']
    }
];

const VERBS = ['experienced', 'interacted', 'attempted', 'completed', 'passed', 'failed', 'mastered', 'asked'];

let selected = 0;
let cardsRect = [];

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.querySelector('main'));
    textFont('Segoe UI');
    noLoop();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    redraw();
}

function draw() {
    background(248, 250, 252);

    const padX = 12;
    const titleY = 6;
    fill(30, 41, 59); noStroke(); textSize(14); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Five canonical learner archetypes', padX, titleY);
    textStyle(NORMAL); textSize(10); fill(100, 116, 139);
    text('Click any card to see the full profile and verb signature.', padX, titleY + 18);

    const sidePanelW = 260;
    const cardsX = padX;
    const cardsY = 38;
    const cardsW = canvasWidth - sidePanelW - padX * 3;
    const cardH = (canvasHeight - cardsY - 14) / ARCHETYPES.length;

    cardsRect = [];
    for (let i = 0; i < ARCHETYPES.length; i++) {
        const a = ARCHETYPES[i];
        const cy = cardsY + i * cardH;
        drawCard(cardsX, cy, cardsW, cardH - 6, a, i === selected);
        cardsRect.push({ x: cardsX, y: cy, w: cardsW, h: cardH - 6 });
    }

    drawSidePanel(canvasWidth - sidePanelW - padX, cardsY, sidePanelW, canvasHeight - cardsY - 14);
}

function drawCard(x, y, w, h, a, isSelected) {
    // shadow / bg
    fill(255);
    stroke(isSelected ? a.color : '#e2e8f0');
    strokeWeight(isSelected ? 2.5 : 1);
    rect(x, y, w, h, 6);
    noStroke();
    // color band on left
    fill(a.color); rect(x, y, 6, h, 6, 0, 0, 6);

    fill(30, 41, 59); textSize(13); textStyle(BOLD); textAlign(LEFT, TOP);
    text(a.name, x + 14, y + 6);
    textStyle(NORMAL); textSize(11); fill(80, 90, 110);
    text(a.summary, x + 14, y + 24);

    // 3 mini bars
    const barAreaX = x + 14;
    const barAreaY = y + h - 28;
    const barAreaW = w - 28;
    const barW = (barAreaW - 24) / 3;
    drawMiniBar(barAreaX, barAreaY, barW, 22, 'stmts', a.stmts, a.color);
    drawMiniBar(barAreaX + barW + 12, barAreaY, barW, 22, 'session', a.sessLen, a.color);
    drawMiniBar(barAreaX + (barW + 12) * 2, barAreaY, barW, 22, 'pass %', a.passRate, a.color);
}

function drawMiniBar(x, y, w, h, label, value, color) {
    fill('#f1f5f9'); rect(x, y, w, h, 3);
    fill(color); rect(x, y, w * value, h, 3);
    fill(30, 41, 59); textSize(10); textStyle(BOLD); textAlign(LEFT, CENTER);
    text(label, x + 4, y + h / 2);
    textStyle(NORMAL); textAlign(RIGHT, CENTER);
    text((value * 100).toFixed(0) + '%', x + w - 4, y + h / 2);
}

function drawSidePanel(x, y, w, h) {
    fill(255); stroke('#e2e8f0'); strokeWeight(1);
    rect(x, y, w, h, 6); noStroke();

    const a = ARCHETYPES[selected];

    // Header
    fill(a.color); rect(x, y, w, 30, 6, 6, 0, 0); noStroke();
    fill(255); textSize(13); textStyle(BOLD); textAlign(LEFT, CENTER);
    text(a.name, x + 12, y + 15);
    textStyle(NORMAL);

    // description
    fill(60); textSize(11); textAlign(LEFT, TOP);
    drawWrappedText(a.description, x + 12, y + 38, w - 24, 14);

    // verb chart
    const vy = y + 152;
    fill(30, 41, 59); textStyle(BOLD); textSize(11);
    text('Verb-frequency profile', x + 12, vy);
    textStyle(NORMAL); textSize(10);
    const rowH = 14;
    for (let i = 0; i < VERBS.length; i++) {
        const v = VERBS[i];
        const p = a.verbProfile[v];
        const ry = vy + 16 + i * rowH;
        fill('#f1f5f9'); rect(x + 80, ry, w - 110, rowH - 4, 2);
        fill(a.color); rect(x + 80, ry, (w - 110) * p, rowH - 4, 2);
        fill('#475569'); textAlign(LEFT, CENTER);
        text(v, x + 12, ry + (rowH - 4) / 2);
        fill('#1e293b'); textAlign(RIGHT, CENTER);
        text((p * 100).toFixed(0) + '%', x + w - 14, ry + (rowH - 4) / 2);
    }

    // example session
    const ey = vy + 16 + VERBS.length * rowH + 10;
    if (ey < y + h - 60) {
        fill(30, 41, 59); textStyle(BOLD); textSize(11); textAlign(LEFT, TOP);
        text('Example session', x + 12, ey);
        textStyle(NORMAL); textSize(10); fill(60);
        for (let i = 0; i < a.example.length && ey + 16 + i * 12 < y + h - 6; i++) {
            text((i + 1) + '. ' + a.example[i], x + 14, ey + 16 + i * 12);
        }
    }
}

function drawWrappedText(str, x, y, maxW, lineH) {
    const words = str.split(' ');
    let line = '';
    let yy = y;
    for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (textWidth(test) > maxW) {
            text(line, x, yy);
            line = w;
            yy += lineH;
        } else {
            line = test;
        }
    }
    if (line) text(line, x, yy);
}

function mousePressed() {
    for (let i = 0; i < cardsRect.length; i++) {
        const r = cardsRect[i];
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
            selected = i;
            redraw();
            return;
        }
    }
}
