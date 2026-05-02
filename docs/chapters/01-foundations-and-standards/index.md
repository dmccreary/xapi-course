---
title: Foundations of xAPI and the Learning Standards Landscape
description: Introduces xAPI's history, the SCORM/AICC/CMI5/IMS family of standards, and how xAPI fits into the broader learning ecosystem.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 08:04:42
version: 0.08
---

# Foundations of xAPI and the Learning Standards Landscape

## Summary

Introduces xAPI's history, the SCORM/AICC/CMI5/IMS family of standards, and how xAPI fits into the broader learning ecosystem. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 10 concepts from the learning graph:

1. xAPI Standard Overview
2. Tin Can API History
3. SCORM 1.2
4. SCORM 2004
5. AICC Standard
6. CMI5 Profile
7. IMS Caliper
8. IMS LTI
9. IMS QTI
10. Learning Standards Ecosystem

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

!!! mascot-welcome "Hi! I'm Xavi."
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus waving hello">
    Welcome to *xAPI for Intelligent Textbooks*! I'm **Xavi**, (pronounced "ZAH-vee" <button type="button" onclick="document.getElementById('xavi-pronunciation-audio').play()" aria-label="Play pronunciation of Xavi" title="Play pronunciation" style="border:1px solid #888;background:#f4f4f4;border-radius:4px;padding:0 6px;cursor:pointer;font-size:0.9em;line-height:1.4;vertical-align:middle;">&#9658; Pronounce</button><audio id="xavi-pronunciation-audio" preload="auto" src="../../audio/xavi-pronunciation.mp3"></audio>) a curious octopus with eight tentacles, a small pair of round glasses, and an unshakable belief that **every interaction tells a story**. I'll be popping into the margins all the way through this book, but I do not show up randomly. I have exactly **six jobs**, and you'll learn to recognize me by which one I'm doing:

    1. **Welcome you** at the start of every chapter — that's what I'm doing right now.
    2. **Help you think things through** when an idea is the kind that rewards a moment of pause.
    3. **Give you tips** — the moves a working xAPI engineer would make that nobody writes down.
    4. **Warn you gently** about the places where smart students and smart projects get into trouble.
    5. **Encourage you** when a concept looks scary on first contact.
    6. **Celebrate with you** at the end of each chapter when you've earned it.

    That's it. If I'm not doing one of those six things, I'm not in the chapter. Let's send our first statement together!

## Your New Superpower

Most software watches what users *click*. xAPI watches what they **learn**. By the end of this book, you'll be able to instrument any digital experience — a quiz, a simulation, an interactive infographic, an embedded video, an AI tutor session — so that every meaningful interaction becomes a structured, queryable record. That capability is the difference between a textbook that *displays* content and a textbook that *understands* its readers.

This first chapter is about orientation. Before we write a single line of statement-building code, we need a map of the territory: where xAPI came from, what it competes with, what it cooperates with, and why a *Level 3 interactive intelligent textbook* — the kind that adapts, simulates, and tutors — is the ideal home for it. By the time you finish this chapter, when someone says "we use SCORM 2004 with a CMI5 profile that emits xAPI statements to a hosted LRS, and our LMS launches it via LTI," you'll know exactly what they mean. (And, more importantly, whether they're using all those acronyms correctly.)

## What xAPI Actually Is

The **Experience API**, or **xAPI**, is an open specification — published originally by the U.S. Advanced Distributed Learning (ADL) Initiative — for recording and exchanging records of learning experiences across systems. At its center is one beautifully small idea: any learning experience can be expressed as a sentence with three parts.

Before we look at the diagram below, let's name those three parts so they don't appear out of nowhere:

- **Actor** — *who* did the thing. A learner, a group, an automated agent. Identified by an email, an account in some system, or another stable identifier.
- **Verb** — *what* they did. A standardized action like `experienced`, `attempted`, `passed`, or `completed`. Verbs come from shared vocabularies so that two systems can agree on what `passed` means.
- **Object** — *what* they did it to. An activity, another person, a piece of content, anything that can be named with a unique identifier (an IRI, which is just a URL-shaped string).

A single record built from these three parts is called a **statement**. A statement can also carry optional pieces — a `result` (score, success, completion), a `context` (which course, which group, which platform), a `timestamp`, an `authority` (who vouches for the record), and so on — but the Actor-Verb-Object triple is the irreducible core. Everything else is decoration.

