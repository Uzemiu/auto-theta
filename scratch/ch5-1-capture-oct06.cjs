// Private read-only model. Public observed geometry only; no game API or writes.
const fs=require('fs');
const rec=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/5-1.json','utf8').replace(/^\uFEFF/,''));
const si=rec.events.findLastIndex(e=>e.observation?.frame===1871448);
if(si<0)throw Error('Required actual AAXX source not yet saved');
const o=rec.events[si].observation,t=o.level.timelines.find(t=>t.axis[0]===0),V=[[0,1],[-1,0],[0,-1],[1,0]],K=z=>z.join(','),M=(z,d)=>[z[0]+V[d][0],z[1]+V[d][1]];
const wall=new Set(t.entities.filter(e=>e.type==='SOLID'&&e.blockable).map(e=>K(e.pos)));
const floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos)));
const spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const base=new Map(t.entities.filter(e=>['PLAYER','BOX'].includes(e.type)).map(e=>[e.id,e]));
const source={time:t.time,b:t.entities.find(e=>e.type==='BOX'&&e.active).pos.slice(),p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,z:e.pos.slice(),f:e.properties.face,F:e.properties.split,g:e.properties.ghost,c:e.properties.contained}))};
if(o.level.instructions!=='AAXX'||source.p.length!==3||source.p.some(p=>p.F||p.g||p.c))throw Error('Actual AAXX resource source differs');
function step(s,a,opts={}){const planned=new Set(),np=[];
  const blocked=z=>wall.has(K(z))||!floor.has(K(z));
  for(const p of s.p){if(p.active===false){np.push({...p,z:p.z.slice()});continue;}
    if(p.c){if(!opts.transport)throw Error('Stop at first capture; cargo transport is a later actual checkpoint');np.push({...p,z:p.z.slice(),f:'WASD'.indexOf(a)});continue;}
    const d0='WASD'.indexOf(a);let d=d0,land=p.z;
    for(let j=0;j<4;j++){d=(d0+j)%4;const dest=M(p.z,d);if(blocked(dest))continue;
      if(K(dest)===K(s.b)&&blocked(M(s.b,d)))continue;
      land=dest;if(K(dest)===K(s.b))planned.add(d);break;}
    np.push({...p,z:land.slice(),f:d});}
  if(planned.size>1)throw Error('Force not in prefix domain');
  const b=planned.size?M(s.b,[...planned][0]):s.b.slice();
  for(const p of np)if(p.c)p.z=b.slice();
  if(new Set(np.filter(p=>p.active!==false).map(p=>K(p.z))).size!==np.filter(p=>p.active!==false).length)throw Error('Actor contact/merge not in prefix domain');
  let captured=null;
  for(const p of np){if(p.c){p.z=b.slice();continue;}if(K(p.z)===K(b)){p.c=1;p.g=Number(spike.has(K(p.z)));captured=p.id;}
    else if(spike.has(K(p.z))){if(!opts.allowBareDeath)throw Error('Bare SPIKE death before boundary');p.g=1;p.active=false;}}
  return {time:s.time+1,b,p:np,captured};
}
const describe=s=>({time:s.time,players:s.p.map(p=>({id:p.id,pos:p.z,face:p.f,Fork:p.F,ghost:p.g,contained:p.c})),box:s.b,
  entityPredictions:s.p.map(p=>{const e=base.get(p.id);return {...e,pos:p.z,face:V[p.f],active:p.active!==false,properties:{...e.properties,face:p.f,ghost:p.g,contained:p.c,container:p.c?41:-1}};}).concat([{...base.get(41),pos:s.b}]),scope:'MODEL full dictionaries retain public AAXX static fields; actual capture ghost/GMID/branch must be checked'});
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const target=s=>{if(K(s.b)!=='4,6'||!s.p.some(p=>K(p.z)==='5,6')||!s.p.some(p=>K(p.z)==='3,5')||s.p.some(p=>p.c))return false;
  try{const n=step(s,'W');return n.captured!==null&&K(n.b)==='3,6'&&n.p.filter(p=>!p.c).length===2;}catch(e){return false;}};
