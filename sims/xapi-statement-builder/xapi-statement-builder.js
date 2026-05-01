// xAPI Statement Builder — interactive form-based statement constructor
// CANVAS_HEIGHT: 600
// Bloom: Apply (L3) — construct, implement
// Pattern: form builder with live JSON preview and conformance checking

const ADL_VERB_DISPLAY = {
    'http://adlnet.gov/expapi/verbs/experienced':  'experienced',
    'http://adlnet.gov/expapi/verbs/interacted':   'interacted',
    'http://adlnet.gov/expapi/verbs/attempted':    'attempted',
    'http://adlnet.gov/expapi/verbs/answered':     'answered',
    'http://adlnet.gov/expapi/verbs/passed':       'passed',
    'http://adlnet.gov/expapi/verbs/failed':       'failed',
    'http://adlnet.gov/expapi/verbs/completed':    'completed',
    'http://adlnet.gov/expapi/verbs/progressed':   'progressed',
    'http://adlnet.gov/expapi/verbs/mastered':     'mastered',
    'http://adlnet.gov/expapi/verbs/voided':       'voided',
    'http://adlnet.gov/expapi/verbs/initialized':  'initialized',
    'http://adlnet.gov/expapi/verbs/terminated':   'terminated'
};

function genUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function nowISO() {
    return new Date().toISOString();
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function checked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

function toggleSection(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const open = el.classList.toggle('open');
    btn.textContent = open ? '− collapse' : '+ expand';
}

function showHideIFI() {
    const type = val('ifi-type');
    const rows = { mbox: ['row-mbox'], mbox_sha1sum: ['row-hash'], openid: ['row-openid'], account: ['row-acct-hp','row-acct-name'] };
    ['row-mbox','row-hash','row-openid','row-acct-hp','row-acct-name'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    (rows[type] || []).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
    });
}

function buildActor() {
    const type = val('ifi-type');
    const name = val('actor-name');
    const actor = { objectType: 'Agent' };
    if (name) actor.name = name;
    if (type === 'mbox') {
        actor.mbox = val('actor-mbox') || 'mailto:learner@example.edu';
    } else if (type === 'mbox_sha1sum') {
        actor.mbox_sha1sum = val('actor-hash');
    } else if (type === 'openid') {
        actor.openid = val('actor-openid');
    } else if (type === 'account') {
        actor.account = { homePage: val('actor-hp'), name: val('actor-acct') };
    }
    return actor;
}

function buildVerb() {
    const preset = val('verb-select');
    const iri = preset || val('verb-iri-custom');
    const display = ADL_VERB_DISPLAY[iri] || null;
    const verb = { id: iri };
    if (display) verb.display = { 'en-US': display };
    return verb;
}

function buildObject() {
    const type = val('obj-type');
    const id = val('obj-id');
    if (type === 'StatementRef') {
        return { objectType: 'StatementRef', id };
    }
    const obj = { objectType: type, id };
    if (type === 'Activity') {
        const name = val('obj-name');
        if (name) {
            obj.definition = { name: { 'en-US': name } };
        }
    }
    return obj;
}

function buildResult() {
    const hasSuccess = checked('r-success') || checked('r-fail');
    const hasCompletion = checked('r-comp');
    const scaled = val('r-scaled');
    const duration = val('r-duration');
    if (!hasSuccess && !hasCompletion && !scaled && !duration) return null;
    const result = {};
    if (hasSuccess) result.success = checked('r-success');
    if (hasCompletion) result.completion = true;
    if (scaled !== '') {
        const s = parseFloat(scaled);
        if (!isNaN(s)) result.score = { scaled: s };
    }
    if (duration) result.duration = duration;
    return result;
}

function buildContext() {
    const platform = val('ctx-platform');
    const lang = val('ctx-lang');
    const parent = val('ctx-parent');
    if (!platform && !lang && !parent) return null;
    const ctx = {};
    if (platform) ctx.platform = platform;
    if (lang) ctx.language = lang;
    if (parent) ctx.contextActivities = { parent: [{ id: parent, objectType: 'Activity' }] };
    return ctx;
}

function buildStatement() {
    const stmt = {
        id: val('stmt-id') || genUUID(),
        actor: buildActor(),
        verb: buildVerb(),
        object: buildObject(),
        timestamp: val('stmt-ts') || nowISO()
    };
    const result = buildResult();
    if (result) stmt.result = result;
    const ctx = buildContext();
    if (ctx) stmt.context = ctx;
    return stmt;
}

// ── Conformance checks ──

function isValidIRI(s) {
    return /^https?:\/\/.+/.test(s);
}

function isValidUUID(s) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

function isValidISO8601(s) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);
}

function checkConformance(stmt) {
    const issues = [];

    // Actor checks
    const ifi = ['mbox','mbox_sha1sum','openid','account'];
    const foundIFI = ifi.filter(k => stmt.actor && stmt.actor[k] !== undefined);
    if (foundIFI.length === 0) issues.push('Actor must have exactly one IFI (mbox, mbox_sha1sum, openid, or account).');
    if (foundIFI.length > 1) issues.push('Actor must have exactly one IFI — found multiple: ' + foundIFI.join(', ') + '.');
    if (stmt.actor && stmt.actor.mbox && !stmt.actor.mbox.startsWith('mailto:')) {
        issues.push('Actor.mbox must start with "mailto:" — e.g. mailto:lin@example.edu.');
    }

    // Verb checks
    if (!stmt.verb || !stmt.verb.id) {
        issues.push('Verb must have an "id" field.');
    } else if (!isValidIRI(stmt.verb.id)) {
        issues.push('Verb.id must be a valid IRI (starts with http:// or https://).');
    }

    // Object checks
    if (!stmt.object || !stmt.object.id) {
        issues.push('Object must have an "id" field.');
    } else if (!isValidIRI(stmt.object.id) && stmt.object.objectType !== 'StatementRef') {
        issues.push('Object.id must be a valid IRI.');
    }

    // Result checks
    if (stmt.result && stmt.result.score !== undefined) {
        const s = stmt.result.score.scaled;
        if (s !== undefined && (s < -1 || s > 1)) {
            issues.push('result.score.scaled must be between -1.0 and 1.0 (got ' + s + ').');
        }
    }

    // ID check
    if (stmt.id && !isValidUUID(stmt.id)) {
        issues.push('Statement id must be a valid Version 4 UUID.');
    }

    // Timestamp check
    if (stmt.timestamp && !isValidISO8601(stmt.timestamp)) {
        issues.push('timestamp must be a valid ISO 8601 string (e.g. 2024-09-15T14:23:10.000Z).');
    }

    return issues;
}

