# UC 01 Proposed Activity Diagram Fixes

## Purpose

This proposal refines [UC-01 Activity Diagram.png](UC-01%20Activity%20Diagram.png) against the written UC-01 and FR-18 in [the Phase 2 report](../Phase%202/SWE401-Phase2.docx), incorporating the user's clarification that technical explanations are included in the initial analysis response. The original image and Word report are unchanged. Report wording changes needed for consistency are specified below.

Use three swimlanes: Job Seeker, Skill Bridge AI System, and AI/NLP Service. Follow the lecturer's convention of no note symbols in the activity diagram.

## Start of the activity

Keep the first action as Select Analyze Job Description. Authentication remains an entry precondition. The user approved an explicit profile check inside UC-01: Check profile completeness, then Profile complete? A complete profile continues to the job description form. An incomplete profile displays missing fields and lets the user complete them or cancel. Completing and saving the profile returns to the check; cancelling reaches a flow final. Do not add a rounded action labeled User is logged in or Profile completed, because those describe states rather than actions.

No precondition note will be drawn. Authentication remains documented in the written use case.

## Merge clarification

A merge combines alternative incoming flows into one outgoing flow. UML does not require those incoming flows to originate from the same decision. It can combine the first passage through an activity with a later loop back to that activity.

In the original diagram, the first merge combines the initial submission with a corrected submission. Its semantics are valid, but separating those submissions into two actions makes the loop harder to read.

In the revised layout, use a single Enter or edit job description and submit action. Put a merge before this action to combine initial entry from the displayed form with the correction path. The correction path therefore visibly returns to input, followed by fresh validation. Remove the visible default label MergeNode.

