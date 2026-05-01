// PII Surface in an xAPI Statement
// CANVAS_HEIGHT: 540
// Bloom: Analyze (L4) — identify PII regions and apply mitigations

const VIEWS = {
    default: {
        actor: `  "actor": {
    "name": "Maria Garcia",
    "mbox": "mailto:maria.garcia@high-school.edu"
  },`,
        verb: `  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/answered",
    "display": { "en-US": "answered" }
  },`,
        object: `  "object": {
    "id": "https://example.edu/quiz/q-37",
    "definition": { "type": "...interaction" }
  },`,
        result: `  "result": {
    "score":     { "scaled": 0.8 },
    "completion": true,
    "duration":   "PT24S",`,
        resultExt: `    "extensions": {
      "https://example.edu/ext/answer-text": "photosynthesis"
    }`,
        resultClose: `  },`,
        context: `  "context": {`,
        contextExt: `    "extensions": {
      "https://example.edu/ext/page-number": 14,
      "https://example.edu/ext/session-id": "abc123"
    }`,
        contextClose: `  }`
    },
    clean: {
        actor: `  "actor": {
    "account": {
      "homePage": "https://example.edu/learners",
      "name":     "lrn-9f8a32"
    }
  },`,
        verb: `  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/answered",
    "display": { "en-US": "answered" }
  },`,
        object: `  "object": {
    "id": "https://example.edu/quiz/q-37",
    "definition": { "type": "...interaction" }
  },`,
        result: `  "result": {
    "score":     { "scaled": 0.8 },
    "completion": true,
    "duration":   "PT24S"`,
        resultExt: ``,
        resultClose: `  },`,
        context: `  "context": {`,
        contextExt: `    "extensions": {
      "https://example.edu/ext/page-number": 14
    }`,
        contextClose: `  }`
    },
    worst: {
        actor: `  "actor": {
    "name":   "Maria Inez Garcia",
    "mbox":   "mailto:maria.garcia@high-school.edu",
    "openid": "https://google.com/profiles/12345",
    "account": {
      "homePage": "https://example.edu/learners",
      "name":     "12345"
    }
  },`,
        verb: `  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/answered",
    "display": { "en-US": "answered" }
  },`,
        object: `  "object": {
    "id": "https://example.edu/quiz/q-37",
    "definition": { "type": "...interaction" }
  },`,
        result: `  "result": {
    "score":     { "scaled": 0.8 },
    "completion": true,
    "duration":   "PT24S",`,
        resultExt: `    "extensions": {
      "https://example.edu/ext/answer-text": "photosynthesis",
      "https://example.edu/ext/keystrokes": [
        {"k": "p", "t": 1234}, {"k": "h", "t": 1456}, ...
      ],
      "https://example.edu/ext/free-response":
        "I think Maria's mom told me about ..."
    }`,
        resultClose: `  },`,
        context: `  "context": {`,
        contextExt: `    "extensions": {
      "https://example.edu/ext/page-number":  14,
      "https://example.edu/ext/session-id":   "abc123",
      "https://example.edu/ext/ip":           "67.42.18.5",
      "https://example.edu/ext/user-agent":   "Mozilla/5.0...",
      "https://example.edu/ext/geolocation":  { "lat": 44.97, "lon": -93.27 }
    }`,
        contextClose: `  }`
    }
};

