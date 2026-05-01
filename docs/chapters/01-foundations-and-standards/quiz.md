# Quiz: Foundations of xAPI and the Learning Standards Landscape

Test your understanding of xAPI's history, the SCORM/AICC/CMI5/IMS family of standards, and how xAPI fits into the broader learning ecosystem with these review questions.

---

#### 1. Which three required components form the irreducible core of every xAPI statement?

<div class="upper-alpha" markdown>
1. Subject, Predicate, Object
2. Actor, Verb, Object
3. Learner, Action, Activity
4. Source, Event, Target
</div>

??? question "Show Answer"
    The correct answer is **B**. Every xAPI statement is built from an Actor (who did the thing), a Verb (what they did), and an Object (what they did it to). While option A names the grammatical equivalents and option C uses related vocabulary, the xAPI specification specifically names these three components Actor, Verb, and Object. Optional fields like result, context, and timestamp decorate this core, but Actor-Verb-Object is the irreducible triple.

    **Concept Tested:** xAPI Statement Triple

---

#### 2. What was the original working name of the project that became xAPI 1.0?

<div class="upper-alpha" markdown>
1. SCORM 2010
2. Project Tin Can
3. ADL Initiative
4. Learning Record API
</div>

??? question "Show Answer"
    The correct answer is **B**. In 2010, ADL funded a research project at Rustici Software to design SCORM's successor. The team ran a public design process under the working name Project Tin Can, an affectionate nod to the children's tin can telephone metaphor. The first stable release shipped in April 2013 as xAPI 1.0, and the project was formally renamed to the Experience API. The Tin Can API name persisted as a friendly community label.

    **Concept Tested:** Tin Can API History

---

#### 3. Which standard is described as a "profile on top of xAPI" that defines a strict session lifecycle for LMS launches?

<div class="upper-alpha" markdown>
1. SCORM 2004
2. IMS Caliper
3. CMI5
4. AICC HACP
</div>

??? question "Show Answer"
    The correct answer is **C**. CMI5 is a profile on top of xAPI that constrains how xAPI is used so an LMS can launch a course, supply credentials, and track a session lifecycle. CMI5 defines a small but rigid lifecycle: launched, initialized, passed/failed, completed, terminated (or abandoned). SCORM 2004 is a predecessor standard, IMS Caliper is a competing analytics standard from IMS Global, and AICC HACP is the older HTTP-AICC Communication Protocol.

    **Concept Tested:** CMI5 Profile

---

#### 4. Which version of SCORM achieved mass adoption to the point that "SCORM" without a version number usually means this version?

<div class="upper-alpha" markdown>
1. SCORM 1.2
2. SCORM 2004
3. SCORM 1.0
4. SCORM 3.0
</div>

??? question "Show Answer"
    The correct answer is **A**. SCORM 1.2, released in 2001, became the version that achieved mass adoption to the point that "SCORM" without a version number almost always means 1.2 in casual usage. SCORM 2004 added sequencing/navigation and was the better technical standard, but its complexity meant many vendors continued shipping SCORM 1.2 content because it "just worked." SCORM 1.0 was the initial release; SCORM 3.0 does not exist.

    **Concept Tested:** SCORM 1.2

---

#### 5. Which IMS standard handles the launch and identity hand-off when a learner clicks a tool link inside an LMS?

<div class="upper-alpha" markdown>
1. IMS Caliper
2. IMS QTI
3. IMS LTI
4. IMS Common Cartridge
</div>

??? question "Show Answer"
    The correct answer is **C**. IMS LTI (Learning Tools Interoperability) lets a learner click a link inside an LMS course and have that click open an external tool pre-authenticated, with the learner's identity and role wired up. IMS Caliper is an analytics standard (xAPI's competitor), and IMS QTI is the assessment item exchange format. LTI 1.3 / LTI Advantage modernized the protocol onto OpenID Connect and OAuth 2.0.

    **Concept Tested:** IMS LTI

---

