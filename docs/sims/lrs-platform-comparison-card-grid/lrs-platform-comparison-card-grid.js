// LRS Platform Comparison Card Grid
// CANVAS_HEIGHT: 620
// Compare TRAX, Learning Locker, Ralph, and Watershed across 5 dimensions.
// Hover or click a card to update the side panel; preset scenario buttons
// highlight the recommended platform for a given deployment context.

let canvasWidth = 1000;
let drawHeight = 560;       // card grid + side panel area
let controlHeight = 60;     // preset scenario buttons row
let canvasHeight = drawHeight + controlHeight;
let margin = 16;

// ---------- Platform data ----------
// Radar axes (in order): ingestion ceiling, query speed, operational complexity,
// multi-tenant maturity, dashboard depth.
// All values 0-5. Note: "operational complexity" is rendered as "operational
// simplicity" on the radar (we invert so that 'bigger is better' on every axis).
const AXES = [
  'Ingestion ceiling',
  'Query speed',
  'Ops simplicity',
  'Multi-tenant',
  'Dashboard'
];

const PLATFORMS = [
  {
    id: 'trax',
    name: 'TRAX',
    hosting: 'Self-hosted',
    color: '#2a7ab0',
    summary: 'Lightweight PHP LRS. Easy to stand up for a school or pilot.',
    // 5-axis scores (0-5)
    scores: [2, 3, 5, 2, 2],
    whenToUse: [
      'Single school or small district pilot',
      'A teacher-led xAPI experiment',
      'You want to read every row of the database yourself'
    ],
    whenNotToUse: [
      'Statewide deployments with millions of statements/day',
      'Heavy concurrent dashboard users',
      'Strict multi-tenant isolation requirements'
    ],
    scenario: 'A district stands up TRAX on a $20/mo VM to capture xAPI from a new reading-fluency tool across 12 schools.',
    link: 'https://traxlrs.com/'
  },
  {
    id: 'learning-locker',
    name: 'Learning Locker',
    hosting: 'Self-hosted / SaaS',
    color: '#6b46c1',
    summary: 'Mature MongoDB-backed LRS with rich dashboards and statement forwarding.',
    scores: [4, 3, 3, 4, 5],
    whenToUse: [
      'You need built-in dashboards out of the box',
      'You need statement forwarding to a warehouse',
      'Multi-tenant orgs with separate stores'
    ],
    whenNotToUse: [
      'Very small projects where you want zero ops overhead',
      'Use cases requiring sub-second analytical queries on billions of rows'
    ],
    scenario: 'A higher-ed system runs Learning Locker for 30 colleges, with one tenant per campus and dashboards for deans.',
    link: 'https://www.learningpool.com/solutions/learning-record-store-learning-locker'
  },
  {
    id: 'ralph',
    name: 'Ralph',
    hosting: 'Self-hosted',
    color: '#0e7c66',
    summary: 'Modern Python LRS from France Universite Numerique. ClickHouse-friendly, built for scale.',
    scores: [5, 5, 2, 3, 2],
    whenToUse: [
      'Statewide or national assessment platforms',
      'High-throughput statement ingestion',
      'You already run a data warehouse (ClickHouse, BigQuery)'
    ],
    whenNotToUse: [
      'Teams without DevOps capacity',
      'Projects that need turnkey dashboards on day one'
    ],
    scenario: 'A national ministry of education routes 40M xAPI statements/day from 1,200 schools into Ralph + ClickHouse for research.',
    link: 'https://openfun.github.io/ralph/'
  },
  {
    id: 'watershed',
    name: 'Watershed',
    hosting: 'Hosted SaaS',
    color: '#c2410c',
    summary: 'Commercial xAPI analytics platform. Polished dashboards, enterprise support.',
    scores: [4, 4, 5, 5, 5],
    whenToUse: [
      'Corporate L&D with compliance reporting',
      'You want a vendor on the hook for uptime',
      'Stakeholders who live in dashboards, not in SQL'
    ],
    whenNotToUse: [
      'Tight budgets that cannot fund per-seat SaaS',
      'Use cases requiring full data-residency control'
    ],
    scenario: 'A Fortune 500 uses Watershed to roll up training completion across 15 LMSs and 90 countries for the CLO dashboard.',
    link: 'https://www.watershedlrs.com/'
  }
];

