// Private model from observed 4-26 initial and public KB mechanisms only.
// No game input, implementation access, save or main-KB writes.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-26.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),copy=s=>JSON.parse(JSON.stringify(s));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos))),floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos))),keys=t.entities.filter(e=>e.type==='KEY'),locks=t.entities.filter(e=>e.type==='LOCK');
const initial={b:t.entities.filter(e=>(e.type==='BOX'||e.type==='PRISM')).map(e=>({r:e.pos,orig:e.id,color:e.details.Color,kind:e.type,c:null})),p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({r:e.pos,f:['W','A','S','D'][e.properties.face],fork:e.properties.split,key:e.properties.key})),keys:((1n<<BigInt(keys.length))-1n).toString(),locks:((1n<<BigInt(locks.length))-1n).toString()};
const stats={stack:0,occupied:0,conflict:0,ghost:0},samples={stack:[],occupied:[],conflict:[]};
function boundary(k,path,s){stats[k]++;if(samples[k].length<3)samples[k].push({path,s:summary(s)});}
function blocked(r,s,p){if(wall.has(K(r))||!floor.has(K(r)))return true;const i=locks.findIndex(l=>eq(l.pos,r));return i>=0&&(BigInt(s.locks)&(1n<<BigInt(i)))&&!(p?.key>0);}
function chain(bs,r,d,ids,s,actor){if(blocked(r,s,actor))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids,s,bs[i].c))return false;ids.push(i);return true;}
function finish(bs,free,s,path){const b=[];for(const z of bs){const old=b.find(q=>eq(q.r,z.r));if(!old){b.push(z);continue;}if(old.orig!==z.orig||(old.kind==='PRISM'&&((old.c?.fork||0)>0||(z.c?.fork||0)>0))){boundary('stack',path,s);return null;}if(!old.c&&z.c)old.c=z.c;else if(old.c&&z.c){old.c.fork=Math.max(old.c.fork,z.c.fork);}}
 let km=BigInt(s.keys),lm=BigInt(s.locks);function pickup(z,r){for(let i=0;i<keys.length;i++)if((km&(1n<<BigInt(i)))&&eq(keys[i].pos,r)){km&=~(1n<<BigInt(i));if(keys[i].details.isFork)z.fork++;else z.key++;}for(let i=0;i<locks.length;i++)if((lm&(1n<<BigInt(i)))&&eq(locks[i].pos,r)&&z.key>0){z.key--;lm&=~(1n<<BigInt(i));}}
 // Actual33: an empty single Prism pushed onto a stationary free actor contains it.
 // Actual23 also verifies Fork-X copies the Prism and its contained actor.
 // Actual24 verifies same-origin F0+F0 Prism fusion; charged overlap is a boundary.
 for(const z of b)if(z.c)pickup(z.c,z.r);const ps=[];for(const p of free){pickup(p,p.r);const z=b.find(q=>eq(q.r,p.r));if(z){if(z.c){boundary('occupied',path,s);return null;}z.c={f:p.f,fork:p.fork,key:p.key,ghost:spike.has(K(p.r))?1:0};if(z.c.ghost)stats.ghost++;continue;}if(spike.has(K(p.r)))continue;const old=ps.find(q=>eq(q.r,p.r));if(old){old.fork=Math.max(old.fork,p.fork);old.key=Math.max(old.key,p.key);}else ps.push(p);}
 return{b,p:ps,keys:km.toString(),locks:lm.toString()};}
