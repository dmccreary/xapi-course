// Component Instrumentation MicroSim
// CANVAS_HEIGHT: 620
// Bloom: Apply (L3) — Manipulate UI controls and observe which xAPI verbs they emit.

const ACTOR = {
    objectType: 'Agent',
    name: 'Pat Learner',
    account: {
        homePage: 'https://example.com/textbook',
        name: 'pat-learner-7421'
    }
};

const OBJECT_DEMO = 'https://example.com/textbook/quadratic-demo';
const OBJECT_QUIZ = 'https://example.com/textbook/vertex-quiz';

const VERBS = {
    interacted: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
    experienced: { id: 'http://adlnet.gov/expapi/verbs/experienced', display: { 'en-US': 'experienced' } },
    attempted: { id: 'http://adlnet.gov/expapi/verbs/attempted', display: { 'en-US': 'attempted' } },
    scored: { id: 'http://adlnet.gov/expapi/verbs/scored', display: { 'en-US': 'scored' } },
    passed: { id: 'http://adlnet.gov/expapi/verbs/passed', display: { 'en-US': 'passed' } },
    failed: { id: 'http://adlnet.gov/expapi/verbs/failed', display: { 'en-US': 'failed' } }
};

const CORRECT_ANSWER = 'B';
const MAX_LOG_ENTRIES = 10;
const SLIDER_DEBOUNCE_MS = 250;

let currentA = 1.0;
let runAnimationStart = 0;
let runAnimationDuration = 800;
let isRunning = false;
let sliderTimer = null;
let pendingSliderValue = null;
let logEntries = [];
let entryIdCounter = 0;

// ---------- p5 sketch (parabola plot) ----------
const sketch = (p) => {
    let canvasW = 400;
    let canvasH = 200;

    const updateSize = () => {
        const c = document.getElementById('parabola-canvas');
        if (c) {
            canvasW = Math.max(280, c.clientWidth - 4);
            canvasH = c.clientHeight - 4;
        }
    };

    p.setup = () => {
        updateSize();
        const cnv = p.createCanvas(canvasW, canvasH);
        cnv.parent('parabola-canvas');
        p.frameRate(30);
    };

    p.windowResized = () => {
        updateSize();
        p.resizeCanvas(canvasW, canvasH);
    };

    p.draw = () => {
        p.background(248, 250, 252);

        const padX = 30;
        const padY = 20;
        const plotW = canvasW - 2 * padX;
        const plotH = canvasH - 2 * padY;
        const cx = padX + plotW / 2;
        const cy = padY + plotH / 2;
        const xMin = -3, xMax = 3;
        const yMin = -3, yMax = 3;
        const xScale = plotW / (xMax - xMin);
        const yScale = plotH / (yMax - yMin);

        // Grid
        p.stroke(226, 232, 240);
        p.strokeWeight(1);
        for (let gx = xMin; gx <= xMax; gx++) {
            const sx = cx + gx * xScale;
            p.line(sx, padY, sx, padY + plotH);
        }
        for (let gy = yMin; gy <= yMax; gy++) {
            const sy = cy - gy * yScale;
            p.line(padX, sy, padX + plotW, sy);
        }

        // Axes
        p.stroke(100, 116, 139);
        p.strokeWeight(1.5);
        p.line(padX, cy, padX + plotW, cy);
        p.line(cx, padY, cx, padY + plotH);

        // Tick labels
        p.noStroke();
        p.fill(100, 116, 139);
        p.textSize(9);
        p.textAlign(p.CENTER, p.TOP);
        for (let gx = xMin; gx <= xMax; gx++) {
            if (gx === 0) continue;
            p.text(gx, cx + gx * xScale, cy + 3);
        }
        p.textAlign(p.RIGHT, p.CENTER);
        for (let gy = yMin; gy <= yMax; gy++) {
            if (gy === 0) continue;
            p.text(gy, cx - 3, cy - gy * yScale);
        }

        // Animation progress (only when running)
        let progress = 1.0;
        if (isRunning) {
            progress = (p.millis() - runAnimationStart) / runAnimationDuration;
            if (progress >= 1.0) {
                progress = 1.0;
                isRunning = false;
            }
        }

        // Parabola y = a x²
        p.stroke(67, 56, 202);
        p.strokeWeight(2.5);
        p.noFill();
        p.beginShape();
        const xLimit = xMin + (xMax - xMin) * progress;
        for (let xi = xMin; xi <= xLimit; xi += 0.05) {
            const yi = currentA * xi * xi;
            const sx = cx + xi * xScale;
            const sy = cy - yi * yScale;
            if (sy >= padY && sy <= padY + plotH) {
                p.vertex(sx, sy);
            }
        }
        p.endShape();

        // Equation label
        p.noStroke();
        p.fill(67, 56, 202);
        p.textSize(11);
        p.textStyle(p.BOLD);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`y = ${currentA.toFixed(1)} · x²`, padX + 4, padY + 2);
        p.textStyle(p.NORMAL);
    };
};

