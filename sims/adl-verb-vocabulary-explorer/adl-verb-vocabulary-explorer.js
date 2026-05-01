// ADL Verb Vocabulary Explorer — p5.js MicroSim
// CANVAS_HEIGHT: 540
// Bloom: Understand (L2) — classify, exemplify
// Pattern: chip-grid explorer with click-to-reveal infobox (learner-paced, no animation)

let canvasWidth = 760;
const CANVAS_HEIGHT = 540;
const CTRL_H = 46;
const CHIP_PAD = 8;
const CHIP_H = 34;
const CHIP_GAP = 6;

let catSelect, searchInput, infoDiv, copyBtn;
let selectedVerb = null;
let filteredVerbs = [];
let chipRects = [];
let hoveredIdx = -1;

const CAT_COLORS = {
    'Engagement':  [59, 130, 246],
    'Assessment':  [217, 119, 6],
    'Progression': [22, 163, 74],
    'Social':      [124, 58, 237],
    'Lifecycle':   [71, 85, 105]
};

const VERBS = [
    { name: 'experienced',  cat: 'Engagement',
      iri: 'http://adlnet.gov/expapi/verbs/experienced',
      def: 'Indicates the actor only experienced the content — viewed, read, or listened without specific interaction. Use as the baseline when a more specific verb does not apply.',
      ex1: 'A learner read a chapter introduction.',
      ex2: 'A learner watched a tutorial video without interacting.' },
    { name: 'interacted',   cat: 'Engagement',
      iri: 'http://adlnet.gov/expapi/verbs/interacted',
      def: 'Indicates the actor interacted with content — clicked, dragged, hovered, or manipulated a MicroSim. Use when interaction happened but was not a formal assessment attempt.',
      ex1: 'A learner clicked a node in an interactive diagram.',
      ex2: 'A learner moved a slider in a physics simulation.' },
    { name: 'progressed',   cat: 'Engagement',
      iri: 'http://adlnet.gov/expapi/verbs/progressed',
      def: 'Indicates the actor moved forward through a series of activities. Useful for tracking advancement through a chapter without implying full completion.',
      ex1: 'A learner scrolled past the 50% mark of a chapter.',
      ex2: 'A learner moved from section 2 to section 3 of a module.' },
    { name: 'launched',     cat: 'Engagement',
      iri: 'http://adlnet.gov/expapi/verbs/launched',
      def: 'Indicates the actor opened or started a resource. Often the first statement in a session — the activity was opened before any interaction occurred.',
      ex1: 'A learner opened a chapter in the intelligent textbook.',
      ex2: 'A learner launched a MicroSim for the first time.' },
    { name: 'attempted',    cat: 'Assessment',
      iri: 'http://adlnet.gov/expapi/verbs/attempted',
      def: 'Indicates the actor made a formal effort on an assessment activity. Pairs naturally with answered or passed/failed to describe a complete assessment sequence.',
      ex1: 'A learner started a quiz.',
      ex2: 'A learner tried to answer a fill-in-the-blank question.' },
    { name: 'answered',     cat: 'Assessment',
      iri: 'http://adlnet.gov/expapi/verbs/answered',
      def: 'Indicates the actor gave a response to a specific question. The response is stored in result.response. This is the go-to verb for individual question responses.',
      ex1: 'A learner selected option B on a multiple-choice question.',
      ex2: 'A learner typed a short written response.' },
    { name: 'passed',       cat: 'Assessment',
      iri: 'http://adlnet.gov/expapi/verbs/passed',
      def: 'Indicates the actor met the criteria for success. result.success is true and result.score.scaled typically meets or exceeds the passing threshold.',
      ex1: 'A learner scored 80% on a chapter quiz (threshold 70%).',
      ex2: 'A learner completed a competency check with all items correct.' },
    { name: 'failed',       cat: 'Assessment',
      iri: 'http://adlnet.gov/expapi/verbs/failed',
      def: 'Indicates the actor did not meet the criteria for success. result.success is false. The learner may re-attempt depending on the activity retry policy.',
      ex1: 'A learner scored 45% on a required quiz (threshold 70%).',
      ex2: 'A learner exceeded the error limit in a code exercise.' },
    { name: 'scored',       cat: 'Assessment',
      iri: 'http://adlnet.gov/expapi/verbs/scored',
      def: 'Indicates the actor received a numerical score without explicitly passing or failing. Use when you want to record a score but not assert success or failure.',
      ex1: 'A learner earned 23 of 30 on a formative exercise.',
      ex2: 'A simulation returned a performance score of 0.67.' },
    { name: 'completed',    cat: 'Progression',
      iri: 'http://adlnet.gov/expapi/verbs/completed',
      def: 'Indicates the actor finished an activity. result.completion is true. One of the most common verbs — every chapter, course, and module with a defined end should use this.',
      ex1: 'A learner reached the end of a chapter.',
      ex2: 'A learner finished all exercises in a module.' },
    { name: 'mastered',     cat: 'Progression',
      iri: 'http://adlnet.gov/expapi/verbs/mastered',
      def: 'Indicates the actor reached a high level of proficiency — beyond mere passing. Use in adaptive systems that distinguish "passed" from "truly owns this concept."',
      ex1: 'A learner answered 10 consecutive questions on a topic correctly.',
      ex2: 'A learner scored 100% across three consecutive attempts.' },
    { name: 'voided',       cat: 'Progression',
      iri: 'http://adlnet.gov/expapi/verbs/voided',
      def: 'Indicates that a previously recorded statement should be ignored. The object must be a StatementRef. Required by xAPI — you cannot delete a statement, only void it.',
      ex1: 'An admin voided a false-positive completion statement.',
      ex2: 'A system retracted a duplicate statement from a buggy batch upload.' },
    { name: 'shared',       cat: 'Social',
      iri: 'http://adlnet.gov/expapi/verbs/shared',
      def: 'Indicates the actor forwarded or distributed an object to another person or group. Useful for social and collaborative learning analytics.',
      ex1: 'A learner shared a chapter link with a classmate.',
      ex2: 'A learner sent a discussion thread to their study group.' },
    { name: 'commented',    cat: 'Social',
      iri: 'http://adlnet.gov/expapi/verbs/commented',
      def: 'Indicates the actor made a comment about an object. result.response carries the comment text.',
      ex1: 'A learner posted a question on a chapter annotation layer.',
      ex2: 'A learner added a note to a glossary term.' },
    { name: 'initialized',  cat: 'Lifecycle',
      iri: 'http://adlnet.gov/expapi/verbs/initialized',
      def: 'The CMI5 lifecycle verb emitted when a course finishes setup and is ready for learner input. Required as the second statement in CMI5 sessions (after launched).',
      ex1: 'A CMI5 course completed setup and sent initialized to signal readiness.',
      ex2: 'An intelligent textbook chapter initialized its xAPI tracking session.' },
    { name: 'terminated',   cat: 'Lifecycle',
      iri: 'http://adlnet.gov/expapi/verbs/terminated',
      def: 'The CMI5 lifecycle verb emitted when the learner cleanly ends a session. Required as the last statement in a CMI5 session. Use abandoned instead if the session ended without a proper close.',
      ex1: 'A learner clicked Close in a CMI5 course.',
      ex2: 'An intelligent textbook chapter sent terminated when the tab was properly closed.' }
];