function step(s,a,path=''){
 if(a!=='X'){const plans=[],dirs=new Map();for(const p of s.p){let d=a,r,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids,s,p)){ok=true;break;}}plans.push({...p,r:ok?r:p.r,f:ok?d:a});for(const i of ids){if(!dirs.has(i))dirs.set(i,new Set());dirs.get(i).add(d);}}
 const conflicts=[...dirs].filter(([i,ds])=>ds.size>1);if(conflicts.length)boundary('conflict',path,s);const choices=[];function choose(j,c){if(j===conflicts.length){choices.push(c);return;}for(const d of conflicts[j][1])choose(j+1,{...c,[conflicts[j][0]]:d});}choose(0,{});const out=[];for(const choice of choices){const keep=plans.filter(p=>{let dd=p.f,ids=[];if(!chain(s.b,p.r,dd,ids,s,p))return true;return ids.every(i=>choice[i]===undefined||choice[i]===dd);}),accepted=new Map();for(const p of keep){const ids=[];chain(s.b,p.r,p.f,ids,s,p);for(const i of ids)accepted.set(i,p.f);}const bs=s.b.map((z,i)=>({...copy(z),r:accepted.has(i)?add(z.r,accepted.get(i)):z.r,c:z.c?{...z.c,f:a}:null}));const n=finish(bs,keep,s,path);if(n)out.push({s:n,axis:conflicts.length?choice:null});}return out;}
 if(![...s.p,...s.b.filter(b=>b.c).map(b=>b.c)].some(p=>p.fork>0))return[];
 const bs=s.b.filter(b=>!b.c?.fork).map(copy),plans=[];function birth(r,p,parent){let n=0;for(const d of[L[p.f],L[L[L[p.f]]],p.f]){const q=add(r,d),ids=[];if(!chain(bs,q,d,ids,s,p))continue;plans.push({...p,r:q,fork:p.fork-1,d,ids,parent});if(++n===2)break;}if(!n)plans.push({...p,r,fork:p.fork-1,d:null,ids:[],parent});}
 for(const b of s.b.filter(b=>b.c?.fork>0))birth(b.r,b.c,b);for(const p of s.p)if(p.fork>0)birth(p.r,p,null);else plans.push({...p,d:null,ids:[],parent:null});
 const dirs=new Map();for(const p of plans)for(const i of p.ids){if(!dirs.has(i))dirs.set(i,new Set());dirs.get(i).add(p.d);}if([...dirs.values()].some(ds=>ds.size>1)){boundary('conflict',path,s);return[];}
 for(const[i,ds]of dirs)bs[i].r=add(bs[i].r,[...ds][0]);const free=[];for(const p of plans)if(p.parent)bs.push({...copy(p.parent),r:p.r,c:{f:p.f,fork:p.fork,key:p.key,ghost:p.ghost}});else free.push({r:p.r,f:p.f,fork:p.fork,key:p.key});const n=finish(bs,free,s,path);return n?[{s:n}]:[];
}
function summary(s){return{boxes:s.b.map(b=>({id:b.orig,color:b.color,kind:b.kind,p:b.r,c:b.c})),free:s.p,keys:s.keys,locks:s.locks};}
const hash=s=>s.b.map(b=>[b.orig,K(b.r),b.c?`${b.c.fork}:${b.c.key}:${b.c.fork?b.c.f:'-'}:${b.c.ghost}`:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.key,p.fork?p.f:'-'].join(':')).sort().join(';')+'|'+s.keys+'|'+s.locks;
function replay(path,start=initial){let s=copy(start),trace=[];for(let i=0;i<path.length;i++){const out=step(s,path[i],path.slice(0,i+1));if(!out.length)return{valid:false,n:i+1,trace};s=out[0].s;trace.push({n:i+1,a:path[i],s:summary(s)});}return{valid:true,s,trace};}


