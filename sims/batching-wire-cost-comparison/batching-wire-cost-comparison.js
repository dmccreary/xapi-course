// Batching Wire-Cost Comparison
// CANVAS_HEIGHT: 440
// Bloom: Analyze (L4) — compare individual vs batched POST traffic patterns

let canvasWidth = 800;
let drawHeight = 370;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;

let containerDiv;
let stmtSlider, batchSlider;
let stmtLabel, batchLabel;

// Colors for overhead vs payload
const C_OVERHEAD = '#dc2626';
const C_PAYLOAD  = '#4338ca';
const C_AXIS     = '#94a3b8';
const C_TEXT     = '#1e293b';

// Per-request sizes (bytes), illustrative
const OVERHEAD_BYTES = 700;
const PAYLOAD_BYTES_PER_STMT = 1200;

function updateCanvasSize() {
    const c = document.querySelector('main');
    if (c) canvasWidth = Math.max(360, c.clientWidth);
}

function setup() {
    updateCanvasSize();
    const cnv = createCanvas(canvasWidth, canvasHeight);
    const mainEl = document.querySelector('main');
    cnv.parent(mainEl);
    // Make <main> the positioning context so absolutely-placed sliders
    // sit inside the canvas's control region instead of below the canvas.
    mainEl.style.position = 'relative';

    stmtLabel = createDiv('Statements: 30');
    stmtLabel.parent(mainEl);
    stmtLabel.style('font-size', '12px');
    stmtLabel.style('color', 'black');

    stmtSlider = createSlider(5, 100, 30, 1);
    stmtSlider.parent(mainEl);

    batchLabel = createDiv('Batch size: 10');
    batchLabel.parent(mainEl);
    batchLabel.style('font-size', '12px');
    batchLabel.style('color', 'black');

    batchSlider = createSlider(1, 50, 10, 1);
    batchSlider.parent(mainEl);

    layoutControls();
}

function layoutControls() {
    // Place both sliders side-by-side inside the control region
    // (the white strip below the drawing region).
    const labelTop = drawHeight + 6;
    const sliderTop = drawHeight + 26;
    const halfW = Math.floor(canvasWidth / 2);
    const sliderW = halfW - 28;

    stmtLabel.position(14, labelTop);
    stmtSlider.position(14, sliderTop);
    stmtSlider.size(sliderW);

    batchLabel.position(halfW + 14, labelTop);
    batchSlider.position(halfW + 14, sliderTop);
    batchSlider.size(sliderW);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    layoutControls();
}

function draw() {
    // draw background of the drawing region aliceblue and the control region white
    // with a light gray border around both regions
    fill('aliceblue');
    stroke('sliver');
    rect(0, 0, canvasWidth, canvasHeight);
    fill('white');
    rect(0, drawHeight, canvasWidth, controlHeight);
    noStroke();


    const stmts = stmtSlider.value();
    const batch = Math.min(batchSlider.value(), stmts);
    stmtLabel.html('Statements: ' + stmts);
    batchLabel.html('Batch size: ' + batch);

    // Layout regions
    const padX = 14;
    const sidePanelW = 200;

    // Timeline layout — adjust these to move/resize the two timelines.
    const tlTopY = 80;   // vertical offset of the FIRST timeline (top edge)
    const tlH    = 120;  // height of each timeline
    const tlGap  = 30;   // vertical gap between timeline 1 and timeline 2

    const tlX  = padX;
    const tlW  = canvasWidth - sidePanelW - padX * 3;
    const tl1Y = tlTopY;
    const tl2Y = tl1Y + tlH + tlGap;

    // Title
    fill('black'); 
    noStroke(); 
    textSize(24); 
    textStyle(BOLD); 
    textAlign(LEFT, TOP);
    text('Wire cost: individual POSTs vs batched POSTs', padX, 8);
    textStyle(NORMAL); 
    textSize(16); 
    fill('#64748b');
    text('Each rectangle is one HTTP request. Red = overhead, blue = payload.', padX, 35);

    // Timeline 1: Individual POSTs
    drawTimeline(tlX, tl1Y, tlW, tlH, 'Individual POST (1 statement / request)', stmts, 1);

    // Timeline 2: Batched POSTs
    const batches = Math.ceil(stmts / batch);
    drawTimeline(tlX, tl2Y, tlW, tlH, `Batched POST (${batch} statements / request, ${batches} requests)`, stmts, batch);

    // Side panel: comparison numbers
    drawComparisonPanel(canvasWidth - sidePanelW - padX, tl1Y, sidePanelW, drawHeight - tl1Y - 10, stmts, batch);
}

