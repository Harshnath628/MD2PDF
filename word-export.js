import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, ExternalHyperlink, InternalHyperlink, Bookmark, WidthType, HeadingLevel, ShadingType, LevelFormat } from 'docx';
import { toPng } from 'html-to-image';

// Convert the already-rendered document so local images and Mermaid are resolved.
export async function createWord(root, settings) {
  const copy = root.cloneNode(true);
  copy.removeAttribute('id');
  copy.classList.add('print-measure');
  copy.style.setProperty('visibility', 'visible', 'important');
  const pageWidth = settings.paper === 'Letter' ? 215.9 : 210;
  const pageHeight = settings.paper === 'Letter' ? 279.4 : 297;
  copy.style.width = ((settings.orientation === 'landscape' ? pageHeight : pageWidth) - settings.margin * 2) + 'mm';
  copy.style.fontSize = settings.compact ? '9.5pt' : '11pt';
  copy.setAttribute('aria-hidden', 'true');
  document.body.append(copy);
  try { return await buildWord(copy, settings); }
  finally { copy.remove(); }
}

async function buildWord(root, settings) {
  const mm = value => Math.round(value * 1440 / 25.4);
  let [width, height] = settings.paper === 'Letter' ? [215.9, 279.4] : [210, 297];
  if (settings.orientation === 'landscape') [width, height] = [height, width];
  const pxWidth = (width - settings.margin * 2) * 96 / 25.4;
  // Leave room for the preceding heading and paragraph spacing on a fresh page.
  const pxHeight = (height - settings.margin * 2 - 30) * 96 / 25.4;
  const size = settings.compact ? 19 : 22;
  const anchors = new Map([...root.querySelectorAll('[id]')].map((el, i) => [el.id, 'section_' + i]));
  const numbering = [];
  const tokenColors = { 'hljs-keyword': '7B219C', 'hljs-string': '225D2B', 'hljs-number': '984A0B', 'hljs-title': '075C91', 'hljs-comment': '555E55', 'hljs-built_in': '984A0B', 'hljs-literal': '7B219C' };

  async function picture(el, available = pxWidth) {
    let data, w, h;
    if (el.tagName === 'IMG') {
      if (!el.getAttribute('src') || el.dataset.missingImage) throw new Error('An image is missing. Connect its image folder or paste it again.');
      const response = await fetch(el.src);
      if (!response.ok) throw new Error('Could not load an image for Word. Save it locally and connect its folder.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      try {
        const img = new Image(); img.src = url; await img.decode();
        w = img.naturalWidth; h = img.naturalHeight;
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0);
        data = canvas.toDataURL('image/png');
      } finally { URL.revokeObjectURL(url); }
    } else {
      const target = el.matches('.mermaid-diagram') ? el.querySelector('svg') : el;
      const rect = target.getBoundingClientRect(); w = rect.width; h = rect.height;
      data = await toPng(target, { width: Math.ceil(w), height: Math.ceil(h), pixelRatio: 2, backgroundColor: '#ffffff', style: { display: 'inline-block', visibility: 'visible', margin: '0' }, skipFonts: false });
    }
    if (!w || !h) throw new Error('A diagram could not be rendered for Word.');
    const scale = Math.min(1, available / w, pxHeight / h);
    if (!data.startsWith('data:image/png;base64,')) throw new Error('An equation or diagram could not be captured.');
    const bytes = new Uint8Array(await (await fetch(data)).arrayBuffer());
    return new ImageRun({ data: bytes, type: 'png', transformation: { width: Math.round(w * scale), height: Math.round(h * scale) }, altText: { title: el.alt || 'Diagram or equation', description: el.alt || el.textContent, name: 'Document image' } });
  }

  async function inline(node, style = {}, available = pxWidth) {
    if (node.nodeType === 3) {
      const text = node.parentElement?.closest('pre') ? node.textContent : node.textContent.replace(/\s+/g, ' ');
      return text.split('\n').map((line, i) => new TextRun({ text: line, ...style, ...(i ? { break: 1 } : {}) }));
    }
    if (node.nodeType !== 1) return [];
    const tag = node.tagName;
    if (node.matches('.katex')) return [await picture(node, available)];
    if (tag === 'IMG' || tag === 'SVG') return [await picture(node, available)];
    if (tag === 'BR') return [new TextRun({ break: 1 })];
    if (tag === 'INPUT') return [new TextRun(node.checked || node.hasAttribute('checked') ? '☑ ' : '☐ ')];
    const next = { ...style };
    if (['STRONG', 'B'].includes(tag)) next.bold = true;
    if (['EM', 'I'].includes(tag)) next.italics = true;
    if (['DEL', 'S'].includes(tag)) next.strike = true;
    if (tag === 'CODE') Object.assign(next, { font: 'Consolas', size: Math.round(size * .85), shading: { type: ShadingType.CLEAR, fill: 'F3F4F5' } });
    for (const cls of node.classList) if (tokenColors[cls]) next.color = tokenColors[cls];
    const children = (await Promise.all([...node.childNodes].map(n => inline(n, next, available)))).flat();
    if (tag === 'A') {
      const href = node.getAttribute('href') || '';
      if (href.startsWith('#') && anchors.has(href.slice(1))) return [new InternalHyperlink({ anchor: anchors.get(href.slice(1)), children })];
      if (/^(https?:|mailto:)/i.test(href)) return [new ExternalHyperlink({ link: href, children })];
    }
    return children;
  }

  async function blocks(container, available = pxWidth, depth = 0, paragraphStyle = {}) {
    const out = [];
    let pageBreakBefore = false;
    const paragraph = options => {
      out.push(new Paragraph({ ...paragraphStyle, ...options, ...(pageBreakBefore ? { pageBreakBefore: true } : {}) }));
      pageBreakBefore = false;
    };
    for (const el of container.childNodes) {
      if (el.nodeType === 3) { if (el.textContent.trim()) paragraph({ children: await inline(el) }); continue; }
      if (el.nodeType !== 1) continue;
      if (el.matches('.page-break,.page-break-before')) { pageBreakBefore = true; continue; }
      if (el.matches('.mermaid-diagram,.katex-display')) { paragraph({ children: [await picture(el, available)], alignment: 'center', keepLines: true, spacing: { before: 80, after: 80, line: 240 } }); continue; }
      if (el.tagName === 'TABLE') {
        const rows = [...el.rows]; const count = Math.max(1, ...rows.map(r => r.cells.length));
        const col = Math.floor(available * 15 / count);
        if (pageBreakBefore) paragraph({ spacing: { before: 0, after: 0, line: 20 }, keepNext: true });
        const border = { style: 'single', size: 4, color: 'CBD0C7' };
        out.push(new Table({ width: { size: col * count, type: WidthType.DXA }, columnWidths: Array(count).fill(col), borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border }, rows: await Promise.all(rows.map(async row => new TableRow({ tableHeader: row.parentElement.tagName === 'THEAD', cantSplit: true, children: await Promise.all([...row.cells].map(async cell => new TableCell({ width: { size: col, type: WidthType.DXA }, shading: cell.tagName === 'TH' ? { type: ShadingType.CLEAR, fill: 'F5F5F4' } : undefined, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ alignment: cell.getAttribute('align') || 'left', spacing: { before: 0, after: 0, line: Math.round(size * 9 * (settings.compact ? 1.35 : 1.6)), lineRule: 'atLeast' }, children: await inline(cell, { bold: cell.tagName === 'TH', size: Math.round(size * .9) }, col / 15 - 14) })] }))) }))) }));
        paragraph({ spacing: { before: 0, after: 60, line: 20 } }); continue;
      }
      if (['UL','OL'].includes(el.tagName)) {
        const reference = 'list_' + numbering.length;
        numbering.push({ reference, levels: [{ level: 0, format: el.tagName === 'OL' ? LevelFormat.DECIMAL : LevelFormat.BULLET, text: el.tagName === 'OL' ? '%1.' : '•', start: Number(el.getAttribute('start')) || 1, alignment: 'left', style: { paragraph: { indent: { left: 360 * (depth + 1), hanging: 240 } } } }] });
        for (const li of el.children) {
          const copy = li.cloneNode(true); copy.querySelectorAll('ul,ol').forEach(n => n.remove());
          const task = copy.querySelector('input[type="checkbox"]');
          paragraph({ children: await inline(copy), ...(task ? { indent: { left: 360 * (depth + 1), hanging: 240 } } : { numbering: { reference, level: 0 } }), spacing: { before: 0, after: Math.round(size * 2) } });
          for (const nested of li.children) if (['UL','OL'].includes(nested.tagName)) { const wrap = document.createElement('div'); wrap.append(nested.cloneNode(true)); out.push(...await blocks(wrap, available - 24, depth + 1, paragraphStyle)); }
        }
        continue;
      }
      if (el.tagName === 'PRE') {
        paragraph({ children: await inline(el, { font: 'Consolas', size: Math.round(size * .85) }), shading: { type: ShadingType.CLEAR, fill: 'F3F4F5' }, spacing: { before: 120, after: 120, line: Math.round(size * 8.5 * (settings.compact ? 1.35 : 1.6)), lineRule: 'atLeast' }, keepLines: el.textContent.split('\n').length <= 20 }); continue;
      }
      if (el.tagName === 'HR') { paragraph({ border: { bottom: { style: 'single', size: 4, color: 'DDDDDD' } } }); continue; }
      if (el.tagName === 'BLOCKQUOTE') {
        out.push(...await blocks(el, available - 16, depth, { ...paragraphStyle, ...(pageBreakBefore ? { pageBreakBefore: true } : {}), indent: { left: 240 }, border: { left: { style: 'single', color: 'F59E0B', size: 18, space: 8 } } })); pageBreakBefore = false; continue;
      }
      if (/^H[1-6]$/.test(el.tagName)) {
        paragraph({ heading: HeadingLevel['HEADING_' + el.tagName[1]], children: [new Bookmark({ id: anchors.get(el.id), children: await inline(el) })], keepNext: true, ...(el.tagName === 'H1' ? { border: { bottom: { style: 'single', color: 'E5E5E5', size: 4, space: 5 } } } : {}) }); continue;
      }
      if (['DIV','SECTION','ARTICLE'].includes(el.tagName)) out.push(...await blocks(el, available, depth, paragraphStyle));
      else paragraph({ children: await inline(el, {}, available) });
    }
    return out;
  }
  const children = await blocks(root);
  const doc = new Document({ title: document.title, creator: 'Markdown to PDF', styles: { default: { document: { run: { font: 'Segoe UI', size, color: '202020' }, paragraph: { spacing: { after: settings.compact ? 80 : 140, line: Math.round(size * 10 * (settings.compact ? 1.35 : 1.6)), lineRule: 'atLeast' } } } }, paragraphStyles: Array.from({ length: 6 }, (_, i) => ({ id: 'Heading' + (i + 1), name: 'Heading ' + (i + 1), basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Segoe UI', bold: true, color: '202020', size: Math.round(size * [2,1.5,1.2,1,1,1][i]) }, paragraph: { spacing: { before: 220, after: 100, line: Math.round(size * [2,1.5,1.2,1,1,1][i] * 12.5), lineRule: 'atLeast' }, keepNext: true } })) }, numbering: { config: numbering }, sections: [{ properties: { page: { size: { width: mm(Math.min(width, height)), height: mm(Math.max(width, height)), orientation: settings.orientation }, margin: { top: mm(settings.margin), bottom: mm(settings.margin), left: mm(settings.margin), right: mm(settings.margin) } } }, children }] });
  return Packer.toBlob(doc);
}



