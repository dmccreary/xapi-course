---
title: Synthetic Data Generation and AI-Assisted LRS Testing
description: How to use Claude Code (and similar generative AI tools) to produce realistic synthetic xAPI datasets — five canonical learner archetypes, statistically representative cohorts, and the load-testing pipelines that let you stress an LRS to its breaking point without involving a single real student.
generated_by: claude skill chapter-content-generator
date: 2026-04-30 12:22:00
version: 0.07
---

# Synthetic Data Generation and AI-Assisted LRS Testing

## Summary

Uses Claude Code to generate realistic learner cohorts, model archetypes, and validate statistical representativeness for load testing. This chapter fits into the overall progression by building on prior concepts and preparing readers for the chapters that follow. After completing this chapter, students will be able to recognize, explain, and apply the concepts listed below in the context of xAPI-instrumented intelligent textbooks.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Synthetic Data Generation
2. Claude Code Integration
3. Realistic Learner Cohort Simulation
4. LRS Load Testing
5. xAPI Stress Testing
6. Learner Archetype Modeling
7. Fast Learner Archetype
8. Struggling Learner Archetype
9. Disengaged Learner Archetype
10. Re-Learner Archetype
11. Mastery-Seeker Archetype
12. Verb Frequency Distribution
13. Session Duration Histogram
14. Statistical Representativeness

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The xAPI Statement Model: Actor, Verb, Object, Result, and Context](../02-statement-model/index.md)
- [Chapter 3: Advanced Statement Structure: Voiding, Sub-Statements, Extensions, and Attachments](../03-advanced-statement-structure/index.md)

---

!!! mascot-welcome "Welcome to Fake Students Doing Real Work"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi the octopus directing imaginary students">
    Real student data is scarce, slow to accumulate, and legally radioactive. Synthetic student data is abundant, instant, and harmless. This chapter shows you how to use Claude Code to generate xAPI datasets that look like real cohorts — believable, varied, and statistically representative — so you can stress-test your LRS, validate your dashboards, and ship confidently without waiting for actual classrooms.

## Your New Superpower

By the end of this chapter, you'll be able to **conjure realistic xAPI datasets on demand and use them to stress, validate, and demo any LRS deployment without involving a single real learner**. That capability rewires the development cycle. Where most teams wait six months for production data to accumulate before they trust their analytics, you'll be able to test against believable data on day one.

You'll also learn the discipline of **statistical representativeness** — what it means for a synthetic dataset to actually look like a real one, and how to verify that match instead of just hoping for it. This is the difference between a load test that exercises your LRS realistically and one that exercises only the easy paths.

## Why Synthetic Data

Three problems make production data hard to use during development. **Privacy** — real student data carries FERPA, COPPA, and GDPR obligations that make casual access impossible. **Volume** — early in a deployment, real data is too sparse to stress anything; even an entire pilot semester might emit fewer statements than a single load-test run needs. **Repeatability** — real data evolves; a regression test that compares "today's dashboard" to "last month's dashboard" against real data will fail for legitimate reasons every run, hiding the bugs.

**Synthetic data generation** is the practice of producing artificial-but-realistic xAPI datasets that solve all three problems. Synthetic data is, by definition, never about a real learner — privacy is a non-issue. Synthetic data scales to whatever volume you need — a million statements is a five-minute generation run. Synthetic data is deterministic if you fix the random seed — same seed, same data, same dashboard.

The trade-off is *realism*. Bad synthetic data exercises only the happy path: every learner finishes every chapter, every quiz is passed on the first try, every session lasts exactly 23 minutes. A load test against bad synthetic data tells you the LRS handles the easy case, which you already knew. The interesting bugs hide in the long tail of unusual sessions, partial completions, and edge-case interactions. Realism is the property that makes synthetic data useful, and realism is what we'll spend most of this chapter on.

## Claude Code Integration

**Claude Code integration** in this context means: using Claude Code (or a similar coding assistant powered by a large language model) as the generation engine for the synthetic data pipeline. Claude Code's strengths align well with the problem — it writes JSON fluently, it understands xAPI's structure when shown the schema, and it can produce variability that hand-coded generators struggle to match.

The pattern that works:

1. **Specify the cohort.** Tell Claude Code the target size, the chapter or chapters being simulated, the time window, and the archetype mix.
2. **Provide the schema and examples.** A few real (or known-good) statements as in-context examples produce dramatically better output than schema descriptions alone.
3. **Generate iteratively in chunks.** Don't ask for 10,000 statements in one call; ask for 50 statements per learner per archetype, in batches of 25 learners.
4. **Validate against the schema.** Run every generated batch through your conformance tester (Chapter 12) before committing it to the test corpus.
5. **Compare distributions.** Verify the synthetic distribution matches expectations (verb frequencies, session lengths, score distributions).

