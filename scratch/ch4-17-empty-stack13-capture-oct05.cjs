// Public-only readonly ordinary first-capture graph from actual empty stack13.
// Two objects are ONE rigid body cell. No X/bridge/game/UI/save/hints/hidden code.
const fs=require('fs'),geo=require('./ch4-17-readonly.cjs'),cp=z=>JSON.parse(JSON.stringify(z));
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-17.json','utf8').replace(/^\uFEFF/,''));
const prefix='SDDDDWAXWWAWW',F=['W','A','S','D'];
const obs=raw.events.map((e,i)=>({event:i,o:e.observation})).filter(z=>z.o?.level?.id==='floating'&&z.o.level.instructions===prefix&&!z.o.level.busy).at(-1);
if(!obs)throw Error('Missing actual13 stack');
const t=obs.o.level.timelines.find(t=>t.id===obs.o.level.current_timeline)||obs.o.level.timelines[0],E=t.entities.filter(e=>e.active),boxes=E.filter(e=>e.type==='BOX');
if(boxes.length!==2||boxes.some(b=>b.pos.join(',')!=='3,5'))throw Error('Unexpected actual13 boxes');
const source={r:boxes[0].pos,ids:boxes.map(b=>b.id),p:E.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,r:e.pos,f:F[e.properties.face],fork:e.properties.split}))};
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const goals=new Set(raw.initial.level.goals.map(K)),stats={},samples={};
const inc=k=>stats[k]=(stats[k]||0)+1;
function stop(kind,path,s,post){inc(kind);if(!samples[kind])samples[kind]={path,pre:cp(s),post:cp(post)};return null;}
function feasible(s,r,d){return!geo.blocked(r)&&(!eq(r,s.r)||!geo.blocked(add(r,d)));}
function step(s,a,path=''){
 const plans=[],requests=new Set();
 for(const p of s.p){let d=a,r=p.r,ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p.r,d);if(feasible(s,r,d)){ok=true;break;}}
  const push=ok&&eq(r,s.r);plans.push({p:{...cp(p),r:ok?r:p.r,f:ok?d:p.f},old:p.r,d:ok?d:null,push,wait:!ok});if(push)requests.add(d);if(!ok)inc('waitRequest');}
 if(requests.size>1)return stop('force',path,s,plans);
 const move=requests.size?[...requests][0]:null,r=move?add(s.r,move):s.r;
 if(move)inc('bodyMove');
 const receivers=plans.filter(z=>eq(z.p.r,r));
 if(receivers.length>1)return stop('doubleCargoBoundary',path,s,{r,plans});
 if(receivers.length&&geo.spikes.has(K(r)))return stop('ghostCaptureBoundary',path,s,{r,plans});
 if(plans.some(z=>geo.spikes.has(K(z.p.r))&&!receivers.includes(z)))return stop('nakedDeath',path,s,{r,plans});
 if(new Set(plans.map(z=>K(z.p.r))).size!==plans.length)return stop('freeFusion',path,s,{r,plans});
 if(goals.has(K(r)))return stop('GoalObservationBoundary',path,s,{r,plans});
 const n={r,ids:[...s.ids],p:plans.filter(z=>!receivers.includes(z)).map(z=>z.p)};
 if(receivers.length){const q=receivers[0].p;n.cargo={id:q.id,f:q.f,fork:q.fork,ghost:0,groupIds:[...s.ids]};inc('capture');}
 return n;
}
const hash=s=>K(s.r)+'|'+s.p.map(p=>K(p.r)+':'+p.fork).sort().join(';');
function fixed(path){let s=cp(source),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,failed:i+1,trace};trace.push({n:i+1,a:path[i],s:cp(s)});if(s.cargo)return{valid:true,capture:true,s,trace};}return{valid:true,s,trace};}
function terrainDegree(){const q=[source.p[0].r],seen=new Set([K(q[0])]);let head=0;while(head<q.length){const r=q[head++];for(const d of Object.keys(V)){const n=add(r,d);if(!geo.blocked(n)&&!seen.has(K(n))){seen.add(K(n));q.push(n);}}}
 const counts={},less2=[];for(const r of q){const degree=Object.keys(V).filter(d=>!geo.blocked(add(r,d))).length;counts[degree]=(counts[degree]||0)+1;if(degree<2)less2.push({r,degree});}
 return{walkableComponent:q.length,includesSPIKE:true,degreeCounts:counts,less2,minimumDegree:Math.min(...Object.keys(counts).map(Number)),scope:'Walls/closed Locks block, SPIKE is physically walkable before death; ignore BOX/free for this static degree. A single body blocks at most one neighbor, so degree>=2 disallows ordinary four-direction wait in this component.'};
}
function search(cap=3000,depth=35){const q=[{s:cp(source),path:''}],seen=new Set([hash(source)]);let head=0,depthCut=0,hit=null,minBodyY=source.r[1],maxBodyY=source.r[1],high=null,parityMismatch=0;
 const reachableBody=new Set(),waitStates=[];
 while(head<q.length&&head<cap){const z=q[head++];reachableBody.add(K(z.s.r));minBodyY=Math.min(minBodyY,z.s.r[1]);if(z.s.r[1]>maxBodyY){maxBodyY=z.s.r[1];high={path:z.path,s:cp(z.s)};}
  if(z.s.p.length===2&&(z.s.p[0].r[0]+z.s.p[0].r[1])%2!==(z.s.p[1].r[0]+z.s.p[1].r[1])%2)parityMismatch++;
  if(z.path.length>=depth){depthCut++;continue;}
  for(const a of'WASD'){const path=z.path+a,n=step(z.s,a,path);if(!n)continue;
   if(n.cargo){if(n.cargo.fork===1&&n.p.length===1&&n.p[0].fork===1){hit={path,full:prefix+path,s:cp(n)};break;}inc('wrongCaptureInventory');continue;}
   if(n.p.length!==2||n.p.some(p=>p.fork!==1))throw Error('Unpropagated inventory change');
   if(n.p.some((p,i)=>eq(p.r,z.s.p[i].r))&&waitStates.length<3)waitStates.push({path,s:cp(n)});
   const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path});}
  if(hit)break;
 }
 return{cap,depth,sourceRef:{event:obs.event,frame:obs.o.frame,instructions:prefix},source,expanded:head,seen:seen.size,pending:q.length-head,depthCut,exhausted:head===q.length,hit,minBodyY,maxBodyY,high,reachableBody:[...reachableBody].sort(),parityMismatch,waitStates,stats:{...stats},samples:cp(samples),terrain:terrainDegree(),liveHandle:null,scope:'One actual13 ordinary first heldFork1 rigid-group capture domain; preserve twofreeF1 until target; reject fusion/death/force/Goal observation/Ghost/doublecargo, no X, no layered-cell length inflation; cap3000/depth35 no increase.'};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='fixed'?fixed(process.argv[3]||'A'):search(),null,2));
module.exports={source,step,fixed,search,terrainDegree};
