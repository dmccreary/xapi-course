// Service Worker Offline Queue Flow — click-to-explore Mermaid diagram
// CANVAS_HEIGHT: 540
// Bloom: Analyze (L4) — trace path of an offline statement back to LRS

const stepInfo = {
    Start: {
        title: 'Component calls xapiClient.send(stmt)',
        body: `
            <p>The application code emits a statement the same way regardless of network
            state. The xAPI client wraps the network and queue logic so callers don't
            have to think about connectivity.</p>
            <pre>xapiClient.send({
  actor: { mbox: 'mailto:lin@x.edu' },
  verb:  { id: '...experienced' },
  object: { id: '...page-3' }
});</pre>
            <p class="edges"><b>Edge case:</b> the caller should never await the network
            here — return as soon as the statement is durable on disk.</p>`
    },
    Online: {
        title: 'navigator.onLine?',
        body: `
            <p>Quick check via the browser API. If <code>true</code>, attempt a direct
            POST. If <code>false</code>, jump straight to the queue.</p>
            <p class="edges"><b>Edge case:</b> <code>navigator.onLine</code> can be a
            liar — it reports "online" if any network is reachable, even a captive portal
            with no internet. The POST step is the real test.</p>`
    },
    Post: {
        title: 'Attempt POST to LRS',
        body: `
            <p>Standard <code>fetch</code> to <code>/xapi/statements</code> with the
            statement(s) in the body. Use a short timeout (5–10s) so a slow link
            doesn't block the queue path.</p>
            <pre>const res = await fetch('/xapi/statements', {
  method: 'POST',
  headers: { 'X-Experience-API-Version': '1.0.3' },
  body: JSON.stringify(stmt),
  signal: AbortSignal.timeout(8000)
});</pre>`
    },
    Success: {
        title: 'HTTP 200?',
        body: `
            <p>2xx → done. 4xx → also done (don't retry malformed statements).
            5xx or network error → queue and retry later.</p>
            <p class="edges"><b>Edge case:</b> distinguish 4xx (client error, drop or
            log) from 5xx (server error, retry). Retrying a 400 forever is a footgun.</p>`
    },
    Queue: {
        title: 'Write statement to IndexedDB queue',
        body: `
            <p>Persist the statement to a local IndexedDB object store keyed by
            timestamp + statement id. Survives tab close, refresh, and reboot.</p>
            <pre>await db.statements.put({
  id: stmt.id,
  ts: Date.now(),
  body: stmt
});</pre>
            <p class="edges"><b>Edge case:</b> Safari's IndexedDB has had eviction
            quirks. Use storage estimation and fall back to localStorage if the
            quota is suspiciously small.</p>`
    },
    OnlineEvt: {
        title: 'window "online" event fires',
        body: `
            <p>The browser dispatches an <code>online</code> event when connectivity
            returns. The service worker (or page) listens and triggers a flush.</p>
            <pre>self.addEventListener('online', flushQueue);</pre>
            <p class="edges"><b>Edge case:</b> the event is unreliable on mobile.
            Also flush on app start, on visibilitychange (tab focused), and on a
            periodic timer.</p>`
    },
    Read: {
        title: 'Worker reads queue',
        body: `
            <p>Read up to <i>N</i> statements from the queue ordered by timestamp.
            Common batch sizes are 25–50 to balance throughput and latency.</p>
            <pre>const batch = await db.statements
  .orderBy('ts').limit(50).toArray();</pre>`
    },
    Flush: {
        title: 'POST batch to LRS',
        body: `
            <p>One HTTP request, many statements. The LRS accepts an array body and
            returns an array of statement IDs. Catastrophic failure → leave the batch
            in the queue and back off.</p>
            <pre>POST /xapi/statements
Content-Type: application/json
[ stmt1, stmt2, ... ]</pre>`
    },
    Remove: {
        title: 'Remove from queue',
        body: `
            <p>Only delete after the LRS confirms with 200. Use a transaction so the
            delete is atomic with any post-flush bookkeeping.</p>
            <p class="edges"><b>Edge case:</b> if the response is "partial" (some
            ids accepted, some rejected), only delete the accepted ones.</p>`
    },
    Loop: {
        title: 'Queue empty and online?',
        body: `
            <p>If the queue still has entries and we're still online, loop back and
            flush the next batch. Add a small delay between batches to avoid
            saturating the link.</p>
            <p class="edges"><b>Edge case:</b> if connectivity drops mid-flush, the
            next batch will fail and the loop exits naturally — pending entries
            wait for the next online event.</p>`
    },
    Done: {
        title: 'Done',
        body: `
            <p>The statement (or batch) has been successfully recorded by the LRS.
            From the learner's perspective, this is invisible — they never knew the
            network was down.</p>
            <p>That invisibility is the whole point of the offline queue: the
            learning experience never depends on the network being available at the
            instant the interaction happens.</p>`
    }
};

function showStep(key) {
    const data = stepInfo[key];
    if (!data) return;
    const html = `
        <div class="info-title">${data.title}</div>
        <div class="info-content">${data.body}</div>
    `;
    document.getElementById('info-display').innerHTML = html;
}

window.showStep = showStep;
