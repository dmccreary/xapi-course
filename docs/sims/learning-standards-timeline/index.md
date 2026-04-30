---
title: A Timeline of Learning Interoperability Standards
description: A Timeline of Learning Interoperability Standards
status: scaffold
library: vis-timeline
bloom_level: TBD
---

# A Timeline of Learning Interoperability Standards

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** vis-timeline

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../../chapters/01-foundations-and-standards/index.md).

```text
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
```

## Related Resources

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../../chapters/01-foundations-and-standards/index.md)
