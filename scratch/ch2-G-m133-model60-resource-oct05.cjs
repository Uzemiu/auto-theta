// One different MODEL60 root; calibrated M131 source-aware ordinary domain.
// No game calls. This is a finite calculation window, not a no-solution claim.
const fs=require('fs'),v8=require('v8'),checkpointIO=require('./ch2-G-checkpoint-io-oct05.cjs'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,'')),o=j.events[74].observation;
const m=createModel(o),deploy=m.replay('WDSAWWDWAA');
if(!deploy.valid||deploy.states.length!==1)throw Error('MODEL60 public fixed deployment mismatch');
const source=deploy.states[0].state,initialWindow=20000;let depthLimit=45;
const terrain=new Map(o.level.timelines[0].tiles.map(e=>[e.pos.join(','),e.type]));
for(const e of o.level.timelines[0].entities)if(e.floor&&!terrain.has(e.pos.join(',')))terrain.set(e.pos.join(','),e.type);
const walls=new Set(o.level.timelines[0].entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>e.pos.join(','))),V=[[0,1],[-1,0],[0,-1],[1,0]],K=e=>e.x+','+e.y;
let q=[{s:source,parent:-1,a:'',depth:0}],seen=new Set(),heap=[],done=new Set(),anonymousKeys=false,faceKeys=false;
const checkpointPath='artifacts/solver-frontiers/m131-model60-current.v8';
let migration=null,previousMigration=null,priorityLeft=3,targetPolicy='one-leaf-two-left-or-four-leaves',hitHistory=[],completedParentRemainders=0;
let capacitySweep=null,policyHistory=[];
// Stable inactive positions do not affect this ordinary no-capture domain;
// IDs of active players and all boxes are retained. Right105 is isolated and
// can be assigned a goal later, so its phase is fixed-replayed, not graph-keyed.
function actorCanMove(s,p){
 const boxes=new Map(s.b.map(b=>[K(b),b]));
 for(let d=0;d<4;d++){let z=[p.x+V[d][0],p.y+V[d][1]],vis=new Set();while(boxes.has(z.join(','))){if(vis.has(z.join(',')))break;vis.add(z.join(','));z=[z[0]+V[d][0],z[1]+V[d][1]];}if(!walls.has(z.join(','))&&terrain.has(z.join(','))&&!boxes.has(z.join(',')))return true;}
 return false;
}
const serial=s=>s.p.filter(p=>p.active&&p.id!==105).map(p=>[p.id,p.x,p.y,faceKeys&&actorCanMove(s,p)?'*':p.face].join(',')).sort().join('|')+'#'+(anonymousKeys?s.b.map(b=>[b.x,b.y].join(',')).sort():s.b.map(b=>[b.id,b.x,b.y].join(','))).join('|');
function forceDistance(s){
 const ps=s.p.filter(p=>p.active&&p.id!==105),boxes=new Map(s.b.map((b,i)=>[K(b),i]));let best=30;
 const blocked=z=>walls.has(z.join(','))||!terrain.has(z.join(','));
 function can(p,d){let z=[p[0]+V[d][0],p[1]+V[d][1]],vis=new Set();while(boxes.has(z.join(','))){if(vis.has(z.join(',')))return false;vis.add(z.join(','));z=[z[0]+V[d][0],z[1]+V[d][1]];}return !blocked(z);}
 for(const b of s.b){
  const contact=[];
  for(let d=0;d<4;d++){const p=[b.x-V[d][0],b.y-V[d][1]],k=p.join(',');if(blocked(p)||terrain.get(k)==='SPIKE'||boxes.has(k))continue;if(can(p,d))contact.push({p,d});}
  for(let a=0;a<4;a++){
   const valid=contact.filter(c=>{let d=a,n=0;while(n<4&&!can(c.p,d)){d=(d+1)%4;n++;}return n<4&&d===c.d;});
   for(let i=0;i<valid.length;i++)for(let h=i+1;h<valid.length;h++)if(valid[i].d!==valid[h].d){
    for(const p of ps)for(const r of ps)if(p.id!==r.id){const dist=Math.abs(p.x-valid[i].p[0])+Math.abs(p.y-valid[i].p[1])+Math.abs(r.x-valid[h].p[0])+Math.abs(r.y-valid[h].p[1]);best=Math.min(best,dist+(terrain.get(K(b))==='SPIKE'?5:0));}
   }
  }
 }
 return best;
}
const score=(s,depth)=>depth+1.2*forceDistance(s)+priorityLeft*(4-m.left(s));
function frontierDiagnostic(){
 const byFunctionalLeft={};
 for(const n of heap){const node=q[n],left=m.left(node.s),row=byFunctionalLeft[left]||(byFunctionalLeft[left]={pending:0,minDepth:Infinity,minScore:Infinity,maxDepth:0,scoreDepth:null});row.pending++;row.minDepth=Math.min(row.minDepth,node.depth);row.maxDepth=Math.max(row.maxDepth,node.depth);if(node.score<row.minScore){row.minScore=node.score;row.scoreDepth=node.depth;}}
 return {expanded,seen:seen.size,pending:heap.length,priorityLeft,byFunctionalLeft};
}
function reprioritize(value){
 if(!Number.isFinite(value)||value<0)throw Error('invalid resource sorting penalty');
 const before=frontierDiagnostic(),oldPriority=priorityLeft,pending=heap.slice();priorityLeft=value;
 // Preserve the existing forceDistance/depth part; only ordering changes.
 for(const n of pending)q[n].score+=(priorityLeft-oldPriority)*(4-m.left(q[n].s));
 heap=[];for(const n of pending)push(n);
 return {before,after:frontierDiagnostic(),retainedConcreteNodes:q.length,retainedDone:done.size,depthDeferred:depthDeferred.length};
}
function push(n){heap.push(n);let i=heap.length-1;while(i){const k=(i-1)>>1;if(q[heap[k]].score<=q[heap[i]].score)break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}
function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(true){let k=i,l=i*2+1,r=l+1;if(l<heap.length&&q[heap[l]].score<q[heap[k]].score)k=l;if(r<heap.length&&q[heap[r]].score<q[heap[k]].score)k=r;if(k===i)break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}return n;}
function path(n){let p='';while(n>0){p=q[n].a+p;n=q[n].parent;}return p;}
function sufficientFirstForce(r,counts){
 if(!r.leaves.every(l=>l.state.p.find(p=>p.id===105)?.active))return false;
 if(targetPolicy==='leaf-resource-upper-bound-four')return r.leaves.length>=4||counts.every(c=>c>=2)||counts.reduce((sum,c)=>sum+Math.max(1,c),0)>=4;
 return r.leaves.length>=4||(targetPolicy==='all-leaves-two-left-or-four-leaves'?counts.every(c=>c>=2):counts.some(c=>c>=2));
}
function archiveCurrentActualProof(event){
 if(!hit||hit.parentIndex===undefined)throw Error('Proof archive requires explicit hit parent');
 const observation=j.events[event]?.observation;if(!observation?.level?.timelines)throw Error('Public proof observation absent');
 const n=hit.parentIndex,raw=hit.sequence,chain=[],canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)});let state=source;
 if(!done.has(n)||path(n)!==raw.slice(0,-1)||canon(q[0].s)!==canon(source))throw Error('Proof archive parent/source differs');
 for(let k=n;k>=0;k=q[k].parent)chain.push(k);chain.reverse();
 for(let i=1;i<chain.length;i++){const node=q[chain[i]],r=m.step(state,m.A.indexOf(node.a));if(!r.valid||r.forces.length||r.leaves.length!==1)throw Error('Proof ancestor transition differs at '+i);state=r.leaves[0].state;if(canon(state)!==canon(node.s))throw Error('Proof concrete ancestor differs at '+i);}
 const final=m.step(state,m.A.indexOf(raw.at(-1))),leafFields=final.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}));
 if(!final.valid||JSON.stringify(m.describe(state))!==JSON.stringify(hit.pre)||JSON.stringify(final.forces)!==JSON.stringify(hit.forces)||JSON.stringify(leafFields)!==JSON.stringify(hit.leaves))throw Error('Proof terminal stored fields differ');
 const compare=require('./ch2-G-m133-actual80-calibration-oct05.cjs').compare,used=new Set(),proof=[];
 for(const leaf of final.leaves){const matches=observation.level.timelines.filter(t=>compare(leaf.state,t).length===0);if(matches.length!==1)throw Error('Actual candidate public property leaf does not match uniquely');const t=matches[0],axisKey=JSON.stringify(t.axis);if(used.has(axisKey))throw Error('Actual candidate axis already matched');used.add(axisKey);proof.push({choices:leaf.choices,axis:t.axis,time:t.time});}
 if(!hit.policyRecovered&&(heap.includes(n)||q[n].resumeFromAction!==undefined))throw Error('Proof parent remainder already queued');
 const nextAction=hit.nextUnexpandedAction??m.A.indexOf(raw.at(-1))+1,before={expanded,seen:seen.size,pending:heap.length,history:hitHistory.length};
 hitHistory.push({expanded,seen:seen.size,pending:heap.length,policy:targetPolicy,parentIndex:n,actualProof:{event,frame:observation.frame,leaves:proof,scope:'all modeled public PLAYER/activeBOX property keys, positions and active; static/animation/GMID audited separately by owner/root'},hit});hit=null;
 if(nextAction<4&&!hitHistory.at(-1).hit.policyRecovered){q[n].resumeFromAction=nextAction;push(n);}
 saveCheckpoint();return {before,after:{expanded,seen:seen.size,pending:heap.length,history:hitHistory.length},parentIndex:n,concreteAncestors:chain.length-1,remainingActions:m.A.slice(nextAction),proof};
}
function initCapacityPolicySweep(){
 if(capacitySweep)return;
 if(hit)throw Error('Archive current actual hit before policy sweep; no implicit candidate discard');
 const oldPolicy=targetPolicy;targetPolicy='leaf-resource-upper-bound-four';
 policyHistory.push({from:oldPolicy,to:targetPolicy,expanded,seen:seen.size,pending:heap.length,scope:'sum(max(1,left))>=4 is a resource upper-bound heuristic, never reachability/completion proof; all2 and four-leaf candidates retained'});
 // Existing partially expanded hit parents are scanned only through their
 // historical actions. The remainder stays on the same ordinary heap.
 capacitySweep={status:'running',indices:[...done],cursor:0,checkedActions:0,forceEdges:0,qualified:0,knownActualLayouts:0,invalid:0,oldHistory:{expanded,seen:seen.size,pending:heap.length,forcesSeen,targetPolicy:oldPolicy},examples:[]};
}
function capacityPolicySweepWindow(target){
 initCapacityPolicySweep();
 const leafKey=leaves=>JSON.stringify(leaves.map(l=>({choices:l.choices,left:l.left,state:l.state})).sort((a,b)=>JSON.stringify(a.choices).localeCompare(JSON.stringify(b.choices))));
 const known=new Set(hitHistory.filter(h=>h.actualProof||h.duplicateOf).map(h=>leafKey(h.hit.leaves)));
 while((capacitySweep.resumeParent||capacitySweep.cursor<capacitySweep.indices.length)&&capacitySweep.cursor<target&&!hit){
  const resumed=capacitySweep.resumeParent,n=resumed?resumed.n:capacitySweep.indices[capacitySweep.cursor++];delete capacitySweep.resumeParent;
  const node=q[n];if(node.depth>=depthLimit)continue;
  const historicalActionLimit=resumed?.limit??node.resumeFromAction??4,startAction=resumed?.nextAction??0;
  for(let a=startAction;a<historicalActionLimit;a++){
   capacitySweep.checkedActions++;const r=m.step(node.s,a);if(!r.valid){capacitySweep.invalid++;continue;}if(!r.forces.length)continue;
   capacitySweep.forceEdges++;const counts=r.leaves.map(l=>m.left(l.state));if(!sufficientFirstForce(r,counts))continue;
   capacitySweep.qualified++;const leaves=r.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}));
   if(known.has(leafKey(leaves))){capacitySweep.knownActualLayouts++;continue;}
   const sequence=path(n)+m.A[a];hit={sequence,parentIndex:n,nextUnexpandedAction:a+1,pre:m.describe(node.s),forces:r.forces,leaves,policyRecovered:true,resourceUpperBound:counts.reduce((sum,c)=>sum+Math.max(1,c),0)};
   if(a+1<historicalActionLimit)capacitySweep.resumeParent={n,nextAction:a+1,limit:historicalActionLimit};
   capacitySweep.examples.push({parentIndex:n,a:m.A[a],sequence,left:counts,resourceUpperBound:hit.resourceUpperBound});break;
  }
 }
 if(capacitySweep.cursor===capacitySweep.indices.length&&!capacitySweep.resumeParent)capacitySweep.status='complete';
 return {status:capacitySweep.status,cursor:capacitySweep.cursor,total:capacitySweep.indices.length,checkedActions:capacitySweep.checkedActions,forceEdges:capacitySweep.forceEdges,qualified:capacitySweep.qualified,knownActualLayouts:capacitySweep.knownActualLayouts,invalid:capacitySweep.invalid,expanded,seen:seen.size,pending:heap.length,hit};
}
function upgradeTarget(){
 const before={expanded,seen:seen.size,pending:heap.length,hit,policy:targetPolicy};
 targetPolicy='all-leaves-two-left-or-four-leaves';
 if(hit){
  const n=[...done].at(-1),nextAction=m.A.indexOf(hit.sequence.at(-1))+1;
  if(path(n)!==hit.sequence.slice(0,-1))throw Error('Hit parent identity mismatch; refuse frontier upgrade');
  hitHistory.push({expanded,seen:seen.size,pending:heap.length,policy:before.policy,hit});hit=null;
  if(nextAction<4){q[n].resumeFromAction=nextAction;push(n);}
 }
 saveCheckpoint();return {before,after:{expanded,seen:seen.size,pending:heap.length,policy:targetPolicy,historicalHits:hitHistory.length,completedParentRemainders},retainedConcreteNodes:q.length,retainedDone:done.size};
}
function continueActualStrong98(){
 const expected='DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW',n=2266949;
 if(!hit||hit.sequence!==expected||hit.sequence.length!==38||targetPolicy!=='all-leaves-two-left-or-four-leaves')throw Error('Refuse continuation: actual98 retained raw hit/policy differs');
 if(!q[n]||q[n].depth!==37||!done.has(n)||path(n)!==expected.slice(0,-1))throw Error('Refuse continuation: exact actual98 parent differs');
 const canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)}),chain=[];
 for(let k=n;k>=0;k=q[k].parent)chain.push(k);chain.reverse();let state=source;
 if(canon(state)!==canon(q[0].s))throw Error('Retained source60 differs');
 for(let i=1;i<chain.length;i++){
  const node=q[chain[i]],r=m.step(state,m.A.indexOf(node.a));
  if(!r.valid||r.leaves.length!==1||r.forces.length)throw Error('Actual98 ancestor transition differs at '+i);
  state=r.leaves[0].state;if(canon(state)!==canon(node.s))throw Error('Actual98 concrete ancestor differs at '+i);
 }
 const last=m.step(state,0),modeled={pre:m.describe(state),forces:last.forces,leaves:last.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)}))};
 if(!last.valid||last.leaves.length!==2||JSON.stringify(modeled.pre)!==JSON.stringify(hit.pre)||JSON.stringify(modeled.forces)!==JSON.stringify(hit.forces)||JSON.stringify(modeled.leaves)!==JSON.stringify(hit.leaves))throw Error('Retained actual98 terminal modeled fields differ');
 if(heap.includes(n)||q[n].resumeFromAction!==undefined)throw Error('Hit parent remainder already queued');
 const before={expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders};
 hitHistory.push({expanded,seen:seen.size,pending:heap.length,policy:targetPolicy,parentIndex:n,actualProof:{event:459,frame:19330256,time:160,axisWinners:[106,109],complete:false},hit});
 hit=null;q[n].resumeFromAction=1;push(n);
 const result={before,after:{expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders},parentIndex:n,verifiedConcreteAncestors:chain.length-1,raw:expected,remainingActions:m.A.slice(1),physics:'original conservative M133 retained; finite derived chain/cross clone not silently injected into giant frontier'};
 saveCheckpoint();return result;
}
function archiveDuplicateActual98(){
 if(!hit)return false;
 const known=hitHistory.find(r=>r.hit?.sequence==='DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW'&&r.actualProof?.event===459);
 if(!known)throw Error('Duplicate classification requires retained ACTUAL98 proof');
 const leafKey=leaves=>JSON.stringify(leaves.map(l=>({choices:[...l.choices],left:l.left,state:{p:[...l.state.p].sort((a,b)=>a.id-b.id),b:[...l.state.b].sort((a,b)=>a.id-b.id)}})).sort((a,b)=>JSON.stringify(a.choices).localeCompare(JSON.stringify(b.choices))));
 if(leafKey(hit.leaves)!==leafKey(known.hit.leaves))return false;
 const raw=hit.sequence,chain=[];
 // A resumed already-done parent is not the final insertion of done. Older
 // hits lacked an explicit parent; recover only an exact retained prefix.
 const historicalParent=hitHistory.find(r=>r.parentIndex!==undefined&&r.hit?.sequence.slice(0,-1)===raw.slice(0,-1)&&path(r.parentIndex)===raw.slice(0,-1))?.parentIndex;
 const n=hit.parentIndex??historicalParent??[...done].at(-1);
 if(!q[n]||!done.has(n)||path(n)!==raw.slice(0,-1))throw Error('Repeated fixture parent/path identity differs');
 const canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)});let state=source;
 for(let k=n;k>=0;k=q[k].parent)chain.push(k);chain.reverse();
 if(canon(q[0].s)!==canon(source))throw Error('Repeated fixture source differs');
 for(let i=1;i<chain.length;i++){const node=q[chain[i]],r=m.step(state,m.A.indexOf(node.a));if(!r.valid||r.leaves.length!==1||r.forces.length)throw Error('Repeated ancestor transition differs at '+i);state=r.leaves[0].state;if(canon(state)!==canon(node.s))throw Error('Repeated concrete ancestor differs at '+i);}
 const last=m.step(state,m.A.indexOf(raw.at(-1))),final=last.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)}));
 if(!last.valid||JSON.stringify(m.describe(state))!==JSON.stringify(hit.pre)||JSON.stringify(last.forces)!==JSON.stringify(hit.forces)||leafKey(final)!==leafKey(hit.leaves))throw Error('Repeated fixture terminal replay differs');
 const nextAction=m.A.indexOf(raw.at(-1))+1,before={expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders};
 if(heap.includes(n)||q[n].resumeFromAction!==undefined)throw Error('Repeated fixture remainder already queued');
 hitHistory.push({expanded,seen:seen.size,pending:heap.length,policy:targetPolicy,parentIndex:n,duplicateOf:{actualEvent:459,sequence:known.hit.sequence},audit:{concreteAncestors:chain.length-1,fullLeafFieldsSame:true},hit});hit=null;
 if(nextAction<4){q[n].resumeFromAction=nextAction;push(n);}
 const result={raw,parentIndex:n,concreteAncestors:chain.length-1,remainingActions:m.A.slice(nextAction),before,after:{expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders},fullLeafFieldsSame:true};
 saveCheckpoint();console.log(JSON.stringify({repeatedActual98Archived:result}));return true;
}
function archiveDuplicateKnownActual(){
 if(!hit)return false;
 const leafKey=leaves=>JSON.stringify(leaves.map(l=>({choices:[...l.choices],left:l.left,state:{p:[...l.state.p].sort((a,b)=>a.id-b.id),b:[...l.state.b].sort((a,b)=>a.id-b.id)}})).sort((a,b)=>JSON.stringify(a.choices).localeCompare(JSON.stringify(b.choices))));
 const known=hitHistory.find(h=>h.actualProof&&leafKey(h.hit.leaves)===leafKey(hit.leaves));if(!known)return false;
 const raw=hit.sequence,n=hit.parentIndex,canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)}),chain=[];
 if(n===undefined||!done.has(n)||path(n)!==raw.slice(0,-1)||canon(q[0].s)!==canon(source))throw Error('Known-layout duplicate exact parent/source differs');
 for(let k=n;k>=0;k=q[k].parent)chain.push(k);chain.reverse();let state=source;
 for(let i=1;i<chain.length;i++){const node=q[chain[i]],r=m.step(state,m.A.indexOf(node.a));if(!r.valid||r.forces.length||r.leaves.length!==1)throw Error('Known-layout duplicate ancestor transition differs at '+i);state=r.leaves[0].state;if(canon(state)!==canon(node.s))throw Error('Known-layout duplicate concrete ancestor differs at '+i);}
 const final=m.step(state,m.A.indexOf(raw.at(-1))),leaves=final.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}));
 if(!final.valid||JSON.stringify(m.describe(state))!==JSON.stringify(hit.pre)||JSON.stringify(final.forces)!==JSON.stringify(hit.forces)||leafKey(leaves)!==leafKey(hit.leaves)||leafKey(leaves)!==leafKey(known.hit.leaves))throw Error('Known-layout duplicate full terminal differs');
 const nAction=hit.nextUnexpandedAction??m.A.indexOf(raw.at(-1))+1,before={expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders};
 if(!hit.policyRecovered&&(heap.includes(n)||q[n].resumeFromAction!==undefined))throw Error('Known-layout duplicate parent already queued');
 hitHistory.push({expanded,seen:seen.size,pending:heap.length,policy:targetPolicy,parentIndex:n,duplicateOf:{actualEvent:known.actualProof.event,sequence:known.hit.sequence},audit:{concreteAncestors:chain.length-1,fullLeafFieldsSame:true,scope:'same concrete PLAYER/BOX modeled fields and choices; not actual execution of duplicate path'},hit});const policyRecovered=hit.policyRecovered;hit=null;
 if(nAction<4&&!policyRecovered){q[n].resumeFromAction=nAction;push(n);}
 saveCheckpoint();console.log(JSON.stringify({knownActualDuplicateArchived:{raw,parentIndex:n,concreteAncestors:chain.length-1,actualEvent:known.actualProof.event,remainingActions:policyRecovered?'already historical':m.A.slice(nAction),before,after:{expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders},fullLeafFieldsSame:true}}));return true;
}
let sealedOrdinaryComponents=null;
function archiveCoveredOrdinaryComponent(){
 if(!hit||hit.parentIndex===undefined||hit.leaves.length!==2||!hit.leaves.every(l=>l.left===2))return false;
 if(!sealedOrdinaryComponents){
  const filenames=['artifacts/solver-frontiers/ch2-G-strong38-second-forces-oct05.v8','artifacts/solver-frontiers/ch2-G-strong42-second-forces-oct05.v8'];
  sealedOrdinaryComponents=filenames.map(file=>({file,z:v8.deserialize(fs.readFileSync(file))}));
  if(sealedOrdinaryComponents.some(({z})=>z.engine!=='m133-a-wall-w-cross-finite'||z.groups.some(g=>g.heap.length||g.depthDeferred.length||g.hit)))throw Error('Component comparison requires retained finite closed domains');
 }
 const key=require('./ch2-G-strong42-second-forces-oct05.cjs').key,finite=require('./ch2-G-m133-wallstopped-a-moving-w-model-oct05.cjs').createModel(o);
 const covered=(s,choice)=>{const k=key(s);for(const {file,z}of sealedOrdinaryComponents){const g=z.groups.find(g=>g.choice===choice);if(g?.seen.has(k))return {file,choice,key:k};}return null;};
 const n=hit.parentIndex,raw=hit.sequence,canon=s=>JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)}),chain=[];
 if(!done.has(n)||path(n)!==raw.slice(0,-1)||canon(q[0].s)!==canon(source))throw Error('Covered component exact parent/source differs');
 for(let k=n;k>=0;k=q[k].parent)chain.push(k);chain.reverse();let state=source;
 for(let i=1;i<chain.length;i++){const node=q[chain[i]],r=m.step(state,m.A.indexOf(node.a));if(!r.valid||r.forces.length||r.leaves.length!==1)throw Error('Covered component ancestor transition differs at '+i);state=r.leaves[0].state;if(canon(state)!==canon(node.s))throw Error('Covered component concrete ancestor differs at '+i);}
 const final=m.step(state,m.A.indexOf(raw.at(-1))),leaves=final.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}));
 if(!final.valid||JSON.stringify(m.describe(state))!==JSON.stringify(hit.pre)||JSON.stringify(final.forces)!==JSON.stringify(hit.forces)||JSON.stringify(leaves)!==JSON.stringify(hit.leaves))throw Error('Covered component full terminal differs');
 const proofs=[];
 for(const leaf of final.leaves){
  const choice=leaf.choices[0],direct=covered(leaf.state,choice);if(direct){proofs.push({choice,direct});continue;}
  const actions=[];
  for(let a=0;a<4;a++){const r=finite.step(leaf.state,a);if(!r.valid||r.forces.length||r.leaves.length!==1||!r.leaves[0].state.p.find(p=>p.id===105)?.active)return false;const child=r.leaves[0].state,left=finite.left(child),component=left>=2?covered(child,choice):null;if(left>=2&&!component)return false;actions.push({a:m.A[a],left,component,final:finite.describe(child)});}
  proofs.push({choice,oneStepBridge:actions});
 }
 const before={expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders},nextAction=hit.nextUnexpandedAction??m.A.indexOf(raw.at(-1))+1;
 if(!hit.policyRecovered&&(heap.includes(n)||q[n].resumeFromAction!==undefined))throw Error('Covered component parent already queued');
 const policyRecovered=hit.policyRecovered;
 hitHistory.push({expanded,seen:seen.size,pending:heap.length,policy:targetPolicy,parentIndex:n,ordinaryModelComponentCoveredBy:{engine:'m133-a-wall-w-cross-finite',proofs,scope:'finite ordinary/noCargo/noX/noDARK resource component only; not full concrete ACTUAL duplicate or global BOX/ghost/Goal equivalence; unknown capture/stack preserved'},audit:{concreteAncestors:chain.length-1,fullStoredTerminalSame:true},hit});hit=null;
 if(nextAction<4&&!policyRecovered){q[n].resumeFromAction=nextAction;push(n);}
 saveCheckpoint();console.log(JSON.stringify({ordinaryModelComponentArchived:{raw,parentIndex:n,concreteAncestors:chain.length-1,remainingActions:policyRecovered?'already historical':m.A.slice(nextAction),before,after:{expanded,seen:seen.size,pending:heap.length,q:q.length,done:done.size,history:hitHistory.length,completedParentRemainders},proofs,notActualDuplicate:true}}));return true;
}
function successorWindow(target){
 const skipKnown=process.argv.includes('--skip-known-actual'),skip98=process.argv.includes('--skip-repeat-actual98'),skipComponent=process.argv.includes('--skip-covered-ordinary');
 const archive=()=>((skipKnown&&archiveDuplicateKnownActual())||(skip98&&archiveDuplicateActual98())||(skipComponent&&archiveCoveredOrdinaryComponent()));
 while(hit&&archive()){}
 while(!hit&&heap.length&&expanded<target){runTo(target);if(!hit||!archive())break;}
 return snapshot();
}
q[0].score=score(source,0);seen.add(serial(source));push(0);
let expanded=0,depthCut=0,lost=0,hit=null,maxLeaves=1,forcesSeen=0,maxDepth=0;
let depthDeferred=[];
let boundaryCounts={},boundaries={},firstForces=[];
function runTo(target){
while(heap.length&&expanded<target&&!hit){
 const n=pop(),node=q[n],startAction=node.resumeFromAction??0,resumed=node.resumeFromAction!==undefined;delete node.resumeFromAction;if(resumed)completedParentRemainders++;else{expanded++;done.add(n);}maxDepth=Math.max(maxDepth,node.depth);if(node.depth>=depthLimit){depthCut++;depthDeferred.push(n);continue;}
 for(let a=startAction;a<4;a++){
  const sequence=path(n)+m.A[a],r=m.step(node.s,a);
  if(!r.valid){for(const b of r.boundaries){const raw=boundaryKey(b),key=raw+((raw.startsWith('perpendicular')||raw.startsWith('m133-')||raw==='new-capture')?(m.left(node.s)>=3?'/preLeftAtLeast3':'/preLeft2'):'');boundaryCounts[key]=(boundaryCounts[key]||0)+1;const candidate={sequence,pre:m.describe(node.s),result:b,leftBefore:m.left(node.s)};if(!boundaries[key]||sequence.length<boundaries[key].sequence.length)boundaries[key]=candidate;}continue;}
  maxLeaves=Math.max(maxLeaves,r.leaves.length);
  if(r.forces.length){
   forcesSeen++;const counts=r.leaves.map(z=>m.left(z.state));if(firstForces.length<12)firstForces.push({sequence,forces:r.forces,leafCount:r.leaves.length,left:counts});
   if(sufficientFirstForce(r,counts)){hit={sequence,parentIndex:n,nextUnexpandedAction:a+1,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)}))};break;}
   continue;
  }
  const s=r.leaves[0].state;if(m.left(s)<2){lost++;continue;}
  const key=serial(s);if(seen.has(key))continue;seen.add(key);const depth=node.depth+1;q.push({s,parent:n,a:m.A[a],depth,score:score(s,depth)});push(q.length-1);
 }
 if(hit)break;
 if(process.argv.includes('--live')&&expanded%20000===0){saveCheckpoint();console.log(JSON.stringify(compact()));}
}
return snapshot();
}
function snapshot(){return {source:'actual60 event131/time81; exact original50 event74 + WDSAWWDWAA',migration:migration?{...migration,indices:undefined}:null,capacitySweep:capacitySweep?{...capacitySweep,indices:undefined}:null,policyHistory,sourceState:m.describe(source),initialWindow,depthLimit,priorityLeft,targetPolicy,historicalHits:hitHistory.length,completedParentRemainders,expanded,seen:seen.size,pending:heap.length,depthCut,depthDeferred:depthDeferred.length,maxDepth,exhausted:!hit&&!heap.length&&!depthDeferred.length,lost,maxLeaves,forcesSeen,anonymousKeys,faceKeys,boundaryCounts,firstForces,hit,boundaries};}
function compact(){const r=snapshot();delete r.sourceState;delete r.boundaries;delete r.firstForces;if(r.migration){const z=r.migration;r.migration={stage:z.stage,status:z.status,cursor:z.cursor,checkedActions:z.checkedActions,eligible:z.eligible,added:z.added,lost:z.lost,newValid:z.newValid,newBoundary:z.newBoundary,newBoundaryCounts:z.newBoundaryCounts,oldHistory:{expanded:z.oldHistory.expanded,seen:z.oldHistory.seen,pending:z.oldHistory.pending,boundaryCounts:z.oldHistory.boundaryCounts},previousMigrationScope:z.previousMigrationScope?{cursor:z.previousMigrationScope.cursor,eligible:z.previousMigrationScope.eligible,added:z.previousMigrationScope.added}:null};}return r;}
let lastCheckpointSavedAt=0;
function saveCheckpoint(){checkpointIO.save(checkpointPath,{version:6,priorityLeft,targetPolicy,hitHistory,completedParentRemainders,migration,capacitySweep,policyHistory,q,seen,heap,done,depthDeferred,depthLimit,expanded,depthCut,lost,hit,maxLeaves,forcesSeen,maxDepth,boundaryCounts,boundaries,firstForces,anonymousKeys,faceKeys,stats:m.stats});lastCheckpointSavedAt=Date.now();}
function loadCheckpoint(){
 if(!fs.existsSync(checkpointPath))return false;
 const z=checkpointIO.load(checkpointPath);if(![4,5,6].includes(z.version))throw Error('checkpoint version');
 if(z.version>=5)migration=z.migration;else previousMigration=z.migration;
 capacitySweep=z.capacitySweep??null;policyHistory=z.policyHistory??[];
 ({q,seen,heap,done,depthDeferred,depthLimit,expanded,depthCut,lost,hit,maxLeaves,forcesSeen,maxDepth,boundaryCounts,boundaries,firstForces,anonymousKeys,faceKeys}=z);priorityLeft=z.priorityLeft??3;targetPolicy=z.targetPolicy??'one-leaf-two-left-or-four-leaves';hitHistory=z.hitHistory??[];completedParentRemainders=z.completedParentRemainders??0;Object.assign(m.stats,z.stats);return true;
}
function mergeFrontier(){
 const before={seen:seen.size,pending:heap.length};anonymousKeys=true;faceKeys=true;
 const doneKeys=new Set([...done].map(n=>serial(q[n].s))),choice=new Map();
 for(const n of heap){const k=serial(q[n].s);if(doneKeys.has(k))continue;const old=choice.get(k);if(old===undefined||q[n].score<q[old].score)choice.set(k,n);}
 seen=new Set(q.map(n=>serial(n.s)));heap=[];for(const n of choice.values())push(n);
 const after={seen:seen.size,pending:heap.length};saveCheckpoint();return {before,after,retainedConcreteNodes:q.length};
}

