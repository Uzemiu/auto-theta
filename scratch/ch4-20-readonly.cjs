// 4-20 observed ordinary/cargo-X model. Private readonly replay/search only.
// Reuses the no-ICE observed step implementation; patches only its exported
// geometry sets in this isolated Node process. No source model file changes.
const fs=require('fs'),m=require('./ch4-19-readonly.cjs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-20.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],K=p=>p.join(','),clone=s=>JSON.parse(JSON.stringify(s));
for(const set of [m.walls,m.floors,m.spikes])set.clear();
for(const e of t.entities)if(e.class==='Wall')m.walls.add(K(e.pos));
for(const e of [...t.tiles,...t.entities.filter(e=>e.floor)])m.floors.add(K(e.pos));
for(const e of t.tiles)if(e.type==='SPIKE')m.spikes.add(K(e.pos));
const s15={b:t.entities.filter(e=>e.type==='BOX').map(e=>({r:e.pos,orig:e.id,kind:'BOX',color:e.details.Color,c:null})),p:[{r:[5,2],f:'W',fork:3}],keys:0};
const s16=m.replay('X',s15).s,goal=raw.initial.level.goals[0];
const summary=s=>({box:s.b.map(b=>({p:b.r,orig:b.orig,color:b.color,c:b.c})),free:s.p});
const hash=s=>s.b.map(b=>[b.orig,K(b.r),b.c?.fork??'-',b.c?.fork?b.c.f:'-',b.c?.ghost||0].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-'].join(':')).sort().join(';');
const liveGoal=s=>s.p.some(p=>K(p.r)===K(goal))||s.b.some(b=>b.c&&!b.c.ghost&&K(b.r)===K(goal));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]],eq=(a,b)=>K(a)===K(b);
const stats={stack:0,occupied:0,conflict:0},samples={stack:[],occupied:[],conflict:[]};let firstForkStack=null;
function boundary(kind,path,s,post){stats[kind]++;if(kind==='stack'&&!firstForkStack&&post.b.some(b=>b.c?.fork>0))firstForkStack={path,pre:summary(s),post};if(samples[kind].length<3)samples[kind].push({path,pre:summary(s),post});}
function chain(bs,r,d,ids){if(m.blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
// Same observed ordinary/cargo-X model, now exposing first conflicting force
// children. Independent-origin stack and high-Fork occupied capture stop here.
function multiStep(s,a,path=''){
 let bs,plans=[];
 if(a==='X'){
  const cargo=s.b.filter(b=>b.c?.fork>0);if(!cargo.length&&!s.p.some(p=>p.fork>0))return[];
  bs=s.b.filter(b=>!b.c||b.c.fork===0).map(clone);
  const birth=(r,f,fork,kind,parent)=>{let n=0;for(const d of[L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(!chain(bs,q,d,ids))continue;plans.push({r:q,f,fork,d,ids,kind,parent});if(++n===2)return;}if(!n)plans.push({r,f,fork,d:f,ids:[],kind,parent});};
  for(const b of cargo)birth(b.r,b.c.f,b.c.fork-1,'cargo',b);
  for(const p of s.p)if(p.fork)birth(p.r,p.f,p.fork-1,'free',p);else plans.push({...p,d:p.f,ids:[],kind:'free',parent:p});
 }else{
  bs=s.b.map(b=>({...clone(b),c:b.c?{...b.c,f:a}:null}));
  for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let i=0;i<4;i++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({r:ok?r:p.r,f:ok?d:a,fork:p.fork,d,ids:ok?ids:[],kind:'free',parent:p});}
 }
 const assignments=[];function branch(active,choices){const requested=new Map();for(const p of active)for(const i of p.ids){if(!requested.has(i))requested.set(i,new Set());requested.get(i).add(p.d);}const conflict=[...requested].find(([i,dirs])=>dirs.size>1);if(!conflict){assignments.push({active,choices});return;}const[i,dirs]=conflict;for(const d of dirs)branch(active.filter(p=>!p.ids.includes(i)||p.d===d),[...choices,{box:bs[i].orig,dir:d}]);}
 branch(plans,[]);if(assignments.length>1)boundary('conflict',path,s,assignments.map(z=>z.choices));
 const out=[];
 for(const{active,choices}of assignments){const nb=bs.map(clone),dirs=new Map();for(const p of active)for(const i of p.ids)dirs.set(i,p.d);for(const[i,d]of dirs)nb[i].r=add(nb[i].r,d);
  const ps=[];for(const p of active)if(p.kind==='cargo')nb.push({r:p.r,orig:p.parent.orig,kind:'BOX',color:p.parent.color,c:{...p.parent.c,fork:p.fork}});else ps.push({r:p.r,f:p.f,fork:p.fork});
  const merged=[];let reject=false;for(const b of nb){const old=merged.find(z=>eq(z.r,b.r));if(!old){merged.push(b);continue;}if(old.orig!==b.orig){boundary('stack',path,s,{b:nb,p:ps,choices});reject=true;break;}if(!old.c&&b.c)old.c=b.c;else if(old.c&&b.c)old.c.fork=Math.max(old.c.fork,b.c.fork);}if(reject)continue;
  const free=[];for(const p of ps){const b=merged.find(z=>eq(z.r,p.r));if(b){if(b.c&&p.fork>0&&!(b.c.fork===1&&p.fork===1&&!b.c.ghost&&!m.spikes.has(K(p.r)))){boundary('occupied',path,s,{b:merged,p:ps,choices});reject=true;break;}if(!b.c)b.c={f:p.f,fork:p.fork,ghost:m.spikes.has(K(p.r))?1:0};continue;}if(m.spikes.has(K(p.r)))continue;const old=free.find(z=>eq(z.r,p.r));if(old)old.fork=Math.max(old.fork,p.fork);else free.push(p);}if(!reject)out.push({s:{b:merged,p:free,keys:0},choices});
 }
 return out;
}
const s25=m.replay('AASAXDDDWW',s15).s;
function observedReplay(path,start=s25){let s=clone(start),trace=[];for(let i=0;i<path.length;i++){const ns=multiStep(s,path[i],path.slice(0,i+1));if(ns.length!==1)return{valid:false,n:i+1,branches:ns.map(n=>({s:summary(n.s),choices:n.choices})),trace};s=ns[0].s;trace.push({n:i+1,a:path[i],s:summary(s)});}return{valid:true,s:summary(s),trace};}
function solve25(cap=5000,depth=40){firstForkStack=null;for(const k of Object.keys(stats)){stats[k]=0;samples[k]=[];}const q=[{s:clone(s25),path:'',branches:[]}],seen=new Set([hash(s25)]);let h=0,cut=0,ghost=0,hit=null,maxCargoY=-1,maxForkCargoY=-1,highExample=null;
 while(h<q.length&&h<cap){const z=q[h++];if(liveGoal(z.s)){hit={...z,s:summary(z.s)};break;}for(const b of z.s.b)if(b.c){if(b.r[1]>maxCargoY){maxCargoY=b.r[1];highExample={path:z.path,branches:z.branches,s:summary(z.s)};}if(b.c.fork)maxForkCargoY=Math.max(maxForkCargoY,b.r[1]);}
  if(z.path.length>=depth){cut++;continue;}for(const a of'WASDX')for(const n of multiStep(z.s,a,z.path+a)){if(n.s.b.some(b=>b.c?.ghost)){ghost++;continue;}if(!n.s.p.length&&!n.s.b.some(b=>b.c?.fork>0)&&!liveGoal(n.s))continue;const k=hash(n.s);if(seen.has(k))continue;seen.add(k);q.push({s:n.s,path:z.path+a,branches:n.choices.length?[...z.branches,{n:z.path.length+1,choices:n.choices}]:z.branches});}
 }return{expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,exhausted:h===q.length,hit,maxCargoY,maxForkCargoY,highExample,ghost,stats,samples,firstForkStack,scope:'actual25 live C4 cargoFork2+outsideFork2; WASD + all remaining free/cargoX; explicit force-conflict child states, one Goal may be satisfied on any compatible child; same-origin merge; no independent-origin stack/highFork occupied capture/ghost propagation; no extra KEY/ICE/wrap.'};}
function search(cap=5000,depth=40,start=s16){const q=[{s:clone(start),path:''}],seen=new Set([hash(start)]);let h=0,cut=0,hit=null,firstCapture=null,ghost=null,cargoHigh=null,rejected=0;
 while(h<q.length&&h<cap){const z=q[h++];if(liveGoal(z.s)){hit={path:z.path,s:summary(z.s)};break;}
  if(!firstCapture&&z.s.b.some(b=>b.c?.fork>=2&&!b.c.ghost)&&z.s.p.some(p=>p.fork>=2))firstCapture={path:z.path,s:summary(z.s)};
  if(!cargoHigh&&z.s.b.some(b=>b.c&&b.r[1]>=8))cargoHigh={path:z.path,s:summary(z.s)};
  if(z.path.length>=depth){cut++;continue;}
  for(const a of 'WASDX'){const n=m.step(z.s,a);if(!n){rejected++;continue;}
   if(n.b.some(b=>b.c?.ghost)){if(!ghost)ghost={path:z.path+a,s:summary(n)};continue;}
   if(!n.p.length&&!n.b.some(b=>b.c?.fork>0)&&!liveGoal(n))continue;
   const k=hash(n);if(seen.has(k))continue;seen.add(k);q.push({s:n,path:z.path+a});
  }
 }
 return{expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,rejected,exhausted:h===q.length,hit,firstCapture,cargoHigh,firstGhost:ghost,scope:'actual16; WASD/free+livecargoX; exact Wall/Floor/SPIKE; same-origin merge; emptyBOX capture; all BOX rows allowed; no extra KEY; different-origin stack/conflict rejected by step; ghost first occurrence recorded, not propagated; finite cap/depth.'};}
function resource(cap=5000,depth=35){const q=[{s:clone(s16),path:''}],seen=new Set([hash(s16)]);let h=0,cut=0,rejected=0,lost=0,firstCapture=null,firstBoundary=null;
 while(h<q.length&&h<cap){const z=q[h++];if(z.s.b.some(b=>b.c?.fork===2&&!b.c.ghost)&&z.s.p.some(p=>p.fork===2)){firstCapture={path:z.path,s:summary(z.s)};break;}
  if(z.path.length>=depth){cut++;continue;}
  for(const a of 'WASD'){const n=m.step(z.s,a,z.path+a);if(!n){rejected++;if(!firstBoundary)firstBoundary={path:z.path+a,pre:summary(z.s)};continue;}
   if(n.b.some(b=>b.c?.ghost)||n.p.length+n.b.filter(b=>b.c).length!==2||n.p.some(p=>p.fork!==2)||n.b.some(b=>b.c&&b.c.fork!==2)){lost++;continue;}
   const k=hash(n);if(seen.has(k))continue;seen.add(k);q.push({s:n,path:z.path+a});
  }
 }
 return{expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,rejected,lost,exhausted:h===q.length,firstCapture,firstBoundary,scope:'actual16; only WASD, exactly two live Fork2 actors; both boxes all rows allowed; first live cargoFork2+outsideFork2 target; no extra X/stack/conflict/ghost propagation.'};}
function beforeLastX(cap=5000,depth=35){firstForkStack=null;for(const k of Object.keys(stats)){stats[k]=0;samples[k]=[];}const children=multiStep(s25,'X','X'),q=children.map(c=>({s:c.s,path:'',source:c.choices,branches:[]})),seen=new Set(q.map(z=>hash(z.s)));let h=0,cut=0,lost=0,thirdCargo=null;
 while(h<q.length&&h<cap){const z=q[h++];if(z.s.b.filter(b=>b.c?.fork===1&&!b.c.ghost).length>=3&&z.s.p.length){thirdCargo={...z,s:summary(z.s)};break;}
  if(z.path.length>=depth){cut++;continue;}for(const a of'WASD'){const ns=multiStep(z.s,a,z.path+a);if(firstForkStack)break;for(const n of ns){if(n.s.b.some(b=>b.c?.ghost)||!n.s.p.length){lost++;continue;}const k=hash(n.s);if(seen.has(k))continue;seen.add(k);q.push({s:n.s,path:z.path+a,source:z.source,branches:n.choices.length?[...z.branches,{n:z.path.length+1,choices:n.choices}]:z.branches});}}if(firstForkStack)break;
 }return{expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,exhausted:h===q.length,lost,thirdCargo,firstForkStack,stats,samples,scope:'actual26 two verified children; WASD only before spending last Fork1; legal ordinary conflicts branched; targets independent stack retaining Fork1 or three live Fork1 cargo+outside; first stack/highFork occupied capture stop, ghost not propagated; no additional X.'};}
if(require.main===module){const mode=process.argv[2]||'search';if(mode==='observedReplay')console.log(JSON.stringify(observedReplay(process.argv[3]||''),null,2));else if(mode==='replay'){const r=m.replay(process.argv[3]||'',s16);console.log(JSON.stringify(r,null,2));}else if(mode==='beforeLastX')console.log(JSON.stringify(beforeLastX(Number(process.argv[3]||5000),Number(process.argv[4]||35)),null,2));else if(mode==='solve25')console.log(JSON.stringify(solve25(Number(process.argv[3]||5000),Number(process.argv[4]||40)),null,2));else if(mode==='resource')console.log(JSON.stringify(resource(Number(process.argv[3]||5000),Number(process.argv[4]||35)),null,2));else console.log(JSON.stringify(search(Number(process.argv[3]||5000),Number(process.argv[4]||40)),null,2));}
module.exports={raw,t,s15,s16,s25,step:m.step,multiStep,observedReplay,replay:(p,s=s16)=>m.replay(p,s),summary,search,resource,solve25,beforeLastX,goal};