// Scenario presets: which platform is recommended and a deployment-specific
// reasoning string the side panel shows when the preset is active.
const SCENARIOS = {
  school: {
    label: 'Single school',
    recommend: 'trax',
    reasoning: 'For a single school, TRAX is the lowest-overhead option. One small VM, a few thousand statements per day, and the whole staff can be trained on it in an afternoon.'
  },
  state: {
    label: 'State-wide assessment platform',
    recommend: 'ralph',
    reasoning: 'State-wide assessments push tens of millions of statements per day with strict latency budgets. Ralph plus a columnar warehouse (ClickHouse / BigQuery) is the only option here that scales linearly.'
  },
  corporate: {
    label: 'Corporate L&D',
    recommend: 'watershed',
    reasoning: 'Corporate L&D needs polished dashboards, compliance reporting, and a vendor on the hook for SLAs. Watershed is built for this audience - your CLO will see what they need on day one.'
  }
};

// ---------- Runtime state ----------
let selectedId = 'trax';      // which card is currently shown in the side panel
let hoverId = null;           // hover state
let activeScenario = null;    // 'school' | 'state' | 'corporate' | null
let recommendedId = null;     // platform highlighted by the active scenario
let cardRects = [];           // computed each frame for hit-testing
let scenarioButtons = {};     // p5 button refs
let linkEl = null;            // overlay <a> for the platform link in the side panel

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Preset scenario buttons (p5.js builtin controls)
  scenarioButtons.school = createButton('Single school');
  scenarioButtons.school.parent(document.querySelector('main'));
  scenarioButtons.school.mousePressed(() => activateScenario('school'));

  scenarioButtons.state = createButton('State-wide assessment platform');
  scenarioButtons.state.parent(document.querySelector('main'));
  scenarioButtons.state.mousePressed(() => activateScenario('state'));

  scenarioButtons.corporate = createButton('Corporate L&D');
  scenarioButtons.corporate.parent(document.querySelector('main'));
  scenarioButtons.corporate.mousePressed(() => activateScenario('corporate'));

  scenarioButtons.clear = createButton('Clear');
  scenarioButtons.clear.parent(document.querySelector('main'));
  scenarioButtons.clear.mousePressed(() => activateScenario(null));

  positionButtons();
  styleButtons();

  // Real <a> overlay for the side-panel link (gives proper cursor, right-click,
  // screen-reader semantics that canvas-drawn text cannot).
  linkEl = createA('', '', '_blank');
  linkEl.parent(document.querySelector('main'));
  linkEl.elt.setAttribute('rel', 'noopener noreferrer');
  linkEl.elt.setAttribute(
    'style',
    'position: absolute; font-size: 11px; color: #1d4ed8; ' +
    'text-decoration: underline; cursor: pointer; ' +
    'font-family: sans-serif; white-space: nowrap; ' +
    'overflow: hidden; text-overflow: ellipsis;'
  );

  describe(
    'Interactive comparison of four xAPI Learning Record Store platforms - TRAX, ' +
    'Learning Locker, Ralph, and Watershed - across five dimensions shown as ' +
    'radar charts. Hover a card to see its detail panel. Use the scenario buttons ' +
    'to highlight the recommended platform for a single school, a statewide ' +
    'assessment platform, or corporate L&D.',
    LABEL
  );
}

