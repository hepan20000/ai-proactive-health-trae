import fs from 'fs';
import path from 'path';

const PAGES_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign\\pages';
const ROOT_DIR = 'd:\\trae本地文件\\ai管理平台-semidesign';

const MODAL_CSS = '<style>.crm-modal-overlay{display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.45);align-items:center;justify-content:center}.crm-modal-overlay.is-visible{display:flex}.crm-modal{background:var(--hmp-bg-card);border-radius:var(--hmp-radius-large);padding:24px;width:520px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.15)}.crm-modal-title{font-size:var(--hmp-font-size-large);font-weight:var(--hmp-font-weight-semibold);color:var(--hmp-color-text-primary);margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}.crm-modal-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:var(--hmp-radius-md);cursor:pointer;color:var(--hmp-color-text-tertiary);border:none;background:transparent}.crm-modal-close:hover{background:var(--hmp-color-tertiary-light-default)}.crm-form-group{margin-bottom:16px}.crm-label{display:block;font-size:var(--hmp-font-size-small);color:var(--hmp-color-text-secondary);margin-bottom:6px}.crm-label .required{color:var(--hmp-color-danger);margin-left:2px}.crm-input{width:100%;height:36px;padding:0 12px;border:1px solid var(--hmp-color-border);border-radius:var(--hmp-radius-md);background:var(--hmp-bg-card);color:var(--hmp-color-text-primary);font-size:var(--hmp-font-size-body);font-family:var(--hmp-font-family);box-sizing:border-box}.crm-input:focus{outline:none;border-color:var(--hmp-color-primary);box-shadow:0 0 0 2px var(--hmp-color-primary-light-default)}.crm-textarea{width:100%;min-height:80px;padding:10px 12px;border:1px solid var(--hmp-color-border);border-radius:var(--hmp-radius-md);background:var(--hmp-bg-card);color:var(--hmp-color-text-primary);font-size:var(--hmp-font-size-body);font-family:var(--hmp-font-family);resize:vertical;box-sizing:border-box}.crm-textarea:focus{outline:none;border-color:var(--hmp-color-primary);box-shadow:0 0 0 2px var(--hmp-color-primary-light-default)}.crm-select{width:100%;height:36px;padding:0 12px;border:1px solid var(--hmp-color-border);border-radius:var(--hmp-radius-md);background:var(--hmp-bg-card);color:var(--hmp-color-text-primary);font-size:var(--hmp-font-size-body);font-family:var(--hmp-font-family);box-sizing:border-box}.crm-select:focus{outline:none;border-color:var(--hmp-color-primary)}.crm-modal-footer{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--hmp-color-border)}.crm-btn{height:36px;padding:0 20px;border-radius:var(--hmp-radius-md);font-size:var(--hmp-font-size-body);cursor:pointer;font-family:var(--hmp-font-family);border:1px solid var(--hmp-color-border)}.crm-btn-primary{background:var(--hmp-color-primary);color:white;border-color:var(--hmp-color-primary)}.crm-btn-primary:hover{opacity:0.9}.crm-btn-default{background:var(--hmp-bg-card);color:var(--hmp-color-text-primary)}.crm-btn-default:hover{background:var(--hmp-bg-sunken)}.crm-btn-danger{background:var(--hmp-color-danger);color:white;border-color:var(--hmp-color-danger)}.crm-btn-danger:hover{opacity:0.9}</style>';

const MODAL_JS = '<script>(function(){function openModal(id){var m=document.querySelector(\'[data-crm-modal="\'+id+\'"]\');if(m)m.classList.add(\'is-visible\')}function closeModal(id){var m=document.querySelector(\'[data-crm-modal="\'+id+\'"]\');if(m)m.classList.remove(\'is-visible\')}document.addEventListener(\'click\',function(e){var t=e.target.closest(\'[data-crm-open]\');if(t){openModal(t.getAttribute(\'data-crm-open\'));return}var c=e.target.closest(\'[data-crm-close]\');if(c){closeModal(c.getAttribute(\'data-crm-close\'));return}var o=e.target.closest(\'[data-crm-modal]\');if(o&&o.classList.contains(\'is-visible\')&&o===e.target){o.classList.remove(\'is-visible\')}})})();</script>';

