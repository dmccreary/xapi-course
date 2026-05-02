// Production Readiness Checklist
// CANVAS_HEIGHT: 390
// Bloom: Evaluate (L5) — assess deployment readiness across 4 categories

let canvasWidth = 800;
let drawHeight = 350;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;

const CATEGORIES = [
    {
        name: 'Vocabulary', color: '#4338ca',
        items: [
            { id: 'voc-1', label: 'Profile published',
              detail: 'Vocabulary profile is hosted at a stable URL with content negotiation.', chapter: 'Ch 13.2 / Ch 4' },
            { id: 'voc-2', label: 'Profile validation in CI',
              detail: 'Statements are validated against the profile in every CI build.', chapter: 'Ch 12.3 / Ch 13' },
            { id: 'voc-3', label: 'Activity types documented',
              detail: 'Every custom activity type IRI has a documented definition and example.', chapter: 'Ch 5.4' },
            { id: 'voc-4', label: 'Extension namespace versioned',
              detail: 'All extensions are namespaced and version-pinned.', chapter: 'Ch 3.4' }
        ]
    },
    {
        name: 'Pipeline', color: '#0d9488',
        items: [
            { id: 'pipe-1', label: 'AP integration complete',
              detail: 'cmi5 wrapper or equivalent connects the textbook to the LMS.', chapter: 'Ch 12.2' },
            { id: 'pipe-2', label: 'LRS provisioned',
              detail: 'Production LRS chosen, sized, and provisioned with backups.', chapter: 'Ch 7' },
            { id: 'pipe-3', label: 'Analytics layer in place',
              detail: 'Stream processor and OLAP store are deployed.', chapter: 'Ch 10.3' },
            { id: 'pipe-4', label: 'Dashboard layer live',
              detail: 'Operator and educator dashboards are visible and bookmarked.', chapter: 'Ch 10.4' },
            { id: 'pipe-5', label: 'Pipeline latency under SLO',
              detail: 'End-to-end emit-to-dashboard latency meets the SLO target.', chapter: 'Ch 13.4' }
        ]
    },
    {
        name: 'Observability', color: '#ca8a04',
        items: [
            { id: 'obs-1', label: 'DevTools-ready',
              detail: 'Statements and responses inspectable in the browser DevTools panel.', chapter: 'Ch 10.1' },
            { id: 'obs-2', label: 'LRS logs shipped to ops stack',
              detail: 'Access logs flow to the central log store.', chapter: 'Ch 10.2' },
            { id: 'obs-3', label: 'Dashboards live',
              detail: 'Health and engagement dashboards are visible to the on-call team.', chapter: 'Ch 10.4' },
            { id: 'obs-4', label: 'Alerting configured',
              detail: 'Pages fire on SLO breach within 5 minutes.', chapter: 'Ch 10.5' }
        ]
    },
    {
        name: 'Security', color: '#dc2626',
        items: [
            { id: 'sec-1', label: 'HTTPS everywhere',
              detail: 'Every leg of the pipeline uses TLS.', chapter: 'Ch 7 / Ch 14' },
            { id: 'sec-2', label: 'Tokens short-lived',
              detail: 'Auth tokens expire ≤ 1 hour with refresh.', chapter: 'Ch 7' },
            { id: 'sec-3', label: 'PII discipline enforced',
              detail: 'No PII in result, context, or extensions.', chapter: 'Ch 14.2' },
            { id: 'sec-4', label: 'Audit logs retained',
              detail: 'Read and write access is logged and retained per policy.', chapter: 'Ch 14.4' },
            { id: 'sec-5', label: 'Re-identification flow documented',
              detail: 'Lawful re-id requires a documented multi-party process.', chapter: 'Ch 14.5' }
        ]
    }
];

const presetMixes = {
    alpha: 0.30,
    beta:  0.65,
    ga:    0.95
};

let state = {};
let allItems = [];
let selectedId = null;
let presetBtns = [];

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.querySelector('main'));

    for (const cat of CATEGORIES) for (const it of cat.items) {
        state[it.id] = false;
        allItems.push(it);
    }

    const presets = [
        ['reset', 'Reset all'],
        ['alpha', 'Realistic alpha'],
        ['beta',  'Realistic beta'],
        ['ga',    'Realistic GA']
    ];
    const mainEl = document.querySelector('main');
    for (const [k, lbl] of presets) {
        const b = createButton(lbl);
        b.parent(mainEl);
        b.style('padding', '3px 8px');
        b.style('font-size', '11px');
        b.mousePressed(() => { applyPreset(k); });
        presetBtns.push(b);
    }
    layoutPresetButtons();

    noLoop();
    redraw();
}

