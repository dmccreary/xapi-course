---
title: DevTools-Driven xAPI Debugging Flow
description: DevTools-Driven xAPI Debugging Flow
status: scaffold
library: Mermaid
bloom_level: TBD
---

# DevTools-Driven xAPI Debugging Flow

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** Mermaid

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Monitoring, Observability, and xAPI Traffic Analysis](../../chapters/10-monitoring-and-observability/index.md).

```text
Type: workflow-diagram
**sim-id:** devtools-driven-xapi-debugging-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Applying):** Apply a structured debugging workflow that uses DevTools to localize an xAPI emit-path bug to the right layer (component, builder, transport, LRS).

**Diagram type:** Mermaid flowchart (TD direction). Click handlers on every node.

**Decision flow:**

1. Start: `Reported issue (no statements / wrong statements / rejected statements)`
2. Diamond: `Are statements visible in DevTools Network panel?` → No → `Bug is in component or client library — check console for errors` / Yes → next
3. Diamond: `Is the request body correct?` → No → `Bug is in statement builder — fix builder` / Yes → next
4. Diamond: `Is the response status 2xx?` → Yes → `Statement reached LRS — check LRS-side issues` / No → next
5. Diamond: `Is response status 4xx?` → Yes → `Read response body — fix client based on error` / No (5xx) → `LRS-side issue — check LRS logs`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with concrete DevTools steps and example error messages.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
```

## Related Resources

- [Chapter 10: Monitoring, Observability, and xAPI Traffic Analysis](../../chapters/10-monitoring-and-observability/index.md)
