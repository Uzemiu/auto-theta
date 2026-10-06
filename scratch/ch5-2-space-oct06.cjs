// Pure private model, public records only. No game calls, implementation, or writes.
const fs=require('fs'),rec=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/5-2.json','utf8').replace(/^\uFEFF/,''));
const si=rec.events.findLastIndex(e=>e.observation?.frame===2147793);if(si<0)throw Error('Actual9 source absent');
const obs=rec.events[si].observation,t=obs.level.timelines.find(t=>t.axis[0]===0),initial=rec.initial.level.timelines[0],V=[[0,1],[-1,0],[0,-1],[1,0]],K=z=>z.join(','),M=(z,d)=>[z[0]+V[d][0],z[1]+V[d][1]];
const wall=new Set(t.entities.filter(e=>e.type==='SOLID'&&e.blockable).map(e=>K(e.pos))),floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const base=new Map(t.entities.filter(e=>['PLAYER','BOX'].includes(e.type)).map(e=>[e.id,e]));
function seed(tt){return {time:tt.time,b:tt.entities.filter(e=>e.type==='BOX'&&e.active).map(e=>({id:e.id,z:e.pos.slice()})),p:tt.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,z:e.pos.slice(),f:e.properties.face,F:e.properties.split,g:e.properties.ghost,c:e.properties.contained}))};}
const source=seed(t);if(obs.level.instructions!=='WDDDSSSAX'||source.p.length!==2||source.p.some(p=>p.F||p.c||p.g)||source.b.length!==3)throw Error('Actual9 resource invariant differs');
function step(s,a,opts={}){const planned=new Map(),np=[],bi=new Map(s.b.map(b=>[K(b.z),b])),blocked=z=>wall.has(K(z))||!floor.has(K(z));
  function chain(z,d){const out=[];while(bi.has(K(z))){out.push(bi.get(K(z)).id);z=M(z,d);}return blocked(z)?null:out;}
  for(const p of s.p){if(p.active===false){np.push({...p,z:p.z.slice()});continue;}if(p.c){if(!opts.transport)throw Error('Stop first capture');np.push({...p,z:p.z.slice(),f:'WASD'.indexOf(a)});continue;}
    const d0='WASD'.indexOf(a);let dest=p.z.slice(),d=d0;
    for(let j=0;j<4;j++){d=(d0+j)%4;const z=M(p.z,d);if(blocked(z))continue;const ch=chain(z,d);if(ch===null)continue;
      for(const id of ch){if(planned.has(id)&&planned.get(id)!==d)throw Error('Force excluded');planned.set(id,d);}dest=z;break;}
    np.push({...p,z:dest,f:d});}
  const b=s.b.map(v=>({id:v.id,z:planned.has(v.id)?M(v.z,planned.get(v.id)):v.z.slice()}));
  if(new Set(b.map(v=>K(v.z))).size!==b.length)throw Error('New stack excluded');
  const nb=new Map(b.map(v=>[K(v.z),v.id]));for(const p of np)if(p.c)p.z=b.find(v=>v.id===p.c).z.slice();
  if(new Set(np.filter(p=>p.active!==false).map(p=>K(p.z))).size!==np.filter(p=>p.active!==false).length)throw Error('Actor contact excluded');
  const captures=[];for(const p of np){if(p.c)continue;if(nb.has(K(p.z))){p.c=nb.get(K(p.z));p.g=Number(spike.has(K(p.z)));captures.push(p.id);}else if(spike.has(K(p.z))){if(!opts.allowDeath)throw Error('Bare death excluded');p.g=1;p.active=false;}}
  return {time:s.time+1,b,p:np,captures};
}
function describe(s){return {time:s.time,players:s.p.map(p=>({id:p.id,pos:p.z,face:p.f,Fork:p.F,ghost:p.g,container:p.c||-1,active:p.active!==false})),boxes:s.b,
  entityPredictions:s.p.map(p=>{const e=base.get(p.id);return {...e,pos:p.z,face:V[p.f],active:p.active!==false,properties:{...e.properties,face:p.f,ghost:p.g,contained:Number(!!p.c),container:p.c||-1}};}).concat(s.b.map(b=>({...base.get(b.id),pos:b.z}))),scope:'MODEL, actual9 static fields retained; unknown capture/Goal branches must be actual observed'};}
