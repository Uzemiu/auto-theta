// One different MODEL60 root; calibrated M131 source-aware ordinary domain.
// No game calls. This is a finite calculation window, not a no-solution claim.
const fs=require('fs'),v8=require('v8'),{createModel}=require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,'')),o=j.events[74].observation;
const m=createModel(o),deploy=m.replay('WDSAWWDWAA');
if(!deploy.valid||deploy.states.length!==1)throw Error('MODEL60 public fixed deployment mismatch');
const source=deploy.states[0].state,initialWindow=20000;let depthLimit=45;
const terrain=new Map(o.level.timelines[0].tiles.map(e=>[e.pos.join(','),e.type]));
for(const e of o.level.timelines[0].entities)if(e.floor&&!terrain.has(e.pos.join(',')))terrain.set(e.pos.join(','),e.type);
const walls=new Set(o.level.timelines[0].entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>e.pos.join(','))),V=[[0,1],[-1,0],[0,-1],[1,0]],K=e=>e.x+','+e.y;
let q=[{s:source,parent:-1,a:'',depth:0}],seen=new Set(),heap=[],done=new Set(),anonymousKeys=false,faceKeys=false;
const checkpointPath='scratch/ch2-G-m131-model60-frontier-oct05.v8';
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
const score=(s,depth)=>depth+1.2*forceDistance(s)+3*(4-m.left(s));
function push(n){heap.push(n);let i=heap.length-1;while(i){const k=(i-1)>>1;if(q[heap[k]].score<=q[heap[i]].score)break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}
function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(true){let k=i,l=i*2+1,r=l+1;if(l<heap.length&&q[heap[l]].score<q[heap[k]].score)k=l;if(r<heap.length&&q[heap[r]].score<q[heap[k]].score)k=r;if(k===i)break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}return n;}
function path(n){let p='';while(n>0){p=q[n].a+p;n=q[n].parent;}return p;}
q[0].score=score(source,0);seen.add(serial(source));push(0);
let expanded=0,depthCut=0,lost=0,hit=null,maxLeaves=1,forcesSeen=0,maxDepth=0;
let depthDeferred=[];
let boundaryCounts={},boundaries={},firstForces=[];
function runTo(target){
while(heap.length&&expanded<target&&!hit){
 const n=pop(),node=q[n];expanded++;done.add(n);maxDepth=Math.max(maxDepth,node.depth);if(node.depth>=depthLimit){depthCut++;depthDeferred.push(n);continue;}
 for(let a=0;a<4;a++){
  const sequence=path(n)+m.A[a],r=m.step(node.s,a);
  if(!r.valid){for(const b of r.boundaries){const key=b.boundary;boundaryCounts[key]=(boundaryCounts[key]||0)+1;const candidate={sequence,pre:m.describe(node.s),result:b,leftBefore:m.left(node.s)};if(!boundaries[key]||sequence.length<boundaries[key].sequence.length)boundaries[key]=candidate;}continue;}
  maxLeaves=Math.max(maxLeaves,r.leaves.length);
  if(r.forces.length){
   forcesSeen++;const counts=r.leaves.map(z=>m.left(z.state));if(firstForces.length<12)firstForces.push({sequence,forces:r.forces,leafCount:r.leaves.length,left:counts});
   if(r.leaves.length>=4||counts.some(c=>c>=2)){hit={sequence,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)}))};break;}
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
function snapshot(){return {source:'MODEL60 = actual50 event74 + WDSAWWDWAA; not actual83',sourceState:m.describe(source),initialWindow,depthLimit,expanded,seen:seen.size,pending:heap.length,depthCut,depthDeferred:depthDeferred.length,maxDepth,exhausted:!hit&&!heap.length&&!depthDeferred.length,lost,maxLeaves,forcesSeen,anonymousKeys,faceKeys,boundaryCounts,firstForces,hit,boundaries};}
function compact(){const r=snapshot();delete r.sourceState;delete r.boundaries;return r;}
function saveCheckpoint(){fs.writeFileSync(checkpointPath,v8.serialize({version:3,q,seen,heap,done,depthDeferred,depthLimit,expanded,depthCut,lost,hit,maxLeaves,forcesSeen,maxDepth,boundaryCounts,boundaries,firstForces,anonymousKeys,faceKeys,stats:m.stats}));}
function loadCheckpoint(){
 if(!fs.existsSync(checkpointPath))return false;
 const z=v8.deserialize(fs.readFileSync(checkpointPath));if(z.version!==3)throw Error('checkpoint version');
 ({q,seen,heap,done,depthDeferred,depthLimit,expanded,depthCut,lost,hit,maxLeaves,forcesSeen,maxDepth,boundaryCounts,boundaries,firstForces,anonymousKeys,faceKeys}=z);Object.assign(m.stats,z.stats);return true;
}
function mergeFrontier(){
 const before={seen:seen.size,pending:heap.length};anonymousKeys=true;faceKeys=true;
 const doneKeys=new Set([...done].map(n=>serial(q[n].s))),choice=new Map();
 for(const n of heap){const k=serial(q[n].s);if(doneKeys.has(k))continue;const old=choice.get(k);if(old===undefined||q[n].score<q[old].score)choice.set(k,n);}
 seen=new Set(q.map(n=>serial(n.s)));heap=[];for(const n of choice.values())push(n);
 const after={seen:seen.size,pending:heap.length};saveCheckpoint();return {before,after,retainedConcreteNodes:q.length};
}
async function main(){
 const restored=process.argv.includes('--live')&&loadCheckpoint();if(restored)console.log(JSON.stringify({checkpointRestored:true,...compact()}));
 if(expanded<initialWindow)runTo(initialWindow);console.log(JSON.stringify(compact()));
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
  if(cmd==='CONTINUE'){runTo(Number(value));saveCheckpoint();console.log(JSON.stringify(compact()));if(hit||!heap.length){rl.close();break;}}
  else if(cmd==='STATUS')console.log(JSON.stringify(compact()));
  else if(cmd==='BOUNDARIES')console.log(JSON.stringify({boundaries}));
  else if(cmd==='MERGE')console.log(JSON.stringify({frontierMerge:mergeFrontier()}));
  else if(cmd==='SAVE'){saveCheckpoint();console.log('CHECKPOINT_SAVED');}
  else if(cmd==='DEPTH'){depthLimit=Number(value);for(const n of depthDeferred.splice(0))push(n);console.log(JSON.stringify(compact()));}
  else if(cmd==='STOP'){rl.close();break;}
 }
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={runTo,snapshot,m,source,mergeFrontier,saveCheckpoint,loadCheckpoint};
