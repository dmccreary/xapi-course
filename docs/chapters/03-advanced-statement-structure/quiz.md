# Quiz: Advanced Statement Structure

Test your understanding of voiding, sub-statements, extensions, attachments, context activities, and reusable statement patterns with these review questions.

---

#### 1. How does a conformant LRS handle an erroneously-sent statement that needs to be retracted?

<div class="upper-alpha" markdown>
1. The LRS deletes the statement from storage
2. The Activity Provider edits the statement in place
3. A voiding statement references the bad statement's UUID
4. The LRS marks the statement as deleted in a separate column
</div>

??? question "Show Answer"
    The correct answer is **C**. A conformant LRS never deletes a statement. To retract one, the AP emits a voiding statement — a StatementRef with the verb `http://adlnet.gov/expapi/verbs/voided` pointing at the bad statement's UUID. The original statement remains in storage but is filtered from default queries. Statements are immutable in a conformant LRS, so editing is not allowed. Voiding preserves the audit trail while making the analytics layer behave as if the statement isn't there.

    **Concept Tested:** Statement Voiding

---

#### 2. Which `result` sub-fields are deliberately separate orthogonal booleans in xAPI?

<div class="upper-alpha" markdown>
1. score and duration
2. completion and success
3. response and extensions
4. raw and scaled
</div>

??? question "Show Answer"
    The correct answer is **B**. `completion` and `success` are deliberately separate booleans in xAPI. The standard's authors learned from SCORM, where conflating these two led to confused gradebooks. A learner can complete and pass, complete and fail, bail early but meet the bar (mastery exit), or bail without success. `score` and `duration` are different data types entirely. `response` is a string. `raw` and `scaled` are both numeric components of the score object.

    **Concept Tested:** Result Success vs Completion

---

#### 3. Which ISO 8601 duration string represents 47 seconds?

<div class="upper-alpha" markdown>
1. 47s
2. 47S
3. PT47S
4. P47S
</div>

??? question "Show Answer"
    The correct answer is **C**. ISO 8601 durations begin with `P` (period) and require a `T` separator before time components. `PT47S` parses as "period of time, 47 seconds." Lowercase `s`, missing prefix, or missing the `T` separator all fail to parse. A duration of three minutes twelve seconds is `PT3M12S`. The xAPI spec mandates ISO 8601 format for `result.duration`, so a malformed string will be rejected.

    **Concept Tested:** Result Duration

---

#### 4. A statement's main object is a quiz on factoring quadratics. The chapter that contains the quiz should be placed in which contextActivities bucket?

<div class="upper-alpha" markdown>
1. parent
2. grouping
3. category
4. other
</div>

??? question "Show Answer"
    The correct answer is **A**. The `parent` context activity is the activity that directly contains the object as a logical component. If the object is "Quiz on Quadratics," the parent is the chapter or unit that immediately contains it. `grouping` is for peer collections (e.g., all formative assessments), `category` declares profile conformance, and `other` is a catch-all. Picking the wrong bucket isn't a syntax error but creates slow-creeping analytics bugs.

    **Concept Tested:** Parent Context Activity

---

#### 5. What is the rule for a valid xAPI extension key?

<div class="upper-alpha" markdown>
1. It must be a short string in camelCase
2. It must be a full IRI in a namespace you control
3. It must be a UUID prefixed with the word `ext-`
4. It must match a value in the ADL extension registry
</div>

??? question "Show Answer"
    The correct answer is **B**. An extension key must be a full IRI in a namespace you own. `temperature` is not valid; `https://textbook.example.org/extensions/v1/code-trace` is. The value can be any JSON, but the LRS treats it as opaque. The chapter recommends versioning your namespace (`/v1/`) from day one and documenting all extensions in a single location. Camel-case strings, UUIDs, and ADL-registry lookups are not the rule.

    **Concept Tested:** Extensions (xAPI)

---

#### 6. How is a binary attachment (e.g., a PDF) physically delivered alongside an xAPI statement?

