// Self-owned finite model of an observed Chapter4 local two-free/single-ENTRY domain.
// No game control. Uses only published bridge entities/tiles; no hidden implementation.
// source215 is actual; DAX seed is conditional ordinary free-X geometry, not actual.
const fs=require('fs'),A='WASD',V=[[0,1],[-1,0],[0,-1],[1,0]],K=p=>p.join(','),add=(p,d)=>[p[0]+V[d][0],p[1]+V[d][1]];
const r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/chapter4-world.json','utf8').replace(/^\uFEFF/,''));
const t=r.events[215].observation.level.timelines[0];
if(r.events[215].observation.level.id!=='Chapter4')throw Error('Source changed');
const full=process.argv.includes('--full'),probe=process.argv.includes('--probe');
// M035 / 2-11 events2,4: a pusher stops at the contacted ICE cell; the box slides.
// The old continuation assumption is retained only as an explicit conditional variant.
const allowPushSlide=process.argv.includes('--allow-push-slide');
const completed=new Set(JSON.parse(fs.readFileSync('knowledge/progress.json','utf8').replace(/^\uFEFF/,'')).active_playthrough.verified_completed_levels);
const terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.active&&e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const fixed=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.id!==29&&e.type!=='PLAYER').map(e=>K(e.pos)));
const otherEntries=new Map(t.entities.filter(e=>e.active&&e.type==='ENTRY'&&e.id!==29).map(e=>[K(e.pos),e.details.LinkLevel]));
const forbiddenEntries=new Map([...otherEntries].filter(([k,id])=>!full||!completed.has(id)||fixed.has(k)));
for(const e of t.entities)if(full&&e.active&&['KEY','LOCK'].includes(e.type))fixed.add(K(e.pos));
const within=p=>full?true:-45<=p[0]&&p[0]<=-25&&-2<=p[1]&&p[1]<=10;
const valid=p=>terrain.has(K(p))&&!fixed.has(K(p));
const safe=p=>valid(p)&&!['SPIKE','DARK'].includes(terrain.get(K(p)))&&!forbiddenEntries.has(K(p));
const sourceP=t.entities.find(e=>e.id===66),sourceE=t.entities.find(e=>e.id===29);
if(K(sourceP.pos)!=='-32,4'||sourceP.properties.split!==1||K(sourceE.pos)!=='-32,3')throw Error('Unexpected actual42');
const seed={p:[[-32,3],[-32,5]],b:[-32,2]};
const stats={transitions:0,reject:{},firstRejected:{},iceTicks:0,ordinaryWaits:0};
function reject(reason,s,a,path){stats.reject[reason]=(stats.reject[reason]||0)+1;if(!stats.firstRejected[reason])stats.firstRejected[reason]={prefix:'DAX'+path+A[a],pre:s};return null;}
const canon=s=>s.p.map(K).sort().join(';')+'|'+K(s.b);
function step(s,a,path=''){
 stats.transitions++;
 let ps=s.p.map(p=>p.slice()),b=s.b.slice(),vel=[-1,-1],bv=-1;
 for(let tick=0;tick<160;tick++){
  const np=ps.map(p=>p.slice()),forces=new Set(),nd=[-1,-1],pushed=[false,false];
  for(let i=0;i<2;i++){
   if(tick>0&&vel[i]<0)continue;
   const choices=tick===0?[0,1,2,3].map(z=>(a+z)%4):[vel[i]];
   let moved=false;
   for(const d of choices){
    const n=add(ps[i],d);if(!valid(n))continue;
    if(K(n)===K(b)){const nb=add(b,d);if(!valid(nb))continue;if(otherEntries.has(K(nb)))return reject('otherEntryPush',s,a,path);forces.add(d);pushed[i]=true;}
    if(forbiddenEntries.has(K(n)))return reject('otherEntry',s,a,path);
    np[i]=n;nd[i]=d;moved=true;break;
   }
   if(!moved&&tick===0)stats.ordinaryWaits++;
  }
  if(forces.size>1)return reject('firstForceConflictUnmodeled',s,a,path);
  let bd=forces.size?[...forces][0]:bv,nb=b.slice();
  if(bd>=0){const n=add(b,bd);if(valid(n)&&!otherEntries.has(K(n)))nb=n;else bd=-1;}
  // Scope rejection happens after using full actual map geometry, not by making slice edges walls.
  if(!np.every(within)||!within(nb))return reject('scopeExit',s,a,path);
  if(np.some(p=>!safe(p)))return reject('deathOrOtherEntry',s,a,path);
  const caught=np.map((p,i)=>K(p)===K(nb)?i:-1).filter(i=>i>=0);
  if(caught.length)return {hit:true,s:{p:np,b:nb},captureIndices:caught,tick:tick+1};
  if(K(np[0])===K(np[1]))return reject('freeFusion',s,a,path);
  vel=np.map((p,i)=>nd[i]>=0&&terrain.get(K(p))==='ICE'&&(allowPushSlide||!pushed[i])?nd[i]:-1);
  bv=bd>=0&&terrain.get(K(nb))==='ICE'?bd:-1;
  ps=np;b=nb;
  if(vel.every(d=>d<0)&&bv<0)return{s:{p:ps,b}};
  stats.iceTicks++;
 }
 return reject('microTickCap',s,a,path);
}
// Removing even the dynamic ENTRY gives an over-approximation of player-accessible safe terrain.
// It proves whether any ICE exists in this slice's potential free connected component.
const cq=[seed.p[0],seed.p[1]],component=new Set(cq.map(K));
for(let h=0;h<cq.length;h++)for(let d=0;d<4;d++){const n=add(cq[h],d),k=K(n);if(within(n)&&safe(n)&&!component.has(k)){component.add(k);cq.push(n);}}
const componentIce=[...component].filter(k=>terrain.get(k)==='ICE');
const cap=full?8000:5000,depthLimit=full?100:60,q=[{s:seed,path:''}],seen=new Set([canon(seed)]);let head=0,hit=null,cut=0,maxDepth=0;
while(!probe&&head<q.length&&head<cap&&!hit){
 const node=q[head++];maxDepth=Math.max(maxDepth,node.path.length);if(node.path.length>=depthLimit){cut++;continue;}
 for(let a=0;a<4;a++){
  const z=step(node.s,a,node.path);if(!z)continue;
  const path=node.path+A[a];if(z.hit){hit={prefixFromActual42:'DAX'+path,tailAfterConditionalX:path,...z};break;}
  const key=canon(z.s);if(!seen.has(key)){seen.add(key);q.push({s:z.s,path});}
 }
}
let independentReplay=null;
if(hit){let s=seed,trace=[];for(const c of hit.tailAfterConditionalX){const z=step(s,A.indexOf(c));if(!z)throw Error('Positive replay failed');trace.push({action:c,...z});s=z.s;}independentReplay=trace;}
const result={sourceEvent:215,sourceActualInputs:42,sourcePlayerId:66,sourceEntryId:29,sourceFork:1,conditionalSeedPrefix:'DAX',seed,
 scope:(full?'full observed map; verified-completed nonblockable ordinary ENTRY can pass;':'x[-45,-25], y[-2,10]; all other ENTRY avoided;')+' ordinary WASD; two live free Fork0 + one Entry; real missing terrain/Wall priority; no X after seed/ghost/stack/new conflict/loop crossing',
 cap,depthLimit,expanded:head,seen:seen.size,pending:q.length-head,depthCut:cut,maxDepth,exhausted:!hit&&head===q.length&&cut===0,
 safePotentialComponent:component.size,componentIce,hit,independentReplay,stats};
if(probe){let s=seed;const seq='S'.repeat(14)+'SASSD'+(process.argv.includes('--plus-a')?'A':'');console.log('variant',allowPushSlide?'unverified-entry-pusher-continues':'M035-pusher-stops');for(let i=0;i<seq.length;i++){const z=step(s,A.indexOf(seq[i]));if(i>=13)console.log(i+1,seq[i],JSON.stringify(z));if(!z)break;s=z.s;}}
else if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result,step,seed,terrain,fixed,otherEntries};
