// Private readonly floating model: observed terrain, no game/save/KB writes.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-17.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const walls=new Set(t.entities.filter(e=>e.class==='Wall'||e.type==='LOCK'&&e.blockable).map(e=>K(e.pos))),floors=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spikes=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const forks=t.entities.filter(e=>e.type==='KEY'&&e.details.isFork),goals=raw.initial.level.goals.map(K),face=e=>['W','A','S','D'][e.properties.face];
const initial={b:t.entities.filter(e=>e.type==='BOX').map(e=>({r:e.pos,orig:e.id,color:e.details.Color,c:null})),p:t.entities.filter(e=>e.type==='PLAYER'&&e.active&&!e.properties.contained).map(e=>({r:e.pos,f:face(e),fork:e.properties.split})),keys:(1<<forks.length)-1,x:0};
const stats={ordinary:0,freeX:0,capture:0,death:0,conflict:0,stack:0,occupied:0},samples=[];
const blocked=r=>walls.has(K(r))||!floors.has(K(r));
function chain(b,r,d,ids){if(blocked(r))return false;const i=b.findIndex(z=>eq(z.r,r));if(i<0)return true;if(!chain(b,add(r,d),d,ids))return false;ids.push(i);return true;}
function finish(s,b,ps,path){
 let keys=s.keys;
 for(const z of b)if(z.c)for(let i=0;i<forks.length;i++)if(keys&(1<<i)&&eq(z.r,forks[i].pos)){keys&=~(1<<i);z.c.fork++;}
 const merged=[];
 for(const z of b){const old=merged.find(q=>eq(q.r,z.r));if(old){stats.stack++;if(samples.length<8)samples.push({kind:'stack',path,pre:s,b,ps});return null;}merged.push(z);}
 const p=[];
 for(const z of ps){for(let i=0;i<forks.length;i++)if(keys&(1<<i)&&eq(z.r,forks[i].pos)){keys&=~(1<<i);z.fork++;}
  const box=merged.find(b=>eq(b.r,z.r));if(box){if(box.c){stats.occupied++;if(samples.length<8)samples.push({kind:'occupied',path,pre:s,b,ps});return null;}stats.capture++;box.c={f:z.f,fork:z.fork,ghost:spikes.has(K(z.r))?1:0};continue;}
  if(spikes.has(K(z.r))){stats.death++;continue;}const q=p.find(q=>eq(q.r,z.r));if(q)q.fork=Math.max(q.fork,z.fork);else p.push(z);
 }
 return{b:merged,p,keys,x:s.x};
}
function step(s,a,path=''){
 if(a==='X'){
  if(s.x>=2||s.b.some(z=>z.c&&z.c.fork>0)||!s.p.some(p=>p.fork>0))return null;
  stats.freeX++;const b=s.b.map(z=>({...z,c:z.c?{...z.c}:null})),ps=[],dirs=new Map();
  for(const p of s.p){if(!p.fork){ps.push({...p});continue;}const opts=[L[p.f],L[L[L[p.f]]],p.f],valid=[];
   for(const d of opts){const r=add(p.r,d),ids=[];if(!chain(s.b,r,d,ids))continue;valid.push({r,f:p.f,fork:p.fork-1});for(const i of ids){if(dirs.has(i)&&dirs.get(i)!==d){stats.conflict++;if(samples.length<8)samples.push({kind:'free-X-conflict',path,pre:s});return null;}dirs.set(i,d);}if(valid.length===2)break;}
   if(!valid.length)valid.push({...p,fork:p.fork-1});ps.push(...valid);
  }
  for(const[i,d]of dirs)b[i].r=add(b[i].r,d);
  const n=finish(s,b,ps,path);if(n)n.x++;return n;
 }
 stats.ordinary++;const b=s.b.map(z=>({...z,c:z.c?{...z.c,f:a}:null})),ps=[],dirs=new Map();
 for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let i=0;i<4;i++,d=L[d]){ids=[];r=add(p.r,d);if(chain(s.b,r,d,ids)){ok=true;break;}}
  ps.push({r:ok?r:p.r,f:ok?d:a,fork:p.fork});if(!ok)continue;
  for(const i of ids){if(dirs.has(i)&&dirs.get(i)!==d){stats.conflict++;if(samples.length<8)samples.push({kind:'ordinary-conflict',path,pre:s});return null;}dirs.set(i,d);}
 }
 for(const[i,d]of dirs)b[i].r=add(b[i].r,d);
 return finish(s,b,ps,path);
}
const mask=s=>goals.reduce((m,g,i)=>m|((s.p.some(p=>K(p.r)===g)||s.b.some(b=>b.c&&!b.c.ghost&&K(b.r)===g))?1<<i:0),0);
const hash=s=>s.b.map(z=>[z.orig,K(z.r),z.c?z.c.fork:'-',z.c&&z.c.fork?z.c.f:'-',z.c?z.c.ghost:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-'].join(':')).sort().join(';')+'|'+s.keys+'|'+s.x;
function replay(path,start=initial){let s=start,trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,n:i+1,trace};trace.push({n:i+1,a:path[i],s});}return{valid:true,s,trace};}
function resource(cap=5000,depth=28,lower=false){const start=replay('SDDDD').s,q=[{s:start,path:''}],seen=new Set([hash(start)]);let head=0,cut=0;
 while(head<q.length&&head<cap){const{ s,path}=q[head++];if(s.b.some(b=>b.c&&b.c.fork===1&&!b.c.ghost&&b.r[0]>1&&b.r[0]<7&&(!lower||b.r[1]<=4))&&s.p.some(p=>p.fork===1))return{hit:{prefix:'SDDDD'+path,tail:path,s},head,seen:seen.size,stats,samples};
  if(path.length>=depth){cut++;continue;}for(const a of 'WASDX'){const n=step(s,a,path+a);if(!n||n.x>1||n.x===1&&n.p.length+n.b.filter(b=>b.c).length<2||n.b.some(b=>b.c&&b.c.ghost))continue;
   // Scope: keep both F1 inventories after the first X until live capture.
   if(n.x===1&&n.p.reduce((sum,p)=>sum+p.fork,0)+n.b.reduce((sum,b)=>sum+(b.c?b.c.fork:0),0)<2)continue;
   const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path:path+a});}
 }
 return{hit:null,head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,cut,cap,depth,stats,samples,scope:'one initial free-X; ordinary rigid chains, two fork1 inventories preserved, no ghost/stack/conflict propagation; goal-union not searched in this resource phase'};
}
const usableCapture=s=>s.p.length===3&&s.b.filter(b=>b.c&&!b.c.ghost&&b.r[0]>=2&&b.r[0]<=6&&b.r[1]>=3&&b.r[1]<=4).length===1;
function four(cap=5000,depth=28){const prefix='SDDDDWXAX',start=replay(prefix).s,q=[{s:start,path:''}],seen=new Set([hash(start)]);let head=0,cut=0;
 while(head<q.length&&head<cap){const{s,path}=q[head++];if(usableCapture(s))return{hit:{prefix:prefix+path,tail:path,s},head,seen:seen.size,stats,samples};
  if(path.length>=depth){cut++;continue;}for(const a of 'WASD'){const n=step(s,a,path+a);if(!n||n.p.length!==4||n.b.some(b=>b.c))continue;const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path:path+a});
   // Captures are inspected separately; preserve them to the next target test.
  }
  for(const a of 'WASD'){const n=step(s,a,path+a);if(n&&usableCapture(n))return{hit:{prefix:prefix+path+a,tail:path+a,s:n},head,seen:seen.size,stats,samples};}
 }
 return{hit:null,head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,cut,cap,depth,stats,samples,scope:'actual9 four-F0 ordinary first live capture preserving three outside; stops conflict/stack/ghost/merge loss, no X remaining'};
}
// New domain: all F0 ordinary branches from actual9. Multi-origin stacks are
// conditional groups; their Goal observation copies one shared cargo to each
// retained object (M084/M109). Double cargo / occupied capture stays a boundary.
const multiStats={steps:0,conflicts:0,stacks:0,observations:0,capture:0,ghostCapture:0,occupied:0,doubleCargo:0,death:0},multiSamples=[];
const multiStart=()=>{const z=replay('SDDDDWXAX').s;return{b:z.b.map(b=>({r:b.r,ids:[b.orig],c:null})),p:z.p.map(p=>p.r)};};
const mhash=s=>s.b.map(b=>[b.ids.join('+'),K(b.r),b.c?b.c.ghost:'-'].join(':')).sort().join(';')+'|'+s.p.map(K).sort().join(';');
const mmask=s=>goals.reduce((m,g,i)=>m|((s.p.some(p=>K(p)===g)||s.b.some(b=>b.c&&!b.c.ghost&&K(b.r)===g))?1<<i:0),0);
const mchain=(b,r,d,ids)=>{if(blocked(r))return false;const i=b.findIndex(z=>eq(z.r,r));if(i<0)return true;if(!mchain(b,add(r,d),d,ids))return false;ids.push(i);return true;};
function mstep(s,a,path='',choices=[]){
 multiStats.steps++;const plans=[],req=new Map();
 for(const p of s.p){let d=a,r=p,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p,d);ids=[];if(mchain(s.b,r,d,ids)){ok=true;break;}}
  plans.push({r:ok?r:p,ids:ok?ids:[],d});if(!ok)continue;for(const i of ids){if(!req.has(i))req.set(i,new Set());req.get(i).add(d);}
 }
 const cf=[...req].filter(([i,ds])=>ds.size>1),assignments=[];
 const assign=(j,c)=>{if(j===cf.length){assignments.push(c);return;}for(const d of cf[j][1])assign(j+1,{...c,[cf[j][0]]:d});};assign(0,{});
 const out=[];
 for(const chosen of assignments){const keep=plans.filter(p=>p.ids.every(i=>chosen[i]===undefined||chosen[i]===p.d)),dirs=new Map();let bad=false;
  for(const p of keep)for(const i of p.ids){if(dirs.has(i)&&dirs.get(i)!==p.d)bad=true;dirs.set(i,p.d);}if(bad||cf.some(([i])=>dirs.get(i)!==chosen[i]))continue;
  const moved=s.b.map((b,i)=>({r:dirs.has(i)?add(b.r,dirs.get(i)):b.r,ids:[...b.ids],c:b.c?{...b.c}:null})),bs=[];let stackNow=false;
  for(const b of moved){const q=bs.find(q=>eq(q.r,b.r));if(!q){bs.push(b);continue;}if(q.c&&b.c){multiStats.doubleCargo++;if(multiSamples.filter(s=>s.kind==='double-cargo').length<2)multiSamples.push({kind:'double-cargo',path,choices,pre:s,moved});bad=true;break;}
   q.ids.push(...b.ids);q.ids.sort((a,b)=>a-b);if(b.c)q.c=b.c;stackNow=true;multiStats.stacks++;
  }if(bad)continue;
  const ps=[];
  for(const z of keep){const box=bs.find(b=>eq(b.r,z.r));if(box){if(box.c){multiStats.occupied++;if(multiSamples.filter(s=>s.kind==='occupied-cargo').length<2)multiSamples.push({kind:'occupied-cargo',path,choices,pre:s,boxes:bs,plans:keep});bad=true;break;}box.c={ghost:spikes.has(K(z.r))?1:0};multiStats.capture++;if(box.c.ghost)multiStats.ghostCapture++;continue;}
   if(spikes.has(K(z.r))){multiStats.death++;continue;}if(!ps.some(p=>eq(p,z.r)))ps.push(z.r);
  }if(bad)continue;
  if(stackNow&&multiSamples.filter(s=>s.kind==='stack').length<3)multiSamples.push({kind:'stack',path,choices,pre:s,post:{b:bs,p:ps},conditional:true});
  const observed=bs.find(b=>b.ids.length>1&&goals.includes(K(b.r)));
  if(observed){multiStats.observations++;for(const id of observed.ids)out.push({s:{b:bs.map(b=>b===observed?{r:b.r,ids:[id],c:b.c?{...b.c}:null}:b),p:ps},axis:{push:chosen,observation:id},conditional:stackNow});}
  else out.push({s:{b:bs,p:ps},axis:cf.length?{push:chosen}:null,conditional:stackNow});
 }
 if(cf.length){multiStats.conflicts++;if(multiSamples.filter(s=>s.kind==='conflict').length<3)multiSamples.push({kind:'conflict',path,choices,pre:s,branches:out});}
 return out;
}
function multileaf(cap=8000,depth=34){
 const root=multiStart(),q=[{s:root,path:'',choices:[],edges:[],options:new Map()}],seen=new Map([[mhash(root),0]]);let head=0,cut=0;
 while(head<q.length&&head<cap){const z=q[head++];z.options.set(mmask(z.s),{stop:mmask(z.s)});if(!z.s.p.length)continue;if(z.path.length>=depth){cut++;continue;}
  for(const a of 'WASD'){const ns=mstep(z.s,a,z.path+a,z.choices),children=[];
   for(let j=0;j<ns.length;j++){const n=ns[j],h=mhash(n.s);let id=seen.get(h);if(id===undefined){id=q.length;seen.set(h,id);q.push({s:n.s,path:z.path+a,choices:z.choices.concat(ns.length>1?[{at:z.path.length+1,key:a,branch:j,axis:n.axis}]:[]),edges:[],options:new Map()});}children.push(id);}
   if(children.length)z.edges.push({a,children,axes:ns.map(n=>n.axis)});
  }
 }
 // Every discovered partial leaf is a legal stop, including no-control states.
 for(const z of q)if(!z.options.size)z.options.set(mmask(z.s),{stop:mmask(z.s)});
 let changed=true,passes=0,adds=0;
 while(changed&&passes++<128){changed=false;for(let i=q.length-1;i>=0;i--){const z=q[i];for(const e of z.edges){let combos=new Map([[0,[]]]);
   for(const id of e.children){const next=new Map();for(const[cm,cp]of combos)for(const[m,p]of q[id].options){const u=cm|m;if(!next.has(u))next.set(u,cp.concat([p]));}combos=next;}
   for(const[m,plans]of combos)if(!z.options.has(m)){z.options.set(m,{a:e.a,axes:e.axes,children:plans});changed=true;adds++;}
  }}if(q[0].options.has(63))break;}
 const render=(p,prefix='')=>{if(p.stop!==undefined)return{prefix,mask:p.stop};if(p.children.length===1)return render(p.children[0],prefix+p.a);return{prefix:prefix+p.a,axes:p.axes,leaves:p.children.map(c=>render(c))};};
 const goalExamples={};for(const z of q){const gm=mmask(z.s);if(gm&&!goalExamples[gm])goalExamples[gm]={path:z.path,choices:z.choices,s:z.s};}
 return{hit:q[0].options.has(63)?render(q[0].options.get(63)):null,source:'actual9 SDDDDWXAX',expanded:head,seen:q.length,pending:q.length-head,exhausted:head===q.length,cut,cap,depth,dpPasses:passes,dpAdds:adds,rootMasks:[...q[0].options.keys()].sort((a,b)=>a-b),stats:multiStats,samples:multiSamples,goalExamples,scope:'arbitrary recursive compatible leaf Goal union63; F0 ordinary rigid chains and force conflict; two-object stack/Goal cargo inheritance conditional pending 4-17 probe; double-cargo stack/occupied capture stop; no X/key/ghost revival'};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='replay'?replay(process.argv[3]||''):process.argv[2]==='four'?four(Number(process.argv[3])||5000,Number(process.argv[4])||28):process.argv[2]==='multi'?multileaf(Number(process.argv[3])||8000,Number(process.argv[4])||34):resource(Number(process.argv[2])||5000,Number(process.argv[3])||28),null,2));
module.exports={initial,step,replay,resource,four,mask,walls,floors,spikes,blocked,mstep,multiStart,multileaf,mmask};