#### Diagram: The xAPI Statement Triple


<iframe src="../../sims/xapi-statement-triple/main.html" width="100%" height="512px" scrolling="no"></iframe>
[Run The xAPI Statement Triple Fullscreen](../../sims/xapi-statement-triple/main.html)

<details markdown="1">
<summary>The Actor / Verb / Object structure of an xAPI statement</summary>
Type: diagram
**sim-id:** xapi-statement-triple<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontally-oriented Mermaid flowchart that shows the three required parts of an xAPI statement as labeled boxes connected by arrows, with optional fields shown as a secondary cluster underneath.

Layout: three primary nodes laid out left-to-right — `Actor` (indigo fill, white text), `Verb` (teal fill, white text), `Object` (orange fill, white text). A subtitle under each node shows the question it answers: "Who?", "Did what?", "To what?". A second row of lighter-fill nodes labeled `Result`, `Context`, `Timestamp`, `Authority` connects upward into the main row with dashed lines, captioned "Optional but powerful."

Sample statement rendered in a panel on the right:
- Actor: `mailto:lin@example.edu`
- Verb: `http://adlnet.gov/expapi/verbs/passed`
- Object: `http://textbook.example.org/chapters/quadratics`
- Result: `{ "success": true, "score": { "scaled": 0.92 } }`

Learning objective (Bloom — Understand): Given an English description of a learning event, the reader can identify which English noun corresponds to the Actor, which verb corresponds to the Verb, and which target corresponds to the Object.

Required interactivity:
- Every node MUST have a Mermaid `click` directive: `click <nodeId> call showStatementPart("<part-name>")`. This includes the three required nodes (`Actor`, `Verb`, `Object`) and every optional-field node (`Result`, `Context`, `Timestamp`, `Authority`).
- Clicking a node MUST open a side-panel infobox containing: part name, whether it is required or optional, the question it answers in plain English, the data type, an example value pulled from the sample statement, and a one-paragraph definition aligned with the chapter glossary.
- Hovering a node MUST show a one-line tooltip with the part's plain-English role ("Actor — who did the thing").
- Clicking the connecting arrows MUST reveal an infobox describing the relationship ("the Actor performed the Verb on the Object").
- Opening any infobox MUST emit an xAPI `interacted` statement to the chapter's LRS, so the textbook itself demonstrates the standard it is teaching.

Sample infobox content (for `Verb`):
"**Verb** — Required. Identifies the action the actor performed. Always carries an IRI (a URL-shaped identifier) so two systems can agree on what the verb means. Optional `display` map provides human-readable labels in one or more languages. Example: `http://adlnet.gov/expapi/verbs/passed`."

Implementation: Mermaid `flowchart LR` with classDefs for the three primary node colors plus a dashed sub-cluster for optional fields. `click` directives wired to a JavaScript `showStatementPart(name)` function that reads from a JSON dictionary of part definitions and renders the infobox. Responsive width via `<div style="width:100%">` wrapper. Mascot color palette consistent with project CSS variables.
</details>

That triple — Actor, Verb, Object — is the entire conceptual foundation of xAPI. Every other capability in the specification (statement queries, agent profiles, document state, voiding, signed statements) is plumbing built around shipping these triples to a server that knows how to store and search them. That server is called a **Learning Record Store (LRS)**, and we'll meet it formally in Chapter 6. For now, picture it as a database with opinions.

!!! mascot-thinking "Why this model is so quietly powerful"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Xavi thinking">
    A statement is a *sentence*, not a row. That single design choice is what lets xAPI describe formal courseware, informal mentoring, simulations, AI-tutor turns, and physical-world activities (yes, even "Lin completed a CPR drill") in the same ledger. When the data model matches the way humans actually talk about learning, the analytics that follow get a lot more honest.

## A Quick Tour of the Tin Can Backstory

The phrase you'll hear from older practitioners is **Tin Can API**. That's the same thing as xAPI. Here's the short version of how the name happened.

In 2010, ADL — the same group inside the U.S. Department of Defense that originally shepherded SCORM — funded a research project at Rustici Software to ask, essentially, "What would the *successor* to SCORM look like?" The team interviewed dozens of practitioners and ran a public design process under the working name **Project Tin Can**, an affectionate nod to the children's "tin can telephone" metaphor: two tin cans connected by a string, sending messages back and forth. The point was that learning data ought to flow as easily between systems as a kid's voice flows down a string.

