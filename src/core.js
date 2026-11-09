(()=>{'use strict';
const fields=JSON.parse(document.getElementById('care-fields').textContent),byId=Object.fromEntries(fields.map(f=>[f.id,f]));
const groups=['吃饭与喝水','排便情况','口腔与胃肠','手脚、体力与睡眠','测量与重要情况'];
const clone=x=>JSON.parse(JSON.stringify(x));
const present=v=>v!==undefined&&v!==null&&v!==''&&(!Array.isArray(v)||v.length>0);
function matches(w,a){if(!w)return true;if(w.unless&&matches(w.unless,a))return false;if(w.or)return w.or.some(q=>matches(q,a));const v=a[w.key];if(!present(v))return false;if(w.in)return w.in.includes(v);if(w.not)return !w.not.includes(v);if(w.any)return Array.isArray(v)&&v.some(x=>w.any.includes(x));if(w.positive)return (typeof v==='number'&&v>0)||v==='30 次以上';if(w.symptom){const f=byId[w.key];return Array.isArray(v)&&v.some(x=>x!==f.none&&x!=='不清楚'&&!(f.exclusive||[]).includes(x))}return false;}
function clean(a){const out=clone(a);let changed;do{changed=false;for(const f of fields)if((!present(out[f.id])||!matches(f.when,out))&&f.id in out){delete out[f.id];changed=true}}while(changed);return out;}
function validate(a){if(!a||typeof a!=='object'||Array.isArray(a))throw Error('点选记录格式不正确');for(const [k,v]of Object.entries(a)){const f=byId[k];if(!f)throw Error('无法识别的点选字段：'+k);if(!matches(f.when,a))throw Error(f.label+'与前面的选项不一致');if(f.type==='measure'){if(typeof v!=='number'||!Number.isFinite(v)||v<f.min||v>f.max||(f.step===1&&!Number.isInteger(v)))throw Error('请核对'+f.label+'的数值');}
else if(f.type==='text'){if(typeof v!=='string'||!v.trim()||v.length>f.maxLength)throw Error(f.label+'请填写不超过'+f.maxLength+'字的文字');}
else if(f.type==='count'){if(f.choiceCounts?!f.choiceCounts.includes(v):!(Number.isInteger(v)&&v>=f.min&&v<=30)&&!['30 次以上','不清楚'].includes(v))throw Error('请核对'+f.label);}
else if(f.type==='multi'){if(!Array.isArray(v)||!v.length||v.length>f.options.length||new Set(v).size!==v.length||v.some(x=>!f.options.includes(x)))throw Error('请核对'+f.label+'的选项');const exclusive=[f.none,'不清楚',...(f.exclusive||[])].filter(Boolean);if(v.length>1&&v.some(x=>exclusive.includes(x)))throw Error(f.label+'中“没有／不清楚”不能与具体情况同时选择');}
else if(!f.options.includes(v))throw Error('请核对'+f.label+'的选项');}
if(typeof a.looseCount==='number'&&typeof a.bowelCount==='number'&&a.looseCount>a.bowelCount)throw Error('稀便次数不能超过当天排便总次数');
if(a.systolic!==undefined&&a.diastolic!==undefined&&a.systolic<=a.diastolic)throw Error('高压应高于低压，请核对血压数值');return a;}
const display=v=>Array.isArray(v)?v.join('；'):String(v);
function entries(a){return fields.filter(f=>present(a[f.id])).map(f=>[f.label+(f.unit?'（'+f.unit+'）':''),display(a[f.id])]);}
function defaulted(a,keys=[]){if(!Array.isArray(keys)||new Set(keys).size!==keys.length||keys.some(k=>byId[k]?.type!=='count'||byId[k]?.noDefault||!(a[k]===0||(k==='bowelCount'&&a[k]===1))))throw Error('默认次数标记无效');return keys;}
function answerDisplay(r,k){return display(r.careV2.answers[k])+((r.careV2.defaultedCounts||[]).includes(k)?'（默认'+r.careV2.answers[k]+'，未调整）':'');}
function recordEntries(r){return fields.filter(f=>present(r.careV2.answers[f.id])).map(f=>[f.label+(f.unit?'（'+f.unit+'）':''),answerDisplay(r,f.id)]);}
function filledAtText(value){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(value));const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day+' '+p.hour+':'+p.minute+':'+p.second;}
function parseFilledAt(value){if(!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)||!validDate(value.slice(0,10))||Number(value.slice(11,13))>23||Number(value.slice(14,16))>59||Number(value.slice(17,19))>59)throw Error('请核对填写时间');return new Date(value.replace(' ','T')+'+08:00').toISOString();}
function text(r){return ['每日生活反馈','表单版本：2','日期：'+r.date,...(r.filledAt?['填写时间（北京时间）：'+filledAtText(r.filledAt)]:[]),...(r.source&&r.source!=='来源待确认'?['信息来源：'+r.source]:[]),...entries(r.careV2.answers).map(([k,v])=>k+'：'+v.replace(/\r\n?/g,'\n').replace(/\n/g,'\n  ')),...[0,1].flatMap(n=>{const keys=(r.careV2.defaultedCounts||[]).filter(k=>r.careV2.answers[k]===n);return keys.length?['默认'+n+'次（未调整）：'+keys.map(k=>byId[k].label).join('；')]:[]}),'未填写项目：未了解（不代表正常）','反馈编号：'+r.id].join('\n');}
function validDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
function record(a,meta){meta={...meta,source:meta.source||'来源待确认'};validate(a);if(meta.filledAt&&(typeof meta.filledAt!=='string'||!Number.isFinite(Date.parse(meta.filledAt))))throw Error('请核对填写时间');const defaults=defaulted(a,meta.defaultedCounts||[]);if(!validDate(meta.date))throw Error('请核对日期');if(!['患者自述','家属转述','家属直接观察','医生或正式报告','来源待确认'].includes(meta.source))throw Error('请选择信息来源');if(typeof meta.id!=='string'||!meta.id||meta.id.length>200)throw Error('反馈编号无效');const r={...meta,updatedAt:meta.updatedAt||new Date().toISOString(),dateBasis:'填写人选定的反馈日期',careV2:{version:2,answers:clone(a),...(defaults.length?{defaultedCounts:clone(defaults)}:{})},revisions:meta.revisions||[]};
delete r.defaultedCounts;for(const k of ['intake','appetite','energy','sleep','mood','bowel','stool'])r[k]='未了解';for(const k of ['weight','temperature','sleepHours','bowelCount','systolic','diastolic'])r[k]=null;
for(const k of ['weight','temperature','systolic','diastolic'])if(typeof a[k]==='number')r[k]=a[k];if(typeof a.bowelCount==='number'&&!defaults.includes('bowelCount')){r.bowelCount=a.bowelCount;r.bowel=a.bowelCount===0?'今天没有排便':'有排便';}
r.timing='';r.weightNote='';r.symptoms='新版点选反馈，具体选项保存在结构化记录中。';r.actions='';r.raw=text(r);return r;}
function parse(raw){
if(raw.length>50000||!raw.startsWith('每日生活反馈'))throw Error('请粘贴完整的每日生活反馈');
const meta={},a={},defaultClaims={},seen=new Set(),labels=Object.fromEntries(fields.flatMap(f=>[f.label,...(f.aliases||[])].map(label=>[label+(f.unit?'（'+f.unit+'）':''),f])));
let version=false,textField=null;
for(const line of raw.split(/\r?\n/)){
 if(textField&&line.startsWith('  ')){a[textField]+='\n'+line.slice(2);continue;}
 textField=null;
 const p=line.indexOf('：');if(p<0)continue;
 const k=line.slice(0,p),original=line.slice(p+1),v=original.trim();
 if(seen.has(k))throw Error('反馈中有重复字段：'+k);seen.add(k);
 if(k==='表单版本'){if(v!=='2')throw Error('不支持的表单版本');version=true;}
 else if(k==='日期')meta.date=v;
 else if(k==='填写时间（北京时间）')meta.filledAt=parseFilledAt(v);
 else if(k==='信息来源')meta.source=v;
 else if(k==='反馈编号')meta.id=v;
 else if(/^默认[01]次（未调整）$/.test(k)){const n=Number(k[2]);for(const label of v.split('；')){const f=labels[label];if(!f||f.type!=='count'||f.id in defaultClaims)throw Error('默认次数项目无效');defaultClaims[f.id]=n;}}
 else if(k==='未填写项目'){}
 else{const f=labels[k];if(!f)throw Error('无法识别的反馈字段：'+k);if(f.id in a)throw Error('反馈中有重复项目：'+f.label);
  if(f.type==='text'){a[f.id]=original;textField=f.id;}
  else a[f.id]=f.type==='multi'?v.split('；'):f.type==='measure'?Number(v):f.type==='count'&&/^\d+$/.test(v)?Number(v):v;
 }
}
if(!version)throw Error('缺少表单版本');for(const[k,v]of Object.entries(defaultClaims))if(a[k]!==v)throw Error('默认次数与回答不一致');meta.defaultedCounts=fields.filter(f=>f.id in defaultClaims).map(f=>f.id);const r=record(a,meta);r.raw=raw;return r;
}
function alerts(a){const out=[],push=(id,body,urgent=true)=>out.push({id,body,urgent}),has=(k,v)=>(a[k]||[]).includes(v);
const red=(a.urgent||[]).filter(v=>!['没有以下情况','不清楚'].includes(v));if(red.length)push('urgent','你选了“'+red.join('、')+'”。请立即联系治疗团队或就近急诊；胸痛、呼吸困难、突发肢体无力或说话困难等严重情况应立即求助急救。');
if(a.temperature>=38)push('fever','实测体温达到 38℃ 或以上：请立即联系治疗团队或就近急诊，不要等发送简报。');
if(['几乎喝不下／喝后留不住','喝不下'].includes(a.fluids)||a.keepFluids==='喝后又吐'||a.mouthImpact==='几乎不能吃喝'||a.nausea==='几乎不能吃喝')push('fluids','已经影响液体摄入或不能保留液体，请尽快联系治疗团队；若持续呕吐、明显头晕或很久没有尿，应立即就医。');
if(a.abdomenImpact==='剧烈或持续加重')push('abdomen','剧烈或持续加重的腹痛需要立即联系治疗团队或就近急诊，不要等待简报。');
if(a.gas==='没有排气'&&(a.abdomen||[]).some(v=>['腹胀','腹痛'].includes(v)))push('gas','没有排气且伴腹胀或腹痛，请立即联系治疗团队，尤其伴呕吐时；不要自行按普通便秘处理。');
if((typeof a.looseCount==='number'&&a.looseCount>=4)||a.looseCount==='30 次以上')push('diarrhea','记录到一天 4 次或以上稀便／水样便，请立即联系治疗团队；持续腹泻或伴头晕时应及时就医。');
if(['鲜红血','暗红血','黑而黏、像柏油'].some(v=>has('bowelFeatures',v))||has('urineChanges','血尿'))push('bleed','便血、黑而黏的大便或血尿需要及时告知治疗团队；出血明显、增多或伴头晕乏力时立即就医。');
if(has('mouth','吞咽疼痛或困难'))push('swallow','吞咽疼痛或困难应及时联系治疗团队；若突然出现咽喉紧、呼吸困难，立即求助急诊，不能仅按遇冷反应处理。');
if(['明显减少','很久没有尿'].includes(a.urine))push('urine','排尿明显减少或很久没有尿，请尽快联系治疗团队；同时喝不下、呕吐或明显头晕时需及时就医。',false);
if(has('mouth','新出现白斑或白膜')||has('mouth','嘴里疼或有溃疡')||has('mouth','牙龈出血'))push('mouth','新的口腔白斑、溃疡或牙龈出血请告知治疗团队，尤其影响吃喝时。',false);
if((a.nerveImpact||[]).some(x=>['拿筷子、扣扣子等受影响','走路受影响'].includes(x))||(a.skinImpact||[]).some(x=>['影响用手','影响走路'].includes(x)))push('function','手脚症状已影响日常动作，请告知治疗团队评估；不要自行调整治疗药物。',false);
return out;}
window.CareV2={fields,byId,groups,display,present,active:(f,a)=>matches(f.when,a),clean,validate,record,parse,text,entries,recordEntries,answerDisplay,defaulted,alerts,validDate};
})();
