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
  
  // Find all tags with double style attributes
  // Match pattern: <tag ... style="X" ... style="Y" ...>
  // We keep the LAST style (most complete) and remove the first
  let result = '';
  let i = 0;
  let fixCount = 0;
  
  while (i < html.length) {
    // Find next tag
    let tagStart = html.indexOf('<', i);
    if (tagStart < 0 || tagStart > html.length - 2) {
      result += html.substring(i);
      break;
    }
    
    // Check if it's a real tag (not << or <! or </)
    let nextChar = html[tagStart + 1];
    if (nextChar === '<' || nextChar === '!' || nextChar === '/') {
      result += html.substring(i, tagStart + 1);
      i = tagStart + 1;
      continue;
    }
    
    // Find end of tag
    let tagEnd = html.indexOf('>', tagStart);
    if (tagEnd < 0) {
      result += html.substring(i);
      break;
    }
    
    let tag = html.substring(tagStart, tagEnd + 1);
    
    // Count style=" occurrences
    let styleCount = (tag.match(/style="/g) || []).length;
    
    if (styleCount > 1) {
      // Keep the last style, remove all others
      // Split by style=" and reconstruct
      let parts = tag.split('style="');
      let newTag = parts[0]; // Before first style
      
      for (let j = 1; j < parts.length; j++) {
        let styleEnd = parts[j].indexOf('"');
        if (styleEnd < 0) {
          newTag += 'style="' + parts[j];
        } else if (j === parts.length - 1) {
          // Last style - keep it
          newTag += 'style="' + parts[j];
        } else {
          // Not last style - skip it (remove the style attribute)
          newTag += parts[j].substring(styleEnd + 1);
        }
      }
      
      result += newTag;
      fixCount++;
    } else {
      result += tag;
    }
    
    i = tagEnd + 1;
  }
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, result, 'utf-8');
    fs.writeFileSync(path.join(ROOT_DIR, file), result, 'utf-8');
    console.log('FIXED: ' + file + ' - ' + fixCount + ' tags');
    totalFixes += fixCount;
  }
}

console.log('\nTotal: ' + totalFixes + ' double-style fixes across ' + totalFixes + ' files');
