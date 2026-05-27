# MicroSim Layout Review — Session Log

**Date**: 2026-05-27
**Model**: Claude Vision (Opus 4.7, 1M context)
**Scope**: All 50 MicroSims in `docs/sims/`
**Skill**: `microsim-layout-reviewer`

## Goals

1. Wrap every `description:` field in `docs/sims/*/index.md` in double quotes.
2. For every MicroSim with `status:` ≠ `approved`, run the layout reviewer,
   patch defects, and bump to `approved` when clean.

## Description-Quoting Pass

Wrapped 49 previously-unquoted `description:` fields in double quotes via
in-place `perl` substitution (only `xapi-statement-builder` was already
quoted). Final state: all 50 sims now use the form
`description: "..."` in front matter.

## Layout-Review Pass

16 sims were not approved at session start. Final outcome of each:

| # | Sim | Initial status | Defect found | Fix applied | Final |
|---|---|---|---|---|---|
| 1  | `four-inverse-functional-identifiers`         | built       | none — card grid was already clean | — | approved |
| 2  | `learning-standards-ecosystem`                | built       | vis-network nodes clipped at every edge (AICC, Analytics Platform, CC node); physics layout exceeded viewport | tightened `barnesHut` (`springLength` 130→75, `gravitationalConstant` -4000→-1800); added explicit `network.fit()` + 12% zoom-out after `stabilizationIterationsDone`; iframe height 452→580 | approved |
| 3  | `result-field-composition-explorer`           | implemented | none — 2x2 grid, sliders, JSON panel all clean | — | approved |
| 4  | `retry-with-backoff-state-machine`            | built       | "OfflineQueue" terminal clipped under iframe edge | Mermaid `rankSpacing` 60→35; `align-items: flex-start` on diagram panel | approved |
| 5  | `service-worker-offline-queue-flow`           | implemented | 11-node TD flowchart clipped both top AND bottom (only middle 3 nodes visible at 542px); TD layout is fundamentally tall because of diamond decision nodes | tried LR (squashed text), reverted to TD; tightened spacing (nodeSpacing 12→8, rankSpacing 60→30, classDef font-size 15→11px); `align-items: flex-start`; iframe height 542→**1100** to fit all 11 nodes | approved (see Caveat below) |
| 6  | `standards-comparison-card-grid`              | implemented | none — 5 cards + radar detail panel clean | — | approved |
| 7  | `statement-field-ownership`                   | built       | none — Mermaid AP/LRS ownership diagram clean | — | approved |
| 8  | `statement-pattern-composer`                  | implemented | JSON panel: long IRIs overflowed right edge despite in-code `truncateToWidth` logic; slot-map descriptions clipped when JSON panel widened too aggressively | adjusted split point: `splitX = max(canvasWidth * 0.52, 420)` — gives JSON panel enough width for truncation+ellipsis to fit while preserving slot-map description width | approved |
| 9  | `statement-query-pagination-flow`             | built       | enormous diamond decision nodes (font-size 15px) clipped bottom half of flowchart | Mermaid `rankSpacing` 60→30; classDef `font-size` 15px→11px across action/decision/terminal/sidebranch; `align-items: flex-start` | approved |
| 10 | `statistical-representativeness-comparison`   | implemented | none — twin bar charts and pass/fail sidebar clean | — | approved |
| 11 | `three-context-comparison`                    | implemented | none — three radar cards + comparison panel clean | — | approved |
| 12 | `verb-iri-anatomy`                            | implemented | none — IRI parts + hint panel + example buttons clean | — | approved |
| 13 | `verb-selection-decision-tree`                | implemented | bottom outcomes ("Use existing custom verb" / "Open profile-update PR") clipped under iframe edge; large empty space at top from `align-items: center` | `align-items: flex-start` on diagram panel | approved |
| 14 | `vocabulary-profile-architecture`             | implemented | "Statement Patterns" node clipped under iframe edge | Mermaid `rankSpacing` 60→35; `align-items: flex-start` | approved |
| 15 | `voiding-lifecycle-flow`                      | implemented | step 8 ("voided=true query: both visible") clipped under iframe edge | `align-items: flex-start` on diagram panel | approved |
| 16 | `xapi-statement-anatomy`                      | built       | none — actor/verb/object plus metadata fields cleanly laid out | — | approved |

## Recurring Patterns Observed

Two patterns drove most of the defects:

1. **`align-items: center` on the diagram panel of vertically-tall Mermaid
   sims.** Centering pushed the SVG down so the bottom rows fell off the
   viewport even though the top half wasted whitespace. Switching to
   `align-items: flex-start` (and reducing padding from 12 → 8) fixed five
   sims (#4, #13, #14, #15, plus combined with other fixes on #5, #9).
2. **Mermaid `rankSpacing: 60` was too generous for TD flowcharts with
   4+ ranks.** Reducing to 30–35 was sufficient for most diagrams. The
   `subGraphTitleMargin` key was a copy-paste leftover in sims with no
   subgraphs — removed.

## Caveat — service-worker-offline-queue-flow

This sim required bumping iframe height to **1100px** (from 542px) to fit
all 11 nodes. The flowchart structurally has too many sequential ranks for
a normal-sized iframe:

- TD layout requires 9–10 ranks tall
- Diamond decision nodes inflate height further
- LR layout was tried and rejected — narrow horizontal width squashed text
  to unreadability
- Tightening spacing helped marginally but not enough

A future revisit should consider splitting this diagram into two halves
(synchronous send path + async flush loop) or restructuring as a hierarchical
subgraph layout. The current 1100px height is acceptable but unusually tall
for inline reading.

## Verification

```bash
# All 50 sims now status: approved
grep -l '^status: approved' docs/sims/*/index.md | wc -l
# → 50

# Zero sims with unquoted descriptions
for f in docs/sims/*/index.md; do
  if grep -q '^description:' "$f" && ! grep -q '^description: "' "$f"; then
    echo "$f"
  fi
done
# → (no output)
```

## Files Modified

**Front matter (status + description quoting)** — 50 `index.md` files.

**Layout source patches**:
- `docs/sims/learning-standards-ecosystem/learning-standards-ecosystem.js` — vis-network physics + fit
- `docs/sims/retry-with-backoff-state-machine/main.html` — Mermaid config + panel CSS
- `docs/sims/service-worker-offline-queue-flow/main.html` — Mermaid config + panel CSS + iframe height
- `docs/sims/statement-pattern-composer/statement-pattern-composer.js` — splitX layout constant
- `docs/sims/statement-query-pagination-flow/main.html` — Mermaid config + classDef fonts + panel CSS
- `docs/sims/verb-selection-decision-tree/main.html` — panel CSS
- `docs/sims/vocabulary-profile-architecture/main.html` — Mermaid config + panel CSS
- `docs/sims/voiding-lifecycle-flow/main.html` — panel CSS
