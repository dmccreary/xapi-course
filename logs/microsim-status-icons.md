# MicroSim Status Icons — Build Log

**Date:** 2026-04-30
**Project:** xapi-course
**Goal:** Show a colored status indicator next to every MicroSim in the left
nav, driven by a `status:` field in each `index.md` frontmatter.

## Status Vocabulary

| Status     | Color  | Meaning                                            |
|------------|--------|----------------------------------------------------|
| `scaffold` | red    | Spec exists; no implementation yet.                |
| `built`    | orange | Implementation exists; not yet reviewed by author. |
| `approved` | green  | Author tested it and approved it for learners.     |

The vocabulary is small on purpose. Three shapes (red dot, orange dot, green
check) is a glanceable signal; five would be a chart.

## What Got Wired Up

### 1. Per-page frontmatter

Each `docs/sims/<sim>/index.md` declares its status:

```yaml
---
title: ...
status: scaffold   # or: built, approved
---
```

Pages with a JS implementation in their directory were promoted from
`scaffold` to `built` in this pass (7 sims). The previously-tested
`xapi-statement-triple` is the only `approved` sim so far.

### 2. mkdocs.yml — `extra.status`

Material reads `extra.status` to decide which status names are valid and to
populate the hover tooltip:

```yaml
extra:
  status:
    scaffold: Scaffold — placeholder, not yet implemented
    built: Built — implementation complete, awaiting review
    approved: Approved — tested and approved
```