// Classification is diagnostic only; no moving-perpendicular propagation.
function boundaryKey(b){
 if(b.boundary!=='perpendicular-free-box')return b.boundary;
 const st=b.state,body=st.b.find(z=>z.id===b.box),map=new Map(st.b.map(z=>[K(z),z]));
 function canChain(d){let p=[body.x+V[d][0],body.y+V[d][1]],visited=new Set();while(map.has(p.join(','))){if(visited.has(p.join(',')))return false;visited.add(p.join(','));p=[p[0]+V[d][0],p[1]+V[d][1]];}return !walls.has(p.join(','))&&terrain.has(p.join(','));}
 const next=[body.x+V[b.boxDirection][0],body.y+V[b.boxDirection][1]],blocked=walls.has(next.join(','))||!terrain.has(next.join(','));
 return b.boundary+'/'+(blocked?'oldDirectionBlockedWallGap':canChain(b.boxDirection)?'oldDirectionCanChainMove':'oldDirectionBlockedChain')+'/'+(canChain(b.playerDirection)?'playerDirectionCanChainMove':'playerDirectionBlockedChain');
}
const oldM=require('./ch2-G-m132-blocked-source-model-oct05.cjs').createModel(o);
function initMigration(){
 if(migration)return;
 migration={stage:'M133',previousMigrationScope:previousMigration?{cursor:previousMigration.cursor,checkedActions:previousMigration.checkedActions,eligible:previousMigration.eligible,newValid:previousMigration.newValid,added:previousMigration.added,lost:previousMigration.lost,oldHistory:previousMigration.oldHistory}:null,status:'running',indices:[...done],cursor:0,checkedActions:0,eligible:0,added:0,lost:0,newValid:0,newBoundary:0,oldHistory:{expanded,seen:seen.size,pending:heap.length,boundaryCounts:{...boundaryCounts},firstForces:JSON.parse(JSON.stringify(firstForces)),maxLeaves,forcesSeen},newBoundaryCounts:{}};
}
function migrationEligible(b){return b.boundary==='perpendicular-free-box';}
function migrationWindow(target){
 initMigration();
 while(migration.cursor<migration.indices.length&&migration.cursor<target&&!hit){
  const n=migration.indices[migration.cursor++],node=q[n];
  for(let a=0;a<4;a++){
   migration.checkedActions++;
   const old=oldM.step(node.s,a);if(old.valid||!old.boundaries.some(migrationEligible))continue;
   migration.eligible++;const sequence=path(n)+m.A[a],r=m.step(node.s,a);
   if(!r.valid){migration.newBoundary++;for(const b of r.boundaries){const raw=boundaryKey(b),key=raw+((raw.startsWith('perpendicular')||raw.startsWith('m133-')||raw==='new-capture')?(m.left(node.s)>=3?'/preLeftAtLeast3':'/preLeft2'):'');migration.newBoundaryCounts[key]=(migration.newBoundaryCounts[key]||0)+1;const candidate={sequence,pre:m.describe(node.s),result:b,leftBefore:m.left(node.s),migrationFromBlocked:true};if(!boundaries[key]||sequence.length<boundaries[key].sequence.length)boundaries[key]=candidate;}continue;}
   migration.newValid++;maxLeaves=Math.max(maxLeaves,r.leaves.length);
   if(r.forces.length){forcesSeen++;const counts=r.leaves.map(z=>m.left(z.state));if(firstForces.length<12)firstForces.push({sequence,forces:r.forces,leafCount:r.leaves.length,left:counts,migrationFromBlocked:true});if(sufficientFirstForce(r,counts)){hit={sequence,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)})),migrationFromBlocked:true};break;}continue;}
   const state=r.leaves[0].state;if(m.left(state)<2){migration.lost++;continue;}
   const key=serial(state);if(seen.has(key))continue;seen.add(key);const depth=node.depth+1;q.push({s:state,parent:n,a:m.A[a],depth,score:score(state,depth)});push(q.length-1);migration.added++;
  }
 }
 if(migration.cursor===migration.indices.length)migration.status='complete';
 return {status:migration.status,cursor:migration.cursor,total:migration.indices.length,checkedActions:migration.checkedActions,eligible:migration.eligible,newValid:migration.newValid,newBoundary:migration.newBoundary,added:migration.added,lost:migration.lost,newBoundaryCounts:migration.newBoundaryCounts,expanded,seen:seen.size,pending:heap.length,hit};
}

