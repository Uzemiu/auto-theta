// Readonly observed 4-18 model. No game API, save or primary KB writes.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-18.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const walls=new Set(t.entities.filter(e=>e.class==='Wall'||e.type==='LOCK'||e.type==='BUTTONGATE').map(e=>K(e.pos))),baseWalls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos)));
const floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos))),ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>K(e.pos)));
// Observed mapping, not a remaining assumption: old actual27 had Button8-only
// opening Gate5,2; 2026-10-05 main events104/106/108 show actual52 both,
// actual53 both (outside8,6 still presses Button8), then actual54 Button7-only
// with cargo80/81 at7,6 and outside79 at9,6. Gate5,2 closes, Gate6,2 opens.
// Scope: these active cargo/player occupancies. Own-Gate occupancy behavior and
// other container/layer variants retain their prior independently stated scope.
const gatePairs=[{gate:[5,2],button:[8,6],id:0},{gate:[6,2],button:[7,6],id:1}];
let activeState=null,activePlayer=null;
const block=r=>{if(!activeState?.full)return walls.has(K(r))||!floor.has(K(r));if(baseWalls.has(K(r))||!floor.has(K(r)))return true;
 if(eq(r,[9,5])&&activeState.lock&&!(activePlayer?.key>0))return true;
 const pair=gatePairs.find(z=>eq(r,z.gate));if(pair){const es=[...activeState.b,...activeState.p.filter(Boolean)];if(!es.some(z=>eq(z.r,pair.button)||eq(z.r,r)))return true;}
 return false;};
