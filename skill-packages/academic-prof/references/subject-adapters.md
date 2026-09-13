# Subject Adapters

The universal protocol must adapt to the nature of the subject.

## Digital Image Processing (DIP)

### Core teaching modes
- visual intuition;
- 2D signal/math derivation;
- matrix/kernel calculations;
- frequency-domain reasoning;
- image transformations;
- optional Python/OpenCV/NumPy implementation;
- result interpretation.

### Typical topics
- image representation and sampling/quantization;
- intensity transformations;
- histograms;
- spatial filtering;
- convolution/correlation;
- Fourier transform and frequency filtering;
- noise/restoration;
- edge detection;
- segmentation;
- morphology;
- compression, depending on syllabus.

### Practice forms
- compute small convolution by hand;
- derive/interpret filter behavior;
- design or identify kernels;
- reason about padding/border effects;
- compare spatial vs frequency domain;
- inspect image artifacts;
- implement a filter;
- predict an output before running code.

### Do not
- reduce DIP to OpenCV API memorization;
- skip the underlying kernel/transform math where the course includes it.

## Theory of Computation (TOC)

### Core teaching modes
- definitions;
- language examples;
- automata construction;
- transition tracing;
- closure reasoning;
- equivalence;
- grammars/derivations;
- proofs;
- pumping lemma/Myhill-Nerode/TM reductions according to syllabus.

### Practice forms
- construct DFA/NFA/epsilon-NFA;
- convert automata;
- regex-language equivalence;
- minimize DFA;
- construct CFG/PDA;
- leftmost/rightmost derivation;
- prove closure/non-regularity/non-CFL;
- trace Turing machine;
- decidability/reduction reasoning.

### Code
Usually secondary. Use automata simulators/code only when it clarifies behavior, not as the default
learning mode.

### Do not
- present a few accepted strings as a proof;
- skip edge cases such as epsilon, dead states, or ambiguous interpretations.

## Computer Networks (CN)

### Core teaching modes
- layered mental models;
- packet/header anatomy;
- protocol state/sequence traces;
- timing and reliability mechanisms;
- numerical problems;
- subnetting/addressing;
- throughput/delay calculations;
- congestion/flow control;
- routing logic;
- optional socket/CLI/Wireshark-style labs when relevant.

### Practice forms
- trace packet movement;
- annotate headers;
- subnet calculations;
- RTT/throughput/delay numericals;
- TCP sequence/ACK windows;
- routing-table decisions;
- compare protocol behavior;
- diagnose packet loss/timeouts;
- small socket programs if course includes labs.

### Do not
- teach protocol names as disconnected facts;
- use code where a packet timeline or state diagram teaches the mechanism better.

## AI / ML (AIML)

### Core teaching modes
- motivation;
- formal model;
- probability/statistics/linear algebra/calculus as needed;
- algorithm derivation;
- worked numerical examples;
- implementation from scratch where pedagogically useful;
- library implementation after mechanism understanding;
- evaluation and experimental comparison.

### Practice forms
- derive update/objective;
- calculate a small example;
- implement core algorithm;
- debug leakage/shape/loss issues;
- compare metrics/models;
- interpret confusion matrix/ROC/etc.;
- design a fair experiment.

### Do not
- hide behind scikit-learn APIs before the learner understands the algorithm;
- force full derivations for topics the syllabus treats only conceptually.

## Algorithms / Data Structures

### Core teaching modes
- problem motivation;
- invariant;
- pseudocode;
- step trace;
- correctness;
- complexity;
- implementation;
- edge cases.

### Practice forms
- dry run;
- derive complexity;
- prove correctness/invariant;
- implement;
- debug;
- compare alternatives;
- unseen problem reduction.

## Mathematics / Statistics

### Core teaching modes
- definitions;
- derivations/proofs;
- geometric/probabilistic intuition;
- hand calculations;
- counterexamples;
- application.

### Code
Use only for simulation, verification, or visualization after the math.

## Operating Systems / DBMS / Software Systems

### Core teaching modes
- architecture;
- state/mechanism;
- timelines;
- invariants;
- scheduling/locking calculations;
- query/transaction execution;
- code/SQL/system calls where applicable.

## Unknown subject

If a new subject is supplied, classify each topic along these axes:

- `FORMAL_PROOF`
- `MATH_DERIVATION`
- `NUMERICAL`
- `CONSTRUCTION`
- `CODE`
- `EXPERIMENT`
- `SYSTEM_TRACE`
- `VISUAL`
- `FACTUAL_STANDARD`

Use the dominant axes to choose the teaching and practice method.
