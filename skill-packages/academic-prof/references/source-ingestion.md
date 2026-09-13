# Source Ingestion and Course Contract

## Read before teaching

When course PDFs, PPTs, notes, assignments, notebooks, screenshots, or PYQs are supplied, inspect
them before teaching substantive content.

Extract:

### Syllabus structure
- units/modules;
- topic order;
- stated hours/weightage;
- prerequisites.

### Professor language
- notation;
- variable names;
- theorem naming;
- diagram conventions;
- algorithm pseudocode;
- code libraries;
- preferred formulas.

### Depth signals
Look for:
- derivations included in slides;
- proofs assigned;
- practical/lab exercises;
- numericals;
- implementation TODOs;
- long-answer questions;
- viva prompts;
- PYQ recurrence.

### Assessment signals
Infer whether the course rewards:
- exact definitions;
- mathematical derivation;
- proof;
- construction;
- code;
- calculations;
- diagrams;
- comparison tables;
- protocol tracing;
- debugging.

## Build an internal Course Contract

Use this structure internally:

- **Subject**
- **Primary source files**
- **Topic order**
- **Current learner level**
- **Notation**
- **Required formalism**
- **Required math**
- **Required code**
- **Required diagrams/constructions**
- **Question styles**
- **Lab/practical expectations**
- **Exam/viva emphasis**
- **Known professor-specific conventions**
- **Potential source inconsistencies**

Use the contract for the whole course unless later files supersede it.

## Source hierarchy

When conflicts occur:

1. Explicit current user instruction.
2. Current professor/course material.
3. Current assignment/lab specification.
4. Earlier course material.
5. Standard textbook convention.

If a lower-priority standard convention is pedagogically important, mention it after securing the
course convention.

## PPT/PDF discipline

Do not merely summarize slides sequentially.

Instead:
- reconstruct the concept map;
- identify missing connective tissue;
- teach those connections;
- preserve assessed formulas/definitions;
- convert slide fragments into coherent explanation;
- use figures/diagrams as evidence of intended depth.

## PYQ discipline

If past-year questions are provided:
- map each question to topic and skill type;
- infer repeated patterns and depth;
- use them to calibrate practice;
- do not overfit only to repeated questions;
- create transfer variants.

Analyze reasoning steps, assumptions, marks when supplied, question types, and topic combinations as well as recurrence. Distinguish actual PYQs from generated variants. Past patterns are evidence about available papers, not guarantees of future questions or ceilings on depth. Cover authorized topics even when absent from PYQs.

When the user asks for external B.Tech trends or a researched bank, use available official university/college papers and assignments to broaden question angles. Identify institution, course, year when known, and source links; filter everything through the home syllabus and course conventions. Do not invent trends, marks, or provenance. If sources/browsing are unavailable, disclose the gap. Routine live teaching need not start a new external-paper search for every question.


## Syllabus-defining sources vs reference sources

Classify uploaded sources before teaching.

### Syllabus-defining sources
These are allowed to determine what is in scope:
- explicit learner topic list;
- official syllabus/course outline;
- professor PPTs/PDFs/lecture notes;
- professor assignments/practicals/labs;
- PYQs provide evidence of past assessment, but do not independently override the current syllabus or authorize additional topics.

### Reference sources
These may deepen an already authorized topic but may not independently expand scope:
- textbooks;
- reference books;
- external articles;
- supplementary tutorials;
- documentation.

### Scope rule

A topic is teachable when at least one of the following is true:
- the learner explicitly asks for it;
- it appears in the syllabus;
- it is clearly covered/assigned in professor material.

If a textbook contains additional material, mark it `OUT_OF_SCOPE` and do not introduce it.

### Book-section retrieval rule

When a large reference book is provided:
1. identify the currently authorized topic from syllabus/professor material;
2. locate the corresponding book chapter/section;
3. retrieve only that section plus the minimum prerequisite context;
4. ignore neighboring chapters unless needed for a prerequisite bridge;
5. do not summarize or enumerate unrelated contents of the book unless the learner asks.

### Ambiguity rule

If a professor slide names a broad topic but the book divides it into many subtopics, infer scope
conservatively from what the professor actually discusses. If including a book-only subtopic would
materially change the course scope, ask the learner before including it.

### Prerequisite exception

A book-only prerequisite may be taught briefly if it is necessary to understand an in-scope topic.
Label it clearly as:

`Prerequisite bridge — not a separate syllabus topic.`

Do not turn the prerequisite bridge into a full additional unit.
