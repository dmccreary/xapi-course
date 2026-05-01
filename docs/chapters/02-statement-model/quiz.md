# Quiz: The xAPI Statement Model

Test your understanding of the anatomy of an xAPI statement, its required and optional fields, and the three ecosystem roles that move statements through the world.

---

#### 1. Which three fields are strictly required in every xAPI 1.0.3 statement?

<div class="upper-alpha" markdown>
1. actor, verb, timestamp
2. actor, verb, object
3. id, actor, object
4. verb, object, result
</div>

??? question "Show Answer"
    The correct answer is **B**. The xAPI 1.0.3 specification defines exactly three required top-level fields in every statement: `actor`, `verb`, and `object`. Everything else — including `result`, `context`, `id`, `timestamp`, `stored`, `authority`, and `version` — is either optional, set by the LRS, or technically required-but-defaulted. The `id` and `timestamp` will be supplied by the LRS if you don't include them, but only the actor-verb-object triple cannot be defaulted.

    **Concept Tested:** xAPI Statement Required Fields

---

#### 2. What does IFI stand for in the context of an xAPI actor?

<div class="upper-alpha" markdown>
1. Identity Functional Interface
2. Inverse Functional Identifier
3. Internal Foreign Identifier
4. Iterative Field Index
</div>

??? question "Show Answer"
    The correct answer is **B**. IFI stands for Inverse Functional Identifier. It's a value that uniquely identifies an actor across the entire xAPI ecosystem with no central registry. xAPI defines exactly four IFI types: `mbox`, `mbox_sha1sum`, `openid`, and `account`. An actor must use exactly one IFI. The "inverse functional" terminology comes from semantic web vocabulary where the property uniquely identifies its subject.

    **Concept Tested:** Actor Component / IFI

---

#### 3. Which xAPI ecosystem role POSTs new statements to the LRS?

<div class="upper-alpha" markdown>
1. Activity Consumer
2. Activity Provider
3. Authority Agent
4. Statement Auditor
</div>

??? question "Show Answer"
    The correct answer is **B**. The Activity Provider (AP) is the system that creates statements — your intelligent textbook, a simulation, a quiz tool. The AP detects a learning event, builds a conformant statement, and POSTs it to an LRS. The Activity Consumer reads statements back via GET (dashboards, recommenders, grade exports). "Authority Agent" and "Statement Auditor" are not formal xAPI roles.

    **Concept Tested:** Activity Provider

---

#### 4. Which statement-level field does the LRS always set itself, such that the client should not try to set it?

<div class="upper-alpha" markdown>
1. timestamp
2. id
3. actor
4. stored
</div>

??? question "Show Answer"
    The correct answer is **D**. The `stored` field is set by the LRS, never by the client. It records when the LRS received and persisted the statement. The client sets `timestamp` (when the learner experienced the event), should generate `id` (the UUID) for safe retries, and always sets `actor`. If a client tries to set `stored`, the LRS overwrites it silently. Confusing `stored` with `timestamp` is a common rookie mistake.

    **Concept Tested:** Stored Timestamp / Field Ownership

---

#### 5. A score has `raw: 3`, `min: 0`, `max: 4`. According to xAPI conventions, what is a reasonable `scaled` value?

<div class="upper-alpha" markdown>
1. 0.75
2. 3.0
3. 1.33
4. -0.25
</div>

??? question "Show Answer"
    The correct answer is **A**. The `scaled` value is normalized between -1.0 and 1.0. When `min` is 0, scaled equals `raw / max`, so 3 / 4 = 0.75. Option B is the raw score (out of range for scaled). Option C exceeds 1.0 (forbidden). Option D is negative, which would only occur in a punitive scoring system. Dashboards typically consume `scaled` because it normalizes performance across tests with different point structures.

    **Concept Tested:** Result Score

---

#### 6. A learner takes a quiz online while offline. The Activity Provider buffers statements and sends them six hours later. Which two fields will differ significantly?

<div class="upper-alpha" markdown>
1. actor and verb
2. id and version
3. timestamp and stored
4. authority and platform
</div>

??? question "Show Answer"
    The correct answer is **C**. The `timestamp` records when the learner experienced the event (the original quiz attempt time), while `stored` records when the LRS actually received and persisted the statement (six hours later, after sync). The gap between these two values is your offline-sync buffer in action. The actor, verb, id, and authority should remain constant. This distinction is critical for analytics that ask "when did the learner do this?" versus "when did we get the data?"

    **Concept Tested:** Timestamp vs Stored

---

#### 7. Which IFI type stores a `homePage` URL plus a `name` string and is the recommended default for new textbook deployments?

<div class="upper-alpha" markdown>
1. account
2. mbox
3. mbox_sha1sum
4. openid
</div>

??? question "Show Answer"
    The correct answer is **A**. The `account` IFI is a structured object containing a `homePage` URL (the identity provider's base URL) and a `name` string (the identifier within that system). It's the most flexible IFI and the recommended default because it pairs a stable namespace with an opaque identifier. `mbox` exposes the learner's email directly; `mbox_sha1sum` is reversible; `openid` is rare in practice today.

    **Concept Tested:** Account Identifier

---

#### 8. Why should an Activity Provider generate the statement's UUID client-side rather than letting the LRS mint one?

<div class="upper-alpha" markdown>
1. The LRS cannot generate UUIDs reliably
2. Client-side UUIDs are smaller in size
3. Client-generated UUIDs allow safe retry without creating duplicates
4. The xAPI spec forbids LRS-generated UUIDs
</div>

??? question "Show Answer"
    The correct answer is **C**. Generating the UUID client-side at the moment of the event lets you safely retry a failed POST without creating duplicates — the LRS rejects a second POST with the same ID rather than storing the same event twice. This is essential for offline-tolerant clients and unreliable networks. The LRS can mint UUIDs if absent (option D is wrong), and UUID size is identical regardless of source. The xAPI spec explicitly allows either party to set the id.

    **Concept Tested:** Statement ID (UUID)

---

#### 9. The four `contextActivities` buckets are `parent`, `grouping`, `category`, and `other`. Which bucket is the correct place to declare conformance to a custom verb profile?

<div class="upper-alpha" markdown>
1. parent
2. grouping
3. other
4. category
</div>

??? question "Show Answer"
    The correct answer is **D**. The `category` bucket declares conformance to a profile or vocabulary — it is how implementations advertise that they follow, say, the cmi5 profile or a custom vocabulary profile. `parent` is for the directly-containing scope, `grouping` is for peer activities the statement is grouped with, and `other` is the catch-all. Using the wrong bucket isn't a syntax error but creates slow-creeping analytics bugs that surface much later.

    **Concept Tested:** Category Context Activity

---

#### 10. A team is reviewing a statement that has `result.completion: false` and no `result.success` field. A junior developer concludes "the learner failed." What is the correct interpretation?

<div class="upper-alpha" markdown>
1. The learner failed because completion is false
2. The learner did not complete the activity, and success is unknown — not the same as false
3. The statement is invalid because success is required when completion is set
4. The LRS will infer success from completion
</div>

??? question "Show Answer"
    The correct answer is **B**. `success` and `completion` are deliberately separate, orthogonal booleans. Absent is not the same as `false` — most LRS query engines treat absent and false differently when filtering. Here, the learner did not complete the activity, but no judgment is being made about success. The statement is perfectly valid (option C is wrong); the LRS does not infer one field from another (option D is wrong). Junior developers who treat absent as false silently undercount completion rates.

    **Concept Tested:** Result Completion vs Success

---