function updateCanvasSize() {
    canvasWidth = document.querySelector('main').offsetWidth || 760;
}

function setup() {
    updateCanvasSize();
    let canvas = createCanvas(canvasWidth, CANVAS_HEIGHT);
    canvas.parent(document.querySelector('main'));

    catSelect = createSelect();
    catSelect.parent(document.querySelector('main'));
    catSelect.option('All Categories', 'all');
    Object.keys(CAT_COLORS).forEach(c => catSelect.option(c, c));
    catSelect.changed(() => updateFilter());

    searchInput = createInput('');
    searchInput.parent(document.querySelector('main'));
    searchInput.attribute('placeholder', 'Search verbs...');
    searchInput.input(() => updateFilter());

    infoDiv = createElement('div', '');
    infoDiv.class('verb-infobox');
    infoDiv.parent(document.querySelector('main'));

    copyBtn = createElement('button', 'Copy Verb JSON');
    copyBtn.class('verb-copy-btn');
    copyBtn.parent(document.querySelector('main'));
    copyBtn.mousePressed(copyVerbJson);

    positionElements();
    showPlaceholder();
    updateFilter();
    noLoop();
}

function panelW() { return floor(canvasWidth * 0.40); }
function chipAreaW() { return canvasWidth - panelW(); }

function positionElements() {
    let cw = chipAreaW();
    catSelect.position(8, 8);
    catSelect.size(138);
    searchInput.position(154, 8);
    searchInput.size(min(cw - 166, 150));

    infoDiv.position(cw, CTRL_H);
    infoDiv.style('width', panelW() + 'px');
    infoDiv.style('height', (CANVAS_HEIGHT - CTRL_H - 44) + 'px');
    infoDiv.style('top', CTRL_H + 'px');

    copyBtn.position(cw + 8, CANVAS_HEIGHT - 36);
    copyBtn.style('width', (panelW() - 16) + 'px');
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, CANVAS_HEIGHT);
    positionElements();
    buildChipRects();
    redraw();
}