// Calibrate ordinary movement/fork pickup against an already recorded actual8.
const i8=rec.events.findLastIndex(e=>e.observation?.level.instructions==='WDDDSSSA');let calibration8=null;
if(i8>=0){let ss=seed(initial);for(const a of 'WDDDSSSA')ss=step(ss,a);ss.p[0].F=1;
  const oo=rec.events[i8].observation,tt=oo.level.timelines[0],geom=q=>JSON.stringify({p:q.p.map(p=>[p.id,p.z,p.f,p.F,p.g,p.c]),b:q.b});
  calibration8={event:i8,frame:oo.frame,equalGeometryFork:geom(ss)===geom(seed(tt)),scope:'ordinary initial-to-actual8 positions/faces/Fork, three BOX positions; actual9 itself is the actual source, X not invented'};if(!calibration8.equalGeometryFork)throw Error('Actual8 calibration failed');}
const wanted={40:[4,3],41:[7,3],42:[5,3]},md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const target=s=>{if(s.b.some(b=>K(b.z)!==K(wanted[b.id]))||!s.p.some(p=>K(p.z)==='6,3')||!s.p.some(p=>K(p.z)==='2,3'))return false;
  try{const n=step(s,'D');return n.captures.length===1&&n.p.some(p=>p.c===40&&p.g===1)&&n.p.filter(p=>!p.c&&p.active!==false).length===1;}catch(e){return false;}};
