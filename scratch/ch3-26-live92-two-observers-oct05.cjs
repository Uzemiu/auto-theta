// Finite read-only candidate search from public actual92. No game/Bridge/save calls.
// Restricts to two living free actors, ordinary WASD, and no capture/merge/stack.
// Optical completion is NOT modeled; it asks for live observers beside both Goal prisms.
const fs = require('fs'), v8 = require('v8');
const j = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-26.json', 'utf8').replace(/^\uFEFF/, ''));
const observation = j.events[61].observation, t = observation.level.timelines[0];
const K = p => p.x + ',' + p.y, V = [[0,1],[-1,0],[0,-1],[1,0]], A = 'WASD';
const terrain = new Map(t.tiles.map(e => [e.pos.join(','), e.type]));
for (const e of t.entities) if (e.floor && !terrain.has(e.pos.join(','))) terrain.set(e.pos.join(','), e.type);
const walls = new Set(t.entities.filter(e => e.active && e.blockable && !['BOX','PRISM','LOCK','BUTTONGATE'].includes(e.type)).map(e => e.pos.join(',')));
// Verified public snapshots: each top gate is paired with the bottom button at
// the same x. Entity array order is reversed and is not a logical button ID.
const gates = t.entities.filter(e => e.type === 'BUTTONGATE').map(e => ({k:e.pos.join(','), button:[e.pos[0],1].join(',')}));
let gateSamples=0;
for(const e of j.events){const oo=e.observation;if(!oo?.level||oo.level.timelines.length!==1)continue;const tt=oo.level.timelines[0],occ=new Set(tt.entities.filter(z=>z.active&&['PLAYER','BOX','PRISM'].includes(z.type)).map(z=>z.pos.join(',')));
 for(const g of tt.entities.filter(z=>z.type==='BUTTONGATE')){gateSamples++;if(g.blockable===occ.has([g.pos[0],1].join(',')))throw Error('Public button/gate correspondence mismatch');}
}
const lock = t.entities.find(e => e.type === 'LOCK');
const start = {
 p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],face:e.properties.face,key:e.properties.key})),
 b:t.entities.filter(e=>e.active&&['BOX','PRISM'].includes(e.type)).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1]})),
 locked:lock.active
};
if(start.p.length!==2 || t.tiles.some(e=>e.type==='ICE')) throw Error('Restricted source changed');
const clone=s=>({p:s.p.map(p=>({...p})),b:s.b.map(b=>({...b})),locked:s.locked});
const serial=s=>JSON.stringify([s.p.map(p=>[p.id,p.x,p.y,p.face,p.key]),s.b.map(b=>[b.id,b.x,b.y]),s.locked]);
const unknownCounts={};
function step(s,a){
 const occupied=new Set([...s.p,...s.b].map(K)), closed=new Set(gates.filter(g=>!occupied.has(g.button)).map(g=>g.k));
 const at=z=>s.b.findIndex(b=>K(b)===z.join(','));
 const dz=(p,d)=>[p.x+V[d][0],p.y+V[d][1]];
 const hard=(z,p)=>walls.has(z.join(','))||closed.has(z.join(','))||!terrain.has(z.join(','))||(s.locked&&z.join(',')===lock.pos.join(',')&&!p.key);
 function chain(n,d,p){const q=[];while(n>=0){if(q.includes(n))return null;q.push(n);const z=dz(s.b[n],d);if(hard(z,p))return null;n=at(z);}return q;}
 const plans=[], requests=new Map();
 for(const p of s.p){let d=a,c=null,n=0;for(;n<4;n++,d=(d+1)%4){const z=dz(p,d);if(hard(z,p))continue;const bi=at(z);c=bi<0?[]:chain(bi,d,p);if(c)break;}
  if(n===4){plans.push({...p});continue;}
  const z=dz(p,d),k=z.join(',');
  if(terrain.get(k)==='SPIKE')return {boundary:'would-kill-live-actor'};
  if(s.locked&&k===lock.pos.join(',')&&p.key===0)return {boundary:'lock-race'};
  for(const bi of c){if(!requests.has(bi))requests.set(bi,[]);requests.get(bi).push({d,src:p.id});}
  plans.push({...p,x:z[0],y:z[1],face:d,key:p.key-(s.locked&&k===lock.pos.join(',')?1:0)});
 }
 for(const req of requests.values())if(new Set(req.map(r=>r.d)).size>1)return {boundary:'different-direction-force'};
 const nb=s.b.map((b,i)=>{const r=requests.get(i);return r?{...b,x:b.x+V[r[0].d][0],y:b.y+V[r[0].d][1]}:{...b};});
 if(new Set(nb.map(K)).size!==nb.length)return {boundary:'new-stack'};
 if(plans.some(p=>nb.some(b=>K(b)===K(p))))return {boundary:'new-capture'};
 if(new Set(plans.map(K)).size!==plans.length)return {boundary:'new-player-merge'};
 return {state:{p:plans,b:nb,locked:s.locked&&!plans.some(p=>K(p)===lock.pos.join(','))}};
}
const goal = s => s.p.some(p=>K(p)==='1,6') && s.p.some(p=>K(p)==='1,2') && s.b.some(b=>b.id===67&&K(b)==='1,1') && s.b.some(b=>b.id===69&&K(b)==='1,7');
const q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([serial(start)]);let head=0,hit=null;
const nodeLimit=240000,depthLimit=55,stageHits={};
while(head<q.length&&head<nodeLimit){const index=head++,node=q[index];if(node.depth>=depthLimit)continue;for(let a=0;a<4;a++){
 const r=step(node.s,a);if(r.boundary){unknownCounts[r.boundary]=(unknownCounts[r.boundary]||0)+1;continue;}
 const k=serial(r.state);if(seen.has(k))continue;seen.add(k);const child=q.length;q.push({s:r.state,parent:index,a:A[a],depth:node.depth+1});
 for(const [name,condition] of Object.entries({openLock:!r.state.locked,topObserver:r.state.p.some(p=>K(p)==='1,6'),bottomObserver:r.state.p.some(p=>K(p)==='1,2')}))if(condition&&stageHits[name]===undefined)stageHits[name]=child;
 if(goal(r.state)){hit=child;break;}
}if(hit!==null)break;}
let path=null,trace=[];
if(hit!==null){const rev=[];for(let i=hit;q[i].parent>=0;i=q[i].parent)rev.push(i);rev.reverse();path=rev.map(i=>q[i].a).join('');trace=rev.map(i=>({input:q[i].depth,a:q[i].a,state:q[i].s}));}
function routeTo(i){let p='';while(q[i].parent>=0){p=q[i].a+p;i=q[i].parent;}return p;}
const report={scope:'MODEL ONLY: ordinary two live free actors with current static public terrain, ordinary chain pushes, button gates, and one lock. No optical/DARK update, runtime/GMID, cargo, merge, ghost, force, or actual completion proof. Candidate needs real incremental calibration.',source:{event:61,frame:observation.frame,axis:t.axis,time:t.time,instructions:observation.level.instructions},gateSamples,previousRejectedRun:{expanded:120000,reason:'Used reversed button entity array as logical ID; that mapping contradicted actual single-line snapshots. Previous checkpoint is diagnostic only and not loaded into the corrected graph.'},expanded:head,seen:seen.size,pending:q.length-head,nodeLimit,depthLimit,hit:hit!==null,path,stageHits:Object.fromEntries(Object.entries(stageHits).map(([name,i])=>[name,{path:routeTo(i),state:q[i].s}])),unknownCounts,trace};
fs.writeFileSync('scratch/ch3-26-live92-two-observers-oct05.md','# Restricted live92 observer candidate\n\n```json\n'+JSON.stringify(report,null,2)+'\n```\n');
if(head>=nodeLimit&&hit===null)fs.writeFileSync('scratch/ch3-26-live92-two-observers-oct05-v2.v8',v8.serialize({q,seen,head,unknownCounts,nodeLimit,depthLimit,stageHits}));
console.log(JSON.stringify({...report,trace:trace.length?{first:trace[0],last:trace.at(-1),length:trace.length}:[]}));
