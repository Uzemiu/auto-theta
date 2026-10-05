// Readonly public-observation model. Actual37, rigid layer groups, WASD only.
// No game calls, save reads/writes, hidden source, X, or unknown fusion propagation.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-20.json','utf8').replace(/^\uFEFF/,''));
const full='SSSSSSDDSSSSAAWAASAXDDDWWWWAXSAAWWAWX';
const source=raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='horse'&&z.o.level.instructions===full&&z.o.level.timelines.some(t=>t.time===37)).at(-1);
if(!source)throw Error('Actual37 source missing');
const l=source.o.level,t=l.timelines.find(t=>t.id===l.current_timeline)||l.timelines[0],initial=raw.initial.level.timelines[0];
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),cp=x=>JSON.parse(JSON.stringify(x));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},F=['W','A','S','D'];
const add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const walls=new Set(initial.entities.filter(e=>e.active&&e.class==='Wall').map(e=>K(e.pos)));
const floors=new Set([...initial.tiles,...initial.entities.filter(e=>e.active&&e.floor)].map(e=>K(e.pos)));
const spikes=new Set(initial.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
const goals=new Set(raw.initial.level.goals.map(K));
const blocked=r=>walls.has(K(r))||!floors.has(K(r));
const active=t.entities.filter(e=>e.active),groups=new Map();
for(const e of active.filter(e=>e.type==='BOX')){
  const k=K(e.pos);if(!groups.has(k))groups.set(k,{r:e.pos,body:[],c:[]});
  groups.get(k).body.push({id:e.id,color:e.details.Color,height:e.properties.height,contained:e.properties.contained,container:e.properties.container,gm:e.details.GMID});
}
for(const e of active.filter(e=>e.type==='PLAYER'&&e.properties.contained)){
  const g=[...groups.values()].find(g=>g.body.some(b=>b.id===e.properties.container));
  if(!g||!eq(g.r,e.pos)||e.properties.ghost)throw Error('Cargo geometry/ghost mismatch');
  g.c.push({id:e.id,f:F[e.properties.face],fork:e.properties.split,height:e.properties.height,container:e.properties.container,ghost:e.properties.ghost});
}
const seed={b:[...groups.values()],p:active.filter(e=>e.type==='PLAYER'&&!e.properties.contained).map(e=>({id:e.id,r:e.pos,f:F[e.properties.face],fork:e.properties.split,ghost:e.properties.ghost}))};
if(seed.b.length!==3||seed.b.reduce((n,g)=>n+g.body.length,0)!==5||seed.p.length!==3||seed.b.reduce((n,g)=>n+g.c.length,0)!==3)throw Error('Unexpected three rigid groups/three free seed');
if(seed.p.some(p=>p.fork||p.ghost)||seed.b.some(g=>g.c.some(c=>c.fork||c.ghost)))throw Error('Seed inventory not all live F0');
const stats={},examples={};
function inc(k){stats[k]=(stats[k]||0)+1;}
function boundary(k,path,pre,post){inc(k);if(!examples[k])examples[k]={path,pre:cp(pre),post:cp(post)};return null;}
function chain(s,r,d,ids){if(blocked(r))return false;const i=s.b.findIndex(g=>eq(g.r,r));if(i<0)return true;if(!chain(s,add(r,d),d,ids))return false;ids.push(i);return true;}
function step(s,a,path=''){
  if(!V[a])throw Error('Only ordinary WASD authorized');
  const plans=s.p.map(p=>{let d=a,q=p.r,ids=[],ok=false;for(let n=0;n<4;n++,d=L[d]){q=add(p.r,d);ids=[];if(chain(s,q,d,ids)){ok=true;break;}}return{p,q:ok?q:p.r,d:ok?d:a,ids:ok?ids:[]};});
  const nb=cp(s.b),dirs=new Map();
  for(const z of plans)for(const i of z.ids){if(dirs.has(i)&&dirs.get(i)!==z.d)return boundary('forceConflict',path,s,{plans});dirs.set(i,z.d);}
  for(const [i,d]of dirs)nb[i].r=add(nb[i].r,d);
  for(const g of nb)for(const c of g.c)c.f=a;
  if(new Set(nb.map(g=>K(g.r))).size!==nb.length)return boundary('newGroupOverlap',path,s,{b:nb,plans});
  const np=[];
  for(const z of plans){
    const g=nb.find(g=>eq(g.r,z.q));
    if(g){
      // All source groups are already loaded. Existing h2 layer absorption/fusion
      // is not supplied by a single-height X birth example (M116).
      if(g.c.length)return boundary(g.body.length>1?'occupiedLayerFusion':'occupiedSingleFusion',path,s,{b:nb,receiver:z});
      if(spikes.has(K(z.q)))return boundary('newGhostCapture',path,s,{b:nb,receiver:z});
      if(g.body.length>1)return boundary('newLayerCapture',path,s,{b:nb,receiver:z});
      throw Error('Unexpected empty group in this inventory');
    }
    if(spikes.has(K(z.q))){inc('nakedSpikeDeath');continue;}
    const old=np.find(p=>eq(p.r,z.q));
    if(old){inc('stationaryFreeFusion');old.fork=Math.max(old.fork,z.p.fork);}
    else np.push({...z.p,r:z.q,f:z.d});
  }
  inc('acceptedTransitions');return{b:nb,p:np};
}
function hash(s){return s.b.map(g=>g.body.map(b=>b.id).sort((a,b)=>a-b).join('+')+'@'+K(g.r)).sort().join('|')+'#'+s.p.map(p=>p.id+'@'+K(p.r)).sort().join('|');}
const liveGoal=s=>s.p.some(p=>goals.has(K(p.r)))||s.b.some(g=>g.c.some(c=>!c.ghost)&&goals.has(K(g.r)));
const height=s=>Math.max(...s.b.map(g=>g.r[1]));
function summary(s){return{groups:s.b.map(g=>({r:g.r,body:g.body,c:g.c})),free:s.p,physicalBoxes:s.b.reduce((n,g)=>n+g.body.length,0),bodyCells:s.b.length,activeActors:s.p.length+s.b.reduce((n,g)=>n+g.c.length,0)};}
function replay(path,start=seed){let s=cp(start),trace=[];for(let i=0;i<path.length;i++){const n=step(s,path[i],path.slice(0,i+1));if(!n)return{valid:false,n:i+1,trace,boundaries:cp(examples)};s=n;trace.push({n:i+1,a:path[i],s:summary(s)});}return{valid:true,s:summary(s),goal:liveGoal(s),trace};}
function search(cap=5000,depth=40){
  const q=[{s:cp(seed),path:''}],seen=new Set([hash(seed)]);let h=0,cut=0,hit=null,maxBoxY=height(seed),maxExample={path:'',s:summary(seed)},firstY9=null,firstY10=null;
  const aliveExpanded={};
  while(h<q.length&&h<cap){const z=q[h++],actors=z.s.p.length+z.s.b.reduce((n,g)=>n+g.c.length,0);aliveExpanded[actors]=(aliveExpanded[actors]||0)+1;
    if(liveGoal(z.s)){hit={path:z.path,s:summary(z.s)};break;}
    if(z.path.length>=depth){cut++;continue;}
    for(const a of 'WASD'){
      const n=step(z.s,a,z.path+a);if(!n)continue;const key=hash(n);if(seen.has(key))continue;seen.add(key);const path=z.path+a,y=height(n);
      if(y>maxBoxY){maxBoxY=y;maxExample={path,s:summary(n)};}
      if(!firstY9&&y>=9)firstY9={path,s:summary(n)};
      if(!firstY10&&y>=10)firstY10={path,s:summary(n)};
      q.push({s:n,path});
    }
  }
  return{cap,depth,expanded:h,seen:seen.size,pending:q.length-h,exhausted:h===q.length,depthCut:cut,hit,maxBoxY,maxExample,firstY9,firstY10,aliveExpanded,stats:cp(stats),examples:cp(examples),liveHandle:null};
}
if(require.main===module){const mode=process.argv[2]||'search';const result=mode==='search'?search():replay(process.argv[3]||'DSWAAWW');console.log(JSON.stringify({sourceEvent:source.i,sourceFrame:source.o.frame,full,seed:summary(seed),mode,result,stats,examples,scope:'Actual37 three rigid occupied groups (five physical BOX), ordinary WASD only, precise Floor/Wall/SPIKE. Entire layered group moves as one cell. Cargo height/containment retained; no extra X, same-origin layer fusion, new stack, force, Ghost or occupied fusion propagation.'},null,2));}
module.exports={seed,summary,step,replay,search,walls,floors,spikes,sourceEvent:source.i};
