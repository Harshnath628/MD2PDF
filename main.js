import { marked } from 'marked';

// Marked config — tables, breaks, etc.
marked.setOptions({
  gfm: true,
  breaks: true,
});

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

**Architecture** — View to software designers
**Organization** — Hardware implementation

## Basics of Computer Architecture
Three key parts:
- Computer
- Stored information
- Program (instructions)

Computer takes program → performs operations on data → produces results.

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
const previewContainer = document.getElementById('preview-container');
const btnSample = document.getElementById('btn-sample');
const btnClear = document.getElementById('btn-clear');
const btnDownload = document.getElementById('btn-download');
const fileInput = document.getElementById('file-input');

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

inputEl.addEventListener('input', () => renderPreview(inputEl.value));

// Sync preview when PDF style changes
document.querySelectorAll('input[name="pdf-style"]').forEach((radio) => {
  radio.addEventListener('change', updatePreviewStyle);
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
    let html = marked.parse(md);
    if (typeof html !== 'string') html = await html;
    const temp = document.createElement('div');
    temp.className = 'preview-content markdown-body' + (isCompact ? ' markdown-body--compact' : '');
    temp.innerHTML = html;
    temp.style.width = '210mm';
    temp.style.padding = isCompact ? '12mm' : '20mm';
    temp.style.background = '#fff';
    temp.style.color = '#1a1a1a';
    temp.style.fontSize = isCompact ? '9.5pt' : '11pt';
    temp.style.lineHeight = isCompact ? '1.35' : '1.5';

    const opt = {
      margin: isCompact ? 6 : 10,
      filename: 'markdown-export.pdf',
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

// Init
renderPreview(inputEl.value);
updatePreviewStyle();