function draw() {
  updateCanvasSize();

  // Background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  noFill();
  rect(0, 0, canvasWidth - 1, canvasHeight - 1);

  // Title
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);
  text('LRS Platforms Compared', margin, 10);
  textStyle(NORMAL);
  textSize(13);
  fill('#555');
  text('Hover a card for detail. Use the scenario buttons below to see which platform fits a deployment.', margin, 32);

  // Layout: left 2/3 grid of 4 cards, right 1/3 side panel
  const headerY = 60;
  const gridLeft = margin;
  const gridRight = Math.floor(canvasWidth * 0.66);
  const panelLeft = gridRight + margin;
  const panelRight = canvasWidth - margin;
  const gridTop = headerY;
  const gridBottom = drawHeight - margin;

  drawCardGrid(gridLeft, gridTop, gridRight - gridLeft, gridBottom - gridTop);
  drawSidePanel(panelLeft, gridTop, panelRight - panelLeft, gridBottom - gridTop);

  // Active scenario indicator in control area
  drawScenarioStatus();
}

function drawCardGrid(x, y, w, h) {
  cardRects = [];
  const gap = 12;
  const cardW = (w - gap) / 2;
  const cardH = (h - gap) / 2;

  for (let i = 0; i < PLATFORMS.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = x + col * (cardW + gap);
    const cy = y + row * (cardH + gap);
    cardRects.push({ id: PLATFORMS[i].id, x: cx, y: cy, w: cardW, h: cardH });
    drawCard(PLATFORMS[i], cx, cy, cardW, cardH);
  }
}

function drawCard(p, x, y, w, h) {
  const isSelected = p.id === selectedId;
  const isHover = p.id === hoverId;
  const isRecommended = p.id === recommendedId;

  // Card body
  noStroke();
  fill('white');
  rect(x, y, w, h, 8);

  // Border - emphasize selected / recommended
  noFill();
  if (isRecommended) {
    stroke('#f59e0b');
    strokeWeight(3);
  } else if (isSelected) {
    stroke(p.color);
    strokeWeight(2.5);
  } else if (isHover) {
    stroke('#888');
    strokeWeight(1.5);
  } else {
    stroke('silver');
    strokeWeight(1);
  }
  rect(x, y, w, h, 8);
  strokeWeight(1);

  // Header bar
  noStroke();
  fill(p.color);
  rect(x, y, w, 28, 8, 8, 0, 0);
  fill('white');
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(p.name, x + 10, y + 14);
  textStyle(NORMAL);

  // Hosting badge (right side of header)
  textAlign(RIGHT, CENTER);
  textSize(10);
  const badgeColor = p.hosting.includes('SaaS') && !p.hosting.includes('/')
    ? '#fef3c7' : (p.hosting.includes('/') ? '#e0e7ff' : '#d1fae5');
  const badgeText = p.hosting;
  textSize(10);
  const badgeW = textWidth(badgeText) + 10;
  fill(badgeColor);
  noStroke();
  rect(x + w - badgeW - 8, y + 6, badgeW, 16, 8);
  fill('#333');
  text(badgeText, x + w - 13, y + 14);

  // Radar chart
  const radarCx = x + w * 0.32;
  const radarCy = y + 28 + (h - 28 - 50) / 2;
  const radarR = Math.min(w * 0.28, (h - 28 - 60) / 2);
  drawRadar(radarCx, radarCy, radarR, p.scores, p.color);

  // Mini-axis legend to the right of radar
  textAlign(LEFT, CENTER);
  textSize(9);
  noStroke();
  fill('#444');
  const legendX = x + w * 0.62;
  const legendStartY = y + 36;
  for (let i = 0; i < AXES.length; i++) {
    fill(p.color);
    noStroke();
    ellipse(legendX, legendStartY + i * 13 + 4, 6, 6);
    fill('#444');
    text(AXES[i] + ': ' + p.scores[i], legendX + 8, legendStartY + i * 13 + 4);
  }

  // One-line summary at bottom
  noStroke();
  fill('#333');
  textAlign(LEFT, TOP);
  textSize(11);
  const summaryY = y + h - 32;
  text(p.summary, x + 10, summaryY, w - 20, 28);

  // Recommended ribbon
  if (isRecommended) {
    noStroke();
    fill('#f59e0b');
    rect(x + w - 88, y + h - 18, 80, 14, 6);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(10);
    textStyle(BOLD);
    text('RECOMMENDED', x + w - 48, y + h - 11);
    textStyle(NORMAL);
  }
}

