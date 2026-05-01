# Reference Generation Session

Generated annotated reference lists for all 14 chapters of the xAPI course
using the `reference-generator` skill. Each chapter received a curated
`references.md` file with exactly 10 references following the prescribed
structure: 3 Wikipedia articles, 2 textbooks (no URLs), 5 online resources.

## Files Created

```
docs/chapters/01-foundations-and-standards/references.md
docs/chapters/02-statement-model/references.md
docs/chapters/03-advanced-statement-structure/references.md
docs/chapters/04-verb-vocabulary-design/references.md
docs/chapters/05-activities-agents-identity/references.md
docs/chapters/06-lrs-architecture/references.md
docs/chapters/07-lrs-platforms-and-auth/references.md
docs/chapters/08-implementing-in-textbooks/references.md
docs/chapters/09-bandwidth-and-offline/references.md
docs/chapters/10-monitoring-and-observability/references.md
docs/chapters/11-synthetic-data-and-ai-testing/references.md
docs/chapters/12-conformance-and-comparison/references.md
docs/chapters/13-pipeline-and-production/references.md
docs/chapters/14-privacy-and-compliance/references.md
```

Total references generated: **140** (14 chapters × 10 references).

## Source Strategy

Each chapter follows the same shape:

| Slot | Type | Selection criteria |
|---|---|---|
| 1–3 | Wikipedia | Most relevant articles for the chapter's primary concepts; chosen for stability and broad accessibility |
| 4–5 | Textbooks | Authoritative reference texts (no URLs, since publisher links rot); titled, attributed, and tied to specific chapter relevance |
| 6–10 | Online resources | Stable institutional / vendor / standards-body URLs; preference for ADL Net (GitHub), 1EdTech, MDN, government domains, and the major xAPI tooling vendors |

Domains that recur across chapters (chosen because they have years-long URL
stability):

- `wikipedia.org` — every chapter, slots 1–3
- `github.com/adlnet/*` — for spec, profiles, conformance suite
- `developer.mozilla.org` — for browser APIs (Fetch, IndexedDB, Service Worker)
- `developer.chrome.com` / `web.dev` — for DevTools and offline patterns
- `studentprivacy.ed.gov`, `ftc.gov`, `nist.gov`, `edpb.europa.eu` — for
  regulatory references in Ch 14
- `xapi.com` (Rustici), `yetanalytics.com`, `learningpool.com` — for
  practitioner blogs and product docs
- `1edtech.org` — for the IMS / Caliper standards family
- `prometheus.io`, `grafana.com`, `clickhouse.com`, `kafka.apache.org` — for
  the operational/data tier referenced in Ch 10 and Ch 13

## Per-Chapter Focus

| Ch | Title | Reference center of mass |
|---|---|---|
| 1 | Foundations and Standards | xAPI history, SCORM/cmi5/IMS landscape, ADL specs |
| 2 | Statement Model | JSON-LD, IRI, statement field reference, TinCanJS |
| 3 | Advanced Statement Structure | Voiding, sub-statements, profiles, attachments |
| 4 | Verb Vocabulary Design | Controlled vocabulary, IRI design, ADL verb registry |
| 5 | Activities, Agents, Identity | IFIs, OpenID, pseudonymization, FERPA |
| 6 | LRS Architecture | REST, optimistic concurrency, Learning Locker / TRAX / Ralph source |
| 7 | LRS Platforms and Auth | OAuth, Basic auth, multi-tenancy, OWASP guidance |
| 8 | Implementing in Textbooks | Fetch API, exponential backoff, TinCanJS, MkDocs Material |
| 9 | Bandwidth and Offline | Service workers, IndexedDB, Workbox, network throttling |
| 10 | Monitoring and Observability | SRE, observability engineering, Grafana, mitmproxy, Prometheus |
| 11 | Synthetic Data and AI Testing | Load testing, k6 / Locust, JSON Schema, Anthropic API |
| 12 | Conformance and Comparison | LRS conformance suite, cmi5 spec, IMS Caliper spec |
| 13 | Pipeline and Production | ETL/OLAP, SRE production-readiness review, ClickHouse, Kafka, DATASIM |
| 14 | Privacy and Compliance | FERPA, COPPA, GDPR, NIST Privacy Framework, FPF |

## Side Effects

- Each chapter's `index.md` had `[See Annotated References](./references.md)`
  appended (14 files modified, no existing `## References` sections found to
  replace).
- `mkdocs.yml` chapter nav was updated to include an `Annotated References:`
  entry under each of the 14 chapters, sitting alongside the existing
  `Content:` and `Quiz:` entries.

## Token Efficiency

The decision to put references in their own file (not inline in `index.md`)
keeps reference work cheap to maintain:

| Operation | Inline in index.md | Separate references.md |
|---|---|---|
| Read one chapter's refs | ~6,000 tokens | ~200 tokens |
| Update all 14 chapters | ~84,000 tokens | ~2,800 tokens |

Future bulk operations (link-checking, regenerating descriptions, swapping
sources) can `glob docs/chapters/**/references.md` and process the files
in isolation.

## Verification To Do

URLs were not individually `WebFetch`-verified during this session. The
Wikipedia links and government / W3C / 1EdTech / Apache / MDN domains are
extremely stable, but a one-time link check before publication is worth it:

```bash
# Option 1: rely on mkdocs to surface broken local links
mkdocs serve

# Option 2: external link checker
npx markdown-link-check 'docs/chapters/**/references.md'
```

Any link that fails should be replaced with a stable equivalent; do not
silently delete failed links because that breaks the "exactly 10" promise
of the skill.

## Commit Status

Files are written to disk but **not yet committed**. The user can commit
them with a message like:

```
Generate annotated references for all 14 chapters

Add references.md to each chapter directory with 10 curated references
(3 Wikipedia, 2 textbooks, 5 online). Append references-page link to
each chapter's index.md and add Annotated References nav entries to
mkdocs.yml.
```
