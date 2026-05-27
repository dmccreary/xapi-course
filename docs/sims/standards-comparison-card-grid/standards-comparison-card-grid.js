// Standards Comparison Card Grid
// CANVAS_HEIGHT: 660
// Bloom: Evaluate (L5) — compare xAPI vs alternatives across 6 dimensions

let canvasWidth = 800;
let drawHeight = 620;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;

const AXES = [
    'Granularity',          // instrumentation granularity
    'Vendor support',       // breadth of vendor support
    'Lock-in safety',       // inverted lock-in (higher = safer)
    'Cost-efficiency',      // inverted impl cost
    'LMS integration',      // depth of LMS integration
    'Flexibility'           // ecosystem flexibility
];

const STANDARDS = [
    {
        id: 'xapi', name: 'xAPI', year: '1.0.3 / 2014', color: '#4338ca',
        tagline: 'Open verb-based learning records.',
        scores: [5, 4, 5, 4, 3, 5],
        rationale: [
            'Statement-level fidelity captures any interaction',
            'Strong open-source vendor ecosystem',
            'Open standard with multiple LRS implementations',
            'Implementation cost moderate; many SDKs',
            'LMS integration is via cmi5 wrapper, not native',
            'Most flexible — verb vocabularies are open'
        ],
        recommend: 'Best for intelligent textbooks, web apps, simulations, and any deployment that needs interaction-level data.'
    },
    {
        id: 'caliper', name: 'IMS Caliper', year: '1.2 / 2020', color: '#0d9488',
        tagline: 'Predefined event-class learning analytics.',
        scores: [3, 3, 4, 3, 4, 3],
        rationale: [
            'Event-class granularity, less open than xAPI verbs',
            'Strong in higher-ed LMS vendors',
            'IMS-governed open standard',
            'Heavier conformance certification process',
            'Designed for LMS integration first',
            'Less flexible — vocabulary is fixed'
        ],
        recommend: 'Best for higher-ed LMS dashboards where IMS-conformant tools are already in place.'
    },
    {
        id: 'scorm', name: 'SCORM 2004', year: '4th ed / 2009', color: '#dc2626',
        tagline: 'Course completion and quiz tracking.',
        scores: [2, 5, 3, 5, 5, 1],
        rationale: [
            'Very limited — completion / pass / score only',
            'Universal LMS support',
            'ADL standard, but vendor-implementation drift exists',
            'Cheap to integrate; tooling is mature',
            'Native LMS integration is its core strength',
            'Inflexible — designed for courseware, not interactions'
        ],
        recommend: 'Best for compliance training and self-paced courseware where outcomes are pass/fail.'
    },
    {
        id: 'cmi5', name: 'cmi5', year: 'v1 / 2016', color: '#7c3aed',
        tagline: 'SCORM\'s successor — xAPI inside an LMS.',
        scores: [4, 3, 4, 4, 5, 4],
        rationale: [
            'xAPI underneath gives statement granularity',
            'Growing LMS support, narrower than SCORM',
            'Open standard from ADL',
            'Implementation cost between SCORM and pure xAPI',
            'Designed for LMS launch + bookmarking',
            'Flexible within the cmi5 session lifecycle'
        ],
        recommend: 'Best when you want xAPI granularity but the deployment lives inside an LMS.'
    },
    {
        id: 'proprietary', name: 'Proprietary SDK', year: 'closed', color: '#ca8a04',
        tagline: 'Lock-in for convenience.',
        scores: [4, 1, 1, 5, 4, 2],
        rationale: [
            'Often statement-level inside the vendor cloud',
            'Limited to one vendor',
            'Maximum lock-in — the data leaves with the contract',
            'Easiest to integrate (it\'s their SDK)',
            'Often deeply integrated with vendor LMS',
            'Vocabulary and schema are vendor-controlled'
        ],
        recommend: 'Best when you have committed to one vendor stack and don\'t plan to migrate.'
    }
];

let selected = 0;
let compareMode = false;
let compareSecond = 1;
let cardsRect = [];
let toggleBtn;

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.querySelector('main'));

    toggleBtn = createButton('Compare two standards: OFF');
    toggleBtn.parent(document.querySelector('main'));
    toggleBtn.style('margin', '6px 12px');
    toggleBtn.style('padding', '4px 10px');
    toggleBtn.style('font-size', '11px');
    toggleBtn.mousePressed(() => {
        compareMode = !compareMode;
        toggleBtn.html('Compare two standards: ' + (compareMode ? 'ON' : 'OFF'));
        redraw();
    });

    textFont('Segoe UI');
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
    const cardsY = 6;
    const cardW = (canvasWidth - padX * (STANDARDS.length + 1)) / STANDARDS.length;
    const cardH = 200;

    fill(30, 41, 59); textSize(13); textStyle(BOLD); textAlign(LEFT, TOP); noStroke();
    text('Compare xAPI to four alternative learning-data standards', padX, cardsY - 2);

    cardsRect = [];
    const cardTopY = cardsY + 18;
    for (let i = 0; i < STANDARDS.length; i++) {
        const cx = padX + i * (cardW + padX);
        drawCard(cx, cardTopY, cardW, cardH, STANDARDS[i],
            (i === selected) || (compareMode && i === compareSecond));
        cardsRect.push({ x: cx, y: cardTopY, w: cardW, h: cardH });
    }

    // Detail panel below cards
    const panelY = cardTopY + cardH + 10;
    drawDetailPanel(padX, panelY, canvasWidth - padX * 2, canvasHeight - panelY - 50);
}

