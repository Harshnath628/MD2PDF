import { marked } from 'marked';
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

// Marked config — tables, breaks, etc.
marked.setOptions({
  gfm: true,
  breaks: true,
});

/** KaTeX version (keep in sync with package.json) — used for print/Word stylesheet URLs */
const KATEX_VERSION = '0.16.42';

/**
 * With breaks:true, single newlines become <br>, so $$ … $$ split across lines ends up as
 * separate text nodes and KaTeX auto-render never sees a matching pair. We pull display
 * math out in markdown, inject a placeholder div, then katex.render() after parse.
 */
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function mathBlockPlaceholder(tex) {
  const b64 = utf8ToBase64(tex.trim());
  return `\n\n<div class="md-math-display" data-tex-b64="${b64}"></div>\n\n`;
}

function inlineMathPlaceholder(tex) {
  const b64 = utf8ToBase64(tex.trim());
  return `<span class="md-math-inline" data-tex-b64="${b64}"></span>`;
}

/** Opening fence: 0–3 spaces, then 3+ backticks or tildes (CommonMark), rest of line is info. */
function parseFenceOpen(line) {
  const m = line.match(/^(\s{0,3})(`{3,}|~{3,})(.*)$/);
  if (!m) return null;
  const fence = m[2];
  if (fence.includes('`') && fence.includes('~')) return null;
  return { indent: m[1], char: fence[0], len: fence.length };
}

/** Closing fence: same indent, same char, run length ≥ opening. */
function parseFenceClose(line, open) {
  const m = line.match(/^(\s{0,3})(`{3,}|~{3,})\s*$/);
  if (!m) return false;
  if (m[1] !== open.indent) return false;
  const f = m[2];
  if (f[0] !== open.char) return false;
  return f.length >= open.len;
}

/**
 * Split into { type: 'text' | 'fence', content }.
 * Unlike a naive ```…``` regex, this ignores backticks in headings or mid-line (e.g. ## text ``` word).
 */
function splitByCodeFences(md) {
  const lines = md.split('\n');
  const regions = [];
  const textLines = [];
  let i = 0;

  function flushText() {
    if (textLines.length) {
      regions.push({ type: 'text', content: textLines.join('\n') });
      textLines.length = 0;
    }
  }

  while (i < lines.length) {
    const open = parseFenceOpen(lines[i]);
    if (!open) {
      textLines.push(lines[i]);
      i++;
      continue;
    }
    flushText();
    const fenceBuf = [lines[i]];
    i++;
    while (i < lines.length) {
      fenceBuf.push(lines[i]);
      if (parseFenceClose(lines[i], open)) {
        i++;
        break;
      }
      i++;
    }
    regions.push({ type: 'fence', content: fenceBuf.join('\n') });
  }
  flushText();
  return regions;
}

function preprocessMathInTextRegion(text) {
  return text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, body) => mathBlockPlaceholder(body))
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, body) => mathBlockPlaceholder(body))
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, body) => inlineMathPlaceholder(body));
}

function preprocessDisplayMath(md) {
  if (!md) return md;
  md = md.replace(/\r\n/g, '\n');
  return splitByCodeFences(md)
    .map((r) => (r.type === 'fence' ? r.content : preprocessMathInTextRegion(r.content)))
    .join('\n');
}

function markdownToHtml(md) {
  return marked.parse(preprocessDisplayMath(md));
}

/** Display $$ … $$ blocks (see preprocessDisplayMath). */
function renderDisplayMathBlocks(root) {
  if (!root) return;
  root.querySelectorAll('.md-math-display').forEach((el) => {
    const b64 = el.getAttribute('data-tex-b64');
    if (!b64) return;
    try {
      katex.render(base64ToUtf8(b64), el, { displayMode: true, throwOnError: false });
    } catch (err) {
      console.error(err);
    }
  });
}

