// Readonly observed-mechanism model; no game, hints, hidden implementation or save I/O.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-16.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const K=r=>r.join(','),same=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},A=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const goals=raw.initial.level.goals.map(K),face=p=>['W','A','S','D'][p.properties.face];
const moveFace=process.env.CARGO_MOVE_FACE==='1'; // optional unverified variant; confirmed default keeps ordinary global face
const initial={b:t.entities.filter(e=>e.type==='BOX').map(e=>{const p=t.entities.find(p=>p.type==='PLAYER'&&p.properties.container===e.id);return{r:e.pos,orig:e.id,color:e.details.Color,c:p?{f:face(p),fork:p.properties.split,ghost:p.properties.ghost}:null};}),p:t.entities.filter(e=>e.type==='PLAYER'&&!e.properties.contained&&e.active).map(p=>({r:p.pos,f:face(p)}))};
let stats={ordinary:0,ordinaryConflictRejected:0,x:0,conflict:0,stack:0,capture:0,captureOccupied:0,observedChildFreeMerge:0,fusion:0,dead:0},samples=[];
function chain(b,r,d,ids){if(wall.has(K(r)))return false;const i=b.findIndex(z=>same(z.r,r));if(i<0)return true;if(!chain(b,A(r,d),d,ids))return false;ids.push(i);return true;}
function mask(s){return goals.reduce((m,g,i)=>m|((s.p.some(p=>K(p.r)===g)||s.b.some(b=>b.c&&!b.c.ghost&&K(b.r)===g))?1<<i:0),0);}
function finish(b,free,path,pre,kind){
 const merged=[];for(const z of b){const at=merged.find(q=>same(q.r,z.r));if(!at){merged.push(z);continue;}if(at.orig!==z.orig){stats.stack++;if(samples.filter(x=>x.kind==='stack').length<8)samples.push({kind:'stack',path,pre,boxes:b,free});return null;}stats.fusion++;if(!at.c&&z.c)at.c=z.c;else if(at.c&&z.c)at.c.fork=Math.max(at.c.fork,z.c.fork);}
 const p=[];for(const z of free){const box=merged.find(b=>same(b.r,z.r));if(box){stats.capture++;if(box.c){stats.captureOccupied++;
   // Actual 4-16 event9: last-fork C4 child lands on a safe F0 outside;
   // original outside remains active contained, newborn cargo becomes inactive.
   // Do not extrapolate this to ordinary capture, ghost, or remaining forks.
   if(kind==='X'&&box.color===4&&box.c.fork===0&&!box.c.ghost&&!spike.has(K(z.r))){stats.observedChildFreeMerge++;box.c={f:z.f,fork:0,ghost:0};continue;}
   if(samples.filter(x=>x.kind==='capture-occupied').length<6)samples.push({kind:'capture-occupied',path,pre,boxes:merged,free});return null;
  }box.c={f:z.f,fork:0,ghost:spike.has(K(z.r))?1:0};continue;}if(spike.has(K(z.r))){stats.dead++;continue;}if(!p.some(q=>same(q.r,z.r)))p.push(z);}
 return{b:merged,p};
}
function step(s,a,path=''){
 if(a!=='X'){
  stats.ordinary++;const b=s.b.map(z=>({...z,r:z.r,c:z.c?{...z.c,f:a}:null})),plans=[],dirs=new Map();
  for(const p of s.p){let d=a,r,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=A(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}
   plans.push({r:ok?r:p.r,f:ok?d:a});for(const i of ids){if(dirs.has(i)&&dirs.get(i)!==d){stats.ordinaryConflictRejected++;if(samples.filter(x=>x.kind==='ordinary-conflict').length<4)samples.push({kind:'ordinary-conflict',path,pre:s});return[];}dirs.set(i,d);}
  }
  for(const [i,d]of dirs){b[i].r=A(b[i].r,d);if(moveFace&&b[i].c)b[i].c.f=d;}
  const n=finish(b,plans,path,s,'ordinary');return n?[{s:n,axis:null}]:[];
 }
 if(!s.b.some(b=>b.c&&b.c.fork>0))return[];stats.x++;
 const old=s.b.filter(b=>!b.c||b.c.fork===0).map(b=>({...b,c:b.c?{...b.c}:null})),births=[];
 for(const b of s.b.filter(b=>b.c&&b.c.fork>0)){
  const f=b.c.f,l=L[f],valid=[];for(const d of[l,L[L[l]],f]){let ids=[],r=A(b.r,d);if(!chain(old,r,d,ids))continue;valid.push({r,orig:b.orig,color:b.color,c:{...b.c,fork:b.c.fork-1},d,ids});if(valid.length===2)break;}
  if(!valid.length)valid.push({...b,c:{...b.c,fork:b.c.fork-1},ids:[],d:null});births.push(...valid);
 }
 const req=new Map();for(const z of births)for(const i of z.ids){if(!req.has(i))req.set(i,new Set());req.get(i).add(z.d);}
 const conflicts=[...req].filter(([i,ds])=>ds.size>1),choices=[];
 function assign(j,c){if(j===conflicts.length){choices.push(c);return;}for(const d of conflicts[j][1])assign(j+1,{...c,[conflicts[j][0]]:d});}assign(0,{});
 const out=[];for(const choice of choices){const keep=births.filter(z=>z.ids.every(i=>choice[i]===undefined||choice[i]===z.d)),dirs=new Map();let bad=false;
  for(const z of keep)for(const i of z.ids){if(dirs.has(i)&&dirs.get(i)!==z.d)bad=true;dirs.set(i,z.d);}if(bad)continue;
  const b=old.map((z,i)=>({...z,r:dirs.has(i)?A(z.r,dirs.get(i)):z.r,c:z.c?{...z.c,f:moveFace&&dirs.has(i)?dirs.get(i):z.c.f}:null}));
  b.push(...keep.map(({d,ids,...z})=>z));const n=finish(b,s.p.map(p=>({...p})),path,s,'X');if(n)out.push({s:n,axis:conflicts.length?choice:null});
 }
 if(conflicts.length){stats.conflict++;if(samples.filter(x=>x.kind==='conflict').length<6)samples.push({kind:'conflict',path,pre:s,branches:out});}
 return out;
}
// These three original Blue boxes are exchangeable distinct origins: no free
// has forks and no fork pickup exists, so a captured Blue can never reproduce.
// Keep C4 same-origin ancestry; suppress only irrelevant Blue ID permutations
// and zero-fork cargo face (all future ordinary face changes globally).
const hash=s=>s.b.map(b=>[b.color===3?'independent-blue':b.orig,...b.r,b.c&&b.c.fork?b.c.f:'-',b.c?b.c.fork:'-',b.c?b.c.ghost:'-'].join(',')).sort().join(';')+'|'+s.p.map(p=>K(p.r)).sort().join(';');
function replay(path,start=initial,axes=[]){let s=start,trace=[];for(let i=0;i<path.length;i++){const out=step(s,path[i],path.slice(0,i+1));if(!out.length)return{valid:false,step:i+1,trace};s=out[axes.shift()||0].s;trace.push({n:i+1,key:path[i],s,mask:mask(s)});}return{valid:true,s,trace};}
function search(cap=12000,depth=32){const q=[{s:initial,path:'',branchHistory:[]}],seen=new Set([hash(initial)]),families=new Map(),goalExamples={};let head=0,cut=0;
 while(head<q.length&&head<cap){const z=q[head++],gm=mask(z.s);if(gm&&!goalExamples[gm])goalExamples[gm]=z;if(gm===3)return{hit:z,expanded:head,seen:seen.size,stats,samples};
  if(gm&&z.branchHistory.length){const first=z.branchHistory[0],family=first.family;if(!families.has(family))families.set(family,new Map());const leaves=families.get(family);if(!leaves.has(first.choice))leaves.set(first.choice,new Map());if(!leaves.get(first.choice).has(gm))leaves.get(first.choice).set(gm,z);
   for(const [a,as]of leaves)for(const [b,bs]of leaves)if(a!==b)for(const [am,az]of as)for(const [bm,bz]of bs)if((am|bm)===3)return{hit:{kind:'two-leaf-union',family,leaves:[az,bz]},expanded:head,seen:seen.size,stats,samples};
  }
  if(!z.s.p.length&&!z.s.b.some(b=>b.c&&b.c.fork>0))continue;
  if(z.path.length>=depth){cut++;continue;}
  for(const a of 'WASDX')for(const [j,n]of step(z.s,a,z.path+a).entries()){
   if(n.s.b.some(b=>b.c&&b.c.ghost))continue;if(!n.s.p.length&&!n.s.b.some(b=>b.c&&b.c.fork>0)&&mask(n.s)===0)continue;
   const bh=n.axis?z.branchHistory.concat({at:z.path.length+1,choice:j,axis:n.axis,family:z.path+a}):z.branchHistory;
   const h=hash(n.s)+(bh.length?'|family='+bh[0].family+':'+bh[0].choice:'');if(seen.has(h))continue;seen.add(h);q.push({s:n.s,path:z.path+a,branchHistory:bh});
  }
 }
 return{hit:null,expanded:head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,cut,cap,depth,moveFace,stats,samples,goalExamples,families:families.size,scope:'single-leaf full goal or firstconflict two-leaf arbitrary union; observed rigid pushes/cargoX/same-origin fusion; unknown different-origin stack logged not propagated; no ICE in actual map; active ghost excluded'};
}
if(require.main===module){const mode=process.argv[2]||'search';console.log(JSON.stringify(mode==='replay'?replay(process.argv[3]||''):search(Number(process.argv[3])||12000,Number(process.argv[4])||32),null,2));}
module.exports={initial,step,mask,replay,search,wall,spike};
