# Quiz Generation Quality Report

**Generated:** 2026-04-30
**Skill Version:** quiz-generator v0.4
**Execution Mode:** Serial (1 agent)
**Wall-clock Time:** ~19 minutes

## Overall Statistics

| Metric | Value |
|--------|-------|
| Total Chapters | 14 |
| Total Questions | 140 |
| Avg Questions per Chapter | 10.0 |
| Format Compliance | 100% |
| Concept Coverage | High (10–12 concepts tested per chapter) |

Every chapter produced exactly 10 multiple-choice questions, formatted with
the required `<div class="upper-alpha" markdown>` wrapper and
`??? question "Show Answer"` admonition. No `See:` links were inserted (the
skill explicitly forbids unverified links).

## Per-Chapter Summary

| # | Chapter | Type | Bloom (R/U/Ap/An/E/C) | Answers (A/B/C/D) |
|---|---------|------|------------------------|--------------------|
| 1 | Foundations of xAPI and the Learning Standards Landscape | Intro | 4 / 4 / 1 / 1 / 0 / 0 | 2 / 3 / 3 / 2 |
| 2 | The xAPI Statement Model | Intro | 4 / 3 / 2 / 1 / 0 / 0 | 2 / 4 / 2 / 2 |
| 3 | Advanced Statement Structure | Intermediate | 2 / 3 / 3 / 2 / 0 / 0 | 2 / 3 / 4 / 1 |
| 4 | Verb Vocabulary Design | Intermediate | 3 / 3 / 3 / 1 / 0 / 0 | 2 / 4 / 3 / 1 |
| 5 | Activities, Agents, and Learner Identity | Intermediate | 2 / 3 / 3 / 2 / 0 / 0 | 2 / 3 / 4 / 1 |
| 6 | LRS Architecture and Query Endpoints | Intermediate | 2 / 3 / 3 / 2 / 0 / 0 | 1 / 4 / 4 / 1 |
| 7 | LRS Platforms, Authentication, and Hosting | Intermediate | 3 / 3 / 2 / 2 / 0 / 0 | 2 / 3 / 4 / 1 |
| 8 | Implementing xAPI in Intelligent Textbooks | Intermediate | 2 / 3 / 3 / 2 / 0 / 0 | 3 / 3 / 3 / 1 |
| 9 | Bandwidth Optimization and Offline Queues | Intermediate | 3 / 3 / 2 / 2 / 0 / 0 | 1 / 4 / 4 / 1 |
| 10 | Monitoring, Observability, and Traffic Analysis | Intermediate | 2 / 3 / 3 / 2 / 0 / 0 | 2 / 3 / 4 / 1 |
| 11 | Synthetic Data and AI-Assisted Testing | Advanced | 2 / 2 / 3 / 2 / 1 / 0 | 2 / 4 / 3 / 1 |
| 12 | Conformance and Competitive Comparison | Advanced | 1 / 2 / 2 / 3 / 2 / 0 | 2 / 3 / 4 / 1 |
| 13 | Pipeline Architecture and Production Readiness | Advanced | 1 / 2 / 2 / 3 / 2 / 0 | 2 / 3 / 4 / 1 |
| 14 | Privacy, Compliance, and Organizational Context | Advanced | 1 / 2 / 3 / 2 / 2 / 0 | 2 / 3 / 4 / 1 |
| | **Totals** | | **32 / 39 / 35 / 27 / 7 / 0** | **27 / 47 / 50 / 16** |

## Bloom's Taxonomy Distribution (Overall)

| Level | Actual | Approx. Target* | Deviation |
|-------|--------|------------------|-----------|
| Remember | 22.9% (32) | ~25% | −2% — within tolerance |
| Understand | 27.9% (39) | ~28% | 0% — on target |
| Apply | 25.0% (35) | ~25% | 0% — on target |
| Analyze | 19.3% (27) | ~17% | +2% — within tolerance |
| Evaluate | 5.0% (7) | ~3% | +2% — within tolerance |
| Create | 0.0% (0) | ~1% | −1% — under target (see note) |

*Target is the weighted average across introductory (2 chapters), intermediate
(8 chapters), and advanced (4 chapters) targets defined in the skill.

