import { marked } from 'marked';

// Marked config — tables, breaks, etc.
marked.setOptions({
  gfm: true,
  breaks: true,
});

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
const btnSample = document.getElementById('btn-sample');
const btnClear = document.getElementById('btn-clear');
const btnDownload = document.getElementById('btn-download');
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
  } else {
    try {
      const result = marked.parse(md);
      if (typeof result === 'string') {
        previewEl.innerHTML = result;
      } else {
        result.then((html) => { previewEl.innerHTML = html; });
      }
    } catch (err) {
      previewEl.innerHTML = `<p class="preview-error">Parse error: ${err.message}</p>`;
    }
  }
  updatePreviewStyle();
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

// Download PDF — lazy load html2pdf for faster initial load
btnDownload.addEventListener('click', async () => {
  const md = inputEl.value?.trim();
  if (!md) {
    alert('Please enter some Markdown first.');
    return;
  }

  btnDownload.classList.add('loading');
  btnDownload.disabled = true;

  try {
    const { default: html2pdf } = await import('html2pdf.js');
    const isCompact = document.querySelector('input[name="pdf-style"]:checked')?.value === 'compact';
    const practicalMode = isPracticalMode();
    let html = marked.parse(md);
    if (typeof html !== 'string') html = await html;
    const temp = document.createElement('div');
    temp.className = 'preview-content markdown-body' + (isCompact ? ' markdown-body--compact' : '');
    temp.innerHTML = html;
    if (practicalMode) {
      temp.querySelectorAll('h2').forEach((h2) => {
        h2.classList.add('page-break-before');
      });
    }
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
