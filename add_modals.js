const fs = require('fs');
const filepath = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages\\service-package.html';

let content = fs.readFileSync(filepath, 'utf-8');

// 1. Add data-crm-open="edit-package" to all "编辑" buttons
content = content.replace(
  />编辑<\/button>/g,
  ' data-crm-open="edit-package">编辑</button>'
);

// 2. Add data-crm-open="confirm-offline" to all "下架" buttons
content = content.replace(
  />下架<\/button>/g,
  ' data-crm-open="confirm-offline">下架</button>'
);

// 3. Insert modal CSS + HTML + JS before the nav submenu script
const modal_css = '<style>.crm-modal-overlay{display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.45);align-items:center;justify-content:center}.crm-modal-overlay.is-visible{display:flex}.crm-modal{background:var(--hmp-bg-card);border-radius:var(--hmp-radius-lg);padding:24px;width:520px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.15)}.crm-modal-title{font-size:var(--hmp-font-size-h3);font-weight:var(--hmp-font-weight-semibold);color:var(--hmp-color-text-primary);margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}.crm-modal-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:var(--hmp-radius-md);cursor:pointer;color:var(--hmp-color-text-tertiary);border:none;background:transparent}.crm-modal-close:hover{background:var(--hmp-color-tertiary-light-default)}.crm-form-group{margin-bottom:16px}.crm-label{display:block;font-size:var(--hmp-font-size-caption);color:var(--hmp-color-text-secondary);margin-bottom:6px}.crm-label .required{color:var(--hmp-color-danger);margin-left:2px}.crm-input{width:100%;height:36px;padding:0 12px;border:1px solid var(--hmp-color-border);border-radius:var(--hmp-radius-md);background:var(--hmp-bg-card);color:var(--hmp-color-text-primary);font-size:var(--hmp-font-size-body);font-family:var(--hmp-font-family);box-sizing:border-box}.crm-input:focus{outline:none;border-color:var(--hmp-color-primary);box-shadow:0 0 0 2px var(--hmp-color-primary-light-default)}.crm-textarea{width:100%;min-height:80px;padding:10px 12px;border:1px solid var(--hmp-color-border);border-radius:var(--hmp-radius-md);background:var(--hmp-bg-card);color:var(--hmp-color-text-primary);font-size:var(--hmp-font-size-body);font-family:var(--hmp-font-family);resize:vertical;box-sizing:border-box}.crm-textarea:focus{outline:none;border-color:var(--hmp-color-primary);box-shadow:0 0 0 2px var(--hmp-color-primary-light-default)}.crm-select{width:100%;height:36px;padding:0 12px;border:1px solid var(--hmp-color-border);border-radius:var(--hmp-radius-md);background:var(--hmp-bg-card);color:var(--hmp-color-text-primary);font-size:var(--hmp-font-size-body);font-family:var(--hmp-font-family);box-sizing:border-box}.crm-select:focus{outline:none;border-color:var(--hmp-color-primary)}.crm-modal-footer{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--hmp-color-border)}.crm-btn{height:36px;padding:0 20px;border-radius:var(--hmp-radius-md);font-size:var(--hmp-font-size-body);cursor:pointer;font-family:var(--hmp-font-family);border:1px solid var(--hmp-color-border)}.crm-btn-primary{background:var(--hmp-color-primary);color:white;border-color:var(--hmp-color-primary)}.crm-btn-primary:hover{opacity:0.9}.crm-btn-default{background:var(--hmp-bg-card);color:var(--hmp-color-text-primary)}.crm-btn-default:hover{background:var(--hmp-bg-sunken)}.crm-btn-danger{background:var(--hmp-color-danger);color:white;border-color:var(--hmp-color-danger)}.crm-btn-danger:hover{opacity:0.9}.crm-warning-box{background:var(--hmp-color-danger-light-default);border:1px solid rgba(246,81,89,0.2);border-radius:var(--hmp-radius-md);padding:10px 14px;font-size:var(--hmp-font-size-caption);color:var(--hmp-color-danger);margin-bottom:16px;display:flex;align-items:center;gap:8px}</style>\n';