const clone=s=>JSON.parse(JSON.stringify(s));
const start={b:[{r:[8,2],color:2,c:null}],p:[{r:[8,4],f:'W',fork:1,key:0,id:77},{r:[9,4],f:'W',fork:1,key:0,id:78}]};
const stats={steps:0,death:0,capture:0,conflict:0,occupied:0,movingOverlap:0,iceBox:0},samples=[];
function chain(bs,r,d,ids){if(block(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function step(s,a,path=''){
 stats.steps++;s=clone(s);activeState=s;activePlayer=null;for(const b of s.b)if(b.c)b.c.f=a;
 let pm=new Map(s.p.map((p,i)=>[i,a])),bm=new Map();
 for(let micro=0;micro<12;micro++){
  const plans=new Map(),req=new Map();
  const request=(i,d)=>{if(req.has(i)&&req.get(i)!==d){stats.conflict++;if(samples.length<6)samples.push({kind:'active-vs-inertia-conflict',path,micro,s});return false;}req.set(i,d);return true;};
  for(const[i,old]of pm){const p=s.p[i];if(!p)continue;activePlayer=p;let d=old,r=p.r,ids=[],ok=false;
   for(let turn=0;turn<(micro===0?4:1);turn++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}
   if(!ok){plans.set(i,{r:p.r,d:old,ids:[],ok:false});continue;}plans.set(i,{r,d,ids,ok:true});for(const j of ids)if(!request(j,d))return null;
  }
  activePlayer=null;for(const[i,d]of bm){const ids=[];if(chain(s.b,add(s.b[i].r,d),d,ids)){if(!request(i,d))return null;for(const j of ids)if(!request(j,d))return null;}}
  const oldb=s.b.map(b=>b.r),nbm=new Map();for(const[i,d]of req){s.b[i].r=add(oldb[i],d);if(ice.has(K(s.b[i].r)))nbm.set(i,d);}
  bm=nbm;const npm=new Map();
  for(const[i,z]of plans){const p=s.p[i];p.r=z.r;if(z.ok)p.f=z.d;if(s.full&&s.lock&&eq(p.r,[9,5])&&p.key>0){p.key--;s.lock=false;}if(z.ok&&ice.has(K(z.r))&&!z.ids.length)npm.set(i,z.d);}
  if(s.full&&s.lastFork){for(const z of [...s.b.filter(b=>b.c).map(b=>({r:b.r,c:b.c})),...s.p.filter(Boolean).map(p=>({r:p.r,c:p}))])if(s.lastFork&&eq(z.r,[3,6])){z.c.fork++;s.lastFork=false;}}
  for(let i=0;i<s.p.length;i++){const p=s.p[i];if(!p)continue;const b=s.b.find(b=>eq(b.r,p.r));if(b){if(b.c){stats.occupied++;return null;}b.c={f:p.f,fork:p.fork,key:p.key,id:p.id,ghost:spike.has(K(p.r))?1:0};stats.capture++;s.p[i]=null;npm.delete(i);}else if(spike.has(K(p.r))){stats.death++;s.p[i]=null;npm.delete(i);}}
  for(let i=0;i<s.p.length;i++)for(let j=i+1;j<s.p.length;j++){const p=s.p[i],q=s.p[j];if(!p||!q||!eq(p.r,q.r))continue;if(npm.has(i)||npm.has(j)){stats.movingOverlap++;if(samples.length<6)samples.push({kind:'moving-overlap-unmodeled',path,micro,s});return null;}p.fork=Math.max(p.fork,q.fork);s.p[j]=null;}
  pm=npm;if(!pm.size&&!bm.size)break;
 }
 s.p=s.p.filter(Boolean);return s;
}
const hash=s=>s.b.map(b=>[K(b.r),b.c?b.c.fork:'-',b.c?b.c.f:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.f].join(':')).sort().join(';');
function actual40(){const l=raw.events.map(e=>e.observation?.level).filter(l=>l?.instructions.length===40).at(-1);if(!l)throw Error('No actual40 frame');const es=l.timelines.find(t=>t.id===l.current_timeline)?.entities||l.timelines[0].entities;return{full:true,lock:true,lastFork:true,b:es.filter(e=>e.type==='BOX'&&e.active).map(b=>{const p=es.find(p=>p.type==='PLAYER'&&p.active&&p.properties.contained&&p.properties.container===b.id);return{r:b.pos,color:b.details.Color,orig:b.details.Color===2?73:b.id,c:p?{id:p.id,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key,ghost:p.properties.ghost}:null};}),p:es.filter(p=>p.type==='PLAYER'&&p.active&&!p.properties.contained).map(p=>({id:p.id,r:p.pos,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key}))};}
const fullStats={nodes:0,x:0,conflict:0,stack:0,occupied:0,iceBoundary:0,merge:0},fullSamples=[];
const fullhash=s=>s.b.map(b=>[b.orig,b.color,K(b.r),b.c?b.c.fork:'-',b.c?.fork?b.c.f:'-',b.c?b.c.ghost:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-',p.key].join(':')).sort().join(';')+'|'+s.lock+'|'+s.lastFork;
const goals=raw.initial.level.goals.map(K),mask=s=>goals.reduce((m,g,i)=>m|((s.p.some(p=>K(p.r)===g)||s.b.some(b=>b.c&&!b.c.ghost&&K(b.r)===g))?1<<i:0),0);
function boundary(kind,path,s){fullStats[kind]++;if(fullSamples.filter(x=>x.kind===kind).length<4)fullSamples.push({kind,path,s});}
function settleFull(s,bs,ps,path){
 const merged=[];for(const b of bs){const old=merged.find(z=>eq(z.r,b.r));if(!old){merged.push(b);continue;}if(old.orig!==b.orig){boundary('stack',path,{...s,b:bs,p:ps});return null;}fullStats.merge++;if(!old.c&&b.c)old.c=b.c;}
 const p=[];for(const z of ps){const b=merged.find(b=>eq(b.r,z.r));if(b){if(b.c&&z.fork>0){boundary('occupied',path,{...s,b:bs,p:ps});return null;}if(!b.c)b.c={...z,ghost:spike.has(K(z.r))?1:0};continue;}if(spike.has(K(z.r)))continue;const old=p.find(p=>eq(p.r,z.r));if(old)old.fork=Math.max(old.fork,z.fork);else p.push(z);}
 return{...s,b:merged,p};
}
function assignments(plans){const req=new Map();for(const p of plans)for(const i of p.ids){if(!req.has(i))req.set(i,new Set());req.get(i).add(p.d);}const cf=[...req].filter(([i,ds])=>ds.size>1),out=[];
 function rec(j,c){if(j===cf.length){const keep=plans.filter(p=>p.ids.every(i=>c[i]===undefined||c[i]===p.d)),dirs=new Map();for(const p of keep)for(const i of p.ids)dirs.set(i,p.d);if(cf.every(([i])=>dirs.get(i)===c[i]))out.push({keep,dirs,choices:c});return;}for(const d of cf[j][1])rec(j+1,{...c,[cf[j][0]]:d});}rec(0,{});return{cf,out};}
function xstepFull(s,path){
 fullStats.x++;const base=s.b.filter(b=>!b.c||b.c.fork===0).map(clone),sources=s.b.filter(b=>b.c?.fork>0),plans=[];activeState={...s,b:base};activePlayer=null;
 function birth(r,f,fork,kind,parent){for(const d of [L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(chain(base,q,d,ids)){plans.push({r:q,f,fork,kind,parent,d,ids});if(plans.filter(z=>z.parent===parent).length===2)return;}}
  if(!plans.some(z=>z.parent===parent))plans.push({r,f,fork,kind,parent,d:f,ids:[]});}
 for(const b of sources)birth(b.r,b.c.f,b.c.fork-1,'cargo',b);
 for(const p of s.p)if(p.fork>0)birth(p.r,p.f,p.fork-1,'free',p);else plans.push({...p,kind:'free',parent:p,ids:[],d:p.f});
 const as=assignments(plans);if(as.cf.length)fullStats.conflict++;
 const out=[];for(const z of as.out){const bs=base.map((b,i)=>({...clone(b),r:z.dirs.has(i)?add(b.r,z.dirs.get(i)):b.r})),ps=[];
  for(const p of z.keep){if(p.kind==='cargo')bs.push({r:p.r,color:p.parent.color,orig:p.parent.orig,c:{...p.parent.c,fork:p.fork}});else ps.push({r:p.r,f:p.f,fork:p.fork,key:p.parent.key,id:p.parent.id});}
  if(bs.some(b=>ice.has(K(b.r)))||ps.some(p=>ice.has(K(p.r)))){boundary('iceBoundary',path,{...s,b:bs,p:ps});continue;}
  const n=settleFull(s,bs,ps,path);if(n)out.push({s:n,choices:z.choices});
 }return out;
}
function ordinaryFull(s,a,path){
 activeState=s;const plans=[];for(const p of s.p){activePlayer=p;let d=a,ids=[],r=p.r,ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({r:ok?r:p.r,f:ok?d:a,d,ids:ok?ids:[],parent:p});}activePlayer=null;
 const as=assignments(plans);if(!as.cf.length){const n=step(s,a,path);return n?[{s:n,choices:{}}]:[];}fullStats.conflict++;
 const out=[];for(const z of as.out){const bs=s.b.map((b,i)=>({...clone(b),r:z.dirs.has(i)?add(b.r,z.dirs.get(i)):b.r,c:b.c?{...b.c,f:a}:null})),ps=z.keep.map(p=>({...p.parent,r:p.r,f:p.f}));
  if(bs.some(b=>ice.has(K(b.r)))||ps.some(p=>ice.has(K(p.r)))){boundary('iceBoundary',path,{...s,b:bs,p:ps});continue;}const n=settleFull(s,bs,ps,path);if(n)out.push({s:n,choices:z.choices});
 }return out;
}
function fullsearch(cap=5000,depth=28){const source=replay('SDSSDDDDDWWWAAAA',actual40()).s,q=[{s:source,path:'',edges:[],masks:new Set([mask(source)])}],index=new Map([[fullhash(source),0]]);let head=0,cut=0;
 while(head<q.length&&head<cap){const node=q[head++];fullStats.nodes++;if(node.path.length>=depth){cut++;continue;}for(const a of 'WASDX'){
   if(a==='X'&&!node.s.p.some(p=>p.fork>0)&&!node.s.b.some(b=>b.c?.fork>0))continue;const out=a==='X'?xstepFull(node.s,node.path+a):ordinaryFull(node.s,a,node.path+a);if(!out.length)continue;const ids=[];
   for(const n of out){if(n.s.b.some(b=>b.c?.ghost))continue;const h=fullhash(n.s);let id=index.get(h);if(id===undefined){id=q.length;index.set(h,id);q.push({s:n.s,path:node.path+a,edges:[],masks:new Set([mask(n.s)])});}ids.push(id);}if(ids.length===out.length)node.edges.push({a,ids,choices:out.map(n=>n.choices)});
  }
 }
 // Goal sets combine only inside one compatible transition family; no ancestor credit.
 let adds=0;for(let pass=0;pass<30;pass++){let change=0;for(let i=q.length-1;i>=0;i--)for(const e of q[i].edges){let ms=new Set([0]);for(const id of e.ids){const nxt=new Set();for(const a of ms)for(const b of q[id].masks)nxt.add(a|b);ms=nxt;}for(const m of ms)if(!q[i].masks.has(m)){q[i].masks.add(m);change++;}}adds+=change;if(!change)break;}
 const profile=[...q[0].masks].sort((a,b)=>a-b), examples=[];for(let i=0;i<q.length;i++)if(mask(q[i].s)&&examples.length<8)examples.push({path:q[i].path,mask:mask(q[i].s),s:q[i].s});
 return{hit:profile.includes(15),source,head,seen:q.length,pending:q.length-head,cut,exhausted:head===q.length,cap,depth,profile,adds,examples,stats:fullStats,samples:fullSamples};
}
function replay(path,source=start){let s=clone(source),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));trace.push({n:i+1,a:path[i],s});if(!s)return{valid:false,trace};}return{valid:true,s,trace};}
function search(cap=5000,depth=20,mobile=false){const q=[{s:start,path:''}],seen=new Set([hash(start)]);let head=0,cut=0;
 while(head<q.length&&head<cap){const{s,path}=q[head++];if(s.b.some(b=>b.c&&b.c.fork===1&&!b.c.ghost&&b.r[1]>=2&&(!mobile||b.r[0]===8))&&s.p.length===1&&s.p[0].fork===1)return{hit:{tail:path,s},head,seen:seen.size,stats,samples};
  if(path.length>=depth){cut++;continue;}for(const a of 'WASD'){const n=step(s,a,path+a);if(!n||n.p.length+n.b.filter(b=>b.c&&!b.c.ghost).length!==2||n.b.some(b=>b.r[1]===1||b.c&&b.c.ghost))continue;const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path:path+a});}
 }return{hit:null,head,seen:seen.size,pending:q.length-head,cut,exhausted:head===q.length,cap,depth,stats,samples};
}
module.exports={start,step,replay,search,actual40,fullsearch,xstepFull,ordinaryFull,mask,walls,floor,spike,ice,K,eq,add,V,L,block,hash,gatePairs};
if(require.main===module){if(process.argv[2]==='replay')console.log(JSON.stringify(replay(process.argv[3]||'')));else if(process.argv[2]==='fullreplay')console.log(JSON.stringify(replay(process.argv[3]||'',actual40())));else if(process.argv[2]==='fullsearch')console.log(JSON.stringify(fullsearch(Number(process.argv[3]||5000),Number(process.argv[4]||28))));else console.log(JSON.stringify(search(Number(process.argv[2]||5000),Number(process.argv[3]||20),process.argv[4]==='mobile')));}