const MODALS = {
  'alert-workbench.html': [
    { id: 'alert-handle', title: '处理预警', fields: '<div class="crm-form-group"><label class="crm-label">预警类型</label><input class="crm-input" value="血压异常预警" readonly /></div><div class="crm-form-group"><label class="crm-label">患者姓名</label><input class="crm-input" value="张三" readonly /></div><div class="crm-form-group"><label class="crm-label">预警值</label><input class="crm-input" value="收缩压 165mmHg" readonly /></div><div class="crm-form-group"><label class="crm-label">处理措施</label><select class="crm-select"><option>电话通知患者</option><option>调整用药方案</option><option>建议就医</option><option>暂不处理</option></select></div><div class="crm-form-group"><label class="crm-label">处理备注</label><textarea class="crm-textarea" placeholder="请输入处理备注..."></textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">确认处理</button><button class="crm-btn crm-btn-default" data-crm-close="alert-handle">取消</button>' }
  ],
  'device-management.html': [
    { id: 'device-detail', title: '设备详情', fields: '<div class="crm-form-group"><label class="crm-label">设备编号</label><input class="crm-input" value="DEV-2026-001" readonly /></div><div class="crm-form-group"><label class="crm-label">设备名称</label><input class="crm-input" value="智能血压计 YX-BP300" readonly /></div><div class="crm-form-group"><label class="crm-label">绑定居民</label><input class="crm-input" value="张三（138****5678）" readonly /></div><div class="crm-form-group"><label class="crm-label">设备状态</label><input class="crm-input" value="在线" readonly /></div><div class="crm-form-group"><label class="crm-label">最后数据上报</label><input class="crm-input" value="2026-06-27 08:30" readonly /></div><div class="crm-form-group"><label class="crm-label">电量</label><input class="crm-input" value="85%" readonly /></div>', buttons: '<button class="crm-btn crm-btn-default" data-crm-close="device-detail">关闭</button>' }
  ],
  'sub-account.html': [
    { id: 'create-account', title: '创建子账号', fields: '<div class="crm-form-group"><label class="crm-label">账号名称 <span class="required">*</span></label><input class="crm-input" placeholder="请输入账号名称" /></div><div class="crm-form-group"><label class="crm-label">登录手机号 <span class="required">*</span></label><input class="crm-input" placeholder="请输入手机号" /></div><div class="crm-form-group"><label class="crm-label">角色权限 <span class="required">*</span></label><select class="crm-select"><option>运营管理员</option><option>数据管理员</option><option>客服人员</option></select></div><div class="crm-form-group"><label class="crm-label">备注</label><textarea class="crm-textarea" placeholder="请输入备注..."></textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">确认创建</button><button class="crm-btn crm-btn-default" data-crm-close="create-account">取消</button>' },
    { id: 'reset-password', title: '重置密码', fields: '<div class="crm-form-group"><label class="crm-label">账号名称</label><input class="crm-input" value="admin_user01" readonly /></div><div class="crm-form-group"><label class="crm-label">新密码 <span class="required">*</span></label><input class="crm-input" type="password" placeholder="请输入新密码（至少8位）" /></div><div class="crm-form-group"><label class="crm-label">确认密码 <span class="required">*</span></label><input class="crm-input" type="password" placeholder="请再次输入新密码" /></div>', buttons: '<button class="crm-btn crm-btn-primary">确认重置</button><button class="crm-btn crm-btn-default" data-crm-close="reset-password">取消</button>' }
  ],
  'operation-log.html': [
    { id: 'export-log', title: '导出操作日志', fields: '<div class="crm-form-group"><label class="crm-label">时间范围</label><div style="display:flex;gap:8px"><input class="crm-input" type="date" value="2026-06-01" style="flex:1"/><span style="line-height:36px;color:var(--hmp-color-text-secondary)">至</span><input class="crm-input" type="date" value="2026-06-27" style="flex:1"/></div></div><div class="crm-form-group"><label class="crm-label">操作类型</label><select class="crm-select"><option>全部类型</option><option>登录</option><option>数据修改</option><option>数据删除</option><option>权限变更</option></select></div><div class="crm-form-group"><label class="crm-label">操作人</label><input class="crm-input" placeholder="留空则导出全部" /></div><div class="crm-form-group"><label class="crm-label">导出格式</label><select class="crm-select"><option>Excel (.xlsx)</option><option>CSV (.csv)</option></select></div>', buttons: '<button class="crm-btn crm-btn-primary">确认导出</button><button class="crm-btn crm-btn-default" data-crm-close="export-log">取消</button>' }
  ],
  'plan-template.html': [
    { id: 'plan-preview', title: '方案预览', fields: '<div class="crm-form-group"><label class="crm-label">方案名称</label><input class="crm-input" value="高血压管理方案A" readonly /></div><div class="crm-form-group"><label class="crm-label">适用人群</label><input class="crm-input" value="原发性高血压 I-II 级患者" readonly /></div><div class="crm-form-group"><label class="crm-label">方案周期</label><input class="crm-input" value="12周" readonly /></div><div class="crm-form-group"><label class="crm-label">监测要求</label><textarea class="crm-textarea" readonly>每日测量血压2次（晨起、睡前），每周至少5天。</textarea></div><div class="crm-form-group"><label class="crm-label">干预措施</label><textarea class="crm-textarea" readonly>1. 低盐饮食 2. 规律运动 3. 戒烟限酒 4. 情绪管理</textarea></div>', buttons: '<button class="crm-btn crm-btn-default" data-crm-close="plan-preview">关闭</button>' },
    { id: 'send-plan', title: '下发方案', fields: '<div class="crm-form-group"><label class="crm-label">方案名称</label><input class="crm-input" value="高血压管理方案A" readonly /></div><div class="crm-form-group"><label class="crm-label">目标患者 <span class="required">*</span></label><select class="crm-select"><option>张三（138****5678）</option><option>李四（139****1234）</option><option>王五（136****9012）</option></select></div><div class="crm-form-group"><label class="crm-label">开始日期 <span class="required">*</span></label><input class="crm-input" type="date" value="2026-06-28" /></div><div class="crm-form-group"><label class="crm-label">医生备注</label><textarea class="crm-textarea" placeholder="请输入备注..."></textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">确认下发</button><button class="crm-btn crm-btn-default" data-crm-close="send-plan">取消</button>' }
  ],
  'plan-tracking.html': [
    { id: 'send-new-plan', title: '发送新方案', fields: '<div class="crm-form-group"><label class="crm-label">患者姓名</label><input class="crm-input" value="张三" readonly /></div><div class="crm-form-group"><label class="crm-label">选择方案模板 <span class="required">*</span></label><select class="crm-select"><option>高血压管理方案A</option><option>糖尿病管理方案B</option><option>综合慢病管理方案C</option></select></div><div class="crm-form-group"><label class="crm-label">开始日期 <span class="required">*</span></label><input class="crm-input" type="date" value="2026-06-28" /></div><div class="crm-form-group"><label class="crm-label">方案说明</label><textarea class="crm-textarea" placeholder="请输入方案说明..."></textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">确认发送</button><button class="crm-btn crm-btn-default" data-crm-close="send-new-plan">取消</button>' },
    { id: 'urge-view', title: '发送随访提醒', fields: '<div class="crm-form-group"><label class="crm-label">患者姓名</label><input class="crm-input" value="张三" readonly /></div><div class="crm-form-group"><label class="crm-label">提醒方式</label><select class="crm-select"><option>短信提醒</option><option>APP推送</option><option>短信+APP推送</option></select></div><div class="crm-form-group"><label class="crm-label">提醒内容</label><textarea class="crm-textarea">尊敬的患者，您的健康方案已到达随访节点，请及时完成血压测量并上传数据。</textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">发送提醒</button><button class="crm-btn crm-btn-default" data-crm-close="urge-view">取消</button>' }
  ],
  'system-alert-rules.html': [
    { id: 'edit-alert-rule', title: '编辑预警规则', fields: '<div class="crm-form-group"><label class="crm-label">规则名称 <span class="required">*</span></label><input class="crm-input" value="血压异常预警" /></div><div class="crm-form-group"><label class="crm-label">监测指标</label><select class="crm-select"><option>收缩压</option><option>舒张压</option><option>心率</option><option>血糖</option></select></div><div class="crm-form-group"><label class="crm-label">预警阈值（上限）</label><input class="crm-input" value="140" placeholder="mmHg" /></div><div class="crm-form-group"><label class="crm-label">预警阈值（下限）</label><input class="crm-input" value="90" placeholder="mmHg" /></div><div class="crm-form-group"><label class="crm-label">连续触发次数</label><input class="crm-input" value="3" placeholder="连续多少次超标触发预警" /></div><div class="crm-form-group"><label class="crm-label">通知对象</label><select class="crm-select"><option>主治医生</option><option>主治医生+机构管理员</option><option>患者本人</option></select></div>', buttons: '<button class="crm-btn crm-btn-primary">保存规则</button><button class="crm-btn crm-btn-default" data-crm-close="edit-alert-rule">取消</button>' }
  ],
  'system-notifications.html': [
    { id: 'confirm-clear-cache', title: '确认清除缓存', fields: '<div style="padding:16px 0;text-align:center;color:var(--hmp-color-text-secondary);font-size:var(--hmp-font-size-body);"><div style="width:48px;height:48px;border-radius:50%;background:var(--hmp-color-warning-light-default);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hmp-color-warning)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>确定要清除系统缓存吗？此操作将清除所有临时数据和缓存文件。</div>', buttons: '<button class="crm-btn crm-btn-danger">确认清除</button><button class="crm-btn crm-btn-default" data-crm-close="confirm-clear-cache">取消</button>' }
  ],
  'template-phrases.html': [
    { id: 'edit-template', title: '编辑常用语模板', fields: '<div class="crm-form-group"><label class="crm-label">模板名称 <span class="required">*</span></label><input class="crm-input" value="血压随访" /></div><div class="crm-form-group"><label class="crm-label">适用场景</label><select class="crm-select"><option>血压随访</option><option>血糖随访</option><option>用药提醒</option><option>复诊提醒</option><option>自定义</option></select></div><div class="crm-form-group"><label class="crm-label">模板内容 <span class="required">*</span></label><textarea class="crm-textarea" style="min-height:120px">您好！请您按照方案要求，今日完成血压测量并记录数据。如有不适请及时联系。</textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">保存模板</button><button class="crm-btn crm-btn-default" data-crm-close="edit-template">取消</button>' }
  ],
  'doctor-homepage.html': [
    { id: 'edit-article', title: '编辑科普文章', fields: '<div class="crm-form-group"><label class="crm-label">文章标题 <span class="required">*</span></label><input class="crm-input" value="高血压患者的日常管理" /></div><div class="crm-form-group"><label class="crm-label">文章分类</label><select class="crm-select"><option>高血压</option><option>糖尿病</option><option>心血管疾病</option><option>健康生活方式</option></select></div><div class="crm-form-group"><label class="crm-label">文章摘要</label><textarea class="crm-textarea" placeholder="请输入文章摘要">了解如何在日常生活中有效控制血压，包括饮食、运动和情绪管理。</textarea></div><div class="crm-form-group"><label class="crm-label">文章内容 <span class="required">*</span></label><textarea class="crm-textarea" style="min-height:150px" placeholder="请输入文章正文...">高血压是一种常见的慢性疾病，需要长期管理。</textarea></div>', buttons: '<button class="crm-btn crm-btn-primary">保存文章</button><button class="crm-btn crm-btn-default" data-crm-close="edit-article">取消</button>' }
  ]
};

