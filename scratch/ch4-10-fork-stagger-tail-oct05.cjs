// Public-observation-only snail model: fixed conditional XWWW, then a single
// ordinary resource search. No game/bridge/UI/save/hidden implementation calls.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-10.json','utf8').replace(/^\uFEFF/,''));
const t0=raw.initial.level.timelines[0],K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),cp=x=>JSON.parse(JSON.stringify(x));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},F=['W','A','S','D'],add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const wall=new Set(t0.entities.filter(e=>e.active&&e.class==='Wall').map(e=>K(e.pos))),floor=new Set([...t0.tiles,...t0.entities.filter(e=>e.active&&e.floor)].map(e=>K(e.pos))),spike=new Set(t0.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const items=t0.entities.filter(e=>e.type==='KEY').map(e=>({id:e.id,r:e.pos,fork:e.details.isFork})),gates=[{r:[3,4],button:[6,1]},{r:[4,5],button:[6,1]},{r:[4,1],button:[1,1]},{r:[1,4],button:[1,1]}],lockR=[7,4];
function observed(o){const lv=o.level,t=lv.timelines.find(t=>t.id===lv.current_timeline)||lv.timelines[0],E=t.entities.filter(e=>e.active);return{b:E.filter(e=>e.type==='BOX').map(e=>({id:e.id,orig:e.id,r:e.pos,color:e.details.Color})),p:E.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,r:e.pos,f:F[e.properties.face],fork:e.properties.split,k:e.properties.key,c:e.properties.contained?e.properties.container:-1,ghost:e.properties.ghost,h:e.properties.height})),items:items.filter(i=>E.some(e=>e.id===i.id)).map(i=>i.id),lock:E.some(e=>e.type==='LOCK'&&e.blockable)};}
const sources=[8,32,52].map(n=>{const z=raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='snail'&&z.o.level.instructions.length===n&&!z.o.level.busy).at(-1);if(!z)throw Error('Missing actual source'+n);return{name:'actual'+n,event:z.i,frame:z.o.frame,full:z.o.level.instructions,s:observed(z.o)};});
const stats={},examples={},inc=k=>stats[k]=(stats[k]||0)+1;
function reject(k,path,s,post){inc(k);if(!examples[k])examples[k]={path,pre:cp(s),post:post?cp(post):null};return null;}
const has=(s,r)=>s.b.some(b=>eq(b.r,r))||s.p.some(p=>eq(p.r,r));
const go=s=>gates.map(g=>has(s,g.button)||has(s,g.r));
function blocked(s,r,actor){if(wall.has(K(r))||!floor.has(K(r)))return true;const i=gates.findIndex(g=>eq(g.r,r));if(i>=0&&!go(s)[i])return true;return s.lock&&eq(r,lockR)&&!(actor?.k>0);}
function chain(s,bs,r,d,ids,actor){if(blocked(s,r,actor))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;const carrier=s.p.find(p=>p.c===bs[i].id);if(!chain(s,bs,add(r,d),d,ids,carrier))return false;ids.push(i);return true;}
function step(s,a,path=''){
  if(!V[a]&&a!=='X')throw Error('Unsupported input');
  const charged=s.p.filter(p=>p.c>=0&&p.fork>0),bs=a==='X'?s.b.filter(b=>!charged.some(p=>p.c===b.id)).map(cp):s.b.map(cp),plans=[];
  if(a==='X'){
    if(s.p.some(p=>p.c<0&&p.fork>0))return reject('freeXOutsideScope',path,s);
    for(const p of s.p){if(p.c<0||!p.fork){plans.push({p:cp(p),q:p.r,d:p.f,ids:[],cargo:p.c>=0,parent:null});continue;}
      let count=0;for(const d of[L[p.f],L[L[L[p.f]]],p.f]){const q=add(p.r,d),ids=[];if(!chain(s,bs,q,d,ids,p))continue;const parent=s.b.find(b=>b.id===p.c);plans.push({p:{...cp(p),fork:p.fork-1},q,d,ids,cargo:true,parent});if(++count===2)break;}if(!count)return reject('zeroCargoBirthOutsideScope',path,s);
    }
  }else for(const p of s.p){if(p.c>=0){plans.push({p:{...cp(p),f:a},q:p.r,d:a,ids:[],cargo:true,parent:null});continue;}let d=a,q=p.r,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){q=add(p.r,d);ids=[];if(chain(s,bs,q,d,ids,p)){ok=true;break;}}plans.push({p:{...cp(p),f:ok?d:p.f},q:ok?q:p.r,d:ok?d:p.f,ids:ok?ids:[],cargo:false,parent:null});}
  const dirs=new Map();for(const z of plans)for(const i of z.ids){if(dirs.has(i)&&dirs.get(i)!==z.d)return reject('forceBoundary',path,s,{plans});dirs.set(i,z.d);}
  for(const [i,d]of dirs)bs[i].r=add(bs[i].r,d);
  const ps=[];let birth=0;
  for(const z of plans){const p=z.p;
    if(z.parent){const id=1000+birth++,b={...cp(z.parent),id,r:z.q};bs.push(b);p.id=10000+birth;p.c=id;p.r=z.q;}
    else if(z.cargo)p.r=bs.find(b=>b.id===p.c).r;
    else{p.r=z.q;const b=bs.find(b=>eq(b.r,p.r));if(b){if(ps.some(q=>q.c===b.id)||s.p.some(q=>q.c===b.id))return reject('occupiedBoundary',path,s,{bs,p});p.c=b.id;p.ghost=spike.has(K(p.r))?1:0;if(p.ghost)return reject('ghostCaptureBoundary',path,s,{bs,p});}}
    ps.push(p);
  }
  if(new Set(bs.map(b=>K(b.r))).size!==bs.length)return reject('stackOrFusionBoundary',path,s,{bs,ps});
  const n={b:bs,p:[],items:[...s.items],lock:s.lock};
  for(const p of ps){
    if(n.lock&&eq(p.r,lockR)){if(!p.k)return reject('lockWithoutKeyBoundary',path,s,{bs,ps});p.k--;n.lock=false;}
    for(const i of items)if(n.items.includes(i.id)&&eq(p.r,i.r)){n.items=n.items.filter(id=>id!==i.id);if(i.fork)p.fork++;else p.k++;}
    if(p.c<0&&spike.has(K(p.r))){inc('nakedSpikeDeath');continue;}
    const old=n.p.find(q=>eq(q.r,p.r)&&q.c===p.c);if(old){inc('freeFusion');old.fork=Math.max(old.fork,p.fork);old.k=Math.max(old.k,p.k);}else n.p.push(p);
  }
  return n;
}
const constructed={b:[{id:57,orig:57,color:4,r:[7,6]},{id:58,orig:58,color:4,r:[7,4]},{id:59,orig:59,color:4,r:[7,5]}],p:[{id:63,r:[7,6],f:'D',fork:1,k:0,c:57,ghost:0,h:1},{id:60,r:[7,2],f:'W',fork:0,k:0,c:-1,ghost:0,h:1}],items:[],lock:false};
const stagePath='DSSDDWWSSAAWWDASSDDWWSSD',stage=cp(constructed);
stage.b[0].r=stage.p[0].r=[7,4];stage.p[0].f='W';stage.b[1].r=[5,3];stage.b[2].r=[6,3];stage.p[1].r=[4,3];
const lockedStage=cp(stage);lockedStage.b[0].r=lockedStage.p[0].r=[7,3];lockedStage.p[0].k=1;lockedStage.p[1].r=[7,2];lockedStage.lock=true;
function replay(path,start=constructed){let s=cp(start),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,failed:i+1,trace};trace.push({n:i+1,a:path[i],s:cp(s),go:go(s)});}const mask=raw.initial.level.goals.reduce((v,g,i)=>v|(s.p.some(p=>!p.ghost&&eq(p.r,g))?1<<i:0),0);return{valid:true,mask,s,trace};}
const target=s=>!s.lock&&s.b.length===3&&s.p.length===2&&s.p.some(p=>p.c>=0&&p.fork===1&&eq(p.r,[7,6])&&p.f==='D')&&s.p.some(p=>p.c<0&&p.fork===0&&eq(p.r,[7,2]))&&[[7,4],[7,5]].every(r=>s.b.some(b=>eq(b.r,r)&&!s.p.some(p=>p.c===b.id)));
const hash=s=>s.b.map(b=>[K(b.r),s.p.filter(p=>p.c===b.id).map(p=>[p.fork,p.k].join(':')).sort().join('+')].join(':')).sort().join('|')+'#'+s.p.filter(p=>p.c<0).map(p=>[K(p.r),p.fork,p.k].join(':')).sort().join('|')+'#'+s.items.join(',')+'#'+s.lock+'#'+s.p.filter(p=>p.c>=0&&p.fork).map(p=>K(p.r)+':'+p.f).sort().join('|');
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
function priority(z){const s=z.s,cargo=s.p.find(p=>p.c>=0&&p.fork===1),free=s.p.filter(p=>p.c<0);let cost=z.path.length;
  if(s.lock)cost+=s.p.some(p=>p.k>0)?10:35;
  if(s.items.includes(items.find(i=>i.fork&&eq(i.r,[1,5])).id))cost+=10+Math.min(...free.map(p=>md(p.r,[1,5])));
  cost+=cargo?2*md(cargo.r,[7,6]):18;
  const empties=s.b.filter(b=>!s.p.some(p=>p.c===b.id));let buffers=Infinity;for(let i=0;i<empties.length;i++)for(let j=0;j<empties.length;j++)if(i!==j)buffers=Math.min(buffers,md(empties[i].r,[7,4])+md(empties[j].r,[7,5]));cost+=buffers===Infinity?30:buffers;
  if(free.length===1)cost+=md(free[0].r,[7,2]);return cost;
}
function search(cap=12000,depth=60){const heap=[];let serial=0;function push(z){z.order=serial++;heap.push(z);let i=heap.length-1;while(i){const j=(i-1)>>1;if(priority(heap[j])<=priority(heap[i]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}function pop(){const z=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(2*i+1<heap.length){let j=2*i+1;if(j+1<heap.length&&priority(heap[j+1])<priority(heap[j]))j++;if(priority(heap[i])<=priority(heap[j]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return z;}
  const seen=new Map();for(const source of sources){const key=hash(source.s);if(!seen.has(key)){seen.set(key,0);push({s:cp(source.s),path:'',source});}}
  let expanded=0,stale=0,depthCut=0,hit=null,firstKey=null,firstLock=null,firstRightCargo=null,maxCargoY=-1,high=null;const bySource={};
  while(heap.length&&expanded<cap){const z=pop();if(seen.get(hash(z.s))!==z.path.length){stale++;continue;}expanded++;bySource[z.source.name]=(bySource[z.source.name]||0)+1;
    if(!firstKey&&z.s.p.some(p=>p.k>0))firstKey={source:z.source.name,path:z.path,s:cp(z.s)};
    if(!firstLock&&!z.s.lock)firstLock={source:z.source.name,path:z.path,s:cp(z.s)};
    if(!firstRightCargo&&z.s.p.some(p=>p.c>=0&&p.r[0]===7))firstRightCargo={source:z.source.name,path:z.path,s:cp(z.s)};
    for(const p of z.s.p)if(p.c>=0&&p.r[1]>maxCargoY){maxCargoY=p.r[1];high={source:z.source.name,path:z.path,s:cp(z.s)};}
    if(target(z.s)){hit={source:z.source.name,path:z.path,full:z.source.full+z.path,s:cp(z.s),fixed:replay(z.path,z.source.s),tail:replay('XWWW',z.s)};break;}
    if(z.path.length>=depth){depthCut++;continue;}
    for(const a of'WASD'){const n=step(z.s,a,z.source.name+':'+z.path+a);if(!n)continue;
      if(n.b.length!==3||n.p.length!==2||n.p.some(p=>p.ghost)||n.b.some(b=>b.r[1]===1||b.r[0]===1||['3,6','5,6'].includes(K(b.r)))){inc('resourceOrDeadBoxPrune');continue;}
      const key=hash(n),d=z.path.length+1;if(seen.has(key)&&seen.get(key)<=d)continue;seen.set(key,d);push({s:n,path:z.path+a,source:z.source});
    }
  }
  return{cap,depth,expanded,seen:seen.size,pending:heap.length,stale,depthCut,exhausted:heap.length===0,bySource,hit,firstKey,firstLock,firstRightCargo,maxCargoY,high,stats,examples,liveHandle:null,scope:'One joint actual8/32/52 WASD best-first resource domain; keep3 BOX and2 live actors, no earlyX/force/stack/Ghost; forbid BOXrow1/x1 and3,6/5,6 ordinary corners. True Floor and snapshot gates, Lock needs moverKey. Target exact pre-lastX staggered inventory, not generic Goal search; cap12000/depth60, no increase.'};
}
if(require.main===module){const mode=process.argv[2]||'tail';let result;
  if(mode==='search')result=search();else if(mode==='stage')result=replay(stagePath+'XWWW',stage);else if(mode==='locked-stage')result=replay('WSSAAWAW'+stagePath+'XWWW',lockedStage);else result=replay(mode==='tail'?'XWWW':process.argv[3]||'',mode==='tail'||process.argv[2]==='constructed'?constructed:sources.find(s=>s.name===mode)?.s||constructed);
  console.log(JSON.stringify({mode,sources:sources.map(s=>({name:s.name,event:s.event,frame:s.frame,full:s.full,s:s.s})),result},null,2));}
module.exports={sources,constructed,stage,stagePath,lockedStage,step,replay,target,search,go};
