# Quiz: Activities, Agents, and Learner Identity

Test your understanding of activity IRIs, activity types, agent and group objects, the four IFI forms, and pseudonymization with these review questions.

---

#### 1. Which property must an activity IRI have, regardless of who emits the statement?

<div class="upper-alpha" markdown>
1. It must include the learner's account name
2. It must be a globally unique, durable identifier in a namespace the project owns
3. It must be regenerated on every page render
4. It must be a UUID
</div>

??? question "Show Answer"
    The correct answer is **B**. An activity IRI is the globally unique, durable identifier for an activity. The same activity has the same IRI today, tomorrow, and in five years. It does not contain the learner's ID, the session ID, the build hash, or a timestamp. Including learner data (option A) or per-render IDs (options C and D) would break the IRI's "is this the same activity?" semantics — every emit would look like a different activity.

    **Concept Tested:** Activity IRI

---

#### 2. The xAPI `registration` field is what kind of value?

<div class="upper-alpha" markdown>
1. A string identifying the version of the activity
2. The learner's stable account name
3. A UUID that ties together statements describing one attempt at an activity
4. The platform name that emitted the statement
</div>

??? question "Show Answer"
    The correct answer is **C**. The `registration` field is a context-level UUID minted at the start of an attempt and attached to every statement emitted during that attempt. If a learner takes the same quiz three times, each attempt has its own registration UUID — the activity IRI stays the same, the registration changes. Option A describes `revision`. Option B is the actor IFI. Option D is the `platform` field.

    **Concept Tested:** xAPI Registration Field

---

#### 3. Which IFI type is described as "looks pseudonymous but is reversible if the attacker can guess the email"?

<div class="upper-alpha" markdown>
1. mbox
2. mbox_sha1sum
3. openid
4. account
</div>

??? question "Show Answer"
    The correct answer is **B**. `mbox_sha1sum` is the SHA-1 hash of an email address. It looks opaque but is reversible because an attacker who can guess plausible emails can hash each guess and compare. Treat it as obscured, not anonymized. `mbox` is direct identifying (no obscuring). `openid` identifies via an OpenID URL. `account` is configurable and the recommended default.

    **Concept Tested:** mbox_sha1sum Identifier

---

#### 4. A textbook ships in three platforms (web, embedded LMS frame, kiosk). Which xAPI field should the team use to slice analytics by host environment?

<div class="upper-alpha" markdown>
1. `context.platform`
2. `object.definition.type`
3. `context.registration`
4. `actor.account.homePage`
</div>

??? question "Show Answer"
    The correct answer is **A**. The `platform` field in the context object is a string identifying the host environment that emitted the statement. Slicing analytics by `context.platform` lets the team distinguish web sessions from kiosk sessions. `object.definition.type` classifies the activity (assessment, course). `context.registration` correlates statements within one attempt. `actor.account.homePage` identifies the identity provider, not the host platform.

    **Concept Tested:** Platform Field

---

#### 5. An identified group differs from an anonymous group in what specific way?

<div class="upper-alpha" markdown>
1. Identified groups have a `name` field; anonymous groups do not
2. Identified groups can have only two members; anonymous groups can have any number
3. Identified groups must include a learner email; anonymous groups must not
4. Identified groups have their own IFI; anonymous groups are identified only by their membership
</div>

??? question "Show Answer"
    The correct answer is **D**. An identified group has its own IFI (any of the four IFI forms) plus an optional member array — the IFI uniquely identifies the group itself. An anonymous group has no IFI and is identified only by its membership; the same set of members today and tomorrow is the same group. Both can have a `name` (option A). Group size is not constrained (option B). Email is not required for either form (option C).

    **Concept Tested:** Anonymous Group / Identified Group

---

#### 6. A textbook lets anonymous public visitors read without logging in but still wants per-reader analytics. Which IFI shape is most appropriate?

<div class="upper-alpha" markdown>
1. mbox using a generated `anon@example.org` email
2. mbox_sha1sum of the visitor's IP address
3. account with the textbook domain as homePage and a per-browser UUID as name
4. openid with a placeholder URL
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter explicitly recommends the `account` IFI for anonymous learner tracking: `homePage` is the textbook domain, `name` is a per-browser UUID minted on first visit and stored locally. This gives per-browser stability without ever associating to a real-world identity. Fake mbox addresses violate the IFI semantics. Hashing IPs is reversible and identifying. OpenID with a placeholder URL is not meaningful.

    **Concept Tested:** Anonymous Learner Tracking

---

#### 7. According to the chapter's pseudonymization framework, which property is NOT one of the four required for pseudonymization to work?

<div class="upper-alpha" markdown>
1. Stable
2. Opaque
3. Encrypted at rest with AES-256
4. Revocable
</div>

??? question "Show Answer"
    The correct answer is **C**. The four required properties of pseudonymization are: stable (same learner gets the same code), opaque (the code reveals nothing about the learner), one-way at the analytics tier (LRS and dashboard cannot recover the real identity), and revocable (the source can refuse future lookups). Encryption at rest is a separate hardening concern but is not part of the chapter's pseudonymization framework. Encryption alone doesn't make a value pseudonymous.

    **Concept Tested:** Pseudonymization

---

#### 8. Same learner, different devices: Lin uses the textbook on a desktop in the morning and a phone in the afternoon. Which property must hold for analytics to function?

<div class="upper-alpha" markdown>
1. Both sessions emit statements with the same actor IFI
2. Each device generates a different actor IFI to preserve privacy
3. The desktop emits agent statements; the phone emits group statements
4. Each device emits its own registration UUID for every statement
</div>

??? question "Show Answer"
    The correct answer is **A**. The non-negotiable property is that the same learner has the same actor IFI in every statement, across every device, across every session. If the IFI varies by device, Lin's record is shattered into pieces no analytics can stitch together. Teams achieve this by using a single source of truth for the learner ID — typically the LMS or identity provider. Registration UUIDs are per-attempt, not per-device.

    **Concept Tested:** Learner Identity Management

---

#### 9. The `revision` field on an activity is most useful for which analytics question?

<div class="upper-alpha" markdown>
1. "Which device did the learner use?"
2. "How many distinct attempts has this learner made?"
3. "Show me everyone who took version 2 of the quiz"
4. "Which platform emitted this statement?"
</div>

??? question "Show Answer"
    The correct answer is **C**. The `revision` field is a string identifying the version of an activity, useful when content changes over time and the analytics layer wants to slice by version. Question A is answered by `context.platform`. Question B is answered by counting distinct `context.registration` values. Question D is also `platform`. Conventionally, revision uses semver or a date.

    **Concept Tested:** Revision Field

---

#### 10. Why should a small-group lab statement use the agent IFI of one student rather than the group IFI for "Section 3"?

<div class="upper-alpha" markdown>
1. xAPI does not allow group actors at all
2. The actor is who did the action; Section 3 is a context, not the doer
3. Group IFIs are not indexed by the LRS
4. Section 3 must be encoded as the verb, not the actor
</div>

??? question "Show Answer"
    The correct answer is **B**. The actor is who did the action. If a single student in Section 3 took a quiz, the actor is that student — Section 3 belongs in `context.team` or as a grouping context activity. A group actor is appropriate only when the action itself was collective (a team submission). The xAPI spec allows group actors (option A is wrong); LRSs do index group IFIs (C); verbs name actions, not cohorts (D).

    **Concept Tested:** Group Object / Agent Object

---