/** \\(...\\) becomes spans before parse — Markdown would strip backslashes otherwise. */
function renderInlineMathPlaceholders(root) {
  if (!root) return;
  root.querySelectorAll('.md-math-inline').forEach((el) => {
    const b64 = el.getAttribute('data-tex-b64');
    if (!b64) return;
    try {
      katex.render(base64ToUtf8(b64), el, { displayMode: false, throwOnError: false });
    } catch (err) {
      console.error(err);
    }
  });
}

/** $…$ only — $$ / \\[ \\] / \\(...\\) handled in preprocess + render above. */
const KATEX_AUTO_RENDER_OPTIONS = {
  delimiters: [{ left: '$', right: '$', display: false }],
  throwOnError: false,
  strict: false,
};

function typesetMath(root) {
  if (!root) return;
  try {
    renderDisplayMathBlocks(root);
    renderInlineMathPlaceholders(root);
    renderMathInElement(root, KATEX_AUTO_RENDER_OPTIONS);
  } catch (err) {
    console.error(err);
  }
}

// --- Practical File mode: template and placeholders ---
const PRACTICAL_FILE_TEMPLATE = `# {{SUBJECT}}
**Session:** {{SESSION}}

**{{INSTITUTION}}**
**{{FACULTY}}**
**{{DEGREE}}**
**{{DEPARTMENT}}**

| Submitted To | Submitted By |
|--------------|--------------|
| {{TEACHER_NAME}} | {{STUDENT_NAME}} |
| {{TEACHER_TITLE}} | {{YEAR}} |
| {{TEACHER_DEPT}} | {{DEGREE}} |
| | {{SECTION}} |
| | Roll No. {{ROLL_NO}} |

---

## Practical 1 (A): Title of Practical

- **Aim:** One-line aim of the experiment.
- **Theory:**
  - Point 1.
  - Point 2.
  - **Time Complexity:** O(?)
  - **Space Complexity:** O(?)
  - **Applications:** 1. … 2. …

**Program Code:**

\`\`\`c
// Your C code here
\`\`\`

**Output:**

(Describe or paste sample output.)

**Remark:** Brief observation.

**Conclusion:** What you learned.

---

## Practical 1 (B): Next Practical Title

- **Aim:** …
- **Theory:** …
- **Program Code:** …
- **Output:** …
- **Remark:** …
- **Conclusion:** …
`;

const PLACEHOLDERS = [
  'STUDENT_NAME', 'ROLL_NO', 'SECTION', 'YEAR', 'DEGREE',
  'INSTITUTION', 'FACULTY', 'DEPARTMENT', 'SESSION',
  'SUBJECT', 'TEACHER_NAME', 'TEACHER_TITLE', 'TEACHER_DEPT',
];

// Default details when field is left empty (used for template + PDF)
const DEFAULT_PRACTICAL_DETAILS = {
  STUDENT_NAME: 'Harsh Nath Tripathi',
  ROLL_NO: '24293916101',
  SECTION: 'CSE-A',
  YEAR: '2nd Year',
  DEGREE: 'B.TECH(CSE)',
  INSTITUTION: 'UNIVERSITY OF DELHI',
  FACULTY: 'FACULTY OF TECHNOLOGY',
  DEPARTMENT: 'COMPUTER SCIENCE & ENGINEERING',
  SESSION: '2024-2028',
  SUBJECT: 'ADA Practical',
  TEACHER_NAME: 'Dr. Juhi Jain',
  TEACHER_TITLE: 'Assistant Professor',
  TEACHER_DEPT: 'CSE Department',
};

