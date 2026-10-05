// Readonly observed 4-18 model. No game API, save or primary KB writes.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-18.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const walls=new Set(t.entities.filter(e=>e.class==='Wall'||e.type==='LOCK'||e.type==='BUTTONGATE').map(e=>K(e.pos))),baseWalls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos)));
const floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos))),ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>K(e.pos)));
let activeState=null,activePlayer=null;
const block=r=>{if(!activeState?.full)return walls.has(K(r))||!floor.has(K(r));if(baseWalls.has(K(r))||!floor.has(K(r)))return true;
 if(eq(r,[9,5])&&activeState.lock&&!(activePlayer?.key>0))return true;
 const ix=eq(r,[5,2])?0:eq(r,[6,2])?1:-1;if(ix>=0){const button=ix===0?[8,6]:[7,6],es=[...activeState.b,...activeState.p.filter(Boolean)];if(!es.some(z=>eq(z.r,button)||eq(z.r,r)))return true;}
 return false;};
const clone=s=>JSON.parse(JSON.stringify(s));
const start={b:[{r:[8,2],color:2,c:null}],p:[{r:[8,4],f:'W',fork:1,key:0,id:77},{r:[9,4],f:'W',fork:1,key:0,id:78}]};
const stats={steps:0,death:0,capture:0,conflict:0,occupied:0,movingOverlap:0,iceBox:0},samples=[];
function chain(bs,r,d,ids){if(block(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function step(s,a,path=''){
 stats.steps++;s=clone(s);activeState=s;activePlayer=null;for(const b of s.b)if(b.c)b.c.f=a;
 let pm=new Map(s.p.map((p,i)=>[i,a])),bm=new Map();
 for(let micro=0;micro<12;micro++){
  const oldp=s.p.map(p=>p?{...p,r:[...p.r]}:null),plans=new Map(),req=new Map();
  const request=(i,d)=>{if(req.has(i)&&req.get(i)!==d){stats.conflict++;if(samples.length<6)samples.push({kind:'active-vs-inertia-conflict',path,micro,s});return false;}req.set(i,d);return true;};
  for(const[i,old]of pm){const p=s.p[i];if(!p)continue;activePlayer=p;let d=old,r=p.r,ids=[],ok=false;
   for(let turn=0;turn<(micro===0?4:1);turn++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}
   if(!ok){plans.set(i,{r:p.r,d:old,ids:[],ok:false});continue;}plans.set(i,{r,d,ids,ok:true});for(const j of ids)if(!request(j,d))return null;
  }
  activePlayer=null;for(const[i,d]of bm){const ids=[];if(chain(s.b,add(s.b[i].r,d),d,ids)){if(!request(i,d))return null;for(const j of ids)if(!request(j,d))return null;}}
  const oldb=s.b.map(b=>b.r),nbm=new Map();for(const[i,d]of req){const target=add(oldb[i],d);if(ice.has(K(target))){audit.boxIce++;return null;}s.b[i].r=target;}if(new Set(s.b.map(b=>K(b.r))).size!==s.b.length){audit.stack++;return null;}
  bm=nbm;const npm=new Map();
  for(const[i,z]of plans){const p=s.p[i];p.r=z.r;if(z.ok)p.f=z.d;if(s.full&&s.lock&&eq(p.r,[9,5])&&p.key>0){p.key--;s.lock=false;}if(z.ok&&ice.has(K(z.r))&&!z.ids.length)npm.set(i,z.d);}
  if(s.full&&s.lastFork){for(const z of [...s.b.filter(b=>b.c).map(b=>({r:b.r,c:b.c})),...s.p.filter(Boolean).map(p=>({r:p.r,c:p}))])if(s.lastFork&&eq(z.r,[3,6])){z.c.fork++;s.lastFork=false;}}
  for(let i=0;i<s.p.length;i++){const p=s.p[i];if(!p)continue;const b=s.b.find(b=>eq(b.r,p.r));if(b){if(b.c){stats.occupied++;return null;}b.c={f:p.f,fork:p.fork,key:p.key,id:p.id,ghost:spike.has(K(p.r))?1:0};stats.capture++;s.p[i]=null;npm.delete(i);}else if(spike.has(K(p.r))){stats.death++;s.p[i]=null;npm.delete(i);}}
  for(let i=0;i<s.p.length;i++)for(let j=i+1;j<s.p.length;j++){const p=s.p[i],q=s.p[j];if(!p||!q||!eq(p.r,q.r))continue;if(npm.has(i)||npm.has(j)){const pi=plans.get(i),pj=plans.get(j),pair=(eq(oldp[i].r,[8,3])&&pi.d==='D'&&eq(oldp[j].r,[9,2])&&pj.d==='W')||(eq(oldp[j].r,[8,3])&&pj.d==='D'&&eq(oldp[i].r,[9,2])&&pi.d==='W');if(observedCross&&a==='D'&&micro===0&&eq(p.r,[9,3])&&ice.has('9,3')&&baseWalls.has('10,3')&&pair&&npm.has(i)&&npm.has(j)&&!pi.ids.length&&!pj.ids.length&&!p.fork&&!q.fork&&!p.key&&!q.key&&!s.b.some(b=>eq(b.r,[9,3])||eq(b.r,[9,4]))){audit.observedDWCross++;if(crossSamples.length<4)crossSamples.push({path,micro,preFree:oldp,contact:s.p.map(p=>p?{...p,r:[...p.r]}:null)});continue;}stats.movingOverlap++;if(samples.length<6)samples.push({kind:'moving-overlap-unmodeled',path,micro,s});return null;}p.fork=Math.max(p.fork,q.fork);s.p[j]=null;}
  pm=npm;if(!pm.size&&!bm.size)break;
 }
 s.p=s.p.filter(Boolean);return s;
}
const hash=s=>s.b.map(b=>[K(b.r),b.c?b.c.fork:'-',b.c?b.c.f:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.f].join(':')).sort().join(';');
function actual40(){const l=raw.events.map(e=>e.observation?.level).filter(l=>l?.instructions.length===40).at(-1);if(!l)throw Error('No actual40 frame');const es=l.timelines.find(t=>t.id===l.current_timeline)?.entities||l.timelines[0].entities;return{full:true,lock:true,lastFork:true,b:es.filter(e=>e.type==='BOX'&&e.active).map(b=>{const p=es.find(p=>p.type==='PLAYER'&&p.active&&p.properties.contained&&p.properties.container===b.id);return{r:b.pos,color:b.details.Color,orig:b.details.Color===2?73:b.id,c:p?{id:p.id,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key,ghost:p.properties.ghost}:null};}),p:es.filter(p=>p.type==='PLAYER'&&p.active&&!p.properties.contained).map(p=>({id:p.id,r:p.pos,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key}))};}

const audit={boxIce:0,stack:0,birthBoxIce:0,birthPushIce:0,birthOverlap:0,observedDWCross:0};
let observedCross=false;const crossSamples=[];
function replay(path,source){let s=clone(source),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,n:i+1,trace};trace.push({n:i+1,a:path[i],s:clone(s)});}return{valid:true,s,trace};}
function observedN(count){const event=raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='mingle'&&z.o.level.instructions.length===count).at(-1);if(!event)throw Error('No actual'+count);const l=event.o.level,tl=l.timelines.find(t=>t.id===l.current_timeline)||l.timelines[0],es=tl.entities;return{ref:{event:event.i,frame:event.o.frame,time:tl.time,instructions:l.instructions},s:{full:true,lock:es.some(e=>e.type==='LOCK'&&e.active),lastFork:false,b:es.filter(e=>e.type==='BOX'&&e.active).map(b=>{const p=es.find(p=>p.type==='PLAYER'&&p.active&&p.properties.contained&&p.properties.container===b.id);return{r:b.pos,color:b.details.Color,orig:b.details.Color===2?73:b.id,c:p?{id:p.id,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key,ghost:p.properties.ghost}:null};}),p:es.filter(p=>p.type==='PLAYER'&&p.active&&!p.properties.contained).map(p=>({id:p.id,r:p.pos,f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key}))}};}
const source=observedN(40);source.s.lastFork=true;
function birthX(s){
 const bs=s.b.filter(b=>!b.c?.fork).map(clone),plans=[];activeState={...s,b:bs};activePlayer=null;
 function birth(r,f,fork,kind,parent){let n=0;for(const d of [L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(chain(bs,q,d,ids)){plans.push({r:q,f,fork,kind,parent,d,ids});if(++n===2)return;}}if(!n)plans.push({r,f,fork,kind,parent,d:f,ids:[]});}
 for(const b of s.b.filter(b=>b.c?.fork))birth(b.r,b.c.f,b.c.fork-1,'cargo',b);
 for(const p of s.p)if(p.fork)birth(p.r,p.f,p.fork-1,'free',p);else plans.push({...p,kind:'free',parent:p,d:p.f,ids:[]});
 const dirs=new Map();for(const p of plans)for(const i of p.ids){if(dirs.has(i)&&dirs.get(i)!==p.d)return{valid:false,reason:'force'};dirs.set(i,p.d);}
 for(const[i,d]of dirs){bs[i].r=add(bs[i].r,d);if(ice.has(K(bs[i].r))){audit.birthBoxIce++;return{valid:false,reason:'box-ICE'};}}
 const ps=[];for(const p of plans)if(p.kind==='cargo'){if(ice.has(K(p.r))){audit.birthBoxIce++;return{valid:false,reason:'cargo-birth-ICE'};}bs.push({r:p.r,color:p.parent.color,orig:p.parent.orig,c:{...p.parent.c,fork:p.fork}});}else ps.push({r:p.r,f:p.f,fork:p.fork,key:p.parent.key,id:p.parent.id,birthdir:p.d});
 if(new Set(bs.map(b=>K(b.r))).size!==bs.length){audit.stack++;return{valid:false,reason:'box-overlap'};}
 if(ps.some(p=>bs.some(b=>eq(b.r,p.r))))return{valid:false,reason:'birth-capture-not-this-minimal-rule'};
 const before={...s,b:bs,p:ps.map(({birthdir,...p})=>p)},slide=[];activeState=before;
 for(const p of ps){if(spike.has(K(p.r)))return{valid:false,reason:'naked-SPIKE-birth'};if(!ice.has(K(p.r)))continue;const q=add(p.r,p.birthdir),ids=[];activePlayer=p;
  if(!chain(bs,q,p.birthdir,ids)){slide.push({from:p.r,to:p.r,d:p.birthdir,blocked:true,extraTicks:0});continue;}
  if(ids.length){audit.birthPushIce++;return{valid:false,reason:'birth-ICE-push-not-this-minimal-rule'};}
  if(ice.has(K(q))){return{valid:false,reason:'multiple-ICE-not-this-minimal-rule'};}
  if(ps.some(z=>z!==p&&eq(z.r,q))||spike.has(K(q))){audit.birthOverlap++;return{valid:false,reason:'birth-slide-overlap/SPIKE'};}
  slide.push({from:p.r,to:q,d:p.birthdir,blocked:false,extraTicks:1});p.r=q;
 }
 activePlayer=null;return{valid:true,s:{...s,b:bs,p:ps.map(({birthdir,...p})=>p)},plans:plans.map(p=>({r:p.r,f:p.f,fork:p.fork,kind:p.kind,d:p.d,push:p.ids.map(i=>bs[i]?.orig)})),before,slide};
}

// One new actual40+AX left-resource domain; not fixed63 or globalGoal search.
const a=replay('A',source.s);if(!a.valid)throw Error('actual40 A invalid');const x=birthX(a.s);if(!x.valid)throw Error('actual40 AX invalid');
const seed=x.s,leftOrig=new Set([74,75]),alive=s=>s.p.length+s.b.filter(b=>b.c&&!b.c.ghost).length;
const hh=s=>s.b.map(b=>[b.orig,b.color,K(b.r),b.c?.fork??'-',b.c?.fork?b.c.f:'-',b.c?.key??'-',b.c?.ghost??'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-',p.key].join(':')).sort().join(';')+'|'+s.lock+'|'+s.lastFork;
const target=s=>s.b.some(b=>leftOrig.has(b.orig)&&eq(b.r,[3,6])&&b.c?.fork===1&&!b.c.ghost)&&s.p.length>=1&&alive(s)===4;
function resources(s){return{alive:alive(s),free:s.p,cargo:s.b.filter(b=>b.c),empty:s.b.filter(b=>!b.c),lastFork:s.lastFork,lock:s.lock,buttons:s.b.filter(b=>eq(b.r,[7,6])||eq(b.r,[8,6])).map(b=>b.r),forkTotal:s.p.reduce((m,p)=>m+p.fork,0)+s.b.reduce((m,b)=>m+(b.c&&!b.c.ghost?b.c.fork:0),0)};}
function leftResource(cap=4000,depth=30){
 for(const k of Object.keys(stats))stats[k]=0;samples.splice(0);for(const k of Object.keys(audit))audit[k]=0;
 const q=[{s:clone(seed),tail:''}],seen=new Set([hh(seed)]);let head=0,cut=0,lost=0,ghost=0,noControl=0,hit=null,firstCapture=null,firstDeploy3_5=null,firstUpper=null,firstGhost=null;
 while(head<q.length&&head<cap){const z=q[head++];if(target(z.s)){hit={tail:z.tail,from40:'AX'+z.tail,full:source.ref.instructions+'AX'+z.tail,resources:resources(z.s)};break;}
  if(!firstCapture&&z.s.b.some(b=>leftOrig.has(b.orig)&&b.c&&!b.c.ghost))firstCapture={tail:z.tail,resources:resources(z.s)};
  if(!firstDeploy3_5&&z.s.b.some(b=>leftOrig.has(b.orig)&&eq(b.r,[3,5])))firstDeploy3_5={tail:z.tail,resources:resources(z.s)};
  if(!firstUpper&&z.s.b.some(b=>leftOrig.has(b.orig)&&b.c&&b.r[1]>=7))firstUpper={tail:z.tail,resources:resources(z.s)};
  if(z.tail.length>=depth){cut++;continue;}
  for(const input of 'WASD'){const n=step(z.s,input,'AX'+z.tail+input);if(!n)continue;
   if(n.b.some(b=>b.c?.ghost)){ghost++;if(!firstGhost)firstGhost={tail:z.tail+input,resources:resources(n)};continue;}
   if(alive(n)!==4){lost++;continue;}if(!n.p.length){noControl++;continue;}
   const h=hh(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,tail:z.tail+input});
  }
 }
 return{hit,expanded:head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,depthCut:cut,cap,depth,lost,ghost,noControl,firstCapture,firstDeploy3_5,firstUpper,firstGhost,stats:{...stats},audit:{...audit},samples:clone(samples)};
}
if(require.main===module){const mode=process.argv[2]||'fixed';let result;if(mode==='search')result=leftResource();else if(mode==='replay')result=replay(process.argv[3]||'',seed);else result={sourceProof:source.ref,source:source.s,pre41:a.s,x42:x,resources:resources(seed)};console.log(JSON.stringify({status:'actual40+AX-model-resource',mode,result,liveHandle:null,scope:'One new actual40 source, AX then ordinary only to first protected leftBox pickup Fork3,6+liveoutside. Keep four alive; row1 allowed. Existing literal Wall/Floor/chain/capture/key lock and old-button mapping; new force/stack/Ghost/occupied/BOXICE/movingOverlap stopped. No fullGoal search or fixed63 rerun.'},null,2));}
module.exports={source,seed,step,replay,leftResource,resources,target};
