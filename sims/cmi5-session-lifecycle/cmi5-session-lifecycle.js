// cmi5 Session Lifecycle — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Understand (L2) — recall cmi5 session states and legal transitions

const stateInfo = {
    Launch: {
        title: 'LMS launches AP',
        body: `<p>The Learning Management System opens the Assignable Unit
            (AP) with cmi5-defined launch parameters in the URL: <code>endpoint</code>,
            <code>fetch</code>, <code>actor</code>, <code>registration</code>,
            and <code>activityId</code>.</p>
            <p>This is the only step that's URL-driven — everything after
            uses the auth token to talk to the LRS.</p>`
    },
    Auth: {
        title: 'AP fetches auth token',
        body: `<p>The AP exchanges the one-time <code>fetch</code> URL for an
            auth token used on every subsequent xAPI request. The fetch URL
            is single-use; if you lose the token, the session is dead.</p>
            <pre>POST /xapi/fetch?... → 200 { "auth-token": "..." }</pre>`
    },
    Launched: {
        title: 'AP emits launched',
        body: `<p>First xAPI statement of the session. Confirms to the LMS
            and LRS that the AP successfully started.</p>
            <p><b>Verb IRI:</b></p>
            <span class="info-iri">http://adlnet.gov/expapi/verbs/launched</span>
            <pre>{ "actor": ..., "verb": { "id": ".../launched" },
  "object": { "id": "ap-activity-id" } }</pre>`
    },
    Init: {
        title: 'AP emits initialized',
        body: `<p>Second statement — the AP is fully ready and the learner
            has begun. Distinguishes "loaded but didn't start" from
            "actually started." Required by cmi5.</p>
            <p><b>Verb IRI:</b></p>
            <span class="info-iri">http://adlnet.gov/expapi/verbs/initialized</span>`
    },
    Learn: {
        title: 'Learning statements',
        body: `<p>The body of the session. Any of:</p>
            <ul style="margin-left:18px">
              <li><code>progressed</code> — partial completion</li>
              <li><code>passed</code> / <code>failed</code> — outcome</li>
              <li><code>completed</code> — finished, regardless of outcome</li>
              <li>scored statements — numeric result</li>
            </ul>
            <p>Order is not enforced by cmi5; only that they fall between
            <code>initialized</code> and <code>terminated</code>/<code>abandoned</code>.</p>`
    },
    Q: {
        title: 'Did AP close cleanly?',
        body: `<p>Decision point. If the AP shuts down through its normal
            exit path, it sends <code>terminated</code> itself. If the
            learner closes the tab or the AP crashes, the LMS will emit
            <code>abandoned</code> server-side after a timeout.</p>
            <p>Either way, the session ends with a single closing
            statement — never both.</p>`
    },
    Term: {
        title: 'AP emits terminated',
        body: `<p>The AP closed cleanly. This statement is the AP's
            "I'm done" signal. After it, the AP must not emit further
            statements for this session.</p>
            <p><b>Verb IRI:</b></p>
            <span class="info-iri">http://adlnet.gov/expapi/verbs/terminated</span>`
    },
    Aban: {
        title: 'abandoned (server-side)',
        body: `<p>The LMS waits for a configured timeout, then emits
            <code>abandoned</code> on the AP's behalf. Reports it in
            place of <code>terminated</code> in completion roll-ups.</p>
            <p><b>Verb IRI:</b></p>
            <span class="info-iri">https://w3id.org/xapi/adl/verbs/abandoned</span>
            <p><b>Footgun:</b> a flaky AP that crashes mid-session looks
            identical to a learner who closed the tab. Distinguish them
            with the AP's own crash logs, not just xAPI.</p>`
    },
    End: {
        title: 'Session ends',
        body: `<p>The cmi5 state machine terminates. The LMS records the
            session as completed-with-outcome (or abandoned) and unlocks
            the next AP in the structure.</p>
            <p>The full verb sequence written to the LRS for one clean
            session: <code>launched → initialized → ... learning verbs ...
            → terminated</code>.</p>`
    }
};

function showState(key) {
    const data = stateInfo[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML =
        `<div class="info-title">${data.title}</div>
         <div class="info-content">${data.body}</div>`;
}

window.showState = showState;
