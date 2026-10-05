// Public-model-only two-stage first-capture audit; no game/bridge/save calls.
// Source faceW is ordinary-equivalent to prior faceA via WD / AS. The new
// domain is retaining first cargo5,9 BEFORE outside reaches3,9, not a new source.
const m=require('./ch4-22-readonly.cjs');
const cp=x=>JSON.parse(JSON.stringify(x)),K=r=>r.join(','),eq=(a,b)=>K(a)===K(b);
const seedPath='AWWWAWX',fixed=m.replay(seedPath,m.s15),old=m.replay('AWWWWAX',m.s15);
if(!fixed.valid||!old.valid)throw Error('Source prefix invalid');
const seed=fixed.s,oldWD=m.replay('WD',old.s),newAS=m.replay('AS',seed),newX=m.replay('X',seed);
const archivedSource=m.raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='erosion'&&z.o.level.instructions===m.prefix15+seedPath&&!z.o.level.busy).at(-1);
if(archivedSource){const lv=archivedSource.o.level,ts=lv.timelines.find(t=>t.id===lv.current_timeline)||lv.timelines[0],pp=ts.entities.filter(e=>e.active&&e.type==='PLAYER');if(ts.time!==22||pp.length!==2||pp.some(p=>p.properties.split!==1||p.properties.key!==2||p.properties.ghost||p.properties.contained)||pp.map(p=>K(p.pos)).sort().join('|')!=='3,9|5,9')throw Error('Archived actual22 differs from resource seed');}
const equivalent=s=>s.b.map(b=>[b.orig,K(b.r),b.c].join(':')).sort().join('|')+'#'+s.p.map(p=>[K(p.r),p.fork,p.key].join(':')).sort().join('|')+'#'+s.keys+'#'+s.locks;
if(equivalent(seed)!==equivalent(oldWD.s)||equivalent(old.s)!==equivalent(newAS.s))throw Error('Claimed ordinary equivalence failed');
const stats={},examples={},inc=k=>stats[k]=(stats[k]||0)+1;
function boundary(k,path,s,post){inc(k);if(!examples[k])examples[k]={path,pre:m.summary(s),post:post?m.summary(post):null};return null;}
const dead=s=>s.b.some(b=>b.r[0]===1||b.r[1]===1||K(b.r)==='3,4');
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'};
const add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]],locks=m.t.entities.filter(e=>e.type==='LOCK');
function blocked(r,s,actor){if(m.wall.has(K(r))||!m.floor.has(K(r)))return true;const i=locks.findIndex(l=>eq(l.pos,r));return i>=0&&(s.locks&(1<<i))&&!(actor?.key>0);}
function chain(s,r,d,ids,actor){if(blocked(r,s,actor))return false;const i=s.b.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(s,add(r,d),d,ids,s.b[i].c))return false;ids.push(i);return true;}
// Separate ordinary planner, copied explicitly from the public visible model.
// Stop shared-force BEFORE branching, rather than relying on unexported stats.
function ordinary(s,a,path){
  const plans=[],dirs=new Map();
  for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s,r,d,ids,p)){ok=true;break;}}plans.push({...p,r:ok?r:p.r,f:ok?d:a});for(const i of(ok?ids:[])){if(dirs.has(i)&&dirs.get(i)!==d)return boundary('forceBoundary',path,s);dirs.set(i,d);}}
  const bs=s.b.map((b,i)=>({...cp(b),r:dirs.has(i)?add(b.r,dirs.get(i)):b.r,c:b.c?{...b.c,f:a}:null}));
  if(new Set(bs.map(b=>K(b.r))).size!==bs.length)return boundary('stackBoundary',path,s);
  const atLock=r=>locks.some((l,i)=>(s.locks&(1<<i))&&eq(l.pos,r));
  if(bs.some(b=>b.c&&atLock(b.r))||plans.some(p=>atLock(p.r)))return boundary('lockOrPickupBoundary',path,s);
  const ps=[];
  for(const p of plans){const b=bs.find(b=>eq(b.r,p.r));if(b){if(b.c)return boundary('occupiedBoundary',path,s);b.c={f:p.f,fork:p.fork,key:p.key,ghost:m.spike.has(K(p.r))?1:0};continue;}if(m.spike.has(K(p.r)))continue;const old=ps.find(q=>eq(q.r,p.r));if(old){old.fork=Math.max(old.fork,p.fork);old.key=Math.max(old.key,p.key);}else ps.push(p);}
  return{b:bs,p:ps,keys:s.keys,locks:s.locks};
}
// Canonical interchangeable empty C4 labels only, ordinary/no X, no new stack.
// Cargo color, key inventory and geometry remain in the hash; all faces are
// irrelevant here because later X is expressly excluded from this search.
const hash=(s,phase)=>phase+'#'+s.b.map(b=>[b.color,K(b.r),b.c?`${b.c.fork}:${b.c.key}:${b.c.ghost}`:'-'].join(':')).sort().join('|')+'#'+s.p.map(p=>[K(p.r),p.fork,p.key].join(':')).sort().join('|')+'#'+s.locks;
const target=s=>s.b.some(b=>b.c?.fork===1&&b.c.key===2&&!b.c.ghost&&K(b.r)==='5,9')&&s.p.some(p=>p.fork===1&&p.key===2&&K(p.r)==='3,9');
function transition(s,a,path,phase){
  const n=ordinary(s,a,path);if(!n)return null;
  if(n.locks!==s.locks||n.keys!==s.keys)return boundary('lockOrPickupBoundary',path,s,n);
  if(n.b.some(b=>b.c?.ghost))return boundary('ghostBoundary',path,s,n);
  if(dead(n))return boundary('forbiddenBoxCell',path,s,n);
  if(n.b.length!==5||n.p.length+n.b.filter(b=>b.c).length!==2||!n.p.length||n.p.some(p=>p.fork!==1||p.key!==2)||n.b.some(b=>b.c&&(b.c.fork!==1||b.c.key!==2)))return boundary('resourceLoss',path,s,n);
  const cs=n.b.filter(b=>b.c);
  if(phase===0&&cs.length){
    if(cs.length!==1||K(cs[0].r)!=='5,9')return boundary('nonTargetFirstCapture',path,s,n);
    if(!examples.firstCargo){examples.firstCargo={path,pre:m.summary(s),post:m.summary(n)};}
    inc('firstCargoAccepted');return{s:n,phase:1};
  }
  if(phase===1&&cs.length!==1)return boundary('extraCapture',path,s,n);
  return{s:n,phase};
}
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
function score(z){
  if(z.phase){const c=z.s.b.find(b=>b.c);return z.path.length-20+2*md(c.r,[5,9])+2*md(z.s.p[0].r,[3,9]);}
  let boxes=Infinity;for(let i=0;i<z.s.b.length;i++)for(let j=0;j<z.s.b.length;j++)if(i!==j)boxes=Math.min(boxes,md(z.s.b[i].r,[3,9])+md(z.s.b[j].r,[4,9]));
  const p=z.s.p,voices=Math.min(md(p[0].r,[2,9])+md(p[1].r,[5,8]),md(p[1].r,[2,9])+md(p[0].r,[5,8]));
  return z.path.length+2*boxes+voices;
}
function search(cap=12000,depth=40){
  const heap=[];let serial=0;
  function push(z){z.order=serial++;heap.push(z);let i=heap.length-1;while(i){const j=(i-1)>>1;if(score(heap[j])<score(heap[i])||(score(heap[j])===score(heap[i])&&heap[j].order<heap[i].order))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
  function pop(){const z=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(2*i+1<heap.length){let j=2*i+1;if(j+1<heap.length&&(score(heap[j+1])<score(heap[j])||(score(heap[j+1])===score(heap[j])&&heap[j+1].order<heap[j].order)))j++;if(score(heap[i])<score(heap[j])||(score(heap[i])===score(heap[j])&&heap[i].order<heap[j].order))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return z;}
  const distances=new Map([[hash(seed,0),0]]);push({s:cp(seed),phase:0,path:''});let expanded=0,cut=0,stale=0,hit=null,phase1Expanded=0;
  while(heap.length&&expanded<cap){const z=pop();if(distances.get(hash(z.s,z.phase))!==z.path.length){stale++;continue;}expanded++;if(z.phase)phase1Expanded++;
    if(target(z.s)){hit={tail:z.path,fromActual15:seedPath+z.path,full:m.prefix15+seedPath+z.path,s:m.summary(z.s)};break;}
    if(z.path.length>=depth){cut++;continue;}
    for(const a of 'WASD'){const n=transition(z.s,a,z.path+a,z.phase);if(!n)continue;const d=z.path.length+1,k=hash(n.s,n.phase);if(distances.has(k)&&distances.get(k)<=d)continue;distances.set(k,d);push({...n,path:z.path+a});}
  }
  let fixedHit=null,firstCargoFixed=null;
  if(hit){const r=m.replay(hit.fromActual15,m.s15);fixedHit={valid:r.valid,s:m.summary(r.s),steps:r.trace.length,trace:r.trace};}
  if(examples.firstCargo){const r=m.replay(seedPath+examples.firstCargo.path,m.s15);firstCargoFixed={valid:r.valid,s:m.summary(r.s),trace:r.trace};}
  return{cap,depth,expanded,seen:distances.size,pending:heap.length,depthCut:cut,stale,exhausted:heap.length===0,phase1Expanded,hit,fixedHit,firstCargoFixed,stats,examples,liveHandle:null,scope:'actual22 AWWWAWX resource, ordinary-equivalent to old source; ordinary only until first cargo5,9 F1/key2, preserving other F1/key2 outside anywhere safe, then ordinary stage2 outside3,9. Five BOX; forbid BOX x1/row1/3,4; non-target first capture, force/stack/occupied/Ghost/Lock transitions stop. Class-canonical empty-C4 hash, face ignored without X. Best-first heuristic is sufficient-condition priority, not shortest-path proof.'};
}
if(require.main===module){const mode=process.argv[2]||'source';let result;
  if(mode==='search')result=search();else if(mode==='replay'){const r=m.replay(seedPath+(process.argv[3]||''),m.s15);result={valid:r.valid,s:r.s?m.summary(r.s):null,trace:r.trace};}
  else result={actual15:m.summary(m.s15),fixedSource:fixed,oldWD,newAS,immediateX:newX,ordinaryEquivalent:true};
  console.log(JSON.stringify({mode,seedPath,archivedSource:archivedSource?{event:archivedSource.i,frame:archivedSource.o.frame}:null,source:m.summary(seed),result},null,2));
}
module.exports={seed,seedPath,transition,search,target,oldWD,newAS,newX,archivedSource};
