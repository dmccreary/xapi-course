# Quiz: Privacy, Compliance, and Organizational Context

Test your understanding of FERPA, COPPA, GDPR, PII handling, retention policies, RBAC, and the organizational contexts xAPI deployments live in with these review questions.

---

#### 1. Which U.S. federal law specifically governs the collection of personal information from children under 13?

<div class="upper-alpha" markdown>
1. FERPA
2. COPPA
3. HIPAA
4. SOPIPA
</div>

??? question "Show Answer"
    The correct answer is **B**. COPPA (Children's Online Privacy Protection Act, 1998) applies to data collection from children under 13 and requires verifiable parental consent before collecting personal information. FERPA governs student educational records broadly. HIPAA covers health information. SOPIPA is California's state-level student privacy act, not a federal law. Schools can authorize collection on parents' behalf for educational use under COPPA's school-consent exception.

    **Concept Tested:** COPPA Compliance

---

#### 2. The chapter identifies three regions of an xAPI statement most likely to contain PII. Which combination is correct?

<div class="upper-alpha" markdown>
1. timestamp, stored, and authority
2. verb, object, and platform
3. actor, result extensions, and context extensions
4. registration, revision, and language
</div>

??? question "Show Answer"
    The correct answer is **C**. The actor (especially with `mbox` or `name` fields) is the most obvious PII surface. Result extensions are subtle — keystroke traces or essay responses can contain inadvertent PII. Context extensions accumulate organically (user-agent, geolocation, school name in parent activity titles) into a fingerprint. The other field combinations contain little to no learner-identifying information.

    **Concept Tested:** PII in xAPI Statements

---

#### 3. The data minimization principle would advise against doing which of the following?

<div class="upper-alpha" markdown>
1. Including a learner's real name in the actor object when the dashboard only needs an opaque ID
2. Using the `account` IFI with an opaque pseudonym
3. Trimming language tags from `verb.display` to only the languages displayed
4. Recording only the verb, actor, and object required by the spec
</div>

??? question "Show Answer"
    The correct answer is **A**. The data minimization principle is "collect only what you need for the stated purpose." Including a real name when only an opaque ID is needed violates the principle. Options B (opaque pseudonym), C (trimming unused languages), and D (collecting only required fields) all align with data minimization. The discipline pays off in faster privacy reviews and lower bandwidth.

    **Concept Tested:** Data Minimization Principle

---

#### 4. Which RBAC role pattern is appropriate for the emit clients of an Activity Provider?

<div class="upper-alpha" markdown>
1. Read access to all statements, no write
2. Write access to /statements only, no read
3. Full admin including voided statements
4. Read access to pseudonymized data only
</div>

??? question "Show Answer"
    The correct answer is **B**. The Activity Provider role writes to `/statements` and has no read access. This minimizes the blast radius if an emit credential is compromised — an attacker can't exfiltrate statements. Option A is the dashboard role. Option C is the admin role. Option D is the analytics role. Production deployments separate these to enforce least privilege.

    **Concept Tested:** Role-Based Access Control (LRS)

---

#### 5. A K-12 deployment with EU-citizen students enrolled is subject to which regulatory frameworks?

<div class="upper-alpha" markdown>
1. FERPA only
2. GDPR only
3. Both FERPA and GDPR (and possibly COPPA for under-13s)
4. Neither, since the students are enrolled in a U.S. school
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter explicitly notes that a K-12 textbook deployed in the U.S. with EU-citizen students enrolled is subject to both FERPA and GDPR. COPPA also applies if any students are under 13. GDPR applies to any data about EU residents regardless of where the data is processed. The "designing for the strictest applicable framework" rule is the simplest path that keeps you compliant in all of them.

    **Concept Tested:** GDPR Compliance / FERPA Compliance

---

#### 6. A struggling-pattern detection analysis identifies "easy content with high struggle." What does this combination most likely indicate?

<div class="upper-alpha" markdown>
1. The cohort is below grade level
2. The LRS is misreporting attempt counts
3. The content is poorly designed and needs revision
4. The content is appropriately difficult for mastery
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter distinguishes hard content with low struggle (well-designed) from easy content with high struggle (poorly designed). When content that should be easy generates many failed attempts before a pass, the design is the suspect — confusing instructions, ambiguous questions, broken UI. The instructional-design feedback loop is built to surface exactly this signal. Cohort ability or LRS bugs are far less likely than design issues.

    **Concept Tested:** Struggle Pattern Detection

---

#### 7. The chapter's recommended retention combination for most xAPI textbook deployments is what?

<div class="upper-alpha" markdown>
1. Identified statements forever; pseudonyms never used
2. Differential privacy with full GDPR right-to-be-forgotten
3. k-anonymity at k=1000 across all queries
4. Pseudonymization plus aggregation-only release plus truncated retention
</div>

??? question "Show Answer"
    The correct answer is **D**. For most xAPI textbook deployments, the right combination is pseudonymization (Chapter 5), plus aggregation-only release (only de-identified outputs leave the LRS), plus truncated retention (identified data lives only as long as needed). The fancier techniques like differential privacy or strict k-anonymity are usually not necessary. Retaining identified statements forever (option A) violates minimization. k=1000 (option C) is impractical.

    **Concept Tested:** Anonymization Strategies / Data Retention Policies

---

#### 8. A team is deploying xAPI in higher education for a course with EU enrollees. Which procurement path is typical and which framework applies?

<div class="upper-alpha" markdown>
1. Vendor signs a school district data policy; FERPA applies
2. Procurement passes through IRB, IT security office, and Privacy Officer; FERPA and GDPR both apply
3. No procurement review is required for higher education
4. Only COPPA applies because the deployment is online
</div>

??? question "Show Answer"
    The correct answer is **B**. Higher education procurement typically goes through an Institutional Review Board (IRB), an IT security office, and a Privacy Officer. FERPA still applies (most students are adults but FERPA persists), and GDPR applies because of EU enrollees. Option A describes K-12. Option C is wrong (procurement reviews are stricter, not absent). Option D is wrong (COPPA applies only to under-13s, who are rare in higher ed).

    **Concept Tested:** xAPI in Higher Education / University Data Governance

---

#### 9. Most cross-organizational xAPI deployments choose to aggregate at what level rather than follow individual learners across organizations?

<div class="upper-alpha" markdown>
1. Per-statement
2. Per-session
3. Per-organization (per-school, per-district)
4. Per-region
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter notes that most cross-org deployments don't try to follow individual learners — they aggregate at the organization level (per-school, per-district) and avoid the harder identity-mapping problem entirely. Following individuals across institutions requires a shared identity strategy that's rarely worth the effort. Per-statement and per-session aggregation are too granular to address cross-org identity. Per-region is too coarse to be actionable.

    **Concept Tested:** Cross-Organizational Interoperability

---

#### 10. Imagine designing an LMS-launched intelligent textbook for a U.S. K-12 district. The vendor will receive student records. According to the chapter, which contractual structure makes the vendor a "school official" under FERPA?

<div class="upper-alpha" markdown>
1. A signed school district data policy that specifies what data is collected, how it's protected, and who has access
2. A click-through Terms of Service accepted by each student
3. A general purchase order from the district business office
4. A FERPA exemption certificate from the U.S. Department of Education
</div>

??? question "Show Answer"
    The correct answer is **A**. The chapter explains that vendors operating xAPI infrastructure on behalf of schools are typically considered FERPA "school officials" if the relationship is contractually structured to make them so — typically through a signed school district data policy specifying data collection, protection, access, and deletion. Click-through ToS by students has no FERPA effect. A purchase order is not a privacy contract. The Department of Education does not issue FERPA exemption certificates for vendors.

    **Concept Tested:** FERPA Compliance / School District Data Policy

---
