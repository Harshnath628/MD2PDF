# MD2PDF rendering conventions

Updated 2026-09-12 against the local application. Read [formatting-reference.md](formatting-reference.md) for the full maintained rules. Check the deployed UI before assuming the local Word export is online.

## Study-document conventions

Use one title, topic headings, and stable question IDs. Keep each solved answer with its question unless asked otherwise. Prefer 2–4 concise table columns and move derivations below tables. Write one source line per prose paragraph: the app renders single newlines as breaks.

Preserve complete code, source meaning and mathematical notation. Recognized fenced languages receive syntax highlighting in preview, PDF and editable Word. Nested lists, table alignment, quote paragraphs and heading bookmarks are supported.

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


## Images, diagrams and export

Follow the full reference for selected-folder access, clipboard image persistence and non-portable local references. Do not claim that uploading Markdown automatically grants access to surrounding folders.

Use Mermaid where it clarifies the subject. Preserve formal notation (e.g. accepting states and epsilon transitions) with a notation key or transition table when needed. Diagrams are SVG in PDF and PNG pictures in Word; equations are also pictures in Word.

Page settings include A4/Letter, portrait/landscape, 10/15/20 mm margins, Normal/Compact. Use explicit `<div class="page-break-before"></div>` blocks for requested page breaks; there is no automatic per-`##` Practical mode.

Print to PDF keeps selectable text. Download Word keeps editable text/tables but does not guarantee matching page counts. Printed fonts are Segoe UI/Consolas rather than the website's Outfit/JetBrains Mono. Review actual PDF and Word output when requested, including diagrams, clipping and page boundaries. Layout warnings are estimates.

Deliver the source Markdown and required assets. Local draft storage is not a saved multi-document library. A Markdown-only request does not require opening the app or exporting documents.