function getPracticalDetails() {
  const raw = {
    STUDENT_NAME: document.getElementById('pf-student-name')?.value?.trim() ?? '',
    ROLL_NO: document.getElementById('pf-roll-no')?.value?.trim() ?? '',
    SECTION: document.getElementById('pf-section')?.value?.trim() ?? '',
    YEAR: document.getElementById('pf-year')?.value?.trim() ?? '',
    DEGREE: document.getElementById('pf-degree')?.value?.trim() ?? '',
    INSTITUTION: document.getElementById('pf-institution')?.value?.trim() ?? '',
    FACULTY: document.getElementById('pf-faculty')?.value?.trim() ?? '',
    DEPARTMENT: document.getElementById('pf-department')?.value?.trim() ?? '',
    SESSION: document.getElementById('pf-session')?.value?.trim() ?? '',
    SUBJECT: document.getElementById('pf-subject')?.value?.trim() ?? '',
    TEACHER_NAME: document.getElementById('pf-teacher-name')?.value?.trim() ?? '',
    TEACHER_TITLE: document.getElementById('pf-teacher-title')?.value?.trim() ?? '',
    TEACHER_DEPT: document.getElementById('pf-teacher-dept')?.value?.trim() ?? '',
  };
  // Use default for any empty field so partial edits (e.g. only "3rd Year") keep the rest
  const out = {};
  for (const key of PLACEHOLDERS) {
    out[key] = (raw[key] && raw[key].length > 0) ? raw[key] : (DEFAULT_PRACTICAL_DETAILS[key] ?? '');
  }
  return out;
}

function fillTemplate(template, details) {
  let out = template;
  for (const key of PLACEHOLDERS) {
    const val = details[key] ?? '';
    out = out.split(`{{${key}}}`).join(val);
  }
  return out;
}

const STORAGE_KEY_MY_DETAILS = 'md2pdf-my-details';

const MY_DETAILS_FIELDS = {
  'pf-student-name': 'STUDENT_NAME', 'pf-roll-no': 'ROLL_NO', 'pf-section': 'SECTION',
  'pf-year': 'YEAR', 'pf-degree': 'DEGREE', 'pf-institution': 'INSTITUTION',
  'pf-faculty': 'FACULTY', 'pf-department': 'DEPARTMENT', 'pf-session': 'SESSION',
};

function loadMyDetailsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MY_DETAILS);
    if (!raw) return;
    const o = JSON.parse(raw);
    for (const [id, key] of Object.entries(MY_DETAILS_FIELDS)) {
      const el = document.getElementById(id);
      if (el && o[key] != null) el.value = o[key];
    }
  } catch (_) {}
}

function saveMyDetailsToStorage() {
  const o = {};
  for (const [id, key] of Object.entries(MY_DETAILS_FIELDS)) {
    const el = document.getElementById(id);
    if (el) o[key] = el.value?.trim() ?? '';
  }
  localStorage.setItem(STORAGE_KEY_MY_DETAILS, JSON.stringify(o));
}

const FORMATTING_REFERENCE = `# Formatting reference (delete or edit)

## Headings
# H1 | ## H2 | ### H3 | #### H4

## Text
**bold** *italic* ~~strikethrough~~ \`inline code\`

## Lists
- Bullet
- [ ] Unchecked task
- [x] Checked task
1. Numbered
   - Nested bullet

## Blockquote
> Quote or callout line.

## Code block
\`\`\`c
int main() { return 0; }
\`\`\`

## Table
| A   | B   |
|-----|-----|
| 1   | 2   |

## Rule
---

## Equations (KaTeX)
Inline: $E = mc^2$, $\\alpha + \\beta$, or \\( \\int_0^1 x\\,dx \\). Display: **double-dollar** lines (multiline OK). Use **Math & formulas** for examples.

`;

