// Private read-only Chapter2 world navigation. Actual observation only; no game/save APIs.
// One initial free X, one Blue box, M035 ICE transfer + M040 opposing brake.
const fs=require('fs'),K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],A='WASDX';
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/chapter2-world.json','utf8').replace(/^\uFEFF/,''));
const source=[{index:-1,o:raw.initial},...(raw.events||[]).map((e,index)=>({index,o:e.observation}))].reverse().find(x=>x.o?.level?.id==='Chapter2'&&x.o.level.world&&x.o.level.timelines?.[0]?.tiles?.length);
if(!source)throw Error('No full actual Chapter2 source');
const t=source.o.level.timelines[0],terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const walls=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>K(e.pos)));
const entries=new Map(t.entities.filter(e=>e.active&&e.type==='ENTRY').map(e=>[K(e.pos),e.details.LinkLevel]));
const completed=new Set(JSON.parse(fs.readFileSync('knowledge/progress.json','utf8').replace(/^\uFEFF/,'')).active_playthrough.verified_completed_levels);
const forbidden=new Set([...entries].filter(([k,id])=>!completed.has(id)&&!['2-P','2-Q'].includes(id)).map(([k])=>k));
const pos=e=>[e.x,e.y],move=(p,d)=>[p[0]+V[d][0],p[1]+V[d][1]];
const start={p:t.entities.filter(e=>e.active&&e.type==='PLAYER'&&!e.properties?.contained).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],face:e.properties.face,fork:e.properties.split||0})),b:t.entities.filter(e=>e.active&&e.type==='BOX').map(e=>({id:e.id,x:e.pos[0],y:e.pos[1]}))};
const stats={death:0,brakes:0,capture:0,perpendicular:0,conflict:0,merge:0,uncertainCross:0,entry:0,loop:0};
function next(s,a,options={}){
 let p=s.p.map(e=>({...e,md:-1})),b=s.b.map(e=>({...e,md:-1})),forced=null;
 const trace=[];
 if(a===4){
  if(p.length!==1||!p[0].fork)return null;
  const par=p[0],blocked=z=>walls.has(K(z))||!terrain.has(K(z));
  function birthBlocked(z,d){
   if(blocked(z))return true;
   // M021: a side occupied by a box that cannot be pushed falls back front.
   const seen=new Set();let q=b.find(e=>K(pos(e))===K(z));
   while(q){if(seen.has(q.id))return true;seen.add(q.id);z=move(pos(q),d);if(blocked(z))return true;q=b.find(e=>K(pos(e))===K(z));}
   return false;
  }
  p=[];forced=[];
  for(let d of [(par.face+1)%4,(par.face+3)%4]){
   let z=move(pos(par),d);if(birthBlocked(z,d)){d=par.face;z=move(pos(par),d);}
   if(!birthBlocked(z,d)){p.push({...par,id:par.id+p.length/10,fork:par.fork-1});forced.push(d);}
  }
  if(!p.length)return {p:[{...par,fork:par.fork-1,md:undefined}],b:s.b,trace};
 }
 for(let tick=0;tick<250;tick++){
  const bi=z=>b.findIndex(e=>K(pos(e))===K(z)),blocked=z=>walls.has(K(z))||!terrain.has(K(z));
  function chain(j,d){const out=[];while(j>=0){if(out.includes(j))return null;out.push(j);const z=move(pos(b[j]),d);if(blocked(z))return null;j=bi(z);}return out;}
  function can(e,d){const z=move(pos(e),d);if(blocked(z))return false;const j=bi(z);return j<0||!!chain(j,d);}
  const plans=new Map(),np=[],cancels=new Set(),requested=[];
  function request(j,d,by){if(!plans.has(j))plans.set(j,[]);plans.get(j).push({d,by});}
  for(let i=0;i<p.length;i++){
   const e=p[i];if(e.contained){np.push({...e,face:tick===0&&a<4?a:e.face});continue;}
   let d=tick===0?(forced?forced[i]:a):e.md;
   if(d<0){np.push({...e});continue;}
   if(tick===0&&!forced){let z=0;while(z<4&&!can(e,d)){d=(d+1)%4;z++;}if(z===4){np.push({...e,md:-1});continue;}}
   else if(!can(e,d)){np.push({...e,md:-1});continue;}
   const z=move(pos(e),d),j=bi(z);
   if(j>=0&&b[j].md>=0){
    if((b[j].md+2)%4===d){cancels.add(j);stats.brakes++;np.push({...e,md:-1});continue;}
    if(b[j].md!==d){stats.perpendicular++;return null;}
   }
   if(j>=0)for(const q of chain(j,d)){request(q,d,e.id);requested.push({box:b[q].id,d,by:e.id});}
   if(forbidden.has(K(z))||terrain.get(K(z))==='DARK'){stats.entry++;return null;}
   if(terrain.get(K(z))!=='SPIKE')np.push({...e,x:z[0],y:z[1],face:tick===0&&!forced?d:e.face,md:j>=0?-1:terrain.get(K(z))==='ICE'?d:-1});else stats.death++;
  }
  for(const [j,r]of plans)if(new Set(r.map(e=>e.d)).size>1){stats.conflict++;return null;}
  for(let j=0;j<b.length;j++)if(b[j].md>=0&&!plans.has(j)&&!cancels.has(j)){const ch=chain(j,b[j].md);if(ch)for(const q of ch)request(q,b[j].md,-1);}
  const nb=b.map((e,j)=>{
   const r=plans.get(j);if(!r?.length||cancels.has(j))return {...e,md:-1};
   const ds=[...new Set(r.map(q=>q.d))];if(ds.length!==1)return null;
   const d=ds[0],z=move(pos(e),d);return {...e,x:z[0],y:z[1],md:bi(z)>=0?-1:terrain.get(K(z))==='ICE'?d:-1};
  });if(nb.some(e=>!e)||new Set(nb.map(e=>K(pos(e)))).size<nb.length)return null;
  for(const e of np){const q=nb.find(q=>K(pos(q))===K(pos(e)));if(q&&!e.contained){stats.capture++;e.contained=q.id;e.md=-1;}if(e.contained){const bb=nb.find(q=>q.id===e.contained);e.x=bb.x;e.y=bb.y;}}
  const merged=[];for(const e of np){const q=merged.find(q=>!q.contained&&!e.contained&&K(pos(q))===K(pos(e)));if(!q){merged.push(e);continue;}
   // Only known opposing *moving* crossings and same-direction/settled merges.
   if(q.md>=0&&e.md>=0&&(q.md+2)%4===e.md){merged.push(e);continue;}
   if(q.md<0&&e.md<0||q.md===e.md&&q.md>=0){q.fork=Math.max(q.fork,e.fork);stats.merge++;continue;}
   stats.uncertainCross++;return null;
  }
  const es=new Set(merged.filter(e=>!e.contained).map(e=>entries.get(K(pos(e)))).filter(Boolean));if(es.size>1){stats.entry++;return null;}
  p=merged;b=nb;
  if(options.trace)trace.push({tick,p:p.map(e=>({...e})),b:b.map(e=>({...e})),requested});
  if(!p.some(e=>e.md>=0)&&!b.some(e=>e.md>=0))return {p:p.map(({md,...e})=>e),b:b.map(({md,...e})=>e),trace};
 }
 stats.loop++;return null;
}
const serial=s=>s.p.map(e=>K(pos(e))+':'+(e.fork?e.face+':'+e.fork:'0')+':'+(e.contained?'C':'F')).sort().join('|')+'#'+s.b.map(e=>K(pos(e))).sort().join('|');
const describe=s=>({players:s.p.map(e=>({id:e.id,at:pos(e),face:e.face,fork:e.fork,contained:e.contained||0})),boxes:s.b.map(e=>({id:e.id,at:pos(e)}))});
function replay(sequence,s=start,trace=false){const points=[];for(const[i,a]of[...sequence].entries()){const r=next(s,A.indexOf(a),{trace});if(!r)return {valid:false,step:i+1,a,state:s,points};s=r;points.push({step:i+1,a,...describe(s),ticks:r.trace.length});}return{valid:true,state:s,points};}
function search(options={}){
 const initial=options.start||start,cap=options.cap||20000,depthCap=options.depth||70,q=[{s:initial,parent:-1,a:'',depth:0}],seen=new Map([[serial(initial),0]]),heap=[];let expanded=0,hit=null,closest=null;
 const priority=n=>q[n].depth+(options.heuristic?.(q[n].s)||0);
 function push(n){let i=heap.length;heap.push(n);while(i){const k=(i-1)>>1;if(priority(heap[k])<=priority(heap[i]))break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}
 function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(1){let j=i,l=i*2+1,r=l+1;if(l<heap.length&&priority(heap[l])<priority(heap[j]))j=l;if(r<heap.length&&priority(heap[r])<priority(heap[j]))j=r;if(i===j)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
 function path(n){let out='';while(n>0){out=q[n].a+out;n=q[n].parent;}return out;}
 push(0);while(heap.length&&expanded<cap){const n=pop(),s=q[n].s;expanded++;if(seen.get(serial(s))!==q[n].depth)continue;
  const dist=options.distance?.(s);if(dist!==undefined&&(!closest||dist<closest.distance))closest={distance:dist,sequence:path(n),...describe(s)};
  if(options.accept?.(s)){hit={sequence:path(n),state:s,...describe(s)};break;}
  if(q[n].depth>=depthCap)continue;
  for(let a=0;a<5;a++){const r=next(s,a);if(!r||!r.p.some(e=>!e.contained)||options.prune?.(r))continue;const key=serial(r),d=q[n].depth+1;if(seen.has(key)&&seen.get(key)<=d)continue;seen.set(key,d);q.push({s:r,parent:n,a:A[a],depth:d});push(q.length-1);}
 }
 return{sourceEvent:source.index,expanded,seen:seen.size,queued:heap.length,cap,depthCap,exhausted:!hit&&!heap.length,hit,closest,stats};
}
if(require.main===module){const sequence=process.argv[2];console.log(JSON.stringify(sequence?replay(sequence,start,true):{sourceEvent:source.index,start:describe(start)},null,2));}
module.exports={source,start,next,replay,search,serial,describe,terrain,walls,entries,A};
