---
title: LRS Platforms, Authentication, and Hosting Models
description: A practitioner's tour of the actual LRS platforms in the market — TRAX, Learning Locker, Ralph, Watershed — across hosted, self-hosted, and embedded deployment models, plus the authentication mechanisms (Basic, OAuth 1.0a, token-based) and access-control patterns that make multi-tenant LRS deployments safe.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 11:52:00
version: 0.07
---

# LRS Platforms, Authentication, and Hosting Models

## Summary

Compares TRAX, Learning Locker, Ralph, and Watershed across hosted, self-hosted, and embedded models, plus authentication and access control. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. LRS Authentication
2. Basic Auth (xAPI)
3. OAuth 1.0a (xAPI)
4. Hosted SaaS LRS
5. Self-Hosted Open Source LRS
6. Embedded LRS
7. TRAX LRS
8. Learning Locker LRS
9. Ralph LRS
10. Watershed LRS
11. LRS Platform Comparison
12. Multi-Tenant LRS
13. LRS Access Control
14. Token-Based Authentication
15. Activity Provider Configuration
16. Statement Authority Configuration

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)
- [Chapter 6: Learning Record Store Architecture and Query Endpoints](../06-lrs-architecture/index.md)

---

!!! mascot-welcome "Welcome to Picking an LRS"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus inspecting cardboard boxes">
    Chapter 6 told you what an LRS *is*. This chapter tells you which LRS to *use*. There are roughly a dozen serious LRS platforms in the world — four matter for most decisions. Authentication options sound boring until you realize the wrong choice means your LRS credentials end up in your textbook's HTML source. We'll cover both, with strong opinions where strong opinions are warranted.

## Your New Superpower

By the end of this chapter, you'll be able to **pick a hosting model, a specific LRS platform, and an authentication scheme that match your deployment's scale, privacy posture, and budget — and defend that choice in a procurement meeting**. That's the kind of decision that gets made once and reverberates for years. Picking wrong doesn't just mean re-platforming; it means rebuilding the analytics layer, the auth layer, and possibly the privacy review.

You'll also be able to wire up Activity Provider configuration correctly: the LRS endpoint URL, the authentication credential, the statement authority. These are the four lines of code that get pasted into every project and changed almost never. Getting them right on day one is cheap; fixing them later is expensive.

## The Three Hosting Models

Every LRS deployment falls into one of three hosting models. The choice is the first decision you make, and it shapes every decision after it.

A **hosted SaaS LRS** is operated by a vendor who runs the LRS on their infrastructure and charges you (typically per-statement or per-learner) to use it. You hit a vendor URL with your statements, the vendor stores them, the vendor's dashboard tools query them. The model is "no servers, just a contract." The pioneer is Watershed; competitors include Veracity Learning's hosted tier and several smaller players.

A **self-hosted open source LRS** is operated by you, on your infrastructure, using LRS software you download and run. You hit your own URL, your own servers store the data, your own DBA worries about disk space. The model is "your data stays on your hardware." The major options are TRAX (PHP/Laravel), Learning Locker (Node.js, MongoDB-backed), and Ralph (Python, ClickHouse-backed).

An **embedded LRS** runs inside the same process or device as the Activity Provider. It's used when there's no network connection (offline simulators, kiosk-mode learning apps, military training environments) or when latency requirements demand local-only writes. The statements live on-device until they can be flushed to a central LRS, often using `IndexedDB` (Chapter 9) as the local store. Embedded LRSs are niche but real.

The hosting decision interacts with three constraints: data sovereignty (where can the data legally live?), scale (how many statements per second at peak?), and operational capacity (do we have the team to run a database?). Get those three right and the hosting model usually picks itself.

#### Diagram: Hosting Model Decision Tree

<details markdown="1">
<summary>Hosting Model Decision Tree</summary>
Type: workflow-diagram
**sim-id:** hosting-model-decision-tree<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Apply a structured decision process to choose between hosted SaaS, self-hosted open source, and embedded LRS for a given deployment scenario.

**Diagram type:** Mermaid flowchart (TD direction) with diamond decision nodes and rectangular outcome nodes. Click handlers on every node.

**Decision flow:**

1. Start: `New deployment`
2. Diamond: `Is the device often offline?` → Yes → `Embedded LRS (with sync to central)` / No → next
3. Diamond: `Does data sovereignty / regulation forbid third-party hosting?` → Yes → `Self-hosted open source` / No → next
4. Diamond: `Do we have ops capacity to run a database 24/7?` → No → `Hosted SaaS LRS` / Yes → next
5. Diamond: `Is the projected statement volume above 5k/sec sustained?` → Yes → `Self-hosted open source (Ralph or scaled Learning Locker)` / No → `Hosted SaaS or self-hosted (either fits)`

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox with a brief explanation, plus the typical platforms that match that branch.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
</details>