/** Inserted by "Math & formulas" — equation-friendly examples for notes & assignments */
const MATH_REFERENCE = `# Math & formulas (KaTeX — works in preview, PDF & Word)

## Inline math (same line as text)
Euler: $e^{i\\pi} + 1 = 0$ · Quadratic: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

You can also use \\( \\int_0^1 x\\,dx = \\frac{1}{2} \\) instead of dollar signs.

## Display math (centered, on its own)
Put **double-dollar** delimiters on their own lines; you may break the equation across lines inside the block:

$$
\\hat{\\mathbf{y}} = \\mathbf{X}\\mathbf{w} + b
$$

$$
J = \\frac{1}{2n} \\sum_{i=1}^{n} \\bigl(\\hat{y}_i - y_i\\bigr)^2
$$

$$
\\frac{\\partial J}{\\partial \\mathbf{w}} = \\frac{1}{n} \\mathbf{X}^{\\mathsf{T}} (\\hat{\\mathbf{y}} - \\mathbf{y})
$$

Another display example (same double-dollar rules; multiline OK):

$$
\\mathbf{w} \\leftarrow \\mathbf{w} - \\alpha \\frac{\\partial J}{\\partial \\mathbf{w}}
$$

## Tips
- **Currency** (e.g. five dollars): use backticks like \`$5\` or write \\$5 so it is not parsed as math.
- **Plain text** (no typesetting): put formulas in a fenced code block.
- **Matrices, align, etc.:** standard LaTeX you would use in KaTeX is supported — check [KaTeX supported functions](https://katex.org/docs/supported.html).

`;

const SAMPLE_MARKDOWN = `# Unit - I: Basics of Computer Architecture

**Overview**
Computer **architecture**: View presented to software designers (ISA, visible features).
Computer **organization**: Actual hardware implementation.

A computer is a programmable general-purpose device that processes information to yield meaningful results by executing instructions on stored data.

**Key Insight**
Computers are fundamentally **dumb** — ultra-fast at calculations, never tire or get bored. Combined with intelligent human programs → powerful software (OS, apps, games).

**Computer vs Human Brain**
| Feature                      | Computer       | Human Brain       |
|------------------------------|----------------|-------------------|
| Intelligence                 | Dumb           | Intelligent       |
| Speed of calculations        | Ultra-fast     | Slow              |
| Gets tired                   | Never          | Yes               |
| Gets bored                   | Never          | Almost always     |

## Introduction
- What is a computer?
- What can/cannot it do?
- How to make it intelligent?
- [ ] Optional: try task lists
- [x] And checked items

**Architecture** — View to software designers
**Organization** — Hardware implementation

> **Note:** Use blockquotes for callouts or key definitions.

1. First point
2. Second point
3. Nested: sub-item (indent with spaces)

~~Old text~~ and **current** text. Inline \`code\` for terms.

## Basics of Computer Architecture
Three key parts:
- Computer
- Stored information
- Program (instructions)

Computer takes program → performs operations on data → produces results.

\`\`\`
// Code blocks for algorithms or snippets
fetch(program); execute(data); return results;
\`\`\`

## Harvard Architecture
- Separate memory for instructions & data
- Separate buses → simultaneous fetch & access
- Faster, no bottleneck, pipelining-friendly

## Von Neumann Architecture
- Single shared memory for instructions + data
- Common address & data bus
- Von Neumann Bottleneck: Instructions & data compete for same bus

## RISC vs CISC
| Parameter            | RISC                     | CISC                        |
|----------------------|--------------------------|-----------------------------|
| Instruction set      | Small/simple             | Large/complex               |
| Length               | Fixed                    | Variable                    |
| Memory access        | Load/store only          | Direct memory ops           |
`;

// DOM refs
const inputEl = document.getElementById('markdown-input');
const previewEl = document.getElementById('preview-content');
const btnFormatRef = document.getElementById('btn-format-ref');
const btnMathRef = document.getElementById('btn-math-ref');
const btnSample = document.getElementById('btn-sample');
const btnClear = document.getElementById('btn-clear');
const btnDownload = document.getElementById('btn-download');
const btnDownloadWord = document.getElementById('btn-download-word');
const btnPrintPdf = document.getElementById('btn-print-pdf');
const fileInput = document.getElementById('file-input');
const practicalPanel = document.getElementById('practical-file-panel');
const modeRadios = document.querySelectorAll('input[name="app-mode"]');
const btnLoadPracticalTemplate = document.getElementById('btn-load-practical-template');
const btnToggleMyDetails = document.getElementById('btn-toggle-my-details');
const myDetailsFields = document.getElementById('my-details-fields');

function isPracticalMode() {
  return document.querySelector('input[name="app-mode"]:checked')?.value === 'practical';
}

