// Self-owned, public-observation resource search. No game/save/KB mutation.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-20.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),clone=s=>JSON.parse(JSON.stringify(s));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const walls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos))),floors=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spikes=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
if(t.tiles.some(e=>e.type==='ICE'))throw Error('ICE not implemented in this private domain');
const actual4={b:t.entities.filter(e=>e.type==='BOX').map(e=>({r:e.pos,orig:e.id,color:e.details.Color,c:null})),p:[{r:[4,6],f:'S',fork:3}]};
const stats={moves:0,conflict:0,stack:0,occupied:0,ghost:0,death:0,capture:0},samples=[];
const blocked=r=>walls.has(K(r))||!floors.has(K(r));
function chain(bs,r,d,ids){if(blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function boundary(kind,path,s,post){stats[kind]++;if(samples.filter(q=>q.kind===kind).length<3)samples.push({kind,path,pre:clone(s),post});}
function step(s,a,path=''){
 stats.moves++;let bs,plans=[];
 if(a==='X'){
  const cargo=s.b.filter(b=>b.c?.fork>0);if(!cargo.length&&!s.p.some(p=>p.fork))return null;
  bs=s.b.filter(b=>!b.c||!b.c.fork).map(clone);
  function birth(r,f,fork,kind,parent){let n=0;for(const d of [L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(!chain(bs,q,d,ids))continue;plans.push({r:q,f,fork,d,ids,kind,parent});if(++n===2)return;}if(!n)plans.push({r,f,fork,d:f,ids:[],kind,parent});}
  for(const b of cargo)birth(b.r,b.c.f,b.c.fork-1,'cargo',b);
  for(const p of s.p)if(p.fork)birth(p.r,p.f,p.fork-1,'free',p);else plans.push({...p,d:p.f,ids:[],kind:'free',parent:p});
 }else{
  bs=s.b.map(b=>({...clone(b),c:b.c?{...b.c,f:a}:null}));
  for(const p of s.p){let d=a,ids=[],r=p.r,ok=false;for(let i=0;i<4;i++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({r:ok?r:p.r,f:ok?d:a,fork:p.fork,d,ids:ok?ids:[],kind:'free',parent:p});}
 }
 const dirs=new Map();for(const p of plans)for(const i of p.ids){if(dirs.has(i)&&dirs.get(i)!==p.d){boundary('conflict',path,s,{plans});return null;}dirs.set(i,p.d);}
 for(const[i,d]of dirs)bs[i].r=add(bs[i].r,d);
 const ps=[];for(const p of plans)if(p.kind==='cargo')bs.push({r:p.r,orig:p.parent.orig,color:p.parent.color,c:{...p.parent.c,fork:p.fork}});else ps.push({r:p.r,f:p.f,fork:p.fork});
 const merged=[];for(const b of bs){const old=merged.find(q=>eq(q.r,b.r));if(!old){merged.push(b);continue;}if(old.orig!==b.orig){boundary('stack',path,s,{b:bs,p:ps});return null;}if(!old.c&&b.c)old.c=b.c;else if(old.c&&b.c)old.c.fork=Math.max(old.c.fork,b.c.fork);}
 const p=[];for(const z of ps){const b=merged.find(b=>eq(b.r,z.r));if(b){if(b.c&&z.fork&&!(b.c.fork===1&&z.fork===1&&!b.c.ghost&&!spikes.has(K(z.r)))){boundary('occupied',path,s,{b:bs,p:ps});return null;}if(!b.c){b.c={f:z.f,fork:z.fork,ghost:spikes.has(K(z.r))?1:0};stats.capture++;if(b.c.ghost)stats.ghost++;}continue;}if(spikes.has(K(z.r))){stats.death++;continue;}const old=p.find(p=>eq(p.r,z.r));if(old)old.fork=Math.max(old.fork,z.fork);else p.push(z);}
 return{b:merged,p};
}
const hash=s=>s.b.map(b=>[b.orig,b.color,K(b.r),b.c?.fork??'-',b.c?.fork?b.c.f:'-',b.c?.ghost||0].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-'].join(':')).sort().join(';');
const actors=s=>s.p.length+s.b.filter(b=>b.c&&!b.c.ghost).length;
const blueTarget=s=>s.b.some(b=>b.color===3&&b.c?.fork===2&&!b.c.ghost)&&s.p.length===1&&s.p[0].fork===2&&actors(s)===2;
const threeTarget=s=>s.b.filter(b=>b.c?.fork===1&&!b.c.ghost).length===3&&s.p.length===1&&s.p[0].fork===1&&actors(s)===4;
function replay(path,start=actual4){let s=clone(start),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,n:i+1,trace};trace.push({n:i+1,a:path[i],s:clone(s)});}return{valid:true,s,trace};}

// New exact26 ordinary -> one last global X -> ordinary tail; no old search runs.
const historicalModel26='SSSSAASSSAAAAWWWSXAWWDSDAX';
const full26='SSSSSSDDSSSSAAWWSXAWWDSDAX',rr=replay(full26.slice(4)),seed=rr.s;
if(!rr.valid||!threeTarget(seed))throw Error('New26 fixed replay/source predicate failed');
const rawInitial=raw.initial.level.timelines[0],goal=raw.initial.level.goals[0];
const eqGoal=p=>K(p)===K(goal),liveGoal=s=>s.p.some(p=>eqGoal(p.r))||s.b.some(b=>b.c&&!b.c.ghost&&eqGoal(b.r));
const physicalActors=s=>s.p.length+s.b.filter(b=>b.c&&!b.c.ghost).length;
const summary=s=>({boxes:s.b,free:s.p,liveActors:physicalActors(s)});
const directX=step(seed,'X',full26+'X');
function stage(s){return s.b.length===6&&[3,4,5,6,7,8].every(y=>s.b.some(b=>eq(b.r,[2,y])&&b.c&&!b.c.ghost))&&[[2,2],[4,3]].every(r=>s.p.some(p=>eq(p.r,r)));}
function lastForkTail(cap=6000,depth=45){
 for(const k of Object.keys(stats))stats[k]=0;samples.splice(0);
 const q=[{s:clone(seed),path:'',x:0}],seen=new Set([hash(seed)+'|0']);let head=0,cut=0,lostBeforeX=0,noControl=0,rejectedGhost=0,firstSixTwo=null,maxBoxY=0,firstRaised=null,hit=null;
 while(head<q.length&&head<cap){const z=q[head++];for(const b of z.s.b)if(b.c&&b.r[1]>maxBoxY){maxBoxY=b.r[1];firstRaised={tail:z.path,x:z.x,s:summary(z.s)};}
  if(liveGoal(z.s)){hit={kind:'liveGoal',tail:z.path,full:full26+z.path,s:summary(z.s)};break;}
  if(z.x&&stage(z.s)){hit={kind:'six-col2+two-free-stage',tail:z.path,full:full26+z.path,conditionTail:'WWSDDDSDDWWWWAAAWWWWWAA',s:summary(z.s)};break;}
  if(z.x&&z.s.b.length===6&&z.s.p.length>=2&&!firstSixTwo)firstSixTwo={tail:z.path,full:full26+z.path,s:summary(z.s)};
  if(z.path.length>=depth){cut++;continue;}
  for(const a of z.x?'WASD':'WASDX'){const n=step(z.s,a,full26+z.path+a);if(!n)continue;const nx=z.x+(a==='X'?1:0);
   if(n.b.some(b=>b.c?.ghost)){rejectedGhost++;continue;}
   if(!nx&&!threeTarget(n)){lostBeforeX++;continue;}
   if(nx&&!n.p.length&&!liveGoal(n)){noControl++;continue;}
   const h=hash(n)+'|'+nx;if(seen.has(h))continue;seen.add(h);q.push({s:n,path:z.path+a,x:nx});}
 }
 return{hit,expanded:head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,cap,depth,depthCut:cut,lostBeforeX,noControl,rejectedGhost,maxBoxY,firstRaised,firstSixTwo,stats:{...stats},samples:clone(samples)};
}
function condition23(){const bodies=Array.from({length:6},(_,i)=>({r:[2,3+i],orig:100+i,color:4,c:{f:'W',fork:0,ghost:0}}));const source={b:bodies,p:[{r:[2,2],f:'W',fork:0},{r:[4,3],f:'W',fork:0}]};const tail='WWSDDDSDDWWWWAAAWWWWWAA',res=replay(tail,source);return{tail,count:tail.length,valid:res.valid,liveGoal:res.valid&&liveGoal(res.s),end:res.valid?summary(res.s):null,trace:res.trace};}
if(require.main===module){const mode=process.argv[2]||'fixed';const result=mode==='search'?lastForkTail():{full26,historicalModel26,count:full26.length,valid:rr.valid,pre25:replay(full26.slice(4,-1)).s,seed26:summary(seed),last4:rr.trace.slice(-4),directX27:directX?summary(directX):null,condition23:condition23()};console.log(JSON.stringify({status:'actual26-source-tail-model-only',sourceProof:{file:'artifacts/slot1-playthrough/4-20.json',event:47,frame:12591791,time:26},mode,result,liveHandle:null,scope:'Self-owned public blue-resource step copy; M116 safe1+1 occupied fusion added; independent stack/force/highFork occupied/Ghost stopped. One exact26 all-F1 resource, ordinary before exactly one last X then ordinary goal or strict six-box stage. All rows allowed; no ICE/extraFork/hidden implementation. Root source and next input owner remain unchanged.'},null,2));}
module.exports={seed,step,replay,lastForkTail,summary,full26};
