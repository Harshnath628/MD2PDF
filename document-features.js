import { folderImage } from './local-folder.js';
const imagePrefix = '/__md2pdf_image__/';
const folderUrls = new WeakMap();
const imageUrls = new Map();
let database;
function imageDatabase() {
  return database ||= new Promise((resolve, reject) => {
    const request = indexedDB.open('md2pdf-images', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('images');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).catch(error => { database = null; throw error; });
}
async function imageRecord(id, blob) {
  const db = await imageDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', blob ? 'readwrite' : 'readonly');
    const store = tx.objectStore('images');
    const request = blob ? store.put(blob, id) : store.get(id);
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Image storage unavailable'));
  });
}
export async function storeImage(file) {
  if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) throw new Error('Paste a PNG, JPEG, WebP or GIF image.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Please use an image smaller than 10 MB.');
  const id = crypto.randomUUID();
  await imageRecord(id, file);
  return imagePrefix + id;
}
export function headingSlug(text) {
  return text.toLowerCase().trim().replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, '').replace(/\s+/g, '-') || 'section';
}
let highlighter;
export async function enhanceDocument(root) {
  const blocks = [...root.querySelectorAll('pre > code')].filter(code => !code.classList.contains('language-mermaid'));
  if (blocks.length) {
    const hl = await (highlighter ||= import('highlight.js/lib/common').then(module => module.default));
    for (const code of blocks) {
      const language = [...code.classList].find(name => name.startsWith('language-'))?.slice(9);
      if (language && hl.getLanguage(language)) {
        code.innerHTML = hl.highlight(code.textContent, { language, ignoreIllegals: true }).value;
        code.classList.add('hljs');
      }
    }
  }
  const ids = new Set();
  for (const heading of root.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const base = headingSlug(heading.textContent);
    let slug = base, suffix = 1;
    while (ids.has(slug)) slug = base + '-' + suffix++;
    ids.add(slug);
    heading.id = 'doc-' + slug;
    heading.tabIndex = -1;
    heading.title = 'Link to this section: #' + slug;
  }
  for (const link of root.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      try {
        const target = decodeURIComponent(href.slice(1));
        link.setAttribute('href', '#doc-' + (ids.has(target) ? target : headingSlug(target)));
      } catch { link.removeAttribute('href'); }
    } else {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }
  await Promise.all([...root.querySelectorAll('img')].map(async img => {
    const src = img.getAttribute('src');
    if (src?.startsWith('/__md2pdf_path__/')) {
      const reference = decodeURIComponent(src.slice('/__md2pdf_path__/'.length));
      const result = folderImage(reference);
      if (result.file) {
        // SVG is displayed only as an image, never injected into the document.
        if (!folderUrls.has(result.file)) folderUrls.set(result.file, URL.createObjectURL(result.file));
        img.src = folderUrls.get(result.file);
      } else {
        img.removeAttribute('src');
        img.dataset.missingImage = 'true';
        img.alt = result.error === 'ambiguous' ? 'Multiple images match ' + reference + '. Use its relative folder path.' : 'Image not found: ' + reference + '. Select the parent folder with Image folder.';
      }
      return;
    }
    if (!src?.startsWith(imagePrefix)) return;
    try {
      if (!imageUrls.has(src)) {
        const blob = await imageRecord(src.slice(imagePrefix.length));
        if (!blob) throw new Error('Image missing');
        imageUrls.set(src, URL.createObjectURL(blob));
      }
      img.src = imageUrls.get(src);
    } catch {
      img.removeAttribute('src');
      img.dataset.missingImage = 'true';
      img.alt = 'Local image unavailable — paste it again in this browser.';
    }
  }));
}
export function fitDiagram(width, height, availableWidth, availableHeight) {
  const scale = Math.min(1, availableWidth / width, availableHeight / height);
  return { width: width * scale, height: height * scale, scale };
}
export function inspectPrint(root, { paper, orientation, margin, compact }, warnings) {
  let [width, height] = paper === 'A4' ? [210, 297] : [215.9, 279.4];
  if (orientation === 'landscape') [width, height] = [height, width];
  width -= margin * 2; height -= margin * 2;
  const messages = [];
  for (const svg of root.querySelectorAll('.mermaid-diagram svg')) {
    const box = svg.viewBox.baseVal;
    if (!box.width || !box.height) continue;
    const fit = fitDiagram(box.width, box.height, width * 96 / 25.4, (height - 12) * 96 / 25.4);
    svg.style.setProperty('--diagram-print-width', fit.width + 'px');
    svg.style.setProperty('--diagram-print-height', fit.height + 'px');
    if (fit.scale < .65) messages.push('A large diagram will be reduced to fit one page. Landscape may improve readability.');
  }
  root.style.setProperty('--print-content-height', (height - 12) + 'mm');
  const measure = root.cloneNode(true);
  measure.classList.add('print-measure');
  measure.style.width = width + 'mm';
  measure.style.fontSize = compact ? '9.5pt' : '11pt';
  measure.removeAttribute('id');
  measure.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  document.body.append(measure);
  try {
    for (const el of measure.querySelectorAll('table, .katex-display, .mermaid-diagram, pre')) {
      const tooWide = el.scrollWidth > el.clientWidth + 2;
      const tooTall = el.getBoundingClientRect().height > height * 96 / 25.4;
      if (tooWide) messages.push(el.matches('.katex-display') ? 'An equation exceeds the printable width. Use landscape or split the equation into lines.' : 'Some content exceeds the printable width. Use landscape or reduce its width.');
      if (tooTall && el.matches('table')) messages.push('A long table spans multiple pages; column headers repeat.');
    }
    if ([...measure.querySelectorAll('td,th')].some(cell => cell.scrollWidth > cell.clientWidth + 2)) messages.push('A table cell may be clipped. Use landscape or shorten the cell content.');
    if ([...measure.querySelectorAll('tr')].some(row => row.getBoundingClientRect().height > height * 96 / 25.4)) messages.push('A table row is taller than a page. Split its content into smaller rows.');
  } finally { measure.remove(); }
  if (root.querySelector('[data-missing-image]')) messages.push('A local image is unavailable. Paste it again before printing.');
  if (root.querySelector('.mermaid-error,.katex-error')) messages.push('A diagram or equation has a syntax error. Its source will print instead.');
  warnings.replaceChildren();
  warnings.hidden = messages.length === 0;
  if (messages.length) {
    const title = document.createElement('strong'); title.textContent = 'Print layout check'; warnings.append(title);
    for (const message of new Set(messages)) { const item = document.createElement('p'); item.textContent = message; warnings.append(item); }
    const note = document.createElement('p'); note.textContent = 'Estimates use your page settings. Check the browser print preview for final page breaks.'; warnings.append(note);
  }
}