const h=s=>s.b.reduce((v,b)=>v+md(b.z,wanted[b.id])*4,0)+Math.min(md(s.p[0].z,[6,3])+md(s.p[1].z,[2,3]),md(s.p[1].z,[6,3])+md(s.p[0].z,[2,3]));
const canonical=s=>JSON.stringify({b:s.b.map(b=>[b.id,...b.z]),p:s.p.map(p=>[...p.z,p.c,p.g]).sort()});
const q=[{s:source,parent:-1,a:'',g:0,f:h(source)*3}],heap=[],seen=new Set([canonical(source)]);
function put(i){let k=heap.length;heap.push(i);while(k){const j=(k-1)>>1;if(q[heap[j]].f<=q[i].f)break;heap[k]=heap[j];k=j;}heap[k]=i;}
function pop(){const out=heap[0],last=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&q[heap[j+1]].f<q[heap[j]].f)j++;if(q[heap[j]].f>=q[last].f)break;heap[k]=heap[j];k=j;}heap[k]=last;}return out;}
put(0);let expanded=0,hit=-1,cuts=0;const cap=20000;
const savedPrefix='WDDWWDWSSWWWWDSSWAWDDASASAAWDDSDSDWSAWWDWSSAAASASDSSWW',searchExecuted=process.argv.includes('--search');
if(!searchExecuted){heap.length=0;let ss=source;for(const a of savedPrefix){ss=step(ss,a);const i=q.length;q.push({s:ss,parent:i-1,a,g:i,f:0});seen.add(canonical(ss));}hit=q.length-1;if(!target(ss))throw Error('Saved candidate replay no longer valid');}
while(searchExecuted&&heap.length&&expanded<cap){const i=pop(),s=q[i].s;expanded++;if(target(s)){hit=i;break;}
  for(const a of 'WASD'){let n;try{n=step(s,a);}catch(e){cuts++;continue;}if(n.captures.length)continue;const k=canonical(n);if(seen.has(k))continue;seen.add(k);const j=q.length,g=q[i].g+1;q.push({s:n,parent:i,a,g,f:g+h(n)*3});put(j);}
}
let candidate=null;if(hit>=0){let path='';for(let i=hit;q[i].parent>=0;i=q[i].parent)path=q[i].a+path;let s=source;const trace=[];for(const a of path){s=step(s,a);trace.push({action:a,...describe(s)});}
  const after=step(s,'D');candidate={prefix:path,trace,preD:describe(s),terminalAction:'D',afterDModel:describe(after),captureID:after.captures[0],unknown:'C4 same-tick SPIKE3,3 capture is supported by5-1/M092 but this double-chain fixture and later Goal7,7 observation require actual verification.'};
  const tail='ASSAAWWWAWDDDDDASSSDDWWW';let st=after;const transport=[];for(const a of tail){st=step(st,a,{transport:true});transport.push({action:a,...describe(st)});}
  candidate.transport={actions:tail,trace:transport,goalPreObservation:describe(st),scope:'Physics only, no assumed Goal observation. Exact actual captured ID and colors must be calibrated before continuing.'};
  const conditional=[];for(const [label,path] of [['IfActualAliveCargoLeaf','AAAAAAWW'],['IfActualDeadCargoLeaf','AASSSSAAAA']]){let ts=JSON.parse(JSON.stringify(st));const tr=[];
    const cp=ts.p.find(p=>p.c===40);cp.g=label==='IfActualAliveCargoLeaf'?0:1;cp.active=label==='IfActualAliveCargoLeaf';
    for(const a of path){ts=step(ts,a,{transport:true});tr.push({action:a,...describe(ts)});}
    conditional.push({label,path,trace:tr,final:describe(ts)});}
  candidate.conditionalLeafTails={tails:conditional,scope:'MODEL only after actual Goal88 yields alive/dead cargo leaves; no axes/GMID or actual observation invented.'};
}
const publicPrefixChecks=[];
if(candidate){for(let i=si+1;i<rec.events.length;i++){const oo=rec.events[i].observation;if(!oo)continue;const ins=oo.level.instructions,n=ins.length-obs.level.instructions.length;
  if(n<1||n>candidate.prefix.length||ins!==obs.level.instructions+candidate.prefix.slice(0,n))continue;const tt=oo.level.timelines.find(t=>t.axis[0]===0),dd=[];
  for(const ex of candidate.trace[n-1].entityPredictions){const ac=tt.entities.find(e=>e.id===ex.id);for(const k of new Set([...Object.keys(ex),...Object.keys(ac)]))if(JSON.stringify(ex[k])!==JSON.stringify(ac[k]))dd.push({id:ex.id,key:k,expected:ex[k],actual:ac[k]});}
  publicPrefixChecks.push({event:i,frame:oo.frame,time:tt.time,fullEntityDiff:dd});
}}
function entityDiff(expected,tt){const dd=[];for(const ex of expected){const ac=tt.entities.find(e=>e.id===ex.id);if(!ac){dd.push({id:ex.id,key:'missing'});continue;}
  for(const k of new Set([...Object.keys(ex),...Object.keys(ac)]))if(JSON.stringify(ex[k])!==JSON.stringify(ac[k]))dd.push({id:ex.id,key:k,expected:ex[k],actual:ac[k]});}return dd;}
let actualCapture=null,transportChecks=[],actualGoal88=null,actualTailChecks=null,completionEvidence=null;
const ci=rec.events.findLastIndex(e=>e.observation?.frame===2249212);
if(ci>=0){const oo=rec.events[ci].observation;actualCapture={event:ci,frame:oo.frame,time:oo.level.timelines[0].time,fullEntityDiff:entityDiff(candidate.afterDModel.entityPredictions,oo.level.timelines[0])};
  for(let i=ci+1;i<rec.events.length;i++){const oo=rec.events[i].observation;if(!oo)continue;const ins=oo.level.instructions,n=ins.length-64;
    if(n<1||n>=candidate.transport.actions.length||ins!==obs.level.instructions+candidate.prefix+'D'+candidate.transport.actions.slice(0,n))continue;
    transportChecks.push({event:i,frame:oo.frame,time:oo.level.timelines[0].time,fullEntityDiff:entityDiff(candidate.transport.trace[n-1].entityPredictions,oo.level.timelines[0])});}}