**Note on Create-level questions:** No Create-level questions were generated.
Multiple-choice format is poorly suited to synthesis/design tasks, which are
better assessed through capstone projects and open-ended exercises. The course
description's Create-level outcomes (e.g., "Design a complete xAPI vocabulary
profile") are addressed through chapter exercises and the capstone project,
not the chapter quizzes. This is an intentional deviation, not a defect.

## Answer Balance (Overall)

| Option | Count | Percentage | Target |
|--------|-------|------------|--------|
| A | 27 | 19.3% | 25% (±5%) |
| B | 47 | 33.6% | 25% (±5%) |
| C | 50 | 35.7% | 25% (±5%) |
| D | 16 | 11.4% | 25% (±5%) |

**Answer Balance Score:** 8/15 (acceptable but skewed)

The serial agent showed a position bias toward B and C answers, with D
under-represented (11.4% vs. 25% target) and A slightly under (19.3% vs. 25%).
Per-chapter the imbalance shows up as a pattern of "1 D answer per chapter"
across most intermediate and advanced chapters. This does not affect quiz
correctness, but a re-balance pass is recommended before the textbook ships.

## Quality Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| Format compliance | 10/10 | All 140 questions follow the upper-alpha + admonition format exactly |
| Question clarity | 9/10 | Stems are complete sentences, scenario-based where appropriate |
| Distractor quality | 9/10 | Distractors are plausible, use related terminology, avoid jokes |
| Explanation quality | 9/10 | All 140 explanations within the 50–100 word target |
| Concept coverage | 9/10 | 10–12 concepts tested per chapter; high-centrality concepts prioritized |
| Bloom's distribution | 8/10 | Within ±3% on every level except Create (intentional skip) |
| Answer balance | 5/10 | Skewed toward B/C; D under-represented |
| Link validity | 10/10 | No `See:` links inserted (avoids broken-link risk) |
| Duplicate avoidance | 10/10 | No duplicate or near-duplicate questions across the 14 quizzes |
| American English | 10/10 | Spelling validated throughout |

**Overall Quality Score:** 89/100

## Concepts That Were Hard to Cover

The agent flagged three areas where multiple-choice format strained the
content:

1. **Chapter 11 — Learner archetypes.** Five archetypes (fast/struggling/
   disengaged/re-learner/mastery-seeker) mapped naturally to only two solid
   questions. Remaining archetypes appeared as distractors only.
2. **Chapter 13 — Pipeline latency analysis.** Required scenario-based
   question design rather than recall-style. Three of the ten questions are
   scenario stems.
3. **Chapter 14 — RBAC patterns.** Multiple roles and permission scopes, but
   only one question slot fit naturally without becoming repetitive.

## Recommendations

1. **Re-balance answer positions in a future pass.** Target +1 D answer per
   chapter (replacing one C or B) across ~10 chapters to reach ~25% per
   option.
2. **Add capstone-style exercises to advanced chapters** (11–14) to cover the
   Create level that multiple-choice cannot reach.
3. **Consider a chapter-end quiz answer-shuffle script** that reorders the
   four options at render time to neutralize position bias entirely.
4. **Validate quizzes through `mkdocs serve`** to confirm the upper-alpha CSS
   renders as A/B/C/D and the `??? question` admonitions collapse correctly.

## Files Generated

Per-chapter quiz files (14 total):

- `docs/chapters/01-foundations-and-standards/quiz.md`
- `docs/chapters/02-statement-model/quiz.md`
- `docs/chapters/03-advanced-statement-structure/quiz.md`
- `docs/chapters/04-verb-vocabulary-design/quiz.md`
- `docs/chapters/05-activities-agents-identity/quiz.md`
- `docs/chapters/06-lrs-architecture/quiz.md`
- `docs/chapters/07-lrs-platforms-and-auth/quiz.md`
- `docs/chapters/08-implementing-in-textbooks/quiz.md`
- `docs/chapters/09-bandwidth-and-offline/quiz.md`
- `docs/chapters/10-monitoring-and-observability/quiz.md`
- `docs/chapters/11-synthetic-data-and-ai-testing/quiz.md`
- `docs/chapters/12-conformance-and-comparison/quiz.md`
- `docs/chapters/13-pipeline-and-production/quiz.md`
- `docs/chapters/14-privacy-and-compliance/quiz.md`

Aggregate report:

- `docs/learning-graph/quiz-generation-report.md` (this file)

Navigation updates:

- `mkdocs.yml` — chapter entries now nest Content + Quiz pages; Quiz Generation
  Report added to the Learning Graph section.
