// Authentication Scheme Comparison — xAPI LRS auth
// CANVAS_HEIGHT: 600
// Three side-by-side columns (HTTP Basic, OAuth 1.0a, Token-based) with
// 4-axis bar charts. Click or hover a column to update the right side panel.
// Toggle "Show common pitfall" to overlay a callout on the selected column.

let canvasWidth = 1000;
let drawHeight = 540;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 14;

// Controls
let pitfallCheckbox;
let resetButton;

// State
let selectedScheme = 'token'; // default selection so panel is never empty
let hoveredScheme = null;

// Layout
let columnsAreaWidthFrac = 0.62; // left 62% holds the three columns
let panelWidthFrac = 0.38;       // right 38% holds the detail panel

// Scheme data — each axis is rated 1..4 (higher = better)
const schemes = [
    {
        id: 'basic',
        name: 'HTTP Basic',
        subtitle: 'Authorization: Basic <base64>',
        badge: { label: 'Caution', color: '#f59e0b' }, // amber
        accent: '#f59e0b',
        accentDark: '#b45309',
        axes: {
            'Browser-safe': 1,
            'Easy to implement': 4,
            'Easy to revoke': 1,
            'Spec mandated': 4
        },
        summary: 'Simplest scheme; baseline required by xAPI spec.',
        whenToUse:
            'Server-to-server pushes, internal pilots, and CI loaders ' +
            'where credentials never reach a browser. Required as a ' +
            'baseline by xAPI 1.0.3, so every LRS supports it.',
        request:
            'POST /xAPI/statements HTTP/1.1\n' +
            'Host: lrs.example.org\n' +
            'Authorization: Basic ' +
            'YWxpY2U6c3VwM3JzM2NyM3Q=\n' +
            'X-Experience-API-Version: 1.0.3\n' +
            'Content-Type: application/json',
        pitfall:
            'Pasting Basic credentials into browser-side JavaScript. ' +
            'Anyone with the page source can decode the base64 and ' +
            'gain full write access to the LRS.',
        platforms: [
            'Veracity LRS — built-in; create a credential per AP.',
            'Learning Locker — auth via Client store.',
            'SCORM Cloud — issued per registration.',
            'Yet Analytics SQL LRS — username/password.'
        ]
    },
    {
        id: 'oauth',
        name: 'OAuth 1.0a',
        subtitle: 'Authorization: OAuth oauth_signature=...',
        badge: { label: 'Spec-only', color: '#10b981' }, // green-with-caveat
        accent: '#10b981',
        accentDark: '#047857',
        axes: {
            'Browser-safe': 2,
            'Easy to implement': 1,
            'Easy to revoke': 3,
            'Spec mandated': 4
        },
        summary: 'Mandated by spec, rarely implemented in practice.',
        whenToUse:
            'When a vendor explicitly requires it for federation or ' +
            'when working with a legacy LMS that signs requests with ' +
            'OAuth 1.0a (e.g. some Moodle xAPI plugins).',
        request:
            'POST /xAPI/statements HTTP/1.1\n' +
            'Host: lrs.example.org\n' +
            'Authorization: OAuth oauth_consumer_key="...",\n' +
            '  oauth_signature_method="HMAC-SHA1",\n' +
            '  oauth_timestamp="1714492800",\n' +
            '  oauth_nonce="kYj...", oauth_signature="..."\n' +
            'X-Experience-API-Version: 1.0.3',
        pitfall:
            'Signature base-string assembly. Off-by-one whitespace or ' +
            'parameter ordering bugs produce a valid-looking 401 with ' +
            'no useful error from the LRS.',
        platforms: [
            'Veracity LRS — supported but rarely used.',
            'Learning Locker — supported via plugin.',
            'SCORM Cloud — not exposed in the UI.',
            'Yet Analytics SQL LRS — not implemented.'
        ]
    },
    {
        id: 'token',
        name: 'Token-based',
        subtitle: 'Authorization: Bearer <jwt-or-opaque>',
        badge: { label: 'Recommended', color: '#0d9488' }, // teal
        accent: '#0d9488',
        accentDark: '#0f766e',
        axes: {
            'Browser-safe': 4,
            'Easy to implement': 3,
            'Easy to revoke': 4,
            'Spec mandated': 1
        },
        summary: 'Modern default — short-lived, scoped, revocable.',
        whenToUse:
            'Anything that touches a browser, mobile app, or third-party ' +
            'integration. Tokens are short-lived, scoped to a single ' +
            'AP/Consumer, and instantly revocable from the LRS console.',
        request:
            'POST /xAPI/statements HTTP/1.1\n' +
            'Host: lrs.example.org\n' +
            'Authorization: Bearer eyJhbGciOiJI...\n' +
            'X-Experience-API-Version: 1.0.3\n' +
            'Content-Type: application/json',
        pitfall:
            'Storing long-lived tokens in localStorage. A single XSS bug ' +
            'turns into a credential leak — prefer short-lived tokens ' +
            'minted server-side and refreshed on demand.',
        platforms: [
            'Veracity LRS — JWT bearer tokens, per-AP scopes.',
            'Learning Locker — issue via Client store.',
            'SCORM Cloud — OAuth 2 bearer with refresh.',
            'Yet Analytics SQL LRS — JWT with role claims.'
        ]
    }
];

