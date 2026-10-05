// Read-only bounded world navigation. Reads ordinary observation JSON only.
// One initial free fork X, no push, no save/game interaction. Does not model
// mutable buttons, locks, special letter loads or simultaneous distinct ENTRYs.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/chapter2-world.json','utf8').replace(/^\uFEFF/,''));
const source=[{index:-1,o:raw.initial},...(raw.events||[]).map((e,index)=>({index,o:e.observation}))].reverse()
 .find(x=>x.o?.level?.world&&x.o.level.timelines?.[0]?.tiles?.length);
const t=source.o.level.timelines[0],K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]];
const terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const blocking=new Map(t.entities.filter(e=>e.active&&e.blockable).map(e=>[K(e.pos),e]));
const modelBox=process.env.COL5_MODEL_BOX;
if(modelBox){const e=t.entities.find(e=>e.active&&e.type==='BOX');blocking.delete(K(e.pos));blocking.set(modelBox,{...e,pos:modelBox.split(',').map(Number)});}
const entries=new Map(t.entities.filter(e=>e.type==='ENTRY'&&e.active).map(e=>[K(e.pos),e.details.LinkLevel]));
const completed=new Set(JSON.parse(fs.readFileSync('knowledge/progress.json','utf8').replace(/^\uFEFF/,'')).active_playthrough.verified_completed_levels);
// AlwaysEnable does not prove automatic loading. Completed numerical entries
// are geometry-only here; the owner separately checks actual 2-1 passage.
const forbidden=new Set(t.entities.filter(e=>e.type==='ENTRY'&&e.active&&
 !completed.has(e.details.LinkLevel)).map(e=>K(e.pos)));
