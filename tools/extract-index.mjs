#!/usr/bin/env node
/**
 * 從 repo 根目錄 index.html 抽出 CSS、各 section 與 inline script，寫入 site/src/legacy。
 * 用法：node tools/extract-index.mjs（在 repo 根目錄執行）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(root, 'index.html');
const siteLegacy = path.join(root, 'site', 'src', 'legacy');
const sectionsDir = path.join(siteLegacy, 'sections');

const html = fs.readFileSync(indexPath, 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync(path.join(root, 'site', 'src', 'styles', 'global.css'), styleMatch[1].trim() + '\n');
}

const sectionRe = /<section\b[^>]*id="(x[^"]+)"[\s\S]*?<\/section>/g;
const sections = [];
let m;
while ((m = sectionRe.exec(html)) !== null) {
  sections.push({ id: m[1], body: m[0] });
}

fs.mkdirSync(sectionsDir, { recursive: true });
for (const { id, body } of sections) {
  fs.writeFileSync(path.join(sectionsDir, `${id}.html`), body.trim() + '\n');
}

const footMatch = html.match(/(<footer[\s\S]*?<\/footer>)/);
if (footMatch) {
  fs.writeFileSync(path.join(sectionsDir, '_foot.html'), footMatch[1].trim() + '\n');
}

const mainParts = sections.map((s) => s.body);
if (footMatch) mainParts.push(footMatch[1]);
fs.writeFileSync(path.join(siteLegacy, 'main-content.html'), mainParts.join('\n\n') + '\n');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((x) => x[1].trim());
if (scripts.length) {
  const combined = scripts.join('\n\n');
  const out = path.join(siteLegacy, 'inline-scripts.js');
  fs.writeFileSync(out, combined + '\n');
  fs.mkdirSync(path.join(root, 'site', 'public', 'legacy'), { recursive: true });
  fs.writeFileSync(path.join(root, 'site', 'public', 'legacy', 'inline-scripts.js'), combined + '\n');
}

console.log(`extract-index: ${sections.length} sections → ${siteLegacy}`);
