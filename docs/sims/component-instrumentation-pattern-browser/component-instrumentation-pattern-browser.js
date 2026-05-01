// Component Instrumentation Pattern Browser
// CANVAS_HEIGHT: 720
// Browse canonical xAPI instrumentation patterns for quizzes, simulations,
// and adaptive branching. Each interaction emits a sequence of statements
// shown in the live statement panel.

// ----- Global state -----
let registrationUUID = uuidv4();
let statementCounter = 0;
const statements = [];

// ----- p5.js sketch (simulation tab visualization only) -----
let simSliderValue = 50; // mirrors the Simulation tab slider

function setup() {
  // Place a small p5 canvas inside the simulation tab's diagram area.
  const target = document.getElementById('sim-canvas-host');
  if (!target) {
    // No p5 canvas needed if host not present; create a 1x1 hidden canvas
    const c = createCanvas(1, 1);
    c.style('display', 'none');
    return;
  }
  const w = target.clientWidth || 360;
  const h = 180;
  const c = createCanvas(w, h);
  c.parent(target);
  noLoop();
  redraw();
}

function windowResized() {
  const target = document.getElementById('sim-canvas-host');
  if (!target) return;
  const w = target.clientWidth || 360;
  resizeCanvas(w, 180);
  redraw();
}

function draw() {
  // Visualize the current simulation parameter as a moving "wave" amplitude
  background(248, 249, 250);
  noStroke();
  fill(230, 235, 245);
  rect(0, 0, width, height);

  // axis line
  stroke(160);
  line(20, height / 2, width - 20, height / 2);
  noStroke();

  // wave whose amplitude is driven by simSliderValue (0..100)
  const amp = map(simSliderValue, 0, 100, 4, height / 2 - 12);
  const freq = 0.06;
  fill(46, 109, 164);
  for (let x = 20; x < width - 20; x += 2) {
    const y = height / 2 + sin(x * freq) * amp;
    ellipse(x, y, 3, 3);
  }

  // label
  fill(40);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text('amplitude = ' + simSliderValue, 24, 8);
}

// Called by the simulation tab when slider value changes
function setSimSliderValue(v) {
  simSliderValue = v;
  redraw();
}

// ----- xAPI statement helpers -----
function uuidv4() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nowIso() {
  return new Date().toISOString();
}

const ACTOR = {
  objectType: 'Agent',
  name: 'Learner',
  mbox: 'mailto:learner@example.edu'
};

const ACTIVITY_BASE = 'https://example.edu/xapi/activities/';
const VERB_IRIS = {
  attempted: 'http://adlnet.gov/expapi/verbs/attempted',
  scored: 'http://adlnet.gov/expapi/verbs/scored',
  passed: 'http://adlnet.gov/expapi/verbs/passed',
  failed: 'http://adlnet.gov/expapi/verbs/failed',
  completed: 'http://adlnet.gov/expapi/verbs/completed',
  interacted: 'http://adlnet.gov/expapi/verbs/interacted',
  experienced: 'http://adlnet.gov/expapi/verbs/experienced',
  progressed: 'http://adlnet.gov/expapi/verbs/progressed'
};

function buildStatement(verbName, activityId, activityName, extras) {
  const stmt = {
    id: uuidv4(),
    actor: ACTOR,
    verb: {
      id: VERB_IRIS[verbName],
      display: { 'en-US': verbName }
    },
    object: {
      objectType: 'Activity',
      id: activityId,
      definition: {
        name: { 'en-US': activityName },
        type: 'http://adlnet.gov/expapi/activities/' +
          (extras && extras.activityType ? extras.activityType : 'lesson')
      }
    },
    timestamp: nowIso(),
    context: {
      registration: registrationUUID,
      platform: 'xAPI Course Textbook'
    }
  };
  if (extras && extras.result) stmt.result = extras.result;
  if (extras && extras.contextExtensions) {
    stmt.context.extensions = extras.contextExtensions;
  }
  return stmt;
}

