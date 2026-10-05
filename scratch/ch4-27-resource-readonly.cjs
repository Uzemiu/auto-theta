// CLOSED actual281: eight numeric axes cover all Goals, six undo/zero retry.
// Historical fixed ordinary/X audits only; no search or game input.
// Reuses the visible-observation model in ch4-22. Not an independent engine.
const fs=require('fs'),vm=require('vm');
let code=fs.readFileSync('scratch/ch4-22-readonly.cjs','utf8').split('const prefix15=')[0];
code=code.replace('artifacts/slot1-playthrough/4-22.json','artifacts/slot1-playthrough/4-27.json');
code=code.replace(/^const initial=.*$/m,`const initial={
 b:t.entities.filter(e=>e.type==='BOX'&&e.active).map(e=>{const p=t.entities.find(p=>p.type==='PLAYER'&&p.active&&p.properties.contained&&p.properties.container===e.id);return{r:e.pos,orig:e.id,color:e.details.Color,c:p?{f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key,ghost:p.properties.ghost}:null};}),
 p:t.entities.filter(e=>e.type==='PLAYER'&&e.active&&!e.properties.contained).map(e=>({r:e.pos,f:['W','A','S','D'][e.properties.face],fork:e.properties.split,key:e.properties.key})),keys:0,locks:0};`);
code+='\nmodule.exports={raw,t,initial,step,replay,summary,hash,wall,floor,spike,V,L,add,chain};';
const ctx={require,module:{exports:{}},console};vm.createContext(ctx);vm.runInContext(code,ctx);const m=ctx.module.exports;
const cp=z=>JSON.parse(JSON.stringify(z)),K=r=>r.join(',');

function inspectX(s){
 // Only predicts accepted birth/force predicates. Does not propagate stack,
 // multi-conflict leaves, masking, or loaded-independent-stack observation.
 const bs=s.b.filter(b=>!b.c?.fork).map(cp),plans=[];
 for(const b of s.b.filter(b=>b.c?.fork>0)){
  let n=0;for(const d of[m.L[b.c.f],m.L[m.L[m.L[b.c.f]]],b.c.f]){
   const r=m.add(b.r,d),ids=[];if(!m.chain(bs,r,d,ids,s,b.c))continue;
   plans.push({origin:b.orig,color:b.color,from:b.r,r,d,fork:b.c.fork-1,pushes:ids.map(i=>({id:bs[i].orig,r:bs[i].r,to:m.add(bs[i].r,d)}))});if(++n===2)break;
  }
 }
 const forces=new Map(),births=new Map();
 for(const p of plans){for(const b of p.pushes){if(!forces.has(b.id))forces.set(b.id,new Set());forces.get(b.id).add(p.d);}
  if(!births.has(K(p.r)))births.set(K(p.r),[]);births.get(K(p.r)).push(p.origin);}
 return{source:m.summary(s),plans,forceConflicts:[...forces].filter(([id,ds])=>ds.size>1).map(([id,ds])=>({id,dirs:[...ds]})),independentBirthOverlaps:[...births].filter(([r,ids])=>new Set(ids).size>1).map(([r,ids])=>({r,origins:ids})),outside:s.p};
}

function single(path,start=m.initial){let s=cp(start),trace=[];for(let i=0;i<path.length;i++){
 const o=m.step(s,path[i],path.slice(0,i+1));if(o.length!==1)return{valid:false,n:i+1,branches:o.length,trace};s=o[0].s;trace.push({n:i+1,a:path[i],s:m.summary(s)});
 }return{valid:true,path,count:path.length,s,trace};}

