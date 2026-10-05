'use strict';
// Finite ordinary tail model only. No game APIs, files changed, conflict search,
// ghosts, cargo X, or full-playthrough search. Hypothetical starts are labeled.
const fs=require('fs');
const {createModel,replay}=require('./stack-cargo-readonly.cjs');
const record=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-11.json','utf8').replace(/^\uFEFF/,''));
const index=record.events.findIndex(e=>e.observation?.level?.instructions==='WWWDXSAAASXWWDDSSDDAX');
if(index<0)throw Error('Actual21 checkpoint not found');
const model=createModel(record,{observation_event:index,allow_partial_death:true,max_stack:1});
const clone=s=>JSON.parse(JSON.stringify(s));
function synthetic(boxes,free){
  const s=clone(model.start);
  s.b=boxes.map(p=>p.slice());
  s.p=s.p.filter(p=>p[4]>=0).map(p=>{p[0]=s.b[p[4]][0];p[1]=s.b[p[4]][1];return p;});
  s.p.push(...free.map(p=>[...p,0,0,-1,0]));
  return s;
}
function audit(name,boxes,free,path){
  const start=synthetic(boxes,free);
  const r=replay(model,path,{start,milestones:Array.from({length:path.length},(_,i)=>i+1)});
  delete r.state;
  const short=s=>({players:s.players,boxes:s.groups.map(g=>({at:g.at,ids:g.ids}))});
  console.log(JSON.stringify({name,hypothetical:true,start:short(model.describe(start)),path,valid:r.valid,steps:r.steps,final:r.final&&short(r.final),milestones:r.milestones.map(x=>({step:x.step,...short(x)}))}));
}
audit('left staging',[[2,5],[3,5]],[[2,4],[3,4],[4,5]],'WWA');
audit('right staging',[[5,5],[6,5]],[[5,4],[6,4],[4,5]],'WWD');
audit('left central staging',[[3,5],[4,5]],[[3,4],[4,4],[5,5]],'AWWA');
audit('right central staging',[[4,5],[5,5]],[[4,4],[5,4],[3,5]],'DWWD');
audit('helper A-conflict candidate',[[3,2],[5,3]],[[6,3],[7,3],[6,2]],'ASAWADSDSAAWWWAWWA');
audit('helper W-conflict candidate',[[3,2],[6,4]],[[6,3],[7,3],[6,2]],'ASAAWAAWWAWDDSSSWWWWWD');
const pre='AAADDWDDSAAASDSDSD';
const preResult=replay(model,pre,{milestones:[pre.length]});
delete preResult.state;
console.log(JSON.stringify({name:'actual21 -> nominated preconflict',path:pre,...preResult}));
