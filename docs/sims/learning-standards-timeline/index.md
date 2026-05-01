---
title: A Timeline of Learning Interoperability Standards
description: An interactive vis-timeline of major learning-data standards from AICC (1988) through I2IDL (2026), with click-to-reveal infoboxes and family filtering.
image: /sims/learning-standards-timeline/learning-standards-timeline.png
og:image: /sims/learning-standards-timeline/learning-standards-timeline.png
status: built
library: vis-timeline
bloom_level: Remember + Understand
---

# A Timeline of Learning Interoperability Standards

An interactive timeline that places the major standards of computer-based
training and learning-data interoperability — AICC, SCORM, LTI, xAPI,
Caliper, CMI5, IEEE 9274.1.1, and I2IDL — on a single horizontal axis,
color-coded by the family that sponsors them.

<iframe src="main.html" width="100%" height="582" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }
[View the Raw Timeline Data](timeline.json){ .md-button }

## Overview

This MicroSim is the chapter-1 anchor for the standards landscape. xAPI did
not appear on a blank canvas — it inherited a vocabulary (lesson_status,
score, completion) from AICC, took a wire-protocol lesson from SCORM, and
now lives alongside IMS Caliper, IMS LTI, and CMI5 in a real-world textbook
deployment. The timeline lets the reader see all of those pieces at once,
filter by sponsoring family, and click any event to read the problem it
solved and the standard it succeeded.

## Embedding This MicroSim

To embed this timeline in another page, use:

```html
<iframe src="../../sims/learning-standards-timeline/main.html"
        width="100%" height="582" scrolling="no"></iframe>
```

Adjust the relative path based on the depth of the embedding page.

## Learning Objective

The reader can place the major learning standards on a timeline and recognize
which family each belongs to.

- **Bloom Level:** Remember + Understand (L1 + L2)
- **Bloom Verb:** place / recognize
- **Library:** vis-timeline 7.x

## Features

### Interactive Elements

- **Click any event** — opens an infobox below the timeline with the full
  standard name, year, sponsoring organization, the problem it solved, the
  standard it succeeded (if any), the standard that succeeded it (if any),
  a plain-English description, and a deep-link to the official spec.
- **Hover any event** — shows a quick tooltip with the standard's name and
  short description.
- **Family filter** — five buttons (All / ADL / AICC / IMS / I2IDL) limit the
  visible bubbles to one family at a time. The active family is highlighted.
- **Keyboard navigation** — left/right arrow keys step through events in
  chronological order. Selecting via keyboard scrolls the timeline to keep
  the focused event in view.
- **Pan and zoom** — use the &#9664; / &#9654; buttons to pan, + / &minus; to
  zoom, or **Fit All** to reset to the full range. Horizontal mouse-wheel
  also pans; vertical wheel scrolls the page (no scroll hijacking).
- **xAPI emission** — selecting any event emits an `interacted` xAPI
  statement. The chapter's host page can capture this via a
  `window.xapiSend()` function; in standalone mode, statements are logged
  to the browser console.

### Visual Design

- Color-coded by family — **ADL** (indigo), **AICC** (gray),
  **IMS** (teal), **I2IDL** (purple).
- Edge-event padding ensures the 1988 and 2026 events render cleanly without
  clipping.
- Infobox uses an explicit close button; clicking the empty timeline does
  *not* dismiss the infobox.

## How the xAPI Statement Looks

When the learner clicks the **xAPI 1.0** event, the sim emits roughly:

```json
{
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/interacted",
    "display": { "en-US": "interacted" }
  },
  "object": {
    "id": "https://dmccreary.github.io/xapi-course/sims/learning-standards-timeline#xapi-10",
    "definition": {
      "name": { "en-US": "xAPI 1.0" },
      "description": { "en-US": "Experience API published." },
      "type": "http://adlnet.gov/expapi/activities/interaction"
    }
  },
  "result": {
    "extensions": {
      "https://dmccreary.github.io/xapi-course/extensions/family": "ADL",
      "https://dmccreary.github.io/xapi-course/extensions/year":   2013
    }
  }
}
```

A real chapter wraps this with the actor and a context envelope before
sending it to the LRS — see Chapter 3 for the actor/verb/object essentials.

## Data Structure

The events live in `timeline.json`. Each event carries:

| Field | Purpose |
|-------|---------|
| `id` | Stable identifier (used in xAPI object ID and DOM lookups) |
| `year` | Used to position the event on the axis |
| `headline` | Short label rendered inside the bubble |
| `family` | One of `ADL`, `AICC`, `IMS`, `I2IDL` — controls the color |
| `sponsor` | Full name of the sponsoring organization |
| `short` | Tooltip text (one sentence) |
| `problem` | The problem the standard set out to solve |
| `successor_of` | Standard this one succeeded (or `null`) |
| `succeeded_by` | Standard that succeeded this one (or `null`) |
| `description` | Full plain-English paragraph for the infobox |
| `spec_url` | Deep link to the official spec or canonical source |

## Customization

### Adding a new event

1. Open `timeline.json`.
2. Append a new event object to the `events` array with all fields above.
3. Reload — the new bubble appears, color-coded by `family`.

### Changing family colors

Edit the `FAMILY_COLORS` object near the top of
`learning-standards-timeline.js` and the matching `.vis-item.family-*`
rules in `style.css`.

## Lesson Plan

| Step | Activity | Time |
|------|----------|------|
| 1 | Show the full timeline; ask learners to identify the longest gap | 2 min |
| 2 | Filter to **ADL** only; ask why SCORM 2004 was followed by Tin Can | 3 min |
| 3 | Filter to **IMS**; contrast LTI's launch focus with Caliper's analytics focus | 3 min |
| 4 | Click **xAPI 1.0** and **IEEE 9274.1.1**; discuss community-spec → IEEE-standard graduation | 3 min |
| 5 | Click **I2IDL founded**; explain the open-source-stewardship handoff from ADL | 3 min |

## References

- [vis-timeline Documentation](https://visjs.github.io/vis-timeline/docs/timeline/)
- [xAPI Specification (ADL)](https://github.com/adlnet/xAPI-Spec)
- [IEEE 9274.1.1 — xAPI](https://standards.ieee.org/ieee/9274.1.1/7321/)
- [I2IDL](https://www.i2idl.org/)

## Related Resources

- [Chapter 1: Foundations of xAPI and the Learning Standards Landscape](../../chapters/01-foundations-and-standards/index.md)