const axisOrder = ['Browser-safe', 'Easy to implement', 'Easy to revoke', 'Spec mandated'];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    pitfallCheckbox = createCheckbox('Show common pitfall', false);
    pitfallCheckbox.parent(document.querySelector('main'));
    pitfallCheckbox.position(margin, drawHeight + 18);
    pitfallCheckbox.style('font-size', '14px');

    resetButton = createButton('Reset selection');
    resetButton.parent(document.querySelector('main'));
    resetButton.position(margin + 200, drawHeight + 14);
    resetButton.mousePressed(() => { selectedScheme = 'token'; });

    describe(
        'Interactive comparison of HTTP Basic, OAuth 1.0a, and Token-based ' +
        'authentication for xAPI. Click a column to see when to use each ' +
        'scheme, the canonical request, common pitfalls, and per-LRS notes.',
        LABEL
    );
}

function draw() {
    updateCanvasSize();

    // Drawing region background
    fill('aliceblue');
    stroke('silver');
    rect(0, 0, canvasWidth, drawHeight);

    // Control region background
    fill('white');
    stroke('silver');
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Title
    noStroke();
    fill('#1e293b');
    textAlign(CENTER, TOP);
    textSize(20);
    textStyle(BOLD);
    text('Authentication Scheme Comparison', canvasWidth / 2, 8);
    textStyle(NORMAL);
    textSize(12);
    fill('#475569');
    text(
        'Click a column to compare. Toggle "Show common pitfall" to overlay the most frequent mistake.',
        canvasWidth / 2,
        32
    );

    // Layout split: left = columns, right = detail panel
    const columnsAreaWidth = canvasWidth * columnsAreaWidthFrac;
    const panelX = columnsAreaWidth;
    const panelW = canvasWidth - columnsAreaWidth;

    drawColumns(0, 56, columnsAreaWidth, drawHeight - 56);
    drawDetailPanel(panelX, 56, panelW, drawHeight - 56);

    // Hover detection: which column is the mouse over?
    hoveredScheme = null;
    if (
        mouseX >= 0 && mouseX <= columnsAreaWidth &&
        mouseY >= 56 && mouseY <= drawHeight - 8
    ) {
        const colW = (columnsAreaWidth - margin * 2) / 3;
        for (let i = 0; i < schemes.length; i++) {
            const cx = margin + i * colW;
            if (mouseX >= cx && mouseX <= cx + colW - 10) {
                hoveredScheme = schemes[i].id;
                break;
            }
        }
    }
}

