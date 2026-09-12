import { enhanceDocument, storeImage, inspectPrint } from './document-features.js';
import { connectImageFolder, disconnectImageFolder } from './local-folder.js';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/jetbrains-mono/400.css';
import SAMPLE_MARKDOWN from './sample.md?raw';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './styles.css';
marked.setOptions({ gfm: true, breaks: true });
const escapeAttribute = value => String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
marked.use({ renderer: { image({ href, text, title }) {
  const webOrEmbedded = /^(?:https?:|data:image\/|blob:|\/\/)/i.test(href);
  const appImage = href.startsWith('/__md2pdf_image__/') || href === '/sample-workflow.svg';
  const src = webOrEmbedded || appImage ? href : '/__md2pdf_path__/' + encodeURIComponent(href);
  return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(text)}"${title ? ` title="${escapeAttribute(title)}"` : ''}>`;
} } });
let katex, renderMathInElement, mermaid, mathReady, mermaidReady;
function loadMath() {
  return mathReady ||= Promise.all([import('katex'), import('katex/contrib/auto-render'), import('katex/dist/katex.min.css')]).then(([core, auto]) => { katex = core.default; renderMathInElement = auto.default; }).catch(error => { mathReady = null; throw error; });
}
function loadMermaid() {
  return mermaidReady ||= import('mermaid').then(module => {
    mermaid = module.default;
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' });
  }).catch(error => { mermaidReady = null; throw error; });
}
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
  // Leave inline code literal, including formulas shown as examples.
  return text.split(/(`+[^`]*`+)/g).map(part => part.startsWith('`') ? part : part
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, body) => mathBlockPlaceholder(body))
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, body) => mathBlockPlaceholder(body))
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, body) => inlineMathPlaceholder(body))
    .replace(/\\\$/g, '<span class="literal-dollar">$</span>')).join('');
}

function preprocessDisplayMath(md) {
  if (!md) return md;
  md = md.replace(/\r\n/g, '\n');
  return splitByCodeFences(md)
    .map((r) => (r.type === 'fence' ? r.content : preprocessMathInTextRegion(r.content)))
    .join('\n');
}

function markdownToHtml(md) {
  return DOMPurify.sanitize(marked.parse(preprocessDisplayMath(md)), { FORBID_TAGS: ['style', 'form', 'button', 'iframe'], FORBID_ATTR: ['style', 'id', 'name'] });
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
  ignoredClasses: ['literal-dollar'],
};

async function typesetMath(root) {
  if (!root.textContent.includes('$') && !root.querySelector('[data-tex-b64]')) return;
  await loadMath();
  if (!root) return;
  try {
    renderDisplayMathBlocks(root);
    renderInlineMathPlaceholders(root);
    renderMathInElement(root, KATEX_AUTO_RENDER_OPTIONS);
  } catch (err) {
    console.error(err);
  }
}

let mermaidIdCounter = 0;

/**
 * mermaid.render() shares parser state across calls — if two renders overlap (e.g. preview
 * re-renders while a previous diagram is still rendering), Mermaid corrupts its own state and
 * emits a bogus "Syntax error in text" diagram instead of throwing. Queue every call globally
 * so only one is ever in flight.
 */
let mermaidRenderQueue = Promise.resolve();

function queueMermaidRender(id, definition) {
  const result = mermaidRenderQueue.then(() => mermaid.render(id, definition));
  mermaidRenderQueue = result.catch(() => {});
  return result;
}

async function renderMermaidDiagrams(root) {
  if (!root) return;
  const codeBlocks = root.querySelectorAll('pre > code.language-mermaid');
  if (!codeBlocks.length) return;
  await loadMermaid();

  for (const codeEl of codeBlocks) {
    const pre = codeEl.parentElement;
    const definition = codeEl.textContent;
    try {
      const id = `md-mermaid-${mermaidIdCounter++}`;
      const { svg } = await queueMermaidRender(id, definition);
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-diagram';
      wrapper.innerHTML = svg;
      pre.replaceWith(wrapper);
    } catch (err) {
      console.error('Mermaid render error:', err);
      pre.classList.add('mermaid-error');
    }
  }
}


