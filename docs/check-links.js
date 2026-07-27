#!/usr/bin/env node
/**
 * 一次性链接校验脚本（docs/check-links.js）
 *
 * 模拟线上环境：
 *  1. 读取每个 HTML 的 <base href="...">（线上保留）
 *  2. 按 base 解析所有相对 href/src
 *  3. 按 .htaccess 规则映射 URL → 磁盘文件：
 *     - /xxx.html      → xxx.html（规则3会301到 /xxx/，规则6再映射回 xxx.html）
 *     - /xxx/          → xxx/index.html 或 xxx.html（规则6）
 *  4. 目标文件不存在即视为线上 404
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HTML_FILES = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'docs') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) HTML_FILES.push(p);
  }
})(ROOT);

function normalize(urlPath) {
  const parts = [];
  for (const seg of urlPath.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return '/' + parts.join('/') + (urlPath.endsWith('/') ? '/' : '');
}

function resolveToFile(urlPath) {
  urlPath = normalize(urlPath);
  const rel = urlPath.replace(/^\//, '');
  if (urlPath === '/') return 'index.html';
  if (urlPath.endsWith('/')) {
    const asDir = path.join(rel, 'index.html');
    if (fs.existsSync(path.join(ROOT, asDir))) return asDir;
    const asHtml = rel.slice(0, -1) + '.html';
    if (fs.existsSync(path.join(ROOT, asHtml))) return asHtml;
    return null;
  }
  if (fs.existsSync(path.join(ROOT, rel))) return rel;
  return null;
}

let failures = 0;
for (const file of HTML_FILES) {
  const html = fs.readFileSync(file, 'utf8');
  const baseMatch = html.match(/<base\s+href="([^"]*)"/);
  const base = baseMatch ? baseMatch[1] : null;
  const relFile = path.relative(ROOT, file);
  const attrRe = /(?:href|src)="([^"#]+)"/g;
  let m;
  while ((m = attrRe.exec(html))) {
    let link = m[1].split('?')[0];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(link)) continue;
    if (link === '') continue;
    let urlPath;
    if (link.startsWith('/')) {
      urlPath = link;
    } else if (base) {
      urlPath = normalize(base + link); // 线上：base 保留
    } else {
      // file://：base 被移除，相对文件所在目录
      urlPath = normalize('/' + path.join(path.dirname(relFile), link).replace(/\\/g, '/'));
    }
    const target = resolveToFile(urlPath);
    if (!target) {
      failures++;
      console.log(`404: ${relFile}  [base=${base || 'none'}]  ${m[1]}  ->  ${urlPath}`);
    }
  }
}
console.log(failures === 0
  ? `\nOK: ${HTML_FILES.length} 个 HTML 文件，所有相对链接均可解析到存在的文件`
  : `\nFAIL: 共 ${failures} 个链接会在线上 404`);
process.exit(failures === 0 ? 0 : 1);