function drawColumns(x0, y0, w, h) {
    const colW = (w - margin * 2) / 3;
    const colH = h - 16;
    for (let i = 0; i < schemes.length; i++) {
        const s = schemes[i];
        const cx = x0 + margin + i * colW;
        const cy = y0;
        const isSelected = selectedScheme === s.id;
        const isHovered = hoveredScheme === s.id;
        drawColumn(s, cx, cy, colW - 10, colH, isSelected, isHovered);
    }
}

function drawColumn(s, x, y, w, h, isSelected, isHovered) {
    // Column shell
    noStroke();
    fill(isSelected ? '#fefce8' : isHovered ? '#f8fafc' : '#ffffff');
    stroke(isSelected ? s.accentDark : '#cbd5e1');
    strokeWeight(isSelected ? 3 : 1);
    rect(x, y, w, h, 8);
    strokeWeight(1);

    // Header bar
    noStroke();
    fill(s.accent);
    rect(x, y, w, 38, 8, 8, 0, 0);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text(s.name, x + w / 2, y + 19);
    textStyle(NORMAL);

    // Badge
    const badgeY = y + 50;
    textSize(11);
    textStyle(BOLD);
    const badgeW = textWidth(s.badge.label) + 16;
    fill(s.badge.color);
    rect(x + (w - badgeW) / 2, badgeY, badgeW, 18, 9);
    fill('white');
    text(s.badge.label, x + w / 2, badgeY + 9);
    textStyle(NORMAL);

    // Subtitle (mono-ish header line)
    fill('#475569');
    textSize(10);
    textAlign(CENTER, CENTER);
    text(s.subtitle, x + w / 2, badgeY + 30);

    // Bar chart — 4 axes
    const chartTop = badgeY + 48;
    const chartBottom = y + h - 64;
    drawBarChart(s, x + 12, chartTop, w - 24, chartBottom - chartTop);

    // Summary line at bottom
    fill('#1e293b');
    textSize(11);
    textStyle(ITALIC);
    textAlign(CENTER, TOP);
    wrappedText(s.summary, x + 8, y + h - 50, w - 16, 14);
    textStyle(NORMAL);

    // Pitfall overlay (if checkbox is on AND this column is selected)
    if (pitfallCheckbox && pitfallCheckbox.checked() && selectedScheme === s.id) {
        drawPitfallOverlay(s, x, y, w, h);
    }
}

function drawBarChart(s, x, y, w, h) {
    const barCount = axisOrder.length;
    const labelW = 110;
    const barX = x + labelW;
    const barW = w - labelW - 4;
    const rowH = h / barCount;
    const barH = Math.min(14, rowH - 6);

    for (let i = 0; i < barCount; i++) {
        const axis = axisOrder[i];
        const value = s.axes[axis]; // 1..4
        const cy = y + i * rowH + rowH / 2;

        // Axis label
        noStroke();
        fill('#334155');
        textAlign(LEFT, CENTER);
        textSize(11);
        text(axis, x, cy);

        // Track
        fill('#e2e8f0');
        rect(barX, cy - barH / 2, barW, barH, 3);

        // Filled portion (4 segments)
        for (let seg = 0; seg < 4; seg++) {
            const segX = barX + (barW / 4) * seg;
            const segW = barW / 4 - 2;
            if (seg < value) {
                fill(s.accent);
            } else {
                fill('#f1f5f9');
            }
            rect(segX + 1, cy - barH / 2 + 1, segW, barH - 2, 2);
        }

        // Numeric value at right
        fill('#475569');
        textAlign(RIGHT, CENTER);
        textSize(10);
        text(value + '/4', x + w, cy);
    }
}

