import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const fieldText=readFileSync(new URL('../src/fields.json',import.meta.url),'utf8');
const ctx=vm.createContext({window:{},document:{getElementById:()=>({textContent:fieldText})}});
vm.runInContext(readFileSync(new URL('../src/core.js',import.meta.url),'utf8'),ctx);
const C=ctx.window.CareV2,plain=x=>JSON.parse(JSON.stringify(x));
const meta={id:'synthetic-example',date:'2026-01-01'};
test('排尿补充项可留空；取消主选项清除旧答案',()=>{
 const a={urine:'明显减少'};
 assert.deepEqual(plain(C.clean(a)),a);
 assert.equal(C.byId.urineTimes.noDefault,true);
 assert.deepEqual(plain(C.clean({urine:'和平时差不多',urineTimes:2,urinePerVoid:'少一些',lastUrine:'不到 2 小时'})),{urine:'和平时差不多'});
});
test('明确零次隐藏每次尿量，但保留距上次时间',()=>{
 const a={urine:'很久没有尿',urineTimes:0,urinePerVoid:'只有几滴',lastUrine:'6 小时及以上'};
 assert.throws(()=>C.validate(a));
 const clean=plain(C.clean(a));delete a.urinePerVoid;
 assert.deepEqual(clean,a);C.validate(clean);
 assert.throws(()=>C.record(a,{...meta,defaultedCounts:['urineTimes']}));
});
test('精确次数、上限分组与未知分别保存',()=>{
 for(const n of [0,1,2,3,4,5,'6 次及以上','不清楚']){
  const a={urine:'明显减少',urineTimes:n};
  assert.equal(C.parse(C.text(C.record(a,meta))).careV2.answers.urineTimes,n);
 }
 for(const n of [-1,6,2.5,'0'])assert.throws(()=>C.validate({urine:'明显减少',urineTimes:n}));
});
test('新简报含北京时间；旧简报和未确认默认次数仍兼容',()=>{
 const a={urine:'明显减少',urineTimes:2,urinePerVoid:'少一些',lastUrine:'2 至不足 4 小时',bowelCount:1,vomitCount:0};
 const r=C.record(a,{...meta,filledAt:'2026-01-01T04:05:06.000Z',defaultedCounts:['bowelCount','vomitCount']});
 const text=C.text(r),parsed=C.parse(text);
 assert.match(text,/填写时间（北京时间）：2026-01-01 12:05:06/);
 assert.equal(parsed.filledAt,r.filledAt);assert.deepEqual(plain(parsed.careV2),plain(r.careV2));
 assert.equal(C.parse(text.replace(/^填写时间.*\n/m,'')).filledAt,undefined);
 for(const bad of ['2026-02-30 12:00:00','2026-01-01 24:00:00'])assert.throws(()=>C.parse(text.replace('2026-01-01 12:05:06',bad)));
});