function emitStatement(stmt, summary) {
  statementCounter += 1;
  const entry = {
    seq: statementCounter,
    verb: Object.keys(VERB_IRIS).find(k => VERB_IRIS[k] === stmt.verb.id) || 'verb',
    activity: stmt.object.definition.name['en-US'],
    summary: summary,
    registration: stmt.context.registration,
    statement: stmt
  };
  statements.push(entry);
  renderStatementList();
}

// ----- Statement list rendering -----
function renderStatementList() {
  const list = document.getElementById('statement-list');
  if (!list) return;
  if (statements.length === 0) {
    list.innerHTML = '<p class="empty">No statements yet. Interact with a tab on the left to see the canonical instrumentation pattern.</p>';
    return;
  }
  list.innerHTML = '';
  statements.forEach((e, idx) => {
    const item = document.createElement('div');
    item.className = 'stmt';
    item.innerHTML =
      '<div class="stmt-head">' +
        '<span class="stmt-seq">#' + e.seq + '</span>' +
        '<span class="stmt-verb verb-' + e.verb + '">' + e.verb + '</span>' +
        '<span class="stmt-activity">' + escapeHtml(e.activity) + '</span>' +
      '</div>' +
      '<div class="stmt-summary">' + escapeHtml(e.summary) + '</div>' +
      '<div class="stmt-reg">registration: <code>' + e.registration.slice(0, 8) + '…</code></div>' +
      '<pre class="stmt-json" style="display:none">' + escapeHtml(JSON.stringify(e.statement, null, 2)) + '</pre>';
    item.addEventListener('click', () => {
      const pre = item.querySelector('.stmt-json');
      pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
    });
    list.appendChild(item);
  });
  // auto-scroll to newest
  list.scrollTop = list.scrollHeight;
}

function clearStatements() {
  statements.length = 0;
  statementCounter = 0;
  registrationUUID = uuidv4();
  document.getElementById('reg-display').textContent = registrationUUID.slice(0, 8) + '…';
  renderStatementList();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ----- Tabs -----
function activateTab(name) {
  document.querySelectorAll('.tab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.dataset.tab === name);
  });
  if (name === 'simulation') {
    setTimeout(() => { if (typeof windowResized === 'function') windowResized(); }, 0);
  }
}

// ----- Quiz tab -----
const QUIZ_QUESTIONS = [
  { q: 'Which xAPI verb signals that a learner started an attempt?', choices: ['completed', 'attempted', 'interacted'], answer: 1 },
  { q: 'Which field carries the numeric score?', choices: ['result.score.raw', 'context.score', 'object.score'], answer: 0 },
  { q: 'Which verb is emitted when a learner meets the passing threshold?', choices: ['scored', 'passed', 'progressed'], answer: 1 }
];

function renderQuiz() {
  const host = document.getElementById('quiz-host');
  host.innerHTML = '';
  QUIZ_QUESTIONS.forEach((q, qi) => {
    const block = document.createElement('div');
    block.className = 'quiz-q';
    let html = '<p><strong>Q' + (qi + 1) + '.</strong> ' + escapeHtml(q.q) + '</p>';
    q.choices.forEach((c, ci) => {
      html += '<label class="choice"><input type="radio" name="q' + qi + '" value="' + ci + '"> ' + escapeHtml(c) + '</label>';
    });
    block.innerHTML = html;
    host.appendChild(block);
  });
}