Reference: [Sparx Systems UML merge documentation](https://sparxsystems.com/enterprise_architect_user_guide/17.2/modeling_languages/merge_node.html).

## Input and validation

1. Job Seeker: Select Analyze Job Description.
2. System: Display job description input form.
3. Merge M1: Combine initial entry and the correction loop.
4. Job Seeker: Enter or edit job description and submit.
5. System: Validate submitted description.
6. System decision: Input status?
   * [empty]: Show Please enter a job description.
   * [over 1500 words]: Show Maximum length is 1500 words.
   * [valid]: Continue to the analysis request.
7. Merge M2: Combine the two validation error paths.
8. Job Seeker decision: Correct description or cancel?
   * [correct]: Return to M1, then enter or edit and submit again.
   * [cancel]: End the activity.

The validation guards are mutually exclusive: empty input, nonempty input over the limit, and nonempty input within the limit. Exactly 1500 words is allowed. The decision records the result of the preceding validation action.

## Analysis and service failure

1. Merge M3: Combine the valid input path with the analysis retry path.
2. System: Send job description for analysis.
3. AI/NLP Service: Analyze job description and generate skills analysis with plain English terminology explanations.
4. AI/NLP Service: Return detailed analysis results.
5. System: Handle analysis response or request failure.
6. System decision: Analysis successful?
   * [yes]: Organize and display required and nice to have skills, highlighting terms with prepared explanations.
   * [no]: Show analysis error and offer retry or cancel.
7. Job Seeker decision after the error: Retry analysis?
   * [yes]: Return to M3 and resend the already validated description.
   * [no]: End the activity.

For the redraw, route a service error response to the same system outcome handling step. An unavailable service or timeout also leads to that step through the request failure path; it must not depend on receiving a successful response first. At this level, Handle analysis response or request failure abstracts response and timeout handling rather than introducing low level networking nodes.

The AI action must name the expected output. Generate response alone is too vague. Skill extraction remains part of the operation even when the service generates a structured response.

## Explanations included in the analysis response

### What the report requires

FR-18 is a Should requirement. Its current wording refers to plain English explanations of technical terms or skills selected from a job description. The written UC-01 normal course explicitly says the job seeker may select technical terms after reviewing the extracted skills, followed by the system displaying explanations. Its postcondition also refers to selected terms.

The elicitation findings also call for plain language explanations more generally. The user has clarified that the intended feature is a detailed initial response that already explains relevant technical terminology. This clarification replaces the previous interpretation of an optional explanation request. The report wording must be aligned with that intent.

### Final agreed behavior

The AI/NLP service generates the extracted skills and relevant plain English terminology explanations in the same analysis response. The application displays the analysis and highlights terms with available explanations. Hovering over, focusing, or selecting a highlighted term reveals its prepared explanation. This requires no additional AI call. This final agreement supersedes the earlier proposal to display every explanation immediately.

For example, REST API appears as a highlighted skill. Interacting with it reveals: A way for applications to communicate over the web using HTTP requests. The explanation is already present in the received analysis data.

Replace Select a term with View a term explanation? On the yes branch add the user action Hover over or select a highlighted term, followed by the system action Display the prepared term explanation. Return to reviewing results through a merge. The no branch continues to saving. No connection returns to the AI service.

FR-18's Should priority describes feature prioritization. It does not mean the activity must offer the job seeker a choice about whether explanations appear.

### Revised successful flow after analysis

1. System: Display extracted skills and highlight terms with explanations.
2. Merge the initial review path and the return after viewing an explanation.
3. Job Seeker: Review extracted skills and analysis results.
4. Job Seeker decision: View a term explanation?
5. If yes, Job Seeker: Hover over or select a highlighted term.
6. System: Display the prepared term explanation, then return to the review merge.
7. If no, System: Save job description and analysis results to history.
8. End the activity.

The loop allows multiple terms to be explored using the same response. As requested by the user, place flow final nodes, circles containing an X, directly below Correct input? and Try again? on their no branches. Use exactly one activity final bullseye after successful saving. The cancellation paths do not use activity final nodes or long routes to a shared ending.

### Corresponding report wording fixes

* FR-18 proposed wording: SkillBridge shall allow the job seeker to hover over or select a highlighted technical term or skill and view its plain English explanation, generated as part of the initial job description analysis. Retain the current Should priority unless separately revised.
* UC-01 service analysis and return steps: State that the AI/NLP service generates and returns skills analysis including terminology explanations.
* UC-01 results display step: State that the system displays extracted skills and highlights terms with available explanations.
* UC-01 review step: Retain optional term exploration and specify hover or selection of a highlighted term.
* UC-01 explanation display step: Clarify that it reveals an explanation already generated in the initial response, without another AI request.
* UC-01 postcondition: Relevant terminology explanations are available from the analysis response and displayed when the user interacts with highlighted terms.

These are proposed edits for the Word report. Only the Markdown references have been updated at this stage.

## Saving and ending

After the user finishes review, the system saves the description and analysis results to history and the activity ends. This retains the sequence in the written UC-01. Keep separate end paths for cancellation before successful analysis.

Saving immediately after successful analysis is an alternative design, but would change the written sequence. It is not included in this proposal.

## Compatibility scope resolved

The user confirmed that UC-01 generates and saves analysis results, and UC-02 is a separately selected Calculate Compatibility Score function afterward. UC-02 includes display and saving of compatibility results. It does not repeat the profile completion workflow, which belongs before analysis in UC-01. The report replacements and corrected use case model are recorded in [Use Case Review](../Use%20Case/Use%20Case%20Review.md). The UC-01 HTML now explicitly checks the profile and provides completion, saving, rechecking, and cancellation paths before the description form.

## Redraw checklist

* Retain the three responsibility lanes.
* Use no note symbols.
* Keep login outside this use case and start with selecting the feature.
* Use one action for initial and corrected input.
* Keep validation messages specific and resubmit through validation.
* Merge alternative paths before shared actions, including input and request retry loops.
* Remove default MergeNode labels from the visible diagram.
* Make analysis output and service outcome handling explicit.
* Include relevant terminology explanations in the initial AI analysis response.
* Display skills and highlight terms that have prepared explanations.
* Show optional term exploration as a user action and local system display, returning to review.
* Align FR-18, the UC-01 normal course, and its postcondition with the clarified behavior.
* Save once review is finished, following the written UC-01 sequence.
* Keep compatibility calculation separate from UC-01, as agreed.

## HTML diagram

[Open the refined HTML diagram](UC-01%20Activity%20Diagram.html). It follows the supplied Chapter 5-C lecture notation and uses three vertical swimlanes, one initial node, three flow final nodes, and one activity final node. Profile completion, input correction, analysis retry, and explanation review have separate routes. The warm ivory, olive, and copper theme distinguishes actions and decisions while preserving their UML shapes. Fit screen sizes the entire diagram to the available viewport; Readable size maintains larger labels when fitting would shrink them too much. Screenshot view hides controls and fits the diagram; Escape restores controls. No UML note symbols are used.

The compact layout combines service analysis and response generation in one AI action and routes the response to the system's Handle response or request failure action. That system action abstracts response and timeout handling. Skills are still grouped as required and nice to have when displaying results, even though the compact display node uses the shorter label Display skills.

## Readability revision

The latest HTML uses a single Valid input? decision after checking for empty input and the 1,500 word limit. Invalid input produces the appropriate error message and leads to Correct input? in the user lane. The yes path returns to the input merge; the no path ends at a flow final immediately below the correction decision. This retains both validation rules without separate empty and length decision diamonds.

The correction path loops beside input entry without running above Select Analyze Job Description. The added profile completion loop returns below that starting action. Action labels use short phrases and readable spacing. Shapes are checked for overlap, flows for crossings and passages through action boxes, and rendered labels for fit. Readable size may require scrolling now that profile completion is explicit, while Fit screen provides a complete overview.

## Profile workflow alignment

The original Word report lists a completed profile as a precondition. With the approved visible completion workflow, revise the written entry condition so an authenticated user can select UC-01 with an incomplete profile. Profile completeness is then an enforced gate before the description form and AI request. The required profile information is skills, qualifications, and work experience as defined in FR-09. Do not repeat this completion branch in UC-02. The Word report itself has not been edited in this update.

Compact labels are abstractions of the same behavior: Send text sends the validated job description, Receive result or failure includes timeout handling, Show prepared explanation reveals the cached definition for the selected term, and Save analysis saves the description and analysis results together.