## The Platforms

Four platforms cover most deployments most of the time. The brief tour:

**TRAX LRS** is a self-hosted open source LRS written in PHP (Laravel framework), backed by MySQL or PostgreSQL. It's free, well-maintained, and easy to install — the "fits in a single Docker container" LRS that schools and small districts adopt. It's not the highest-throughput option in the field, but it covers the spec faithfully and has a low operational cost. Use TRAX when you need a self-hosted LRS for a single school or a small department, you have basic LAMP-stack ops capacity, and your peak ingestion is in the hundreds-per-second range.

**Learning Locker LRS** is a self-hosted open source LRS originally written by HT2 Labs (now part of Learning Pool), written in Node.js with a MongoDB backend. It has a richer admin UI than TRAX, better multi-tenancy support, and a longer track record at scale — multi-million-statement deployments are common. The trade-off is operational complexity: Node + MongoDB + Redis + Elasticsearch in production is more moving parts to keep alive. Use Learning Locker when you need multi-tenant support, custom dashboards, or scale into the low millions of statements per day.

**Ralph LRS** is a newer self-hosted open source LRS written in Python (FastAPI), backed by ClickHouse (a columnar OLAP database) for statement storage. Ralph is purpose-built for very high ingestion rates and very large historical volumes — the kind of deployment where statement counts are in the billions. It's the modern choice for state- or country-scale education deployments. Use Ralph when your scale targets are above the comfort zone of the older platforms or when you want a Python ecosystem for the analytics layer.

**Watershed LRS** is the original hosted SaaS LRS, operated by Watershed (the company, formerly tied to Saba). It's commercial, mature, and has the deepest dashboard tooling of any LRS in the market. The trade-off is that you're committing to a vendor, and pricing is per-statement above generous thresholds. Use Watershed when you want hosted SaaS with strong analytics out of the box and your enterprise has the budget.

These four cover roughly 80% of real-world deployments. There are others — Veracity Learning, GrassBlade, RISC's LRS — that fit niches the four don't. The pattern is the same: pick the platform that matches your hosting model, scale, and budget, and don't over-engineer for hypothetical futures.

## Platform Comparison

The four platforms aren't interchangeable. Here are the dimensions that actually matter when you're choosing between them. Read this as a summary of the prose above, not the introduction:

| Platform         | Hosting model        | Backend            | Peak ingestion sweet spot  | Multi-tenant?   | Pricing               |
|------------------|----------------------|--------------------|----------------------------|-----------------|-----------------------|
| TRAX             | Self-hosted          | MySQL / PostgreSQL | 10s – 100s stmt/sec        | Limited         | Free (open source)    |
| Learning Locker  | Self-hosted          | MongoDB / Redis    | 100s – low 1000s stmt/sec  | Yes (built-in)  | Free + paid support   |
| Ralph            | Self-hosted          | ClickHouse         | 1000s – 10000s stmt/sec    | Yes (built-in)  | Free (open source)    |
| Watershed        | Hosted SaaS          | (vendor-managed)   | Enterprise scale           | Yes (account-based) | Per-statement above thresholds |

The dimension that surprises new teams: **MongoDB-backed LRSs and ClickHouse-backed LRSs are good at very different queries**. MongoDB excels at single-statement lookups and small per-learner queries; ClickHouse excels at aggregate queries across millions of statements. If your dashboard needs are mostly per-learner, Learning Locker is fine. If they're mostly cohort-wide aggregates, Ralph is dramatically faster. Match the engine to the query shape.

#### Diagram: LRS Platform Comparison Card Grid

<details markdown="1">
<summary>LRS Platform Comparison Card Grid</summary>
Type: interactive-infographic
**sim-id:** lrs-platform-comparison-card-grid<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare the four major LRS platforms across multiple dimensions and select the appropriate platform for a given deployment scenario.

**Layout:** A 2×2 grid of cards on the left (2/3) representing TRAX, Learning Locker, Ralph, Watershed; a side panel on the right (1/3) showing the selected card's detail.

**Each card shows:**

- Platform name in a header bar
- Hosting-model badge (Self-hosted / Hosted SaaS)
- A 5-axis radar chart with axes: ingestion ceiling, query speed, operational complexity, multi-tenant maturity, dashboard depth
- A one-line summary

**Side panel shows:** When-to-use guidance, when-not-to-use cautions, an example deployment scenario, and the canonical install or signup link.

**Interaction:**

- Hover or click a card to update the side panel
- Three preset scenario buttons across the top — "Single school," "State-wide assessment platform," "Corporate L&D" — that highlight the recommended platform and update the side panel with deployment-specific reasoning

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the cards, the radar charts, and selection state; HTML overlay for the side panel and preset buttons.
</details>

