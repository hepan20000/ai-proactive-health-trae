import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

// Simple string replacements to add data-crm-open to specific elements
const REPLACEMENTS = {
  'treatment-plan.html': [
    // "新建方案" button - add data-crm-open="edit-plan"
    ['>新建方案</button>', ' data-crm-open="edit-plan">新建方案</button>'],
  ],
  'service-package.html': [
    ['>新建服务包</button>', ' data-crm-open="edit-service">新建服务包</button>'],
  ],
  'product-management.html': [
    ['>新增商品</button>', ' data-crm-open="edit-product">新增商品</button>'],
  ],
  'cms-banner.html': [
    ['>添加Banner</button>', ' data-crm-open="edit-banner">添加Banner</button>'],
  ],
  'cms-recommend-doctors.html': [
    ['>添加名医</button>', ' data-crm-open="edit-doctor">添加名医</button>'],
  ],
};

// For table action columns, we need to find patterns like ">编辑<" or ">删除<"
// These are within <span> or <button> tags in the action column
const TABLE_ACTION_REPLACEMENTS = {
  'treatment-plan.html': [
    // Find "编辑" buttons in table rows
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">编辑</button>', 
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-plan">编辑</button>' },
    { find: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;">预览</',
      replace: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-plan">预览</' },
    { find: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;">删除</',
      replace: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;" data-crm-open="confirm-delete-plan">删除</' },
  ],
  'service-package.html': [
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">编辑</button>',
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-service">编辑</button>' },
    { find: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;">下架</',
      replace: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;" data-crm-open="confirm-offline">下架</' },
    { find: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;">删除</',
      replace: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;" data-crm-open="confirm-delete-service">删除</' },
  ],
  'product-management.html': [
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">编辑</button>',
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-product">编辑</button>' },
    { find: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;">调整库存</',
      replace: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;" data-crm-open="adjust-stock">调整库存</' },
  ],
  'cms-banner.html': [
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">编辑</button>',
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-banner">编辑</button>' },
    { find: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;">删除</',
      replace: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;" data-crm-open="confirm-delete-banner">删除</' },
  ],
  'cms-recommend-doctors.html': [
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">编辑</button>',
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-doctor">编辑</button>' },
    { find: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;">删除</',
      replace: 'color:var(--hmp-color-danger); cursor:pointer; white-space:nowrap;" data-crm-open="confirm-delete-doctor">删除</' },
  ],
  'sub-account.html': [
    { find: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;">重置密码</',
      replace: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;" data-crm-open="reset-password">重置密码</' },
  ],
  'plan-template.html': [
    { find: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;">预览</',
      replace: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;" data-crm-open="plan-preview">预览</' },
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">下发</',
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="send-plan">下发</' },
  ],
  'plan-tracking.html': [
    { find: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;">随访提醒</',
      replace: 'color:var(--hmp-color-text-secondary); cursor:pointer; white-space:nowrap;" data-crm-open="urge-view">随访提醒</' },
  ],
  'system-alert-rules.html': [
    { find: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;">编辑</button>',
      replace: 'color:var(--hmp-color-primary); cursor:pointer; white-space:nowrap;" data-crm-open="edit-alert-rule">编辑</button>' },
  ],
};

let totalFixes = 0;

// Apply button replacements
for (let [file, reps] of Object.entries(REPLACEMENTS)) {
  let filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf-8');
  let fileFixes = 0;
  
  for (let [find, replace] of reps) {
    if (html.includes(find) && !html.includes(replace.trimStart())) {
      let count = html.split(find).length - 1;
      html = html.split(find).join(replace);
      fileFixes += count;
    }
  }
  
  if (fileFixes > 0) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
    console.log('OK (buttons): ' + file + ' - ' + fileFixes + ' fixes');
    totalFixes += fileFixes;
  }
}

// Apply table action replacements
for (let [file, reps] of Object.entries(TABLE_ACTION_REPLACEMENTS)) {
  let filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf-8');
  let fileFixes = 0;
  
  for (let rep of reps) {
    if (html.includes(rep.find) && !html.includes(rep.replace.trimStart())) {
      let count = html.split(rep.find).length - 1;
      html = html.split(rep.find).join(rep.replace);
      fileFixes += count;
    }
  }
  
  if (fileFixes > 0) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
    console.log('OK (table actions): ' + file + ' - ' + fileFixes + ' fixes');
    totalFixes += fileFixes;
  }
}

console.log('\nTotal trigger fixes: ' + totalFixes);
