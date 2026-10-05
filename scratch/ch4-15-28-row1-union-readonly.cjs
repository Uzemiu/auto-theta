'use strict';
// New explicit domain for actual28. Same observed ordinary core as
// ch4-15-revisit-tail-readonly.cjs; only remove row1 pruning and audit all6 masks.
// No game input/save/KB/hints/hidden implementation. No X/new fusion/stack/conflict.
const fs=require('fs'),vm=require('vm');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-15.json','utf8').replace(/^\uFEFF/,''));
const observed=raw.events[28].observation.level;
if(observed.instructions!=='AAAWXSAWWDDSSWSSSSSWASAWWXWX'||observed.timelines.length!==2)throw Error('actual28 anchor mismatch');
const src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
let model=src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))
 .replace('p[0]+v[d][0],p[1]+v[d][1]', '(p[0]+v[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+v[d][1]+t.size[1]+1)%(t.size[1]+1)')
 .replace('let n=tick(s,plans,intents);', "tickPhase='main';let n=tick(s,plans,intents);")
 .replace('let nxt=tick(n,micro,pushes);', "tickPhase='micro';let nxt=tick(n,micro,pushes);")
 .replace('if(dirs.has(i)&&dirs.get(i)!==x.d)return null;',
  "if(dirs.has(i)&&dirs.get(i)!==x.d){rejectHook({kind:'pushConflict',phase:tickPhase,box:i,first:dirs.get(i),second:x.d,plans,before:s.b});return null;}")
 .replace('if(b.length!==new Set(b.map(b=>key(b.r))).size)return null;',
  "if(b.length!==new Set(b.map(b=>key(b.r))).size){const groups=[];for(let i=0;i<b.length;i++){const ids=b.map((z,j)=>same(z.r,b[i].r)?j:-1).filter(j=>j>=0);if(ids.length>1&&ids[0]===i)groups.push({at:b[i].r,ids,origins:ids.map(j=>b[j].origin)});}rejectHook({kind:groups.every(g=>new Set(g.origins).size===1)?'sameOriginOverlap':'independentStack',phase:tickPhase,groups,plans,before:s.b,after:b});return null;}");
const ctx={require,process:{argv:[]},console,module:{exports:{}},tickPhase:'main',rejectHook:()=>{}};
vm.runInNewContext(model+'\nmodule.exports={step};',ctx);
const {step}=ctx.module.exports,at=r=>r.join(','),copy=s=>JSON.parse(JSON.stringify(s));
const goals=['3,6','2,7','1,8','5,6','6,7','7,8'],cap=10000,depthLimit=50;
function seed(t){
 const boxes=t.entities.filter(e=>e.class==='Box'&&e.active&&!e.properties.maskedoff).sort((a,b)=>a.id-b.id);
 const b=boxes.map(e=>({r:e.pos,color:e.details.Color,id:e.id,origin:e.details.Color===3?49:e.id}));
 const players=t.entities.filter(e=>e.type==='PLAYER'&&e.active&&!e.properties.maskedoff);
 const p=players.map(e=>({r:e.pos,f:['W','A','S','D'][e.properties.face],fork:e.properties.split,
  c:e.properties.contained?boxes.findIndex(b=>b.id===e.properties.container):-1,ghost:e.properties.ghost,id:e.id}));
 if(b.length!==4||p.length!==4||p.filter(x=>x.c>=0).length!==3||p.some(x=>x.ghost||x.fork))throw Error('seed resource mismatch');
 return {b,p,rem:[]};
}
const hash=s=>s.b.map(b=>at(b.r)).join('|')+'|'+s.p.map(p=>at(p.r)+','+p.c+','+p.ghost).sort().join(';');
const mask=s=>goals.reduce((m,g,i)=>s.p.some(p=>!p.ghost&&at(p.r)===g)?m|(1<<i):m,0);
function audit(t){
 const start=seed(t),q=[{s:start,parent:-1,a:'',d:0}],seen=new Set([hash(start)]),profiles=new Map();
 const rejects={sameOriginOverlap:0,independentStack:0,pushConflict:0},firstReject={},hits=[];
 let head=0,cutoff=0,maxDepth=0,row1States=0,firstRow1=null,minBoxY=6,minCargo=3;
 ctx.rejectHook=x=>hits.push(copy(x));
 function path(i,a=''){for(;q[i].parent>=0;i=q[i].parent)a=q[i].a+a;return a;}
 function inspect(s,i){
  const m=mask(s);if(!profiles.has(m))profiles.set(m,{mask:m,path:path(i),goals:goals.filter((g,j)=>m&(1<<j)),state:copy(s)});
  minBoxY=Math.min(minBoxY,...s.b.map(b=>b.r[1]));minCargo=Math.min(minCargo,s.p.filter(p=>p.c>=0).length);
  if(s.b.some(b=>b.r[1]===1)){row1States++;if(!firstRow1)firstRow1={path:path(i),state:copy(s)};}
 }
 inspect(start,0);
 while(head<q.length&&head<cap){
  const i=head++,o=q[i],s=o.s;maxDepth=Math.max(maxDepth,o.d);
  if(o.d>=depthLimit){cutoff++;continue;}
  if(s.p.every(p=>p.c>=0))continue; // No outside remains; ordinary cannot move any body.
  for(const a of 'WASD'){
   hits.length=0;const n=step(s,a);
   for(const r of hits){rejects[r.kind]++;if(!firstReject[r.kind])firstReject[r.kind]={path:path(i,a),before:copy(s),rejection:r};}
   if(!n||n.p.some(p=>p.ghost)||n.p.filter(p=>p.c>=0).length<1)continue;
   // Deliberately no b.y<=1 filter. Wall row0 and normal pushing still apply.
   const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,parent:i,a,d:o.d+1});inspect(n,q.length-1);
  }
 }
 return {axis:t.axis,sourceEvent:28,sourceTime:t.time,start,cap,depthLimit,expanded:head,seen:seen.size,
  unexpanded:q.length-head,depthCutoffStates:cutoff,maxDepth,row1States,firstRow1,minBoxY,minCargo,
  wholeConstrainedGraphExhausted:head===q.length&&cutoff===0,rejects,firstReject,profiles:[...profiles.values()]};
}
const results=observed.timelines.map(audit),pairs=[];
for(const a of results[0].profiles)for(const b of results[1].profiles)
 if((a.mask|b.mask)===63)pairs.push({mask0:a.mask,mask1:b.mask,path0:a.path,path1:b.path,state0:a.state,state1:b.state});
console.log(JSON.stringify({model:'actual28 two branches; ordinary all6 masks union; row1 boxes allowed but no invented retrieval; no X/new same-origin fusion/independent stack/conflict/Ghost',
 goals,results,pairsCoverAllSix:pairs}));
