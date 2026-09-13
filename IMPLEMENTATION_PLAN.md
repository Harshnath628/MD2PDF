# md2pdf quality plan

## Product contract

Paste Markdown, preview it, get a clean PDF or editable DOCX. Preserve a lightweight browser-only application with local processing and no account requirement. Success means dependable output and minimal effort, not additional product surface.

All implementation takes place on `dev_mode`. Do not merge, push, or deploy as part of this plan. Preserve unrelated work and personal documents. Current branch and clean working tree were verified before writing this plan.

## Execution rules

- Work in the phase order below. Complete each acceptance gate before moving on.
- Keep changes small and attributable to a user-visible problem. Avoid a framework migration, generic conversion engine, or speculative abstractions.
- Add regression coverage alongside each behavior fix, then consolidate the release checks in phase 6.
- Run relevant checks after each phase; run the full suite and build at integration gates. Record actual results and remaining limitations.
- Keep existing behavior unless the plan explicitly changes it. Do not promise identical pagination between Word and PDF.
- A phase is complete only when implementation, relevant verification, and documentation agree. Report unavailable verification as unverified.

## Phase 0 — Establish the baseline

1. Recheck branch and working tree before edits; inspect the current files rather than assuming an earlier review remains current.
2. Run existing math/path tests and the production build; record warnings separately from failures.
3. Assemble four compact fixtures: ordinary prose; academic math and Unicode; code and links; a long mixed document with tables, diagrams, page breaks, and local images.
4. Add targeted failure fixtures for invalid math/diagrams, missing images, duplicate image names, and unsafe raw HTML.
5. Capture the current desktop/mobile UI and representative PDF/DOCX output. Record defects before changing behavior.

Likely files: test fixtures, existing tests, package scripts, verification notes.

Acceptance gate: a reproducible baseline with named expected outcomes and no unexplained test/build failures. Baseline output is retained for comparison; no UI redesign yet.

## Phase 1 — Make export preparation consistent

1. Review the separate PDF and Word handlers in main.js and identify their actual shared preparation needs.
2. Centralize only the shared lifecycle: capture the current source/settings, prepare rendering, await required assets, set busy state, and restore controls in finally.
3. Prevent overlapping exports and stale render results. Keep both export buttons consistent for empty, busy, failed, and ready states.
4. Make image loading, render failures, and timeouts produce specific feedback. Do not silently claim success after missing content.
5. Preserve the source and recover normal editing after cancellation or failure. Treat browser print cancellation as neutral; the app cannot confirm a PDF was saved.
6. Exercise both the button and keyboard print paths. Document any native browser-menu print limitation.

Likely files: main.js, document-features.js, word-export.js; one small shared module only if useful.

Acceptance gate: rapid edits followed by export use the latest document; repeated clicks cannot overlap; missing assets have actionable feedback; every exit restores a usable editor.

## Phase 2 — Improve document fidelity

1. Verify headings, paragraphs, nested lists, task lists, code whitespace, links, Unicode, and tables in both formats.
2. Check PDF print styling for repeated table headers, split rows, heading placement, page breaks, and overflow. Keep text selectable.
3. Verify diagram and image aspect ratios and printable bounds under A4/Letter, both orientations, margins, and density settings.
4. Check inline/display equations in PDF and Word; preserve editable Word text, lists, tables, and links while clearly describing equation/diagram images.
5. Fix observed fidelity defects without attempting exact cross-format pagination. Warnings should identify the affected content and suggest a useful adjustment.

Likely files: styles.css, document-features.js, word-export.js, fidelity fixtures.

Acceptance gate: all four baseline documents pass content checks and visual inspection; no unexplained missing content, clipping, distortion, or broken supported links. Inspect actual output, not just successful file creation.

## Phase 3 — Protect source and recovery

1. Trace startup, sample loading, restore-draft, autosave, Clear, Undo, and file replacement. In particular, verify a sample cannot overwrite a recoverable draft before the user restores it.
2. Define deterministic recovery: recoverable source/settings remain available until explicitly replaced; Clear has clear semantics and Undo restores the prior document.
3. Validate persisted settings and handle unavailable/full/corrupt storage without blocking editing.
4. Add a secondary Save Markdown action for a portable text backup; explain that local image references do not bundle their images.
5. Check clipboard image persistence and folder reconnection after reload. Release obsolete object URLs where practical without breaking Undo; defer image deletion unless safe ownership is established.