The first stable release shipped in April 2013 as **xAPI 1.0**, and the project was renamed to the **Experience API** for the formal specification. The "Tin Can API" name stuck around as the friendly, community-facing label — for years the tincanapi.com site was the most popular reference — so when a vendor's marketing copy says "Tin Can compatible," they mean xAPI compatible. ADL shepherded the specification through to **IEEE 9274.1.1**, ratified in October 2023, which graduated xAPI from a community spec into a formal IEEE standard.

Stewardship has since shifted. In December 2025, the **Institute for Infrastructure and Interoperable Data in Learning (I2IDL)** — an independent nonprofit based in Savage, Maryland — launched with an inaugural white paper to take over open-source stewardship of xAPI, the xAPI Profile Server, and the broader Total Learning Architecture (TLA) resources after changes at ADL left the community looking for a new home for these assets. I2IDL is explicit that it is *not* itself a standards body: the IEEE Learning Technology Standards Committee (LTSC) continues to own the published standards, while I2IDL maintains the open-source code, conformance test suites, and reference implementations the community depends on. In January 2026, I2IDL announced its inaugural 25+ member **Technical Steering Committee** — drawn from ADL, Rustici Software, the CERT Division at the Software Engineering Institute, the University of Florida, and other industry, academic, and government voices — to advise on conformance testing and open-source policy. The day-to-day name in textbooks, conferences, and product documentation is still xAPI; what changed is the door you knock on for the test suite, the profile server, and the verb registry.

#### Diagram: A Timeline of Learning Interoperability Standards


<iframe src="../../sims/learning-standards-timeline/main.html" width="100%" height="582px" scrolling="no"></iframe>
[Run A Timeline of Learning Interoperability Standards Fullscreen](../../sims/learning-standards-timeline/main.html)

<details markdown="1">
<summary>The major learning standards from 1988 to 2026, on a single horizontal timeline</summary>
Type: timeline
**sim-id:** learning-standards-timeline<br/>
**Library:** vis-timeline<br/>
**Status:** Specified

A horizontally scrollable vis-timeline showing the major milestones in computer-based-training and learning-data interoperability. Each event is a labeled bubble with a hover tooltip (consistent with the glossary, when available) and a link to the official spec.

Events (year, label, short description used in tooltip):

- 1988 — **AICC founded** — Aviation Industry CBT Committee forms; first cross-vendor CBT interoperability work.
- 1998 — **AICC HACP** — HTTP-AICC Communication Protocol; the first widely deployed "course-to-LMS" wire protocol.
- 2000 — **SCORM 1.0** — ADL releases the first version of the Sharable Content Object Reference Model.
- 2001 — **SCORM 1.2** — The release that actually saw mass adoption.
- 2004 — **SCORM 2004** — Adds sequencing/navigation; the most capable SCORM version.
- 2010 — **IMS LTI 1.0** — Learning Tools Interoperability launches; LMS-to-tool launch + roster.
- 2012 — **Project Tin Can** — Rustici/ADL design phase for the SCORM successor.
- 2013 — **xAPI 1.0** — Experience API published.
- 2014 — **IMS Caliper 1.0** — IMS Global publishes a competing learning-analytics standard.
- 2016 — **CMI5 1.0** — A profile that uses xAPI as the wire format inside an LMS launch flow.
- 2019 — **LTI Advantage** — IMS LTI 1.3 + extensions (Names & Roles, Assignments & Grades, Deep Linking).
- 2023 — **IEEE 9274.1.1** — xAPI ratified as an IEEE standard (October 2023).
- 2025 — **I2IDL founded** — The Institute for Infrastructure and Interoperable Data in Learning launches in December 2025 with an inaugural white paper, taking over open-source stewardship of xAPI, the xAPI Profile Server, and TLA reference implementations after changes at ADL.
- 2026 — **I2IDL Technical Steering Committee** — I2IDL announces its inaugural 25+ member TSC on January 30, 2026, drawn from ADL, Rustici Software, CERT/SEI, the University of Florida, and other industry, academic, and government voices, to advise on conformance testing and open-source policy.

Visual: groups colored by family — ADL (indigo), AICC (gray), IMS (teal), I2IDL (purple). Optional toggle to filter by family.