A representative invocation, expressed as a Claude Code prompt template:

```
Generate 50 xAPI 1.0.3 statements for one learner working through the chapter at
http://textbook.example.org/chapters/quadratics. The learner is a "struggling
learner" archetype: low first-try pass rate (~40%), longer-than-average session
(35–45 min), 2–3 retries on most quiz items. Use the 5-statement quiz pattern
(attempted, scored, passed/failed, completed) for each quiz attempt. Output a
single JSON array. The actor's account.name should be the UUID I provide:
{learner_uuid}.
```

The prompt is small but loaded with constraints: archetype shape, statement count, pattern conformance, output format, identity. The output is a JSON array you can save, validate, and POST to the LRS.

## Learner Archetype Modeling

**Learner archetype modeling** is the practice of defining recurring "shapes" of learner behavior that, in combination, produce a realistic cohort. The xAPI specification doesn't define archetypes — they're a pedagogical research idea applied to test data. Five archetypes cover most of the realistic distribution:

The **fast learner archetype** moves through material quickly, passes assessments on the first attempt at a high rate (~85%), spends little time per section, and rarely revisits content. Their statement stream is short — 25–40 statements per chapter — and dominated by `experienced`, `attempted`, `passed`, `completed`. They're the easy case for any system.

The **struggling learner archetype** moves slowly, attempts each assessment 2–3 times before passing, lingers on sections, and emits clarifying interactions (hint requests, simulation manipulations) more often than other archetypes. Their statement stream is long — 80–120 statements per chapter — with a heavy tail of `attempted` and `failed` paired with eventual `passed`. They're the case where real bugs hide.

The **disengaged learner archetype** opens the chapter, scrolls through quickly, attempts very few assessments, and abandons the session early. Their statement stream is short and biased toward `experienced` with very few `attempted` or `completed`. They're the case where dashboards need to look honest about non-engagement.

The **re-learner archetype** is a learner returning to material they've seen before. They skip introductory content (low `experienced` count for the early sections), engage selectively with the harder parts, and often skip directly to assessments. Their pattern frequently shows session-lifecycle verbs (`launched`, `terminated`) without a corresponding `completed`. They're the case where activity registration UUIDs accumulate.

The **mastery-seeker archetype** is the over-achiever. They complete every section, attempt every optional challenge, replay simulations, and exit only after exceeding the bar set by the activity. Their statement stream is the longest — 150+ statements per chapter — with high counts of `interacted`, `progressed`, and successive `attempted`/`passed` pairs. They're the case where bandwidth and frequency limits get tested.

A realistic cohort isn't a uniform mix. Production observation suggests a rough breakdown of 15% fast, 30% struggling, 25% disengaged, 15% re-learner, and 15% mastery-seeker — with substantial deployment variance. The cohort generator should let you tune the mix.

#### Diagram: Learner Archetype Profiles

<details markdown="1">
<summary>Learner Archetype Profiles</summary>
Type: interactive-infographic
**sim-id:** learner-archetype-profiles<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Understanding):** Distinguish the five canonical learner archetypes by their behavioral signatures, and recognize which archetype dominates a given session pattern.

**Layout:** Five horizontal cards stacked vertically (one per archetype) on the left (2/3); a side panel on the right (1/3) showing the selected archetype's full detail.

**Each card shows:**

- Archetype name in a header bar
- Three small bar charts side by side: typical statement count, typical session length, typical first-try pass rate
- A one-line summary
- An archetype-color band (Fast: blue, Struggling: red, Disengaged: gray, Re-learner: purple, Mastery-seeker: green)

**Side panel shows:**

- Full description of the archetype
- The verb-frequency profile expected from that archetype (a small bar chart of the eight ADL verbs from Chapter 4)
- A worked example session (5–10 statements) representative of that archetype

**Interaction:**

- Hover or click a card to update the side panel
- Slider at the bottom: cohort mix (five sliders summing to 100%) — adjusts the recommended cohort composition

**Default canvas:** 1000×650px, responsive.

Implementation: p5.js for the cards, charts, and selection state; HTML overlay for the side panel and mix sliders.
</details>

## Realistic Learner Cohort Simulation

**Realistic learner cohort simulation** is the next step up from single-learner generation: producing a coordinated dataset for a full cohort that exhibits the right archetype mix, the right time-of-day distribution, and the right inter-learner correlations. Real cohorts have structure beyond per-learner patterns — Tuesday afternoon has more engagement than Friday afternoon, the night before a due date spikes, two students who sit together often submit within minutes of each other.