function conditionSource(positions,face){const s=cp(m.initial);for(const b of s.b){b.r=positions[b.orig];if(b.c)b.c.f=face;}return s;}
function forceCombinations(s){
 const x=inspectX(s),choices=[];
 function choose(n,z){if(n===x.forceConflicts.length){choices.push(z);return;}const g=x.forceConflicts[n];for(const d of g.dirs)choose(n+1,{...z,[g.id]:d});}choose(0,{});
 return{source:m.summary(s),x,cases:choices.map(choice=>{
  const kept=x.plans.filter(p=>p.pushes.every(b=>choice[b.id]===undefined||choice[b.id]===p.d)),bs=s.b.filter(b=>!b.c?.fork).map(cp);
  const movements=new Map();for(const p of kept)for(const b of p.pushes)movements.set(b.id,b.to);
  for(const b of bs)if(movements.has(b.orig))b.r=movements.get(b.orig);
  for(const p of kept){const parent=s.b.find(b=>b.orig===p.origin);bs.push({...cp(parent),r:p.r,c:{...cp(parent.c),fork:p.fork}});}
  const byCell=new Map();for(const b of bs){if(!byCell.has(K(b.r)))byCell.set(K(b.r),[]);byCell.get(K(b.r)).push(b.orig);}
  const overlaps=[...byCell].filter(([r,origins])=>origins.length>1).map(([r,origins])=>({r,origins}));
  const leaf={b:bs,p:cp(s.p),keys:0,locks:0};
  const goalTails=overlaps.length?null:m.raw.initial.level.goals.map(g=>{const path='WWW'+'A'.repeat(10-g[0]),r=single(path,leaf);return{goal:g,path,valid:r.valid,outside:r.valid?r.s.p:null};});
  return{choice,keptChildren:kept.map(p=>({origin:p.origin,r:p.r,fork:p.fork})),movedEmpty:bs.filter(b=>!b.c).map(b=>({origin:b.orig,r:b.r})),overlaps,outside:leaf.p,goalTails};
 })};
}

