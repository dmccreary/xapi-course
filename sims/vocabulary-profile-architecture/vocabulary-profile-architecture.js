// Vocabulary Profile Architecture — click-to-explore Mermaid
// CANVAS_HEIGHT: 540
// Bloom: Understand (L2) — identify components of an xAPI vocabulary profile

const compInfo = {
    Profile: {
        title: 'Profile (JSON-LD document)',
        chapter: 'Ch 13.2',
        body: `<p>The umbrella document. A JSON-LD file at a stable URL
            that lists every verb, activity type, extension, and statement
            pattern your textbook uses.</p>
            <p>Acts as the contract between emitters and consumers — anyone
            who wants to interpret your statements reads the profile.</p>
            <pre>{
  "@context": "https://w3id.org/xapi/profiles/context",
  "id": "https://example.edu/xapi/profile/v1",
  "type": "Profile",
  "concepts": [...],
  "templates": [...],
  "patterns": [...]
}</pre>`
    },
    Verbs: {
        title: 'Verbs',
        chapter: 'Ch 4',
        body: `<p>The action vocabulary. Each verb is identified by an
            IRI. Mix canonical ADL verbs with project-specific verbs
            where the canonical set falls short.</p>
            <pre>{ "id": "http://adlnet.gov/expapi/verbs/experienced",
  "type": "Verb",
  "prefLabel": { "en": "experienced" } }</pre>`
    },
    Types: {
        title: 'Activity Types',
        chapter: 'Ch 5.4',
        body: `<p>The "what was the learner doing?" vocabulary. IRIs
            identifying types like <code>microsim</code>, <code>quiz</code>,
            or <code>chapter-section</code>.</p>
            <pre>{ "id": "https://example.edu/xapi/types/microsim",
  "type": "ActivityType",
  "prefLabel": { "en": "MicroSim" } }</pre>`
    },
    Ext: {
        title: 'Extensions',
        chapter: 'Ch 3.4',
        body: `<p>Custom JSON fields that don't fit the core schema.
            Each extension lives at its own IRI and ships with a JSON
            Schema describing its shape.</p>
            <pre>{ "id": "https://example.edu/xapi/ext/microsim-params",
  "type": "ContextExtension",
  "schema": { "type": "object", ... } }</pre>`
    },
    Patterns: {
        title: 'Statement Patterns',
        chapter: 'Ch 13.2',
        body: `<p>Approved <i>shapes</i> for statements — combinations of
            verb + activity type + extensions that the project promises
            to emit. Consumers can rely on these shapes when building
            queries.</p>
            <p>A pattern says "every time a learner finishes a quiz,
            this is exactly what the statement looks like."</p>`
    },
    Server: {
        title: 'Profile Server',
        chapter: 'Ch 13.3',
        body: `<p>The host that serves the profile JSON-LD at its stable
            URL. Must support content negotiation so consumers can ask
            for <code>application/ld+json</code> directly.</p>
            <p>Treat the URL like an API: never break or redirect it
            silently. Version with <code>/v1/</code>, <code>/v2/</code>
            in the path.</p>`
    }
};

function showComp(key) {
    const data = compInfo[key];
    if (!data) return;
    document.getElementById('info-display').innerHTML =
        `<div class="info-title">${data.title}</div>
         <div class="meta-row"><span class="lbl">Chapter:</span><span class="val">${data.chapter}</span></div>
         <div class="info-content">${data.body}</div>`;
}

window.showComp = showComp;