The pipeline:

1. **Generate the learner roster.** A list of opaque account.name values, one per simulated learner. UUIDs work fine; archetype-tagged identifiers (`struggling-001`) are easier to debug.
2. **Assign archetypes per learner.** Sample from the configured mix; remember each learner's archetype for the rest of the simulation.
3. **Generate session schedules per learner.** Time-of-day distribution should reflect realistic patterns (low overnight, peaks late morning and early evening for K-12, weekends differ from weekdays).
4. **Generate per-session statement streams.** For each scheduled session, invoke the per-archetype generator to produce that session's statements, with timestamps fitted to the scheduled session window.
5. **Add cross-learner correlations.** A small fraction of sessions should overlap and produce time-clustered statements; this exercises LRS concurrency that uniform-random schedules would never trigger.

The output is a flat list of statements, sorted by `stored` timestamp, ready to be POSTed to the LRS in chronological order — or all at once for raw load testing.

## LRS Load Testing and Stress Testing

**LRS load testing** is the practice of subjecting the LRS to a *realistic* level of traffic to verify it handles the expected production load with acceptable latency. **xAPI stress testing** pushes past realistic levels to find the LRS's breaking point — when does latency spike unacceptably, when do POSTs start failing, when does the database lose its mind?

The two are complementary and the synthetic data approach handles both. Generate a cohort representing your expected production scale and POST it at the rate it would arrive in production — that's load testing. Then generate a 5x or 10x cohort and POST it at peak rate or faster — that's stress testing.

The minimum metrics to capture during a load or stress run:

- **Ingestion rate** — statements/sec accepted by the LRS
- **POST latency** — p50, p95, p99 of LRS response times
- **Error rate** — percentage of POSTs returning 5xx
- **Storage throughput** — disk write rate during the run (helps spot storage bottlenecks)
- **Query latency** — periodic dashboard-equivalent queries during the run, measuring whether read performance degrades under write load

A load-testing run that holds steady ingestion at the expected production rate for 30 minutes with p99 POST latency under 500ms is a passing run. A stress run that finds the breaking point — the rate at which p99 latency exceeds 5 seconds — gives you the safety margin number you'll cite in the architecture review.

#### Diagram: Load Testing Pipeline

<details markdown="1">
<summary>Load Testing Pipeline</summary>
Type: workflow-diagram
**sim-id:** load-testing-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

**Learning objective (Bloom — Analyzing):** Trace the flow of a load test from synthetic data generation through LRS ingestion to metric capture and result analysis.

**Diagram type:** Mermaid flowchart (LR direction). Click handlers on every node.

**Structure:**

1. `Cohort spec (size, archetype mix, duration)`
2. `Claude Code generation` → `Synthetic statement corpus (JSON)`
3. `Conformance validator (drop malformed)`
4. `Load runner (replay at configured rate)` → `LRS under test`
5. `LRS instrumentation (POST latency, error rate, throughput)` → `Time-series metric store`
6. `Dashboard / report (pass/fail vs SLOs)`
7. Side branch: `Periodic dashboard queries` → also feeds metric store

**Mermaid config:** project standard with `securityLevel: 'loose'`.

**Click behavior:** Each node opens a side-panel infobox describing the component, the typical tooling at that step, and an example metric or output.

**Default canvas:** 2/3 width diagram + 1/3 side panel. Stacks vertically below 700px.

Implementation: Mermaid flowchart with click directives.
</details>

## Statistical Representativeness

**Statistical representativeness** is the property that a synthetic dataset matches a real dataset on the dimensions that matter for whatever you're testing. The dataset doesn't need to match on every dimension — only on the ones the tests will exercise. The two dimensions that matter most for LRS testing:

The **verb frequency distribution** is the count (or relative frequency) of each verb across the dataset. A real K-12 deployment might show roughly: `experienced` 35%, `interacted` 30%, `attempted` 12%, `passed` 8%, `failed` 6%, `progressed` 5%, `completed` 3%, others 1%. A synthetic dataset that puts 90% of its statements in `interacted` (because the generator over-emits MicroSim interactions) is not representative — the LRS index pressure will be wildly different from production. Verb-frequency comparison is the first sanity check on any synthetic dataset.

The **session duration histogram** is the distribution of session lengths across all learners. Real cohorts have a long-tailed distribution: many short sessions, fewer medium, rare long. A synthetic dataset that produces uniform 20-minute sessions for everyone is unrealistic and will exercise the LRS very differently from production. Session length affects how many statements arrive per registration UUID, which affects index growth patterns.

