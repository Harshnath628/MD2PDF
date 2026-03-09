# Markdown to PDF — Formatting Rules for Perfect Conversion

Follow these rules to get clean, well-formatted PDFs from your Markdown. The app supports GFM (GitHub Flavored Markdown).

---

## 1. Supported Markdown Syntax

Use **only** these syntaxes for reliable conversion:

| Element | Syntax | Notes |
|---------|--------|-------|
| **Headings** | `# H1` through `###### H6` | Use one space after `#`. Avoid headings inside tables. |
| **Bold** | `**text**` | Prefer `**` over `__`. |
| **Italic** | `*text*` | Prefer `*` over `_`. |
| **Strikethrough** | `~~text~~` | GFM only. |
| **Inline code** | `` `code` `` | Use backticks, not double backticks for inline. |
| **Code block** | ` ``` ` with optional language | Fenced with triple backticks on their own line. |
| **Bullet list** | `-` or `*` + space | Use consistent bullet style. |
| **Numbered list** | `1.` + space | Numbers can be `1.` for all (auto-numbering). |
| **Task list** | `- [ ]` and `- [x]` | Space inside brackets for unchecked; `x` for checked. |
| **Nested list** | Indent 2–4 spaces | Align with parent item. |
| **Blockquote** | `> ` at line start | Add space after `>`. |
| **Table** | `| col | col |` and `|---|` | See table rules below. |
| **Link** | `[text](url)` | URL in parentheses. |
| **Horizontal rule** | `---` (3+ hyphens) | On its own line, blank line before/after. |

---

## 2. Table Rules for Clean PDFs

### Structure
- Put a blank line **before** and **after** the table.
- Alignment row uses `:---` (left), `:---:` (center), `---:` (right).
- Keep column widths similar to avoid layout issues.

### Example

```markdown
| Left   | Center | Right  |
|:-------|:------:|-------:|
| A      | B      | C      |
| 1      | 2      | 3      |
```

### Avoid
- Very long cells without spaces (can break layout).
- Tables inside blockquotes or lists.
- More than ~8 columns.

---

## 3. Code Blocks

### Use fenced code blocks

````markdown
```language
// code
```
````

### Supported language tags
`c`, `cpp`, `python`, `javascript`, `bash`, `json`, etc. Language tag improves syntax highlighting in preview; PDF shows plain monospace.

### Avoid
- Indented code blocks (4 spaces) for multi-line code — prefer fenced blocks.
- Tabs inside code — use spaces.

---

## 4. Page Breaks (Practical File mode)

- Each `## Heading` starts a new page when using **Practical File** mode.
- Use `## Practical 1: Title` style headings for per-practical page breaks.
- Put a blank line after `---` before the next `##` for cleaner breaks.

---

## 5. Spacing and Layout

- **Blank lines**: Use one blank line between blocks (paragraphs, lists, tables, headings).
- **No trailing spaces**: Remove spaces at end of lines.
- **Consistent newlines**: Use single line breaks; avoid multiple blank lines in a row.
- **Lists**: One blank line before and after lists.

---

## 6. Characters to Avoid

| Avoid | Use Instead | Reason |
|-------|-------------|--------|
| Tab characters | Spaces (2–4) | Tabs can render inconsistently. |
| Smart/curly quotes | `"` and `'` | Straight quotes ensure proper display. |
| Zero-width chars | — | Invisible characters can cause odd gaps. |
| Emoji in headings | Text or skip | May not render well in all viewers. |

---

## 7. File Length and Size

- **Recommendation**: Up to ~50 pages for smooth export.
- **Images**: Only base64 inline images work in some export paths; prefer links or attachments.
- **Very long code blocks**: Consider splitting or shortening for readability.

---

## 8. PDF vs Print to PDF

| Output | When to Use |
|--------|-------------|
| **Download PDF** | Quick one-click file. Text is **not selectable** (image-based). |
| **Print to PDF** | Choose “Save as PDF” in the print dialog for **selectable, copyable text**. |
| **Download Word** | Editable .docx; best for further editing in Word. |

---

## 9. Checklist Before Export

- [ ] Headings use `#` with a space after.
- [ ] Tables have alignment row and blank lines around them.
- [ ] Code blocks use triple backticks, not indentation.
- [ ] No trailing spaces or odd characters.
- [ ] Lists are indented with spaces, not tabs.
- [ ] In Practical mode, `##` is used for each practical title.
- [ ] For copyable text, use **Print to PDF**, not Download PDF.

---

## 10. Example: Well-Formatted Document

````markdown
# Document Title

Short intro paragraph.

## Section One

- Bullet one
- Bullet two

## Section Two

| A   | B   |
|-----|-----|
| 1   | 2   |

## Section Three

```python
print("Hello")
```

> Important note here.
````

---

*Following these rules ensures consistent, high-quality PDF output from the Markdown to PDF converter.*
