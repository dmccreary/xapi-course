// Bandwidth Budget Calculator MicroSim
// CANVAS_HEIGHT: 540
// Bloom: Apply (L3) — estimate bandwidth cost of an xAPI deployment

const refLinks = {
    wifi:   { label: 'Classroom Wi-Fi (~5 Mbps)',  bps: 5_000_000 / 8 },
    cell:   { label: '10 Mbps cellular tether',    bps: 10_000_000 / 8 },
    campus: { label: '1 Gbps campus link',         bps: 1_000_000_000 / 8 }
};

const presets = {
    reading:    { payload: 800,  overhead: 700, statements: 12,  duration: 30, learners: 25,  batch: 1 },
    math:       { payload: 1400, overhead: 700, statements: 60,  duration: 25, learners: 30,  batch: 5 },
    physics:    { payload: 2200, overhead: 700, statements: 180, duration: 40, learners: 30,  batch: 10 },
    assessment: { payload: 1200, overhead: 700, statements: 35,  duration: 45, learners: 30,  batch: 1 }
};

const sliderIds = ['payload', 'overhead', 'statements', 'duration', 'learners', 'batch'];

function fmtBytes(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + ' GB';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + ' MB';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + ' KB';
    return n.toFixed(0) + ' B';
}

function fmtRate(bps) {
    const bits = bps * 8;
    if (bits >= 1e9) return (bits / 1e9).toFixed(2) + ' Gbps';
    if (bits >= 1e6) return (bits / 1e6).toFixed(2) + ' Mbps';
    if (bits >= 1e3) return (bits / 1e3).toFixed(1) + ' Kbps';
    return bits.toFixed(0) + ' bps';
}

function getVals() {
    const v = {};
    for (const id of sliderIds) v[id] = +document.getElementById(id).value;
    return v;
}

function compute() {
    const v = getVals();

    // Number of POST requests per learner-session = ceil(statements / batch)
    const requests = Math.ceil(v.statements / v.batch);
    const bytesPerLearner = requests * v.overhead + v.statements * v.payload;
    const cohortBytes = bytesPerLearner * v.learners;
    const sessionSec = v.duration * 60;
    const avgBps = (cohortBytes / sessionSec); // bytes per second across cohort

    document.getElementById('o-perlearner').textContent = fmtBytes(bytesPerLearner);
    document.getElementById('o-cohort').textContent = fmtBytes(cohortBytes);
    document.getElementById('o-bps').textContent = fmtRate(avgBps);

    // Headroom comparison
    const refKey = document.getElementById('ref').value;
    const ref = refLinks[refKey];
    const pct = Math.min(100, (avgBps / ref.bps) * 100);
    const bar = document.getElementById('bar');
    const barPct = document.getElementById('bar-pct');
    bar.style.width = pct.toFixed(1) + '%';
    barPct.textContent = pct.toFixed(1) + '% of ' + ref.label;

    const badge = document.getElementById('badge');
    badge.classList.remove('green', 'yellow', 'red');
    let level, txt;
    if (pct < 25)      { level = 'green';  txt = 'Plenty of headroom'; }
    else if (pct < 70) { level = 'yellow'; txt = 'Tight — consider batching'; }
    else               { level = 'red';    txt = 'Will saturate the link'; }
    badge.classList.add(level);
    badge.textContent = txt;
}

function syncLabel(id) {
    document.getElementById('v-' + id).textContent = document.getElementById(id).value;
}

function applyPreset(key) {
    const p = presets[key];
    if (!p) return;
    for (const id of sliderIds) {
        document.getElementById(id).value = p[id];
        syncLabel(id);
    }
    compute();
}

document.addEventListener('DOMContentLoaded', () => {
    for (const id of sliderIds) {
        const el = document.getElementById(id);
        el.addEventListener('input', () => { syncLabel(id); compute(); });
    }
    document.getElementById('ref').addEventListener('change', compute);
    document.querySelectorAll('.preset-btn').forEach(b => {
        b.addEventListener('click', () => applyPreset(b.dataset.preset));
    });
    compute();
});