<div class="upper-alpha" markdown>
1. As a base64-encoded string inside the statement JSON
2. As a URL inside the attachment object that the LRS fetches
3. Through a separate REST endpoint after the statement is stored
4. As a separate part of a `multipart/mixed` HTTP POST, linked by SHA-2 hash
</div>

??? question "Show Answer"
    The correct answer is **D**. Attachments are delivered as actual binary blobs inside a `multipart/mixed` POST. The statement's attachment metadata block describes the artifact (contentType, length, sha2, usageType), and a separate part of the multipart request carries the bytes — linked by the matching SHA-2 hash. The LRS verifies the hash on receipt and rejects the statement if it doesn't match. URLs are not used (option B); base64 inlining is not the spec mechanism.

    **Concept Tested:** Attachment Object

---

#### 7. A teacher emits a statement saying "I observed Lin attempt the quadratics quiz." The act of Lin's attempt has not been previously written. How should it be encoded inside the teacher's statement?

<div class="upper-alpha" markdown>
1. As a SubStatement embedded as the object
2. As a StatementRef pointing to Lin's earlier statement
3. As a custom verb extension
4. As a separate top-level field
</div>

??? question "Show Answer"
    The correct answer is **A**. A SubStatement is a complete statement-shaped object embedded as the `object` of an outer statement. Use SubStatement when you want to describe a hypothetical or observed event inline. A StatementRef would only work if Lin's attempt had already been written as a separate statement (option B is for "this thing I already wrote down separately"). SubStatements cannot themselves contain SubStatements (no recursion) and cannot have id, stored, version, or authority.

    **Concept Tested:** Sub-Statement

---

#### 8. According to the chapter, which structural rule applies to SubStatements?

<div class="upper-alpha" markdown>
1. They can only appear inside voiding statements
2. They must always include a result object
3. They cannot contain other SubStatements (no recursion)
4. They are only valid for actor type Group
</div>

??? question "Show Answer"
    The correct answer is **C**. SubStatements have two structural rules: they cannot themselves contain SubStatements (no recursion — a sub-statement object's `object` must be a regular activity or a statement reference), and they cannot have an `id`, `stored`, `version`, or `authority` field, because those metadata fields belong only to the outer statement. The other options misstate xAPI rules.

    **Concept Tested:** Sub-Statement Rules

---

#### 9. A team is debating whether to invent a custom `clicked-button-A` verb or use `interacted` with a result extension. According to the chapter's guidance, which approach is preferred and why?

<div class="upper-alpha" markdown>
1. Custom verb, because it produces more specific analytics
2. Custom verb, because extensions are not interoperable
3. Canonical verb plus extension, because it preserves cross-platform interoperability
4. Either approach, because xAPI treats them equivalently
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter advises that a canonical verb plus an extension is almost always more interoperable than a brand-new verb. Custom verbs raise governance costs and break interoperability with off-the-shelf xAPI tools. Inventing per-element verbs (`clicked-button-A`, `clicked-button-B`) leads to verb sprawl, where dashboards must OR together many near-synonyms. Extensions on canonical verbs are exactly what extensions exist for.

    **Concept Tested:** xAPI Statement Patterns / Verb Selection

---

#### 10. After voiding a statement with UUID `fd41…`, a default `/statements` query is run. What does the LRS return?

<div class="upper-alpha" markdown>
1. Both the original and the voiding statement
2. Only the voiding statement; the original is filtered out
3. Neither statement; both are removed from default views
4. Only the original; voiding statements are hidden by default
</div>

??? question "Show Answer"
    The correct answer is **B**. After voiding, a default `/statements` query filters out the original (voided) statement but still returns the voiding statement itself. To see voided statements, the consumer must explicitly add `voided=true` to the query. The original is not deleted — it remains in storage and is recoverable on demand for audit purposes. This non-destructive cancellation preserves the audit trail while keeping the active analytics view clean.

    **Concept Tested:** Voiding Lifecycle

---