function drawTimeline(x, y, w, h, title, totalStmts, batchSize) {
    // title
    fill(C_TEXT); noStroke(); textSize(12); textStyle(BOLD); textAlign(LEFT, TOP);
    text(title, x, y - 18);
    textStyle(NORMAL);

    // background rail
    fill('#e2e8f0'); noStroke();
    rect(x, y, w, h, 4);

    // axis line
    stroke(C_AXIS); strokeWeight(1);
    line(x, y + h - 18, x + w, y + h - 18);
    noStroke();

    const requests = Math.ceil(totalStmts / batchSize);
    if (requests <= 0) return;

    // Each request gets a horizontal slot. Width per request scales by 1+payloadStmts.
    // Use total bytes per request as proportional width within the timeline.
    const bytesPerReq = [];
    for (let i = 0; i < requests; i++) {
        const stmtsInReq = Math.min(batchSize, totalStmts - i * batchSize);
        bytesPerReq.push({
            overhead: OVERHEAD_BYTES,
            payload: stmtsInReq * PAYLOAD_BYTES_PER_STMT,
            stmts: stmtsInReq
        });
    }
    const totalBytes = bytesPerReq.reduce((s, r) => s + r.overhead + r.payload, 0);
    // Reserve gaps between requests = 2px each
    const gap = requests > 1 ? 2 : 0;
    const usableW = w - gap * (requests - 1) - 8;
    const barH = h - 28;
    const barY = y + 6;

    let cursorX = x + 4;
    for (let i = 0; i < requests; i++) {
        const r = bytesPerReq[i];
        const reqBytes = r.overhead + r.payload;
        const reqW = Math.max(2, (reqBytes / totalBytes) * usableW);
        const overheadW = (r.overhead / reqBytes) * reqW;
        const payloadW  = reqW - overheadW;

        // overhead band
        fill(C_OVERHEAD); noStroke();
        rect(cursorX, barY, overheadW, barH, 2);
        // payload band
        fill(C_PAYLOAD);
        rect(cursorX + overheadW, barY, payloadW, barH, 2);

        cursorX += reqW + gap;
    }

    // axis label: count
    fill('#475569'); noStroke(); textSize(10); textAlign(LEFT, TOP);
    text(`${requests} request${requests === 1 ? '' : 's'}`, x + 4, y + h - 14);

    // total bytes on right of axis
    textAlign(RIGHT, TOP);
    text(`${(totalBytes / 1024).toFixed(1)} KB total`, x + w - 4, y + h - 14);
    textAlign(LEFT, TOP);
}

function drawComparisonPanel(x, y, w, h, stmts, batch) {
    fill('#fff'); stroke('#e2e8f0'); strokeWeight(1);
    rect(x, y, w, h, 6);
    noStroke();

    const indReq = stmts;
    const indTotal = indReq * OVERHEAD_BYTES + stmts * PAYLOAD_BYTES_PER_STMT;
    const batReq = Math.ceil(stmts / batch);
    const batTotal = batReq * OVERHEAD_BYTES + stmts * PAYLOAD_BYTES_PER_STMT;
    const saved = indTotal - batTotal;
    const savedPct = indTotal > 0 ? (saved / indTotal) * 100 : 0;

    fill(C_TEXT); textStyle(BOLD); textSize(12); textAlign(LEFT, TOP);
    text('Comparison', x + 10, y + 10);

    textStyle(NORMAL); textSize(11); fill('#64748b');
    text('Individual POST', x + 10, y + 32);
    fill(C_TEXT); textStyle(BOLD); textSize(15);
    text(`${(indTotal / 1024).toFixed(1)} KB`, x + 10, y + 46);

    textStyle(NORMAL); textSize(11); fill('#64748b');
    text(`${indReq} requests`, x + 10, y + 64);

    textSize(11); fill('#64748b');
    text('Batched POST', x + 10, y + 88);
    fill(C_TEXT); textStyle(BOLD); textSize(15);
    text(`${(batTotal / 1024).toFixed(1)} KB`, x + 10, y + 102);

    textStyle(NORMAL); textSize(11); fill('#64748b');
    text(`${batReq} requests`, x + 10, y + 120);

    // saved
    textSize(11); fill('#64748b');
    text('Saved', x + 10, y + 148);
    fill('#16a34a'); textStyle(BOLD); textSize(18);
    text(`${savedPct.toFixed(1)}%`, x + 10, y + 162);

    textStyle(NORMAL); textSize(10); fill('#64748b');
    text(`(${(saved / 1024).toFixed(1)} KB)`, x + 10, y + 184);

    // legend
    textSize(10); fill('#475569'); textAlign(LEFT, TOP);
    fill(C_OVERHEAD); rect(x + 10, y + 210, 10, 10, 2);
    fill('#475569'); text('HTTP overhead', x + 26, y + 210);
    fill(C_PAYLOAD); rect(x + 10, y + 226, 10, 10, 2);
    fill('#475569'); text('Statement payload', x + 26, y + 226);
}