If a page declares a status name that is **not** listed here, Material
silently renders nothing. (Footgun #1 — see below.)

### 3. docs/css/extra.css — colored mask icons

Material Community renders the nav indicator as an empty
`<span class="md-status md-status--<name>">` and paints it via a CSS
`mask-image` driven by a `--md-status--<name>` custom property. Material only
ships those custom properties for `new`, `deprecated`, and `encrypted`. For
any other status name the cascade falls back to the base `--md-status`
variable — which is the generic "i in a circle" info icon.

The fix is to define the missing custom properties ourselves and color them
via `:after { background-color: ... }` (because the SVG is applied as a
mask, the visible color comes from the background, not from `color`):

```css
:root {
  --md-status--scaffold: url('data:image/svg+xml;charset=utf-8,<svg ...filled circle.../>');
  --md-status--built:    url('data:image/svg+xml;charset=utf-8,<svg ...filled circle.../>');
  --md-status--approved: url('data:image/svg+xml;charset=utf-8,<svg ...check-circle.../>');
}

.md-status--scaffold:after { background-color: #d32f2f;
  -webkit-mask-image: var(--md-status--scaffold); mask-image: var(--md-status--scaffold); }
.md-status--built:after    { background-color: #f57c00;
  -webkit-mask-image: var(--md-status--built);    mask-image: var(--md-status--built); }
.md-status--approved:after { background-color: #388e3c;
  -webkit-mask-image: var(--md-status--approved); mask-image: var(--md-status--approved); }

/* Pin hover so Material's default "flip to currentcolor" doesn't erase
   the status color when you mouse over the icon. */
.md-status--scaffold:hover:after { background-color: #b71c1c; }
.md-status--built:hover:after    { background-color: #ef6c00; }
.md-status--approved:hover:after { background-color: #1b5e20; }
```

The full SVG data URIs are in `docs/css/extra.css`.

## Footguns Found Along the Way

### Footgun #1 — `theme.icon.status` is silently Insiders-only

The Material docs document `theme.icon.status` as the way to map a status
name to an icon (e.g. `material/circle`). On the **community** edition this
key is parsed without error but never consulted — the nav indicator is
driven entirely by CSS custom properties. So setting

```yaml
theme:
  icon:
    status:
      scaffold: material/circle
```

does **nothing** on community, and the page still renders the fallback "i"
icon. There is no warning at build time and no hint in the output that the
config was ignored.

- **Silent:** no warning, no error, just the wrong icon.
- **Easy to trigger:** the official docs lead you here.
- **Delayed/invisible damage:** you only notice when two different statuses
  produce identical icons.

The structural fix in this project is to skip `theme.icon.status` entirely
and define `--md-status--<name>` CSS variables directly, which works on both
editions and makes the bad outcome impossible.

### Footgun #2 — Hue shift on hover

I first picked `#e65100` (Orange 900) as the hover color for `built`. That
swatch reads as orange in isolation, but next to its resting `#f57c00`
(Orange 700) it looks red. The fix was Orange 800 (`#ef6c00`) — a darken
within the same hue family rather than a hue shift toward red.

Generalizable rule: when picking a hover/active color, move *one* step
along value within the same hue, not two. Material's palette numbers help
here (e.g. 700 → 800 is a darken; 700 → 900 starts to shift hue).

### Footgun #3 — Material's default `:hover:after` rule erases the color

Material ships `.md-status:hover:after { background-color: currentcolor }`.
`currentcolor` inherits from the nav link's color, so on hover the dot
flips to the link's text color and the status color disappears. Same
specificity as our rule, so source order saves us — but only because
`extra_css` is loaded after the theme CSS. If a future installer changes
load order, the icons would silently revert on hover.

The defensive fix would be `!important` on the `:hover:after`
rules, but that's hostile to consumers. Leaving it on source order for now
and noting the dependency here.

## Proposal: Roll This Into the `init-textbook` Skill

The status indicator is plumbing every intelligent textbook will want:
authors need a glanceable signal of which sims are real vs. placeholders.
Asking each book project to rediscover the Material Insiders footgun is a
waste of everyone's time.

### Proposed changes to `~/Documents/ws/claude-skills/skills/init-textbook/`

**1. Append to `assets/templates/mkdocs.yml` — under `extra:`**

```yaml
  # MicroSim build-status indicators shown next to nav entries.
  # The status value is set per-page in the index.md frontmatter:
  #   status: scaffold | built | approved
  # Colors are defined as CSS custom properties in docs/css/extra.css.
  status:
    scaffold: Scaffold — placeholder, not yet implemented
    built: Built — implementation complete, awaiting review
    approved: Approved — tested and approved
```

**2. Append to `assets/templates/docs/css/extra.css`**

The full block from this project (copied verbatim, no project-specific
references). Roughly 30 lines: the three `:root` custom properties, the
three `.md-status--<name>:after` rules, and the three pinned hover rules.

**3. Add a one-paragraph note to `SKILL.md`**

Under a new "Status indicators" section, explain:

- Set `status: scaffold` in every MicroSim `index.md` the skill scaffolds.
- The `microsim-generator` skill (or its descendants) should bump that to
  `built` once it writes a real implementation, and leave the flip to
  `approved` to the human author.
- **Do not** add `theme.icon.status` to `mkdocs.yml`. It looks like the
  right knob; it is silently ignored on the community edition. The CSS
  variables in `extra.css` are the load-bearing piece. (See Footgun #1
  above for the full story.)

**4. Optional: extend the scaffold-warning admonition**

The current scaffold pages already render a `!!! warning "Scaffold"` block
explaining the placeholder. That block is redundant with the colored
indicator but worth keeping — the indicator is glanceable, the admonition
is teachable. The `microsim-generator` skill should remove the admonition
when it flips status to `built`.

### Why this belongs in `init-textbook` rather than a follow-on skill

The status vocabulary is a **convention** that has to exist before the
first MicroSim is generated, otherwise each book invents its own (this
project had `implemented` floating around mixed with `scaffold` — that's
the cost of not having a default). Putting it in the scaffolding step
locks in a single vocabulary across every book the user creates.

### Open questions for the proposal

1. **Color contrast in dark mode.** The hex constants above were tested in
   light mode. They likely still read in dark mode (Material 700-series
   colors usually do), but should be verified on a dark-palette book.
2. **Color-blindness.** Red/green is the most common deficiency. The shape
   change at `approved` (dot → check) is a deliberate second cue, but if a
   book author wants to add a third shape distinction (`scaffold` →
   alert-triangle, say) the SVG swap is one line. Worth mentioning in
   `SKILL.md` so authors know it's customizable without re-derivation.
3. **A fourth status?** I considered `in-review` between `built` and
   `approved` but discarded it — the author either approved it or they
   didn't, and an intermediate "I'm looking at it" state is noise. If a
   future book finds it useful, the pattern is well-established now.