// ── Syntax-highlighted JSON renderer ──

function colorize(json) {
    return json
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"([^"]+)"(\s*:)/g, '<span class="jk">"$1"</span>$2')
        .replace(/:\s*"([^"]*)"/g, ': <span class="js">"$1"</span>')
        .replace(/:\s*(-?\d+(\.\d+)?)/g, ': <span class="jn">$1</span>')
        .replace(/:\s*(true|false)/g, ': <span class="jb">$1</span>')
        .replace(/:\s*(null)/g, ': <span class="jnl">$1</span>');
}

function updatePreview() {
    const stmt = buildStatement();
    const json = JSON.stringify(stmt, null, 2);
    document.getElementById('json-out').innerHTML = colorize(json);
    // Reset validation state
    const pill = document.getElementById('status-pill');
    pill.className = 'status-pill pill-idle';
    pill.textContent = 'Not validated';
    document.getElementById('issues-txt').textContent = '';
}

function runValidation() {
    const stmt = buildStatement();
    const issues = checkConformance(stmt);
    const pill = document.getElementById('status-pill');
    const txt = document.getElementById('issues-txt');
    if (issues.length === 0) {
        pill.className = 'status-pill pill-valid';
        pill.textContent = 'Conformant ✓';
        txt.textContent = 'All checks passed.';
        txt.style.color = '#86efac';
    } else {
        pill.className = 'status-pill pill-invalid';
        pill.textContent = issues.length + ' issue' + (issues.length > 1 ? 's' : '');
        txt.textContent = issues.join(' | ');
        txt.style.color = '#fca5a5';
    }
}

function copyJSON() {
    const stmt = buildStatement();
    const json = JSON.stringify(stmt, null, 2);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(json).then(() => {
            const btn = document.getElementById('copy-btn');
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = 'Copy JSON'; }, 1500);
        });
    }
    emitInteracted('copy_json');
}

function resetForm() {
    document.getElementById('ifi-type').value = 'mbox';
    document.getElementById('actor-mbox').value = 'mailto:learner@example.edu';
    document.getElementById('actor-name').value = '';
    document.getElementById('verb-select').value = 'http://adlnet.gov/expapi/verbs/experienced';
    document.getElementById('row-verb-custom').style.display = 'none';
    document.getElementById('obj-type').value = 'Activity';
    document.getElementById('obj-id').value = 'http://textbook.example.org/chapters/02-statement-model';
    document.getElementById('obj-name').value = '';
    ['r-success','r-fail','r-comp'].forEach(id => { document.getElementById(id).checked = false; });
    ['r-scaled','r-duration','ctx-platform','ctx-lang','ctx-parent'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('result-body').classList.remove('open');
    document.getElementById('ctx-body').classList.remove('open');
    document.querySelectorAll('.toggle-btn').forEach(b => b.textContent = '+ expand');
    document.getElementById('stmt-ts').value = nowISO();
    regenUUID();
    showHideIFI();
    updatePreview();
}

function regenUUID() {
    document.getElementById('stmt-id').value = genUUID();
    updatePreview();
}

function emitInteracted(action) {
    if (typeof window === 'undefined' || !window.XAPI_LRS) return;
    try {
        window.XAPI_LRS.send({
            actor: window.XAPI_LRS.actor || { mbox: 'mailto:reader@example.edu' },
            verb: { id: 'http://adlnet.gov/expapi/verbs/interacted', display: { 'en-US': 'interacted' } },
            object: {
                id: 'http://textbook.example.org/sims/xapi-statement-builder#' + action,
                definition: { name: { 'en-US': 'xAPI Statement Builder: ' + action } }
            },
            timestamp: new Date().toISOString()
        });
    } catch (e) {}
}

// ── Wire up all events ──

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UUID + timestamp
    document.getElementById('stmt-id').value = genUUID();
    document.getElementById('stmt-ts').value = nowISO();

    // Listen to all inputs
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });

    document.getElementById('ifi-type').addEventListener('change', () => {
        showHideIFI();
        updatePreview();
    });

    document.getElementById('verb-select').addEventListener('change', () => {
        const custom = val('verb-select') === '';
        document.getElementById('row-verb-custom').style.display = custom ? '' : 'none';
        updatePreview();
    });

    document.getElementById('r-success').addEventListener('change', () => {
        if (checked('r-success')) document.getElementById('r-fail').checked = false;
        updatePreview();
    });
    document.getElementById('r-fail').addEventListener('change', () => {
        if (checked('r-fail')) document.getElementById('r-success').checked = false;
        updatePreview();
    });

    document.getElementById('regen-btn').addEventListener('click', regenUUID);
    document.getElementById('validate-btn').addEventListener('click', runValidation);
    document.getElementById('copy-btn').addEventListener('click', copyJSON);
    document.getElementById('reset-btn').addEventListener('click', resetForm);

    showHideIFI();
    updatePreview();
});
