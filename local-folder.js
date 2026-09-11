export function normalizePath(path) {
  const parts = [];
  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') { if (!parts.length) return null; parts.pop(); }
    else parts.push(part);
  }
  return parts.join('/');
}
export function resolveImagePath(reference, paths, markdownPath = '') {
  let decoded;
  try { decoded = decodeURIComponent(reference.split('#')[0].split('?')[0]); } catch { decoded = reference; }
  decoded = decoded.replace(/\\/g, '/');
  const base = markdownPath.includes('/') ? markdownPath.slice(0, markdownPath.lastIndexOf('/') + 1) : '';
  const absolute = /^(?:file:|[a-z]:\/|\/)/i.test(decoded);
  const exact = normalizePath(absolute ? decoded.replace(/^file:\/*/i, '').replace(/^[a-z]:\//i, '') : base + decoded);
  if (exact && paths.includes(exact)) return { path: exact };
  // Search only the explicitly selected folder tree. Never choose between duplicate names.
  const suffix = decoded.replace(/^file:\/*/i, '').replace(/^[a-z]:\//i, '').replace(/^(?:\.\.\/|\.\/|\/)+/, '');
  const suffixMatches = paths.filter(path => path === suffix || path.endsWith('/' + suffix));
  if (suffixMatches.length === 1) return { path: suffixMatches[0] };
  const name = decoded.split('/').pop();
  const matches = paths.filter(path => path.split('/').pop() === name);
  return matches.length === 1 ? { path: matches[0] } : { error: matches.length ? 'ambiguous' : 'missing' };
}
let folderFiles = new Map(), folderMarkdown = '';
export async function connectImageFolder(files, markdownName, markdownText) {
  const next = new Map();
  for (const file of files) {
    const relative = file.webkitRelativePath.split('/').slice(1).join('/');
    if (relative) next.set(relative, file);
  }
  const candidates = [...next].filter(([path]) => path.split('/').pop() === markdownName);
  const matching = [];
  for (const [path, file] of candidates) if (await file.text() === markdownText) matching.push(path);
  folderFiles = next;
  folderMarkdown = matching.length === 1 ? matching[0] : '';
  return { files: next.size, locatedMarkdown: matching.length === 1 };
}
export function disconnectImageFolder() { folderFiles = new Map(); folderMarkdown = ''; }
export function folderImage(reference) {
  const result = resolveImagePath(reference, [...folderFiles.keys()], folderMarkdown);
  return result.path ? { file: folderFiles.get(result.path) } : result;
}
