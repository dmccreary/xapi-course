# CLAUDE.md — xAPI for Intelligent Textbooks

Project home: `/Users/dan/Documents/ws/xapi-course`

## Session Rules

- **Never use worktrees.** Always read and write files directly in
  `/Users/dan/Documents/ws/xapi-course`. Do not pass `isolation: "worktree"`
  to the Agent tool. Worktrees create a hidden directory the user cannot see.

---

## Diagrams Must Be Interactive (No Static Images)

**Every diagram, chart, infographic, MicroSim, timeline, map, workflow, and
graph model in this textbook MUST be interactive.** Never create static images
that do not give the learner feedback. This is a defining property of an
intelligent textbook: every visual element is also a sensor that captures what
the learner explores, hovers, clicks, or manipulates — and feeds that signal
back through xAPI.

**Minimum bar for every visual element:**

- The learner can hover, click, or manipulate at least one element
- That interaction produces visible feedback — an infobox, tooltip, highlight,
  panel update, parameter change, or state transition
- The feedback teaches something — a definition, property, relationship, or
  consequence

**Mermaid is permitted ONLY when every node has a `click` directive** that
opens an infobox containing the term's definition (ideally pulled from the
glossary), the relationship's meaning, or supporting context. A plain Mermaid
diagram with no click handlers is a static image and is NOT acceptable.

**Forbidden patterns:**

- Static SVG/PNG/JPG embedded with no surrounding interaction
- Mermaid diagrams without click handlers and infoboxes
- Charts that render once and never respond to hover, click, or filter
- Timelines, maps, workflows, or graph models with no clickable elements

If a candidate diagram cannot meet this bar, redesign it as a MicroSim, an
interactive infographic, or a clickable Mermaid diagram — or cut it.

This rule applies to every chapter and every `#### Diagram:` `<details>`
specification. See the `chapter-content-generator` skill's
`references/content-element-types.md` for the full specification.

---

## Mermaid MicroSim Layout Rules

When generating a Mermaid-based MicroSim (the 2/3 diagram + 1/3 info-panel
pattern used by `xapi-statement-triple`), apply these compact layout settings
unless a specific diagram has a documented reason to deviate. These values were
tuned to keep the flowchart readable without wasting vertical space:

**`mermaid.initialize` flowchart config:**

```js
flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 12,    // tight vertical spacing between sibling nodes
    rankSpacing: 60,    // horizontal spacing between ranks (LR flowcharts)
    padding: 4          // padding inside each node, around the label text
}
```

**Why these values:**

- `nodeSpacing: 12` — Mermaid's default (~50) leaves cavernous gaps between
  sibling nodes in a vertical fan. 12 keeps related items visually grouped.
- `rankSpacing: 60` — Tight enough that edge labels still fit but the diagram
  doesn't sprawl horizontally.
- `padding: 4` — Default (~15) creates puffy nodes with too much whitespace
  around 1–2 lines of label text. 4 hugs the text.

**Canvas height:** Set `CANVAS_HEIGHT` to the smallest value that displays the
entire flowchart without clipping the lowest node. For a Mermaid flowchart at
the standard 2/3 width with N nodes, this is typically:

- 4–5 nodes: ~380–420px
- 6–8 nodes: ~480–520px
- 9+ nodes: measure empirically

Always verify by capturing a screenshot at the target height; the SVG
preserves its natural aspect ratio under `useMaxWidth: true`, so a too-short
canvas will silently clip the bottom rows. (Footgun: `overflow: hidden` on the
diagram panel hides the clip — there is no scrollbar to warn you.)

**Scope:** Apply these defaults to every Mermaid MicroSim in this project. If
a future diagram needs different values, document the reason inline in
`main.html` next to the override.

---

## Subgraph Title Collisions in TD Layouts

**Problem.** In a top-down (`flowchart TD`) Mermaid diagram with multiple
stacked subgraphs, an arrow from a node in one subgraph to a node in the
subgraph below enters the lower subgraph at the **top-center** of its
bounding rectangle — the exact spot where the subgraph title sits. The arrow
either runs through the title text or its arrowhead lands on top of it.

**What does NOT work.** CSS rules like
`.mermaid g.cluster[id^="L2"] .cluster-label { transform: translateX(60px); }`
appear to do nothing. Mermaid sets an inline `transform="translate(x, y)"`
**attribute** on each `.cluster-label` group at render time. A CSS `transform`
property either fails to override the SVG attribute reliably, or replaces the
full transform — losing mermaid's computed y-position and dumping the label
in the wrong place. Either way, the visible result is "no effect."

