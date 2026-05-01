# Quiz: Verb Vocabulary Design and the ADL Verb Registry

Test your understanding of verb IRIs, the ADL Verb Registry, custom verb profiles, and the canonical verbs used inside intelligent textbooks with these review questions.

---

#### 1. What part of an xAPI verb is used by the LRS for indexing and matching?

<div class="upper-alpha" markdown>
1. The `display` map
2. The `id` (IRI)
3. The `name` field
4. The `prefLabel` element
</div>

??? question "Show Answer"
    The correct answer is **B**. The verb's `id` is the IRI, the globally unique identity that the LRS uses for indexing and queries. The `display` map provides human-readable labels in one or more languages purely for cosmetic purposes — dashboards render the display string, but the LRS matches and indexes on the IRI. Two verbs with the same IRI are the same verb regardless of display strings. There is no `name` or `prefLabel` field at the verb-component level.

    **Concept Tested:** Verb IRI

---

#### 2. The IRI `http://adlnet.gov/expapi/verbs/passed` belongs to which canonical registry?

<div class="upper-alpha" markdown>
1. Tincan Verb Vocabulary
2. ADL Verb Registry
3. cmi5 Verb Registry
4. xAPI Profile Server
</div>

??? question "Show Answer"
    The correct answer is **B**. The ADL Verb Registry lives at `http://adlnet.gov/expapi/verbs/` and contains the canonical, ADL-maintained list of standard verbs that the xAPI community has agreed to share. The Tincan vocabulary lives at `http://activitystrea.ms/schema/1.0/`. cmi5 reuses ADL verbs in its session-lifecycle profile. The xAPI Profile Server hosts custom profiles, not the canonical verb vocabulary itself.

    **Concept Tested:** ADL Verb Registry

---

#### 3. A learner manipulates a slider in a MicroSim, changing a parabola's coefficient. Which canonical verb best describes this event?

<div class="upper-alpha" markdown>
1. interacted
2. experienced
3. progressed
4. attempted
</div>

??? question "Show Answer"
    The correct answer is **A**. `interacted` is the canonical content-consumption verb for when a learner manipulates an interactive element — sliders, buttons, MicroSim controls. `experienced` describes observation or interaction without an explicit pass/fail outcome and is more passive. `progressed` describes forward motion through structured material. `attempted` is reserved for the start of an activity with a defined pass/fail outcome (like a quiz).

    **Concept Tested:** Interacted Verb

---

#### 4. According to the chapter, when should a new textbook deployment emit Tincan-vocabulary verbs?

<div class="upper-alpha" markdown>
1. Always, because Tincan is the original xAPI vocabulary
2. Only for social actions like commenting and sharing
3. Never; new textbooks should use the ADL Verb Registry
4. When integrating with cmi5 sessions
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter states explicitly that new textbooks should not emit Tincan verbs. The Tincan vocabulary predates xAPI and was inherited from a more general activity-stream specification. New deployments should use the ADL Verb Registry. Inheriting a deployment that uses Tincan verbs is fine (statements are immutable), but new emissions should switch to ADL. Mixed registries within one deployment makes dashboards confusing.

    **Concept Tested:** Tincan Verb Vocabulary

---

#### 5. In a typical learner journey through a chapter quiz, which sequence of verbs is correct?

<div class="upper-alpha" markdown>
1. completed → attempted → passed → scored
2. attempted → scored → passed → completed
3. interacted → completed → passed
4. experienced → attempted → completed → scored
</div>

??? question "Show Answer"
    The correct answer is **B**. The canonical sequence is `attempted` (learner starts the quiz), then `scored` (a score is recorded), then `passed` or `failed` (success outcome), then `completed` (the chapter or activity is finished). `passed`/`failed` always travel with `attempted` in temporal order. Option A reverses the ordering; option C omits the assessment outcome; option D scrambles the assessment-vs-completion semantics.

    **Concept Tested:** Verb Sequencing