const safe2='DD',s2=replay(safe2).s;
function directed(cap=3000,depth=30){
 const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),target=[[15,5],[15,1]];
 const heur=s=>{const b=s.b.find(b=>b.kind==='BOX'),r=s.b.find(b=>b.kind==='PRISM');return 2*(dist(b.r,[15,3])+dist(r.r,[15,4]))+(s.p.length===2?Math.min(dist(s.p[0].r,target[0])+dist(s.p[1].r,target[1]),dist(s.p[0].r,target[1])+dist(s.p[1].r,target[0])):dist(s.p[0].r,target[0])+4);};
 const heap=[];function push(v){heap.push(v);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].score<=v.score)break;heap[i]=heap[p];i=p;}heap[i]=v;}function pop(){const out=heap[0],v=heap.pop();if(heap.length){let i=0;while(2*i+1<heap.length){let c=2*i+1;if(c+1<heap.length&&heap[c+1].score<heap[c].score)c++;if(heap[c].score>=v.score)break;heap[i]=heap[c];i=c;}heap[i]=v;}return out;}
 push({s:s2,path:'',score:heur(s2)});const seen=new Map([[hash(s2),0]]);let expanded=0,cut=0,hit=null,best=heur(s2),bestExample=null;
 while(heap.length&&expanded<cap){const z=pop();if(seen.get(hash(z.s))<z.path.length)continue;expanded++;const hh=heur(z.s);if(hh<best){best=hh;bestExample={path:z.path,s:summary(z.s)};}if(!hh&&z.s.p.length===2){hit={path:z.path,full:safe2+z.path,s:summary(z.s),captureS:replay('S',z.s)};break;}if(z.path.length>=depth){cut++;continue;}for(const a of'WASDX')for(const o of step(z.s,a,z.path+a)){const n=o.s;if(n.b.some(b=>b.c)||n.p.length!==(z.path.includes('X')||a==='X'?2:1))continue;const k=hash(n),len=z.path.length+1;if(seen.has(k)&&seen.get(k)<=len)continue;seen.set(k,len);push({s:n,path:z.path+a,score:len+2*heur(n)});}}
 return{expanded,seen:seen.size,pending:heap.length,depthCut:cut,best,bestExample,hit,stats,samples,scope:'NEW directed mixedchain firstcapture: Blue15,3/Prism15,4, twoFree15,5/15,1 same parity; S chain catches receiver into Blue15,2 with outside15,4. DD firstFork source; ordinary+firstfreeX, no Prism containment/pickup or optical assumptions, no Ghost/independentstack/occupied fusion.'};
}
const mask=s=>raw.initial.level.goals.reduce((m,g,i)=>m|([...s.p,...s.b.filter(b=>b.c&&!b.c.ghost)].some(z=>eq(z.r,g))?1<<i:0),0);
// Distinct directed domain: horizontal mixed chain captures at recoverable 13,4.
// First X site is variable; this does not fix both children to the first DD-X pose.
function horizontalCapture(cap=3000,depth=35){
 const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]), target=[[13,5],[16,4]];
 const heur=s=>{const b=s.b.find(b=>b.kind==='BOX'),r=s.b.find(b=>b.kind==='PRISM');return 2*(dist(b.r,[14,4])+dist(r.r,[15,4]))+(s.p.length===2?Math.min(dist(s.p[0].r,target[0])+dist(s.p[1].r,target[1]),dist(s.p[0].r,target[1])+dist(s.p[1].r,target[0])):4+Math.min(...target.map(t=>dist(s.p[0].r,t))));};
 const heap=[];function push(v){heap.push(v);let i=heap.length-1;while(i){let p=(i-1)>>1;if(heap[p].score<=v.score)break;heap[i]=heap[p];i=p;}heap[i]=v;}function pop(){const out=heap[0],v=heap.pop();if(heap.length){let i=0;while(2*i+1<heap.length){let c=2*i+1;if(c+1<heap.length&&heap[c+1].score<heap[c].score)c++;if(heap[c].score>=v.score)break;heap[i]=heap[c];i=c;}heap[i]=v;}return out;}
 push({s:s2,path:'',score:heur(s2)});const seen=new Map([[hash(s2),0]]);let expanded=0,cut=0,best=heur(s2),example=null,hit=null;
 while(heap.length&&expanded<cap){const z=pop();if(seen.get(hash(z.s))<z.path.length)continue;expanded++;let hh=heur(z.s);if(hh<best){best=hh;example={path:z.path,s:summary(z.s)};}if(z.path.length>=depth){cut++;continue;}for(const a of 'WASDX')for(const o of step(z.s,a,z.path+a)){const n=o.s,b=n.b.find(b=>b.c),path=z.path+a;if(b){if(!b.c.ghost&&n.p.length===1&&b.r[0]>=13&&b.r[0]<=16&&b.r[1]>=2&&b.r[1]<=4){hit={full:safe2+path,path,s:summary(n)};break;}continue;}if(n.p.length!==(path.includes('X')?2:1))continue;const k=hash(n);if(seen.has(k)&&seen.get(k)<=path.length)continue;seen.set(k,path.length);push({s:n,path,score:path.length+3*heur(n)});}if(hit)break;}
 return{expanded,seen:seen.size,pending:heap.length,depthCut:cut,best,example,hit,stats,samples,scope:'NEW horizontal mixedchain target Blue14,4/Pri15,4/free13,5+16,4, same A captures recoverable Blue13,4; accepts any safe cargo x13..16/y2..4 with outside. Actual DD2 source, one freeX, no ghost propagation/stack/Prism capture/occupied merge.'};
}
// Exhaustive finite source graph, stopped on its shortest useful first capture.
// No depth/cap heuristic. Check capture BEFORE pruning states containing cargo.
// Row1 x13/14 is admitted: side-pushing into FK11,1 can regain cargo Fork1.
function fullCapture(kind='BOX'){
 const q=[{s:s2,path:''}],seen=new Set([hash(s2)]);let head=0,hit=null,dead=0,deadExamples=[];
 for(;head<q.length;head++){const z=q[head];for(const a of 'WASDX')for(const o of step(z.s,a,z.path+a)){const n=o.s,b=n.b.find(b=>b.c),path=z.path+a;
  if(b){const useful=!b.c.ghost&&n.p.length>=1&&((b.r[0]>=13&&b.r[0]<=16&&b.r[1]>=2&&b.r[1]<=4)||((b.r[0]===13||b.r[0]===14)&&b.r[1]===1)||b.c.fork>0);
   if(useful&&b.kind===kind){hit={full:safe2+path,path,s:summary(n)};break;}dead++;if(deadExamples.length<5)deadExamples.push({path,full:safe2+path,s:summary(n)});continue;
  }if(n.p.length!==(path.includes('X')?2:1))continue;const k=hash(n);if(!seen.has(k)){seen.add(k);q.push({s:n,path});}
 }if(hit)break;if(head&&head%20000===0)console.error(JSON.stringify({progress:head,seen:seen.size,pending:q.length-head-1}));}
 return{expanded:head+(head<q.length?1:0),seen:seen.size,pending:q.length-head-(head<q.length?1:0),exhausted:!hit&&head===q.length,hit,deadCaptureCount:dead,deadExamples,stats,samples,scope:'Complete ordinary plus exactly first freeX source graph DD2; keep 1 live pre-X or 2 live post-X free until first '+kind+' capture, no independent stack/occupied merge/ghost propagation. Empty single Prism containment actual33 admitted, Prism cargoX blocked as unverified. Useful capture admits mobile x13..16 y2..4 or x13/14 y1 FK11,1 route or FK cargo. First capture checked before cargo-pruning.'};
}
const observed48Path='DDWWWDSSSAXAAWAADSSAADXXWXXDXXXWXXXXXXDXXXXWXXDX';
function upper48(cap=2500,depth=16){
 const observed=raw.events.map(e=>e.observation).find(o=>o?.level?.id==='dna'&&o.level.instructions===observed48Path);
 if(!observed)throw Error('Actual48 source evidence absent');
 const source=replay(observed48Path);if(!source.valid)throw Error('Actual48 replay rejected');
 const start=source.s,active=observed.level.timelines[0].entities.filter(e=>e.active);
 for(const b of start.b){const e=active.find(e=>['BOX','PRISM'].includes(e.type)&&eq(e.pos,b.r));if(!e)throw Error('Actual48 body mismatch '+K(b.r));if(b.c){const p=active.find(p=>p.type==='PLAYER'&&p.properties.container===e.id);if(!p||p.properties.split!==b.c.fork)throw Error('Actual48 inventory mismatch '+K(b.r));}}
 const q=[{s:start,path:'',generations:0}],seen=new Set([hash(start)]);let head=0,cut=0,hit=null,best=null;
 for(;head<q.length&&head<cap;head++){
  const z=q[head],oldHead=z.s.b.find(b=>eq(b.r,[3,14])&&b.c?.fork===0),rear=z.s.b.find(b=>eq(b.r,[3,13])&&b.c?.fork>0);
  if(mask(z.s)||(oldHead&&rear)){hit={kind:mask(z.s)?'directGoal':'F0head3,14+chargedRear3,13',path:z.path,generations:z.generations,s:summary(z.s)};break;}
  const useful=z.s.b.filter(b=>b.c?.fork>0&&b.r[0]<=7&&b.r[1]>=11).map(b=>({r:b.r,fork:b.c.fork}));if(useful.length&&(!best||Math.min(...useful.map(b=>Math.abs(b.r[0]-3)+Math.abs(b.r[1]-13)))<best.distance))best={distance:Math.min(...useful.map(b=>Math.abs(b.r[0]-3)+Math.abs(b.r[1]-13))),path:z.path,charged:useful};
  if(z.generations>=depth){cut++;continue;}
  for(const macro of ['X','WX','AX','SX','DX']){let ss=z.s,ok=true;for(const a of macro){const os=step(ss,a,z.path+macro);if(os.length!==1){ok=false;break;}ss=os[0].s;}if(!ok||ss.b.some(b=>b.c?.ghost))continue;const h=hash(ss);if(seen.has(h))continue;seen.add(h);q.push({s:ss,path:z.path+macro,generations:z.generations+1});}
 }
 return{scope:'NEW actual48 upper old-head target; each generation zero/one ordinary face then global cargoX; exact lower outside/body synchronization retained in hash/replay; no optical algorithm, charged Prism fusion, independent stack, occupied capture, X-conflict or Ghost propagation',sourcePath:observed48Path,source:summary(start),cap,macroDepth:depth,expanded:head+(hit?1:0),seen:seen.size,pending:q.length-head-(hit?1:0),depthCut:cut,exhausted:!hit&&head===q.length,hit,best,stats,samples};
}
const leading47Path='DDWWWASSWWDDDSAAWASDSWXDSSSAAWWASSDSAAADDDSAAAX';
function leading47(cap=6000,depth=40){
 const rr=replay(leading47Path);if(!rr.valid)throw Error('Conditional leading47 source rejected');const start=rr.s;
 const target=s=>{const pri=s.b.find(b=>b.kind==='PRISM');return eq(pri.r,[3,15])&&s.b.some(b=>b.c&&!b.c.ghost&&eq(b.r,[3,14]));};
 const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
 const heur=s=>{const pri=s.b.find(b=>b.kind==='PRISM'),cc=s.b.filter(b=>b.c?.fork>0),rem=BigInt(s.keys);let near=0;for(let i=0;i<keys.length;i++)if((rem&(1n<<BigInt(i)))&&dist(keys[i].pos,pri.r)<=2)near++;
  return 6*dist(pri.r,[3,15])+Math.min(30,...cc.map(b=>dist(b.r,pri.r)))+Math.min(24,...cc.map(b=>dist(b.r,[3,13])))-Math.min(5,near);};
 const heap=[],best=new Map(),closed=new Map();let serial=0;
 const ahead=(a,b)=>a.score<b.score||(a.score===b.score&&a.serial<b.serial);
 function push(z){z.serial=serial++;let i=heap.length;heap.push(z);while(i>0){let j=(i-1)>>1;if(!ahead(heap[i],heap[j]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
 function pop(){const z=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(true){let j=i,l=2*i+1,r=l+1;if(l<heap.length&&ahead(heap[l],heap[j]))j=l;if(r<heap.length&&ahead(heap[r],heap[j]))j=r;if(j===i)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return z;}
 const k0=hash(start);best.set(k0,0);push({s:start,path:'',g:0,k:k0,score:heur(start)});let expanded=0,cut=0,stale=0,hit=null,closest=null;
 while(heap.length&&expanded<cap){const z=pop();if(best.get(z.k)!==z.g||(closed.has(z.k)&&closed.get(z.k)<=z.g)){stale++;continue;}closed.set(z.k,z.g);expanded++;
  const pri=z.s.b.find(b=>b.kind==='PRISM'),d=dist(pri.r,[3,15]);if(!closest||d<closest.distance)closest={distance:d,path:z.path,prism:pri.r,charged:z.s.b.filter(b=>b.c?.fork).map(b=>({r:b.r,fork:b.c.fork}))};
  if(mask(z.s)||target(z.s)){hit={kind:mask(z.s)?'directGoal':'emptyPrismGoal+southLiveCargo',path:z.path,generations:z.g,s:summary(z.s)};break;}
  if(z.g>=depth){cut++;continue;}if(!z.s.b.some(b=>b.c?.fork))continue;
  for(const macro of ['X','WX','AX','SX','DX']){let ss=z.s,ok=true;for(const a of macro){const os=step(ss,a,z.path+macro);if(os.length!==1){ok=false;break;}ss=os[0].s;}if(!ok||ss.b.some(b=>b.c?.ghost))continue;const h=hash(ss),g=z.g+1;if(best.has(h)&&best.get(h)<=g)continue;best.set(h,g);push({s:ss,path:z.path+macro,g,k:h,score:heur(ss)+.15*g});}
 }
 return{scope:'NEW conditional empty-Prism-leading source47; no live outside; zero/one ordinary face then cargoX each generation; target Prism3,15 + south live cargo3,14 is optical candidate, not modeled actual completion; same-origin Blue max fusion; independent stack/occupied capture/X-force conflict stopped',sourcePath:leading47Path,cap,macroDepth:depth,expanded,seen:best.size,pending:heap.length,depthCut:cut,stale,exhausted:heap.length===0,hit,closest,stats,samples};
}
const optical26='XXXXWXDXWXXAXWXAXXXWXDXWXX',optical41='XDXWXDXXXWXDXWXXXDXWXDXXXWXDXWXXXAXWXDXXX';
function optical114(){
 const path=leading47Path+optical26+optical41,r=replay(path),marks=new Set([34,39,46,47,51,58,65,73,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,113,114]);
 return{scope:'fixed full initial-to-optical-candidate manual relay only, no search; completion must be observed in game',path,len:path.length,valid:r.valid,failedAt:r.n,directMask:r.valid?mask(r.s):0,opticalCandidate:r.valid&&r.s.b.some(b=>b.kind==='PRISM'&&eq(b.r,[3,15]))&&r.s.b.some(b=>b.c&&!b.c.ghost&&eq(b.r,[3,14])),checkpoints:r.trace.filter(z=>marks.has(z.n)).map(z=>({n:z.n,a:z.a,prism:z.s.boxes.find(b=>b.kind==='PRISM')?.p,charged:z.s.boxes.filter(b=>b.c?.fork>0).map(b=>({r:b.p,fork:b.c.fork,f:b.c.f})),free:z.s.free,nearGoal:z.s.boxes.filter(b=>b.p[0]<=7&&b.p[1]>=11).map(b=>({r:b.p,fork:b.c?.fork}))})),stats,samples};
}
function actual114(){
 const path=leading47Path+optical26+optical41,o=raw.completion?.level?.instructions===path?raw.completion:raw.events.map(e=>e.observation).filter(o=>o?.level?.id==='dna'&&o.level.instructions===path).at(-1);
 if(!o)throw Error('Required actual114 evidence absent');const tl=o.level.timelines[0],es=tl.entities,pri=es.find(e=>e.active&&e.type==='PRISM'&&eq(e.pos,[3,15])),box=es.find(e=>e.active&&e.type==='BOX'&&eq(e.pos,[3,14])),p=box&&es.find(p=>p.active&&p.type==='PLAYER'&&p.properties.container===box.id);
 return{verified:o.level.completed&&!!pri&&!!box&&!!p&&p.properties.ghost===0,n:path.length,time:tl.time,completed:o.level.completed,pathMatches:o.level.instructions===path,prism:pri&&{id:pri.id,r:pri.pos,traversed:pri.details.traversed,testCompleted:pri.details.testCompleted},observer:p&&{box:box.id,color:box.details.Color,player:p.id,r:p.pos,fork:p.properties.split,ghost:p.properties.ghost,contained:p.properties.contained,container:p.properties.container},run:raw.run&&{completed:raw.run.completed,action_count:raw.run.action_count}};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='actual114'?actual114():process.argv[2]==='optical114'?optical114():process.argv[2]==='leading47'?leading47(Number(process.argv[3]||6000),Number(process.argv[4]||40)):process.argv[2]==='upper48'?upper48(Number(process.argv[3]||2500),Number(process.argv[4]||16)):process.argv[2]==='replay'?replay(process.argv[3]||''):process.argv[2]==='full-capture'?fullCapture(process.argv[3]||'BOX'):process.argv[2]==='horizontal'?horizontalCapture(Number(process.argv[3]||3000),Number(process.argv[4]||35)):directed(Number(process.argv[3]||3000),Number(process.argv[4]||30)),null,2));
module.exports={raw,t,initial,s2,step,replay,summary,directed,horizontalCapture,fullCapture,upper48,observed48Path,leading47,leading47Path,optical114,actual114,optical26,optical41,mask,hash,wall,floor,spike,keys};