// Live preview
function renderPreview(md) {
  if (!md?.trim()) {
    previewEl.innerHTML = '<p class="empty-preview">Your formatted content will appear here.</p>';
    updatePreviewStyle();
    return;
  }
  try {
    const result = markdownToHtml(md);
    const apply = (html) => {
      previewEl.innerHTML = html;
      typesetMath(previewEl);
      updatePreviewStyle();
    };
    if (typeof result === 'string') {
      apply(result);
    } else {
      result.then(apply).catch((err) => {
        previewEl.innerHTML = `<p class="preview-error">Parse error: ${err.message}</p>`;
        updatePreviewStyle();
      });
    }
  } catch (err) {
    previewEl.innerHTML = `<p class="preview-error">Parse error: ${err.message}</p>`;
    updatePreviewStyle();
  }
}

function updatePreviewStyle() {
  const isCompact = document.querySelector('input[name="pdf-style"]:checked')?.value === 'compact';
  previewEl.classList.toggle('markdown-body--compact', isCompact);
}

// Debounce preview so long documents stay responsive while typing
let previewDebounceId = 0;
inputEl.addEventListener('input', () => {
  clearTimeout(previewDebounceId);
  previewDebounceId = setTimeout(() => renderPreview(inputEl.value), 80);
});

// Sync preview when PDF style changes
document.querySelectorAll('input[name="pdf-style"]').forEach((radio) => {
  radio.addEventListener('change', updatePreviewStyle);
});

// Formatting reference — insert at cursor or at start
btnFormatRef?.addEventListener('click', () => {
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const text = inputEl.value;
  const insert = FORMATTING_REFERENCE + '\n\n';
  const newText = start === 0 && end === 0 ? insert + text : text.slice(0, start) + insert + text.slice(end);
  inputEl.value = newText;
  inputEl.selectionStart = inputEl.selectionEnd = start + insert.length;
  inputEl.focus();
  renderPreview(inputEl.value);
});

// Math & formulas — equation-friendly examples
btnMathRef?.addEventListener('click', () => {
  const start = inputEl.selectionStart;
  const end = inputEl.selectionEnd;
  const text = inputEl.value;
  const insert = MATH_REFERENCE + '\n\n';
  const newText = start === 0 && end === 0 ? insert + text : text.slice(0, start) + insert + text.slice(end);
  inputEl.value = newText;
  inputEl.selectionStart = inputEl.selectionEnd = start + insert.length;
  inputEl.focus();
  renderPreview(inputEl.value);
});

// Load sample
btnSample.addEventListener('click', () => {
  inputEl.value = SAMPLE_MARKDOWN;
  renderPreview(SAMPLE_MARKDOWN);
});

// Clear
btnClear.addEventListener('click', () => {
  inputEl.value = '';
  renderPreview('');
  inputEl.focus();
});

// File upload
fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    inputEl.value = ev.target?.result ?? '';
    renderPreview(inputEl.value);
  };
  reader.readAsText(file);
  fileInput.value = '';
});

// Load html-docx-js from CDN (once) for Word export
function loadHtmlDocxScript() {
  if (typeof window.htmlDocx !== 'undefined') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Word export library'));
    document.head.appendChild(script);
  });
}

// Fix table alignment for Word: convert align attribute to inline style (Word respects style better)
function fixWordTableAlignment(html) {
  return html.replace(/<(th|td)(\s+)align="(left|center|right)"([^>]*)>/gi, (_, tag, space, align, rest) => {
    return `<${tag}${space}style="text-align: ${align}"${rest}>`;
  });
}