function audit(){
 const pre='SAASSAAAWWAASWDDWWAASS',ordinary=single(pre);
 const turns=['','W','A','D'].map(p=>{const r=single(p);return{pre:p,valid:r.valid,x:r.valid?inspectX(r.s):null};});
 const conditioned=[];
 if(ordinary.valid){const s=ordinary.s;
  // A single opposite-force family only. Winner identity is conditional M120;
  // no claim that independent loaded stack mechanics are verified here.
  for(const winner of['D','A']){
   const bs=s.b.filter(b=>!b.c?.fork).map(cp),plans=inspectX(s).plans;
   const kept=plans.filter(p=>!p.pushes.length||p.d===winner);
   const forced=bs.find(b=>b.orig===74);forced.r=m.add(forced.r,winner);
   for(const p of kept){const parent=s.b.find(b=>b.orig===p.origin);bs.push({...cp(parent),r:p.r,c:{...cp(parent.c),fork:p.fork}});}
   const leaf={b:bs,p:cp(s.p),keys:0,locks:0};
   const right=single('DDDSSDDWWDDWWWW',leaf);
   conditioned.push({winner,leaf:m.summary(leaf),rightValid:right.valid,rightEnd:right.valid?m.summary(right.s):null});
  }
 }
 // P75 alone; each row7 route stays inside true floor and avoids bare SPIKE.
 const alone={b:[],p:cp(m.initial.p),keys:0,locks:0};
 const goals=m.raw.initial.level.goals.map(r=>({goal:r,path:'WWW'+'A'.repeat(10-r[0])}));
 const goalReplays=goals.map(g=>{const r=single(g.path,alone);return{...g,valid:r.valid,final:r.valid?r.s.p:null};});
 const triple=conditionSource({67:[2,2],68:[3,3],69:[4,2],70:[1,2],71:[5,2],72:[6,2],73:[1,4],74:[5,4]},'W');
 const rowOne=conditionSource({67:[4,1],68:[6,1],69:[8,1],70:[5,1],71:[7,1],72:[1,4],73:[2,4],74:[3,4]},'W');
 const threeForce=conditionSource({67:[2,2],68:[3,3],69:[2,4],70:[2,1],71:[2,3],72:[2,5],73:[3,2],74:[3,4]},'D');
 return{scope:'fixed only, zero BFS; visible base reused; fresh X vacancy/two-source stack observed actual1; other X/force/triple-stack sources remain conditional; no stack observation model; force combinations are constructed, not actual leaves',turns,preparation:ordinary.valid?{path:pre,count:pre.length,valid:true,source:m.summary(ordinary.s),trace:ordinary.trace,x:inspectX(ordinary.s)}:ordinary,conditioned,goalReplays,tripleStackCondition:inspectX(triple),rowOneForce:forceCombinations(rowOne),threeForce:forceCombinations(threeForce)};
}
function observed90(){
 const entries=m.raw.events.map((e,i)=>({i,o:e.observation})).filter(e=>e.o?.level?.id==='blossom'&&e.o.level.instructions.length===90&&e.o.level.timelines.length===8&&e.o.level.timelines.every(t=>t.time===90));
 if(!entries.length)throw Error('Required actual90 eight-leaf observation absent');
 const {i,o}=entries[0],path='SDDDDSSDDDWWDDWWWW';
 const leaves=o.level.timelines.map(t=>{
  const live=t.entities.filter(e=>e.active&&!e.properties?.maskedoff),body=live.filter(e=>['BOX','PLAYER'].includes(e.type));
  if(body.some(e=>e.properties.height!==1))throw Error('Unmodelled actual90 stack height');
  const b=live.filter(e=>e.type==='BOX').map(e=>{const p=live.find(p=>p.type==='PLAYER'&&p.properties.contained&&p.properties.container===e.id);return{r:e.pos,orig:e.id,color:e.details.Color,c:p?{f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key,ghost:p.properties.ghost}:null};});
  const free=live.filter(e=>e.type==='PLAYER'&&!e.properties.contained);
  if(free.length!==1||free[0].id!==75||K(free[0].pos)!=='1,4'||free[0].properties.ghost||free[0].properties.split)throw Error('Required P75 differs');
  const seed={b,p:free.map(p=>({r:p.pos,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key})),keys:0,locks:0};
  const z=single(path,seed);
  const tails=z.valid?m.raw.initial.level.goals.map(g=>{const a='A'.repeat(10-g[0]),r=single(a,z.s);return{goal:g,path:a,valid:r.valid,outside:r.valid?r.s.p:null};}):null;
  return{axis:t.axis,time:t.time,source:m.summary(seed),inactiveMaskedIgnored:t.entities.filter(e=>!e.active||e.properties?.maskedoff).filter(e=>['BOX','PLAYER'].includes(e.type)).map(e=>({id:e.id,active:e.active,maskedoff:e.properties.maskedoff})),valid:z.valid,failedAt:z.n,route:z.trace.map(t=>t.s.free[0]?.r),final:z.valid?m.summary(z.s):null,goalTails:tails};
 });
 return{scope:'historical fixed actual90 source assembled from active/masked/contained/height fields; common ordinary18 and Goal tails later executed in CLOSED actual281; no BFS or game input',sourceEvent:i,sourceInstructions:o.level.instructions,path,count:path.length,leaves};
}
function closedActual281(){
 const run=m.raw.run,l=m.raw.completion?.level;
 if(!run?.completed||!l?.completed||run.action_count!==281||run.actions.length!==281||run.actions!==l.instructions||run.undo_count!==6||run.retry_count!==0||l.timelines.length!==8)throw Error('Required CLOSED actual281 proof differs');
 const goals=[9,8,7,6,4,3,2,1],times=[109,110,111,112,114,115,116,117];
 const leaves=l.timelines.map(t=>{const n=t.axis[0],live=t.entities.filter(e=>e.type==='PLAYER'&&e.active&&!e.properties.maskedoff),p=live.find(p=>p.id===75),cargo=live.filter(p=>p.properties.contained);
  if(!p||K(p.pos)!==goals[n]+',7'||t.time!==times[n]||p.properties.contained||p.properties.ghost||cargo.length!==3||cargo.some(p=>p.properties.ghost))throw Error('Required numeric-axis Goal/cargo proof differs');
  return{numericT:n,axis:t.axis,goal:p.pos,time:t.time,freeId:p.id,cargoCount:cargo.length,allGhost0:live.every(p=>!p.properties.ghost)};
 }).sort((a,b)=>a.numericT-b.numericT);
 const sourceEvent=m.raw.events.findIndex(e=>e.observation?.level?.completed&&e.observation.level.instructions===run.actions);
 return{status:'CLOSED actual281',scope:'read-only saved actual completion proof; no replay/search/game input',sourceEvent,completed:l.completed,actions:281,undo:6,retry:0,numericTLeaves:leaves,saveWorldProofSource:'root independent normal SaveSlot1 blossom3/count116/record281, 116audit issues[], autoWorld[-68,5]Fork1; no helper save access'};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='closed281'?closedActual281():process.argv[2]==='actual90'?observed90():audit(),null,2));
module.exports={m,inspectX,single,audit,observed90,closedActual281};
