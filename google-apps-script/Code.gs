// Run setupSpry once in your own Google account, then deploy as a web app.
function setupSpry(){
  const p=PropertiesService.getScriptProperties();
  let id=p.getProperty('SHEET_ID');
  if(!id){
    const ss=SpreadsheetApp.create('SPRY — Private Client Inquiries');
    const s=ss.getSheets()[0]; s.setName('Inquiries');
    s.appendRow(['Received UTC','Inquiry ID','Name','Email','Company','Goals','Budget','Consent','Status']);
    s.setFrozenRows(1); s.getRange('A1:I1').setBackground('#14251e').setFontColor('#d9fca0').setFontWeight('bold');
    s.setColumnWidth(1,180);s.setColumnWidth(2,270);s.setColumnWidth(6,420);s.setColumnWidth(7,240);
    id=ss.getId();p.setProperty('SHEET_ID',id);
  }
  if(!p.getProperty('SPRY_FORM_SECRET'))p.setProperty('SPRY_FORM_SECRET',Utilities.getUuid()+Utilities.getUuid());
  console.log('Private spreadsheet: '+SpreadsheetApp.openById(id).getUrl());
  console.log('Copy SPRY_FORM_SECRET from Project Settings > Script Properties into Cloudflare as an encrypted secret.');
}
function json_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
function safe_(v){return /^[\s]*[=+\-@]/.test(v)?"'"+v:v;}
function doPost(e){
  let lock;
  try {
    const p=PropertiesService.getScriptProperties(); const secret=p.getProperty('SPRY_FORM_SECRET');
    if(!e||!e.postData||e.postData.contents.length>12000)return json_({ok:false});
    const d=JSON.parse(e.postData.contents);
    if(!secret||secret.length<32||d.secret!==secret)return json_({ok:false});
    if(!/^[a-f0-9-]{36}$/i.test(d.id)||d.consent!==true)return json_({ok:false});
    for(const [k,n,r] of [['name',120,true],['email',254,true],['company',160,false],['goals',3000,true],['budget',100,true]])if(typeof d[k]!=='string'||d[k].length>n||(r&&!d[k].trim()))return json_({ok:false});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)||!['$10K initial installation','$30K / 90-day private engagement','Exploring options'].includes(d.budget))return json_({ok:false});
    lock=LockService.getScriptLock();lock.waitLock(10000);
    const s=SpreadsheetApp.openById(p.getProperty('SHEET_ID')).getSheetByName('Inquiries');
    const last=s.getLastRow();
    if(last>1&&s.getRange(2,2,last-1,1).createTextFinder(d.id).matchEntireCell(true).findNext())return json_({ok:true,id:d.id});
    s.appendRow([new Date().toISOString(),d.id,...['name','email','company','goals','budget'].map(k=>safe_(d[k])), 'Yes','New']);
    SpreadsheetApp.flush();return json_({ok:true,id:d.id});
  }catch(err){return json_({ok:false});}finally{if(lock&&lock.hasLock())lock.releaseLock();}
}
