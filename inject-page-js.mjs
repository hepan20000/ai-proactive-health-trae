import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

// Page-specific JS that must be injected BEFORE the unified JS
const PAGE_SPECIFIC_JS = {
  'resident-list.html': `
// Health tab switching
(function() {
  var tabs = document.querySelectorAll('[data-health-tab]');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var filter = this.getAttribute('data-health-tab');
      // Update tab styles
      tabs.forEach(function(t) {
        if (t.getAttribute('data-health-tab') === filter) {
          t.style.borderColor = 'var(--hmp-color-primary)';
          t.style.background = 'var(--hmp-color-primary)';
          t.style.color = 'var(--hmp-color-text-on-primary)';
          t.style.fontWeight = 'var(--hmp-font-weight-medium)';
        } else {
          t.style.borderColor = 'var(--hmp-color-border)';
          t.style.background = 'var(--hmp-bg-card)';
          t.style.color = 'var(--hmp-color-text-secondary)';
          t.style.fontWeight = 'normal';
        }
      });
      // Filter rows
      var rows = document.querySelectorAll('[data-health-level]');
      rows.forEach(function(row) {
        if (filter === 'all' || row.getAttribute('data-health-level') === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
})();`
};

function injectPageJS(file) {
  let filePath = path.join(PAGES_DIR, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  let pageJS = PAGE_SPECIFIC_JS[file];
  if (!pageJS) return false;
  
  // Check if already injected
  if (html.includes('// Health tab switching')) {
    console.log('SKIP (already has page JS): ' + file);
    return false;
  }
  
  // Inject before unified JS
  html = html.replace(/(<script>\n\/\/ === UNIFIED)/, '<script>' + pageJS + '\n</script>\n\n$1');
  
  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
  console.log('OK: injected page JS into ' + file);
  return true;
}

let count = 0;
for (let file of Object.keys(PAGE_SPECIFIC_JS)) {
  if (injectPageJS(file)) count++;
}
console.log('\nInjected page-specific JS into ' + count + ' pages');
