// Self-owned copy of public geometry/ordinary step; no game API or hidden source.
// Private observed-state replay for 4-19. No game/implementation/save access.
// This checks transport geometry; optical completion is deliberately read from
// actual observations rather than inferred from player-to-Goal coordinates.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-19.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],K=r=>r.join(','),eq=(a,b)=>K(a)===K(b);
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]],clone=z=>JSON.parse(JSON.stringify(z));
const walls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos)));
const floors=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos)));
const spikes=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const forks=t.entities.filter(e=>e.type==='KEY'&&e.details.isFork);
const initial={b:t.entities.filter(e=>e.type==='BOX'||e.type==='PRISM').map(e=>({r:e.pos,orig:e.id,kind:e.type,color:e.details.Color,c:null})),p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({r:e.pos,f:['W','A','S','D'][e.properties.face],fork:e.properties.split})),keys:(1<<forks.length)-1};
const blocked=r=>walls.has(K(r))||!floors.has(K(r));
const boundaryStats={stack:0,conflict:0,occupied:0},boundarySamples=[];let currentPath='';
function boundary(kind,s,post){boundaryStats[kind]++;if(boundarySamples.filter(q=>q.kind===kind).length<3)boundarySamples.push({kind,path:currentPath,pre:s,post});}
function chain(bs,r,d,ids){if(blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function finish(s,bs,ps){
 let keys=s.keys;for(const b of bs)if(b.c)for(let i=0;i<forks.length;i++)if(keys&(1<<i)&&eq(b.r,forks[i].pos)){keys&=~(1<<i);b.c.fork++;}
 const merged=[];for(const b of bs){const old=merged.find(q=>eq(q.r,b.r));if(!old){merged.push(b);continue;}if(old.orig!==b.orig){boundary('stack',s,{b:bs,p:ps});return null;}if(!old.c&&b.c)old.c=b.c;else if(old.c&&b.c)old.c.fork=Math.max(old.c.fork,b.c.fork);}
 const p=[];for(const z of ps){for(let i=0;i<forks.length;i++)if(keys&(1<<i)&&eq(z.r,forks[i].pos)){keys&=~(1<<i);z.fork++;}const b=merged.find(b=>eq(b.r,z.r));
  if(b){if(b.kind!=='BOX')return null;if(b.c&&z.fork>0){boundary('occupied',s,{b:bs,p:ps});return null;}if(!b.c)b.c={f:z.f,fork:z.fork,ghost:spikes.has(K(z.r))?1:0};continue;}
  if(spikes.has(K(z.r)))continue;const old=p.find(p=>eq(p.r,z.r));if(old)old.fork=Math.max(old.fork,z.fork);else p.push(z);
 }return{b:merged,p,keys};
}
function step(s,a,path=''){
 currentPath=path;
 let bs,plans=[];
 if(a==='X'){
  const cargo=s.b.filter(b=>b.c?.fork>0);if(!cargo.length&&!s.p.some(p=>p.fork>0))return null;
  bs=s.b.filter(b=>!b.c||b.c.fork===0).map(clone);
  const birth=(r,f,fork,kind,parent)=>{let n=0;for(const d of [L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(!chain(bs,q,d,ids))continue;plans.push({r:q,f,fork,d,ids,kind,parent});if(++n===2)return;}if(!n)plans.push({r,f,fork,d:f,ids:[],kind,parent});};
  for(const b of cargo)birth(b.r,b.c.f,b.c.fork-1,'cargo',b);
  for(const p of s.p)if(p.fork)birth(p.r,p.f,p.fork-1,'free',p);else plans.push({...p,d:p.f,ids:[],kind:'free',parent:p});
 }else{
  bs=s.b.map(b=>({...clone(b),c:b.c?{...b.c,f:a}:null}));
  for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let i=0;i<4;i++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({r:ok?r:p.r,f:ok?d:a,fork:p.fork,d,ids:ok?ids:[],kind:'free',parent:p});}
 }
 const dirs=new Map();for(const p of plans)for(const i of p.ids){if(dirs.has(i)&&dirs.get(i)!==p.d){boundary('conflict',s,{plans});return null;}dirs.set(i,p.d);}
 for(const[i,d]of dirs)bs[i].r=add(bs[i].r,d);
 const ps=[];for(const p of plans)if(p.kind==='cargo')bs.push({r:p.r,orig:p.parent.orig,kind:'BOX',color:p.parent.color,c:{...p.parent.c,fork:p.fork}});else ps.push({r:p.r,f:p.f,fork:p.fork});
 return finish(s,bs,ps);
}
function replay(path,start=initial){let s=clone(start),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,n:i+1,trace};trace.push({n:i+1,a:path[i],boxes:s.b.filter(b=>b.kind==='BOX'),players:s.p});}return{valid:true,s,trace};}
// Conditional complete coverage of all three downward rays in the fixed upper
// Prism cluster. An adjacent BOX closes a ray (M054); a farther empty BOX does
// not earn observation. This is a strong candidate predicate, never game credit.
function rays(s){return [5,6,7].map(x=>s.b.some(b=>b.kind==='BOX'&&eq(b.r,[x,7]))||s.p.some(p=>p.r[0]===x&&p.r[1]>=6&&p.r[1]<=7)||s.b.some(b=>b.c&&!b.c.ghost&&b.r[0]===x&&b.r[1]>=6&&b.r[1]<=7));}
const hash=s=>s.b.filter(b=>b.kind==='BOX').map(b=>[b.orig,K(b.r),b.c?b.c.fork:'-',b.c?.fork?b.c.f:'-',b.c?b.c.ghost:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-'].join(':')).sort().join(';')+'|'+s.keys;

const full25='WDAXDDWWWSAWWSDDWWSAWSDAX';
const pre=replay(full25.slice(0,-1)),post=replay(full25);
if(!pre.valid||!post.valid)throw Error('Root new25 fixed replay fails');
const seed=post.s;
if(seed.b.filter(z=>z.kind==='BOX'&&z.c).length!==3||seed.p.length!==1||seed.p[0].r.join(',')!=='3,1')throw Error('Wrong three-cargo seed');
function brief(s){return{boxes:s.b.filter(z=>z.kind==='BOX'),free:s.p,prisms:s.b.filter(z=>z.kind==='PRISM'),rays:rays(s)};}
for(const k of Object.keys(boundaryStats))boundaryStats[k]=0;boundarySamples.splice(0);
function newOrdinaryTail(cap=2000,depth=35){
 const q=[{s:seed,path:''}],seen=new Set([hash(seed)]);let head=0,cut=0,rejectedGhost=0,rayMax=0,ever=[false,false,false],maxBoxY=0,maxFreeY=0;const good={};
 while(head<q.length&&head<cap){const z=q[head++],rr=rays(z.s),n=rr.filter(Boolean).length;rayMax=Math.max(rayMax,n);rr.forEach((v,i)=>{if(v)ever[i]=true;});maxBoxY=Math.max(maxBoxY,...z.s.b.filter(b=>b.kind==='BOX').map(b=>b.r[1]));maxFreeY=Math.max(maxFreeY,...z.s.p.map(p=>p.r[1]));if(!good[n])good[n]={tail:z.path,state:brief(z.s)};if(n===3)return{hit:{tail:z.path,full:full25+z.path,state:brief(z.s)},expanded:head,seen:seen.size,pending:q.length-head,cap,depth,depthCut:cut,rejectedGhost,rayMax,ever,maxBoxY,maxFreeY};
 if(z.path.length>=depth){cut++;continue;}for(const a of 'WASD'){const n=step(z.s,a,full25+z.path+a);if(!n)continue;if(n.b.some(b=>b.c?.ghost)){rejectedGhost++;continue;}const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path:z.path+a});}}
 return{hit:null,expanded:head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,cap,depth,depthCut:cut,rejectedGhost,rayMax,ever,maxBoxY,maxFreeY,examples:good};
}
if(require.main===module){const mode=process.argv[2]||'fixed';const result=mode==='search'?newOrdinaryTail():{valid:post.valid,pre24:brief(pre.s),post25:brief(seed),trace:post.trace.filter(z=>z.n>=19)};console.log(JSON.stringify({source:'model-only25 from actual9',full25,count:full25.length,result,boundaries:boundaryStats,boundarySamples,liveHandle:null,scope:'one new exact25 ordinary-only tail, same public baseline step copied for boundary counters; no X/new independent stack/conflict/Ghost/unknown highFork occupied capture propagation; all three southern rays only a sufficient candidate, never actual credit'},null,2));}
module.exports={seed,step,replay,newOrdinaryTail,brief,full25};