function drawCard(x, y, w, h, s, isSelected) {
    fill(255);
    stroke(isSelected ? s.color : '#e2e8f0');
    strokeWeight(isSelected ? 2.5 : 1);
    rect(x, y, w, h, 6);
    noStroke();
    // header bar
    fill(s.color);
    rect(x, y, w, 32, 6, 6, 0, 0);
    fill(255); textSize(13); textStyle(BOLD); textAlign(LEFT, CENTER);
    text(s.name, x + 8, y + 16);
    textStyle(NORMAL); textSize(10); textAlign(RIGHT, CENTER);
    text(s.year, x + w - 8, y + 16);

    // tagline
    fill(60); textSize(10); textAlign(LEFT, TOP);
    drawWrappedText(s.tagline, x + 6, y + 40, w - 12, 12);

    // mini radar
    drawRadar(x + w / 2, y + h - 70, Math.min(w, h - 30) * 0.36, [s], false);
}

function drawDetailPanel(x, y, w, h) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 6); noStroke();

    // Side-by-side: bigger radar on left, rationale on right
    const radarSize = Math.min(h - 20, w * 0.3);
    const radarX = x + radarSize / 2 + 16;
    const radarY = y + h / 2;

    // Selected vs compare radar
    const list = compareMode
        ? [STANDARDS[selected], STANDARDS[compareSecond]]
        : [STANDARDS[selected]];
    drawRadar(radarX, radarY, radarSize / 2, list, true);

    // Rationale on right
    const txtX = x + radarSize + 40;
    const txtW = w - radarSize - 60;
    const main = STANDARDS[selected];
    fill(main.color); rect(txtX, y + 12, 6, 22);
    fill(30, 41, 59); textStyle(BOLD); textSize(13); textAlign(LEFT, TOP);
    text(main.name + ' — dimension scoring', txtX + 12, y + 14);
    textStyle(NORMAL);

    let yy = y + 40;
    textSize(10);
    for (let i = 0; i < AXES.length; i++) {
        // axis label
        fill('#475569'); textStyle(BOLD);
        text(AXES[i], txtX + 12, yy);
        // score bar
        const score = main.scores[i];
        for (let j = 0; j < 5; j++) {
            fill(j < score ? main.color : '#e2e8f0');
            rect(txtX + 110, yy + 1, 8, 8, 1);
            // Note: small offset between bars
            // adjust so they tile
        }
        // place 5 bars correctly:
        for (let j = 0; j < 5; j++) {
            fill(j < score ? main.color : '#e2e8f0');
            noStroke();
            rect(txtX + 100 + j * 11, yy, 8, 9, 1);
        }
        // rationale
        textStyle(NORMAL); fill('#334155');
        text(main.rationale[i], txtX + 160, yy, txtW - 160, 30);
        yy += 22;
    }

    // Recommended scenario
    fill('#16a34a'); textStyle(BOLD); textSize(11); textAlign(LEFT, TOP);
    text('Recommended scenario:', txtX + 12, yy + 4);
    textStyle(NORMAL); fill('#334155'); textSize(10);
    drawWrappedText(main.recommend, txtX + 12, yy + 22, txtW - 12, 12);
}

function drawRadar(cx, cy, r, list, big) {
    // axes
    stroke('#cbd5e1'); strokeWeight(1); noFill();
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
    // axis labels (only if big)
    if (big) {
        noStroke(); fill('#475569'); textSize(9); textAlign(CENTER, CENTER);
        for (let i = 0; i < AXES.length; i++) {
            const ang = -PI / 2 + (i / AXES.length) * TWO_PI;
            text(AXES[i], cx + cos(ang) * (r + 16), cy + sin(ang) * (r + 14));
        }
    }
    // polygons for each standard in list
    for (let s of list) {
        noStroke();
        const c = color(s.color);
        c.setAlpha(60);
        fill(c);
        stroke(s.color); strokeWeight(2);
        beginShape();
        for (let i = 0; i < AXES.length; i++) {
            const ang = -PI / 2 + (i / AXES.length) * TWO_PI;
            const rr = (r * s.scores[i]) / 5;
            vertex(cx + cos(ang) * rr, cy + sin(ang) * rr);
        }
        endShape(CLOSE);
    }
    noStroke();
    if (big && compareMode && list.length > 1) {
        // legend
        fill(list[0].color); rect(cx - r, cy + r + 22, 12, 8);
        fill(60); textAlign(LEFT, TOP); textSize(9);
        text(list[0].name, cx - r + 16, cy + r + 22);
        fill(list[1].color); rect(cx - r + 80, cy + r + 22, 12, 8);
        fill(60); text(list[1].name, cx - r + 96, cy + r + 22);
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
            if (compareMode) {
                if (i !== selected) compareSecond = i;
            } else {
                selected = i;
            }
            redraw();
            return;
        }
    }
}
