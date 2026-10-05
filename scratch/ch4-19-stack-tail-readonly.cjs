// Actual20 loaded two-body stack: ordinary-only first-light transport audit.
// Public observations only. No game API, save access, X, or hidden optical code.
const fs=require('fs'),base=require('./ch4-19-readonly.cjs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-19.json','utf8').replace(/^\uFEFF/,''));
const prefix='WDAXDDWWWSAWWSDDWDAX',src=raw.events.map((e,i)=>({i,o:e.observation})).filter(z=>z.o?.level?.id==='counter'&&z.o.level.instructions===prefix).at(-1);
if(!src)throw Error('Actual20 not archived');
const lv=src.o.level,t=lv.timelines.find(t=>t.id===lv.current_timeline)||lv.timelines[0],E=t.entities.filter(e=>e.active);
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},F=['W','A','S','D'],add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]],copy=x=>JSON.parse(JSON.stringify(x));
const grouped=new Map();
for(const e of E.filter(e=>['BOX','PRISM'].includes(e.type))){const k=K(e.pos);if(!grouped.has(k))grouped.set(k,{r:e.pos,body:[],c:[],kind:e.type});grouped.get(k).body.push({id:e.id,color:e.details.Color,height:e.properties.height,container:e.properties.container});}
for(const e of E.filter(e=>e.type==='PLAYER'&&e.properties.contained)){const g=[...grouped.values()].find(g=>g.body.some(b=>b.id===e.properties.container));if(!g)throw Error('Missing active cargo body');g.c.push({id:e.id,f:F[e.properties.face],fork:e.properties.split,ghost:e.properties.ghost,height:e.properties.height});}
const seed={b:[...grouped.values()],p:E.filter(e=>e.type==='PLAYER'&&!e.properties.contained).map(e=>({id:e.id,r:e.pos,f:F[e.properties.face],fork:e.properties.split}))};
if(seed.b.filter(g=>g.kind==='BOX').length!==2||seed.p.length!==2||seed.b.find(g=>g.body.length===2)?.c.length!==1)throw Error('Unexpected actual source');
const boundaries={},examples={};
function rejected(k,path,pre,post){boundaries[k]=(boundaries[k]||0)+1;if(!examples[k])examples[k]={path,pre,post};return null;}
function chain(s,r,d,ids){if(base.blocked(r))return false;const i=s.b.findIndex(g=>eq(g.r,r));if(i<0)return true;if(!chain(s,add(r,d),d,ids))return false;ids.push(i);return true;}
function step(s,a,path){const plans=[];for(const p of s.p){let d=a,q=p.r,ids=[],ok=false;for(let i=0;i<4;i++,d=L[d]){q=add(p.r,d);ids=[];if(chain(s,q,d,ids)){ok=true;break;}}plans.push({p,q:ok?q:p.r,d:ok?d:a,ids:ok?ids:[]});}
 const bs=copy(s.b),dirs=new Map();for(const z of plans)for(const i of z.ids){if(dirs.has(i)&&dirs.get(i)!==z.d)return rejected('forceConflict',path,s,{plans});dirs.set(i,z.d);}
 for(const[i,d]of dirs)bs[i].r=add(bs[i].r,d);for(const b of bs)for(const c of b.c)c.f=a;
 if(new Set(bs.map(g=>K(g.r))).size!==bs.length)return rejected('newOverlap',path,s,{b:bs,plans});
 const ps=[];for(const z of plans){const g=bs.find(g=>eq(g.r,z.q));if(g){if(g.c.length)return rejected('occupiedCapture',path,s,{b:bs,receiver:z});if(g.body.length>1)return rejected('newStackCapture',path,s,{b:bs,receiver:z});if(base.spikes.has(K(z.q)))return rejected('ghostCapture',path,s,{b:bs,receiver:z});g.c.push({id:z.p.id,f:z.d,fork:z.p.fork,ghost:0,height:1});continue;}
  if(base.spikes.has(K(z.q)))continue;const old=ps.find(p=>eq(p.r,z.q));if(old)old.fork=Math.max(old.fork,z.p.fork);else ps.push({...z.p,r:z.q,f:z.d});}
 return{b:bs,p:ps};
}
function hash(s){return s.b.map(g=>[g.body.map(b=>b.id).sort().join('+'),K(g.r),g.c.map(c=>c.id+':'+c.fork+':'+c.height).sort().join('+')].join(':')).sort().join('|')+'#'+s.p.map(p=>p.id+':'+K(p.r)+':'+p.fork).sort().join('|');}
const light=g=>[5,6,7].includes(g.r[0])&&[6,7].includes(g.r[1]);
function replay(path,start=seed){let s=copy(start),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,n:i+1,trace};trace.push({n:i+1,a:path[i],s:copy(s)});}return{valid:true,s,trace};}
function search(cap=2000,depth=35){const q=[{s:seed,path:''}],seen=new Set([hash(seed)]);let head=0,cut=0,maxY=3;const liveStats={};while(head<q.length&&head<cap){const z=q[head++],st=z.s.b.find(g=>g.body.length===2);maxY=Math.max(maxY,st.r[1]);const actors=z.s.p.length+z.s.b.reduce((n,b)=>n+b.c.length,0);liveStats[actors]=(liveStats[actors]||0)+1;if(light(st))return{hit:z,expanded:head,seen:seen.size,pending:q.length-head,cap,depth,depthCut:cut,maxStackY:maxY,liveStats};if(z.path.length>=depth){cut++;continue;}for(const a of 'WASD'){const n=step(z.s,a,z.path+a);if(!n)continue;const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path:z.path+a});}}
 return{hit:null,expanded:head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,cap,depth,depthCut:cut,maxStackY:maxY,liveStats};}
const mode=process.argv[2]||'audit';
if(require.main===module){const result=mode==='search'?search():replay(mode==='audit'?'SAWW':mode);console.log(JSON.stringify({sourceEvent:src.i,sourceFrame:src.o.frame,seed,mode,result,boundaries,examples,liveHandle:null,scope:'Actual20, rigid stack groups (M052), cargo global face, ordinary WASD; no X, no new stack/conflict/occupied/ghost propagation; fixed Prisms can push only to real floor. Stack cargo SPIKE protection is analogous, not newly actual. First-light geometry only, no hidden optical completion.'},null,2));}
module.exports={seed,step,replay,search,sourceEvent:src.i,raw};
