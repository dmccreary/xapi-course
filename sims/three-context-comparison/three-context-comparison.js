// Three-Context Comparison
// CANVAS_HEIGHT: 620
// Bloom: Evaluate (L5) — compare K-12, Higher Ed, Corporate L&D contexts

let canvasWidth = 800;
let drawHeight = 580;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;

const AXES = [
    'Regulatory burden',
    'Deployment timeline',
    'Analytics permissibility',
    'Vendor flexibility'
];

const CONTEXTS = [
    {
        id: 'k12', name: 'K-12', color: '#dc2626',
        scoresUS: [5, 4, 2, 2],
        scoresEU: [5, 4, 1, 2],
        regs: ['FERPA', 'COPPA (under 13)', 'State student-data laws'],
        summary: 'Strict student privacy, slow procurement, limited analytics.',
        description: 'Highly regulated. Direct identifiers in xAPI statements are typically off-limits without explicit parental opt-in. School districts move slowly and prefer well-known vendors.',
        procurement: 'District RFP → board approval → multi-year pilot. Sometimes 18+ months from interest to deployment.',
        useCases: 'Aggregate engagement reporting, completion roll-ups, anonymized cohort comparisons.',
        pitfalls: 'Storing names or emails in actor.name without parental consent triggers FERPA violations; inferring location from IP triggers state laws.'
    },
    {
        id: 'highered', name: 'Higher Ed', color: '#4338ca',
        scoresUS: [4, 3, 3, 4],
        scoresEU: [5, 3, 2, 4],
        regs: ['FERPA', 'IRB (research)', 'Institutional policies'],
        summary: 'FERPA + IRB review for research; faster than K-12.',
        description: 'FERPA still applies, but adults can consent on their own. Research uses require IRB approval. Faculty often want individual-level data for class management.',
        procurement: 'Department or center → CIO sign-off. 6–12 months typical.',
        useCases: 'Adaptive course adjustments, struggle detection, IRB-approved research on learning effectiveness.',
        pitfalls: 'Confusing classroom-management uses (FERPA-compliant) with research (IRB-required); pseudonyms aren\'t pseudonyms if the registrar mapping is shared with researchers.'
    },
    {
        id: 'corp', name: 'Corporate L&D', color: '#16a34a',
        scoresUS: [3, 2, 4, 5],
        scoresEU: [4, 2, 3, 5],
        regs: ['Country labor law', 'Works councils (EU)', 'GDPR if EU staff'],
        summary: 'Fastest to deploy; most analytics flexibility.',
        description: 'Employees consent to data collection as a condition of employment. The bar is "lawful basis" rather than parental opt-in. Procurement is faster but works councils can add friction in EU/UK.',
        procurement: 'L&D team → procurement → IT security review. 1–3 months typical.',
        useCases: 'Skill-progression tracking, compliance training completion, ROI analysis on training spend.',
        pitfalls: 'Tracking that disadvantages individuals (e.g., flagging slow learners) can violate works-council agreements in EU; cross-border transfers to US LRS need GDPR safeguards.'
    }
];

let selected = 0;
let euOverlay = false;
let columnRect = [];
let euBtn;

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.querySelector('main'));

    euBtn = createButton('Add EU enrollees: OFF');
    euBtn.parent(document.querySelector('main'));
    euBtn.style('margin', '6px 12px');
    euBtn.style('padding', '4px 10px');
    euBtn.style('font-size', '11px');
    euBtn.mousePressed(() => {
        euOverlay = !euOverlay;
        euBtn.html('Add EU enrollees: ' + (euOverlay ? 'ON' : 'OFF'));
        redraw();
    });

    noLoop();
    redraw();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    redraw();
}

function draw() {
    background(248, 250, 252);
    const padX = 8;
    const titleY = 4;
    fill(30, 41, 59); textStyle(BOLD); textSize(13); textAlign(LEFT, TOP); noStroke();
    text('Compare K-12, Higher Ed, and Corporate L&D contexts', padX, titleY);
    textStyle(NORMAL); textSize(10); fill(100, 116, 139);
    text('Click any column to see the full profile. Toggle "Add EU enrollees" to overlay GDPR constraints.',
        padX, titleY + 16);

    const colsY = 38;
    const colsH = 250;
    const colW = (canvasWidth - 2 * padX - 16) / 3;
    columnRect = [];
    for (let i = 0; i < CONTEXTS.length; i++) {
        const cx = padX + i * (colW + 8);
        drawColumn(cx, colsY, colW, colsH, CONTEXTS[i], i === selected);
        columnRect.push({ x: cx, y: colsY, w: colW, h: colsH });
    }

    // Detail panel
    const detY = colsY + colsH + 12;
    drawDetailPanel(padX, detY, canvasWidth - 2 * padX, drawHeight - detY - 4);
}