---

#### 6. When designing a custom verb profile, where should the profile document live?

<div class="upper-alpha" markdown>
1. Inside the LRS as a privileged record
2. At a stable URL in a namespace the project owns
3. In the ADL Verb Registry under a project subfolder
4. In each statement's `extensions` field
</div>

??? question "Show Answer"
    The correct answer is **B**. A custom verb profile lives at a stable URL inside a namespace the project owns, contains both human-readable definitions and machine-readable JSON-LD metadata, and is referenced from statements via the `category` context activity bucket. The ADL Verb Registry is for canonical verbs only — projects cannot add to it. LRSs do not host profiles. Putting a profile in `extensions` confuses statement payload with vocabulary metadata.

    **Concept Tested:** Custom Verb Profiles

---

#### 7. Which of the following is the correct verb to emit when an Activity Provider closes a session cleanly under cmi5 conventions?

<div class="upper-alpha" markdown>
1. completed
2. abandoned
3. failed
4. terminated
</div>

??? question "Show Answer"
    The correct answer is **D**. `terminated` is the session-lifecycle verb for a clean session close by the Activity Provider. `abandoned` substitutes for `terminated` when the session ended uncleanly (timeout, tab close). `completed` is independent of session lifecycle and signals reaching the end of an activity. `failed` is an assessment outcome, not a session-lifecycle verb.

    **Concept Tested:** Terminated Verb

---

#### 8. A team minted five different verbs (`clicked`, `clicked-on`, `pressed`, `pressed-button`, `tapped`) for what is essentially the same UI event. According to the chapter, what is this anti-pattern called?

<div class="upper-alpha" markdown>
1. Verb sprawl
2. IRI overlap
3. Vocabulary drift
4. Profile pollution
</div>

??? question "Show Answer"
    The correct answer is **A**. Verb sprawl is the chapter's term for the most common verb-vocabulary mistake: letting every developer mint verbs ad-hoc, producing many near-synonyms for one event. Dashboards then have to OR them all together for any meaningful query. The chapter recommends picking a verb steward early and making verb additions a pull request, not a personal decision. The other terms are not formally defined in the chapter.

    **Concept Tested:** Verb Vocabulary Design

---

#### 9. A developer wants to record that a learner adjusted a physics simulation's parameters before running it. The ADL registry has no obvious match. Applying the verb-selection decision tree, what is the next thing to try before minting a custom verb?

<div class="upper-alpha" markdown>
1. Mint a custom verb immediately and document later
2. Use a Tincan verb because it has more options
3. Use an ADL verb plus a result extension that captures the parameter change
4. Skip emitting a statement until the spec adds a matching verb
</div>

??? question "Show Answer"
    The correct answer is **C**. The verb-selection decision tree's second step asks: "Is there an ADL verb that fits with an extension?" An ADL verb (like `interacted` or `experienced`) plus a result or context extension capturing the specific parameter change is almost always more interoperable than a brand-new verb. Option A skips the discipline; option B brings in a deprecated vocabulary; option D blocks shipping for no good reason.

    **Concept Tested:** Custom Verb Profiles / Decision Tree

---

#### 10. A textbook component wants to emit an `interacted` statement when a slider stops moving. According to the chapter's instrumentation pattern, what should the component itself NOT know?

<div class="upper-alpha" markdown>
1. The current slider value
2. Which verb describes the event
3. The learner's identity and the LRS endpoint
4. The activity IRI it represents
</div>

??? question "Show Answer"
    The correct answer is **C**. The instrumentation pattern keeps the component narrow: it knows what just happened in the UI (slider value, the activity IRI it represents) and which verb describes the event. The learner's identity, the LRS endpoint, authentication headers, and retry logic come from the surrounding page context and the shared client library. This separation concentrates verb-vocabulary decisions in a few well-reviewed files instead of scattering them across hundreds of components.

    **Concept Tested:** Interactive Component Instrumentation

---
