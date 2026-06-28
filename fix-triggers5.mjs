import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

// Strategy: For each file that needs triggers, read the file, find buttons/links by text content,
// and add data-crm-open to the FIRST style attribute on that tag.

function addDataAttrToElements(file, textContent, attrValue) {
  let filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) { console.log('NOT FOUND: ' + file); return 0; }
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already has it
  if (html.includes('data-crm-open="' + attrValue + '"')) {
    console.log('ALREADY: ' + file + ' has data-crm-open="' + attrValue + '"');
    return 0;
  }
  
  let count = 0;
  let searchFrom = 0;
  
  while (true) {
    let textIdx = html.indexOf('>' + textContent + '<', searchFrom);
    if (textIdx < 0) {
      // Also try with newline after >
      textIdx = html.indexOf('>\n                ' + textContent + '</', searchFrom);
    }
    if (textIdx < 0) break;
    
    // Find the opening tag before this text
    let tagStart = html.lastIndexOf('<', textIdx);
    let tagEnd = html.indexOf('>', tagStart);
    let tag = html.substring(tagStart, tagEnd + 1);
    
    // Don't modify if it already has data-crm-open
    if (tag.includes('data-crm-open')) {
      searchFrom = tagEnd + 1;
      continue;
    }
    
    // Add data-crm-open as first attribute after <button or <a or <span
    let newTag = tag.replace(/^<(button|a|span)\s/, '<$1 data-crm-open="' + attrValue + '" ');
    if (newTag === tag) {
      // Try without space after tag name  
      newTag = tag.replace(/^<(button|a|span)/, '<$1 data-crm-open="' + attrValue + '"');
    }
    
    if (newTag !== tag) {
      html = html.substring(0, tagStart) + newTag + html.substring(tagEnd + 1);
      count++;
      searchFrom = tagStart + newTag.length;
    } else {
      searchFrom = tagEnd + 1;
    }
  }
  
  if (count > 0) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
    console.log('OK: ' + file + ' - added data-crm-open="' + attrValue + '" x' + count);
  } else {
    console.log('NO MATCH: ' + file + ' - text "' + textContent + '" not found in tags');
  }
  
  return count;
}

let total = 0;

// Fix all remaining orphan modals
total += addDataAttrToElements('alert-workbench.html', '处理', 'alert-handle');
total += addDataAttrToElements('device-management.html', '查看详情', 'device-detail');
total += addDataAttrToElements('plan-template.html', '预览', 'plan-preview');
total += addDataAttrToElements('plan-template.html', '下发', 'send-plan');
total += addDataAttrToElements('product-management.html', '调整库存', 'adjust-stock');
total += addDataAttrToElements('service-package.html', '下架', 'confirm-offline');
total += addDataAttrToElements('sub-account.html', '重置密码', 'reset-password');
total += addDataAttrToElements('template-phrases.html', '编辑', 'edit-template');

console.log('\nTotal fixes: ' + total);