Learning objective (Bloom — Remember + Understand): The reader can place the major learning standards on a timeline and recognize which family each belongs to.

Required interactivity:
- Every event bubble MUST be clickable. Clicking opens an infobox panel below the timeline containing: full standard name, year, sponsoring organization, the problem it solved, the standard it succeeded (if any), the standard that succeeded it (if any), a one-paragraph plain-English description aligned with the chapter glossary, and a deep-link to the official spec.
- Hovering an event bubble MUST show a tooltip with the standard's full name and short description.
- The family-filter toggle is mandatory (not optional): the reader must be able to filter the visible bubbles by ADL / AICC / IMS / I2IDL family, and the toggle MUST be visible on first render.
- Clicking the timeline background between bubbles MUST do nothing (no accidental dismiss); only the explicit "close" affordance on the infobox closes it.
- Selecting any event MUST emit an xAPI `interacted` statement to the chapter's LRS, recording which standard the reader explored.
- The timeline MUST support keyboard navigation (left/right arrows step between events) for accessibility.

Sample infobox content (for `xAPI 1.0`):
"**xAPI 1.0** (2013) — Published by ADL. Generalized the SCORM completion/score paradigm into an Actor/Verb/Object statement model that can describe any learning experience, online or offline. Successor to: SCORM 2004. Succeeded by: xAPI 1.0.3 (the version this book targets) and ultimately IEEE 9274.1.1 (ratified October 2023). Open-source stewardship transitioned from ADL to I2IDL in December 2025. Spec: https://github.com/adlnet/xAPI-Spec"

Sample infobox content (for `I2IDL founded`):
"**I2IDL** (December 2025) — The Institute for Infrastructure and Interoperable Data in Learning is an independent, non-governmental, non-profit organization (Savage, Maryland) that maintains the open-source code, conformance test suites, profile server, and TLA reference implementations underlying xAPI and related learning-data standards. I2IDL is *not* itself a standards body — the IEEE LTSC continues to own the ratified standards. I2IDL was created in response to changes at ADL that left the community uncertain about the future of these open-source assets. Site: https://www.i2idl.org/"

Implementation: vis-timeline with `groups` for ADL/AICC/IMS, hover popups via `title`, click handler bound to `select` event that renders the infobox panel from a local JSON dictionary. Responsive width; collapses to a vertical timeline below 600px viewport width.
</details>

## The SCORM Family: How We Got Here

xAPI did not appear on a blank canvas. It was designed against the limitations of the standards that came before it, and you cannot fully appreciate xAPI without understanding what it was designed to *replace*. Three of those predecessors deserve your attention: AICC, SCORM 1.2, and SCORM 2004.

### AICC: The Quiet Granddaddy

The **Aviation Industry CBT Committee (AICC)** is the standard most working developers have never heard of, even though almost every later standard built on its ideas. AICC formed in 1988 to solve a brutally practical problem: airline pilots had to take the same recurrent training across multiple systems run by Boeing, Airbus, simulator vendors, and individual airlines, and none of those systems could share completion data with each other. AICC's working groups produced a series of guidelines (the "AGRs," or AICC Guidelines and Recommendations) that defined how a course could communicate with a host system over HTTP using a simple form-encoded protocol called **HACP (HTTP-AICC Communication Protocol)**.

AICC was the first standard to formalize the basic vocabulary that SCORM later inherited: a course launches inside a host LMS, the host gives the course a session, and the course reports back things like "lesson location," "lesson status," and "score." HACP is gone from new deployments, but if you ever maintain a long-lived corporate LMS — especially in regulated industries — you'll still find AICC content in the back catalog, and you'll be quietly grateful that the people who designed xAPI knew this history cold.

### SCORM 1.2: The One Everyone Actually Used

The **Sharable Content Object Reference Model (SCORM)** was ADL's effort to take the best of AICC, IMS Content Packaging, and a few other concurrent efforts and bundle them into a single reference model. **SCORM 1.2**, released in 2001, became the version that actually achieved mass adoption — to the point that "SCORM" without a version number almost always means 1.2 in casual usage.

