# Quiz: Synthetic Data Generation and AI-Assisted LRS Testing

Test your understanding of synthetic data, learner archetypes, load testing, and statistical representativeness with these review questions.

---

#### 1. Which problem with production data does synthetic data NOT directly address?

<div class="upper-alpha" markdown>
1. The cost of operating an LRS at scale
2. Privacy obligations under FERPA and GDPR
3. Volume insufficiency in early deployments
4. Repeatability for regression tests
</div>

??? question "Show Answer"
    The correct answer is **A**. Synthetic data addresses privacy (no real learner identity), volume (generate as many statements as needed), and repeatability (deterministic with a fixed seed). It does not address the cost of running an LRS at scale — that's an infrastructure problem orthogonal to data sourcing. The chapter calls out exactly the last three problems as the rationale for synthetic data.

    **Concept Tested:** Synthetic Data Generation

---

#### 2. The chapter defines five canonical learner archetypes for cohort simulation. Which archetype emits the longest statement stream (150+ statements per chapter)?

<div class="upper-alpha" markdown>
1. Fast learner
2. Disengaged learner
3. Mastery-seeker
4. Re-learner
</div>

??? question "Show Answer"
    The correct answer is **C**. The mastery-seeker archetype is the over-achiever — completes every section, attempts every optional challenge, replays simulations, and exits only after exceeding the bar. Their statement streams are the longest at 150+ statements per chapter, with high counts of `interacted`, `progressed`, and successive `attempted`/`passed` pairs. Fast learners produce 25-40 statements; disengaged learners produce few; re-learners skip introductory content.

    **Concept Tested:** Mastery-Seeker Archetype

---

#### 3. What is the primary difference between LRS load testing and xAPI stress testing?

<div class="upper-alpha" markdown>
1. Load testing uses real learners; stress testing uses synthetic
2. Load testing checks expected production traffic; stress testing pushes past it to find the breaking point
3. Load testing measures storage; stress testing measures latency
4. Load testing runs once per quarter; stress testing runs continuously
</div>

??? question "Show Answer"
    The correct answer is **B**. Load testing subjects the LRS to a realistic level of traffic to verify it handles the expected production load with acceptable latency. Stress testing pushes past realistic levels to find the LRS's breaking point — when latency spikes, when POSTs fail, when the database breaks. Both can use synthetic data. Both measure latency and other metrics. Cadence varies by team, not by definition.

    **Concept Tested:** LRS Load Testing / xAPI Stress Testing

---

#### 4. A team generates 10,000 synthetic statements but 90% of them use the verb `interacted`. Why is this dataset NOT statistically representative of a real K-12 deployment?

<div class="upper-alpha" markdown>
1. Real deployments only ever use `experienced`
2. Real deployments show roughly 35% experienced, 30% interacted, with `interacted` not dominating at 90%
3. The xAPI spec forbids more than 50% of statements using one verb
4. Statistical representativeness requires equal frequency across all verbs
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter cites a representative real K-12 distribution: experienced 35%, interacted 30%, attempted 12%, passed 8%, failed 6%, progressed 5%, completed 3%, others 1%. A synthetic dataset with 90% `interacted` will exercise LRS index pressure very differently from production. The xAPI spec doesn't forbid frequency skews (option C). Equal frequency is not the goal (option D).

    **Concept Tested:** Verb Frequency Distribution / Statistical Representativeness

---

#### 5. Why does the chapter recommend generating synthetic data iteratively in chunks (e.g., 50 statements per learner per archetype, in batches of 25 learners)?

<div class="upper-alpha" markdown>
1. Claude Code has a hard cap of 50 statements per output
2. The xAPI spec requires batches under 100 statements
3. LRSs reject batches larger than 25 learners
4. Smaller batches are easier to validate, debug, and avoid context-window issues
</div>

