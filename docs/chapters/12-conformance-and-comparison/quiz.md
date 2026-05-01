# Quiz: Conformance Testing, Validation, and Competitive Standards Analysis

Test your understanding of xAPI validation, the ADL conformance suite, cmi5 lifecycle, SCORM mappings, and competitive standards analysis with these review questions.

---

#### 1. The chapter describes xAPI validation at three layers. Which layer focuses on whether `result.score.scaled` is in the range [-1, 1]?

<div class="upper-alpha" markdown>
1. Statement structure validation
2. Required field validation
3. Data type validation
4. Conformance test suite validation
</div>

??? question "Show Answer"
    The correct answer is **C**. Data type validation checks that every field has the right type and value range — including the scaled score being between -1 and 1, ISO 8601 timestamps, mailto: prefixes on mbox values, and language map shapes. Statement structure validation checks overall shape (which fields are present). Required field validation checks presence at every nesting level. The conformance test suite tests the LRS, not individual statement type rules.

    **Concept Tested:** Data Type Validation

---

#### 2. Why is the ADL conformance test suite NOT directly applicable to validating an Activity Provider (AP)?

<div class="upper-alpha" markdown>
1. Because the suite is closed-source
2. Because the suite tests the LRS, not the AP
3. Because the suite requires a paid license
4. Because the suite only runs on Windows
</div>

??? question "Show Answer"
    The correct answer is **B**. The ADL conformance suite exercises an LRS by submitting carefully-crafted statements and queries and verifying the LRS responds correctly. AP correctness is verified by a local validator plus end-to-end smoke tests that exercise representative emit paths. The suite is open source (option A wrong), free (option C wrong), and cross-platform (option D wrong).

    **Concept Tested:** ADL Conformance Test Suite

---

#### 3. The cmi5 session lifecycle requires statements in a specific order. Which sequence is correct?

<div class="upper-alpha" markdown>
1. launched → initialized → learning statements → terminated (or abandoned)
2. initialized → launched → completed → terminated
3. attempted → passed → completed → launched
4. completed → terminated → abandoned → initialized
</div>

??? question "Show Answer"
    The correct answer is **A**. The cmi5 session lifecycle is: launched (LMS started the session), initialized (AP finished setup), one or more learning statements (progressed/passed/failed/completed/scored), then terminated (clean close) — or abandoned, fired server-side when no terminated arrives within the timeout. The other sequences misorder the lifecycle states.

    **Concept Tested:** CMI5 Session Lifecycle

---

#### 4. SCORM 2004's `cmi.completion_status` value of `incomplete` should be mapped into which xAPI representation?

<div class="upper-alpha" markdown>
1. A `completed` statement with `result.completion: false`
2. A `failed` statement with no result
3. A `progressed` statement with `result.completion: false`
4. No statement should be emitted
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter's SCORM completion mapping translates `incomplete` into a `progressed` statement with `result.completion: false`. The `completed` verb is reserved for SCORM's `completed` value (option A is wrong). SCORM completion status doesn't map to `failed` (option B). `not attempted` maps to no statement, but `incomplete` does emit (option D wrong).

    **Concept Tested:** SCORM Completion Mapping

---

#### 5. According to the chapter, which is the strongest argument FOR xAPI vs proprietary analytics SDKs (Mixpanel, Amplitude, etc.)?

<div class="upper-alpha" markdown>
1. xAPI dashboards look better out of the box
2. xAPI is faster to integrate than any SDK
3. Vendor lock-in risk: statements emitted via proprietary SDKs belong to the vendor, while xAPI statements belong to your LRS
4. Proprietary SDKs do not support TLS
</div>

??? question "Show Answer"
    The correct answer is **C**. Vendor lock-in risk is described as the single biggest argument against proprietary SDKs and the single biggest argument for xAPI. Statements emitted to a proprietary SDK belong to that vendor; xAPI statements belong to your LRS, which you control. Proprietary SDKs typically have nicer dashboards out of the box (option A wrong) and are usually faster to integrate (option B wrong). Both support TLS (option D wrong).

    **Concept Tested:** Vendor Lock-In Risk / Proprietary Analytics SDKs

---

#### 6. A team is evaluating xAPI vs IMS Caliper for an intelligent textbook that lives outside any LMS. Which standard does the chapter favor for that scenario, and why?