The SCORM 1.2 wire model is browser-locked. A SCORM course is a ZIP file (called a Package Interchange File, or PIF) containing HTML, JavaScript, and a manifest. When the LMS launches the course, it loads the course inside an iframe and exposes a JavaScript API — the **SCORM Runtime API** — through which the course can call functions like `LMSInitialize()`, `LMSSetValue("cmi.core.lesson_status", "completed")`, and `LMSCommit()`. Everything the course wants to tell the LMS travels through that API.

That model has three serious limits. First, it requires the learner to be inside an LMS, in a browser, with the parent window holding the API stub. No mobile apps, no offline mode, no cross-device flow. Second, the data model is shallow — there are perhaps two dozen "CMI" data elements, mostly oriented around lesson status, score, and a small "interactions" array. Third, the only "verb" is, implicitly, "completed." There is no way to say "the learner *attempted* a problem and got it wrong on the second try after 47 seconds of thinking" without abusing the interactions array beyond recognition.

### SCORM 2004: Powerful and Unloved

**SCORM 2004** was ADL's attempt to fix the limits of SCORM 1.2. It added a far more sophisticated **sequencing and navigation** model (borrowed from IMS Simple Sequencing) that lets a course author describe rules like "the learner must pass module A before unlocking module B." It expanded the data model, added richer interaction types, and tightened conformance.

It was, by every technical measure, the better standard. It was also far more complex to author, far more complex to test, and far more sensitive to LMS implementation differences. The result was that many vendors continued shipping SCORM 1.2 content for years afterward because it "just worked," and SCORM 2004 became the standard everyone respected and few wanted to debug at 11 p.m. before a launch. The lesson — that elegance can lose to "boring works" — is one xAPI's designers took to heart.

The next two non-text elements compare these standards side by side. Before the table, here are the two evaluation axes that matter most for an intelligent-textbook context: **granularity** (how finely can the standard describe what happened?) and **portability** (does the data flow outside an LMS?).

| Standard | Year | Wire Format | Granularity | Portability | Typical Home |
|----------|------|-------------|-------------|-------------|--------------|
| AICC HACP | 1998 | HTTP form-POST | Low | LMS-only | Aviation/regulated training |
| SCORM 1.2 | 2001 | JS API in iframe | Low | LMS-only, browser-only | Corporate L&D back catalog |
| SCORM 2004 | 2004 | JS API in iframe | Medium | LMS-only, browser-only | Compliance / structured training |
| xAPI 1.0.3 | 2013 | REST/JSON statements | Very high | Anywhere with HTTP | Modern interactive content |
| CMI5 1.0 | 2016 | xAPI inside an LMS launch | High | LMS-launchable, statements anywhere | LMS-integrated modern courses |
| IMS Caliper 1.2 | 2020 | REST/JSON envelopes | High | Anywhere with HTTP | Higher-ed LMS analytics |

## CMI5: A Bridge Between Old and New

If xAPI is the open-ended successor and SCORM 2004 is the LMS-shaped predecessor, **CMI5** is the diplomat between them. CMI5 is a **profile on top of xAPI** — it doesn't invent a new wire protocol; it constrains how xAPI is used so that an LMS can launch a course, supply credentials, track a session lifecycle, and receive completion just like it always has, while the course gets to emit rich xAPI statements for analytics.

The lifecycle CMI5 defines is small but rigid: an LMS launches the course with a session token; the course sends a `launched` statement, then `initialized`, then any number of in-session statements, then either `passed`/`failed` and `completed`, then `terminated` (or `abandoned` if the session ended uncleanly). That session shape is what lets a SCORM-shaped LMS understand "did the student finish?" while the course itself is free to emit thousands of fine-grained statements during the session for the analytics layer.

For our purposes — Level 3 interactive intelligent textbooks — CMI5 is the standard you reach for when an LMS has to launch your textbook chapter as a course. We'll dig into the lifecycle details in Chapter 11 (Conformance and Comparison) and Chapter 8 (Implementing in Textbooks). For now it is enough to know what it is and that it exists to keep LMSs and modern xAPI content on speaking terms.

!!! mascot-tip "When to reach for CMI5"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Xavi giving a tip">
    Use CMI5 when an enterprise LMS — Cornerstone, SuccessFactors, Saba, etc. — needs to launch your textbook chapter as a tracked course. Use plain xAPI when the textbook is delivered directly via the open web or an institutional portal that does not require LMS launch semantics. Mixing the two is fine, but be explicit about which path each chapter uses.