function submitQuiz() {
  const activityId = ACTIVITY_BASE + 'sample-quiz';
  const activityName = 'Sample 3-Question Quiz';

  // 1) attempted
  emitStatement(
    buildStatement('attempted', activityId, activityName, { activityType: 'assessment' }),
    'Learner began the quiz attempt.'
  );

  // tally answers
  let correct = 0;
  QUIZ_QUESTIONS.forEach((q, qi) => {
    const sel = document.querySelector('input[name="q' + qi + '"]:checked');
    if (sel && parseInt(sel.value, 10) === q.answer) correct += 1;
  });
  const scaled = correct / QUIZ_QUESTIONS.length;
  const passed = scaled >= 0.66;

  // 2) scored
  emitStatement(
    buildStatement('scored', activityId, activityName, {
      activityType: 'assessment',
      result: {
        score: { scaled: scaled, raw: correct, min: 0, max: QUIZ_QUESTIONS.length }
      }
    }),
    'Score: ' + correct + '/' + QUIZ_QUESTIONS.length + ' (scaled ' + scaled.toFixed(2) + ').'
  );

  // 3) passed or failed
  emitStatement(
    buildStatement(passed ? 'passed' : 'failed', activityId, activityName, {
      activityType: 'assessment',
      result: { success: passed }
    }),
    passed ? 'Learner met the passing threshold.' : 'Learner did not meet the threshold.'
  );

  // 4) completed
  emitStatement(
    buildStatement('completed', activityId, activityName, {
      activityType: 'assessment',
      result: { completion: true }
    }),
    'Quiz attempt finished.'
  );

  // feedback
  const fb = document.getElementById('quiz-feedback');
  fb.textContent = 'You got ' + correct + ' of ' + QUIZ_QUESTIONS.length +
    ' correct — ' + (passed ? 'passed.' : 'did not pass.');
  fb.className = 'quiz-feedback ' + (passed ? 'pass' : 'fail');
}

function resetQuiz() {
  document.querySelectorAll('#quiz-host input[type=radio]').forEach(r => { r.checked = false; });
  const fb = document.getElementById('quiz-feedback');
  fb.textContent = '';
  fb.className = 'quiz-feedback';
}

// ----- Simulation tab -----
let simDebounceTimer = null;

function onSimSliderInput(v) {
  setSimSliderValue(v);
  document.getElementById('sim-slider-value').textContent = v;
  // Debounce interacted statements so we don't flood the LRS
  clearTimeout(simDebounceTimer);
  simDebounceTimer = setTimeout(() => {
    const activityId = ACTIVITY_BASE + 'wave-simulation';
    emitStatement(
      buildStatement('interacted', activityId, 'Wave Simulation', {
        activityType: 'simulation',
        result: {
          extensions: {
            'https://example.edu/xapi/extensions/sim-parameter': { amplitude: parseInt(v, 10) }
          }
        }
      }),
      'Adjusted the amplitude slider to ' + v + ' (debounced).'
    );
  }, 400);
}

function runSimulation() {
  const activityId = ACTIVITY_BASE + 'wave-simulation';
  emitStatement(
    buildStatement('experienced', activityId, 'Wave Simulation', {
      activityType: 'simulation'
    }),
    'Learner ran the simulation with current parameters.'
  );
}

// ----- Adaptive branching tab -----
function chooseBranch(branchName) {
  const activityId = ACTIVITY_BASE + 'adaptive-lesson/' + branchName;
  emitStatement(
    buildStatement('progressed', activityId, 'Adaptive Lesson — ' + branchName, {
      activityType: 'lesson',
      contextExtensions: {
        'https://example.edu/xapi/extensions/branch-decision': {
          chosen: branchName,
          alternatives: ['conceptual', 'hands-on'].filter(x => x !== branchName)
        }
      }
    }),
    'Learner took the "' + branchName + '" path.'
  );
  // visual feedback
  document.querySelectorAll('.branch-card').forEach(c => {
    c.classList.toggle('chosen', c.dataset.branch === branchName);
  });
}

// ----- DOM bootstrap -----
document.addEventListener('DOMContentLoaded', () => {
  // tab buttons
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // quiz
  renderQuiz();
  document.getElementById('quiz-submit').addEventListener('click', submitQuiz);
  document.getElementById('quiz-reset').addEventListener('click', resetQuiz);

  // simulation
  const sl = document.getElementById('sim-slider');
  sl.addEventListener('input', e => onSimSliderInput(e.target.value));
  document.getElementById('sim-run').addEventListener('click', runSimulation);

  // branching
  document.querySelectorAll('.branch-card').forEach(card => {
    card.addEventListener('click', () => chooseBranch(card.dataset.branch));
  });

  // reset
  document.getElementById('reset-all').addEventListener('click', () => {
    clearStatements();
    resetQuiz();
    document.querySelectorAll('.branch-card').forEach(c => c.classList.remove('chosen'));
  });

  document.getElementById('reg-display').textContent = registrationUUID.slice(0, 8) + '…';
  renderStatementList();
});
