// Verb Selection Decision Tree
// CANVAS_HEIGHT: 1078
// Bloom: Evaluate (L5) — apply structured criteria to choose ADL vs extension vs custom verb
// Pattern: click-to-reveal branch detail (no animation; learner-paced)

const branchInfo = {
    Start: {
        title: 'New event to emit',
        body: `
            <p>You're instrumenting a new emit site — the textbook just gained a feature
            that should produce an xAPI statement, but you don't yet know which verb to
            use. This tree walks the four questions that, in order, give you a defensible
            answer.</p>
            <p>The order matters. Each later question costs more in governance,
            documentation, or training than the one before it.</p>`
    },
    D1: {
        title: 'Is there an ADL verb that fits?',
        body: `
            <p>The <a href="https://registry.tincanapi.com/" target="_blank">ADL verb
            registry</a> is the canonical source. Search it for a verb whose published
            <code>definition</code> matches the event's intent — not just a word that
            sounds right.</p>
            <p><b>Yes example:</b> a learner clicks "Submit" on a quiz → <code>completed</code>.
            ADL verb, exact match, done.</p>
            <p><b>No example:</b> a learner re-runs a MicroSim with new parameters. There's
            no ADL verb that means "tweaked the inputs and re-explored." Move to D2.</p>`
    },
    Out1: {
        title: 'Use ADL verb (done)',
        body: `
            <p>Stop here. You picked the verb whose semantics already match. No
            extensions, no profile work, no governance overhead. This is the cheapest
            outcome and should be the most common one.</p>
            <p>Most events in a typical textbook resolve to one of about a dozen ADL verbs:
            <code>experienced</code>, <code>completed</code>, <code>passed</code>,
            <code>failed</code>, <code>answered</code>, <code>attempted</code>,
            <code>asked</code>, <code>interacted</code>, and a handful more.</p>`
    },
    D2: {
        title: 'ADL verb + extension covers it?',
        body: `
            <p>An <a href="https://registry.tincanapi.com/" target="_blank">extension</a>
            adds a typed property under <code>result.extensions</code> or
            <code>context.extensions</code>. If you can capture the unique aspect of your
            event as a value rather than as a new verb, do it.</p>
            <p><b>Yes example:</b> "ran the simulation with parameter set X" →
            <code>experienced</code> + <code>context.extensions["…/parameter-set"]: X</code>.
            The verb stays generic; the specifics live in a structured extension.</p>
            <p><b>No example:</b> "the learner deliberately voided their last attempt and
            started over." That's not a sub-flavor of <code>experienced</code> — it's a
            different intent. Move to D3.</p>`
    },
    Out2: {
        title: 'Use ADL verb + extension (preferred)',
        body: `
            <p>This is the preferred path for any event that's a recognizable variation of
            an existing ADL verb. You get the verb-level interoperability ADL provides,
            plus the specificity your analytics need.</p>
            <p><b>Tip:</b> namespace your extension IRI under your project domain
            (e.g. <code>http://xapi-course.org/extensions/parameter-set</code>) so the
            extension is unambiguously yours and won't collide with someone else's.</p>`
    },
    D3: {
        title: 'Custom verb cost < cost of forcing ADL fit?',
        body: `
            <p>The honest cost-comparison question. A custom verb requires:</p>
            <ul style="margin-left:18px">
                <li>A definition published at a stable IRI</li>
                <li>An entry in the project profile</li>
                <li>Steward review (someone has to be the gatekeeper)</li>
                <li>Training: every author and analyst needs to know it exists</li>
            </ul>
            <p>If forcing an ADL verb to fit produces statements that mislead future
            analysts, the custom verb is cheaper. If forcing the fit just feels awkward
            to <i>you</i>, force the fit and add a comment.</p>`
    },
    Out3: {
        title: 'Force ADL fit (document the strain)',
        body: `
            <p>You couldn't justify the custom-verb investment. Pick the closest ADL verb
            and write a one-paragraph note in your emit-site documentation explaining
            <i>why</i> this verb is being used here despite imperfect semantic fit.</p>
            <p>The note matters more than the choice — future maintainers reading the
            statement stream will see the verb and wonder. The note answers them.</p>
            <p><b>Common shape:</b> use <code>experienced</code> when the event is a
            "the learner did a thing" event with no stronger semantics, and let
            <code>context</code> carry the specifics.</p>`
    },
    D4: {
        title: 'Already in project profile?',
        body: `
            <p>Before opening a PR for a new custom verb, search your project's profile
            (the JSON-LD published at your project's stable URL). Someone may have already
            added a verb that fits — defining the same verb twice fragments your
            vocabulary and confuses query authors downstream.</p>
            <p><b>Yes example:</b> the profile already defines
            <code>http://xapi-course.org/verbs/explored</code> for MicroSim
            re-runs. Use it.</p>`
    },
    Out4: {
        title: 'Use existing custom verb',
        body: `
            <p>The verb is already in the profile, defined, reviewed, and known to other
            authors. No new governance work — just reference it by IRI in your emit-site
            code.</p>
            <p><b>Trap to avoid:</b> don't re-import the verb's definition into your local
            module. Reference it by IRI only. The profile is the single source of truth;
            duplicating the definition into code creates drift.</p>`
    },
    Out5: {
        title: 'Open profile-update PR (steward review)',
        body: `
            <p>You've reached the "new custom verb" outcome. Open a profile-update PR
            with three things:</p>
            <ul style="margin-left:18px">
                <li>The proposed verb IRI under your project's namespace</li>
                <li>A definition (one paragraph) and a name</li>
                <li>At least one example statement that uses it</li>
            </ul>
            <p>The profile steward reviews for overlap with existing verbs, naming
            consistency, and the definition's clarity. Once merged, the verb is live —
            and the next person hitting D4 for a similar event will find it.</p>
            <p><b>Steward checklist:</b> does the new verb meaningfully differ from
            existing ones? Is the IRI stable? Will the definition still make sense
            in two years?</p>`
    }
};

function showInfo(id) {
    const info = branchInfo[id];
    const target = document.getElementById('info-display');
    if (!info || !target) return;
    target.innerHTML =
        '<div class="info-title">' + info.title + '</div>' +
        '<div class="info-content">' + info.body + '</div>';
}

window.showInfo = showInfo;
