import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
// Exercise the actual math preprocessing used by the app, without a browser dependency.
const source = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
const functions = source.slice(source.indexOf('function utf8ToBase64'), source.indexOf('function markdownToHtml'));
const context = vm.createContext({ TextEncoder, TextDecoder, btoa, atob });
vm.runInContext(functions, context);
const parse = text => context.preprocessDisplayMath(text);
assert.match(parse('$$\nx^2\n$$'), /md-math-display/);
assert.match(parse('\\(x^2\\)'), /md-math-inline/);
const fenced = '```js\nconst x = "$$literal$$";\n```';
assert.equal(parse(fenced), fenced);
const inline = 'Use `$$literal$$` and `\\(literal\\)` in code.';
assert.equal(parse(inline), inline);
assert.match(parse('Cost: \\$5'), /literal-dollar/);
assert.equal(context.base64ToUtf8(context.utf8ToBase64('α + β = हिन्दी')), 'α + β = हिन्दी');
console.log('Math regression checks passed: display, inline, code fences, inline code, currency, Unicode.');