const $ = id => document.getElementById(id);
const input = $('markdown'), preview = $('document'), empty = preview.innerHTML;
const settings = ['paper', 'orientation', 'margin', 'density'];
let checkTimer;
function checkPrintLayout() {
  if (!input.value.trim()) return;
  inspectPrint(preview, { paper: $('paper').value, orientation: $('orientation').value, margin: Number($('margin').value), compact: $('density').value === 'compact' }, $('print-warnings'));
}
function schedulePrintCheck() {
  clearTimeout(checkTimer);
  checkTimer = setTimeout(checkPrintLayout, 200);
}
preview.addEventListener('load', schedulePrintCheck, true);
preview.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#doc-"]');
  if (!link) return;
  const target = [...preview.querySelectorAll('h1,h2,h3,h4,h5,h6')].find(heading => '#' + heading.id === link.getAttribute('href'));
  if (!target) { event.preventDefault(); status('That section was not found. Check the heading link.'); return; }
  event.preventDefault();
  target.scrollIntoView({ block: 'start' }); target.focus({ preventScroll: true });
});
input.addEventListener('paste', async event => {
  const images = [...(event.clipboardData?.items || [])].filter(item => item.type.startsWith('image/'));
  if (!images.length || printing) return;
  event.preventDefault();
  const before = input.value, start = input.selectionStart, end = input.selectionEnd;
  status('Saving pasted image in this browser…');
  try {
    const paths = await Promise.all(images.map(item => storeImage(item.getAsFile())));
    if (input.value !== before || printing) { status('The document changed while the image was saving. Please paste again.'); return; }
    previous = before; $('undo').hidden = false;
    const markdown = '\n' + paths.map((path, index) => '![Pasted image ' + (index + 1) + '](' + path + ')').join('\n') + '\n';
    input.setRangeText(markdown, start, end, 'end');
    await refresh();
  } catch (error) { status(error.message || 'Image could not be saved. Your document is unchanged.'); }
});
const draftKey = 'md2pdf.draft.v1';
let revision = 0, timer, previous = null, printing = false;
function status(message) { $('status').textContent = message; }
function save() {
  try {
    if (input.value) localStorage.setItem(draftKey, JSON.stringify({ text: input.value, settings: Object.fromEntries(settings.map(id => [id, $(id).value])) }));
    else localStorage.removeItem(draftKey);
    $('draft-status').textContent = input.value ? 'Draft saved in this browser' : 'Stored only in this browser';
  } catch { $('draft-status').textContent = 'Draft storage unavailable — keep this tab open'; }
  $('word-count').textContent = (input.value.trim().match(/\S+/g)?.length || 0).toLocaleString() + ' words';
}
function applySettings() {
  const size = $('paper').value === 'A4' ? [210, 297] : [215.9, 279.4];
  if ($('orientation').value === 'landscape') size.reverse();
  preview.style.setProperty('--paper-width', size[0] + 'mm');
  preview.style.setProperty('--paper-height', size[1] + 'mm');
  preview.style.setProperty('--margin', $('margin').value + 'mm');
  preview.classList.toggle('compact', $('density').value === 'compact');
  $('page-label').textContent = $('paper').value + ' · ' + ($('density').value === 'compact' ? 'Compact' : 'Normal');
  $('page-style').textContent = '@page { size: ' + $('paper').value + ' ' + $('orientation').value + '; margin: ' + $('margin').value + 'mm; }';
}
async function render() {
  const current = ++revision;
  $('print').disabled = true;
  if (!input.value.trim()) { preview.innerHTML = empty; $('print-warnings').hidden = true; document.title = 'md2pdf'; status('Ready when you are.'); return false; }
  status('Preparing document…');
  try {
    const next = document.createElement('div');
    next.innerHTML = markdownToHtml(input.value);
    await enhanceDocument(next);
    await typesetMath(next);
    if (current !== revision) return false;
    await renderMermaidDiagrams(next);
    if (current !== revision) return false;
    preview.replaceChildren(...next.childNodes);
    schedulePrintCheck();
    const title = preview.querySelector('h1')?.textContent?.trim() || 'Markdown document';
    document.title = title.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').slice(0, 120) || 'Markdown document';
    $('print').disabled = printing;
    status(preview.querySelector('.mermaid-error,.katex-error') ? 'Some formulas or diagrams need attention; their source is preserved.' : 'Ready to print.');
    return true;
  } catch (error) {
    if (current === revision) status('Could not prepare the document. Edit the text or try again.');
    console.error(error); return false;
  }
}
function refresh() { clearTimeout(timer); save(); return render(); }
input.addEventListener('input', () => { ++revision; $('print').disabled = true; clearTimeout(timer); save(); timer = setTimeout(render, 160); });
function replace(text) { previous = input.value; $('undo').hidden = false; input.value = text; refresh(); }
$('clear').onclick = () => { replace(''); input.focus(); };
$('undo').onclick = () => { if (previous === null) return; input.value = previous; previous = null; $('undo').hidden = true; refresh(); };
$('open').onclick = () => $('file').click();
let uploadedName = '', uploadedText = '';
$('image-folder').onclick = () => $('folder-input').click();
$('folder-input').onchange = async () => {
  const files = [...$('folder-input').files];
  if (!files.length) return;
  try {
    const result = await connectImageFolder(files, uploadedName, uploadedText);
    $('folder-status').textContent = 'Folder connected: ' + files[0].webkitRelativePath.split('/')[0] + (result.locatedMarkdown ? '. Relative image paths resolved from your Markdown file.' : '. Images matched by unique path or filename.');
    await refresh();
  } catch { status('Could not read the folder. Select it again.'); }
  finally { $('folder-input').value = ''; }
};
async function openFile(file) {
  if (!file || printing) return;
  if (!/\.(md|markdown|txt)$/i.test(file.name)) { status('Choose a .md, .markdown or .txt file.'); return; }
  try {
    const text = await file.text();
    uploadedName = file.name; uploadedText = text;
    disconnectImageFolder();
    $('folder-status').textContent = 'Local images? Select Image folder and choose the parent of this Markdown file’s folder to include its subfolders.';
    replace(text);
  } catch { status('This file could not be read. Your draft is unchanged.'); }
}
$('file').onchange = async () => { await openFile($('file').files[0]); $('file').value = ''; };
let dragDepth = 0;
document.addEventListener('dragenter', event => { if (!Array.from(event.dataTransfer.types).includes('Files')) return; event.preventDefault(); dragDepth++; document.body.classList.add('dragging'); });
document.addEventListener('dragover', event => { if (Array.from(event.dataTransfer.types).includes('Files')) event.preventDefault(); });
document.addEventListener('dragleave', () => { if (--dragDepth <= 0) document.body.classList.remove('dragging'); });
document.addEventListener('drop', event => { if (!event.dataTransfer.files.length) return; event.preventDefault(); dragDepth = 0; document.body.classList.remove('dragging'); openFile(event.dataTransfer.files[0]); });
for (const id of settings) $(id).onchange = () => { applySettings(); save(); schedulePrintCheck(); };
for (const id of ['settings', 'help']) $(id + '-toggle').onclick = () => { $(id).hidden = !$(id).hidden; $(id + '-toggle').setAttribute('aria-expanded', String(!$(id).hidden)); };
function closeHelp() { $('help').hidden = true; $('help-toggle').setAttribute('aria-expanded', 'false'); $('help-toggle').focus(); }
$('help-close').onclick = closeHelp;
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('help').hidden) closeHelp();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') { event.preventDefault(); printDocument(); }
});
for (const view of ['edit', 'preview']) $(view + '-tab').onclick = () => { document.body.classList.toggle('preview-active', view === 'preview'); $('edit-tab').setAttribute('aria-pressed', String(view === 'edit')); $('preview-tab').setAttribute('aria-pressed', String(view === 'preview')); };
$('sample').onclick = () => {
  replace(SAMPLE_MARKDOWN);
  closeHelp();
};
async function printDocument() {
  if (printing || !input.value.trim()) return;
  printing = true; input.readOnly = true;
  const controls = [...document.querySelectorAll('button, select')];
  controls.forEach(control => { control.disabled = true; });
  try {
    if (!await refresh()) return;
    status('Waiting for images and fonts…');
    await document.fonts.ready;
    await Promise.all([...preview.querySelectorAll('img')].map(img => new Promise(resolve => {
      if (img.complete) return resolve();
      const finish = () => { clearTimeout(timeout); img.removeEventListener('load', finish); img.removeEventListener('error', finish); resolve(); };
      const timeout = setTimeout(finish, 10000);
      img.addEventListener('load', finish, { once: true }); img.addEventListener('error', finish, { once: true });
    })));
    if ([...preview.querySelectorAll('img')].some(img => !img.complete || !img.naturalWidth)) { status('An image could not load. Check its address, then print again.'); return; }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    checkPrintLayout();
    window.print(); status('Print dialog opened. Choose Save as PDF.');
  } catch (error) { status('Printing failed. Please try again.'); console.error(error); }
  finally { printing = false; input.readOnly = false; controls.forEach(control => { control.disabled = false; }); $('print').disabled = !input.value.trim(); }
}
$('print').onclick = printDocument;
$('word').onclick = async () => {
  if (printing || !input.value.trim()) return;
  printing = true; input.readOnly = true;
  const controls = [...document.querySelectorAll('button, select')];
  controls.forEach(control => { control.disabled = true; });
  try {
    if (!await refresh()) return;
    await document.fonts.ready;
    status('Preparing editable Word document…');
    checkPrintLayout();
    const { createWord } = await import('./word-export.js');
    const blob = await createWord(preview, { paper: $('paper').value, orientation: $('orientation').value, margin: Number($('margin').value), compact: $('density').value === 'compact' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url;
    link.download = (document.title || 'document') + '.docx';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    status('Word downloaded. Text and tables are editable; diagrams and equations are images.');
  } catch (error) { status('Word export failed: ' + error.message); console.error(error); }
  finally { printing = false; input.readOnly = false; controls.forEach(control => { control.disabled = false; }); $('print').disabled = !input.value.trim(); }
};
input.value = SAMPLE_MARKDOWN;
try {
  const saved = JSON.parse(localStorage.getItem(draftKey) || 'null');
  if (saved && typeof saved.text === 'string') {
    input.value = saved.text;
    for (const id of settings) if ([...$(id).options].some(option => option.value === saved.settings?.[id])) $(id).value = saved.settings[id];
  }
} catch { status('Saved draft could not be restored.'); }
applySettings(); refresh();
