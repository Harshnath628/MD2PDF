# MD2PDF rendering conventions

Based on the app source inspected on 2026-09-11. When a local version is available, check its Help and relevant implementation if behavior differs. Older project documentation describes removed features and is not automatically authoritative.

## How to combine the references

[formatting-reference.md](formatting-reference.md) is the complete, unmodified reference imported from the user's explicitly selected md-to-pdf-formatting skill. Use it for the baseline formatting conventions and examples. The following compatibility decisions override its older implementation claims for this MD2PDF app:

- **Exports:** Print to PDF is present; Download Word and image-based Download PDF are not. Word-specific SVG-to-PNG instructions apply only if using a different version that actually provides that export.
- **Page breaks:** Practical File mode is not present. Use the supported page-break class below; `##` alone does not force a new page.
- **Code:** Use language tags, but do not promise syntax highlighting. Preserve complete code and its behavior when wrapping lines; do not shorten away required logic.
- **Images:** Base64-only is not a restriction of the current print path. Browser-resolvable remote images can work if loaded; links are not substitutes when the image itself is needed in the printed document.
- **Tables:** Alignment markers are valid GFM, but the current sanitizer strips inline styles and the stylesheet defaults cells to left alignment. Do not promise centered/right-aligned print cells without checking them. Prefer 2-4 columns for study material; the imported reference's roughly eight-column ceiling is not a layout guarantee.
- **Size:** The reference's roughly 50-page recommendation is a planning heuristic, not a tested hard limit. Split long material by meaningful units when helpful, without dropping requested content.
- **Characters and diagrams:** Prefer straight quotes in code and Mermaid syntax; ordinary typographic quotes in prose are not inherently invalid. Simple monospace ASCII diagrams are acceptable where clearer, as the original reference allows. Prefer Mermaid for more complex diagrams, and do not duplicate an ASCII fallback unless useful or requested.
- **Verification:** Check diagrams locally where possible; the imported mermaid.live suggestion is optional, not an instruction to transmit course content. Apply only the export-checklist items relevant to the current app.

The imported reference is bundled as source material, not a dependency on a rules file in another workspace. No synchronization with unrelated PDSA or other project folders is required.

## Markdown

- Use GFM headings, paragraphs, lists, blockquotes, tables, and fenced code. Put blank lines between blocks. Prefer one source line per prose paragraph: this app renders single newlines as breaks.
- Keep headings short. Use `#` for the title, `##` for topics, and `### Q1. ...` for questions where suitable. Put **Answer** below a solved question, followed by normal prose or calculations.
- Keep tables narrow, preferably 2-4 short columns. Move long explanations and multi-step derivations below tables. Use a header separator and escape literal pipes in cells.
- Use language-tagged code fences. Keep code lines around 80 characters where practical, preserving valid syntax. A language tag does not guarantee syntax highlighting.
- Avoid emoji-dependent labels, invisible characters, decorative Unicode diagrams, and raw HTML layouts. Do not insert custom styles or scripts: the sanitizer removes style tags and inline style attributes.
- Ordinary task checkboxes are document content, not an interactive mastery tracker.

## Equations and matrices

Use `$...$` for short inline math and standalone `$$` delimiters for display math. The app also supports `\(...\)` and `\[...\]`, but prefer one consistent convention. Keep display math outside tables and code fences. Code fences deliberately leave math literal.

Write actual LaTeX backslashes in the Markdown file, not JSON-escaped versions. Matrix row separators require two backslashes; commands such as `\begin` require one.

```text
For a column vector $x \in \mathbb{R}^{2}$:

$$
A = \begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix},
\qquad
x = \begin{bmatrix}5 \\ 6\end{bmatrix}
$$

$$
Ax = \begin{bmatrix}
1(5) + 2(6) \\
3(5) + 4(6)
\end{bmatrix}
= \begin{bmatrix}17 \\ 39\end{bmatrix}
$$
```

The example's text fence is instructional; omit it around equations in the actual document. Use `aligned` within display math for long multi-step equations. Split wide expressions at meaningful equalities rather than relying on horizontal scrolling, which will not protect print output from overflow. Escape literal currency as `\$`. Avoid unsupported LaTeX packages or custom macros unless verified in the app.

## Diagrams

Use one Mermaid diagram per `mermaid` fence. Prefer compact top-down flows or short sequence diagrams; quote labels containing punctuation and use simple node IDs. Keep labels readable in monochrome. No external diagram editor is required, and do not upload course material to one without authorization.

When formal notation such as accepting states or epsilon transitions matters, ensure the diagram conveys it unambiguously; add a transition table or explicit notation key if needed. A generic flowchart is not automatically a correct automaton.

For images, use a source the browser can actually resolve. A bare absolute filesystem path in Markdown is not a portable browser image URL. Remote images require a connection. Verify necessary images load before claiming print readiness.

## Pages and export

The inspected app provides Open .md, paste/drop input, browser-local draft saving, and Print to PDF. Page settings include A4/Letter, portrait/landscape, 10/15/20 mm margins, and normal/compact spacing. It does not currently provide Word export or a separate Download PDF button.

Use A4 portrait and normal spacing as a reasonable starting point unless requested otherwise. Compact is optional for revision density; do not rely on shrinking text to rescue overly wide tables or equations. The browser print preview is the final pagination check.

For an intentional page break, place this on its own block:

```html
<div class="page-break-before"></div>
```

This class is supported by the current print stylesheet. Inline `style="page-break-before: always"` is stripped. A `##` heading does not automatically start a page. Avoid a break before every question or short section unless requested.

When verifying a rendered document, check representative math, matrix row breaks, tables, diagrams, and page boundaries. The app reports formula/diagram errors but may still permit printing, so an enabled print button alone is insufficient. Confirm the status and rendered content. Do not promise exact pagination without inspecting print output.

Use Print to PDF and choose Save as PDF; disable browser headers/footers for clean output. Browser-local draft storage is not a saved `.md` file or a multi-document library. Retain the delivered Markdown file for reuse.