const gi=rec.events.findLastIndex(e=>e.observation?.frame===2273383);
if(gi>=0){const go=rec.events[gi].observation;actualGoal88={event:gi,frame:go.frame,leaves:go.level.timelines.map(tt=>({axis:tt.axis,time:tt.time,entities:tt.entities.filter(e=>['BOX','PLAYER'].includes(e.type))}))};
  actualTailChecks=go.level.timelines.map(tt=>{const path=tt.axis[0]===0?'AAAAAAWW':'AASSSSAAAA',expected=tt.entities.filter(e=>['PLAYER','BOX'].includes(e.type)).map(e=>JSON.parse(JSON.stringify(e))),trace=[];
    for(let j=0;j<path.length;j++){const d='WASD'.indexOf(path[j]);for(const e of expected){if(!e.active||e.type!=='PLAYER')continue;e.face=V[d];e.properties.face=d;if(!e.properties.contained){const z=M(e.pos,d);if(wall.has(K(z))||spike.has(K(z))||!floor.has(K(z)))throw Error('Actual leaf tail unsafe');e.pos=z;}}
      trace.push({time:tt.time+j+1,action:path[j],entityPredictions:JSON.parse(JSON.stringify(expected))});}
    const checks=[];for(let i=gi+1;i<rec.events.length;i++){const oo=rec.events[i].observation;if(!oo||!oo.level.instructions.startsWith(go.level.instructions))continue;
      const selected=(oo.level.instructions.slice(go.level.instructions.length).match(/T/g)||[]).length%2;if(selected!==tt.axis[0])continue;const lt=oo.level.timelines.find(t=>t.axis[0]===tt.axis[0]),n=lt?lt.time-tt.time:0;if(n<1||n>path.length)continue;
      const dd=entityDiff(trace[n-1].entityPredictions,lt);checks.push({event:i,frame:oo.frame,time:lt.time,fullEntityDiff:dd,physicsStaticDiff:dd.filter(d=>d.key!=='anim_completed'),animationDiff:dd.filter(d=>d.key==='anim_completed')});}
    return {axis:tt.axis,path,trace,checks,final:trace.at(-1)};});
}
if(rec.completion){const co=rec.completion,exact=obs.level.instructions+candidate.prefix+'D'+candidate.transport.actions+'AAAAAAWW'+'T'+'AASSSSAAAA';
  completionEvidence={frame:co.frame,completed:co.level.completed,instructions:co.level.instructions,exactCandidate:co.level.instructions===exact,actionCount:rec.run?.action_count,fullCompletedStateCaptured:true,
    leafFinalChecks:co.level.timelines.map(tt=>({axis:tt.axis,time:tt.time,diff:entityDiff(actualTailChecks.find(a=>a.axis[0]===tt.axis[0]).final.entityPredictions,tt)})),scope:'Actual complete frame; animation differences are reported rather than replaced by stable predictions. Save verification belongs to root.'};}
console.log(JSON.stringify({sourceEvent:si,sourceFrame:obs.frame,calibration8,source:describe(source),budget:cap,searchExecuted,recordedSearch:{expanded:947,seen:1583,pending:636,cuts:720},expanded,seen:seen.size,pending:heap.length,cuts,candidate,publicPrefixChecks,actualCapture,transportChecks,actualGoal88,actualTailChecks,completionEvidence,
  domain:'Actual9 two same-parity F0 free, all three physical distinct source boxes; ordinary push chain and fallback, no prior bare death/contact/force/stack/capture; fixed useful frontC4/rearC2/jamC1 fixture',limits:['Colors treated as observed classBox/pushable, not PRISM or links.','First single-box parity trap argument does not apply to two-box front capture.','No F0X or new Fork assumed.','No Goal ghost observation simulated; stop for actual boundary.']}));