function updateFilter() {
    const cat = catSelect.value();
    const q = searchInput.value().toLowerCase().trim();
    filteredVerbs = VERBS.filter(v =>
        (cat === 'all' || v.cat === cat) && (!q || v.name.includes(q))
    );
    buildChipRects();
    redraw();
}

function buildChipRects() {
    let cw = chipAreaW();
    const cols = 2;
    const chipW = floor((cw - CHIP_PAD * (cols + 1)) / cols);
    chipRects = filteredVerbs.map((v, i) => {
        const col = i % cols;
        const row = floor(i / cols);
        return {
            verb: v,
            x: CHIP_PAD + col * (chipW + CHIP_PAD),
            y: CTRL_H + CHIP_PAD + row * (CHIP_H + CHIP_GAP),
            w: chipW,
            h: CHIP_H
        };
    });
}

function draw() {
    let cw = chipAreaW();

    // Controls bar
    fill(30, 41, 59);
    noStroke();
    rect(0, 0, canvasWidth, CTRL_H);

    // Label in controls bar
    fill(148, 163, 184);
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Filter by category:', 0 + 4, CTRL_H / 2 - 1);
    // (controls overlap this — that's OK, just background label)

    // Chip area background
    fill(238, 242, 255);
    noStroke();
    rect(0, CTRL_H, cw, CANVAS_HEIGHT - CTRL_H);

    // Infobox area background (behind div)
    fill(255);
    noStroke();
    rect(cw, CTRL_H, panelW(), CANVAS_HEIGHT - CTRL_H);

    // Divider
    stroke(203, 213, 225);
    strokeWeight(1);
    line(cw, CTRL_H, cw, CANVAS_HEIGHT);

    // Chips
    for (let i = 0; i < chipRects.length; i++) {
        const c = chipRects[i];
        const isSelected = selectedVerb && selectedVerb.name === c.verb.name;
        const isHovered = hoveredIdx === i;
        const col = CAT_COLORS[c.verb.cat];

        // Shadow (subtle)
        noStroke();
        fill(0, 0, 0, isHovered || isSelected ? 18 : 8);
        rect(c.x + 2, c.y + 2, c.w, c.h, 6);

        // Chip body
        if (isSelected) {
            fill(col[0], col[1], col[2]);
        } else if (isHovered) {
            fill(241, 245, 249);
        } else {
            fill(255);
        }
        stroke(isSelected ? color(col[0], col[1], col[2]) : color(203, 213, 225));
        strokeWeight(1);
        rect(c.x, c.y, c.w, c.h, 5);

        // Category accent bar (left edge)
        noStroke();
        fill(col[0], col[1], col[2]);
        rect(c.x, c.y, 5, c.h, 5, 0, 0, 5);

        // Verb name
        noStroke();
        fill(isSelected ? 255 : 30, isSelected ? 255 : 41, isSelected ? 255 : 59);
        textSize(13);
        textAlign(LEFT, CENTER);
        textStyle(NORMAL);
        text(c.verb.name, c.x + 13, c.y + c.h / 2);

        // Category label (right side)
        textSize(10);
        fill(isSelected ? 255 : col[0], isSelected ? 255 : col[1], isSelected ? 255 : col[2]);
        if (!isSelected) fill(col[0], col[1], col[2], 180);
        textAlign(RIGHT, CENTER);
        text(c.verb.cat, c.x + c.w - 6, c.y + c.h / 2);
        textAlign(LEFT, CENTER);
    }

    if (chipRects.length === 0) {
        fill(148, 163, 184);
        noStroke();
        textSize(13);
        textAlign(CENTER, CENTER);
        text('No verbs match the filter.', cw / 2, (CANVAS_HEIGHT + CTRL_H) / 2);
    }
}