const heur=s=>md(s.b,[4,6])*5+Math.min(...s.p.flatMap((a,i)=>s.p.flatMap((b,j)=>i===j?[]:[md(a.z,[5,6])+md(b.z,[3,5])])));
const canonical=s=>JSON.stringify({b:s.b,p:s.p.map(p=>[...p.z,p.c,p.g]).sort()});
const q=[{s:source,parent:-1,a:'',g:0,f:heur(source)*3}],heap=[],seen=new Set([canonical(source)]);
function put(i){let k=heap.length;heap.push(i);while(k){const j=(k-1)>>1;if(q[heap[j]].f<=q[i].f)break;heap[k]=heap[j];k=j;}heap[k]=i;}
function pop(){const out=heap[0],last=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&q[heap[j+1]].f<q[heap[j]].f)j++;if(q[heap[j]].f>=q[last].f)break;heap[k]=heap[j];k=j;}heap[k]=last;}return out;}
put(0);let expanded=0,hit=-1,unknown=0;const cap=8000;
while(heap.length&&expanded<cap){const i=pop(),s=q[i].s;expanded++;if(target(s)){hit=i;break;}
  for(const a of 'WASD'){let n;try{n=step(s,a);}catch(e){unknown++;continue;}if(n.captured!==null)continue;
    const k=canonical(n);if(seen.has(k))continue;seen.add(k);const j=q.length,g=q[i].g+1;q.push({s:n,parent:i,a,g,f:g+heur(n)*3});put(j);}
}
let candidate=null;if(hit>=0){let path='';for(let i=hit;q[i].parent>=0;i=q[i].parent)path=q[i].a+path;
  let s=source;const trace=[];for(const a of path){s=step(s,a);trace.push({action:a,...describe(s)});}
  const after=step(s,'W');candidate={prefix:path,trace,preW:describe(s),terminalAction:'W',afterWModel:describe(after),captureID:after.captured,
    unknown:'M092 supports same-main-tick SPIKE+BOX arrival as active Ghost cargo, but this first C4/runtime limbo fixture still requires actual full fields. No Goal3,7 light/death branches or F0-X assumed.'};}
