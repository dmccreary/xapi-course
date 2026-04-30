# Chapters

This textbook is organized into 14 chapters covering 250 concepts from the learning graph.

## Chapter Overview

1. [Foundations of xAPI and the Learning Standards Landscape](01-foundations-and-standards/index.md) - Introduces xAPI's history, the SCORM/AICC/CMI5/IMS family of standards, and how xAPI fits into the broader learning ecosystem.
2. [The xAPI Statement Model: Actor, Verb, Object, Result, and Context](02-statement-model/index.md) - Walks through the core anatomy of an xAPI statement, the canonical fields, and the roles of Activity Provider, Learning Record Provider, and Activity Consumer.
3. [Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments](03-advanced-statement-structure/index.md) - Covers result fields, context activities, voiding semantics, sub-statements, attachments, extensions, and reusable statement patterns.
4. [Verb Vocabulary Design and the ADL Verb Registry](04-verb-vocabulary-design/index.md) - Teaches verb IRI namespacing, the ADL and tincan registries, custom verb profiles, and the canonical verbs used inside intelligent textbooks.
5. [Activities, Agents, and Learner Identity](05-activities-agents-identity/index.md) - Covers activity IRIs, activity types, agent and group objects, identifier forms, registration fields, and pseudonymization.
6. [Learning Record Store Architecture and Query Endpoints](06-lrs-architecture/index.md) - Examines LRS storage models, the core endpoints, concurrency, conflict resolution, query capability, and pagination.
7. [LRS Platforms, Authentication, and Hosting Models](07-lrs-platforms-and-auth/index.md) - Compares TRAX, Learning Locker, Ralph, and Watershed across hosted, self-hosted, and embedded models, plus authentication and access control.
8. [Implementing xAPI in Intelligent Textbooks](08-implementing-in-textbooks/index.md) - Hands-on JavaScript and TypeScript client library construction, MicroSim and quiz instrumentation, retry logic, error handling, and emission strategies.
9. [Bandwidth Optimization, Offline Queues, and Service Workers](09-bandwidth-and-offline/index.md) - Covers statement batching, payload minimization, delta encoding, IndexedDB and LocalStorage queues, service worker lifecycle, and bandwidth budgeting.
10. [Monitoring, Observability, and xAPI Traffic Analysis](10-monitoring-and-observability/index.md) - Uses DevTools, Charles Proxy, and mitmproxy with Observable and Grafana dashboards to capture, inspect, and visualize xAPI traffic.
11. [Synthetic Data Generation and AI-Assisted LRS Testing](11-synthetic-data-and-ai-testing/index.md) - Uses Claude Code to generate realistic learner cohorts, model archetypes, and validate statistical representativeness for load testing.
12. [Conformance Testing, Validation, and Competitive Standards Analysis](12-conformance-and-comparison/index.md) - CMI5 lifecycle, SCORM mappings, ADL conformance, validation, and head-to-head comparisons against IMS Caliper, SCORM 2004, CMI5, and proprietary SDKs.
13. [xAPI Pipeline Architecture, Vocabulary Profiles, and Production Readiness](13-pipeline-and-production/index.md) - Designs custom vocabulary profiles, the full xAPI pipeline, profile servers, security best practices, and production-readiness review.
14. [Privacy, Compliance, and Organizational Context](14-privacy-and-compliance/index.md) - FERPA, COPPA, GDPR, K-12, higher education, and corporate L&D contexts, with PII handling, anonymization, retention, RBAC, and LMS integration.

## How to Use This Textbook

The chapters are sequenced so that every concept's prerequisites have already been introduced in an earlier chapter. Readers new to xAPI should progress through the chapters in order. Practitioners with prior xAPI experience can use the chapter summaries and concept lists to jump directly to areas of interest.

---

**Note:** Each chapter lists the concepts it covers. Make sure to complete prerequisites before moving to advanced chapters.
