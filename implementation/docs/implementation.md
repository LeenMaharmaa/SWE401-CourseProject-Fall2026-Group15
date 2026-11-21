# SkillBridge implementation notes

## Architecture

One local Next.js application contains the screens and server operations. SQLite stores records in a local file. Only the Gemini call leaves the laptop. `GEMINI_MODEL` chooses the model without changing the code. Dependencies are pinned by the tracked npm lockfile.

The code uses functions and TypeScript types to represent the existing boundary, control, and entity responsibilities. It does not require one JavaScript class per UML box.

| Design responsibility | Implementation |
| --- | --- |
| AnalysisPage and AnalysisController | Analysis screen, analyze and save analysis operations |
| ScorePage and ScoreController | Comparison, local calculation, explanation, display, and save operations |
| PracticePage and PracticeController | Description selection and one preparation request |
| ExperiencePage and OptimizeController | Profile based rewrite, side by side review, editing, and acceptance |
| JobSeeker and JobSeekerProfile | Separate accounts and profiles |
| AnalysisResult and CompatibilityResult | Separate analyses and compatibility records |
| TechnicalTerm | Explanations included in the stored analysis response |
| InterviewMaterials and InterviewQuestion | Structured materials with questions, answers, and notes |
| History | A query over the user's saved records rather than duplicated data |
| AI/NLP Service | Four focused server side calls to the Gemini SDK |

## Source alignment

Implementation follows the current use case HTML, UC-01 through UC-03 activity HTML, the UC-01 sequence page, revised standalone UC-02 and UC-03 sequence diagrams, and the current class diagram. The older interview page inside the combined sequence file is superseded by the standalone UC-03. The Phase 2 report contains historical wording; the existing Markdown reviews identify its required corrections.

| Requirements | Behavior |
| --- | --- |
| FR-01 to FR-06 | Consent, basic local signup and signin, logout, profile association, four home tasks |
| FR-07 to FR-10, FR-17, FR-18 | Nonempty description up to 1,500 words, profile completion before analysis, required and optional extraction, prepared explanations |
| FR-11, FR-12, FR-22 | Separate requested compatibility, matching and missing evidence, explanation, disclaimer, and saving |
| FR-13, FR-19 to FR-21 | Rewrite only from saved background, compare original and suggestion, edit, and confirm review before acceptance |
| FR-14 | One request returns questions, suggested answers, and notes, with no answer evaluation |
| FR-15, FR-16 | Understandable failures and retry, saved history, reopening and deletion |

UC-01 generates a draft, displays it, and saves it to history only after review. Drafts are excluded from history and compatibility selection. UC-02 compares once per attempt, calculates in application code, displays, and then saves. Local calculation and save retries reuse stored comparison data. UC-03 returns all preparation materials together. Additional automatic saving of interview materials and accepted suggestions is a convenience consistent with their data relationships.

## Database

Accounts own profiles and submitted descriptions. Analyses refer to descriptions. Comparisons refer to saved analyses and retain the profile used. Compatibility results refer to the analysis and comparison. Interview materials refer to their description; accepted suggestions retain their original profile context. Deleting an analysis cascades to its comparisons and compatibility results. A description is removed when no analysis or interview material needs it.

Generated lists are stored as validated JSON text within these relational records. Primary keys and foreign keys preserve associations. On startup, missing tables and the fictional demo account are created without resetting existing records.

## AI and scoring

Structured JSON is checked with Zod. Extracted requirement sources must occur in the job description. Direct and partial match evidence must occur in the saved profile. Every requirement must have exactly one comparison entry. Optimization source quotes must occur in the profile. These checks support factual grounding but do not prove every generated claim is correct; human review remains required.

The selected score gives required items weight 2, optional items weight 1, direct matches credit 1, partial or transferable matches credit 0.5, and unsupported items credit 0. Application code rounds 100 times earned weighted credits divided by available credits. The explanation uses those same factors. Empty usable requirement lists cannot produce a score. Duplicate extracted names are consolidated, with required items taking precedence.

The percentage is an estimate of documented fit, not a hiring probability. Recalculation uses the latest saved profile. Existing scores keep their original snapshot and scoring version.

Sample rehearsal mode is explicit and supports only the supplied description and profile. It never activates automatically after a failed AI request. All generated records retain their model or sample origin.

## Deliberate simplifications and source corrections

* Signup checks only that email contains `@` and password has at least six characters, as requested. The source class diagram and FR-02 still say eight and need synchronization. Account emails remain unique to make signin unambiguous.
* The approved compatibility weights are an implementation decision; the diagrams did not define a formula.
* Student categories share one profile implementation; separate subclass screens are unnecessary for these shared workflows.
* Hosting, recruiter features, interview evaluation, administrative dashboards, and statistical NFR studies are outside this local proof of concept.
* Original reports and diagrams are preserved. The previously documented corrections for FR-17, FR-22, UC-01 entry conditions, and UC-03 still need to be applied to the final course report.

The rubric calls for an implementation overview, source repository, clear setup instructions, and test evidence.

## Continuing with a selected role

After saving an analysis, Calculate compatibility explicitly starts UC-02 for that analysis. The score result offers Generate interview preparation for the same role. A contextual three step navigation bar carries the analysis identifier between screens without requiring another paste or selection. Navigation alone does not generate content, and interview preparation remains independently available. Saved score history retains its source analysis for this continuation; newly saved interview materials also retain that association. These conveniences preserve the separate use case boundaries.

The interface uses only SkillBridge branding, with no builder attribution watermark. References to Gemini, prepared suggestions, and labelled sample data describe product behavior.

## Generation timeout adjustment

Live troubleshooting reproduced a timeout with a short input. Requests now allow up to 90 seconds, use low thinking effort for extraction and generation, and medium effort for compatibility comparison on Gemini 3 and 4. A temporary HTTP 503 is retried once after two seconds. Timeouts and quota errors are not automatically retried. The job description limit remains 1,500 words. This runtime allowance does not establish that the report's response time targets have been achieved.

The default model is now Gemini 3.5 Flash-Lite. Hydrogen returned a high demand error even for a one word response request. Flash-Lite completed live extraction checks for both supplied job descriptions, a profile comparison, an experience rewrite, and interview materials. It remains subject to Google's service availability; transient 503 responses were also observed. This is a practical demo model choice, not a comparative accuracy benchmark.
