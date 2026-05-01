---
title: Statement Query and Pagination Flow
description: Interactive Mermaid flowchart of the client-side loop for paginated xAPI statement queries.
status: built
library: Mermaid
bloom_level: "Apply"
bloom_verb: Trace
---

# Statement Query and Pagination Flow
<iframe src="main.html" width="100%" height="562" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Learning Objective

Trace the round-trip flow of a paginated statement query, identifying when
the client should follow the `more` URL and when to stop.

- **Bloom Level:** Apply
- **Bloom Verb:** Trace
- **Library:** Mermaid

## About This MicroSim

The xAPI Learning Record Store paginates statement queries — even a modest
filter can match more results than fit comfortably in a single HTTP response.
The contract is small but easy to misread: the LRS returns a
`StatementResult` object containing `statements` and a `more` field. If
`more` is the empty string, you have everything. If `more` is a non-empty
relative URL, fetch it and repeat.

This MicroSim renders that loop as a clickable flowchart. Click any node to
see what the client is doing at that step, including a one-line TypeScript
snippet that maps the diagram step to actual code. A side branch from
**Process statements array** to **Hand off to dashboard / aggregation**
reminds the reader that the loop and the data destination are different
control flows — the dashboard does not block the next page fetch.

## How to Use

1. Click **Build initial GET** and read what filters belong on the first request.
2. Walk through the loop in order: **Send GET**, **Decision**, **Process**, **Send GET more URL**.
3. Pay special attention to the **Decision** node — that "non-empty string" check is the single condition that separates "keep going" from "we're done."
4. Click **Hand off to dashboard / aggregation** last. Notice it's a dashed
   side branch, not part of the loop.

## Iframe Embed Code

```html
<iframe src="https://dmccreary.github.io/xapi-course/sims/statement-query-pagination-flow/main.html"
        height="562"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification is extracted from
[Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md).

```text
Type: workflow-diagram
Library: Mermaid
Status: Built

Learning objective (Bloom — Applying): Trace the round-trip flow of a
paginated statement query, identifying when the client should follow the
`more` URL and when to stop.

Diagram type: Mermaid flowchart (TD direction) representing the client-side
loop. Click handlers on every node.

Structure:
1. Start: Client builds initial GET with filters
2. Action: Send GET /xAPI/statements?...
3. Decision diamond: Response has non-empty more URL? -> No -> Done
4. From Yes -> Process statements array
5. -> Send GET more URL -> loop back to decision

Side branch from "Process statements array" to "Hand off to dashboard /
aggregation" indicates the data destination, not the loop.
```

## Related Resources

- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../../chapters/06-lrs-architecture/index.md)