## The IMS Family: Caliper, LTI, and QTI

xAPI's main standards-world peer is not SCORM — SCORM is a predecessor — but the family of standards published by **1EdTech**, the consortium formerly known as **IMS Global**. Three of those standards matter for intelligent textbooks: Caliper, LTI, and QTI. They are not interchangeable. Each solves a different problem, and a real-world textbook deployment usually touches at least two of them.

### IMS Caliper: The Other Analytics Standard

**IMS Caliper** is IMS Global's answer to xAPI: an open standard for emitting structured learning-event records to an analytics endpoint. The conceptual model rhymes with xAPI's — a Caliper *event* has an **actor**, an **action**, and an **object**, plus a context envelope — but the differences in design philosophy are large.

Caliper is more **prescriptive**: it ships with a small, fixed set of canonical event types (e.g., `AssessmentEvent`, `MediaEvent`, `NavigationEvent`, `ToolUseEvent`) and a tightly constrained vocabulary, on the theory that a constrained vocabulary produces more comparable analytics across institutions. xAPI, by contrast, is **permissive**: any IRI can name a verb or activity type, with shared vocabularies as conventions rather than constraints. Caliper has stronger native adoption inside higher-ed LMSs (Canvas and D2L Brightspace ship Caliper out of the box); xAPI has stronger adoption in corporate L&D, K–12 adaptive content, and bespoke intelligent textbooks. We'll do a structured side-by-side comparison in Chapter 11.

### IMS LTI: The Launch Layer

**IMS LTI (Learning Tools Interoperability)** solves a completely different problem — not analytics, but **launch and identity**. LTI is the standard that lets a learner click a link inside an LMS course (Canvas, Moodle, Blackboard, Brightspace) and have that click open an external tool — your textbook, a third-party simulator, a publisher-provided assignment — pre-authenticated, with the learner's identity, role, and (in newer versions) gradebook line item already wired up.

LTI 1.1 used OAuth 1.0a-signed POSTs and was widely deployed but limited. **LTI 1.3 / LTI Advantage** modernized the stack onto OpenID Connect and OAuth 2.0, and added formal services for **Names and Role Provisioning** (the roster), **Assignment and Grade Services** (gradebook write-back), and **Deep Linking** (letting an instructor pick a specific tool resource from inside the LMS). For an intelligent-textbook architecture, LTI is how the LMS hands the learner *off* to your textbook; xAPI is how your textbook reports *back* what happened during the session. They are complementary, not competing.

### IMS QTI: The Assessment Format

**IMS QTI (Question and Test Interoperability)** is the standard for representing **assessment items and tests** as portable, vendor-neutral XML. QTI defines item types (multiple-choice, multiple-response, fill-in, hotspot, drag-and-drop, ordering, essay, and many more), how rubrics and scoring are expressed, and how an item bank can be exchanged between authoring tools and delivery platforms. If your textbook needs to import quiz items from a publisher or export them to a school district's item-bank system, QTI is the wire format you'll meet. QTI does not say anything about *how* the item runs — that's the delivery engine's job — and it does not say anything about analytics. It is the *content* standard for assessments, where xAPI is the *behavior* standard.

#### Diagram: The Learning Standards Ecosystem


<iframe src="../../sims/learning-standards-ecosystem/main.html" width="100%" height="450px" scrolling="no"></iframe>
[Run The Learning Standards Ecosystem Fullscreen](../../sims/learning-standards-ecosystem/main.html)

<details markdown="1">
<summary>How AICC, SCORM, xAPI, CMI5, LTI, Caliper, and QTI fit together in a real deployment</summary>
Type: interactive infographic
**sim-id:** learning-standards-ecosystem<br/>
**Library:** vis-network<br/>
**Status:** Specified

An interactive vis-network graph that visualizes the full learning-standards ecosystem and shows which standards play together vs. which compete. Hover behavior shows a glossary-aligned definition for each node; clicking a node highlights its connected standards.

Nodes (with grouping color):

- **Content / packaging family** (gold): AICC, SCORM 1.2, SCORM 2004, QTI
- **Launch + identity family** (teal): LTI 1.1, LTI 1.3 / LTI Advantage
- **Behavior / analytics family** (indigo): xAPI, CMI5 (xAPI profile), IMS Caliper
- **Storage / infrastructure** (gray): LRS, LMS, Analytics platform