const publicPrefixChecks=[];
if(candidate){for(let i=si+1;i<rec.events.length;i++){const ob=rec.events[i].observation;if(!ob)continue;const ins=ob.level.instructions,n=ins.length-4;
  if(n<1||n>candidate.prefix.length||ins!=='AAXX'+candidate.prefix.slice(0,n))continue;
  const expected=candidate.trace[n-1].entityPredictions,tl=ob.level.timelines.find(t=>t.axis[0]===0),diff=[];
  for(const ex of expected){const ac=tl.entities.find(e=>e.id===ex.id);if(!ac){diff.push({id:ex.id,key:'missing'});continue;}
    for(const key of new Set([...Object.keys(ex),...Object.keys(ac)]))if(JSON.stringify(ex[key])!==JSON.stringify(ac[key]))diff.push({id:ex.id,key,expected:ex[key],actual:ac[key]});}
  publicPrefixChecks.push({event:i,frame:ob.frame,time:tl.time,fullEntityDiff:diff});
}}
let actualCapture=null,postCapture=null;
if(candidate){const ci=rec.events.findLastIndex(e=>e.observation?.frame===1998821);if(ci>=0){const co=rec.events[ci].observation,ct=co.level.timelines.find(t=>t.axis[0]===0),diff=[];
  for(const ex of candidate.afterWModel.entityPredictions){const ac=ct.entities.find(e=>e.id===ex.id);for(const k of new Set([...Object.keys(ex),...Object.keys(ac)]))if(JSON.stringify(ex[k])!==JSON.stringify(ac[k]))diff.push({id:ex.id,key:k,expected:ex[k],actual:ac[k]});}
  actualCapture={event:ci,frame:co.frame,time:ct.time,fullEntityDiff:diff};
  let ps={time:ct.time,b:ct.entities.find(e=>e.id===41).pos.slice(),p:ct.entities.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,z:e.pos.slice(),f:e.properties.face,F:e.properties.split,g:e.properties.ghost,c:e.properties.contained,active:e.active}))};
  const trace=[];for(const a of 'SAW'){ps=step(ps,a,{transport:true,allowBareDeath:true});trace.push({action:a,...describe(ps)});}
  const setupChecks=[];for(let j=0;j<2;j++){const ins='AAXX'+candidate.prefix+'W'+'SA'.slice(0,j+1),ei=rec.events.findLastIndex(e=>e.observation?.level.instructions===ins);if(ei<0)continue;
    const oo=rec.events[ei].observation,tt=oo.level.timelines.find(t=>t.axis[0]===0),dd=[];for(const ex of trace[j].entityPredictions){const ac=tt.entities.find(e=>e.id===ex.id);for(const k of new Set([...Object.keys(ex),...Object.keys(ac)]))if(JSON.stringify(ex[k])!==JSON.stringify(ac[k]))dd.push({id:ex.id,key:k,expected:ex[k],actual:ac[k]});}
    setupChecks.push({event:ei,frame:oo.frame,time:tt.time,fullEntityDiff:dd});}
  postCapture={actual29:actualCapture,setup:'SA',trace,setupChecks,terminalGoalAction:'W',goal32BeforeUnknownObservation:describe(ps),scope:'Last W physical transport/death only; C4 Ghost-on-Goal observation is not simulated or claimed.'};
}}
let actualGoal32=null,actualTailVerification=null;
const gi=rec.events.findLastIndex(e=>e.observation?.frame===2030946);
if(gi>=0){const go=rec.events[gi].observation,leaves=go.level.timelines;
  actualGoal32={event:gi,frame:go.frame,leafStates:leaves.map(lt=>({axis:lt.axis,time:lt.time,entities:lt.entities.filter(e=>['BOX','PLAYER'].includes(e.type))}))};
  const tails=leaves.map(lt=>{const path=lt.axis[0]===0?'SSSSDDDDD':'SSSSDDDDDD',expected=lt.entities.filter(e=>['PLAYER','BOX'].includes(e.type)).map(e=>JSON.parse(JSON.stringify(e))),trace=[];
    for(let j=0;j<path.length;j++){const d='WASD'.indexOf(path[j]);for(const e of expected){if(!e.active||e.type!=='PLAYER')continue;e.face=V[d];e.properties.face=d;if(!e.properties.contained){const z=M(e.pos,d);if(wall.has(K(z))||spike.has(K(z))||!floor.has(K(z)))throw Error('Unsafe actual leaf tail');e.pos=z;}}
      trace.push({time:lt.time+j+1,action:path[j],entityPredictions:JSON.parse(JSON.stringify(expected))});}
    const checks=[];for(let i=gi+1;i<rec.events.length;i++){const ob=rec.events[i].observation;if(!ob||!ob.level.instructions.startsWith(go.level.instructions))continue;
      // Current_timeline IDs are duplicated in this public fixture. T parity selects
      // the observed two leaves; unselected earlier-time projected entities are not finals.
      const suffix=ob.level.instructions.slice(go.level.instructions.length),selected=(suffix.match(/T/g)||[]).length%2;if(selected!==lt.axis[0])continue;
      const tt=ob.level.timelines.find(t=>t.axis[0]===lt.axis[0]),n=tt?tt.time-lt.time:0;if(n<1||n>path.length)continue;
      const dd=[];for(const ex of trace[n-1].entityPredictions){const ac=tt.entities.find(e=>e.id===ex.id);for(const k of new Set([...Object.keys(ex),...Object.keys(ac)]))if(JSON.stringify(ex[k])!==JSON.stringify(ac[k]))dd.push({id:ex.id,key:k,expected:ex[k],actual:ac[k]});}
      checks.push({event:i,frame:ob.frame,time:tt.time,fullEntityDiff:dd});}
    return {axis:lt.axis,path,trace,checks,final:trace.at(-1)};});
  actualTailVerification={scope:'Deterministic safe tails from actual32 leaf dictionaries, retaining actual per-leaf GMIDs; no new search or invented birth branch',tails};
}
const completionEvidence=rec.completion_receipt?{event:rec.completion_receipt.source_event,receipt:rec.completion_receipt.receipt,instructions:rec.completion_receipt.instructions,actionCount:rec.run?.action_count,
  exactCandidate:'AAXX'+candidate.prefix+'W'+'SAW'+'SSSSDDDDD'+'T'+'SSSSDDDDDD'===rec.completion_receipt.instructions,fullCompletedStateCaptured:rec.run?.full_completed_state_captured,autoWorldReturnFrame:rec.auto_world_return?.frame,
  scope:'Actual completion receipt and normal auto world return; no full completed entity observation invented.'}:null;
console.log(JSON.stringify({sourceEvent:si,sourceFrame:o.frame,sourceInstructions:o.level.instructions,source:describe(source),budget:cap,expanded,seen:seen.size,pending:heap.length,unknownCuts:unknown,candidate,publicPrefixChecks,actualCapture,postCapture,actualGoal32,actualTailVerification,completionEvidence,
  domain:'One C4, three F0 free alive; ordinary fallback, no prior bare death/contact/force/capture. Root-corrected pre4,6/pusher5,6/receiver3,5 is the target.',limits:['Actual Goal3,7 observation not assumed.','Capture flags are conditional until actual singleW.','No fresh AAXX simulation, no F0X, no game inputs or file outputs.']}));
