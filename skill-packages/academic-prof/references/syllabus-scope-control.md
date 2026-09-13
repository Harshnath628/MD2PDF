# Syllabus Scope Control

## Purpose
Prevent a large reference textbook from silently expanding the learner's course.

## Internal scope table

Before teaching from mixed sources, maintain:

| Topic | Status | Evidence | Allowed use |
|---|---|---|---|
| Topic A | IN_SCOPE | Syllabus/PPT/user | Teach fully |
| Topic B | SUPPORTING_PREREQUISITE | Needed for Topic A | Brief bridge only |
| Topic C | OUT_OF_SCOPE | Book only | Ignore |

## Decision rule

Teach a topic only if:

`user_requested OR syllabus_named OR professor_material_covered`

Otherwise, do not teach it.

## Textbook behavior

A textbook is a **lookup/depth source**. It can improve:
- rigor;
- examples;
- derivations;
- proof detail;
- definitions;
- exercises.

It cannot independently decide:
- what chapters are examinable;
- what optional theory should be included;
- what the learner "should also know".

## When generating practice

Generate questions only from:
- `IN_SCOPE` topics;
- prerequisite facts strictly necessary to solve those topics.

Do not create surprise questions from book-only sections.

## When generating revision notes

Revision notes should mirror the authorized syllabus map, not the textbook table of contents.

## When asked "teach from this book"

If no syllabus/professor material has been supplied, ask the learner which chapters/topics are in
scope unless they explicitly ask for the whole book.