??? question "Show Answer"
    The correct answer is **D**. Generating in chunks lets the team validate each batch through the conformance tester before committing to a corpus, makes debugging tractable when a batch comes out malformed, and avoids context-window issues with large generation requests. Claude Code does not have a hard cap of 50 (option A). The xAPI spec doesn't constrain client-side batch generation (option B). LRSs accept batches well above 25 learners' worth of statements (option C).

    **Concept Tested:** Claude Code Integration

---

#### 6. According to the chapter, a realistic learner cohort mix breaks down approximately how?

<div class="upper-alpha" markdown>
1. 50% fast, 50% disengaged
2. 100% mastery-seeker for assessment fairness
3. 15% fast, 30% struggling, 25% disengaged, 15% re-learner, 15% mastery-seeker
4. Equal 20% across all five archetypes
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter cites a rough breakdown of 15% fast, 30% struggling, 25% disengaged, 15% re-learner, and 15% mastery-seeker, with substantial deployment variance. Equal 20% mixes ignore real-world distributions where struggling and disengaged learners outnumber fast learners. 50/50 splits oversimplify. 100% mastery-seeker would not exercise the harder edge cases.

    **Concept Tested:** Realistic Learner Cohort Simulation

---

#### 7. A team uses synthetic data to "discover" that learners with shorter sessions score higher on quizzes. What is the chapter's warning about this conclusion?

<div class="upper-alpha" markdown>
1. The conclusion is correct because synthetic data is statistically representative
2. Insights about synthetic learners are insights about the generator, not about pedagogy
3. The team should publish the finding immediately
4. The conclusion is invalid only if archetype counts are uneven
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter is explicit: synthetic data is good for testing systems but not for discovering insights about learners. Any "finding" from synthetic data reflects the generator's encoded assumptions, not real pedagogical phenomena. Statistical representativeness ensures the data exercises systems realistically — not that it reveals truths about learning. The boundary is: synthetic for systems, real for science.

    **Concept Tested:** Statistical Representativeness / Misuse of Synthetic Data

---

#### 8. The chapter recommends comparing real and synthetic verb frequencies and rejecting synthetic data if percentage differences exceed a tolerance. What is a typical tolerance for verb frequency?

<div class="upper-alpha" markdown>
1. 1%
2. 10%
3. 50%
4. 100%
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter's example uses a 10% tolerance for verb frequency (and ~20% for session histogram bins). Tighter tolerances (1%) are unnecessarily strict for synthetic data and would force regeneration on minor variations. Looser tolerances (50%, 100%) defeat the purpose of representativeness checks. The 10% rule of thumb balances rigor against generator practicality.

    **Concept Tested:** Statistical Representativeness

---

#### 9. A load runner is replaying a synthetic corpus against an LRS. To realistically simulate production arrival patterns, the runner should respect what?

<div class="upper-alpha" markdown>
1. The actor's account name in each statement
2. The verb IRI registry membership
3. The timestamp on each statement, replaying at real-time rate
4. The activity definition revision string
</div>

??? question "Show Answer"
    The correct answer is **C**. For load testing, the runner should respect timestamps and replay at real-time rate, simulating actual production arrival patterns. For stress testing (pushing past realistic loads), the runner ignores timestamps and replays at maximum rate. The other options describe statement fields that don't influence arrival pacing.

    **Concept Tested:** LRS Load Testing

---

#### 10. The disengaged-learner archetype's statement stream is biased toward which verb pattern?

<div class="upper-alpha" markdown>
1. Many `experienced` with very few `attempted` or `completed`
2. Many `passed` with no `failed`
3. High `interacted` with frequent `progressed`
4. Many `voided` statements with corresponding StatementRefs
</div>

??? question "Show Answer"
    The correct answer is **A**. The disengaged-learner archetype opens the chapter, scrolls through quickly, attempts very few assessments, and abandons early. Their stream is short and biased toward `experienced` with very few `attempted` or `completed`. Many `passed` (B) describes fast learners. High `interacted` and `progressed` (C) describe mastery-seekers. Voided statements (D) describe an unrelated retraction pattern, not an archetype.

    **Concept Tested:** Disengaged Learner Archetype

---
