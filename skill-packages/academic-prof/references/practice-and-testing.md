# Practice, Testing, and Mastery

## In-session practice

Practice follows theory immediately enough to reinforce it, but not so quickly that the learner
only imitates the example.

Use:
- one worked example by the professor;
- one guided learner example;
- one less-scaffolded transfer example.

## Question design by skill

### Concept
"Why does this mechanism exist?"
"State the exact condition."

### Math
"Derive..."
"Compute..."
"Show the intermediate terms."

### Formal proof
"Prove or disprove..."
"Give a counterexample..."
"Show both directions."

### Construction
"Build a DFA/CFG/filter/subnet/routing table..."

### Trace
"Show every state/packet/iteration..."

### Code
"Complete the conceptual TODO..."
"Predict output..."
"Fix the bug and explain why."

### Interpretation
"What does this plot/diagram/table imply?"
"What does it not prove?"

### Transfer
"Same principle, new surface context."

## Dual-stage mastery files

When guided training and independent mastery artifacts are requested, default to two learner files. A request for standalone study notes and a solved bank uses a different structure; it is not automatically a mastery-test request. Keep cold-test solutions in a separate answer-key file if solutions are requested.

### File 1 — Guided Training

Purpose: build skill.

Contains:
- concise local theory;
- worked example;
- scaffolded questions;
- code/proof/construction hints;
- prediction prompts;
- immediate feedback hooks;
- one controlled comparison/edge case when relevant;
- viva prompts.

### File 2 — Mastery Test

Purpose: measure independent ability.

Contains:
- fresh values/data/language/context;
- fewer hints;
- no copied outputs;
- one complete unseen representative problem;
- one transfer problem;
- one debugging/misconception problem;
- viva questions after the attempt.

Subject-specific mastery examples:

#### DIP
File 1: guided convolution/filter implementation and visualization.
File 2: new kernel/image patch + reasoning + implementation/debug.

#### TOC
File 1: guided DFA/NFA/CFG construction.
File 2: unseen language requiring independent construction/proof.

#### CN
File 1: guided subnet/protocol trace.
File 2: new addressing/timing scenario + failure diagnosis.

#### AIML
File 1: guided derivation + implementation + experiment.
File 2: fresh numerical derivation + lower-scaffold implementation + interpretation.

## Error analysis

When reviewing learner answers, classify the first failure:

- definition;
- prerequisite;
- algebra;
- proof logic;
- construction logic;
- algorithm;
- code syntax;
- code semantics;
- data/shape;
- protocol sequencing;
- interpretation;
- transfer.

Then remediate that layer instead of reteaching the entire topic.

## Retrieval spacing

When the learner returns after a gap, begin with 1–3 short retrieval questions before continuing,
unless they ask to resume immediately.

Present these retrieval questions one at a time and review each before asking the next. During later topics, reuse earlier concepts through fresh contexts, combined mechanisms, and misconception checks. Select repetitions based on conceptual importance and learner errors rather than a fixed question quota.

## Repetition and question quality

Use several angles on a concept: definition and conditions, calculation, derivation/proof, comparison, interpretation, failure diagnosis, counterfactual, and transfer where relevant. Design as an advanced undergraduate professor, with complete givens and meaningful reasoning demands. Difficulty comes from thought, not ambiguity or tedious arithmetic.

Easy answers receive short explanations; harder answers receive progressively fuller reasoning after the attempt. Repair a weak answer at its first failed layer even when the question is nominally easy. Worked examples can repeat necessary principles without assuming the learner remembers another chat.

PYQs calibrate question style and depth but are stepping stones, not ceilings. Include foundational, comparable, and harder unseen questions within authorized scope. The learner's illustrative '+/-20%' is not a cap or measurable difficulty formula. Do not infer mastery from rereading solutions.

## Exam-mode switching

If an exam is near, shift from masterclass to:
- high-yield topic map;
- timed questions;
- PYQ-style transfer;
- error log;
- concise revision sheets;
- viva rapid-fire.

Do not abandon conceptual correctness for answer-pattern memorization.
