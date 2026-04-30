# Concept Taxonomy

This taxonomy organizes the 250 xAPI course concepts into 12 categories. Each
category has a 3–5 letter abbreviation (TaxonomyID) used in
`learning-graph.csv` and the generated learning graph JSON.

## Categories

### Foundations of xAPI and Learning Standards (FOUND)

Foundational concepts about the xAPI standard, its history, the broader
learning-standards landscape (SCORM, AICC, IMS), and the high-level positioning
of xAPI relative to other specifications. These concepts form the entry point
for the entire course.

### xAPI Statement Model (STMT)

Concepts that describe the structure and semantics of xAPI statements
themselves: Actor / Verb / Object / Result / Context, statement IDs, voiding,
sub-statements, attachments, extensions, references, and statement patterns.

### Verb and Vocabulary Design (VERB)

Concepts about the xAPI verb system, ADL verb registry, tincan vocabulary,
custom verb profiles, IRI namespaces, vocabulary design, and the canonical
verbs used inside intelligent textbooks.

### Activity, Agent, and Identity (ACTID)

Concepts about activities, activity types, activity IRIs, registration,
agents, groups, identifier forms (mbox / mbox_sha1sum / openid / account),
and learner identity management including pseudonymization.

### Learning Record Store Architecture (LRSA)

LRS architecture and infrastructure: storage models, endpoints (`/statements`,
`/agents`, `/activities`, `/state`, `/about`), concurrency, conflict
resolution, scalability, multi-tenancy, query capability, request logs, and
endpoint configuration.

### LRS Platforms and Authentication (LRSP)

Concrete LRS platforms (TRAX, Learning Locker, Ralph, Watershed), hosting
models (SaaS, self-hosted, embedded), authentication mechanisms (Basic Auth,
OAuth 1.0a, token-based), platform comparison, and access control.

### Implementation in Intelligent Textbooks (IMPL)

Applying xAPI inside Level 3 interactive intelligent textbooks: instrumenting
MicroSims / quizzes / adaptive branching, JavaScript client library design,
TypeScript type definitions, statement construction, retry logic, server-side
vs client-side emission, debugging, and error handling.

### Bandwidth and Network Optimization (BAND)

Bandwidth-reduction patterns and offline behavior: statement batching,
HTTP/2 multiplexing, payload minimization, delta encoding, selective
verbosity, bandwidth budget calculation, offline statement queues with
IndexedDB / LocalStorage, service workers, background sync, sync strategies,
and queue flushing.

### Monitoring and Observability (MON)

Capturing and analyzing xAPI traffic: browser DevTools, Charles Proxy,
mitmproxy, network waterfall analysis, payload inspection, real-time
dashboards (Observable Framework, Grafana), engagement heatmaps, statement
throughput, server log analysis, and pipeline failure / latency analysis.

### Synthetic Data and AI-Assisted Testing (AID)

Using Claude Code and similar generative AI tools to produce realistic xAPI
datasets, model learner archetypes, simulate cohorts, run LRS load and stress
tests, and validate statistical representativeness.

### Conformance, Validation, and Standards Comparison (CONF)

xAPI conformance, the ADL conformance test suite, statement structure /
required-field / data-type validation, version negotiation, backwards
compatibility, profile servers, profile validation, and competitive analysis
of xAPI against IMS Caliper, SCORM 2004, CMI5, and proprietary SDKs (CMI5
mappings, SCORM mappings, vendor lock-in, TCO).

### Privacy, Compliance, and Organizational Context (PRIV)

Regulatory and organizational concerns: FERPA, COPPA, GDPR, K-12 / higher-ed /
corporate L&D contexts, data governance, PII concerns, anonymization, data
minimization, retention, LRS privacy controls, RBAC, LMS integration (Canvas,
Moodle), HTTPS, security best practices, learning analytics, and
instructional-design feedback loops.