const REGION_INFO = {
    actor: {
        risk: 'High',
        riskColor: '#dc2626',
        title: 'actor — direct identifier',
        risks: `<p><b>The highest-risk region.</b> Direct identifiers like
            <code>name</code>, <code>mbox</code>, and <code>openid</code> tie
            every statement to a real person. Even <code>mbox_sha1sum</code>
            is reversible if the attacker has a candidate email list.</p>`,
        mitigation: `<p><b>Mitigation:</b> use the <code>account</code> IFI
            with an opaque pseudonym. Hold the mapping in a separate,
            access-controlled service. Names belong in the registrar
            system, not in the LRS.</p>`,
        regs: 'FERPA (US K-12 / higher ed); GDPR Art. 4 (EU); state student-data privacy laws'
    },
    'result-ext': {
        risk: 'Medium',
        riskColor: '#ca8a04',
        title: 'result.extensions — depends on payload',
        risks: `<p>Extensions are open-ended. Free-text answers, keystroke
            traces, and verbatim student writing can carry indirect
            identifiers (mention of family, address, school name).</p>
            <p>The <i>structure</i> is fine; the <i>content</i> is the risk.</p>`,
        mitigation: `<p><b>Mitigation:</b> store outcomes (correct / not),
            not raw responses. If you must keep the response, redact
            named entities before storing. Apply per-extension retention
            policies (e.g., delete keystrokes after 30 days).</p>`,
        regs: 'FERPA (educational records); GDPR Art. 9 (special-category data); COPPA (under 13)'
    },
    'context-ext': {
        risk: 'Medium',
        riskColor: '#ca8a04',
        title: 'context.extensions — environmental PII',
        risks: `<p>Looks innocuous, but IP address, user agent, geolocation,
            and persistent session ids form a fingerprint. Combined with a
            cohort roster, they can re-identify a learner who used a
            pseudonym.</p>`,
        mitigation: `<p><b>Mitigation:</b> emit only what the analytics need.
            Drop IPs at the LRS edge. Truncate geolocation to city level.
            Rotate session ids per session, not per user.</p>`,
        regs: 'GDPR Art. 4(1) (online identifiers); CCPA (CA); state biometric laws'
    }
};

const PANEL = document.getElementById('json-panel');

function renderJSON(viewKey) {
    const v = VIEWS[viewKey];
    const lines = [];
    lines.push(`<div class="json-line"><span class="punc">{</span></div>`);
    lines.push(syntaxHighlight(`<div class="region actor" data-region="actor">${v.actor}</div>`));
    lines.push(syntaxHighlight(`<div class="json-line">${v.verb}</div>`));
    lines.push(syntaxHighlight(`<div class="json-line">${v.object}</div>`));
    lines.push(syntaxHighlight(`<div class="json-line">${v.result}</div>`));
    if (v.resultExt && v.resultExt.trim()) {
        lines.push(syntaxHighlight(`<div class="region result-ext" data-region="result-ext">${v.resultExt}</div>`));
    }
    lines.push(syntaxHighlight(`<div class="json-line">${v.resultClose}</div>`));
    lines.push(syntaxHighlight(`<div class="json-line">${v.context}</div>`));
    if (v.contextExt && v.contextExt.trim()) {
        lines.push(syntaxHighlight(`<div class="region context-ext" data-region="context-ext">${v.contextExt}</div>`));
    }
    lines.push(syntaxHighlight(`<div class="json-line">${v.contextClose}</div>`));
    lines.push(`<div class="json-line"><span class="punc">}</span></div>`);

    document.getElementById('json-panel').innerHTML = lines.join('');

    // Wire up region clicks
    document.querySelectorAll('.region').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.region').forEach(r => r.classList.remove('selected'));
            el.classList.add('selected');
            showRegion(el.dataset.region);
        });
    });
}

function syntaxHighlight(html) {
    // Apply key/string/number coloring inside the html block while preserving HTML tags
    return html.replace(/(&quot;|"[^"]*?")(\s*:)/g, '<span class="key">$1</span>$2')
               .replace(/:(\s*)("[^"]*?")/g, ':$1<span class="str">$2</span>')
               .replace(/:(\s*)(\d+(?:\.\d+)?|true|false|null)/g, ':$1<span class="num">$2</span>')
               .replace(/([{}\[\],])/g, '<span class="punc">$1</span>');
}

function showRegion(key) {
    const data = REGION_INFO[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML = `
        <span class="risk-tag" style="background:${data.riskColor}">${data.risk} risk</span>
        <div class="info-title">${data.title}</div>
        <div class="info-content">
            ${data.risks}
            ${data.mitigation}
        </div>
        <div class="meta-row" style="margin-top:8px"><span class="lbl">Regulations:</span><span class="val">${data.regs}</span></div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderJSON('default');
    document.querySelectorAll('.toolbar button').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.toolbar button').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            renderJSON(b.dataset.view);
            // keep selection if possible
        });
    });
});
