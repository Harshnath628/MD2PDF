# md2pdf

Paste Markdown, preview your document, and print a clean PDF. A small, browser-only app built with vanilla JavaScript and Vite.

## Run locally

```sh
npm install
npm run dev
```

Build for deployment with `npm run build`; inspect the build with `npm run preview`.

## Use

New sessions open with a complete sample covering formatting, tables, code, equations, diagrams, images and page breaks. Saved drafts take priority. **Load sample** restores the example at any time, with Undo available.

Paste text or open/drop a `.md`, `.markdown`, or `.txt` file. Choose **Print to PDF**, then **Save as PDF** in the browser dialog. Disable browser headers and footers for a clean document. The first heading supplies the suggested filename (browser dependent).

- Shared preview/print typography, selectable text, tables, code and images.
- KaTeX equations and Mermaid diagrams load only when needed.
- Optional A4/Letter, portrait/landscape, margins, Normal/Compact spacing.
- Local draft recovery and one-step Undo after Clear, file import or example replacement.
- Help opens beside the document without inserting reference text.
- Ctrl/Cmd+P uses the same preparation flow as the Print button.

The screen preview shows document width and styling; the browser print preview determines final pagination. Print-dialog settings may override the app's page settings. Large tables can continue across pages with repeated headers. Very wide equations or oversized diagrams may need landscape orientation or source adjustments.

For an explicit page break, insert `<div class="page-break-before"></div>` on its own line.

## Privacy and implementation

Markdown is processed locally and saved in this browser's local storage. Clear removes the saved draft; Undo can restore it while the tab is open. Storage can be unavailable in restricted browser modes. Remote images still contact their hosts. Application dependencies and math fonts are bundled locally; there are no CDN font or conversion-library requests. Raw HTML is sanitized with DOMPurify before rendering.

Word export has been removed to keep this tool focused on PDF. Personal documents are separate from the application and are not deleted by cleanup. Generated dependencies and build output are ignored by Git.

## Verification

Run `npm test`, `node --check main.js` and `npm run build`. For a browser regression pass, use `test-all-features.md`, then check Help's example, draft recovery after refresh, Clear/Undo, page settings, and both desktop and mobile layouts. Print to PDF and check selectable text, equations, diagrams and multipage tables.

## Links, code and local images

Use fenced code blocks with language names (JavaScript, Python, C/C++, Java, SQL and other common languages) for syntax highlighting. Unknown or unlabeled languages remain plain code. Highlight colours adapt for printing.

Use `[Website](https://example.org)` for external links and `[Section](#section-heading)` for internal heading navigation. Headings get lowercase, hyphenated anchors; duplicates receive `-1`, `-2`, etc. Heading links can cross PDF pages when supported by the browser/PDF viewer. They target sections, not fixed page numbers, since pagination changes with print settings.

Paste clipboard PNG/JPEG/WebP/GIF images into the editor (up to 10 MB per image). Images are stored in IndexedDB, and Markdown contains a short local reference. They survive reloads in the same browser. Copying Markdown to another browser does not copy these images. Clearing browser site data removes them; Clear only clears the draft and keeps images available for Undo.

Print warnings estimate overflow using the chosen paper, orientation, margins and spacing. Mermaid diagrams are fitted proportionally within both the printable width and height and kept together when printing. Very large diagrams can become small; use landscape or split them. The browser print dialog can override app page settings, so its preview remains the final check.

## Local image folders

After uploading a Markdown file, choose **Image folder** and select the **parent of the folder containing that Markdown file**. The browser grants access to the selected folder and all its subfolders for this session. This includes sibling image folders and paths like `../images/diagram.png`. The app cannot automatically access the parent of an individually uploaded file: you must select that folder yourself.

Paths are resolved relative to the matching uploaded Markdown file inside the selected tree. If no matching Markdown file is found (for example, pasted text), images are matched by unique relative path or filename. Duplicate filenames are flagged rather than guessed. Windows absolute paths can match an image within the selected tree by its unique filename. Files outside the selected tree remain inaccessible. Folder images are never uploaded. Select the folder again after reloading the app; clipboard images continue to persist independently.

### Editable Word export
Choose **Download Word** to create a local .docx using the selected paper size, orientation, margins and density. Text, headings, lists, tables and links remain editable. Images, Mermaid diagrams and equations are embedded as pictures. Print fonts (Segoe UI and Consolas) are used; Word may paginate differently from the PDF. Remote images must allow browser access; otherwise save them locally and connect their image folder.

