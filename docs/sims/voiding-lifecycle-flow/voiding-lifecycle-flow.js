// Voiding Lifecycle Flow
// CANVAS_HEIGHT: 938
// Bloom: Analyze (L4) — trace the temporal lifecycle of a voided statement
// Pattern: click-to-reveal step detail (no animation; learner-paced)

const stepInfo = {
    N1: {
        title: 'AP emits original',
        step: 'Step 1',
        body: `
            <p>The Activity Provider — your textbook, simulation, or quiz — emits a normal
            xAPI statement to the LRS. Nothing voiding-specific has happened yet; this is
            the statement that will <i>later</i> be discovered to be wrong.</p>
            <p>Note the <code>uuid=fd41…</code>. This is the statement's permanent
            identity. Voiding works by referencing this exact UUID later — there's no
            edit, no overwrite, no second chance to fix the original record.</p>
            <p><b>Why UUIDs matter here:</b> if the AP did not assign UUIDs at emit time
            and let the LRS generate them, voiding becomes operationally painful — the AP
            must remember a server-assigned ID it never controlled.</p>`
    },
    N2: {
        title: 'LRS stores original',
        step: 'Step 2',
        body: `
            <p>The LRS persists the statement. The original is now in durable storage,
            assigned <code>stored</code> and <code>authority</code> by the LRS, and
            visible to any client query.</p>
            <p>This is the moment after which "just don't send it" stops working as a
            correction strategy — the data is now the LRS's, and any cleanup has to go
            through the voiding mechanism.</p>`
    },
    N3: {
        title: 'Default query — original visible',
        step: 'Step 3',
        body: `
            <p>Any client running <code>GET /xAPI/statements?…</code> with default
            parameters will see this statement in the result set. Dashboards include it.
            Aggregations count it. Reports cite it.</p>
            <p>This is the "as long as nobody noticed the error" period. Time-of-check vs.
            time-of-correction problems start here — anyone who pulled a report between
            steps 2 and 5 has the wrong answer.</p>`
    },
    N4: {
        title: 'AP discovers error',
        step: 'Step 4',
        body: `
            <p>Out-of-band, the AP team discovers something is wrong with the statement
            from step 1. The error could be a wrong score, an actor mis-identified, an
            object pointing at the wrong activity — any reason a downstream consumer
            would be misled.</p>
            <p>Note: discovery is not part of the xAPI protocol. xAPI just provides the
            mechanism (<code>verb=voided</code>) to record the correction once you've
            decided it's needed. <i>Whether</i> to void is an editorial decision.</p>`
    },
    N5: {
        title: 'AP emits voiding statement',
        step: 'Step 5',
        body: `
            <p>The AP emits a <i>second</i> statement with:</p>
            <ul style="margin-left:18px">
                <li><code>verb = http://adlnet.gov/expapi/verbs/voided</code></li>
                <li><code>object = StatementRef { id: "fd41…" }</code></li>
            </ul>
            <p>The voiding statement is itself a permanent record. It does not delete the
            original — it <i>references</i> it and instructs the LRS to flag it. Both
            statements coexist in storage forever.</p>
            <p><b>Trap:</b> the voiding statement's <code>actor</code> should be a
            principal authorized to void this kind of record. Random clients voiding each
            other's statements is a vector for malicious cleanup.</p>`
    },
    N6: {
        title: 'LRS flags fd41…',
        step: 'Step 6',
        body: `
            <p>The LRS recognizes the voiding statement, validates that the referenced
            UUID exists, and sets an internal "voided" flag on statement <code>fd41…</code>.</p>
            <p>The original statement's bytes are <i>not</i> rewritten. The LRS keeps the
            original verbatim and uses the flag during query filtering. This is what
            makes voiding auditable — you can always reconstruct the pre-void state by
            ignoring the flag.</p>
            <p><b>Conformance test:</b> a conformant LRS must reject a voiding statement
            whose StatementRef points at a non-existent or already-voided UUID.</p>`
    },
    N7: {
        title: 'Default query — original filtered',
        step: 'Step 7',
        body: `
            <p>Now the same default query from step 3 returns a different answer:
            <code>fd41…</code> is filtered out. The voiding statement (step 5) is still
            visible — it's a normal statement, just one whose verb happens to be
            <code>voided</code>.</p>
            <p>Net effect: from a default-query perspective, the original record is
            "gone" — but its absence is itself documented by the voiding statement.
            Auditable correction without destructive deletion.</p>`
    },
    N8: {
        title: 'voided=true query — both visible',
        step: 'Step 8 (audit path)',
        body: `
            <p>An operator running an audit query — <code>GET /xAPI/statements?voided=true</code>
            or equivalent — sees both records. The original (now flagged) and the voiding
            statement that did the flagging.</p>
            <p>This is critical for compliance, debugging, and trust. xAPI lets you
            <i>correct</i> records without <i>erasing</i> them. Anyone investigating
            "why did this statement disappear from the dashboard?" can answer the
            question definitively.</p>
            <p><b>Operational note:</b> some LRSes also support <code>voided=true</code>
            on individual statement-id lookups, returning the flagged record even from a
            default query path. Check your LRS's docs.</p>`
    }
};

function showStep(id) {
    const info = stepInfo[id];
    const target = document.getElementById('info-display');
    if (!info || !target) return;
    target.innerHTML =
        '<div class="info-step">' + info.step + '</div>' +
        '<div class="info-title">' + info.title + '</div>' +
        '<div class="info-content">' + info.body + '</div>';
}

window.showStep = showStep;