Edges (labeled):

- LMS — *launches* — SCORM 1.2 / SCORM 2004 / CMI5 / LTI tools
- LTI Tool — *can emit* — xAPI / Caliper
- CMI5 — *is a profile of* — xAPI
- SCORM 2004 — *successor to* — SCORM 1.2
- SCORM 1.2 — *evolved from* — AICC
- xAPI / Caliper — *delivered to* — LRS / Analytics platform
- QTI — *imported by* — LMS / authoring tools
- xAPI — *competes with* — Caliper (dashed edge)

Layout: vis-network `physics` with `barnesHut` solver, default edges slightly arrowed. Initial node Y offset of 10px on horizontally-aligned edges to avoid the vis-network edge-label rendering bug. Responsive width that triggers `network.fit()` on `resize`.

Learning objective (Bloom — Analyze): The reader can decompose a real intelligent-textbook deployment into the standards in play, identify which standards cooperate vs. compete, and predict which standard would be added to fill a missing capability.

Required interactivity:
- Every node MUST be clickable. Clicking a node dims unrelated nodes, highlights its direct neighbors, and opens a side-panel infobox containing: standard name, family, sponsoring organization, year of first release, the problem it solves, which standards it cooperates with, which standards it competes with, and a one-paragraph plain-English definition aligned with the chapter glossary.
- Every edge MUST be clickable. Clicking an edge MUST open an infobox describing the relationship (e.g., "*is a profile of*: CMI5 reuses xAPI's wire format and statement schema, but constrains how statements are used inside an LMS launch flow").
- Hovering a node MUST show a tooltip with the standard's full name and a one-line description.
- A "Show only what I emit" filter MUST be present and functional, hiding all nodes except the behavior/analytics family on demand.
- A family-filter legend MUST allow the reader to toggle each of the four families (content/packaging, launch/identity, behavior/analytics, storage/infrastructure) independently.
- Selecting a node MUST emit an xAPI `interacted` statement to the chapter's LRS, recording which standard the reader explored.
- Pan and zoom MUST be enabled (mouse wheel + drag), and a "Reset view" button MUST be present to return to the default layout.

Sample infobox content (for `CMI5 (xAPI profile)`):
"**CMI5** — Behavior/analytics family. Published by AICC (now part of 1EdTech) in 2016. A profile *on top of* xAPI that defines a strict session lifecycle (`launched` → `initialized` → `passed`/`failed` → `completed` → `terminated`), so an LMS can launch a course and know when it finished while the course itself emits rich xAPI statements. Cooperates with: xAPI, LMS launch protocols. Competes with: SCORM 2004 in modern deployments."

Implementation: vis-network with `groups` for the four families, hover tooltip via `title` HTML, click handlers on both nodes and edges, infobox rendered into a side panel. Responsive container; physics disabled after stabilization for a calm initial layout.
</details>

## Putting It All Together: The Learning Standards Ecosystem

The map above is the chapter's payoff. Each acronym you've met has a different job, and a serious intelligent-textbook architecture will use several of them at once without any of them stepping on each other:

- **LTI** lets the LMS launch the textbook with the learner's identity already attached.
- **xAPI** lets the textbook report fine-grained behavior — every interaction, every attempt, every read-and-think pause — to an LRS for analytics.
- **CMI5** wraps xAPI in an LMS-friendly session lifecycle when the LMS needs to know the learner "completed" the chapter.
- **QTI** is the import/export format for any quiz items the textbook borrows from a publisher's bank or a district's item store.
- **IMS Caliper** is the alternative behavior standard you may need to support in higher-ed Canvas/Brightspace deployments.
- **SCORM** is the legacy that earlier content was built in, and that newer content sometimes still has to coexist with for compliance or back-catalog reasons.

!!! mascot-encourage "If this feels like a lot of acronyms, you're paying attention"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Xavi encouraging">
    Nobody internalizes this map on the first read. The way it sticks is by *touching* each piece — installing an LRS, sending a real xAPI statement, configuring an LTI launch, reading a CMI5 session log. By Chapter 8 you'll have hands on most of these, and the diagram you just looked at will start feeling less like a forest and more like a map of your own neighborhood.

## What Just Became Possible

You came into this chapter as someone who wanted to instrument a textbook. You're leaving it with an actual mental model of the field. You can now:

- **Read a job posting** that says "experience with xAPI, Caliper, CMI5, and LTI" and know which of those terms describes analytics, which describes a launch protocol, and which describes an LMS-friendly profile of the first one.
- **Choose a stack** for a new intelligent-textbook project and explain why xAPI + LTI is the modern default — and when CMI5 or Caliper enter the picture instead.
- **Translate between worlds** — recognizing that a SCORM 2004 `cmi.completion_status = "completed"` is the legacy ancestor of an xAPI statement with `verb: "http://adlnet.gov/expapi/verbs/completed"` and a `result.completion: true`.
- **Spot the gaps** in someone else's architecture — for example, a system emitting xAPI statements but with no LRS to receive them, or an LTI launch with no analytics layer at all.

The next chapter dives into the **statement model** — the actual JSON shape of an xAPI statement, the rules for required and optional fields, and the first lines of code you'll write to construct one yourself.

## Where This Book Sits: The Five Levels of Intelligent Textbooks

Before we close the chapter, here is one more map worth committing to memory — the one that tells you what kind of textbook you're holding right now, and where it sits on the road to a fully autonomous AI tutor.

Intelligent textbooks fall into five levels, ordered by how much the book learns *about* the learner and how much it adapts in response. Each level is a strict superset of the one below it.

1. **Level 1 — Static.** Print or PDF. No interaction, no telemetry, no adaptation. About 90% of college textbooks still live here.
2. **Level 2 — Interactive.** Hyperlinks, embedded video, search, simple quizzes, and — most importantly for us — interactive MicroSims that respond to learner input.
3. **Level 3 — Adaptive.** The book changes what it shows you based on what you've done. Personalized pathways, performance-based content selection, concept-graph traversal. Requires a learning record store and the analytics layer to read it.
4. **Level 4 — Chatbot-augmented.** A conversational tutor — usually GraphRAG over an LLM — sits next to the content and answers questions in context.
5. **Level 5 — Autonomous AI.** Aspirational. The textbook generates lessons in real time from a deep model of what each learner knows, needs, and is ready for next.

#### Diagram: The Five Levels of Intelligent Textbooks

<iframe src="../../sims/book-levels/main.html" width="100%" height="500px" scrolling="no"
  style="overflow: hidden;"></iframe>

[Run the Book Levels MicroSim Fullscreen](../../sims/book-levels/main.html){ .md-button .md-button--primary }

Hover over each step to see what makes that level distinct, what it costs to build, and what privacy obligations come with it.

### So Where Is *This* Textbook?

This book is at **Level 2.99**. It is unapologetically a Level 2 interactive textbook — every diagram is clickable, every chart responds to hover, every MicroSim teaches by manipulation rather than illustration — but it is built with the bones of a Level 3 textbook already in place. That is what the *.99* is doing in the version number.

Concretely, every interactive element in this book — the statement-triple diagram you clicked earlier, the timeline of standards, the ecosystem map, the Five Levels MicroSim you just hovered over — was designed from day one to emit xAPI statements when wired to a learning record store. The clicks, the hovers, the panel-opens, the filter toggles, the "explored Level 3" event — all of those are first-class learning signals waiting for a destination. Drop in an LRS endpoint, configure an authorization header, and this textbook crosses into Level 3 the same afternoon. The instrumentation is already there; only the receiver is missing.

That is the superpower this chapter has been quietly preparing you to hand to the textbook itself. By the end of Chapter 8 you'll know exactly how to flip the switch.

!!! mascot-thinking "The 2.99 trick"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Xavi thinking">
    A textbook that *can* emit xAPI but isn't currently pointed at an LRS isn't a Level 3 textbook yet — but it also isn't a regular Level 2 textbook. It's *xAPI-ready*. That distinction matters for procurement, for IRB review, and for the conversation you'll have with your institution's privacy office before you ever turn the data collection on. Level 2.99 is a feature, not a half-measure: it lets the publisher ship without student-data obligations, and lets the adopting institution decide on its own timeline whether to cross into Level 3.

!!! mascot-celebration "You just leveled up!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating">
    You now have the **standards literacy** that distinguishes someone who can talk about xAPI from someone who can only talk *around* it. That literacy is the foundation everything else in this book sits on. In the next chapter we'll start writing real statements. Tentacles up!

[See Annotated References](./references.md)
