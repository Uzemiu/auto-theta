// Read-only bounded direct P/Q entry search from a fresh actual Chapter2.
// Uses the existing public observed ICE/brake model; no Bridge/save/game calls.
const fs=require('fs'),Module=require('module'),pathModule=require('path');
const witnessMode=process.argv.includes('--witness');
// The owner has left Chapter2. Freeze the original actual542 fixture rather
// than accidentally using a later paused menu snapshot as a live source.
const publicModelPath=pathModule.resolve(__dirname,'chapter2-pq-dynamic-readonly.cjs');
let publicModelText=fs.readFileSync(publicModelPath,'utf8');
const sourceSelector="const source=[{index:-1,o:raw.initial},...(raw.events||[]).map((e,index)=>({index,o:e.observation}))].reverse().find(x=>x.o?.level?.id==='Chapter2'&&x.o.level.world&&x.o.level.timelines?.[0]?.tiles?.length);";
if(!publicModelText.includes(sourceSelector))throw Error('Public model source selector changed');
publicModelText=publicModelText.replace(sourceSelector,"const source={index:542,o:raw.events[542].observation};");
if(witnessMode){
 const cross="stats.uncertainCross++;return null;";
 const conflict="stats.conflict++;return null;";
 if(!publicModelText.includes(cross)||!publicModelText.includes(conflict))throw Error('Public model diagnostic boundary changed');
 publicModelText=publicModelText.replace(cross,"stats.uncertainCross++;stats.lastBoundary={kind:'one-moving-one-stopped-or-unverified-player-cross',tick,input:A[a],before:{p:p.map(e=>({...e})),b:b.map(e=>({...e}))},crossingPair:[{...q},{...e}],plannedPlayers:np.map(e=>({...e}))};return null;");
 publicModelText=publicModelText.replace(conflict,"stats.conflict++;stats.lastBoundary={kind:'different-directions-request-same-box',tick,input:A[a],before:{p:p.map(e=>({...e})),b:b.map(e=>({...e}))},requests:[...plans].map(([j,r])=>({box:b[j].id,requests:r}))};return null;");
}
const publicModel=new Module(publicModelPath,module);publicModel.filename=publicModelPath;publicModel.paths=Module._nodeModulePaths(pathModule.dirname(publicModelPath));publicModel._compile(publicModelText,publicModelPath);const m=publicModel.exports;
const K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],pos=p=>[p.x,p.y];
const completed=new Set(JSON.parse(fs.readFileSync('knowledge/progress.json','utf8').replace(/^\uFEFF/,'')).active_playthrough.verified_completed_levels);
const source={event:m.source.index,frame:m.source.o.frame,level:m.source.o.level.id,instructions:m.source.o.level.instructions,start:m.describe(m.start)};
if(source.level!=='Chapter2'||source.instructions!==''||source.start.players.length!==1||K(source.start.players[0].at)!=='82,7'||source.start.players[0].fork!==1||m.source.o.level.input_locked||m.source.o.level.busy||m.source.o.level.paused)throw Error('Expected latest stable fresh Chapter2 82,7/F1 source');
const targets=[...m.entries].filter(([k,id])=>['2-P','2-Q'].includes(id));
const targetPositions=new Set(targets.map(([k])=>k));
// Obtain the existing model's live stats object without expanding its graph.
const modelStats=m.search({cap:1,accept:()=>true}).stats;
const unknown={spikeDeathRejected:0,modelNull:0,noFreeActor:0};
function safeNext(s,a,trace=false){const deaths=modelStats.death,r=m.next(s,a,{trace});if(modelStats.death!==deaths){unknown.spikeDeathRejected++;return null;}if(!r){unknown.modelNull++;return null;}if(!r.p.some(p=>!p.contained)){unknown.noFreeActor++;return null;}return r;}
const isTarget=s=>s.p.some(p=>!p.contained&&targetPositions.has(K(pos(p))));
// Optimistic input-distance field: arbitrary first direction and stopping at
// every traversed ICE cell. Boxes/other actors removed. Used only as ordering.
// This is neither a legal route nor a proof that the actual resource can reach it.
const forbidden=new Set([...m.entries].filter(([k,id])=>!completed.has(id)&&!['2-P','2-Q'].includes(id)).map(([k])=>k));
const safeCell=k=>m.terrain.has(k)&&!m.walls.has(k)&&m.terrain.get(k)!=='SPIKE'&&m.terrain.get(k)!=='DARK'&&!forbidden.has(k);
const cells=[...m.terrain.keys()].filter(safeCell),reverse=new Map(cells.map(k=>[k,[]]));
for(const k of cells){const p=k.split(',').map(Number);for(let d=0;d<4;d++){let z=[...p];for(let tick=0;tick<250;tick++){z=[z[0]+V[d][0],z[1]+V[d][1]];const kz=K(z);if(!safeCell(kz))break;reverse.get(kz).push(k);if(m.terrain.get(kz)!=='ICE')break;}}}
const optimisticDistance=new Map(targets.map(([k])=>[k,0])),rq=targets.map(([k])=>k);for(let head=0;head<rq.length;head++){const k=rq[head];for(const v of reverse.get(k)||[])if(!optimisticDistance.has(v)){optimisticDistance.set(v,optimisticDistance.get(k)+1);rq.push(v);}}
const distance=s=>Math.min(...s.p.filter(p=>!p.contained).map(p=>optimisticDistance.get(K(pos(p)))??500));
const cap=witnessMode?5000:40000,depthCap=100,q=[{s:m.start,parent:-1,a:'',depth:0}],seen=new Map([[m.serial(m.start),0]]),heap=[];let expanded=0,hit=null,closest=null;
const witnesses={capture:null,allCargoFork1:null,uncertainCross:null,conflict:null};
function keepWitness(kind,n,a,r,boundary){const candidate={source,preSequence:path(n),action:m.A[a],sequence:path(n)+m.A[a],preState:m.describe(q[n].s),predictedPostState:r?m.describe(r):null,terminalTrace:r?r.trace:null,boundary:boundary||null,scope:kind==='capture'||kind==='allCargoFork1'?'Model-only contained result needs normal actual calibration. Prefix and terminal input are checked for model deaths and forbidden ENTRYs.':'Safe model prefix plus a single unknown boundary input. Boundary outcome is deliberately not inferred.'};if(!witnesses[kind]||candidate.sequence.length<witnesses[kind].sequence.length)witnesses[kind]=candidate;}
const priority=n=>q[n].depth+2.5*distance(q[n].s);
function push(n){let i=heap.length;heap.push(n);while(i){const j=(i-1)>>1;if(priority(heap[j])<=priority(heap[i]))break;[heap[j],heap[i]]=[heap[i],heap[j]];i=j;}}
function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(1){let j=i,l=i*2+1,r=l+1;if(l<heap.length&&priority(heap[l])<priority(heap[j]))j=l;if(r<heap.length&&priority(heap[r])<priority(heap[j]))j=r;if(i===j)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
function path(n){let out='';while(q[n].parent>=0){out=q[n].a+out;n=q[n].parent;}return out;}
push(0);while(heap.length&&expanded<cap){const n=pop(),s=q[n].s;expanded++;if(seen.get(m.serial(s))!==q[n].depth)continue;const d=distance(s);if(!closest||d<closest.distance)closest={distance:d,sequence:path(n),state:m.describe(s)};
 if(isTarget(s)){hit={sequence:path(n),state:m.describe(s)};break;}if(q[n].depth>=depthCap)continue;
 for(let a=0;a<5;a++){
  const before={death:modelStats.death,capture:modelStats.capture,uncertainCross:modelStats.uncertainCross,conflict:modelStats.conflict};
  const r=witnessMode?m.next(s,a,{trace:true}):safeNext(s,a);
  if(witnessMode){
   if(modelStats.death!==before.death){unknown.spikeDeathRejected++;continue;}
   if(modelStats.uncertainCross!==before.uncertainCross)keepWitness('uncertainCross',n,a,null,modelStats.lastBoundary);
   if(modelStats.conflict!==before.conflict)keepWitness('conflict',n,a,null,modelStats.lastBoundary);
   if(r&&modelStats.capture!==before.capture){keepWitness('capture',n,a,r);if(r.p.length&&r.p.every(p=>p.contained)&&r.p.some(p=>p.fork>0))keepWitness('allCargoFork1',n,a,r);}
   if(!r){unknown.modelNull++;continue;}if(!r.p.some(p=>!p.contained)){unknown.noFreeActor++;continue;}
  }
  if(!r)continue;const key=m.serial(r),nd=q[n].depth+1;if(seen.has(key)&&seen.get(key)<=nd)continue;seen.set(key,nd);q.push({s:r,parent:n,a:m.A[a],depth:nd});push(q.length-1);
 }
 if(expanded%5000===0)console.log(JSON.stringify({progress:true,expanded,seen:seen.size,pending:heap.length,closest}));
}
let replay=null;
if(hit){let s=m.start;const points=[],entries=[];let valid=true;for(const[i,a]of[...hit.sequence].entries()){const r=safeNext(s,m.A.indexOf(a),true);if(!r){valid=false;points.push({step:i+1,a,rejected:true});break;}
 for(const tick of r.trace){for(const p of tick.p.filter(p=>!p.contained)){const id=m.entries.get(K(pos(p)));if(id){const e={step:i+1,a,tick:tick.tick,player:p.id,pos:pos(p),entry:id,completed:completed.has(id),target:['2-P','2-Q'].includes(id)};entries.push(e);if(!e.completed&&!e.target)valid=false;}}}
 points.push({step:i+1,a,...m.describe(r),ticks:r.trace.length});s=r;
 }
 const firstTarget=entries.find(e=>e.target);if(!firstTarget||firstTarget.step!==hit.sequence.length)valid=false;
 replay={valid,points,entryMicroticks:entries,firstTarget,scope:'Model replay only; completed ENTRY traversal is supported by prior public observations. No other unfinished ENTRY is crossed. Final target loading remains owner actual verification.'};
}
const report={scope:'MODEL ONLY, direct any active uncontained PLAYER at ENTRY 2-P or 2-Q. Initial X location unrestricted. SPIKE deaths rejected and all old uncertain-cross/perpendicular/conflict boundaries retained. No global no-solution claim and no actual entered/completed credit.',source,targets,cap,depthCap,expanded,seen:seen.size,pending:heap.length,exhausted:!hit&&!heap.length,hit,closest,unknown,modelStats,optimisticOrdering:{cells:cells.length,canReachTarget:optimisticDistance.size,sourceDistance:distance(m.start),weight:2.5,scope:'Arbitrary ICE stops and arbitrary first directions used only as optimistic ordering, never as an execution route.'},replay};
if(witnessMode){
 for(const w of Object.values(witnesses)){if(!w)continue;let s=m.start;const points=[],entryMicroticks=[];let valid=true;for(const[i,a]of[...w.preSequence].entries()){const r=safeNext(s,m.A.indexOf(a),true);if(!r){valid=false;break;}for(const tick of r.trace)for(const p of tick.p.filter(p=>!p.contained)){const entry=m.entries.get(K(pos(p)));if(entry){const e={step:i+1,a,tick:tick.tick,player:p.id,pos:pos(p),entry,completed:completed.has(entry)};entryMicroticks.push(e);if(!e.completed)valid=false;}}points.push({step:i+1,a,...m.describe(r),ticks:r.trace.length});s=r;}
  if(m.serial(s)!==m.serial(q[0].s)&&JSON.stringify(m.describe(s))!==JSON.stringify(w.preState))valid=false;
  for(const tick of w.terminalTrace||[])for(const p of tick.p.filter(p=>!p.contained)){const entry=m.entries.get(K(pos(p)));if(entry){entryMicroticks.push({step:w.sequence.length,a:w.action,tick:tick.tick,player:p.id,pos:pos(p),entry,completed:completed.has(entry)});if(!completed.has(entry))valid=false;}}
  w.prefixReplay={valid,points,entryMicroticks,scope:'All safe-prefix microticks inspected; no unfinished ENTRY or model SPIKE death. The unknown terminal action, when present, stays unverified.'};
 }
 const supplement={scope:'At most the first5000 expansions of the same fresh graph replayed solely to extract boundary witnesses, not an enlarged P/Q budget. The original process was terminal and had no live q handle.',source,expanded,seen:seen.size,pending:heap.length,unknown,modelStats,witnesses};
 const oldText=fs.readFileSync('scratch/chapter2-pq-direct-entry-oct06.md','utf8'),match=oldText.match(/```json\n([\s\S]*?)\n```/);if(!match)throw Error('Original report missing');const original=JSON.parse(match[1]);original.witnessSupplement=supplement;
 fs.writeFileSync('scratch/chapter2-pq-direct-entry-oct06.md','# Fresh Chapter2 direct 2-P / 2-Q entry search\n\n```json\n'+JSON.stringify(original,null,2)+'\n```\n');
 console.log(JSON.stringify({...supplement,witnesses:Object.fromEntries(Object.entries(witnesses).map(([k,w])=>[k,w?{...w,terminalTrace:w.terminalTrace?{ticks:w.terminalTrace.length,first:w.terminalTrace[0],last:w.terminalTrace.at(-1)}:null,prefixReplay:{...w.prefixReplay,points:{length:w.prefixReplay.points.length,first:w.prefixReplay.points[0],last:w.prefixReplay.points.at(-1)}}}:null]))}));process.exit(0);
}
fs.writeFileSync('scratch/chapter2-pq-direct-entry-oct06.md','# Fresh Chapter2 direct 2-P / 2-Q entry search\n\n```json\n'+JSON.stringify(report,null,2)+'\n```\n');
console.log(JSON.stringify({...report,replay:replay?{...replay,points:{length:replay.points.length,first:replay.points[0],last:replay.points.at(-1)}}:null}));