function drawPitfallOverlay(s, x, y, w, h) {
    // Translucent dark overlay
    noStroke();
    fill(0, 0, 0, 180);
    rect(x, y, w, h, 8);

    // Callout box
    const boxX = x + 10;
    const boxY = y + h * 0.35;
    const boxW = w - 20;
    const boxH = h * 0.55;
    fill('#fef3c7');
    stroke('#f59e0b');
    strokeWeight(2);
    rect(boxX, boxY, boxW, boxH, 6);
    strokeWeight(1);
    noStroke();

    // Title
    fill('#92400e');
    textAlign(CENTER, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Common Pitfall', boxX + boxW / 2, boxY + 8);
    textStyle(NORMAL);

    // Body
    fill('#1e293b');
    textAlign(LEFT, TOP);
    textSize(11);
    wrappedText(s.pitfall, boxX + 8, boxY + 28, boxW - 16, 14);
}

function drawDetailPanel(x, y, w, h) {
    // Panel background
    noStroke();
    fill('white');
    stroke('#cbd5e1');
    rect(x, y, w - margin, h - 8, 8);
    noStroke();

    const s = schemes.find(sc => sc.id === selectedScheme);
    if (!s) return;

    let cy = y + 10;
    const innerX = x + 12;
    const innerW = w - margin - 24;

    // Header
    fill(s.accentDark);
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(s.name, innerX, cy);
    textStyle(NORMAL);
    cy += 22;

    // When to use
    cy = drawSection('When to use', s.whenToUse, innerX, cy, innerW);

    // Canonical request
    fill('#334155');
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Canonical request', innerX, cy);
    textStyle(NORMAL);
    cy += 14;

    // Code block background
    const codeLines = s.request.split('\n');
    const codeH = codeLines.length * 12 + 10;
    fill('#0f172a');
    rect(innerX, cy, innerW, codeH, 4);
    fill('#a7f3d0');
    textAlign(LEFT, TOP);
    textSize(9.5);
    textFont('monospace');
    for (let i = 0; i < codeLines.length; i++) {
        text(codeLines[i], innerX + 6, cy + 6 + i * 12);
    }
    textFont('Arial');
    cy += codeH + 8;

    // LRS platform notes
    fill('#334155');
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Per-platform configuration', innerX, cy);
    textStyle(NORMAL);
    cy += 14;

    fill('#1e293b');
    textSize(10.5);
    for (let i = 0; i < s.platforms.length; i++) {
        text('• ' + s.platforms[i], innerX, cy);
        cy += 14;
    }
}

function drawSection(label, body, x, y, w) {
    fill('#334155');
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(label, x, y);
    textStyle(NORMAL);

    fill('#1e293b');
    textSize(11);
    const usedH = wrappedText(body, x, y + 14, w, 13);
    return y + 14 + usedH + 8;
}

// Returns total pixel height used.
function wrappedText(str, x, y, w, lineH) {
    const words = str.split(/\s+/);
    let line = '';
    let cy = y;
    textAlign(LEFT, TOP);
    for (let i = 0; i < words.length; i++) {
        const test = line.length === 0 ? words[i] : line + ' ' + words[i];
        if (textWidth(test) > w) {
            text(line, x, cy);
            cy += lineH;
            line = words[i];
        } else {
            line = test;
        }
    }
    if (line.length > 0) {
        text(line, x, cy);
        cy += lineH;
    }
    return cy - y;
}

function mousePressed() {
    // Only react when clicking inside the columns area
    const columnsAreaWidth = canvasWidth * columnsAreaWidthFrac;
    if (mouseX < 0 || mouseX > columnsAreaWidth) return;
    if (mouseY < 56 || mouseY > drawHeight - 8) return;

    const colW = (columnsAreaWidth - margin * 2) / 3;
    for (let i = 0; i < schemes.length; i++) {
        const cx = margin + i * colW;
        if (mouseX >= cx && mouseX <= cx + colW - 10) {
            selectedScheme = schemes[i].id;
            return;
        }
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        const w = container.offsetWidth;
        // Clamp so the layout never collapses past readable column width
        canvasWidth = Math.max(720, w);
    }
}
