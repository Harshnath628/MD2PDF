---
name: md2pdf-study-docs
description: Create, reformat, or review Markdown for Harsh's MD2PDF app, combining study-document conventions with his md-to-pdf-formatting reference for GFM, tables, code, Mermaid, equations, page breaks, and print checks. Use for MD2PDF-ready notes, solved banks, practice documents, or formatting-only requests.
---

# MD2PDF Study Documents

Produce reusable UTF-8 Markdown that Harsh can open or paste into MD2PDF and print. This is a document-production convention, not a new exam-preparation curriculum or permission to change the website.

This skill is standalone: all required study and formatting instructions are bundled here. Preparing Markdown does not require the original project, a particular filesystem path, another installed skill, an account, or a renderer. External-paper research for a new full question bank requires browsing when available; if unavailable, disclose the evidence gap and follow the study-pack standard rather than inventing findings.

For other converters, use portable GFM and identify math, Mermaid, and page-break extensions. Treat documented MD2PDF controls, fonts, storage, and exports as a target profile, not universal behavior. Verify target support only when it matters to the requested output. Bundle images with relative paths; browser blob URLs and IndexedDB image IDs must be replaced with exported assets for portability. Preserve unsupported formula/diagram source and explain rendering limits. No synchronization with the original workspace is required.

## Decide what is being produced

For creating a study pack, notes, or a question bank, read [references/study-pack-standard.md](references/study-pack-standard.md). It records the user's agreed two-document structure, standalone explanations, prerequisite progression, minimum 100 answered questions per unit, question ordering, and evidence-based use of PYQs and external B.Tech papers. Apply relevant defaults to the requested deliverable; formatting-only tasks do not trigger expansion or research.

Use the request and existing conversation to identify subject, authorized topics, source material, and document purpose. Ask only for missing information that prevents useful work. Do not make the user complete an intake questionnaire.

- **Study notes:** explanatory material with definitions, reasoning, appropriate worked examples, and subject-specific representations.
- **Revision notes:** concise reconstruction of already-covered material, retaining essential conditions, notation, formulas, and steps. Do not compress away reasoning needed to use a result.
- **Solved question bank:** the user's established reading format is Q1, Answer, Q2, Answer. Keep each answer immediately below its question. These are learning/reference documents, not evidence of independent mastery.
- **Practice or cold test:** follow the requested scaffolding. For independent tests, put solutions in a separate file, with matching question IDs; do not leak answers through hints or worked examples.
- **Formatting-only request:** preserve substantive content, question order, and answer placement. Flag suspected errors rather than silently rewriting course content.

Create only the requested deliverables. Ordinary study is not subject to an exam countdown. If the user explicitly requests exam preparation, use the stated time budget; the historical 1-2 days is context, not a universal deadline. Do not add mocks, trackers, or mandatory practice stages to every document.

If academic-prof or prof-practical-builder is in use, preserve its teaching sequence, checkpoints, and guided/cold distinction. Apply this skill to its document outputs without replacing those instructions or merging cold tests with solutions.

## Use course sources faithfully

Scope precedence: explicit user topics > official syllabus > professor slides, notes, assignments > reference textbook. Use textbooks for depth within scope. A necessary textbook-only concept is a short **Prerequisite bridge - not a separate syllabus topic**. Do not expand coverage through general subject trends.

When analyzing sources, distinguish readable content from missing or illegible pages, especially equations and scanned matrices. Do not invent symbols, source locations, exam years, marks, or teacher emphasis. Preserve course notation; explain an alternative or apparent source error explicitly.

For priority labels, state a brief basis where useful: professor emphasis, recurrence in supplied PYQs, foundational dependency, or general judgment. Count recurrence only over the papers actually available. Separate actual PYQs from generated variants. General trends do not prove that a question will appear and must not override syllabus coverage. Do not label every topic important.

Use portable source references such as filename plus known slide/page/question number. Include a short source/coverage note for source-based packs; do not insert opaque chat citation tokens into exported Markdown. For formatting-only work, do not fabricate a source audit.

## Shape the content

Use one document title, topic sections, and stable question labels such as Q1 and Q2. State whether a bank is solved or questions-only near its beginning. Group by topic unless the user asks for mixed or timed practice. Keep useful question variants, but avoid padding through superficial repetition.

For solved questions, give a proper answer scaled to the question: definitions and conditions for theory; ordered reasoning for proofs; given values, formula, substitution, intermediate steps, and result for numericals. Do not invent official marking schemes. Include marks/year only when supplied, or label generated marks as suggested.

For formulas and matrices, define symbols, dimensions, assumptions, and conventions needed to reconstruct the answer. Show intermediate matrices or operations when central to the method; verify dimensions and arithmetic. Preserve derivation depth where requested. Do not force code into formal or mathematical topics.

Match representations to the subject: constructions/proofs for TOC, kernels and image reasoning for DIP, packet traces and protocol timelines for CN, mathematics and implementation where relevant for AI/ML. Use diagrams when they clarify the material, not as decoration.

## Format and deliver

Read both [references/formatting-reference.md](references/formatting-reference.md), the maintained PDF/Word formatting reference, and [references/md2pdf-format.md](references/md2pdf-format.md), the current-app compatibility rules and math conventions, before producing or reviewing Markdown. The combined skill is self-contained; the original skill need not be installed separately.

Apply the maintained reference's supported syntax, table spacing, readable code-line guidance, Mermaid examples, local-image workflow, and export checks. The references reflect the local PDF and editable Word implementation as of 2026-09-12; verify the deployed UI before promising online Word export. Do not promise identical PDF/Word pagination or editable Word equations/diagrams. User instructions take precedence. Do not change unrelated copies of these rules in other projects as part of ordinary document generation.

Deliver a clearly named `.md` file when file creation is available, such as `cn-unit-2-solved-bank.md`. The file contains only the study document: no conversational preamble, skill frontmatter, tool directives, or outer Markdown fence. If only chat output is possible, provide copyable Markdown with an outer fence longer than any contained code fence, and explain that the wrapper is excluded when pasting.

Before delivery, check scope, source labels, question-answer alignment, mathematical consistency, fence/delimiter balance, readable table width, and completeness. Do not claim visual verification unless the document was actually previewed. If using the app, inspect the current draft before replacing it; use a safe separate preview or retain the user's draft. A request for Markdown does not require operating the website or printing.

Describe the delivered files briefly and mention material source or rendering limitations. Do not claim the user has mastered material simply because a solved bank was produced.