// ---------- xAPI statement construction & logging ----------
function buildStatement(verbKey, objectId, extraResult, extraContext) {
    const stmt = {
        actor: ACTOR,
        verb: VERBS[verbKey],
        object: {
            objectType: 'Activity',
            id: objectId,
            definition: {
                name: { 'en-US': objectId === OBJECT_DEMO ? 'Quadratic Function Demo' : 'Vertex Quiz' },
                type: objectId === OBJECT_DEMO
                    ? 'http://adlnet.gov/expapi/activities/simulation'
                    : 'http://adlnet.gov/expapi/activities/cmi.interaction'
            }
        },
        timestamp: new Date().toISOString()
    };
    if (extraResult) stmt.result = extraResult;
    if (extraContext) stmt.context = extraContext;
    return stmt;
}

function emit(verbKey, objectId, extraResult, extraContext) {
    const stmt = buildStatement(verbKey, objectId, extraResult, extraContext);
    addLogEntry(verbKey, stmt);
}

function addLogEntry(verbKey, stmt) {
    entryIdCounter += 1;
    logEntries.unshift({ id: entryIdCounter, verb: verbKey, stmt });
    if (logEntries.length > MAX_LOG_ENTRIES) {
        logEntries = logEntries.slice(0, MAX_LOG_ENTRIES);
    }
    renderLog();
}

function shortIRI(iri) {
    const slash = iri.lastIndexOf('/');
    return slash >= 0 ? '…/' + iri.substring(slash + 1) : iri;
}

function shortTime(iso) {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss}.${ms}`;
}

function renderLog() {
    const list = document.getElementById('log-list');
    const count = document.getElementById('log-count');
    count.textContent = `${logEntries.length} / ${MAX_LOG_ENTRIES}`;

    if (logEntries.length === 0) {
        list.innerHTML = `<div class="log-empty">No statements yet. Try moving the slider, clicking <em>Run Simulation</em>, selecting a quiz answer, or submitting the quiz.</div>`;
        return;
    }

    list.innerHTML = logEntries.map(e => {
        const objId = e.stmt.object.id;
        const json = JSON.stringify(e.stmt, null, 2);
        return `
            <div class="log-entry" data-id="${e.id}">
                <div class="row1">
                    <span class="verb verb-${e.verb}">${e.verb}</span>
                    <span class="timestamp">${shortTime(e.stmt.timestamp)}</span>
                </div>
                <div class="object">${shortIRI(objId)}</div>
                <div class="json">${escapeHtml(json)}</div>
            </div>`;
    }).join('');

    list.querySelectorAll('.log-entry').forEach(el => {
        el.addEventListener('click', () => el.classList.toggle('expanded'));
    });
}

function escapeHtml(s) {
    return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

// ---------- Control wiring ----------
function wireControls() {
    const slider = document.getElementById('coef-a');
    const sliderValue = document.getElementById('coef-a-value');
    const runBtn = document.getElementById('run-sim');
    const submitBtn = document.getElementById('submit-quiz');
    const feedback = document.getElementById('quiz-feedback');

    slider.addEventListener('input', () => {
        const v = parseFloat(slider.value);
        currentA = v;
        sliderValue.textContent = v.toFixed(1);
        // Debounced interacted statement
        pendingSliderValue = v;
        if (sliderTimer) clearTimeout(sliderTimer);
        sliderTimer = setTimeout(() => {
            emit('interacted', OBJECT_DEMO, {
                extensions: {
                    'https://example.com/xapi/extensions/coefficient': pendingSliderValue
                }
            });
            sliderTimer = null;
        }, SLIDER_DEBOUNCE_MS);
    });

    runBtn.addEventListener('click', () => {
        runAnimationStart = window._p5Instance ? window._p5Instance.millis() : 0;
        isRunning = true;
        emit('experienced', OBJECT_DEMO, null, {
            extensions: {
                'https://example.com/xapi/extensions/current-coefficient': currentA
            }
        });
    });

    document.querySelectorAll('input[name="vertex-quiz"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Spec: selecting a radio option emits NO statement
            // (this is component-internal state)
            feedback.className = 'quiz-feedback';
            feedback.textContent = '';
        });
    });

    submitBtn.addEventListener('click', () => {
        const selected = document.querySelector('input[name="vertex-quiz"]:checked');
        if (!selected) {
            feedback.className = 'quiz-feedback failed';
            feedback.textContent = 'Pick an answer first, then submit.';
            return;
        }

        const choice = selected.value;
        const correct = choice === CORRECT_ANSWER;
        const score = correct ? 1.0 : 0.0;

        // 1. attempted
        emit('attempted', OBJECT_QUIZ, {
            response: choice
        });

        // 2. scored
        emit('scored', OBJECT_QUIZ, {
            score: { scaled: score, raw: correct ? 1 : 0, min: 0, max: 1 },
            response: choice
        });

        // 3. passed or failed
        emit(correct ? 'passed' : 'failed', OBJECT_QUIZ, {
            success: correct,
            completion: true,
            response: choice,
            score: { scaled: score, raw: correct ? 1 : 0, min: 0, max: 1 }
        });

        feedback.className = correct ? 'quiz-feedback passed' : 'quiz-feedback failed';
        feedback.textContent = correct
            ? '✓ Correct! Three statements emitted: attempted → scored → passed.'
            : '✗ Not quite. Three statements emitted: attempted → scored → failed.';
    });
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', () => {
    window._p5Instance = new p5(sketch);
    wireControls();
    renderLog();
});
