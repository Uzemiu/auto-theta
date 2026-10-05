// Derived continuations of the two concrete strong38 leaves. Public M132
// ordinary physics only; no game/bridge/save/canonical operations.
const fs=require('fs'),v8=require('v8');
const {createModel}=require('./ch2-G-m132-blocked-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=259,o=j.events[sourceEvent].observation;
let m=createModel(o),engine='m132-conservative';
const raw38='DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW',parentIndex=2266949;
const deployed=m.replay(raw38);
if(!deployed.valid||deployed.states.length!==2)throw Error('Strong38 fixed source mismatch');
const checkpoint='artifacts/solver-frontiers/ch2-G-strong38-second-forces-oct05.v8';
const K=e=>e.x+','+e.y,V=[[0,1],[-1,0],[0,-1],[1,0]];
const t=o.level.timelines[0],terrain=new Map(t.tiles.map(e=>[e.pos.join(','),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(e.pos.join(',')))terrain.set(e.pos.join(','),e.type);
const walls=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>e.pos.join(',')));
const blocked=z=>walls.has(z.join(','))||!terrain.has(z.join(','));
function canMove(s,p,d){const boxes=new Set(s.b.map(K));let z=[p.x+V[d][0],p.y+V[d][1]],seen=new Set();while(boxes.has(z.join(','))){if(seen.has(z.join(',')))return false;seen.add(z.join(','));z=[z[0]+V[d][0],z[1]+V[d][1]];}return !blocked(z);}
function movable(s,p){return [0,1,2,3].some(d=>canMove(s,p,d));}
function key(s){
 // Preserve right105 position AND face: it controls the later Goal assignment.
 // Active left IDs are concrete; only freely moving old faces are anonymous.
 const ps=s.p.filter(p=>p.active).map(p=>[p.id,p.x,p.y,p.id===105||!movable(s,p)?p.face:'*'].join(',')).sort();
 return ps.join('|')+'#'+s.b.map(K).sort().join('|');
}
function forceDistance(s){
 const ps=s.p.filter(p=>p.active&&p.id!==105),boxes=new Set(s.b.map(K));let best=40;
 for(const b of s.b){
  const contact=[];
  for(let d=0;d<4;d++){const p={x:b.x-V[d][0],y:b.y-V[d][1]},k=K(p);if(blocked([p.x,p.y])||boxes.has(k))continue;if(canMove(s,p,d))contact.push({p,d});}
  for(let a=0;a<4;a++){
   const usable=contact.filter(c=>{let d=a,n=0;while(n<4&&!canMove(s,c.p,d)){d=(d+1)%4;n++;}return n<4&&d===c.d;});
   for(let i=0;i<usable.length;i++)for(let h=i+1;h<usable.length;h++)if(usable[i].d!==usable[h].d)
    for(const p of ps)for(const q of ps)if(p.id!==q.id)best=Math.min(best,Math.abs(p.x-usable[i].p.x)+Math.abs(p.y-usable[i].p.y)+Math.abs(q.x-usable[h].p.x)+Math.abs(q.y-usable[h].p.y));
  }
 }
 return best;
}
function push(g,n){g.heap.push(n);let i=g.heap.length-1;while(i){const k=(i-1)>>1;if(g.q[g.heap[k]].score<=g.q[g.heap[i]].score)break;[g.heap[k],g.heap[i]]=[g.heap[i],g.heap[k]];i=k;}}
function pop(g){const n=g.heap[0],last=g.heap.pop();if(g.heap.length){g.heap[0]=last;let i=0;while(true){let k=i,l=i*2+1,r=l+1;if(l<g.heap.length&&g.q[g.heap[l]].score<g.q[g.heap[k]].score)k=l;if(r<g.heap.length&&g.q[g.heap[r]].score<g.q[g.heap[k]].score)k=r;if(k===i)break;[g.heap[k],g.heap[i]]=[g.heap[i],g.heap[k]];i=k;}}return n;}
function path(g,n){let p='';for(;n>0;n=g.q[n].parent)p=g.q[n].a+p;return p;}
function canon(s){return JSON.stringify({p:[...s.p].sort((a,b)=>a.id-b.id),b:[...s.b].sort((a,b)=>a.id-b.id)});}
let groups=deployed.states.map(l=>{
 const choice=l.choices[0],source=m.clone(l.state),g={choice,provenance:{sourceEvent,sourceFrame:o.frame,raw38,parentIndex,choice},source,
  q:[{s:source,parent:-1,a:'',depth:0,score:1.2*forceDistance(source)}],heap:[],seen:new Set([key(source)]),done:new Set(),depthDeferred:[],
  depthLimit:60,expanded:0,depthCut:0,maxDepth:0,lost:0,forces:0,hit:null,boundaryCounts:{},boundaries:{}};push(g,0);return g;
});
function save(){fs.writeFileSync(checkpoint,v8.serialize({version:2,engine,raw38,parentIndex,groups}));}
function load(){if(!fs.existsSync(checkpoint))throw Error('Missing derived checkpoint');const z=v8.deserialize(fs.readFileSync(checkpoint));if(![1,2].includes(z.version)||z.raw38!==raw38||z.parentIndex!==parentIndex)throw Error('Derived provenance mismatch');groups=z.groups;engine=z.engine||'m132-conservative';if(engine==='m133-one-front-chain-finite')m=require('./ch2-G-m133-one-front-chain-model-oct05.cjs').createModel(o);if(engine==='m133-a-wall-w-cross-finite')m=require('./ch2-G-m133-wallstopped-a-moving-w-model-oct05.cjs').createModel(o);for(const g of groups)if(canon(g.source)!==canon(deployed.states.find(l=>l.choices[0]===g.choice).state))throw Error('Derived source changed');}
function migrateFiniteCross(){
 if(engine==='m133-a-wall-w-cross-finite'){console.log('FINITE_CROSS_MIGRATION_ALREADY_PRESENT');return;}
 if(engine!=='m133-one-front-chain-finite')throw Error('Cross migration requires preserved one-front derived frontier');
 const previous=m,from=engine,next=require('./ch2-G-m133-wallstopped-a-moving-w-model-oct05.cjs').createModel(o),records=[];
 m=next;engine='m133-a-wall-w-cross-finite';
 for(const g of groups){
  const before={expanded:g.expanded,seen:g.seen.size,pending:g.heap.length,q:g.q.length,done:g.done.size,lost:g.lost};
  const record={from,to:engine,before,parentsRechecked:0,valid:0,newLost:0,newNodes:0,remainingUnknown:0,edges:[]};
  for(const n of g.done)for(let a=0;a<4;a++){
   const node=g.q[n],old=previous.step(node.s,a);
   if(old.valid||!old.boundaries.some(b=>b.boundary==='unverified-player-cross'))continue;
   record.parentsRechecked++;const sequence=path(g,n)+m.A[a],r=m.step(node.s,a);
   const edge={parent:n,a:m.A[a],sequence,valid:r.valid,remaining:r.boundaries.map(b=>b.boundary)};
   if(!r.valid){record.remainingUnknown++;record.edges.push(edge);continue;}
   const audit=auditPath(g,n,sequence);if(audit.firstMismatch||!audit.fixedValid)throw Error('Finite cross migrated ancestor mismatch');
   record.valid++;edge.audit=audit;
   if(r.forces.length){
    edge.forces=r.forces;
    if(r.leaves.length>=2&&r.leaves.every(l=>l.state.p.find(p=>p.id===105)?.active))g.hit={sequence,parent:n,nextUnexpandedAction:a+1,provenance:g.provenance,audit,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}))};
    record.edges.push(edge);continue;
   }
   const state=r.leaves[0].state;edge.final=m.describe(state);edge.left=m.left(state);
   if(m.left(state)<2){g.lost++;record.newLost++;record.edges.push(edge);continue;}
   const k=key(state);if(!g.seen.has(k)){g.seen.add(k);const depth=node.depth+1;g.q.push({s:state,parent:n,a:m.A[a],depth,score:depth+1.2*forceDistance(state)});push(g,g.q.length-1);record.newNodes++;}
   record.edges.push(edge);
  }
  record.after={expanded:g.expanded,seen:g.seen.size,pending:g.heap.length,q:g.q.length,done:g.done.size,lost:g.lost};
  (g.migrationHistory||=[]).push(record);records.push({choice:g.choice,...record});
 }
 save();console.log(JSON.stringify({FINITE_CROSS_MIGRATION:records}));
}
function migrateOneFront(){
 if(engine==='m133-one-front-chain-finite'){console.log('FINITE_CHAIN_MIGRATION_ALREADY_PRESENT');return;}
 const previous=m,next=require('./ch2-G-m133-one-front-chain-model-oct05.cjs').createModel(o),records=[];
 m=next;engine='m133-one-front-chain-finite';
 for(const g of groups){
  const before={expanded:g.expanded,seen:g.seen.size,pending:g.heap.length,q:g.q.length,done:g.done.size,lost:g.lost};
  const record={from:'m132-conservative',to:engine,before,parentsRechecked:0,valid:0,newLost:0,newNodes:0,remainingUnknown:0,edges:[]};
  for(const n of g.done)for(let a=0;a<4;a++){
   const node=g.q[n],old=previous.step(node.s,a);
   if(old.valid||!old.boundaries.some(b=>b.boundary==='perpendicular-free-box'))continue;
   record.parentsRechecked++;const sequence=path(g,n)+m.A[a],r=m.step(node.s,a);
   const edge={parent:n,a:m.A[a],sequence,valid:r.valid,remaining:r.boundaries.map(b=>b.boundary)};
   if(!r.valid){record.remainingUnknown++;record.edges.push(edge);continue;}
   record.valid++;
   if(r.forces.length){
    if(r.leaves.length>=2&&r.leaves.every(l=>l.state.p.find(p=>p.id===105)?.active)){
     const audit=auditPath(g,n,sequence);if(audit.firstMismatch||!audit.fixedValid)throw Error('Migrated force ancestor mismatch');
     g.hit={sequence,parent:n,nextUnexpandedAction:a+1,provenance:g.provenance,audit,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}))};
    }
    edge.forces=r.forces;record.edges.push(edge);continue;
   }
   const state=r.leaves[0].state;edge.final=m.describe(state);edge.left=m.left(state);
   if(m.left(state)<2){g.lost++;record.newLost++;record.edges.push(edge);continue;}
   const k=key(state);if(!g.seen.has(k)){g.seen.add(k);const depth=node.depth+1;g.q.push({s:state,parent:n,a:m.A[a],depth,score:depth+1.2*forceDistance(state)});push(g,g.q.length-1);record.newNodes++;}
   record.edges.push(edge);
  }
  record.after={expanded:g.expanded,seen:g.seen.size,pending:g.heap.length,q:g.q.length,done:g.done.size,lost:g.lost};
  (g.migrationHistory||=[]).push(record);records.push({choice:g.choice,...record});
 }
 save();console.log(JSON.stringify({FINITE_CHAIN_MIGRATION:records}));
}
function auditPath(g,n,sequence){
 const chain=[];for(let k=n;k>=0;k=g.q[k].parent)chain.push(k);chain.reverse();let s=g.source,firstMismatch=null;
 if(chain.slice(1).map(k=>g.q[k].a).join('')!==sequence.slice(0,-1))throw Error('Derived parent path mismatch');
 for(let i=1;i<chain.length;i++){const nn=g.q[chain[i]],r=m.step(s,m.A.indexOf(nn.a));if(!r.valid||r.leaves.length!==1||r.forces.length){firstMismatch={step:i,reason:'transition'};break;}s=r.leaves[0].state;if(canon(s)!==canon(nn.s)){firstMismatch={step:i,reason:'concrete-state'};break;}}
 const fixed=m.replay(sequence,g.source);return {parent:n,parentDepth:g.q[n].depth,sourceMatches:canon(g.source)===canon(g.q[0].s),firstMismatch,fixedValid:fixed.valid,leafCount:fixed.states?.length,rightAlive:fixed.valid&&fixed.states.every(l=>l.state.p.find(p=>p.id===105).active)};
}
function stepWindow(g,target){
 while(g.heap.length&&!g.hit&&g.expanded<target){
  const n=pop(g),node=g.q[n];g.done.add(n);g.expanded++;g.maxDepth=Math.max(g.maxDepth,node.depth);
  if(node.depth>=g.depthLimit){g.depthCut++;g.depthDeferred.push(n);continue;}
  for(let a=0;a<4;a++){
   const sequence=path(g,n)+m.A[a],r=m.step(node.s,a);
   if(!r.valid){for(const b of r.boundaries){const k=b.boundary;g.boundaryCounts[k]=(g.boundaryCounts[k]||0)+1;if(!g.boundaries[k]||sequence.length<g.boundaries[k].sequence.length)g.boundaries[k]={sequence,leftBefore:m.left(node.s),pre:m.describe(node.s),result:b};}continue;}
   if(r.forces.length){
    g.forces++;if(r.leaves.length>=2&&r.leaves.every(l=>l.state.p.find(p=>p.id===105)?.active)){
     const audit=auditPath(g,n,sequence);if(audit.firstMismatch||!audit.fixedValid||!audit.rightAlive)throw Error('Derived force replay failed');
     g.hit={sequence,parent:n,nextUnexpandedAction:a+1,provenance:g.provenance,audit,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state)}))};
     save();console.log(JSON.stringify({SECOND_FORCE_HIT:g.hit}));break;
    }continue;
   }
   const s=r.leaves[0].state;
   // No cargo/birth/DARK propagation: fewer than two stable free sources cannot
   // create a later different-source force. Unknown captures are recorded above.
   if(m.left(s)<2){g.lost++;continue;}
   const k=key(s);if(g.seen.has(k))continue;g.seen.add(k);const depth=node.depth+1;g.q.push({s,parent:n,a:m.A[a],depth,score:depth+1.2*forceDistance(s)});push(g,g.q.length-1);
  }
 }
}
function snapshot(g){return {engine,choice:g.choice,provenance:g.provenance,expanded:g.expanded,seen:g.seen.size,pending:g.heap.length,concreteNodes:g.q.length,done:g.done.size,maxDepth:g.maxDepth,depthLimit:g.depthLimit,depthCut:g.depthCut,depthDeferred:g.depthDeferred.length,lost:g.lost,forces:g.forces,hit:g.hit,historicalBoundaryCounts:g.boundaryCounts,migrations:g.migrationHistory?.map(v=>({from:v.from,to:v.to,parentsRechecked:v.parentsRechecked,valid:v.valid,newLost:v.newLost,newNodes:v.newNodes,remainingUnknown:v.remainingUnknown,before:v.before,after:v.after}))||[]};}
async function runTo(target){
 let printed=groups.reduce((n,g)=>n+g.expanded,0);
 while(groups.some(g=>!g.hit&&g.heap.length&&g.expanded<target)){
  for(const g of groups)if(!g.hit&&g.heap.length&&g.expanded<target)stepWindow(g,Math.min(target,g.expanded+1000));
  const total=groups.reduce((n,g)=>n+g.expanded,0);if(total-printed>=20000){save();console.log(JSON.stringify({window:groups.map(snapshot)}));printed=total;}
  await new Promise(resolve=>setImmediate(resolve));
 }
 save();console.log(JSON.stringify({WINDOW_COMPLETE:groups.map(snapshot)}));
}
async function main(){
 if(process.argv.includes('--resume'))load();
 if(process.argv.includes('--migrate-onefront'))migrateOneFront();
 if(process.argv.includes('--migrate-cross'))migrateFiniteCross();
 console.log(JSON.stringify({source:'raw strong38 children physically verified actual98; continuations MODEL',groups:groups.map(g=>({provenance:g.provenance,source:m.describe(g.source)}))}));
 await runTo(200000);
 if(!process.argv.includes('--live')||groups.every(g=>g.hit))return;
 const rl=require('readline').createInterface({input:process.stdin,output:process.stdout,terminal:false});
 console.log('DERIVED_FRONTIERS_RETAINED: CONTINUE <per-leaf expanded> | STATUS | BOUNDARIES | SAVE | DEPTH <limit> | STOP');
 for await(const line of rl){const [cmd,value]=line.trim().split(/\s+/);
  if(cmd==='CONTINUE'){await runTo(Number(value));if(groups.every(g=>g.hit)){rl.close();break;}}
  else if(cmd==='STATUS')console.log(JSON.stringify({groups:groups.map(snapshot)}));
  else if(cmd==='BOUNDARIES')console.log(JSON.stringify({groups:groups.map(g=>({choice:g.choice,boundaries:g.boundaries}))}));
  else if(cmd==='SAVE'){save();console.log('DERIVED_CHECKPOINT_SAVED');}
  else if(cmd==='DEPTH'){for(const g of groups){g.depthLimit=Number(value);for(const n of g.depthDeferred.splice(0))push(g,n);}save();}
  else if(cmd==='STOP'){save();rl.close();break;}
 }
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={get m(){return m;},raw38,parentIndex,deployed,getGroups:()=>groups,key,auditPath,stepWindow,runTo,save,load,snapshot,migrateOneFront,migrateFiniteCross};
