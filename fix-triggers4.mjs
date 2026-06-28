import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

function fixFile(file, replacements) {
  let filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) return 0;
  let html = fs.readFileSync(filePath, 'utf-8');
  let count = 0;
  
  for (let [find, replace] of replacements) {
    if (!html.includes(find)) {
      console.log('  NOT FOUND: ' + find.substring(0, 60));
      continue;
    }
    let occurrences = html.split(find).length - 1;
    html = html.split(find).join(replace);
    count += occurrences;
    console.log('  FIXED x' + occurrences + ': ' + find.substring(0, 50));
  }
  
  if (count > 0) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
  }
  return count;
}

let total = 0;

// 1. plan-template: data-open-modal -> data-crm-open
total += fixFile('plan-template.html', [
  ['data-open-modal="plan-preview"', 'data-crm-open="plan-preview"'],
]);

// Check if plan-template has "下发" triggers
let ptHtml = fs.readFileSync(path.join(PAGES_DIR, 'plan-template.html'), 'utf-8');
if (!ptHtml.includes('data-crm-open="send-plan"')) {
  console.log('  Checking plan-template for 下发...');
  let idx = ptHtml.indexOf('下发');
  if (idx > 0) {
    // Find the tag before 下发
    let tagStart = ptHtml.lastIndexOf('<', idx);
    let tagEnd = ptHtml.indexOf('>', tagStart);
    let tag = ptHtml.substring(tagStart, tagEnd + 1);
    console.log('  Tag before 下发: ' + tag);
    if (!tag.includes('data-crm-open')) {
      let newTag = tag.replace('<', '<data-crm-open="send-plan" ');
      ptHtml = ptHtml.substring(0, tagStart) + newTag + ptHtml.substring(tagEnd + 1);
      fs.writeFileSync(path.join(PAGES_DIR, 'plan-template.html'), ptHtml, 'utf-8');
      fs.writeFileSync(path.join(ROOT_DIR, 'plan-template.html'), ptHtml, 'utf-8');
      console.log('  FIXED: added data-crm-open="send-plan" to 下发 tag');
      total++;
    }
  }
}

// 2. product-management: fix double style attribute 
// "style=\"data-crm-open=\"edit-product\" style=\"..." -> "data-crm-open=\"edit-product\" style=\"..."
total += fixFile('product-management.html', [
  ['style="data-crm-open="edit-product" style="', 'data-crm-open="edit-product" style="'],
]);

// 3. alert-workbench: add data-crm-open to "处理" buttons
total += fixFile('alert-workbench.html', [
  ['cursor:pointer; white-space:nowrap;">处理</button>',
   'data-crm-open="alert-handle" style="flex-shrink:0; height:28px; padding:0 12px; border:1px solid var(--hmp-color-primary); border-radius:var(--hmp-radius-md); background:var(--hmp-color-primary); color:var(--hmp-color-text-on-primary); font-size:var(--hmp-font-size-caption); font-weight:var(--hmp-font-weight-medium); cursor:pointer; white-space:nowrap;">处理</button>'],
]);

// 4. device-management: add data-crm-open to "查看详情" links
total += fixFile('device-management.html', [
  ['color:var(--hmp-color-primary); text-decoration:none; white-space:nowrap;">查看详情</a>',
   'data-crm-open="device-detail" style="font-size:var(--hmp-font-size-body); color:var(--hmp-color-primary); text-decoration:none; white-space:nowrap;">查看详情</a>'],
]);

// 5. service-package: add data-crm-open to "下架" buttons
total += fixFile('service-package.html', [
  ['flex-shrink:0;">下架</button>', 'data-crm-open="confirm-offline" style="display:inline-flex; align-items:center; justify-content:center; height:32px; padding:0 12px; border:1px solid var(--hmp-color-border); border-radius:var(--hmp-radius-md); background:var(--hmp-bg-card); color:var(--hmp-color-text-secondary); font-size:var(--hmp-font-size-caption); cursor:pointer; white-space:nowrap; flex-shrink:0;">下架</button>'],
]);

// 6. sub-account: add data-crm-open to "重置密码" spans
total += fixFile('sub-account.html', [
  ['color:var(--hmp-color-primary); cursor:pointer; margin-right:var(--hmp-spacing-md);">重置密码</span>',
   'data-crm-open="reset-password" style="color:var(--hmp-color-primary); cursor:pointer; margin-right:var(--hmp-spacing-md);">重置密码</span>'],
]);

// 7. template-phrases: check for "编辑" triggers
let tpHtml = fs.readFileSync(path.join(PAGES_DIR, 'template-phrases.html'), 'utf-8');
if (!tpHtml.includes('data-crm-open="edit-template"')) {
  console.log('  Checking template-phrases for 编辑...');
  // Search for edit-like elements
  let idx = tpHtml.indexOf('编辑');
  if (idx > 0) {
    let tagStart = tpHtml.lastIndexOf('<', idx);
    let tagEnd = tpHtml.indexOf('>', tagStart);
    let tag = tpHtml.substring(tagStart, tagEnd + 1);
    console.log('  Tag before 编辑: ' + tag);
    if (!tag.includes('data-crm-open')) {
      // Add to the first occurrence only (the one in table)
      let newTag = tag.replace('<', '<data-crm-open="edit-template" ');
      tpHtml = tpHtml.substring(0, tagStart) + newTag + tpHtml.substring(tagEnd + 1);
      fs.writeFileSync(path.join(PAGES_DIR, 'template-phrases.html'), tpHtml, 'utf-8');
      fs.writeFileSync(path.join(ROOT_DIR, 'template-phrases.html'), tpHtml, 'utf-8');
      console.log('  FIXED: added data-crm-open="edit-template"');
      total++;
    }
  }
}

console.log('\nTotal additional fixes: ' + total);