function layoutPresetButtons() {
    let bx = 12;
    const by = drawHeight + (controlHeight - 22) / 2;
    for (const b of presetBtns) {
        b.position(bx, by);
        bx += b.elt.offsetWidth + 6;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    layoutPresetButtons();
    redraw();
}

function applyPreset(k) {
    if (k === 'reset') {
        for (const id in state) state[id] = false;
    } else {
        const p = presetMixes[k];
        for (const id in state) state[id] = Math.random() < p;
    }
    redraw();
}

let itemRects = [];

function draw() {
    background(248, 250, 252);

    // Control region (white strip at bottom holds the preset buttons)
    fill(255); noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);
    stroke('#e2e8f0'); strokeWeight(1);
    line(0, drawHeight, canvasWidth, drawHeight);
    noStroke();

    const padX = 8;
    const headerH = 38;

    // Status bar
    const total = allItems.length;
    const done = allItems.filter(it => state[it.id]).length;
    const pct = total > 0 ? (done / total) : 0;

    fill(255); stroke('#e2e8f0'); rect(padX, 4, canvasWidth - 2 * padX, headerH - 8, 4); noStroke();
    fill(30, 41, 59); textStyle(BOLD); textSize(13); textAlign(LEFT, CENTER);
    text('Production readiness', padX + 8, 4 + (headerH - 8) / 2);
    textStyle(NORMAL);

    // bar
    const barX = padX + 180;
    const barW = canvasWidth - barX - 80 - padX;
    const barY = 4 + (headerH - 8) / 2 - 5;
    fill('#e2e8f0'); rect(barX, barY, barW, 10, 4);
    let barColor = '#dc2626';
    if (pct > 0.4) barColor = '#ca8a04';
    if (pct > 0.75) barColor = '#16a34a';
    fill(barColor); rect(barX, barY, barW * pct, 10, 4);
    fill(30, 41, 59); textStyle(BOLD); textAlign(RIGHT, CENTER);
    text(done + ' / ' + total + '  (' + (pct * 100).toFixed(0) + '%)',
        canvasWidth - padX - 8, 4 + (headerH - 8) / 2);
    textStyle(NORMAL);

    // 4 columns
    const colsTopY = headerH + 6;
    const colsH = drawHeight - colsTopY - 120;
    const colW = (canvasWidth - 2 * padX - 18) / 4;
    itemRects = [];
    for (let i = 0; i < CATEGORIES.length; i++) {
        const cx = padX + i * (colW + 6);
        drawColumn(cx, colsTopY, colW, colsH, CATEGORIES[i]);
    }

    // Detail panel below cols
    const detY = colsTopY + colsH + 10;
    drawDetailPanel(padX, detY, canvasWidth - 2 * padX, drawHeight - detY - 4);
}

function drawColumn(x, y, w, h, cat) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 4); noStroke();
    fill(cat.color); rect(x, y, w, 24, 4, 4, 0, 0);
    fill(255); textStyle(BOLD); textSize(12); textAlign(LEFT, CENTER);
    text(cat.name, x + 8, y + 12);
    textStyle(NORMAL);

    const itemH = 28;
    let yy = y + 28;
    for (const it of cat.items) {
        const checked = state[it.id];
        const isSel = selectedId === it.id;
        // checkbox
        fill(isSel ? '#fef3c7' : '#fff');
        stroke(isSel ? '#ca8a04' : '#cbd5e1');
        strokeWeight(1);
        rect(x + 4, yy, w - 8, itemH - 4, 3);
        noStroke();
        // checkmark
        fill(checked ? cat.color : '#fff');
        stroke('#94a3b8'); strokeWeight(1);
        rect(x + 10, yy + 6, 14, 14, 2);
        if (checked) {
            stroke(255); strokeWeight(2);
            line(x + 13, yy + 13, x + 16, yy + 16);
            line(x + 16, yy + 16, x + 22, yy + 9);
        }
        noStroke();
        fill(checked ? '#94a3b8' : '#1e293b');
        textSize(10); textAlign(LEFT, CENTER);
        text(it.label, x + 30, yy + (itemH - 4) / 2);

        itemRects.push({ id: it.id, cat, x: x + 4, y: yy, w: w - 8, h: itemH - 4 });
        yy += itemH;
    }
}

function drawDetailPanel(x, y, w, h) {
    fill(255); stroke('#e2e8f0'); rect(x, y, w, h, 4); noStroke();

    if (selectedId) {
        const it = allItems.find(i => i.id === selectedId);
        const cat = CATEGORIES.find(c => c.items.some(i => i.id === selectedId));
        fill(cat.color); rect(x, y, 6, h, 4, 0, 0, 4);
        fill(30, 41, 59); textStyle(BOLD); textSize(12); textAlign(LEFT, TOP);
        text(it.label, x + 14, y + 8);
        textStyle(NORMAL); textSize(10); fill('#64748b');
        text('Category: ' + cat.name + '  •  Reference: ' + it.chapter, x + 14, y + 24);
        fill('#334155'); textSize(11);
        drawWrappedText(it.detail, x + 14, y + 42, w - 30, 14);
    } else {
        fill('#94a3b8'); textStyle(ITALIC); textSize(11); textAlign(LEFT, TOP);
        text('Click any checklist item to see its detail and where it\'s covered in the textbook.', x + 12, y + 12);
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
    for (const r of itemRects) {
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
            // checkbox area: leftmost 26px
            if (mouseX <= r.x + 26) {
                state[r.id] = !state[r.id];
            }
            selectedId = r.id;
            redraw();
            return;
        }
    }
}
