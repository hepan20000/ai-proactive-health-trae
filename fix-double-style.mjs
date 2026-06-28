import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html') && !['dashboard.html','login.html'].includes(f));

let totalFixes = 0;

for (let file of files) {
  let filePath = path.join(PAGES_DIR, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  let original = html;
  
  // Fix double style attributes on any tag
  // Pattern: style="..." data-crm-open="..." style="..."
  // The second style should be removed
  let regex = /(<(?:button|a|span)\s[^>]*?)style="([^"]*)"(\s+data-crm-open="[^"]*")\s+style="[^"]*"([^>]*>)/g;
  html = html.replace(regex, '$1style="$2"$3$4');
  
  // Also fix: data-crm-open="..." style="..." style="..."
  // And: <button style="data-crm-open="..." style="..."  (product-management bug)
  html = html.replace(/(<(?:button|a|span)\s)style="(data-crm-open="[^"]*")\s+style="([^"]*)"([^>]*>)/g, '$1$2 style="$3"$4');
  
  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
    console.log('FIXED: ' + file);
    totalFixes++;
  }
}

console.log('Fixed ' + totalFixes + ' files');