const player=t.entities.find(e=>e.active&&e.type==='PLAYER'&&!e.properties?.contained);
const actualStart=process.argv.includes('--actual-start');
const start=actualStart?player:{pos:[82,7],properties:{face:2,split:1}};
if(process.env.COL5_MODEL_START)start.pos=process.env.COL5_MODEL_START.split(',').map(Number);
if(process.env.COL5_MODEL_FORK)start.properties.split=Number(process.env.COL5_MODEL_FORK);
const cap=Number(process.env.COL5_CAP||20000),depth=Number(process.env.COL5_DEPTH||100);
const target=(process.env.COL5_TARGET||'39,6').split('|').sort();
const astar=process.argv.includes('--astar');
function isGoal(s){return target.length===1?s.ps.some(p=>K(p)===target[0]):s.ps.map(K).sort().join('|')===target.join('|');}
const stats={pushRejected:0,deathRejected:0,entryComboRejected:0,forbiddenEntryRejected:0,slidingMergeAmbiguous:0,x:0};
const add=(p,d)=>[p[0]+V[d][0],p[1]+V[d][1]];
function kind(p){const k=K(p),b=blocking.get(k);if(b?.pushable)return 'push';if(b||!terrain.has(k))return 'block';if(forbidden.has(k))return 'entry';if(['SPIKE','DARK'].includes(terrain.get(k)))return 'death';return 'free';}
function valid(p){const k=kind(p);if(k==='push'){stats.pushRejected++;return null;}if(k==='entry'){stats.forbiddenEntryRejected++;return null;}if(k==='death'){stats.deathRejected++;return null;}return k==='free';}
function guard(ps){const es=new Set(ps.map(p=>entries.get(K(p))).filter(Boolean));if(es.size>1){stats.entryComboRejected++;return false;}return true;}
function settle(ps,ds,faces){
 let moving=ps.map(p=>terrain.get(K(p))==='ICE'),frames=[ps.map(p=>[...p])];
 if(!guard(ps))return null;
 for(let tick=0;tick<120&&moving.some(Boolean);tick++){
  const ns=ps.map(p=>[...p]),nm=[...moving];
  for(let i=0;i<ps.length;i++)if(moving[i]){
   const n=add(ps[i],ds[i]),ok=valid(n);if(ok===null)return null;
   if(!ok){nm[i]=false;continue;}ns[i]=n;nm[i]=terrain.get(K(n))==='ICE';
  }
  if(!guard(ns))return null;
  if(ns.length===2&&K(ns[0])===K(ns[1])){
   if(nm.some(Boolean)){stats.slidingMergeAmbiguous++;return null;}
   ns.splice(1,1);nm.splice(1,1);ds.splice(1,1);faces.splice(1,1);
  }
  ps=ns;moving=nm;frames.push(ps.map(p=>[...p]));
 }
 if(moving.some(Boolean))return null;
 return {ps,faces,frames};
}
function move(s,a){
 const ps=[],ds=[],faces=[];
 for(let i=0;i<s.ps.length;i++){
  let found=false;
  for(let z=0;z<4;z++){
   const d=(a+z)%4,n=add(s.ps[i],d),ok=valid(n);if(ok===null)return null;
   if(!ok)continue;ps.push(n);ds.push(d);faces.push(d);found=true;break;
  }
  if(!found){ps.push([...s.ps[i]]);ds.push(s.faces[i]);faces.push(s.faces[i]);}
 }
 if(ps.length===2&&K(ps[0])===K(ps[1])&&!ps.some(p=>terrain.get(K(p))==='ICE')){ps.splice(1,1);ds.splice(1,1);faces.splice(1,1);}
 const r=settle(ps,ds,faces);return r?{...r,fork:s.fork}:null;
}
function split(s){
 if(!s.fork||s.ps.length!==1)return null;stats.x++;
 const f=s.faces[0],ps=[],ds=[],faces=[];
 for(const d of [(f+1)%4,(f+3)%4]){
  let n=add(s.ps[0],d),ok=valid(n);if(ok===null)return null;
  let actual=d;
  if(!ok){n=add(s.ps[0],f);actual=f;ok=valid(n);if(ok===null)return null;}
  if(ok&&!ps.some(p=>K(p)===K(n))){ps.push(n);ds.push(actual);faces.push(f);}
 }
 if(!ps.length){ps.push([...s.ps[0]]);ds.push(f);faces.push(f);}
 const r=settle(ps,ds,faces);return r?{...r,fork:0}:null;
}
const hash=s=>s.fork?'1:'+K(s.ps[0])+':'+s.faces[0]:'0:'+s.ps.map(K).sort().join('|');
const q=[{ps:[start.pos],faces:[start.properties.face],fork:start.properties.split?1:0,parent:-1,action:'',depth:0}],seen=new Set([hash(q[0])]);
const distances=[];
if(astar){
 const reverse=new Map();
 for(const k of terrain.keys())if(kind(k.split(',').map(Number))==='free'){
  const s={ps:[k.split(',').map(Number)],faces:[0],fork:0};
  for(let a=0;a<4;a++){const r=move(s,a);if(!r)continue;const j=K(r.ps[0]);if(!reverse.has(j))reverse.set(j,[]);reverse.get(j).push(k);}
 }
 for(const g of target){const d=new Map([[g,0]]),qq=[g];for(let i=0;i<qq.length;i++)for(const k of reverse.get(qq[i])||[])if(!d.has(k)){d.set(k,d.get(qq[i])+1);qq.push(k);}distances.push(d);}
}
function priority(s){
 if(!astar||s.fork)return s.depth;
 const ks=s.ps.map(K),d=(i,k)=>distances[i].get(k)??1000;
 const h=target.length===1?Math.min(...ks.map(k=>d(0,k))):ks.length===2?Math.min(Math.max(d(0,ks[0]),d(1,ks[1])),Math.max(d(0,ks[1]),d(1,ks[0]))):1000;
 return s.depth+h*2;
}
const heap=[];
function push(n){let i=heap.length;heap.push(n);while(i){const p=(i-1)>>1;if(priority(q[heap[p]])<=priority(q[heap[i]]))break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p;}}
function pop(){const n=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(1){let j=i,l=i*2+1,r=l+1;if(l<heap.length&&priority(q[heap[l]])<priority(q[heap[j]]))j=l;if(r<heap.length&&priority(q[heap[r]])<priority(q[heap[j]]))j=r;if(i===j)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
push(0);
let head=0,hit=null,closest=null,birthIce=null,positions=new Set();
while(heap.length&&head<cap){
 const n=pop(),s=q[n];head++;for(const p of s.ps)positions.add(K(p));
 if(isGoal(s)){hit=n;break;}
 const dist=Math.min(...s.ps.map(p=>Math.abs(p[0]-39)+Math.abs(p[1]-6)));
 if(!closest||dist<closest.dist)closest={index:n,dist,ps:s.ps};
 if(s.depth>=depth)continue;
 for(let a=0;a<5;a++){
  const r=a===4?split(s):move(s,a);if(!r)continue;
  const h=hash(r);if(seen.has(h))continue;seen.add(h);
  const z={ps:r.ps,faces:r.faces,fork:r.fork,parent:n,action:'WASDX'[a],depth:s.depth+1,frames:r.frames};q.push(z);push(q.length-1);
  if(a===4&&!birthIce&&r.frames.length>1)birthIce=q.length-1;
 }
}
function path(n){const a=[];while(n>0){a.push(q[n].action);n=q[n].parent;}return a.reverse().join('');}
function checkpoints(n){const a=[];while(n>0){const s=q[n];a.push({input:s.action,ps:s.ps,faces:s.faces,frames:s.frames.length});n=s.parent;}return a.reverse();}
console.log(JSON.stringify({sourceEvent:source.index,start:{pos:start.pos,face:start.properties.face,fork:start.properties.split},actualStart,modelBox:modelBox||null,modelStart:process.env.COL5_MODEL_START||null,expanded:head,seen:seen.size,exhausted:!heap.length&&hit===null,cap,depth,astar,positions:positions.size,
 target,hit:hit===null?null:{path:path(hit),checkpoints:checkpoints(hit)},closest:closest?{...closest,path:path(closest.index)}:null,
 firstIceX:birthIce===null?null:{path:path(birthIce),positions:q[birthIce].ps,microticks:q[birthIce].frames.length},stats,
 scope:'geometry only; one free fork X; fixed gates/locks/box; reject all lethal branches, pushes and distinct simultaneous ENTRYs; only KB completed entries (including X/Y/B/C/D and numeric AlwaysEnable) allowed; sliding co-location excluded as uncertain; no world wrapping'}));
