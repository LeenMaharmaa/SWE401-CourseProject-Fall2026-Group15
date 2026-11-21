# Skill Bridge AI Use Case Review

## Review scope

This review supersedes the earlier implementation level review. This is a course diagram of the major functions and actor interactions. Each functional requirement does not need its own oval. Keep the original model where its meaning and syntax are sound.

Sources: [Phase 2 report](../Phase%202/SWE401-Phase2.docx), its embedded [original use case diagram](Use%20Case%20Diagram%20Original.png), the written UC-01 through UC-03, and the agreed project clarifications. Original source documents and diagrams are unchanged.

## Overall result

The original diagram is broadly appropriate for the assignment. It needs one essential relationship correction, a consistent interview use case label, and report wording that matches the agreed boundaries. Splitting account access, adding logout and profile ovals, and expanding every supporting function are not required for this overview.

## Keep these elements

| Element | Assessment |
| --- | --- |
| Skill Bridge AI system boundary | Correct. Keep the title and keep use cases inside the boundary. |
| Job Seeker | Correct primary actor. Keep outside the boundary. |
| Fresh Graduate, Returning Worker, Career Changer | Valid specializations. Hollow generalization arrow points toward Job Seeker. They inherit its interactions. |
| AI/NLP Service | Correct supporting external actor. It supports analysis, compatibility comparison, experience optimization, and interview preparation. |
| Register / Sign In | Acceptable combined account access function at this overview level. No need to split it or add Log Out. |
| Enter Job Description | May remain as the existing included input function. Folding it into analysis is optional simplification, not a required correction. |
| Analyze Job Description includes Enter Job Description | Consistent with the written UC-01 input flow. Include arrow points toward Enter Job Description. |
| Analyze Job Description includes Extract Skills | Correct: extraction is part of analysis. Include arrow points toward Extract Skills. |
| Manage History | Appropriate major user function. Covers viewing and deleting saved records without extra ovals. |
| Existing actor associations | Keep associations with the functions each actor participates in. A clean individual line is easier to read, but shared line routing alone is not a substantive feature error. |

No administrator or database manager actor needs to be added to this user facing overview just because those stakeholders appear in the report.

## Essential relationship correction

Remove the include arrow from Analyze Job Description to Calculate Compatibility Score.

Agreed behavior:

1. UC-01 generates and saves analysis results from the submitted job description.
2. The user separately selects Calculate Compatibility Score.
3. UC-02 compares the profile with the extracted requirements, calculates the score, then displays and saves the results.

Both main use cases remain associated with Job Seeker and AI/NLP Service. Do not reverse the include arrow, replace it with extend merely to mean afterward, or add a sequence arrow. Document successful analysis as UC-02's precondition. Use case diagrams show functional relationships, not execution order.

An include relationship represents required incorporated behavior. Reference: [Visual Paradigm use case relationships](https://www.visual-paradigm.com/guide/introduction-to-use-case-diagrams/).

## Two consistency fixes

### Interview use case label

Keep Practice Interview Questions as the agreed overview label. Its final scope is generation of questions with suggested answers and quick reference notes for independent preparation. The user explicitly removed submission and evaluation of their answers. No additional overview ovals are required. Update the original UC-03 normal course and postconditions accordingly, and remove E3. See the [UC-03 report edits](../Activity%20Diagram/UC-03%20Diagram.md).

### Comparison under Optimize Experience

The existing Optimize Experience includes Compare Original and Suggested Text relationship can remain if the original and suggested versions are always displayed as specified by FR-20. Its arrow already points toward the included use case.

The report narrative currently calls comparison conditional. Align the narrative with FR-20 by saying the system displays both versions for review. FR-20's Should priority is a feature priority; it does not itself mean the user optionally triggers comparison at runtime. No new extend relationship or redesigned feature is needed.

## Necessary report alignment

| Location | Edit |
| --- | --- |
| FR-06 and task labels | Replace View Match Score with Calculate Compatibility Score. |
| FR-17 | Remove compatibility calculation. Retain analysis and extraction of required and nice-to-have skills. |
| FR-11 | State that compatibility is calculated when separately requested after successful analysis, and that its results include the score, matching and missing skills, explanation, and disclaimer. |
| FR-12 | Distinguish analysis output (required and nice-to-have skills) from compatibility output (score, matching and missing skills, explanation). |
| FR-22 | Replace the stored-score-only action with calculating and displaying compatibility for the selected analyzed description. Saved results remain available in My History. |
| Use Case Modeling paragraph | Replace the statement that analysis always calculates compatibility with the agreed separate-function behavior. Rename interview practice consistently and remove the claim that comparison only happens when needed. |
| UC-02 trigger and first step | Use Select Calculate Compatibility Score consistently. |
| UC-02 precondition | Analysis results for the selected job description have been successfully generated and saved. |
| UC-02 profile exception | Remove the repeated profile completion branch. Profile completion belongs to the UC-01 entry workflow. Renumber remaining exceptions. |
| SPEC-02 text and flowchart | Start with requesting compatibility for an already analyzed description. Retrieve existing extracted requirements rather than submitting and extracting the description again. |
| NFR-01 | Separate the measurement of analysis time from compatibility time, since they are independently requested operations. A revised numeric target is not needed to correct the overview diagram. |

Keep the agreed terminology interaction: explanations are generated in the initial analysis response and revealed on hover or selection. It needs no additional overview oval or AI call.

The disclaimer is a message displayed alongside the compatibility result: This score is an estimate and does not guarantee being hired. It needs no separate use case or interaction.

## Boundary for activity diagram 2

Precondition: Successful saved analysis is available for the selected job description.

Normal flow: Select Calculate Compatibility Score, retrieve saved requirements and profile, send the comparison request, identify and return matching and missing skills, calculate the percentage, display results with the explanation and disclaimer, then save them.

Keep comparison and calculation retries. Place merges before their shared retry destinations. Do not repeat profile completion or job description analysis.

The current UC-01 HTML assumes profile completion but does not draw a visible profile check. That is a documentation distinction, not a reason to expand the overview use case diagram or add the branch back into UC-02.

## Final recommended overview

Keep the original diagram structure with these main functions:

* Register / Sign In
* Enter Job Description
* Analyze Job Description
* Calculate Compatibility Score
* Optimize Experience
* Practice Interview Questions
* Manage History

Keep the existing supporting Extract Skills and Compare Original and Suggested Text use cases and their valid include relationships. Remove only the incorrect analysis-to-compatibility include relationship. No new top level functions or actors are required by this review.

## Status

This revised review is the current reference. Earlier recommendations to split account access, add separate logout/profile ovals, remove the comparison oval, or require an additional feedback requirement before proceeding are withdrawn as prerequisites for this assignment review. Detailed implementation decisions such as scoring weights and profile version handling are outside the scope of the overview correction.

The revised [Use Case Diagram HTML](Use%20Case%20Diagram.html) implements this overview: combined account access, the three actor specializations, separate analysis and compatibility, and the three retained include relationships. Color distinguishes core functions, account and records, and included functions; labels and line styles carry the UML meaning. Fit screen, zoom, screenshot view, and print controls support review and capture.

The Word report, original use case image, and activity diagrams are preserved. The report wording changes above still need to be applied to the Word report.