// Build full HTML document for Word (library requires DOCTYPE + html + body)
function buildFullHtmlForWord(bodyContent, isCompact) {
  const aligned = fixWordTableAlignment(bodyContent);
  const style = `
    body { font-family: Calibri, 'Segoe UI', sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; margin: 1in; }
    h1 { font-size: 18pt; margin-top: 12pt; margin-bottom: 6pt; border-bottom: 1pt solid #ccc; }
    h2 { font-size: 14pt; margin-top: 12pt; margin-bottom: 4pt; }
    h3, h4, h5, h6 { font-size: 12pt; margin-top: 8pt; margin-bottom: 2pt; }
    p { margin-bottom: 6pt; }
    ul, ol { margin: 6pt 0; padding-left: 24pt; }
    li { margin-bottom: 2pt; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; font-size: 10pt; table-layout: fixed; }
    th, td { border: 1pt solid #333; padding: 6pt 10pt; vertical-align: top; }
    th { background: #f0f0f0; font-weight: bold; text-align: left; }
    td { text-align: left; }
    pre { background: #f5f5f5; padding: 8pt; overflow-x: auto; font-family: Consolas, monospace; font-size: 9pt; margin: 8pt 0; }
    code { font-family: Consolas, monospace; background: #f0f0f0; padding: 1pt 4pt; font-size: 9pt; }
    blockquote { margin: 8pt 0; padding-left: 12pt; border-left: 3pt solid #f59e0b; color: #444; }
    hr { border: none; border-top: 1pt solid #ccc; margin: 12pt 0; }
  `;
  const katexLink = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css" crossorigin="anonymous" />`;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${katexLink}<style>${style}</style></head><body class="markdown-body">${aligned}</body></html>`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Download Word (.docx) — same content as PDF, MS Word compatible
btnDownloadWord?.addEventListener('click', async () => {
  const md = inputEl.value?.trim();
  if (!md) {
    alert('Please enter some Markdown first.');
    return;
  }

  btnDownloadWord.classList.add('loading');
  btnDownloadWord.disabled = true;

  try {
    await loadHtmlDocxScript();
    const isCompact = document.querySelector('input[name="pdf-style"]:checked')?.value === 'compact';
    const practicalMode = isPracticalMode();
    let html = markdownToHtml(md);
    if (typeof html !== 'string') html = await html;
    const wordMath = document.createElement('div');
    wordMath.innerHTML = html;
    typesetMath(wordMath);
    const fullHtml = buildFullHtmlForWord(wordMath.innerHTML, isCompact);
    const blob = window.htmlDocx.asBlob(fullHtml);
    const subjectRaw = practicalMode ? (getPracticalDetails().SUBJECT || '').replace(/\s+/g, '_') : '';
    const baseName = subjectRaw ? (subjectRaw.endsWith('_Practical') ? subjectRaw : subjectRaw + '_Practical') : 'markdown-export';
    downloadBlob(blob, baseName + '.docx');
  } catch (err) {
    console.error(err);
    alert('Word export failed. Check the console for details.');
  } finally {
    btnDownloadWord.classList.remove('loading');
    btnDownloadWord.disabled = false;
  }
});

// Build HTML for Print-to-PDF (async in case marked returns a Promise)
async function getRenderedHtmlForPrint() {
  const md = inputEl.value?.trim();
  if (!md) return null;
  const isCompact = document.querySelector('input[name="pdf-style"]:checked')?.value === 'compact';
  const practicalMode = isPracticalMode();
  let html = markdownToHtml(md);
  if (typeof html !== 'string') html = await html;
  const temp = document.createElement('div');
  temp.className = 'preview-content markdown-body' + (isCompact ? ' markdown-body--compact' : '');
  temp.innerHTML = html;
  if (practicalMode) {
    temp.querySelectorAll('h2').forEach((h2) => h2.classList.add('page-break-before'));
  }
  typesetMath(temp);
  temp.style.width = '210mm';
  temp.style.padding = isCompact ? '12mm' : '20mm';
  temp.style.background = '#fff';
  temp.style.color = '#1a1a1a';
  temp.style.fontSize = isCompact ? '9.5pt' : '11pt';
  temp.style.lineHeight = isCompact ? '1.35' : '1.5';
  return { html: temp.innerHTML };
}

// Threshold: above this length, Download PDF uses Print to PDF (avoids canvas limit / blank PDF)
const LARGE_DOC_CHAR_THRESHOLD = 50000;

async function openPrintToPdf() {
  const data = await getRenderedHtmlForPrint();
  if (!data) return false;
  const printStyles = `
    body { margin: 0; background: #fff; color: #1a1a1a; font-family: 'Segoe UI', sans-serif; }
    .markdown-body { max-width: 210mm; margin: 0 auto; padding: 20mm; box-sizing: border-box; font-size: 11pt; line-height: 1.5; }
    .markdown-body h1 { font-size: 1.75rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid #ccc; }
    .markdown-body h2 { font-size: 1.35rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.4rem; }
    .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 { font-size: 1.1rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.3rem; }
    .markdown-body p { margin-bottom: 0.5rem; }
    .markdown-body ul, .markdown-body ol { margin: 0.5rem 0; padding-left: 1.5rem; }
    .markdown-body li { margin-bottom: 0.2rem; }
    .markdown-body table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; font-size: 10pt; }
    .markdown-body th, .markdown-body td { border: 1px solid #ccc; padding: 4px 8px; text-align: left; }
    .markdown-body th { background: #f0f0f0; font-weight: 600; }
    .markdown-body pre { background: #f5f5f5; padding: 8px; margin: 0.5rem 0; font-size: 9pt; overflow-x: auto; }
    .markdown-body code { font-family: monospace; background: #f0f0f0; padding: 1px 4px; font-size: 0.9em; }
    .markdown-body blockquote { margin: 0.5rem 0; padding-left: 1rem; border-left: 3px solid #f59e0b; color: #444; }
    .markdown-body hr { border: none; border-top: 1px solid #ccc; margin: 1rem 0; }
    .markdown-body .katex { font-size: 1.05em; }
    .markdown-body .katex-display { margin: 0.75rem 0; overflow-x: auto; overflow-y: hidden; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .markdown-body { padding: 15mm; }
      .page-break-before { page-break-before: always; }
      .page-break-before:first-child { page-break-before: avoid; }
      h1, h2, h3, h4 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
    }
  `;
  const katexLink = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css" crossorigin="anonymous" />`;
  const doc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Print to PDF</title>${katexLink}<style>${printStyles}</style></head><body class="markdown-body">${data.html}</body></html>`;
  const w = window.open('', '_blank');
  if (!w) {
    alert('Please allow pop-ups to use Print to PDF.');
    return;
  }
  w.document.write(doc);
  w.document.close();
  w.focus();
  w.onload = () => {
    w.setTimeout(() => {
      w.print();
    }, 250);
  };
  return true;
}

// Print to PDF button — opens print dialog; choose "Save as PDF" for selectable/copyable text
btnPrintPdf?.addEventListener('click', async () => {
  const ok = await openPrintToPdf();
  if (!ok) alert('Please enter some Markdown first.');
});

// Download PDF — uses html2pdf for short docs; automatically uses Print to PDF for long docs (avoids blank PDF)
btnDownload.addEventListener('click', async () => {
  const md = inputEl.value?.trim();
  if (!md) {
    alert('Please enter some Markdown first.');
    return;
  }

  // Long documents exceed canvas limits and produce blank PDF — use Print to PDF instead
  if (md.length > LARGE_DOC_CHAR_THRESHOLD) {
    const ok = await openPrintToPdf();
    if (ok) {
      return; // Print window opened, no need for html2pdf
    }
  }

  btnDownload.classList.add('loading');
  btnDownload.disabled = true;

  try {
    const { default: html2pdf } = await import('html2pdf.js');
    const isCompact = document.querySelector('input[name="pdf-style"]:checked')?.value === 'compact';
    const practicalMode = isPracticalMode();
    let html = markdownToHtml(md);
    if (typeof html !== 'string') html = await html;
    const temp = document.createElement('div');
    temp.className = 'preview-content markdown-body' + (isCompact ? ' markdown-body--compact' : '');
    temp.innerHTML = html;
    if (practicalMode) {
      temp.querySelectorAll('h2').forEach((h2) => {
        h2.classList.add('page-break-before');
      });
    }
    typesetMath(temp);
    temp.style.width = '210mm';
    temp.style.padding = isCompact ? '12mm' : '20mm';
    temp.style.background = '#fff';
    temp.style.color = '#1a1a1a';
    temp.style.fontSize = isCompact ? '9.5pt' : '11pt';
    temp.style.lineHeight = isCompact ? '1.35' : '1.5';

    const subjectRaw = practicalMode ? (getPracticalDetails().SUBJECT || '').replace(/\s+/g, '_') : '';
    const baseName = subjectRaw ? (subjectRaw.endsWith('_Practical') ? subjectRaw : subjectRaw + '_Practical') : 'markdown-export';

    const opt = {
      margin: isCompact ? 6 : 10,
      filename: baseName + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'], before: '.page-break-before', after: '.page-break-after', avoid: 'tr' },
    };

    await html2pdf().set(opt).from(temp).save();
  } catch (err) {
    console.error(err);
    alert('PDF generation failed. Check the console for details.');
  } finally {
    btnDownload.classList.remove('loading');
    btnDownload.disabled = false;
  }
});

// Mobile tab switching
const mainEl = document.querySelector('.main');
const tabEdit = document.getElementById('tab-edit');
const tabPreview = document.getElementById('tab-preview');

function updateMobileLayout() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  mainEl?.classList.toggle('panels-stacked', isMobile);
  if (isMobile) {
    const activeView = document.querySelector('.view-tab--active')?.dataset.view || 'edit';
    document.querySelectorAll('.panel').forEach((p) => {
      p.classList.toggle('panel--visible', p.dataset.panel === activeView);
    });
  } else {
    document.querySelectorAll('.panel').forEach((p) => p.classList.add('panel--visible'));
  }
}

function switchView(view) {
  document.querySelectorAll('.view-tab').forEach((t) => {
    t.classList.toggle('view-tab--active', t.dataset.view === view);
    t.setAttribute('aria-selected', t.dataset.view === view ? 'true' : 'false');
  });
  document.querySelectorAll('.panel').forEach((p) => {
    p.classList.toggle('panel--visible', p.dataset.panel === view);
  });
}

tabEdit?.addEventListener('click', () => switchView('edit'));
tabPreview?.addEventListener('click', () => switchView('preview'));

window.addEventListener('resize', updateMobileLayout);
updateMobileLayout();

// --- Mode: Standard / Practical File (form only visible in Practical File mode) ---
function setPracticalPanelVisible(visible) {
  if (!practicalPanel) return;
  practicalPanel.classList.toggle('practical-file-panel--hidden', !visible);
  practicalPanel.setAttribute('aria-hidden', String(!visible));
  if (visible) loadMyDetailsFromStorage();
}

modeRadios?.forEach((radio) => {
  radio.addEventListener('change', () => setPracticalPanelVisible(isPracticalMode()));
});
setPracticalPanelVisible(isPracticalMode());

// --- Practical: My details toggle ---
btnToggleMyDetails?.addEventListener('click', () => {
  const expanded = btnToggleMyDetails.getAttribute('aria-expanded') === 'true';
  if (myDetailsFields) myDetailsFields.hidden = expanded;
  btnToggleMyDetails.setAttribute('aria-expanded', String(!expanded));
});

// --- Practical: Load template ---
btnLoadPracticalTemplate?.addEventListener('click', () => {
  const details = getPracticalDetails();
  const filled = fillTemplate(PRACTICAL_FILE_TEMPLATE, details);
  inputEl.value = filled;
  renderPreview(filled);
  saveMyDetailsToStorage();
});

// --- Practical: Save my details when fields change ---
Object.keys(MY_DETAILS_FIELDS).forEach((id) => {
  const el = document.getElementById(id);
  el?.addEventListener('blur', saveMyDetailsToStorage);
});

// Init
renderPreview(inputEl.value);
updatePreviewStyle();