#### 6. A team building an intelligent textbook needs to import quiz items from a publisher's question bank. Which standard would they use as the import format?

<div class="upper-alpha" markdown>
1. xAPI
2. CMI5
3. SCORM 2004
4. IMS QTI
</div>

??? question "Show Answer"
    The correct answer is **D**. IMS QTI (Question and Test Interoperability) is the standard for representing assessment items and tests as portable, vendor-neutral XML. It defines item types, scoring, and how item banks are exchanged between authoring tools and delivery platforms. xAPI describes behavior (what the learner did), not assessment content. CMI5 wraps xAPI for LMS launches. SCORM 2004 is a packaging format for courses, not an item-bank exchange format.

    **Concept Tested:** IMS QTI

---

#### 7. In what year was xAPI ratified as an IEEE standard (IEEE 9274.1.1)?

<div class="upper-alpha" markdown>
1. 2013
2. 2018
3. 2023
4. 2025
</div>

??? question "Show Answer"
    The correct answer is **C**. xAPI was ratified as IEEE 9274.1.1 in October 2023, graduating the specification from a community spec into a formal IEEE standard. The first stable xAPI release was 2013 (xAPI 1.0). I2IDL took over open-source stewardship in December 2025. The 2018 date does not correspond to a major xAPI milestone in this chapter.

    **Concept Tested:** xAPI Standards Lifecycle

---

#### 8. What is the primary design difference between IMS Caliper and xAPI?

<div class="upper-alpha" markdown>
1. Caliper uses XML while xAPI uses JSON
2. Caliper is prescriptive with fixed event types while xAPI is permissive with open IRIs
3. Caliper requires an LMS while xAPI does not
4. Caliper is older than xAPI by a decade
</div>

??? question "Show Answer"
    The correct answer is **B**. Caliper ships with a small fixed set of canonical event types (AssessmentEvent, MediaEvent, NavigationEvent) and a tightly constrained vocabulary, on the theory that constraint produces more comparable analytics. xAPI is permissive: any IRI can name a verb or activity type, with shared vocabularies as conventions rather than constraints. Both standards use JSON over HTTP. Caliper does not require an LMS, and xAPI predates Caliper by a year.

    **Concept Tested:** xAPI vs Caliper Comparison

---

#### 9. Which organization took over open-source stewardship of xAPI, the xAPI Profile Server, and TLA reference implementations in December 2025?

<div class="upper-alpha" markdown>
1. I2IDL
2. ADL
3. IEEE LTSC
4. 1EdTech
</div>

??? question "Show Answer"
    The correct answer is **A**. The Institute for Infrastructure and Interoperable Data in Learning (I2IDL), an independent nonprofit based in Savage, Maryland, launched in December 2025 to take over open-source stewardship of xAPI assets after changes at ADL. I2IDL is explicitly not a standards body; the IEEE LTSC continues to own the published standards. ADL was the original sponsor but no longer maintains these open-source assets. 1EdTech is the new name for IMS Global.

    **Concept Tested:** I2IDL Stewardship

---

#### 10. A deployment uses an LMS to launch a tool with the learner's identity attached, the tool emits behavior data to an LRS, and the LMS receives a final completion signal via a session lifecycle profile. Which combination of standards is in play?

<div class="upper-alpha" markdown>
1. SCORM 1.2 + AICC
2. QTI + Caliper + LTI
3. SCORM 2004 + Caliper
4. LTI + xAPI + CMI5
</div>

??? question "Show Answer"
    The correct answer is **D**. LTI handles the launch and identity hand-off from the LMS to the tool. xAPI carries the fine-grained behavior data from the tool to the LRS. CMI5 wraps xAPI in a session lifecycle so the LMS can know when the learner "completed" the activity. This is the modern stack for an LMS-integrated intelligent textbook. The other combinations either mix legacy standards or omit a required capability (launch, behavior, or lifecycle).

    **Concept Tested:** Learning Standards Ecosystem

---