## LRS Authentication

**LRS authentication** is how the LRS verifies that the client posting statements is actually allowed to. Every conformant LRS supports at least one authentication scheme; most production LRSs support several. The xAPI 1.0.3 spec mandates support for HTTP Basic Auth and recommends OAuth 1.0a; modern LRSs typically also offer token-based authentication as a non-standard extension.

Before we walk through each option, the framing. **Authentication is one of the few places where the xAPI spec is genuinely showing its age.** OAuth 1.0a hasn't been the right answer in production HTTP since around 2015. Basic Auth over HTTPS is fine for backend-to-backend calls but a disaster when credentials end up in browser-shipped JavaScript. Token-based auth is what most teams actually use, even though it's not formally part of the spec. We'll cover all three honestly.

**Basic Auth (xAPI)** is HTTP Basic authentication: a username and password, base64-encoded into an `Authorization: Basic <token>` header on every request. It's simple, supported everywhere, and entirely fine *when the credential never reaches the browser*. The right pattern for Basic Auth is a backend proxy: the textbook's frontend POSTs to your backend, your backend authenticates against the LRS using stored credentials, your backend forwards the statement. Basic Auth credentials should never appear in browser-shipped JavaScript.

```
POST /xAPI/statements
Authorization: Basic dXNlcjpwYXNz   ← base64 of "user:pass"
Content-Type: application/json
X-Experience-API-Version: 1.0.3

{ "actor": ..., "verb": ..., "object": ... }
```

**OAuth 1.0a (xAPI)** is the older OAuth flavor that the xAPI spec recommends for browser-based emit paths. It uses cryptographic signatures rather than transmitting a shared secret on every request, which means credentials don't leak the same way Basic Auth does when the request is captured. OAuth 1.0a is, however, painful to implement correctly — the signature math is fussy, the timestamp and nonce requirements trip up beginners, and almost no popular HTTP library has first-class OAuth 1.0a support in 2026. Most teams that try it end up moving to token-based auth instead. Implementations exist (the `oauth-1.0a` npm package is the standard), but you'll spend a day getting the first call to work.

**Token-based authentication** is the pattern most production deployments actually use. The LRS issues an opaque bearer token (typically tied to a specific Activity Provider configuration), and the client sends it in an `Authorization: Bearer <token>` header. Tokens can be scoped, rotated, and revoked centrally. They can be short-lived if you want them to be. They work cleanly with browser-shipped code because the token can be issued per-session by your backend at page-load time. This is not part of the xAPI 1.0.3 spec, but every major LRS supports it as an extension and most teams adopt it for browser-emitting deployments.

```
POST /xAPI/statements
Authorization: Bearer ekx-7c2e1d4f-3a9b-8f1e-...
Content-Type: application/json
X-Experience-API-Version: 1.0.3
```

#### Diagram: Authentication Scheme Comparison

<details markdown="1">
<summary>Authentication Scheme Comparison</summary>
Type: interactive-infographic
**sim-id:** authentication-scheme-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare HTTP Basic, OAuth 1.0a, and token-based authentication across security posture, browser-safety, implementation cost, and revocation support, and pick the appropriate scheme for a deployment scenario.

**Layout:** Three side-by-side columns, one per scheme; a side panel on the right showing the selected scheme's detail.

**Each column shows:**

- Scheme name in a header bar (Basic / OAuth 1.0a / Token-based)
- A security badge (Yellow: Basic, Green-with-caveat: OAuth, Green: Token)
- A 4-axis bar chart: browser-safe, implementation effort, revocation, spec-mandated
- A one-line summary

**Side panel shows:** When-to-use guidance, the canonical request example, common pitfalls, and a one-line note on how the scheme is typically configured in each of the four major LRS platforms.

**Interaction:**

- Hover or click a column to update the side panel
- Toggle "Show common pitfall" — overlays the column with a callout about the most frequent implementation mistake for that scheme

**Default canvas:** 1000×550px, responsive.

Implementation: p5.js for the column rendering, bar charts, and selection state; HTML overlay for the side panel.
</details>

## Multi-Tenant LRS and Access Control

A **multi-tenant LRS** is an LRS that serves multiple logically-isolated customers (tenants) from a single deployment. Each tenant has its own statements, its own credentials, its own admin users, and its dashboards see only its own data. The LRS enforces the boundary; tenants cannot see each other's statements no matter what queries they construct.

Multi-tenancy matters because most real-world deployments are multi-tenant whether the team initially realized it or not. A district-wide LRS is multi-tenant: each school is a tenant, and Roosevelt High's data must not leak to Lincoln High. A vendor-hosted LRS is multi-tenant by construction. A consortium LRS shared by three universities is multi-tenant. If you skip multi-tenancy at design time, you're often re-architecting in year two.

