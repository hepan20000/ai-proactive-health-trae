import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

function fixFile(file, replacements) {
  let filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) { console.log('SKIP: ' + file + ' not found'); return 0; }
  let html = fs.readFileSync(filePath, 'utf-8');
  let count = 0;
  
  for (let [find, replace] of replacements) {
    if (!html.includes(find)) {
      console.log('  NOT FOUND in ' + file + ': ' + find.substring(0, 60));
      continue;
    }
    // Check if replacement is already there
    if (html.includes(replace)) {
      console.log('  ALREADY DONE in ' + file + ': ' + find.substring(0, 40));
      continue;
    }
    let occurrences = html.split(find).length - 1;
    html = html.split(find).join(replace);
    count += occurrences;
    console.log('  FIXED x' + occurrences + ' in ' + file + ': ' + find.substring(0, 40));
  }
  
  if (count > 0) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
  }
  return count;
}

// Add data-crm-open to "新建方案" button in treatment-plan
// Find <button ...>  \n            新建方案\n          </button>
function addAttrToButtonBeforeText(file, searchText, attr) {
  let filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) return 0;
  let html = fs.readFileSync(filePath, 'utf-8');
  
  let idx = html.indexOf(searchText);
  if (idx < 0) { console.log('  TEXT NOT FOUND: ' + searchText); return 0; }
  
  // Walk back to find <button
  let btnStart = html.lastIndexOf('<button', idx);
  if (btnStart < 0) { console.log('  BUTTON NOT FOUND before: ' + searchText); return 0; }
  
  let btnEnd = html.indexOf('>', btnStart);
  let btnTag = html.substring(btnStart, btnEnd + 1);
  
  if (btnTag.includes('data-crm-open')) {
    console.log('  ALREADY HAS ATTR: ' + file + ' button for ' + searchText);
    return 0;
  }
  
  let newBtnTag = btnTag.replace('>', ' ' + attr + '>');
  html = html.substring(0, btnStart) + newBtnTag + html.substring(btnEnd + 1);
  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
  console.log('  FIXED BUTTON: ' + file + ' added ' + attr + ' to button before "' + searchText + '"');
  return 1;
}

let total = 0;

// treatment-plan: <a> tags for 预览 and 删除
total += fixFile('treatment-plan.html', [
  ['text-decoration:none; white-space:nowrap; cursor:pointer;">预览</a>',
   'data-crm-open="edit-plan" style="font-size:var(--hmp-font-size-caption); color:var(--hmp-color-primary); text-decoration:none; white-space:nowrap; cursor:pointer;">预览</a>'],
  ['text-decoration:none; white-space:nowrap; cursor:pointer;">删除</a>',
   'data-crm-open="confirm-delete-plan" style="font-size:var(--hmp-font-size-caption); color:var(--hmp-color-danger); text-decoration:none; white-space:nowrap; cursor:pointer;">删除</a>'],
]);

// product-management: 编辑 and 调整库存 buttons
total += fixFile('product-management.html', [
  ['border:none; background:none; color:var(--hmp-color-primary); font-size:var(--hmp-font-size-caption); cursor:pointer; padding:2px 4px; font-family:var(--hmp-font-family); white-space:nowrap;">编辑</button>',
   'data-crm-open="edit-product" style="border:none; background:none; color:var(--hmp-color-primary); font-size:var(--hmp-font-size-caption); cursor:pointer; padding:2px 4px; font-family:var(--hmp-font-family); white-space:nowrap;">编辑</button>'],
]);

// system-alert-rules: wrong attribute name data-modal-open -> data-crm-open
total += fixFile('system-alert-rules.html', [
  ['data-modal-open="edit-alert-rule"', 'data-crm-open="edit-alert-rule"'],
]);

// Add buttons for creating new items
total += addAttrToButtonBeforeText('treatment-plan.html', '新建方案', 'data-crm-open="edit-plan"');
total += addAttrToButtonBeforeText('service-package.html', '新建服务包', 'data-crm-open="edit-service"');
total += addAttrToButtonBeforeText('product-management.html', '新增商品', 'data-crm-open="edit-product"');
total += addAttrToButtonBeforeText('cms-banner.html', '添加Banner', 'data-crm-open="edit-banner"');
total += addAttrToButtonBeforeText('cms-recommend-doctors.html', '添加名医', 'data-crm-open="edit-doctor"');

console.log('\nTotal: ' + total + ' trigger fixes');
