# Skill Bridge AI Class Diagram

[Open the editable class diagram](classDiagram.drawio).

## Scope

This model follows the agreed project scope and the updated UC-01, UC-02, and UC-03 sequence diagrams. It uses a light canvas with the original terracotta, gold, and blue color families, dark text, and separate attribute and operation compartments.

The original 23 classes are retained or consistently renamed. Five classes already represented by the sequence design are added: ScorePage, ScoreController, CompatibilityResult, PracticePage, and JobSeekerProfile. The final model has 28 classes.

## Main corrections

* AnalysisController coordinates description analysis. ScoreController coordinates compatibility comparison, score calculation, and explanation generation. AnalysisPage and ScorePage represent their separate interfaces.
* AnalysisResult holds required skills, nice-to-have skills, and prepared terminology explanations. Percentage and score explanation are held in CompatibilityResult together with matching and missing skills.
* Profile fields move from JobSeeker into its owned JobSeekerProfile, matching sequence diagram 2. Account credentials and consent remain in JobSeeker. Profile fields are not duplicated.
* InterviewPracticeController is renamed PracticeController, and InterviewPreparationMaterials is renamed InterviewMaterials, matching sequence diagram 3.
* InterviewQuestion holds questionText and suggestedAnswer. InterviewMaterials holds quickReferenceNotes and contains one or more InterviewQuestion objects.
* Answer submission, evaluation, feedback, and improvement suggestion fields and operations are removed. AINLPService generates the complete preparation response in one request.
* TechnicalTerm holds explanations already prepared during analysis. The page displays these locally rather than calling a separate AI explainTerm operation on hover.
* ExperiencePage includes comparison, editing, and review confirmation. OptimizedExperience retains both versions and a reviewed flag.
* Important operation names match the receiving classes in the sequence diagrams. Spelling and missing parentheses are corrected. Internal controller calculations and validation are marked private.

## Relationship choices

Dashed arrows represent use dependencies, without unnecessary instance multiplicities on controller and interface interactions. Solid associations and multiplicities describe the domain data.

JobSeeker owns one JobSeekerProfile and has one History collection, which may be empty. History links to zero or more saved descriptions, analysis results, and compatibility results. This makes the collection interpretation explicit rather than treating History as a single saved analysis entry.

AnalysisResult refers to the analyzed JobDescription. CompatibilityResult refers to its source AnalysisResult. InterviewMaterials refers to its source JobDescription and owns its generated questions and answers. OptimizedExperience refers to the profile supplying the real background.

Skill is reused for candidate skills, extracted requirements, and matching or missing skills. Role-specific lists in the owning data classes distinguish those uses. TechnicalTerm instances and their explanations belong to the analysis result that prepared them.

FreshGraduate, ReturningWorker, and CareerChanger retain their existing fields and specialize JobSeeker. Hollow triangle arrows point toward the superclass.

## Verification and status

All 23 operation calls across the updated sequence diagrams were checked against the receiving classes and have matching methods. The native draw.io viewer was used to inspect the light rendering and compartment layout.

The diagram implements the agreed revisions. The original Word report still needs the previously documented wording updates, particularly the separate compatibility function and generated interview answers without evaluation. No Word report or sequence diagram was edited in this class diagram task.

An original draw.io backup is retained in the Backups folder. The supplied PNG is unchanged.

## Visual organization

The original source backup supplies the layout reference. Experience optimization remains at the upper left, analysis near the center, interview preparation on the right, and account and history classes at the lower left. The three JobSeeker specializations remain beneath the user/profile area. Positions are spaced to fit the revised class contents rather than copied at the original smaller text scale.

PracticePage is placed above PracticeController. JobSeekerProfile is beside the existing account cluster, beneath JobSeeker. The new compatibility page, controller, and result form a row below the analysis area. All 28 classes retain their agreed attributes and methods.

Associations have short names and multiplicities near their endpoints. Dependencies use dashed arrows without repetitive uses labels. Connections route around class interiors. Remaining crossings use bridge arcs. Original terracotta, gold, and blue color families are retained on a white canvas.

Verification checks 28 classes, 43 relationships, unchanged class contents, association labels and multiplicities, no overlapping class boxes, and no line segments crossing a class interior. The native draw.io viewer was used for visual inspection.

The previous layout is preserved in Backups/classDiagram before restoring original placement.drawio.