function drawRadar(cx, cy, r, scores, color) {
  const n = scores.length;
  const maxVal = 5;

  // Grid rings
  noFill();
  stroke('#ddd');
  strokeWeight(1);
  for (let ring = 1; ring <= 5; ring++) {
    const rr = (r * ring) / 5;
    beginShape();
    for (let i = 0; i < n; i++) {
      const a = -PI / 2 + (TWO_PI * i) / n;
      vertex(cx + cos(a) * rr, cy + sin(a) * rr);
    }
    endShape(CLOSE);
  }

  // Spokes
  stroke('#ccc');
  for (let i = 0; i < n; i++) {
    const a = -PI / 2 + (TWO_PI * i) / n;
    line(cx, cy, cx + cos(a) * r, cy + sin(a) * r);
  }

  // Filled polygon
  noStroke();
  fill(red(color), green(color), blue(color), 90);
  beginShape();
  for (let i = 0; i < n; i++) {
    const a = -PI / 2 + (TWO_PI * i) / n;
    const v = (scores[i] / maxVal) * r;
    vertex(cx + cos(a) * v, cy + sin(a) * v);
  }
  endShape(CLOSE);

  // Outline
  stroke(color);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < n; i++) {
    const a = -PI / 2 + (TWO_PI * i) / n;
    const v = (scores[i] / maxVal) * r;
    vertex(cx + cos(a) * v, cy + sin(a) * v);
  }
  endShape(CLOSE);

  // Value dots
  noStroke();
  fill(color);
  for (let i = 0; i < n; i++) {
    const a = -PI / 2 + (TWO_PI * i) / n;
    const v = (scores[i] / maxVal) * r;
    ellipse(cx + cos(a) * v, cy + sin(a) * v, 5, 5);
  }
  strokeWeight(1);
}

function drawSidePanel(x, y, w, h) {
  // Panel background
  noStroke();
  fill('white');
  rect(x, y, w, h, 8);
  stroke('silver');
  noFill();
  rect(x, y, w, h, 8);

  const platform = PLATFORMS.find(p => p.id === selectedId);
  if (!platform) return;

  // Panel header
  noStroke();
  fill(platform.color);
  rect(x, y, w, 32, 8, 8, 0, 0);
  fill('white');
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(platform.name + ' - ' + platform.hosting, x + 10, y + 16);
  textStyle(NORMAL);

  let yy = y + 44;
  const padX = 12;
  const innerW = w - padX * 2;

  // Active scenario reasoning (only shown when a scenario is active AND
  // this card is the recommended one for that scenario)
  if (activeScenario && SCENARIOS[activeScenario].recommend === platform.id) {
    noStroke();
    fill('#fff7ed');
    rect(x + padX, yy, innerW, 60, 6);
    stroke('#f59e0b');
    noFill();
    rect(x + padX, yy, innerW, 60, 6);
    noStroke();
    fill('#9a3412');
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Why for ' + SCENARIOS[activeScenario].label + ':', x + padX + 6, yy + 4);
    textStyle(NORMAL);
    fill('#333');
    text(SCENARIOS[activeScenario].reasoning, x + padX + 6, yy + 20, innerW - 12, 38);
    yy += 70;
  }

  // When to use
  yy = drawPanelSection(x + padX, yy, innerW, 'When to use', platform.whenToUse, '#0e7c66');
  yy += 6;
  // When NOT to use
  yy = drawPanelSection(x + padX, yy, innerW, 'When NOT to use', platform.whenNotToUse, '#b91c1c');
  yy += 6;

  // Example deployment
  noStroke();
  fill('#1f2937');
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Example deployment', x + padX, yy);
  textStyle(NORMAL);
  yy += 16;
  fill('#374151');
  textSize(11);
  text(platform.scenario, x + padX, yy, innerW, 80);
  yy += 60;

  // Link label (canvas text); the URL itself is rendered as a real <a> overlay
  // so it is clickable.
  fill('#1f2937');
  textSize(11);
  textStyle(BOLD);
  text('Link:', x + padX, yy);
  textStyle(NORMAL);

  if (linkEl) {
    if (linkEl.attribute('href') !== platform.link) {
      linkEl.attribute('href', platform.link);
      linkEl.html(platform.link);
    }
    const linkX = x + padX + 36;
    const linkY = yy;
    const linkW = innerW - 36;
    linkEl.position(linkX, linkY);
    linkEl.size(linkW, 16);
  }
}