**What works.** Run a small post-render script that finds the cluster labels
by their **text content**, parses their existing `translate(x, y)` attribute,
and adds a horizontal offset while preserving y. Example (shifts the labels
"LRS" and "Dashboards" 50px to the right, clear of the centerline):

```js
function shiftClusterLabels() {
    const targets = ['LRS', 'Dashboards'];
    const labels = document.querySelectorAll('.mermaid g.cluster-label');
    labels.forEach(label => {
        const text = (label.textContent || '').trim();
        if (!targets.includes(text)) return;
        const current = label.getAttribute('transform') || '';
        const m = current.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
        if (m) {
            const x = parseFloat(m[1]) + 50;
            const y = parseFloat(m[2]);
            label.setAttribute('transform', `translate(${x}, ${y})`);
        } else {
            label.setAttribute('transform', `translate(50, 0)`);
        }
    });
}
window.addEventListener('load', () => setTimeout(shiftClusterLabels, 100));
```

**Why text-content matching.** Mermaid's cluster `id` attributes are not
stable across versions and may be prefixed (e.g. `flowchart-L2-12`). Matching
on the visible label text is robust and easy to read at the call site.

**When to apply.** Any TD Mermaid diagram where an inter-subgraph edge enters
a subgraph from directly above. Shift only the subgraph titles whose top
edge is crossed by an incoming arrow — leave centered titles alone where
there is no collision. Working reference:
`docs/sims/full-pipeline-architecture/main.html`.

**Footgun.** Mermaid sets the title's `translate()` as an SVG **attribute**,
not a CSS property. A CSS `transform` rule that *looks* correct will silently
either no-op or strip mermaid's computed y-position — leaving the label
visually in the wrong row with no error in the console. Reach for the
post-render script, not CSS, for this fix.

---

## Learning Mascot: Xavi the Octopus

### Character Overview

- **Name**: Xavi (pronounced "ZAH-vee")
- **Species**: Octopus
- **Personality**: Curious, methodical, encouraging, witty
- **Catchphrase**: "Every interaction tells a story!"
- **Visual**: Round compact octopus with smooth indigo-blue skin, large bright
  curious eyes, and small round glasses perched near the top of the mantle.
  Expressive tentacles convey emotion. Modern flat-vector cartoon style.

### Voice Characteristics

- Uses clear, technically precise language without unnecessary jargon
- Occasionally references xAPI metaphors ("Let's send that statement!", "Time to query the LRS!")
- Normalizes struggle: "This part trips up a lot of developers — that's completely normal."
- Refers to students as "builders" or "engineers"
- Signature phrases: "Every interaction tells a story!", "Let's track that!",
  "The data never lies — but the schema might!"

---

## Writing Style Guide

The book's overall tone should match Xavi's personality — even in chapters where
Xavi doesn't make a direct appearance. The narrator and Xavi share a voice:
warm, funny, technically sharp, and relentlessly optimistic about what learners
can build with xAPI.

### Core Tone

- **Lighthearted and fun.** Treat the reader like a friend who wandered into
  your office because they were curious. Avoid the dry, passive-voice cadence
  of a spec document. Standards documents are where xAPI sentences go to take a
  nap — this book is where they wake up.
- **Positive and optimistic.** Frame difficulty as opportunity. xAPI *can* feel
  sprawling at first; the right framing is "look at how much this lets you do,"
  not "look at how much there is to memorize."
- **Encouraging.** When a topic is genuinely tricky (state vs. agent profile,
  voiding statements, the IFI rules), say so plainly and reassure the reader.
  No gatekeeping, no "obviously" or "simply."

### The Superpower Theme

Treat xAPI knowledge as a **learning superpower** — a recurring metaphor that
ties the book together. The pitch:

> Most software watches what users *click*. xAPI watches what they *learn*.
> Once you can write, store, and query learning statements, you can answer
> questions that traditional analytics can't even ask.

Use the superpower theme to:

- Open chapters with what the reader will *gain the power to do* by the end.
- Reframe dry mechanics as new abilities ("Now you can reconstruct any
  learner's session in order, across devices, months later.").
- Close chapters with a quick "you just leveled up" beat — what's now possible
  that wasn't before.

Don't overdo it. One or two superpower beats per chapter is plenty; more and
the metaphor wears out.

### Humor Cadence

- **Aim for one joke or playful aside every 800–1,200 words** — roughly once or
  twice per major section. Often enough to keep the reader smiling, rare enough
  that each one lands.
- **Jokes should illuminate, not interrupt.** The best ones make a technical
  point easier to remember. If the joke could be cut without the section
  losing meaning, fine — but if cutting it would make the section *clearer*,
  cut the joke instead.
- **Octopus and tentacle puns are fair game** but rationed. Three per chapter,
  max. Xavi has eight tentacles and zero patience for lazy puns.
- **Punchlines for the technically literate** beat slapstick. A joke about
  forgetting to set `result.completion: true` will land with this audience;
  a joke about Mondays will not.
- **Never punch down.** Don't joke at the expense of beginners, other
  standards (SCORM, cmi5), competing tools, or vendors. Make the *concepts*
  funny, not the people learning them.

### Sentence-Level Habits

- Prefer active voice and short sentences. Long sentences are where clarity
  goes to drown.
- Use second person ("you") liberally. The reader is the protagonist.
- Use contractions. "It's" reads warmer than "it is."
- Concrete examples beat abstract definitions every time. If you find yourself
  writing a definition, follow it immediately with a one-line example.
- Section headings can be playful, but the *first line* of every section
  should orient the reader on what they'll learn — never bury the lede behind
  a joke.

### What to Avoid

- Corporate-flavored filler ("In today's rapidly evolving learning landscape…")
- Hedging stacks ("It might possibly sometimes be the case that…")
- Mock-frustration humor ("Ugh, why is this so hard?"). Xavi never complains
  about xAPI — he's a fan.
- Sarcasm at the standard's expense. Affectionate teasing is fine; eye-rolling
  is not.
- Emojis in body prose. (Admonitions and headings: also no, unless the user
  explicitly asks.)

### Quick Self-Check Before Shipping a Chapter

1. Would a reader smile at least once per major section?
2. Does the chapter open with a *power* the reader will gain, not a topic
   they'll cover?
3. Are difficult parts flagged with reassurance instead of warnings?
4. Did at least one joke make a technical point stickier?
5. Does Xavi sound like Xavi, and does the narrator sound like Xavi's
   slightly-more-formal cousin?

If all five are yes, ship it. If not, one more pass.

---

### Mascot Admonition Format

Always place mascot images in the admonition **body**, never in the title bar.
The `src` path is relative to the **rendered URL** (directory URLs are active),
not the `.md` file path. Count `../` levels from the rendered page to `docs/img/mascot/`.

For a page at `chapters/01-intro/index.md` (renders at `chapters/01-intro/`):

```markdown
!!! mascot-welcome "Welcome to Chapter 1!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi waving welcome">
    Admonition text goes here after the img tag.
```

For a page at `learning-graph/mascot-test.md` (renders at `learning-graph/mascot-test/`):

```markdown
!!! mascot-tip "Xavi's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Xavi giving a tip">
    Tip text here.
```

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Every chapter (once) |
| Key concept or insight | `mascot-thinking` | 2–3 per chapter |
| Helpful tip or shortcut | `mascot-tip` | As needed |
| Common mistake / pitfall | `mascot-warning` | As needed |
| Difficult or dense content | `mascot-encourage` | Where students may struggle |
| End of chapter / major win | `mascot-celebration` | Once per chapter end |

### Do's and Don'ts

**Do:**

- Use Xavi to introduce new topics warmly at chapter openings
- Include the catchphrase "Every interaction tells a story!" in welcome admonitions
- Keep Xavi's dialogue brief — 1 to 3 sentences maximum
- Match the pose image to the admonition type

**Don't:**

- Use Xavi more than **5–6 times per chapter**
- Place mascot admonitions back-to-back
- Use Xavi for purely decorative purposes with no instructional value
- Change Xavi's personality or voice across chapters

### Available Poses

| Filename | Admonition Type | When to Use |
|----------|----------------|-------------|
| `neutral.png` | `mascot-neutral` | General notes, introductions |
| `welcome.png` | `mascot-welcome` | Chapter openings |
| `thinking.png` | `mascot-thinking` | Key concepts, insights |
| `tip.png` | `mascot-tip` | Tips and hints |
| `warning.png` | `mascot-warning` | Warnings, common mistakes |
| `encouraging.png` | `mascot-encourage` | Difficult sections |
| `celebration.png` | `mascot-celebration` | Achievements, chapter ends |

Images live at `docs/img/mascot/`. Generate using prompts in
`docs/img/mascot/image-prompts.md`.
