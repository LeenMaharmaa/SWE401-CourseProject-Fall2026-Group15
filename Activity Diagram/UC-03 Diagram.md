# UC 03 Practice Interview Questions

[Open the HTML activity diagram](UC-03%20Activity%20Diagram.html).

## Final agreed scope

The AI generates interview questions, a suggested answer for each question, and quick reference notes in one preparation request. The application displays those materials. The user reviews them and practices independently. There is no user answer submission, answer validation, evaluation request, feedback display, or evaluation retry.

The job seeker is already authenticated. A submitted description is checked using the established nonempty input and 1500 word limit rules, or an existing valid description is selected. Input correction uses a local loop below the start. Generation failure offers retry or exit. The main activity final is at the bottom.

## Exact Word report updates

The source Word report is unchanged so the user can apply these replacements.

### FR-14

Replace the current requirement with:

SkillBridge shall generate interview questions based on the submitted job description, provide a suggested answer for each question and quick reference notes in the same AI response, and display the preparation materials to the job seeker.

Keep the existing Must priority. Suggested answers are examples for preparation and should not invent personal achievements or qualifications for the job seeker.

### UC-03 description

Replace with:

This use case describes how the job seeker uses Skill Bridge AI to prepare for an interview. The AI/NLP service generates questions specific to the selected job description, corresponding suggested answers, and quick reference notes. The system displays these materials for the job seeker to review and use for independent practice.

### UC-03 normal course

Replace the normal course with:

1. The job seeker selects Practice Interview Questions.
2. The system retrieves the selected valid job description.
3. The system sends the description to the AI/NLP service for preparation generation.
4. The service generates relevant interview questions, corresponding suggested answers, and quick reference notes.
5. The service returns the complete preparation materials to Skill Bridge AI.
6. The system displays the questions, suggested answers, and notes together.
7. The job seeker reviews the materials and the use case ends.

Remove the original steps 8 through 11 describing answer entry, evaluation, and feedback. Replace the original step 6 assigning answer template and note generation to the application with the AI generation and display responsibilities above. Update the Information for Steps column to match the new response contents.

### UC-03 postconditions

Replace with:

* Questions specific to the selected job description are generated and displayed.
* A corresponding suggested answer is displayed for each question.
* Quick reference notes are displayed for preparation.

Delete the original postcondition promising feedback on the user's answers.

### UC-03 exceptions

* Keep E1 for a missing description, with submit/select or exit. Validate new input before generation.
* Keep E2 for preparation generation failure. Retry returns to sending the description at revised step 3, or the user exits. Update its wording to cover the preparation materials, not questions alone.
* Delete E3, AI/NLP service fails to provide feedback, including both retry and continue branches.

### SPEC-03 and its flowchart

Replace references to answer template with suggested answers. State that the AI generates questions, suggested answers, and notes together and the system displays them. The existing flowchart's generation and display steps should name all three outputs. No evaluation branch is required.

### Other consistency checks

* FR-15 can continue to cover interview preparation generation failure. Do not add answer evaluation failure handling.
* Where NFR-02 says interview guidance, clarify that the measured output is the generated questions, suggested answers, and notes. No evaluation timing requirement is needed.
* Keep Practice Interview Questions as the agreed home page and overview use case name. The name does not require an answer submission interface.
* Historical survey and interview statements requesting feedback should remain faithful to the participants. Identify that capability as outside the selected project scope wherever the report turns those findings into planned system behavior.

## Current successful activity flow

Select Practice Interview Questions, select or submit a description, validate it, generate preparation materials, display them, review them, and end.

One generation request produces all preparation materials. A failed generation may be retried, but reviewing the suggested answers causes no additional AI calls.

## Design and file status

The HTML uses the same vertical swimlanes, ivory and olive surfaces, copper decisions, rounded actions, and controls as AD-1 and AD-2. The successful endpoint is at the bottom. Cancellation retains flow finals containing X. No UML note symbols are drawn.

Readable size, Fit screen, Screenshot view, zoom, print, and Escape behavior match the other diagrams. The original Word report and original UC-03 image are preserved. The Project Idea and Use Case Review Markdown references reflect the final scope.
