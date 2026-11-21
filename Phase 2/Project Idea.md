# Skill Bridge AI Project Idea

## Purpose of this reference

Skill Bridge AI is an AI assisted career preparation platform that helps job seekers understand a job description, describe their actual experience professionally, see how their background matches a role, and prepare for its interview.

This Markdown file records the project understanding derived from [SWE401 Phase 2](SWE401-Phase2.docx), with subsequent user clarifications identified explicitly. It is a working reference for future discussion and activity diagram fixes, rather than a complete transcription of the report. Requirement and use case identifiers are preserved for traceability. Unresolved differences in the report are listed below and should be settled before changing affected flows.

## Source and project context

The current [use case review](../Use%20Case/Use%20Case%20Review.md) reviews major actor goals at the course assignment level. It retains combined Register / Sign In, avoids adding every supporting function as an oval, and records the necessary relationship and report wording corrections. The Word report still contains the original wording.

The source is the Skill Bridge AI Phase 2 report for SWE 401 Software Engineering at Abu Dhabi University, Fall 2026. Its sections cover the system context, requirements elicitation, actors, functional and quality requirements, use case modeling, three detailed use cases, requirement specifications, and an interview transcript.

The report lists the [project repository](https://github.com/LeenMaharmaa/SWE401-CourseProject-Fall2026-Group15). This reference is based on the local report; the remote repository has not been reviewed.

## The problem being solved

Job seekers often struggle to understand which job requirements are essential, connect coursework or previous experience to an employer's expectations, tailor their resume wording, and prepare for questions about a specific position. Career changers may have useful transferable skills without direct experience in the target industry. Students and graduates may have relevant projects or internships without much formal employment history.

Skill Bridge AI brings those preparation tasks together. Its central principle is to improve how a person's real background is understood and presented while keeping the person in control of AI suggestions. A compatibility percentage must be explained and presented as an estimate of fit.

## Who uses the system

| Actor or stakeholder | Role |
| --- | --- |
| Job Seeker | Primary actor. Registers, logs in, maintains a profile, submits job descriptions, uses AI assistance, reviews results, and manages saved data. |
| Fresh Graduate or Student | Specialized Job Seeker, with emphasis on coursework, projects, and internships. |
| Career Changer or Returning Worker | Specialized Job Seeker, with emphasis on transferable skills and explaining a career transition or return. |
| System Administrator | Manages accounts and access, monitors availability and logs, and responds to data protection requests. |
| External AI/NLP Service | Supporting system that analyzes text, compares background with requirements, rewrites experience, and generates interview questions, suggested answers, and guidance. |
| Developers and Database Manager | Technical stakeholders who maintain the application, database, and AI integration through maintenance interfaces. |

The specialized job seeker categories share the main Job Seeker behavior. The report also includes experienced professionals seeking growth in its target audience.

## System boundary and responsibilities

The Skill Bridge AI application manages authentication, profile and history records, input validation, requests to the AI service, presentation of results, and user review. In UC-02, the application calculates the final compatibility percentage and generates its explanation after receiving comparison results from the AI service.

The external AI/NLP service performs the requested language analysis. It is a supporting actor outside the application boundary. Activity diagrams should distinguish the job seeker's actions, the application's actions, and the external service's actions.

The context narrative mentions job discovery, but the detailed requirements concentrate on preparation around a job description supplied by the user. A job listings provider or recruiter integration is not specified as a detailed core workflow.

## Four main tasks

### Analyze a job description

The job seeker enters or pastes a job description. The application rejects empty input and descriptions longer than 1,500 words. Valid input is analyzed through the AI/NLP service to extract required skills and nice to have skills. As clarified by the user, the initial analysis response itself includes plain English explanations of relevant technical terminology. The application displays the skills and highlights terms whose prepared explanations can be revealed on hover or selection.

Final agreed interaction: the application highlights terms with prepared explanations. Hovering over or selecting a term reveals the explanation already included in the initial AI response. Repeated term exploration creates no extra model calls. This supersedes the earlier interpretation that every explanation is immediately visible. The report's selection behavior is retained, with clarification of when explanations are generated.

The agreed boundary is now explicit: UC-01 extracts and saves the job requirements. UC-02 separately compares them with the associated profile and calculates compatibility. Original report passages that calculate compatibility inside analysis need the replacements in the use case review.

### Optimize experience

The application improves the wording of the job seeker's experience using only the skills, qualifications, and work experience stored in their profile. The user can edit the suggested text and must confirm that they reviewed it before accepting it. Showing the original and suggested versions side by side is a Should requirement.

The intended benefit is professional wording that reflects actual experience. Unsupported skills, achievements, qualifications, or experience must not be introduced. The report provides requirements for this feature but does not give it a detailed use case sequence among UC-01 through UC-03.

### Calculate compatibility and display results

The system compares the profile with the extracted job requirements, identifies matching and missing skills, and shows a percentage with an explanation of what raised or lowered it. Technical skills, soft skills, qualifications, and transferable experience matter; simple keyword overlap is insufficient.

The job seeker selects Calculate Compatibility Score after successful analysis. The system calculates, displays, and saves the results, including the disclaimer that the score is an estimate and does not guarantee being hired. Saved results can later be viewed in My History. FR-22's original View Match Score wording must be replaced to match this agreement.

### Practice interview questions

The application uses a selected job description to generate relevant interview questions, suggested answers, and quick reference notes together through the AI/NLP service. The job seeker reviews the prepared materials and practices independently. The user has explicitly removed answer submission and AI evaluation from scope. The Word report's UC-03 feedback steps must be deleted, and its references to an answer template must be revised to suggested answers.

## Typical user journey

1. Accept the data consent notice and register, then log in.
2. Enter and save skills, qualifications, and work experience in the profile.
3. Select a task from the home page.
4. Submit a valid job description for analysis when needed.
5. Review required skills, optional skills, missing skills, and compatibility results as applicable.
6. Request improved wording for actual experience, edit it, review it, and confirm acceptance.
7. Review interview questions, suggested answers, and quick reference notes for the selected role.
8. Use My History to view saved records and delete records when desired.
9. Log out to end the session.

This is an overview of how the features relate. It does not establish a mandatory order for all four home page tasks. The timing of compatibility calculation remains an open modeling decision.

## Functional requirements reference

| ID | Requirement summary | Priority |
| --- | --- | --- |
| FR-01 | Require acceptance of a data consent notice before creating an account. | Must |
| FR-02 | Reject duplicate registration emails, passwords shorter than eight characters, and incorrect login credentials. | Must |
| FR-03 | Allow login with a valid email address and password. | Must |
| FR-04 | End the session and show the login page on logout. | Must |
| FR-05 | Restrict protected pages to authenticated job seekers. | Must |
| FR-06 | Show Analyze Job Description, Optimize Experience, Calculate Compatibility Score, and Practice Interview Questions. | Must |
| FR-07 | Accept entered or pasted job descriptions and reject empty submissions. | Must |
| FR-08 | Reject job descriptions longer than 1,500 words and explain the limit. | Must |
| FR-09 | Save profile skills, qualifications, and work experience; show an error for empty required information. | Must |
| FR-10 | Extract and list required skills and nice to have skills. | Must |
| FR-11 | Identify missing required skills, calculate compatibility, explain score factors, and display a disclaimer. | Must |
| FR-12 | Group analysis under Required Skills and Nice-to-Have Skills; group compatibility results under Score, Matching Skills, Missing Skills, and Explanation. | Must |
| FR-13 | Restrict resume optimization to information stored in the user's profile. | Must |
| FR-14 | Generate questions with suggested answers and quick reference notes for the entered job description in one preparation request. | Must |
| FR-15 | Display an error and a try again message for the AI service failures described in the report. | Must |
| FR-16 | Save job descriptions and analysis results; show stored profile and records in My History; support deletion and an empty state. | Must |
| FR-17 | Analyze a valid job description and extract required and nice-to-have skills; compatibility is handled separately by UC-02. | Must |
| FR-18 | Generate term explanations in the initial analysis response and reveal them when the user hovers over or selects highlighted terms. Clarify generation and display timing in the report. | Should |
| FR-19 | Allow the user to edit text after AI optimization. | Must |
| FR-20 | Show original and suggested text side by side. | Should |
| FR-21 | Require confirmation that the optimized text was reviewed before acceptance. | Must |
| FR-22 | Calculate and display compatibility when requested for the selected successfully analyzed description. View saved results through My History. | Must |

The rows above incorporate agreed revisions. Interview answer submission and evaluation are out of scope. Practice Interview Questions provides generated questions, suggested answers, and notes; no feedback use case or numbered feedback requirement is needed.

FR-15's source wording also mentions failure while saving entered data. The dependency of saving on the AI service is unclear and should not be assumed without clarification.

## Detailed use cases for the activity diagrams

### UC-01 Analyze Job Description

**Trigger:** The job seeker selects Analyze Job Description from the home page.

**Stated preconditions:** Authenticated user, completed profile, available AI/NLP service, and a job description to analyze.

**Approved entry workflow:** Authentication remains an entry precondition. The diagram now checks profile completeness after the user selects UC-01. If incomplete, it lists missing fields and offers completion or cancellation. Completing and saving the profile returns to the completeness check; cancelling ends the path at a flow final. Only a completed profile can proceed to the job description input form. Align the Word report's precondition wording with this visible workflow when revising it.

**Normal flow:**

1. The application checks whether the user's profile is complete.
2. If incomplete, the user can complete the missing fields, save, and return to the check, or cancel. A complete profile continues.
3. The application displays the job description input field.
4. The job seeker enters or pastes the description and submits it.
5. The application validates that it is not empty and is at most 1,500 words.
6. The application sends valid text to the AI/NLP service.
7. The service extracts skills and returns detailed analysis results including plain English explanations of relevant technical terms.
8. The application organizes and displays required and complementary skills and highlights terms with available explanations.
9. The job seeker reviews results and may hover over or select highlighted terms. The application reveals prepared explanations without further AI calls and returns to review.
10. The application saves the job description and analysis results in history.

Steps 1 and 2 reflect the approved profile check and completion workflow. Steps 7 through 9 reflect the final agreed terminology behavior. The report's term selection and explanation display remain applicable; generation timing and the hover interaction should be clarified.

**Exception paths:**

| Condition | Recovery or exit |
| --- | --- |
| Empty description at validation | Explain that a description is required. Accept corrected input and validate again, or exit. |
| More than 1,500 words at validation | Explain the limit. Accept shorter text and validate again, or cancel. |
| AI analysis failure | Show an error. Resend the description for analysis on retry, or exit. |

**Successful outcome:** Required and complementary skills are displayed, prepared terminology explanations are available through highlighted terms, and the description and detailed analysis results are saved.

### UC-02 Calculate Compatibility Score

**Trigger:** Job seeker selects Calculate Compatibility Score after successful job description analysis.

**Agreed feature precondition:** UC-01 has successfully generated and saved the analysis results for the selected job description. Profile completion belongs to UC-01, and its associated profile is available for comparison. Authentication remains a common access rule. Do not repeat a profile completion branch in activity diagram 2.

**Normal flow:**

1. The job seeker selects Calculate Compatibility Score after analysis.
2. The application retrieves the saved profile and extracted job requirements.
3. The application sends both to the AI/NLP service for comparison.
4. The service compares relevant skills, qualifications, and transferable experience, then identifies matching and missing required skills.
5. The application calculates the compatibility percentage from the comparison results.
6. The application generates an explanation of positive factors and missing skills.
7. The application displays the percentage, matching and missing skills, explanation, and hiring disclaimer.
8. The application saves the compatibility results in history.

**Exception paths:**

| Condition | Recovery or exit |
| --- | --- |
| AI comparison failure | Resend the profile and requirements for comparison on retry, or exit. |
| Percentage calculation failure | Repeat the calculation on retry, or exit. |

**Successful outcome:** The explained compatibility percentage and matching and missing skills are shown and saved, with the disclaimer.

### UC-03 Practice Interview Questions

**Trigger:** The job seeker selects Practice Interview Questions from the home page.

**Stated preconditions:** Authenticated user, available AI/NLP service, and an entered or saved valid job description.

**Normal flow:**

1. The application retrieves the job description selected by the user.
2. The application sends it to the AI/NLP service for interview preparation generation.
3. The service generates and returns role specific questions with corresponding suggested answers and quick reference notes in the same response.
4. The application displays the complete preparation materials.
5. The job seeker reviews the questions, suggested answers, and notes, then finishes.

**Exception paths:**

| Condition | Recovery or exit |
| --- | --- |
| No job description available | Ask the user to submit or select one and return to retrieval, or exit. |
| Question generation failure | Resend the description for generation on retry, or exit. |

**Successful outcome:** Questions, corresponding suggested answers, and quick reference notes are available for independent preparation. No user answer is submitted or evaluated.

## Requirement specifications

| Specification | Requirement | Important behavior |
| --- | --- | --- |
| SPEC-01 | FR-09 | Display profile fields, allow saving, and request completion of empty fields. |
| SPEC-02 | FR-11 | On a separate calculation request after analysis, retrieve its saved inputs, identify matching and missing skills, calculate a percentage, explain the factors, and display the disclaimer. |
| SPEC-03 | FR-14 | Generate interview questions, corresponding suggested answers, and quick reference notes in one response and display them together. |

## Quality requirements

| ID in source | Target or constraint |
| --- | --- |
| NFR-01 | Analysis and score within 20 seconds for at least 95% of requests, tested with at least 30 job descriptions of up to 1,500 words. |
| NFR-02 | Experience suggestions and interview guidance within 15 seconds for at least 95% of requests, with at least 30 requests per feature. |
| NFR-03 | At least four of five first time users complete each main task on their first attempt without assistance. |
| NFR-04 | Clearly grouped results and suggestions, with at least 80% of job seekers reporting that results are easy to understand. |
| NFR-05 | Invalid input and AI failures produce understandable errors while the application remains operational. |
| NFR-06 | Generated suggestions introduce no unsupported skills or qualifications in predefined profile tests. |
| NFR-07 | Matching considers technical skills, soft skills, and transferable experience, explains results, and labels the score as an estimate. |
| NFR-8 | A user cannot access another user's stored personal or career information, including through modified record identifiers. |
| NFR-9 | Collect only information necessary for the intended services. |
| NFR-10 | Users can view and delete saved data; its use is limited to providing the service, with retention and use explained in the privacy notice. |
| NFR-11 | Main functions support the latest Chrome, Edge, and Safari on desktop screens at least 1366 pixels wide. |

These are specified targets, not verified implementation results. NFR-8 and NFR-9 retain the report's numbering.

## Evidence behind the idea

Requirements were elicited through a survey with 56 responses and a semi structured interview with a banking professional considering a move into investment roles.

The survey highlighted demand for resume to job compatibility scoring, clear extraction of job requirements, identifying missing qualifications, and interview preparation for a specific role. Respondents also wanted control over AI wording and safeguards against fabricated qualifications and inappropriate use of personal data.

The interview emphasized transferable and soft skills, professional wording based on actual experience, explanations for low match scores, visible AI changes, acceptance or rejection of suggestions, and accessible deletion controls. Interview feedback also suggested mobile access, recruiter contact, and interview scheduling, but those suggestions are not all formalized in the core requirements.

## Open questions for the diagram review

1. **Compatibility boundary resolved:** Calculate Compatibility Score is a separate user initiated function after successful analysis and includes display and saving. Replace the original report's combined analysis and scoring wording. The use case diagram must not include calculation within analysis.
2. **UC-02 entry condition resolved:** Successful saved analysis is the feature precondition; keep profile completion in UC-01 and remove the duplicate UC-02 profile exception. Define profile changes and analysis association before implementation. UC-03's missing description entry handling still needs consistent wording.
3. **Terminology explanation behavior resolved:** Explanations are generated in the initial analysis response and revealed on hover or selection of highlighted terms. Keep optional term exploration in UC-01 and clarify that it makes no further AI calls. FR-18's Should priority remains unchanged, as does FR-20's Should priority for original versus suggested text comparison.
4. **Where does each retry return?** The report sometimes references a service processing step after describing a resend. The diagram must show the request being sent again before the external service processes it, and validation retries must use the corrected input.
5. **Which component computes the score?** UC-02 assigns comparison to the external AI service and final percentage calculation to Skill Bridge AI. The context description more broadly mentions similarity scores from the service. Preserve UC-02's explicit allocation unless a revised design is agreed.
6. **What is the matching formula?** The report specifies the comparison factors and explanations but does not define a weighting formula or numeric thresholds. Do not invent them in the diagrams.
7. **Interview preparation scope resolved:** The user removed answer submission, evaluation, and feedback. UC-03 generates questions, suggested answers, and notes; the user reviews the materials and finishes. Delete the original feedback steps, postcondition, and E3 exception from the report.
8. **How does experience optimization flow?** Requirements exist, but no detailed optimization use case is provided among the three documented sequences. Any future diagram should preserve profile based truthfulness, editing, review, and confirmation.
9. **What is the scope of job discovery and recruiter features?** The context mentions job discovery and the interview suggests recruiter contact and scheduling. These lack detailed core functional requirements. Mobile access is requested in elicitation, while NFR-11 formally targets desktop browsers.
10. **How do consent and saving interact?** Registration requires a consent notice and history requirements specify saving records. Elicitation also emphasizes retention control. The exact retention policy and consent granularity are not specified.

## Workspace organization

```text
SkillBridge/
  Phase 2/
    SWE401-Phase2.docx
    Project Idea.md
  Activity Diagram/
    UC-01 Activity Diagram.png
    UC-02 Activity Diagram.png
    UC-03 Activity Diagram.png
```

The original Phase 2 document is preserved in its dedicated folder. The activity diagram images remain in their existing folder. UC-01 has been reviewed and has a companion proposed fixes file; the original image is unchanged. The Word report also contains embedded figures; this Markdown explanation summarizes its written requirements and user clarifications and does not transcribe those images.

For later work, decide which additional files need Markdown companions individually. Keep each approved companion alongside its source, preserve original requirement and use case identifiers, and distinguish agreed changes from unresolved questions.
