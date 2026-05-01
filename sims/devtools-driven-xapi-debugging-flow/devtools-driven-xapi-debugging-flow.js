// DevTools-Driven xAPI Debugging Flow — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Apply (L3) — apply a structured DevTools debugging workflow

const stepInfo = {
    Start: {
        title: 'Reported issue',
        body: `<p>The bug usually shows up as one of three reports:</p>
            <ul style="margin-left:18px">
              <li>"No data showing up in the dashboard"</li>
              <li>"Statements look weird"</li>
              <li>"LRS is rejecting our requests"</li>
            </ul>
            <p>Don't trust the report's framing — work the flow and let the
            evidence point at the layer.</p>`
    },
    Q1: {
        title: 'Are statements visible in DevTools Network panel?',
        body: `<p>Open DevTools → Network → filter by <code>statements</code>.
            Reproduce the action that should emit a statement.</p>
            <p>If you see no request at all, the component never called the
            client — the bug is upstream of the network. If you see requests,
            the client is wired up; move on.</p>`
    },
    NoNet: {
        title: 'Bug is in the component or client library',
        body: `<p>Check the Console tab for thrown errors. Common causes:</p>
            <ul style="margin-left:18px">
              <li>Event handler never bound</li>
              <li>Client called with bad arguments and threw silently</li>
              <li>Conditional that suppresses the call (<code>if (debug) ...</code>)</li>
              <li>Service worker swallowed the request</li>
            </ul>
            <p>Set a Console breakpoint at the emit site and step through.</p>`
    },
    Q2: {
        title: 'Is the request body correct?',
        body: `<p>Click the request → Payload tab. The body should be a valid
            xAPI statement.</p>
            <pre>{ "actor": { "mbox": "..." },
  "verb":  { "id": "..." },
  "object":{ "id": "..." } }</pre>
            <p>Check IFI shape, verb IRI, and object id. Missing or malformed
            fields point at the statement builder.</p>`
    },
    BadBody: {
        title: 'Bug in the statement builder',
        body: `<p>Most builder bugs fall into three buckets:</p>
            <ul style="margin-left:18px">
              <li>Wrong field names (<code>mailbox</code> instead of <code>mbox</code>)</li>
              <li>Stringified objects instead of nested ones</li>
              <li>Missing required IRI on verb or object</li>
            </ul>
            <p>Write a unit test that asserts the JSON structure of the built
            statement so this can't regress.</p>`
    },
    Q3: {
        title: 'Is response status 2xx?',
        body: `<p>Click the request → Headers/Response. Look at status code.</p>
            <p><b>2xx</b> means the LRS accepted the statement and stored it.
            If the dashboard still doesn't show it, the bug is in query / aggregation,
            not the emit path.</p>`
    },
    Reached: {
        title: 'Statement reached the LRS',
        body: `<p>Investigate further upstream:</p>
            <ul style="margin-left:18px">
              <li>Is the dashboard query filter excluding it?</li>
              <li>Is your reporting tool reading from a stale replica?</li>
              <li>Is there a transform/ETL step between LRS and dashboard?</li>
            </ul>`
    },
    Q4: {
        title: 'Is response status 4xx?',
        body: `<p>4xx = client error (we sent something invalid).
            5xx = server error (LRS-side problem).</p>
            <p>The response body usually tells you exactly which field
            was wrong — read it before guessing.</p>`
    },
    Client4xx: {
        title: 'Read the response body, fix the client',
        body: `<p>Common 4xx causes:</p>
            <ul style="margin-left:18px">
              <li><code>400</code> — malformed JSON or schema violation</li>
              <li><code>401</code> — missing or expired auth token</li>
              <li><code>403</code> — credentials valid but lack write scope</li>
              <li><code>409</code> — duplicate statement id (idempotency)</li>
            </ul>
            <p>Fix the client; the LRS is telling the truth.</p>`
    },
    LRS5xx: {
        title: 'LRS-side issue — check LRS logs',
        body: `<p>5xx errors are the LRS's problem to solve, but you can help:</p>
            <ul style="margin-left:18px">
              <li>Capture the request id from response headers</li>
              <li>Send the LRS team the timestamp and request id</li>
              <li>Confirm whether the issue is intermittent or constant</li>
            </ul>
            <p>While the LRS is unhealthy, your client should queue and retry
            (see Chapter 9's offline queue).</p>`
    }
};

function showStep(key) {
    const data = stepInfo[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML =
        `<div class="info-title">${data.title}</div>
         <div class="info-content">${data.body}</div>`;
}

window.showStep = showStep;