function mouseMoved() {
    let prev = hoveredIdx;
    hoveredIdx = -1;
    for (let i = 0; i < chipRects.length; i++) {
        const c = chipRects[i];
        if (mouseX >= c.x && mouseX <= c.x + c.w &&
            mouseY >= c.y && mouseY <= c.y + c.h) {
            hoveredIdx = i;
            cursor(HAND);
            break;
        }
    }
    if (hoveredIdx === -1) cursor(ARROW);
    if (hoveredIdx !== prev) redraw();
}

function mousePressed() {
    for (let i = 0; i < chipRects.length; i++) {
        const c = chipRects[i];
        if (mouseX >= c.x && mouseX <= c.x + c.w &&
            mouseY >= c.y && mouseY <= c.y + c.h) {
            selectedVerb = c.verb;
            showVerbInfo(c.verb);
            redraw();
            return;
        }
    }
}

function showVerbInfo(v) {
    const col = CAT_COLORS[v.cat];
    const hex = '#' + col.map(n => n.toString(16).padStart(2, '0')).join('');
    infoDiv.html(
        '<div class="v-name">' + v.name + '</div>' +
        '<span class="v-cat" style="background:' + hex + '">' + v.cat + '</span>' +
        '<div class="v-iri">' + v.iri + '</div>' +
        '<div class="v-def">' + v.def + '</div>' +
        '<div class="v-ex-label">Example uses</div>' +
        '<div class="v-ex">' + v.ex1 + '</div>' +
        '<div class="v-ex">' + v.ex2 + '</div>'
    );
    copyBtn.elt.style.display = 'block';
}

function showPlaceholder() {
    infoDiv.html('<p class="v-placeholder">Click any verb chip to see its full IRI, definition, and example uses. Verbs are IRIs — globally unique identifiers, not just strings.</p>');
    copyBtn.elt.style.display = 'none';
}

function copyVerbJson() {
    if (!selectedVerb) return;
    const json = JSON.stringify({
        id: selectedVerb.iri,
        display: { 'en-US': selectedVerb.name }
    }, null, 2);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(json).then(() => {
            copyBtn.html('Copied!');
            setTimeout(() => copyBtn.html('Copy Verb JSON'), 1600);
        }).catch(() => { console.log('Verb JSON:', json); });
    } else {
        console.log('Verb JSON:', json);
    }
    emitInteracted(selectedVerb.name);
}

function emitInteracted(verbName) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    const stmt = {
        actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
        object: {
            id: 'http://textbook.example.org/sims/adl-verb-vocabulary-explorer#' + verbName,
            definition: { name: { 'en-US': 'ADL verb: ' + verbName } }
        },
        timestamp: new Date().toISOString()
    };
    try { window.XAPI_LRS.send(stmt); } catch (e) {}
}