const modal_confirm = '\n<div class="crm-modal-overlay" data-crm-modal="confirm-offline">\n  <div class="crm-modal">\n    <div class="crm-modal-title"><span>下架确认</span><button class="crm-modal-close" data-crm-close="confirm-offline">&#10005;</button></div>\n    <div class="crm-warning-box">下架后该服务包将不再对居民可见，已购买的用户不受影响</div>\n    <div class="crm-form-group">\n      <label class="crm-label">服务包名称</label>\n      <input class="crm-input" value="脑血管健康管理包" readonly>\n    </div>\n    <div class="crm-modal-footer">\n      <button class="crm-btn crm-btn-default" data-crm-close="confirm-offline">取消</button>\n      <button class="crm-btn crm-btn-danger" data-crm-close="confirm-offline">确认下架</button>\n    </div>\n  </div>\n</div>\n';

const modal_edit = '\n<div class="crm-modal-overlay" data-crm-modal="edit-package">\n  <div class="crm-modal">\n    <div class="crm-modal-title"><span>编辑服务包</span><button class="crm-modal-close" data-crm-close="edit-package">&#10005;</button></div>\n    <div class="crm-form-group">\n      <label class="crm-label">服务包名称 <span class="required">*</span></label>\n      <input class="crm-input" value="脑血管健康管理包">\n    </div>\n    <div class="crm-form-group">\n      <label class="crm-label">服务类型</label>\n      <select class="crm-select">\n        <option>健康管理</option>\n        <option>康复治疗</option>\n        <option>慢病管理</option>\n        <option>体检服务</option>\n      </select>\n    </div>\n    <div class="crm-form-group">\n      <label class="crm-label">服务价格（元）</label>\n      <input class="crm-input" value="299">\n    </div>\n    <div class="crm-form-group">\n      <label class="crm-label">服务周期</label>\n      <select class="crm-select">\n        <option>1个月</option>\n        <option>3个月</option>\n        <option>6个月</option>\n        <option>12个月</option>\n      </select>\n    </div>\n    <div class="crm-form-group">\n      <label class="crm-label">服务描述</label>\n      <textarea class="crm-textarea" placeholder="请输入服务包描述">针对脑血管疾病患者的综合健康管理服务</textarea>\n    </div>\n    <div class="crm-modal-footer">\n      <button class="crm-btn crm-btn-default" data-crm-close="edit-package">取消</button>\n      <button class="crm-btn crm-btn-primary">保存</button>\n    </div>\n  </div>\n</div>\n';

const modal_js = '<script>(function(){function openModal(id){var m=document.querySelector(\'[data-crm-modal="\'+id+\'"]\');if(m)m.classList.add(\'is-visible\')}function closeModal(id){var m=document.querySelector(\'[data-crm-modal="\'+id+\'"]\');if(m)m.classList.remove(\'is-visible\')}document.addEventListener(\'click\',function(e){var t=e.target.closest(\'[data-crm-open]\');if(t){openModal(t.getAttribute(\'data-crm-open\'));return}var c=e.target.closest(\'[data-crm-close]\');if(c){closeModal(c.getAttribute(\'data-crm-close\'));return}var o=e.target.closest(\'[data-crm-modal]\');if(o&&o.classList.contains(\'is-visible\')&&o===e.target){o.classList.remove(\'is-visible\')}})})();</script>\n';

const marker = '  <script>\n  // Submenu toggle';
const insertBlock = modal_css + modal_confirm + modal_edit + modal_js;

if (content.includes(marker)) {
  content = content.replace(marker, insertBlock + marker);
  console.log('Inserted modal block before nav script');
} else {
  console.log('ERROR: Could not find nav script marker');
}

fs.writeFileSync(filepath, content, 'utf-8');

// Verify
const editCount = (content.match(/data-crm-open="edit-package"/g) || []).length;
const offlineCount = (content.match(/data-crm-open="confirm-offline"/g) || []).length;
const modalConfirmCount = (content.match(/data-crm-modal="confirm-offline"/g) || []).length;
const modalEditCount = (content.match(/data-crm-modal="edit-package"/g) || []).length;
console.log('edit-package buttons: ' + editCount);
console.log('confirm-offline buttons: ' + offlineCount);
console.log('confirm-offline modal: ' + modalConfirmCount);
console.log('edit-package modal: ' + modalEditCount);
console.log('Done: pages/service-package.html');