function drawColumn(x, y, w, h, ctx, isSelected) {
    fill(255);
    stroke(isSelected ? ctx.color : '#e2e8f0');
    strokeWeight(isSelected ? 2.5 : 1);
    rect(x, y, w, h, 6);
    noStroke();
    // header
    fill(ctx.color); rect(x, y, w, 32, 6, 6, 0, 0);
    fill(255); textStyle(BOLD); textSize(13); textAlign(LEFT, CENTER);
    text(ctx.name, x + 8, y + 16);
    textStyle(NORMAL);

    // radar
    const radarSize = 90;
    drawRadar(x + w / 2, y + 100, radarSize, ctx);

    // Top regulations
    fill(30, 41, 59); textStyle(BOLD); textSize(11); textAlign(LEFT, TOP);
    text('Top regulations', x + 10, y + 188);
    textStyle(NORMAL); textSize(10);
    let yy = y + 204;
    for (const r of ctx.regs) {
        fill('#475569');
        text('• ' + r, x + 12, yy);
        yy += 12;
    }
    // summary
    fill(60); textSize(9); textStyle(ITALIC);
    drawWrappedText(ctx.summary, x + 10, yy + 2, w - 20, 11);
    textStyle(NORMAL);
}

function drawRadar(cx, cy, r, ctx) {
    // grid
    stroke('#cbd5e1'); noFill(); strokeWeight(1);
    for (let g = 1; g <= 5; g++) {
        beginShape();
        for (let i = 0; i < AXES.length; i++) {
            const ang = -PI / 2 + (i / AXES.length) * TWO_PI;
            const rr = (r * g) / 5;
            vertex(cx + cos(ang) * rr, cy + sin(ang) * rr);
        }
        endShape(CLOSE);
    }
    for (let i = 0; i < AXES.length; i++) {
        const ang = -PI / 2 + (i / AXES.length) * TWO_PI;
        line(cx, cy, cx + cos(ang) * r, cy + sin(ang) * r);
    }
    noStroke();

    // US polygon
    drawPoly(cx, cy, r, ctx.scoresUS, ctx.color);
    // EU overlay
    if (euOverlay) {
        drawPoly(cx, cy, r, ctx.scoresEU, '#0d9488', true);
    }

    // axis labels (short) — drawn with a translucent white pill so they
    // stay legible on top of the panel header band and the regulations title
    const labels = ['Reg', 'Time', 'Analy', 'Vend'];
    textSize(8); textAlign(CENTER, CENTER);
    for (let i = 0; i < AXES.length; i++) {
        const ang = -PI / 2 + (i / AXES.length) * TWO_PI;
        const lx = cx + cos(ang) * (r + 10);
        const ly = cy + sin(ang) * (r + 10);
        const tw = textWidth(labels[i]);
        noStroke();
        fill(255, 255, 255, 220);
        rectMode(CENTER);
        rect(lx, ly, tw + 6, 11, 3);
        rectMode(CORNER);
        fill('#475569');
        text(labels[i], lx, ly);
    }
}

function drawPoly(cx, cy, r, scores, col, dashed = false) {
    const c = color(col);
    c.setAlpha(60);
    fill(c);
    stroke(col); strokeWeight(2);
    if (dashed) drawingContext.setLineDash([4, 4]);
    beginShape();
    for (let i = 0; i < scores.length; i++) {
        const ang = -PI / 2 + (i / scores.length) * TWO_PI;
        const rr = (r * scores[i]) / 5;
        vertex(cx + cos(ang) * rr, cy + sin(ang) * rr);
    }
    endShape(CLOSE);
    if (dashed) drawingContext.setLineDash([]);
    noStroke();
}

function drawDetailPanel(x, y, w, h) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 6); noStroke();

    const ctx = CONTEXTS[selected];
    fill(ctx.color); rect(x, y, 6, h, 6, 0, 0, 6);

    fill(30, 41, 59); textStyle(BOLD); textSize(13); textAlign(LEFT, TOP);
    text(ctx.name + ' — full profile', x + 14, y + 8);
    textStyle(NORMAL);

    fill('#334155'); textSize(11);
    drawWrappedText(ctx.description, x + 14, y + 30, w - 28, 14);

    // Metadata rows
    let yy = y + 86;
    const cw1 = 130;
    fill('#64748b'); textSize(11); textStyle(BOLD);
    text('Procurement path', x + 14, yy);
    textStyle(NORMAL); fill('#334155');
    drawWrappedText(ctx.procurement, x + 14 + cw1, yy, w - cw1 - 28, 14);
    yy += 32;

    fill('#64748b'); textStyle(BOLD);
    text('Common use cases', x + 14, yy);
    textStyle(NORMAL); fill('#334155');
    drawWrappedText(ctx.useCases, x + 14 + cw1, yy, w - cw1 - 28, 14);
    yy += 32;

    fill('#64748b'); textStyle(BOLD);
    text('Common pitfalls', x + 14, yy);
    textStyle(NORMAL); fill('#dc2626');
    drawWrappedText(ctx.pitfalls, x + 14 + cw1, yy, w - cw1 - 28, 14);
    yy += 36;

    if (euOverlay) {
        fill('#0d9488'); textStyle(BOLD); textSize(11);
        text('+ EU overlay: GDPR adds explicit-consent requirements,', x + 14, yy);
        text('  data-subject-access rights, and cross-border transfer constraints.', x + 14, yy + 14);
        textStyle(NORMAL);
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
    for (let i = 0; i < columnRect.length; i++) {
        const r = columnRect[i];
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
            selected = i;
            redraw();
            return;
        }
    }
}