// Draws a titled bullet list. Returns the y-coordinate after the section.
function drawPanelSection(x, y, w, title, items, accent) {
  noStroke();
  fill(accent);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(title, x, y);
  textStyle(NORMAL);
  let yy = y + 16;
  fill('#374151');
  textSize(11);
  for (const item of items) {
    // bullet
    fill(accent);
    noStroke();
    ellipse(x + 4, yy + 6, 4, 4);
    fill('#374151');
    text(item, x + 12, yy, w - 12, 30);
    // estimate height: roughly ceil(textWidth/innerW) lines * 14 + 4
    const lines = Math.max(1, Math.ceil(textWidth(item) / (w - 12)));
    yy += lines * 14 + 2;
  }
  return yy;
}

function drawScenarioStatus() {
  // Right-aligned indicator in the control area
  noStroke();
  fill('#555');
  textSize(11);
  textAlign(RIGHT, CENTER);
  const label = activeScenario
    ? 'Active scenario: ' + SCENARIOS[activeScenario].label
    : 'No scenario selected';
  text(label, canvasWidth - margin, drawHeight + controlHeight / 2);
}

// ---------- Interaction ----------
function mouseMoved() {
  hoverId = hitTestCard(mouseX, mouseY);
  cursor(hoverId ? 'pointer' : 'default');
}

function mousePressed() {
  const id = hitTestCard(mouseX, mouseY);
  if (id) {
    selectedId = id;
  }
}

function hitTestCard(mx, my) {
  for (const r of cardRects) {
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
      return r.id;
    }
  }
  return null;
}

function activateScenario(key) {
  activeScenario = key;
  if (key && SCENARIOS[key]) {
    recommendedId = SCENARIOS[key].recommend;
    selectedId = recommendedId;
  } else {
    recommendedId = null;
  }
  updateButtonStyles();
}

// ---------- Layout helpers ----------
function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionButtons();
}

function positionButtons() {
  // Lay out the four scenario buttons across the top of the control area.
  const y = drawHeight + 16;
  let x = margin;
  scenarioButtons.school.position(x, y);
  x += scenarioButtons.school.elt.offsetWidth + 8;
  scenarioButtons.state.position(x, y);
  x += scenarioButtons.state.elt.offsetWidth + 8;
  scenarioButtons.corporate.position(x, y);
  x += scenarioButtons.corporate.elt.offsetWidth + 8;
  scenarioButtons.clear.position(x, y);
}

function styleButtons() {
  const baseStyle =
    'padding: 6px 12px; font-size: 12px; border-radius: 6px; ' +
    'border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer;';
  for (const k of Object.keys(scenarioButtons)) {
    scenarioButtons[k].elt.setAttribute('style', baseStyle);
  }
  updateButtonStyles();
}

function updateButtonStyles() {
  const base =
    'padding: 6px 12px; font-size: 12px; border-radius: 6px; ' +
    'border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer;';
  const active =
    'padding: 6px 12px; font-size: 12px; border-radius: 6px; ' +
    'border: 1px solid #f59e0b; background: #fef3c7; color: #9a3412; ' +
    'font-weight: 600; cursor: pointer;';
  for (const k of Object.keys(scenarioButtons)) {
    scenarioButtons[k].elt.setAttribute('style', k === activeScenario ? active : base);
  }
  // Re-position because button widths can change when style changes
  positionButtons();
}