function injectModals(file) {
  let filePath = path.join(PAGES_DIR, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  
  // Inject modal CSS if missing
  if (!html.includes('.crm-modal-overlay{')) {
    html = html.replace(/(<script>\n\/\/ === UNIFIED)/, MODAL_CSS + '\n$1');
  }
  
  let modalsDef = MODALS[file];
  if (!modalsDef) { console.log('SKIP (no modal def): ' + file); return false; }
  
  // Find existing modal IDs
  let existingIds = new Set();
  let match;
  let regex = /data-crm-modal="([^"]+)"/g;
  while ((match = regex.exec(html)) !== null) existingIds.add(match[1]);
  
  let newModalsHtml = '';
  for (let modal of modalsDef) {
    if (existingIds.has(modal.id)) continue;
    newModalsHtml += '\n<div class="crm-modal-overlay" data-crm-modal="' + modal.id + '">\n  <div class="crm-modal">\n    <div class="crm-modal-title"><span>' + modal.title + '</span><button class="crm-modal-close" data-crm-close="' + modal.id + '">&#10005;</button></div>\n    ' + modal.fields + '\n    <div class="crm-modal-footer">' + modal.buttons + '</div>\n  </div>\n</div>';
  }
  
  if (!newModalsHtml) { console.log('SKIP (all modals exist): ' + file); return false; }
  
  // Inject before unified JS
  html = html.replace(/(<script>\n\/\/ === UNIFIED)/, '<!-- CRM Modals -->' + newModalsHtml + '\n' + MODAL_JS + '\n$1');
  
  // Add trigger buttons/spans
  let triggerMap = {
    'alert-workbench.html': [{id:'alert-handle',text:'处理',isButton:false}],
    'device-management.html': [{id:'device-detail',text:'查看详情',isButton:false}],
    'sub-account.html': [{id:'create-account',text:'创建子账号',isButton:true},{id:'reset-password',text:'重置密码',isButton:false}],
    'operation-log.html': [{id:'export-log',text:'导出日志',isButton:true}],
    'plan-template.html': [{id:'plan-preview',text:'预览',isButton:false},{id:'send-plan',text:'下发',isButton:false}],
    'plan-tracking.html': [{id:'send-new-plan',text:'发送方案',isButton:true},{id:'urge-view',text:'随访提醒',isButton:false}],
    'system-alert-rules.html': [{id:'edit-alert-rule',text:'编辑',isButton:false}],
    'system-notifications.html': [{id:'confirm-clear-cache',text:'清除缓存',isButton:true}],
    'template-phrases.html': [{id:'edit-template',text:'编辑',isButton:false}],
    'doctor-homepage.html': [{id:'edit-article',text:'编辑文章',isButton:true}]
  };
  
  let triggers = triggerMap[file] || [];
  for (let trigger of triggers) {
    if (html.includes('data-crm-open="' + trigger.id + '"')) continue;
    
    if (trigger.isButton) {
      let btnHtml = '<button data-crm-open="' + trigger.id + '" style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--hmp-color-primary);border-radius:var(--hmp-radius-md);background:var(--hmp-color-primary);color:white;font-size:var(--hmp-font-size-body);cursor:pointer;white-space:nowrap;">' + trigger.text + '</button>';
      // Insert before action bar
      let actionMatch = html.match(/<div style="display:flex;\s*align-items:center;\s*gap:var\(--hmp-spacing-md\);\s*margin-bottom:/);
      if (actionMatch) {
        html = html.replace(/(<div style="display:flex;\s*align-items:center;\s*gap:var\(--hmp-spacing-md\);\s*margin-bottom:)/, btnHtml + '\n          $1');
      } else {
        html = html.replace(/(<div style="[^"]*background:var\(--hmp-bg-card\)[^"]*"[^>]*>)/, btnHtml + '\n        $1');
      }
    } else {
      let spanHtml = '<span data-crm-open="' + trigger.id + '" style="font-size:var(--hmp-font-size-body);color:var(--hmp-color-primary);cursor:pointer;white-space:nowrap;">' + trigger.text + '</span>';
      let actionColPattern = /(<span style="font-size:var\(--hmp-font-size-body\);color:var\(--hmp-color-text-tertiary\);cursor:pointer[^"]*">详情<\/span>)/;
      if (actionColPattern.test(html)) {
        html = html.replace(actionColPattern, spanHtml + '\n                      $1');
      } else {
        let altPattern = /(<div style="display:flex;align-items:center;gap:var\(--hmp-spacing-md\)">)/;
        if (altPattern.test(html)) {
          html = html.replace(altPattern, '$1\n                        ' + spanHtml);
        }
      }
    }
  }
  
  fs.writeFileSync(filePath, html, 'utf-8');
  fs.writeFileSync(path.join(ROOT_DIR, file), html, 'utf-8');
  
  let totalModals = (html.match(/data-crm-modal/g) || []).length;
  let totalOpens = (html.match(/data-crm-open/g) || []).length;
  console.log('OK: ' + file + ' - modals: ' + totalModals + ', triggers: ' + totalOpens);
  return true;
}

let count = 0;
for (let file of Object.keys(MODALS)) {
  if (injectModals(file)) count++;
}
console.log('\nInjected modals into ' + count + ' pages');