async function main(){
 const restored=process.argv.includes('--live')&&loadCheckpoint();if(!restored)throw Error('Migration requires retained checkpoint; refusing a root rerun');if(restored)console.log(JSON.stringify({checkpointRestored:true,processId:process.pid,...compact()}));
 if(restored){initMigration();while(migration.status!=='complete'&&!hit){const result=migrationWindow(migration.cursor+20000);if(migration.cursor%100000===0||migration.status==='complete'||hit)saveCheckpoint();console.log(JSON.stringify({migrationWindow:result}));await new Promise(resolve=>setImmediate(resolve));}}
 if(expanded<initialWindow)runTo(initialWindow);console.log(JSON.stringify(compact()));
 const requestedPriority=process.argv.find(a=>a.startsWith('--priority-left='));
 if(requestedPriority){console.log(JSON.stringify({frontierReprioritized:reprioritize(Number(requestedPriority.split('=')[1]))}));saveCheckpoint();}
 if(process.argv.includes('--strong-target'))console.log(JSON.stringify({targetUpgraded:upgradeTarget()}));
 if(process.argv.includes('--continue-actual98'))console.log(JSON.stringify({actualStrong98Archived:continueActualStrong98()}));
 const proofEventFlag=process.argv.find(a=>a.startsWith('--archive-proof-event='));
 if(proofEventFlag)console.log(JSON.stringify({currentActualProofArchived:archiveCurrentActualProof(Number(proofEventFlag.split('=')[1]))}));
 if(process.argv.includes('--capacity-policy')){
  initCapacityPolicySweep();
  while(capacitySweep.status!=='complete'&&!hit){const result=capacityPolicySweepWindow(capacitySweep.cursor+20000);if(Date.now()-lastCheckpointSavedAt>=120000||capacitySweep.status==='complete'||hit)saveCheckpoint();console.log(JSON.stringify({capacityPolicyWindow:result}));await new Promise(resolve=>setImmediate(resolve));}
 }
 const requestedWindow=process.argv.find(a=>a.startsWith('--window-total='));
 if(requestedWindow){successorWindow(Number(requestedWindow.split('=')[1]));saveCheckpoint();console.log(JSON.stringify({successorWindow:compact()}));}
 if(!process.argv.includes('--live')){console.log(JSON.stringify({boundaries}));return;}
 // The former exited 20k window is reconstructed once with identical options;
 // from this point on q/seen/heap remain in this same process across windows.
 if(!hit&&heap.length&&expanded<100000){await new Promise(resolve=>setImmediate(resolve));runTo(100000);console.log(JSON.stringify(compact()));}
 saveCheckpoint();
 if(process.argv.includes('--merge-keys')&&!anonymousKeys){console.log(JSON.stringify({frontierMerge:mergeFrontier()}));}
 if(hit||!heap.length)return;
 console.log('FRONTIER_RETAINED + CHECKPOINT: CONTINUE <total expanded> | STATUS | BOUNDARIES | MERGE | SAVE | DEPTH <new limit> | STOP');
 const rl=require('readline').createInterface({input:process.stdin,output:process.stdout,terminal:false});
 for await(const line of rl){
  const [cmd,value]=line.trim().split(/\s+/);
  if(cmd==='CONTINUE'){successorWindow(Number(value));saveCheckpoint();console.log(JSON.stringify(compact()));if(hit||!heap.length){rl.close();break;}}
  else if(cmd==='STATUS')console.log(JSON.stringify(compact()));
  else if(cmd==='DIAG')console.log(JSON.stringify(frontierDiagnostic()));
  else if(cmd==='PRIORITY'){console.log(JSON.stringify({frontierReprioritized:reprioritize(Number(value))}));saveCheckpoint();}
  else if(cmd==='STRONG'){console.log(JSON.stringify({targetUpgraded:upgradeTarget()}));}
  else if(cmd==='BOUNDARIES')console.log(JSON.stringify({boundaries}));
  else if(cmd==='MERGE')console.log(JSON.stringify({frontierMerge:mergeFrontier()}));
  else if(cmd==='SAVE'){saveCheckpoint();console.log('CHECKPOINT_SAVED');}
  else if(cmd==='DEPTH'){depthLimit=Number(value);for(const n of depthDeferred.splice(0))push(n);console.log(JSON.stringify(compact()));}
  else if(cmd==='STOP'){rl.close();break;}
 }
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={runTo,snapshot,m,source,mergeFrontier,saveCheckpoint,loadCheckpoint,boundaryKey,migrationWindow,frontierDiagnostic,reprioritize,upgradeTarget,continueActualStrong98,archiveDuplicateActual98,archiveDuplicateKnownActual,archiveCoveredOrdinaryComponent,successorWindow,archiveCurrentActualProof,initCapacityPolicySweep,capacityPolicySweepWindow};
