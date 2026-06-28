import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html') && !['dashboard.html','login.html'].includes(f));

let issues = [];
let goodPages = [];

for (let file of files) {
  let html = fs.readFileSync(path.join(PAGES_DIR, file), 'utf-8');
  
  // Find all modal IDs
  let modalIds = new Set();
  let match;
  let modalRegex = /data-crm-modal="([^"]+)"/g;
  while ((match = modalRegex.exec(html)) !== null) modalIds.add(match[1]);
  
  if (modalIds.size === 0) continue; // Skip pages without modals
  
  // Find all open triggers
  let openTriggers = new Set();
  let openRegex = /data-crm-open="([^"]+)"/g;
  while ((match = openRegex.exec(html)) !== null) openTriggers.add(match[1]);
  
  // Check for modals without triggers
  let orphanModals = [];
  for (let id of modalIds) {
    if (!openTriggers.has(id)) orphanModals.push(id);
  }
  
  // Check for triggers without modals
  let orphanTriggers = [];
  for (let id of openTriggers) {
    if (!modalIds.has(id)) orphanTriggers.push(id);
  }
  
  if (orphanModals.length > 0 || orphanTriggers.length > 0) {
    let issue = file + ':';
    if (orphanModals.length > 0) issue += ' ORPHAN_MODALS=[' + orphanModals.join(',') + ']';
    if (orphanTriggers.length > 0) issue += ' ORPHAN_TRIGGERS=[' + orphanTriggers.join(',') + ']';
    issues.push(issue);
  } else {
    goodPages.push(file + ': ' + modalIds.size + ' modals, ' + openTriggers.size + ' triggers');
  }
}

console.log('=== PAGES WITH ORPHAN MODALS/TRIGGERS ===');
issues.forEach(i => console.log(i));

console.log('\n=== PAGES WITH ALL MODALS/TRIGGERS PAIRED ===');
goodPages.forEach(g => console.log(g));

if (issues.length === 0) console.log('\nAll pages are correctly wired!');
