// Readonly public-observation model. MODEL17 -> fixed SSX -> one WASD graph.
// No game/bridge/UI/save/hidden implementation. No canonical or JSON writes.
const fs=require('fs'),vm=require('vm'),path=require('path');
const file=path.resolve('scratch/ch4-10-fork-stagger-tail-oct05.cjs');
const src=fs.readFileSync(file,'utf8').replace('module.exports={sources,constructed,stage,stagePath,lockedStage,step,replay,target,search,go};',
 'module.exports={sources,constructed,stage,stagePath,lockedStage,step,replay,target,search,go,stats,examples,items,blocked,chain,wall,floor,spike};');
const box={require:require('module').createRequire(file),process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(src,box,{filename:file});
const base=box.module.exports,early=require('./ch4-10-pre-firstX-fork2-oct05.cjs');
const cp=x=>JSON.parse(JSON.stringify(x)),K=r=>r.join(','),L={W:'A',A:'S',S:'D',D:'W'},V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const prefix17='WDDDSSAAAAWWAWWWW',model17=early.fixed(prefix17).s;
const localStats={},localExamples={};
function fail(k,s,p,post){localStats[k]=(localStats[k]||0)+1;if(!localExamples[k])localExamples[k]={path:p,pre:cp(s),post:cp(post)};return null;}
// This model only needs the first freeX. It cannot silently propagate later
// cargo/free mixed X, stack, force, Ghost or observation branches.
function firstFreeX(s,p=''){
 if(s.p.length!==1||s.p[0].c>=0||s.p[0].fork!==2)return fail('firstXSourceBoundary',s,p,null);
 const actor=s.p[0],plans=[];for(const d of[L[actor.f],L[L[L[actor.f]]],actor.f]){
  const q=add(actor.r,d),ids=[];if(!base.chain(s,s.b,q,d,ids,actor))continue;
  plans.push({q,d,ids});if(plans.length===2)break;
 }
 if(plans.length!==2)return fail('notTwoFreeChildren',s,p,plans);
 if(plans.some(z=>z.ids.length))return fail('firstXBoxPushBoundary',s,p,plans);
 const n=cp(s);n.p=plans.map((z,i)=>({...cp(actor),id:i?60001:actor.id,r:z.q,f:actor.f,fork:1}));
 if(n.p.some(p=>base.spike.has(K(p.r))))return fail('firstXSpikeBoundary',s,p,n);
 if(n.p.some(p=>n.b.some(b=>K(b.r)===K(p.r))))return fail('firstXCaptureBoundary',s,p,n);
 if(new Set(n.p.map(p=>K(p.r))).size!==2)return fail('firstXFusionBoundary',s,p,n);
 return n;
}
function compact(s){return{p:s.p,boxes:s.b.map(b=>({id:b.id,r:b.r})),items:s.items,lockClosed:s.lock,gates:base.go(s)};}
function fixed(s,p){let z=cp(s),trace=[{n:0,...compact(z)}];for(let i=0;i<p.length;i++){
 z=p[i]==='X'?firstFreeX(z,p.slice(0,i+1)):base.step(z,p[i],p.slice(0,i+1));
 if(!z)return{valid:false,failed:i+1,trace};trace.push({n:i+1,a:p[i],...compact(z)});
 }return{valid:true,s:z,trace};}
const seedFixed=fixed(model17,'SSX');if(!seedFixed.valid)throw Error('SSX fixed failed');
const seed=seedFixed.s;
// Faces are deliberately omitted: every queued action is ordinary and overwrites
// face (including fallback). X never appears in this graph.
function hash(s){return s.b.map(b=>[K(b.r),s.p.filter(p=>p.c===b.id).map(p=>p.fork+':'+p.k).sort().join('+')].join(':')).sort().join('|')+
 '#'+s.p.filter(p=>p.c<0).map(p=>[K(p.r),p.fork,p.k].join(':')).sort().join('|')+'#'+s.items.join(',')+'#'+s.lock;}
function search(cap=5000,depth=50){const q=[{s:cp(seed),path:''}],seen=new Set([hash(seed)]);let head=0,depthCut=0,hit=null,firstKey=null,firstButton=null,firstEscapedKey=null,firstCapture=null;
 const stops={lostActor:0,lostFork:0,Ghost:0,unknown:0,duplicate:0};
 while(head<q.length&&head<cap){const z=q[head++],s=z.s;
  if(!firstButton&&s.p.some(p=>K(p.r)==='6,1'))firstButton={path:z.path,s:cp(s)};
  if(!firstKey&&s.p.some(p=>p.k>0))firstKey={path:z.path,s:cp(s)};
  if(!firstEscapedKey&&s.p.some(p=>p.k>0&&p.r[1]<=3))firstEscapedKey={path:z.path,s:cp(s)};
  if(!firstCapture&&s.p.some(p=>p.c>=0))firstCapture={path:z.path,s:cp(s)};
  if(!s.lock){hit={path:z.path,s:cp(s),fixed:fixed(seed,z.path)};break;}
  if(z.path.length>=depth){depthCut++;continue;}
  for(const a of'WASD'){const n=base.step(s,a,z.path+a);if(!n){stops.unknown++;continue;}
   if(n.p.length!==2){stops.lostActor++;continue;}
   if(n.p.some(p=>p.ghost)){stops.Ghost++;continue;}
   if(n.p.some(p=>p.fork!==1)){stops.lostFork++;continue;}
   const h=hash(n);if(seen.has(h)){stops.duplicate++;continue;}seen.add(h);q.push({s:n,path:z.path+a});
  }
 }
 return{source:'MODEL17 + SSX (MODEL20)',cap,depth,expanded:head,seen:seen.size,pending:q.length-head,depthCut,exhausted:head===q.length,hit,firstKey,firstButton,firstEscapedKey,firstCapture,stops,boundaries:cp(base.stats),examples:cp(base.examples),liveHandle:null,
 scope:'Exactly fixed SSX first split, then WASD only; retain two alive F1 actors; all box x1/row1/corners allowed. Snapshot own-gate occupancy; Lock actorKey. No force/stack/Ghost/occupied capture propagation. Stop first open Lock, not a fullGoal predicate. No second X graph.'};
}
if(require.main===module){const mode=process.argv[2]||'seed';let result=mode==='search'?search():fixed(model17,process.argv[3]||'SSX');
 console.log(JSON.stringify({mode,prefix17,model17:compact(model17),seedFixed,result},null,2));}
module.exports={base,early,model17,seed,seedFixed,firstFreeX,fixed,search,compact};
