import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

// For each file, find specific strings and add data-crm-open attributes
const FIXES = [
  // treatment-plan: 新建方案 button (SVG + text, need to add attr to <button>)
  { file: 'treatment-plan.html', find: '新建方案\n          </button>', replace: '新建方案\n          </button>', modal: 'edit-plan', type: 'button-close' },
  
  // treatment-plan: 编辑 buttons in table rows
  { file: 'treatment-plan.html', find: 'flex-shrink:0;">编辑</button>', replace: 'flex-shrink:0;" data-crm-open="edit-plan">编辑</button>', modal: 'edit-plan', type: 'simple' },
  { file: 'treatment-plan.html', find: 'flex-shrink:0;">预览</span>', replace: 'flex-shrink:0;" data-crm-open="edit-plan">预览</span>', modal: 'edit-plan', type: 'simple' },
  { file: 'treatment-plan.html', find: 'flex-shrink:0;">删除</span>', replace: 'flex-shrink:0;" data-crm-open="confirm-delete-plan">删除</span>', modal: 'confirm-delete-plan', type: 'simple' },
  
  // service-package
  { file: 'service-package.html', find: 'flex-shrink:0;">编辑</button>', replace: 'flex-shrink:0;" data-crm-open="edit-service">编辑</button>', modal: 'edit-service', type: 'simple' },
  { file: 'service-package.html', find: 'flex-shrink:0;">删除</span>', replace: 'flex-shrink:0;" data-crm-open="confirm-delete-service">删除</span>', modal: 'confirm-delete-service', type: 'simple' },
  
  // product-management
  { file: 'product-management.html', find: 'flex-shrink:0;">编辑</button>', replace: 'flex-shrink:0;" data-crm-open="edit-product">编辑</button>', modal: 'edit-product', type: 'simple' },
  
  // cms-banner
  { file: 'cms-banner.html', find: 'flex-shrink:0;">编辑</button>', replace: 'flex-shrink:0;" data-crm-open="edit-banner">编辑</button>', modal: 'edit-banner', type: 'simple' },
  { file: 'cms-banner.html', find: 'flex-shrink:0;">删除</span>', replace: 'flex-shrink:0;" data-crm-open="confirm-delete-banner">删除</span>', modal: 'confirm-delete-banner', type: 'simple' },
  
  // cms-recommend-doctors
  { file: 'cms-recommend-doctors.html', find: 'flex-shrink:0;">编辑</button>', replace: 'flex-shrink:0;" data-crm-open="edit-doctor">编辑</button>', modal: 'edit-doctor', type: 'simple' },
  { file: 'cms-recommend-doctors.html', find: 'flex-shrink:0;">删除</span>', replace: 'flex-shrink:0;" data-crm-open="confirm-delete-doctor">删除</span>', modal: 'confirm-delete-doctor', type: 'simple' },
  
  // system-alert-rules
  { file: 'system-alert-rules.html', find: 'flex-shrink:0;">编辑</button>', replace: 'flex-shrink:0;" data-crm-open="edit-alert-rule">编辑</button>', modal: 'edit-alert-rule', type: 'simple' },
];

let totalFixes = 0;

for (let fix of FIXES) {
  let filePath = path.join(PAGES_DIR, fix.file);
  if (!fs.existsSync(filePath)) continue;
  
  let html = fs.readFileSync(filePath, 'utf-8');
  
  if (!html.includes(fix.find)) {
    console.log('NOT FOUND: ' + fix.file + ' - ' + fix.find.substring(0, 50));
    continue;
  }
  
  // Check if already has the modal attribute nearby
  if (html.includes('data-crm-open="' + fix.modal + '"')) {
    console.log('ALREADY HAS: ' + fix.file + ' - ' + fix.modal);
    continue;
  }
  
  // Do the replacement
  let count = html.split(fix.find).length - 1;
  html = html.split(fix.find).join(fix.replace);
  
  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, fix.file), html, 'utf-8');
  console.log('OK: ' + fix.file + ' - ' + fix.modal + ' (' + count + ' replacements)');
  totalFixes += count;
}

// Handle "新建方案" button specially - find the <button before it and add attr
let tpHtml = fs.readFileSync(path.join(PAGES_DIR, 'treatment-plan.html'), 'utf-8');
if (!tpHtml.includes('data-crm-open="edit-plan"')) {
  // Find the button that contains "新建方案"
  let idx = tpHtml.indexOf('新建方案');
  if (idx > 0) {
    // Walk back to find <button
    let btnStart = tpHtml.lastIndexOf('<button', idx);
    if (btnStart > 0) {
      let btnEnd = tpHtml.indexOf('>', btnStart);
      let btnTag = tpHtml.substring(btnStart, btnEnd + 1);
      if (!btnTag.includes('data-crm-open')) {
        let newBtnTag = btnTag.replace('>', ' data-crm-open="edit-plan">');
        tpHtml = tpHtml.substring(0, btnStart) + newBtnTag + tpHtml.substring(btnEnd + 1);
        fs.writeFileSync(path.join(PAGES_DIR, 'treatment-plan.html'), tpHtml, 'utf-8');
        fs.writeFileSync(path.join(ROOT_DIR, 'treatment-plan.html'), tpHtml, 'utf-8');
        console.log('OK: treatment-plan.html - 新建方案 button');
        totalFixes++;
      }
    }
  }
}