**LRS access control** is the policy mechanism that decides which authenticated identities can do what. The dimensions:

- **Per-endpoint access** — some identities can write but not read (Activity Providers); some can read but not write (dashboard users); some can do both (admins).
- **Per-tenant scope** — within a multi-tenant deployment, an identity is bound to one or more tenants and cannot operate outside them.
- **Per-statement filters** — some identities (analytics roles) may be restricted to seeing only de-identified or aggregated data; the LRS strips PII before returning.

The mechanisms vary by platform. Learning Locker has a built-in multi-tenancy model with stores (tenants), client credentials per store, and role-based access for users. Ralph implements multi-tenancy via separate ClickHouse databases per tenant and OAuth2 scopes mapped to tenant access. Watershed uses an account model with role-based dashboards. TRAX is the simplest — historically single-tenant — and is being extended for multi-tenant use cases.

## Activity Provider Configuration

**Activity Provider configuration** is the small bundle of settings that tells the AP how to talk to an LRS. The minimum:

- **LRS endpoint URL** — the base path including `/xAPI/`, e.g., `https://lrs.example.org/xAPI/`
- **Authentication credential** — the chosen scheme's secret (token, Basic credentials, OAuth keys)
- **xAPI version** — typically `1.0.3`, used in the required `X-Experience-API-Version` header

In production deployments, AP configuration also includes:

- Batch size limit (max statements per POST), typically negotiated with the LRS team
- Retry policy (when to retry on 5xx, max attempts, backoff schedule — Chapter 9)
- Statement authority configuration (next section)

Configuration belongs in environment variables or a runtime configuration service, never in source code. Hardcoding the LRS URL and credentials into the textbook's JavaScript bundle is the most common avoidable mistake — and the most common reason LRS credentials end up in public Git history.

```javascript
// xapi/client-config.js — pulled from environment at build time
export const xapiConfig = {
  endpoint: import.meta.env.XAPI_ENDPOINT,    // https://lrs.example.org/xAPI/
  authToken: import.meta.env.XAPI_TOKEN,      // bearer token, fetched from backend
  version: "1.0.3",
  batchSize: 25,
  retryAttempts: 5
};
```

The bearer token in this example is *not* a long-lived secret; it's a short-lived token issued by your backend at the start of each session. The long-lived credential lives only on the backend, where it's never shipped to the browser.

## Statement Authority Configuration

The `authority` field of a statement (Chapter 2) names the entity that vouches for the statement's truth. **Statement authority configuration** is the policy that determines which authority the AP claims when emitting statements.

In most deployments, the LRS sets the authority itself, based on the credentials used to authenticate the request. The AP doesn't need to set it explicitly. This is the right default — it ties every statement to the credential that posted it, which is exactly the audit trail you want.

In some advanced deployments (multi-tenant LRSs, statement re-emission pipelines, statement importers from legacy systems), the AP needs to claim a specific authority that's distinct from its credential identity. The AP includes an explicit `authority` block in the outgoing statement, and the LRS validates that the credential is permitted to make that claim. This is where the **Statement Authority Configuration** policy becomes consequential — get it wrong and you've forged your own audit trail.

The default rule for new deployments: don't set `authority` explicitly; let the LRS attach it. Revisit only when you have a specific multi-tenant or re-emission use case.

!!! mascot-thinking "Xavi's Insight — Authority Belongs to the LRS"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Xavi pondering authority semantics">
    The authority field exists so a future analyst can answer "who was vouching for this when it was written?" If you set authority client-side, you're claiming the answer is *you* — the textbook code. That's almost never what you want. Let the LRS attach authority based on credentials. Then "who vouches for this" becomes "the credential that authenticated the POST," which is reliable, auditable, and not subject to client tampering.

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 8.

- You can name the three hosting models and the constraints that decide between them.
- You can describe what TRAX, Learning Locker, Ralph, and Watershed each do well and where each falls short.
- You can pick an authentication scheme appropriate to a given emit context (browser vs. backend) and explain why Basic credentials should not ship to the browser.
- You can describe what a multi-tenant LRS isolates between tenants and why getting multi-tenancy right early matters.
- You can sketch an Activity Provider configuration that doesn't leak credentials and that pulls secrets from the environment.
- You can articulate why statement authority should usually be set by the LRS rather than the client, and the rare cases where setting it client-side is correct.

!!! mascot-celebration "The Stack Is Picked"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating a chosen platform">
    You can now pick a hosting model, a platform, and an auth scheme — and explain the trade-offs to a procurement committee. That's the foundation for everything in the next part of the book. Chapter 8 turns from infrastructure to instrumentation: how to wire xAPI emit calls into a real intelligent textbook without scattering boilerplate across every component.

[See Annotated References](./references.md)
