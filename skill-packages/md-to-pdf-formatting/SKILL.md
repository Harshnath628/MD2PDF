---
name: md-to-pdf-formatting
description: Prepare or review Markdown for PDF and editable Word export, including GFM, tables, code, equations, Mermaid, images, navigation and page breaks. Use for printable Markdown, Markdown-to-PDF formatting, or MD2PDF documents.
---

# Markdown to PDF and Word Formatting

This skill is standalone: all required instructions and examples are in this file and the bundled [reference.md](reference.md). It does not require another skill, the original project, a particular filesystem path, an account, or a network connection to prepare Markdown.

## Workflow

1. Read [reference.md](reference.md). It contains the complete formatting rules, examples, export differences and verification checklist.
2. Preserve the user's content, code semantics, mathematical notation and requested scope. For formatting-only requests, flag suspected factual errors instead of silently changing them.
3. Apply the general GFM conventions. Treat the reference's MD2PDF-specific controls, storage, fonts and export behavior as a documented target profile, not universal Markdown behavior. Check the target converter when an extension matters; do not require MD2PDF for a Markdown-only request.
4. Deliver a UTF-8 `.md` file and any required image assets when file creation is available. Use relative image paths for portable bundles. Do not include skill frontmatter or an outer code fence in the document itself. For chat-only delivery, use an outer fence longer than all contained fences and explain that it is a copy wrapper.
5. Check structure, delimiters, readable widths and missing assets. Inspect actual exports when visual fidelity is requested and rendering tools are available; otherwise state the verification limit. Preserve active user drafts when testing.

## Export expectations

- Editable Word cannot be guaranteed pixel-identical to a browser PDF. In the documented MD2PDF exporter, text/tables are editable while equations and diagrams are pictures.
- PDF system fonts and website fonts are separate in that app to retain conversion compatibility. Do not impose those fonts on unrelated converters or override a user's font choice.
- Explicit page breaks and folder access depend on the target. Uploading one Markdown file does not automatically grant neighboring filesystem access.
- No synchronization with any external rules file or original workspace is required. The bundled reference is sufficient; external links are optional further reading.