Likely files: main.js, document-features.js, local-folder.js, index.html.

Acceptance gate: reload, sample replacement, Clear/Undo, failed import, storage failure, and failed export do not unexpectedly destroy recoverable source. Markdown backup preserves the source text.

## Phase 4 — Simplify and polish the interface

1. Inspect the actual UI at desktop and narrow mobile widths before adjusting layout.
2. Make editor, preview, Print to PDF, and Download Word the clear primary workflow.
3. Keep paper, orientation, margins, and density in one compact settings area; keep upload, image folder, Save Markdown, sample, and help secondary.
4. Retain simple Edit/Preview switching on mobile; remove control collisions and unintended horizontal UI scrolling.
5. Check keyboard order, visible focus, control labels, contrast, status announcements, and focus return from help/settings.
6. Use brief user-facing messages; disclose limitations where they affect an action rather than filling the workspace with instructions.

Likely files: index.html, styles.css, main.js.

Acceptance gate: a new user can paste and export without help; both core actions remain easy to locate; keyboard and mobile workflows work. No extra top-level panels or decorative dashboard features.

## Phase 5 — Measure and improve performance

1. Measure first usable editor, first preview, typing responsiveness, and export preparation on the same machine with short and long fixtures; record cold and warm behavior.
2. Keep math, diagrams, highlighting, and Word dependencies demand-loaded. Investigate build-size warnings by actual loading impact.
3. Avoid redundant expensive rendering and unnecessary storage writes while maintaining recovery guarantees. Consider incremental rendering only if simpler scheduling does not meet the target.
4. Check repeated imports/exports for retained object URLs and growing memory use.

Acceptance gate: on the recorded test machine, a plain 1,000-word document previews within 500 ms after the debounce, and a 20,000-word fixture has no repeatable typing stalls over 100 ms. Report diagram/export timings separately; heavy operations display feedback promptly. No runtime dependency is added solely to chase a bundle warning.

## Phase 6 — Make quality repeatable

1. Add a small browser regression suite for editing, recovery, Clear/Undo, image resolution, page settings, empty/busy export states, and download generation.
2. Verify unsafe HTML cannot execute and normal formatting survives sanitization.
3. Inspect DOCX structure for expected text, tables, hyperlinks, images, and page settings. Validate generated PDF text and page geometry where automation is available.
4. Distinguish automated browser PDF generation from the real user print dialog; retain a short manual print smoke check.
5. Run automated checks in Chromium and smoke-test Firefox and Edge where available. Record missing browser coverage explicitly.
6. Document one local release-check command and a short manual visual checklist. Add CI only if the repository's existing hosting/workflow supports it.

Likely files: tests, fixtures, package.json, lockfile, release checklist; CI configuration if applicable.

Acceptance gate: relevant automated tests and production build pass; representative PDF/DOCX output is visually checked; no unresolved defect causes source loss, export failure for supported content, or silent content omission.

## Phase 7 — Finish and hand over

1. Format dense CSS and make small responsibility-based extractions only where they improve readability; rerun affected checks after refactoring.
2. Remove verified dead code and fix contradictory Word-export and draft-recovery documentation.
3. Document local processing, remote image requests, local asset portability, browser print controls, and Word fidelity accurately.
4. Review the final diff for unrelated changes, unnecessary dependencies, and added interface complexity.
5. Deliver the change summary, verification evidence, remaining limitations, and final acceptance checklist on dev_mode. Leave main unchanged.

Acceptance gate: documentation matches behavior, the build and release checks pass, and the final flow remains paste Markdown → preview → PDF/DOCX.

## Explicit exclusions

Accounts, cloud storage, AI writing, collaboration, template galleries, rich-text toolbars, server-side conversion, framework migration, and identical Word/PDF pagination. No promise of editable mathematical equations in Word in this scope.

## Status

- Planning: complete.
- Implementation: not started.
- Baseline tests/build from the earlier review: passed; phase 0 must rerun against the current branch.
- Current branch: dev_mode; main unchanged.