The check is procedural: take a real dataset (or a known-good reference), compute the verb frequency and session histogram, compare to the synthetic counterpart, and require the percentage differences to be within a tolerance (e.g., 10% for verb frequency, 20% for histogram bins). If a synthetic run fails the check, retune the archetype mix and regenerate.

```python
def representativeness_check(real, synthetic, tolerance=0.10):
    real_freq = verb_frequency(real)
    syn_freq = verb_frequency(synthetic)
    for verb, real_pct in real_freq.items():
        syn_pct = syn_freq.get(verb, 0)
        if abs(real_pct - syn_pct) / real_pct > tolerance:
            return False, f"verb {verb}: real={real_pct:.2%} syn={syn_pct:.2%}"
    return True, "OK"
```

#### Diagram: Statistical Representativeness Comparison

<details markdown="1">
<summary>Statistical Representativeness Comparison</summary>
Type: interactive-infographic
**sim-id:** statistical-representativeness-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom — Evaluating):** Compare a synthetic dataset to a reference real dataset across verb frequency and session duration, identifying where the synthetic falls outside the acceptable tolerance.

**Layout:** Two side-by-side bar-chart pairs (top: verb frequency; bottom: session duration histogram); a tolerance-bar overlay; a side panel reporting pass/fail.

**Visual elements:**

- Top: side-by-side bar charts, each verb a pair (real left, synthetic right), with a tolerance band shown as a shaded background
- Bottom: side-by-side histogram bins (5-minute buckets, 0–60 min), real left, synthetic right
- Side panel: pass/fail badge per dimension, with the worst-deviating verb or bucket highlighted

**Interaction:**

- Slider: tolerance percentage (5% – 30%)
- Slider: synthetic-archetype mix (five sliders) — adjusting the mix re-generates the synthetic data and re-renders the comparison
- Preset buttons: "Match real cohort", "Over-engaged synthetic", "Under-engaged synthetic", "Skewed-archetype synthetic"

**Default canvas:** 1000×650px, responsive.

Implementation: p5.js for the bar charts, histogram rendering, and live re-computation when sliders change.
</details>

!!! mascot-warning "Common Pitfall — Treating Synthetic as Real"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Xavi cautioning against confusing real and synthetic">
    Once a synthetic dataset is good enough to fool a load test, it's tempting to use it to validate analytics findings or train ML models. Don't. Synthetic data is good for testing systems; it's not good for discovering insights about learners. Insights about synthetic learners are insights about your generator, not about pedagogy. Keep the boundary clear: synthetic for systems, real for science.

## Putting It Together — The Generation Recipe

A complete recipe for a stress-testable corpus, expressed as steps:

1. **Define the target.** Cohort size 5000, two-week window, archetype mix 15/30/25/15/15, simulated against a single chapter.
2. **Generate roster and schedules.** A pre-pass produces 5000 learner UUIDs, archetype tags, and session timestamps in the simulated window.
3. **Iterate per learner.** For each learner, invoke Claude Code with a prompt parameterized by archetype, schedule, and learner UUID. Cache results to disk as JSON files.
4. **Validate.** Run every JSON file through the schema validator (Chapter 12); reject and regenerate any that fail.
5. **Aggregate.** Concatenate all per-learner files into a single corpus, sort by `timestamp`, save the canonical artifact.
6. **Check representativeness.** Compare verb frequency and session histogram against your real reference; pass or retune.
7. **Replay against the LRS.** Use a load runner that respects timestamps (replay at real-time rate) for load testing, or that ignores them (replay at maximum rate) for stress testing.

The generation phase is slow — Claude Code is not free and is rate-limited — but the corpus is reusable. Generate once, replay many times against different LRS configurations, different platforms, different network conditions.

## What You Just Leveled Up

Walk through this checklist. Reread anything that doesn't feel solid before moving to Chapter 12.

- You can describe the three reasons synthetic data is preferable to production data during development.
- You can construct a Claude Code prompt that produces realistic per-archetype statement streams.
- You can name and describe the five canonical learner archetypes and their behavioral signatures.
- You can sketch the cohort-simulation pipeline from roster generation to corpus assembly.
- You can distinguish load testing from stress testing and name the metrics that matter for each.
- You can apply the verb-frequency and session-duration checks for statistical representativeness.
- You can articulate why synthetic data is appropriate for system testing but not for analytical insights about learners.

!!! mascot-celebration "Fake Cohorts, Real Confidence"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Xavi celebrating with rows of cardboard students">
    You can now produce believable synthetic cohorts on demand and use them to validate every part of your stack. That's a capability most teams don't develop until year two of a deployment — and it's the capability that prevents the biggest production surprises. Chapter 12 turns to formal conformance: how do you prove your statements are valid, and how does xAPI compare to the other learning standards in the ecosystem?