<div class="upper-alpha" markdown>
1. Caliper, because it has a richer pre-defined ontology
2. xAPI, because it has broader non-LMS adoption and a more flexible verb model
3. Caliper, because it is required by 1EdTech-conformant LMSs
4. xAPI, because Caliper does not support JSON
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter's honest summary: xAPI is more flexible and cross-vertical with broader non-LMS adoption (corporate L&D, simulation, mobile, intelligent textbooks); Caliper has stronger LMS-vendor adoption and a richer pre-defined ontology. For a textbook outside an LMS, xAPI wins decisively. Caliper is not "required" by 1EdTech-conformant LMSs (option C wrong). Both standards use JSON (option D wrong).

    **Concept Tested:** xAPI vs IMS Caliper Comparison

---

#### 7. A team estimates that production-grade xAPI implementation (statement patterns, retry, offline queue, dashboards) typically takes how long?

<div class="upper-alpha" markdown>
1. 1-2 engineer-days
2. 6-9 engineer-months
3. 2-3 engineer-years
4. 8-12 engineer-weeks
</div>

??? question "Show Answer"
    The correct answer is **D**. The chapter cites 2-4 engineer-weeks for a basic implementation and 8-12 engineer-weeks for a production-grade one with statement patterns, retry logic, offline queues, and dashboards. Days are unrealistic for production-grade work. Months overstate the effort for a focused implementation. Years would be the timeline for a full LRS and analytics platform, not just AP instrumentation.

    **Concept Tested:** Implementation Cost Analysis

---

#### 8. A new AP starts up and queries `/xAPI/about`, which returns `{"version": ["1.0.3", "2.0.0"]}`. According to the chapter's version-negotiation contract, what should the AP do?

<div class="upper-alpha" markdown>
1. Use 2.0.0 because it is the newer version
2. Fail loudly and refuse to start
3. Proceed with 1.0.3 and log 2.0.0 for awareness unless explicitly upgraded
4. Use whichever version comes first in the array
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter's negotiation contract: if 1.0.3 is in the version array, proceed with 1.0.3 (the book's target). If 2.0.x is reported, log it for awareness but continue with 1.0.3 unless explicitly upgraded. Blindly using the newer version (option A) risks compatibility surprises. Failing to start (option B) is overly conservative when the supported version is present. First-element heuristics (option D) are unreliable.

    **Concept Tested:** xAPI Version Negotiation

---

#### 9. A team must defend choosing xAPI over SCORM 2004 to a procurement committee skeptical of new standards. Which is the most credible technical argument?

<div class="upper-alpha" markdown>
1. SCORM 2004 is browser-locked, content-package-bound, and tracks only completion + score + interactions, while xAPI removes those constraints and supports arbitrary verbs and extensions
2. SCORM 2004 cannot run on modern browsers
3. xAPI is endorsed by every major LMS vendor without exception
4. SCORM 2004 was deprecated by ADL in 2023
</div>

??? question "Show Answer"
    The correct answer is **A**. SCORM 2004 is browser-locked, requires a SCORM-aware LMS frame, and has a fixed vocabulary (completion + score + interactions). xAPI lifts all those constraints. The other claims are factually wrong: SCORM 2004 still runs on modern browsers, xAPI is not endorsed by all LMS vendors equally (some lean Caliper), and SCORM 2004 was not deprecated in 2023.

    **Concept Tested:** xAPI vs SCORM 2004 Comparison

---

#### 10. Two product managers debate "should we use cmi5 or xAPI?" The chapter's framing rejects this as a false comparison. Why?

<div class="upper-alpha" markdown>
1. Because cmi5 was never standardized
2. Because cmi5 IS xAPI with profile constraints, so the choice is whether to apply cmi5's constraints
3. Because xAPI cannot run inside an LMS
4. Because cmi5 only works on mobile devices
</div>

??? question "Show Answer"
    The correct answer is **B**. cmi5 is a profile *on top of* xAPI — same wire format, different rules of engagement. The real question is whether to apply cmi5's constraints (use cmi5 for LMS launch-and-completion contexts) or use plain xAPI without those constraints (for non-LMS textbook scenarios). Many deployments use both layers. cmi5 is fully standardized (option A wrong); xAPI runs anywhere including in LMSes (option C wrong); cmi5 is platform-agnostic (option D wrong).

    **Concept Tested:** xAPI vs CMI5 Comparison / CMI5 Differences

---
