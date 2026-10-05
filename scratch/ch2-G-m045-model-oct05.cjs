// Private read-only ordinary ICE/box candidate model. No game or save APIs.
// Current scope: find the first simultaneous differently directed free pushes.
const fs=require('fs');
const K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],A='WASD';
function createModel(o,t=o.level.timelines[0]) {
const terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const walls=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>K(e.pos)));
const move=(p,d)=>[p[0]+V[d][0],p[1]+V[d][1]],pos=e=>[e.x,e.y];
const start={p:t.entities.filter(e=>e.active&&e.type==='PLAYER'&&e.id!==105).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],face:e.properties.face})),b:t.entities.filter(e=>e.active&&e.type==='BOX').map(e=>({id:e.id,x:e.pos[0],y:e.pos[1]}))};
const stats={sameFaceMovingStoppedCrossAllowed:0,conflicts:0,captureRejected:0,stackRejected:0,loopRejected:0,inertiaPerpendicularRejected:0,opposingPlayerCrossAllowed:0,uncertainPlayerCrossRejected:0};
function next(s,a,options={}){
 let p=s.p.map(e=>({...e,md:-1,stopCause:'initial',stopTick:-1,stopBoxes:[]})),b=s.b.map(e=>({...e,md:-1}));
 const trace=[],crossings=[];
 for(let tick=0;tick<100;tick++){
  const bi=z=>b.findIndex(e=>K(pos(e))===K(z)),blocked=z=>walls.has(K(z))||!terrain.has(K(z));
  function chain(j,d){const out=[];while(j>=0){if(out.includes(j))return null;out.push(j);const z=move(pos(b[j]),d);if(blocked(z))return null;j=bi(z);}return out;}
  function can(e,d){const z=move(pos(e),d);if(blocked(z))return false;const j=bi(z);return j<0||!!chain(j,d);}
  const plans=new Map(),np=[],requested=[],cancels=new Set();let uncertain=false;
  function request(j,d,by){if(!plans.has(j))plans.set(j,[]);plans.get(j).push({d,by});}
  for(const e of p){
   let d=tick===0?a:e.md;
   if(d<0){np.push({...e});continue;}
   if(tick===0){let z=0;while(z<4&&!can(e,d)){d=(d+1)%4;z++;}if(z===4){np.push({...e,md:-1,stopCause:'blocked',stopTick:tick,stopBoxes:[]});continue;}}
   else if(!can(e,d)){np.push({...e,md:-1,stopCause:'blocked',stopTick:tick,stopBoxes:[]});continue;}
   const z=move(pos(e),d),j=bi(z);
   if(j>=0&&b[j].md>=0){
    if((b[j].md+2)%4===d){cancels.add(j);np.push({...e,md:-1});continue;}
    if(b[j].md!==d){stats.inertiaPerpendicularRejected++;if(options.find_probe)return {probe:'perpendicular-free-box',tick,box:b[j].id,boxMovement:b[j].md,pusher:e.id,pushDirection:d,state:{p,b},trace};uncertain=true;break;}
   }
   if(j>=0){for(const q of chain(j,d)){request(q,d,e.id);requested.push({box:b[q].id,d,by:e.id});}}
   if(terrain.get(K(z))!=='SPIKE')np.push({id:e.id,x:z[0],y:z[1],face:tick===0?d:e.face,md:j>=0?-1:terrain.get(K(z))==='ICE'?d:-1,stopCause:j>=0?'box-push':terrain.get(K(z))==='ICE'?null:'solid',stopTick:j>=0||terrain.get(K(z))!=='ICE'?tick:-1,stopBoxes:j>=0?chain(j,d).map(q=>b[q].id):[]});
  }
  if(uncertain)return null;
  for(const [j,r] of plans){
   const ds=[...new Set(r.map(q=>q.d))];
   if(ds.length>1){stats.conflicts++;return {conflict:true,tick,box:b[j].id,requests:r,state:{p,b},proposedPlayers:np,trace};}
  }
  for(let j=0;j<b.length;j++)if(b[j].md>=0&&!plans.has(j)&&!cancels.has(j)){
   const ch=chain(j,b[j].md);if(ch)for(const q of ch)request(q,b[j].md,-1);
  }
  let inertiaBoxBoundary=null;
  const nb=b.map((e,j)=>{
   const r=plans.get(j);if(!r?.length||cancels.has(j))return {...e,md:-1};
   const free=r.filter(q=>q.by>=0),ds=[...new Set((free.length?free:r).map(q=>q.d))];
   if(ds.length!==1){stats.inertiaPerpendicularRejected++;inertiaBoxBoundary={tick,box:e.id,requests:r.map(z=>({...z})),state:{p:p.map(z=>({...z})),b:b.map(z=>({...z}))},proposedPlayers:np.map(z=>({...z})),trace};return null;}
   const d=ds[0],z=move(pos(e),d);
   // ICE collision transfers movement to the next body; the touching body stops.
   // This reproduces M035: a 7-box train ending on SPIKE moves only one cell,
   // rather than pushing the stopped front box again on every later microtick.
   const contacted=bi(z)>=0;
   return {id:e.id,x:z[0],y:z[1],md:contacted?-1:terrain.get(K(z))==='ICE'?d:-1};
  });
  if(nb.some(e=>!e)){if(options.find_probe&&inertiaBoxBoundary)return {probe:'different-inertial-BOX-requests',...inertiaBoxBoundary};return null;}
  if(new Set(nb.map(e=>K(pos(e)))).size<nb.length){stats.stackRejected++;return null;}
  if(np.some(e=>nb.some(q=>K(pos(q))===K(pos(e))))){stats.captureRejected++;return null;}
  const merged=[];for(const e of np){
   const q=merged.find(q=>K(pos(q))===K(pos(e)));
   if(!q){merged.push(e);continue;}
   if((q.md>=0||e.md>=0)&&(q.face+2)%4===e.face){
    if(options.strictCross&&(q.md<0||e.md<0))return {probe:'opposite-one-stopped-unverified',tick,cell:pos(e),players:[{...q},{...e}],state:{p,b},trace};
    stats.opposingPlayerCrossAllowed++;merged.push(e);continue;
   }
   if(q.face===e.face&&((q.md>=0)!==(e.md>=0))){
    const cross={tick,cell:pos(e),players:[{...q},{...e}],pre:{p:p.map(z=>({...z})),b:b.map(z=>({...z}))},proposedPlayers:np.map(z=>({...z})),trace:trace.map(z=>z)};
    const stopped=q.md<0?q:e;
    if(options.firstSameFaceCross&&(!options.boxStoppedOnly||stopped.stopCause==='box-push'))return {probe:'same-face-moving-stopped',...cross};
    stats.sameFaceMovingStoppedCrossAllowed++;crossings.push({tick,cell:pos(e),players:[{...q},{...e}]});merged.push(e);continue;
   }
   if((q.md<0&&e.md<0)||q.face===e.face)continue;
   stats.uncertainPlayerCrossRejected++;return null;
  }
  p=merged;b=nb;trace.push({tick,p:p.map(e=>({...e})),b:b.map(e=>({...e})),requested});
  if(!p.some(e=>e.md>=0)&&!b.some(e=>e.md>=0))return {p:p.map(({md,stopCause,stopTick,stopBoxes,...e})=>e),b:b.map(({md,...e})=>e),trace,crossings};
 }
 stats.loopRejected++;return null;
}
const serial=s=>s.p.map(e=>K(pos(e))+':'+e.face).sort().join('|')+'#'+s.b.map(e=>K(pos(e))).sort().join('|');
const describe=s=>({players:s.p.map(e=>({id:e.id,at:pos(e),face:e.face,md:e.md})),boxes:s.b.map(e=>({id:e.id,at:pos(e),md:e.md}))});
function path(q,n){let out='';while(n>0){out=q[n].a+out;n=q[n].parent;}return out;}
function replay(sequence,s=start){const points=[];for(const [i,a]of [...sequence].entries()){const r=next(s,A.indexOf(a));if(!r)return{valid:false,step:i+1,points};if(r.conflict)return{conflict:true,step:i+1,...r,points};s=r;points.push({step:i+1,a,...describe(s),ticks:r.trace.length});}return{valid:true,state:s,points};}
function search(options={}){const initial=options.start||start,q=[{s:initial,parent:-1,a:''}],seen=new Set([serial(initial)]),cap=Number(options.cap||process.env.CH2G_CAP||20000);let hit=null,expanded=0;
 const heap=[];const priority=n=>(q[n].depth||0)+(options.heuristic?.(q[n].s)||0);
 function push(n){let i=heap.length;heap.push(n);while(i){const k=(i-1)>>1;if(priority(heap[k])<=priority(heap[i]))break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}
 function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(true){let j=i,l=2*i+1,r=l+1;if(l<heap.length&&priority(heap[l])<priority(heap[j]))j=l;if(r<heap.length&&priority(heap[r])<priority(heap[j]))j=r;if(i===j)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
 push(0);
 while(heap.length&&expanded<cap){const n=pop();expanded++;if(options.accept?.(q[n].s)){hit={sequence:path(q,n),state:q[n].s};break;}for(let a=0;a<4;a++){const r=next(q[n].s,a,options);if(!r)continue;if(r.conflict||r.probe){hit={sequence:path(q,n)+A[a],parent:q[n].s,result:r};break;}if(r.p.length<(options.minp??3)||options.prune?.(r))continue;const h=serial(r);if(seen.has(h))continue;seen.add(h);q.push({s:r,parent:n,a:A[a],depth:(q[n].depth||0)+1});push(q.length-1);}if(hit)break;}
 return {expanded,seen:seen.size,queued:heap.length,exhausted:!hit&&!heap.length,cap,hit,stats};
}
return {start,next,replay,search,describe,serial,A,stats};
}
module.exports={createModel};
