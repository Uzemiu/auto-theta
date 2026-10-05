'use strict';
// Read-only resource-prefix audit. No game input, no transport-goal search.
const fs=require('fs');
const {createModel,replay}=require('./stack-cargo-readonly.cjs');
const record=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-10.json','utf8').replace(/^\uFEFF/,''));
const gates=[{at:[3,4],buttons:[[6,1]]},{at:[4,5],buttons:[[6,1]]},{at:[4,1],buttons:[[1,1]]},{at:[1,4],buttons:[[1,1]]}];
const eventIndex=process.argv[4]!==undefined?Number(process.argv[4]):12;
const model=createModel(record,{observation_event:eventIndex,gates,allow_partial_death:false,max_stack:1});
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const stationary=s=>s.b.length===model.start.b.length&&s.m.every((m,i)=>{const j=model.start.m.indexOf(m);return j>=0&&same(s.b[i],model.start.b[j]);});
function scan(accept,limit=5000){
  const q=[[model.start,-1,'']],seen=new Set([model.serial(model.start)]);
  let end=-1,processed=0;
  for(let i=0;i<q.length&&i<limit;i++){
    processed++;const s=q[i][0];if(accept(s)){end=i;break;}
    for(let a=0;a<4;a++){
      const n=model.next(s,a);
      if(!n||n.p.length!==2||n.p.some(p=>p[4]>=0)||!stationary(n))continue;
      const k=model.serial(n);if(seen.has(k))continue;seen.add(k);q.push([n,i,'WASD'[a]]);
    }
  }
  let path=null;if(end>=0){path='';for(let i=end;q[i][1]>=0;i=q[i][1])path=q[i][2]+path;}
  return {path,processed,seen:seen.size,exhausted:end<0&&processed===q.length,truncated:end<0&&processed<q.length,...(path!==null?{replay:replay(model,path,{milestones:Array.from({length:path.length},(_,i)=>i+1)})}:{})};
}
const pick=process.argv[2]||'both';
if(pick==='replay'){
  let s=model.start;
  console.log('START',JSON.stringify(s));
  for(const a of process.argv[3]||''){
    s=model.next(s,'WASDX'.indexOf(a));
    if(!s){console.log('INVALID',a);break;}
    console.log(a,JSON.stringify({p:s.p,b:s.b,c:s.c,l:s.l}));
  }
  process.exit(0);
}
const accept=pick==='fork'?s=>s.p.some(p=>p[3]>0):pick==='key'?s=>s.p.some(p=>p[5]>0):s=>s.p.some(p=>p[3]>0)&&s.p.some(p=>p[5]>0);
const result=scan(accept);
if(result.replay){
  delete result.replay.state;
  result.replay.milestones=result.replay.milestones.map(x=>({step:x.step,players:x.players}));
}
console.log(JSON.stringify({mode:pick,...result},null,2));
