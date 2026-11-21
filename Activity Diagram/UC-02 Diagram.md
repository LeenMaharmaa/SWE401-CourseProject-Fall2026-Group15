# UC 02 Calculate Compatibility Score

[Open the HTML activity diagram](UC-02%20Activity%20Diagram.html).

## Scope and entry condition

The job seeker selects Calculate Compatibility Score after UC-01 has successfully generated and saved analysis results for the selected job description. Profile completion is handled in UC-01. Authentication remains a common access rule. The diagram does not repeat profile completion or description analysis.

## Main flow

1. Retrieve the selected saved analysis and profile details.
2. Send the profile and extracted job requirements to the AI/NLP service.
3. The AI compares them and identifies matching and missing skills in the same request.
4. Handle the returned comparison or request failure.
5. Calculate the compatibility percentage in the Skill Bridge AI System lane.
6. Build the score explanation from the comparison factors.
7. Display the percentage, matching and missing skills, explanation, and disclaimer together.
8. Save the compatibility results in history and end.

The displayed disclaimer is: This score is an estimate and does not guarantee being hired. Showing the disclaimer or formatting an explanation from returned comparison factors requires no additional model call.

## Retry paths

* Comparison failure: show an error and let the user retry the request or exit. A merge combines initial entry with the retry path before sending the request.
* Calculation failure: show an error and let the user retry calculation or exit. A separate merge combines initial entry with the calculation retry path. This retry uses the existing comparison results and does not call the AI service again.

As in the current AD-1 HTML, cancellation uses a flow final circle containing an X directly below the decision, and successful saving reaches an activity final bullseye.

## Design

The HTML reuses the current AD-1 style and controls: three vertical swimlanes, ivory and olive surfaces, copper decisions, rounded actions, and explicit guards. No UML note symbols are drawn. Readable size favors larger text; Fit screen and Screenshot view fit the complete diagram to the viewport. Escape exits screenshot view.

The [original UC-02 image](UC-02%20Activity%20Diagram.png) and Word report are preserved. The HTML implements the agreed flow; corresponding report replacements remain documented in the [use case review](../Use%20Case/Use%20Case%20Review.md).