// Handle "新建服务包" button
let spHtml = fs.readFileSync(path.join(PAGES_DIR, 'service-package.html'), 'utf-8');
if (!spHtml.includes('data-crm-open="edit-service"')) {
  let idx = spHtml.indexOf('新建服务包');
  if (idx > 0) {
    let btnStart = spHtml.lastIndexOf('<button', idx);
    if (btnStart > 0) {
      let btnEnd = spHtml.indexOf('>', btnStart);
      let btnTag = spHtml.substring(btnStart, btnEnd + 1);
      let newBtnTag = btnTag.replace('>', ' data-crm-open="edit-service">');
      spHtml = spHtml.substring(0, btnStart) + newBtnTag + spHtml.substring(btnEnd + 1);
      fs.writeFileSync(path.join(PAGES_DIR, 'service-package.html'), spHtml, 'utf-8');
      fs.writeFileSync(path.join(ROOT_DIR, 'service-package.html'), spHtml, 'utf-8');
      console.log('OK: service-package.html - 新建服务包 button');
      totalFixes++;
    }
  }
}

// Handle "新增商品" button
let pmHtml = fs.readFileSync(path.join(PAGES_DIR, 'product-management.html'), 'utf-8');
if (!pmHtml.includes('data-crm-open="edit-product"')) {
  let idx = pmHtml.indexOf('新增商品');
  if (idx > 0) {
    let btnStart = pmHtml.lastIndexOf('<button', idx);
    if (btnStart > 0) {
      let btnEnd = pmHtml.indexOf('>', btnStart);
      let btnTag = pmHtml.substring(btnStart, btnEnd + 1);
      let newBtnTag = btnTag.replace('>', ' data-crm-open="edit-product">');
      pmHtml = pmHtml.substring(0, btnStart) + newBtnTag + pmHtml.substring(btnEnd + 1);
      fs.writeFileSync(path.join(PAGES_DIR, 'product-management.html'), pmHtml, 'utf-8');
      fs.writeFileSync(path.join(ROOT_DIR, 'product-management.html'), pmHtml, 'utf-8');
      console.log('OK: product-management.html - 新增商品 button');
      totalFixes++;
    }
  }
}

// Handle "添加Banner" button
let cbHtml = fs.readFileSync(path.join(PAGES_DIR, 'cms-banner.html'), 'utf-8');
if (!cbHtml.includes('data-crm-open="edit-banner"')) {
  let idx = cbHtml.indexOf('添加Banner');
  if (idx > 0) {
    let btnStart = cbHtml.lastIndexOf('<button', idx);
    if (btnStart > 0) {
      let btnEnd = cbHtml.indexOf('>', btnStart);
      let btnTag = cbHtml.substring(btnStart, btnEnd + 1);
      let newBtnTag = btnTag.replace('>', ' data-crm-open="edit-banner">');
      cbHtml = cbHtml.substring(0, btnStart) + newBtnTag + cbHtml.substring(btnEnd + 1);
      fs.writeFileSync(path.join(PAGES_DIR, 'cms-banner.html'), cbHtml, 'utf-8');
      fs.writeFileSync(path.join(ROOT_DIR, 'cms-banner.html'), cbHtml, 'utf-8');
      console.log('OK: cms-banner.html - 添加Banner button');
      totalFixes++;
    }
  }
}

// Handle "添加名医" button
let crdHtml = fs.readFileSync(path.join(PAGES_DIR, 'cms-recommend-doctors.html'), 'utf-8');
if (!crdHtml.includes('data-crm-open="edit-doctor"')) {
  let idx = crdHtml.indexOf('添加名医');
  if (idx > 0) {
    let btnStart = crdHtml.lastIndexOf('<button', idx);
    if (btnStart > 0) {
      let btnEnd = crdHtml.indexOf('>', btnStart);
      let btnTag = crdHtml.substring(btnStart, btnEnd + 1);
      let newBtnTag = btnTag.replace('>', ' data-crm-open="edit-doctor">');
      crdHtml = crdHtml.substring(0, btnStart) + newBtnTag + crdHtml.substring(btnEnd + 1);
      fs.writeFileSync(path.join(PAGES_DIR, 'cms-recommend-doctors.html'), crdHtml, 'utf-8');
      fs.writeFileSync(path.join(ROOT_DIR, 'cms-recommend-doctors.html'), crdHtml, 'utf-8');
      console.log('OK: cms-recommend-doctors.html - 添加名医 button');
      totalFixes++;
    }
  }
}

console.log('\nTotal trigger fixes: ' + totalFixes);
