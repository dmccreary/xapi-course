// Instructional Design Feedback Loop — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Create (L6) — trace the full learner-to-content feedback cycle

const stageInfo = {
    Use: {
        title: 'Learners use textbook (cohort N)',
        role: 'Learners',
        cadence: 'Continuous (per-session)',
        body: `<p>The starting point of the loop. Each session generates
            interactions: pages read, MicroSims explored, quizzes attempted,
            sections completed.</p>
            <p>This is also the only step the learner is conscious of.
            Everything downstream is invisible to them.</p>`
    },
    Emit: {
        title: 'xAPI statements emitted to LRS',
        role: 'Client library / pipeline',
        cadence: 'Real-time (per-interaction)',
        body: `<p>Each interaction becomes an xAPI statement and lands in
            the LRS. From here, the data is available for analytics.</p>
            <p>The pipeline guarantees the data <i>exists</i>; it makes
            no claim about whether it's <i>useful</i>. That depends on
            verb choice and context discipline upstream.</p>`
    },
    Agg: {
        title: 'Analytics aggregations',
        role: 'Data engineering / analytics',
        cadence: 'Hourly to daily refresh',
        body: `<p>Statements are rolled up into the metrics designers
            actually look at: completion rate per chapter, struggle
            density per concept, time-on-task per section, drop-off
            rates between sections.</p>`
    },
    Review: {
        title: 'Dashboards reviewed by instructional designers',
        role: 'Instructional designers / authors',
        cadence: 'Weekly to monthly',
        body: `<p>The human-judgment step. Designers read the dashboards
            looking for unexpected patterns: "Why is section 4 taking
            twice as long as section 3?" "Why is the failure rate on
            quiz 7 so high in cohort 4 but not 3?"</p>
            <p>The dashboard is a starting point for hypotheses, not a
            list of decisions.</p>`
    },
    Prior: {
        title: 'Findings prioritized for content changes',
        role: 'Editorial team + designers',
        cadence: 'Per editorial cycle (monthly)',
        body: `<p>Not every signal becomes a change. Designers triage:</p>
            <ul style="margin-left:18px">
              <li>Quick wins (clarify wording on a confusing question)</li>
              <li>Medium efforts (rebuild a confusing MicroSim)</li>
              <li>Strategic shifts (reorder chapters, add prerequisites)</li>
            </ul>`
    },
    Update: {
        title: 'Content updated in next release',
        role: 'Authors / editors / engineers',
        cadence: 'Per release (monthly to quarterly)',
        body: `<p>The fix lands in the textbook. Cadence depends on
            release process — daily for live deploys, monthly for
            curriculum-aligned releases.</p>
            <p>This is also where you make sure the change is
            <i>measurable</i>: emit verbs that let the next cohort's
            data answer "did the fix work?"</p>`
    },
    Next: {
        title: 'Learners use textbook (cohort N+1)',
        role: 'Learners (next cohort)',
        cadence: 'Per academic cycle',
        body: `<p>The cycle repeats. The next cohort experiences the
            improved content; their xAPI signal feeds back into the
            same loop.</p>
            <p>This is the difference between an intelligent textbook
            and a static one: the textbook gets smarter every cycle
            because the data tells it where to improve.</p>`
    }
};

function showStage(key) {
    const data = stageInfo[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML =
        `<div class="info-title">${data.title}</div>
         <div class="meta-row"><span class="lbl">Role:</span><span class="val">${data.role}</span></div>
         <div class="meta-row"><span class="lbl">Cadence:</span><span class="val">${data.cadence}</span></div>
         <div class="info-content">${data.body}</div>`;
}

window.showStage = showStage;
