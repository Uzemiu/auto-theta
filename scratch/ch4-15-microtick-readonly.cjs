// MODEL ONLY: targeted fork-X primary tick followed by ICE continuation.
// Built from own observed model; no game I/O, hidden implementation or hints.
const fs=require('fs'),vm=require('vm');const src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
const ctx={require,process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))+
 '\nmodule.exports={step,wall,spike,ice,chain};',ctx);
const {step,wall,spike,ice,chain}=ctx.module.exports,K=p=>p.join(','),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'};
const add=(p,d)=>[p[0]+V[d][0],p[1]+V[d][1]],same=(a,b)=>K(a)===K(b),cp=s=>JSON.parse(JSON.stringify(s));
const mode=process.argv[2]||'26',cap=Math.min(Number(process.argv[3])||4500,6500),depth=24;
const initial=mode==='25'?{b:[{r:[4,4],color:4},{r:[4,6],color:3}],p:[{r:[4,3],f:'W',fork:0,c:-1,ghost:0},{r:[4,6],f:'W',fork:2,c:1,ghost:0}],rem:[]}:
 mode==='27'?{b:[{r:[4,3],color:4},{r:[4,4],color:3},{r:[3,6],color:3}],p:[{r:[4,2],f:'S',fork:0,c:-1,ghost:0},{r:[4,4],f:'A',fork:1,c:1,ghost:0},{r:[3,6],f:'A',fork:1,c:2,ghost:0}],rem:[]}:
 {b:[{r:[4,4],color:4},{r:[3,6],color:3},{r:[5,6],color:3}],p:[{r:[4,3],f:'W',fork:0,c:-1,ghost:0},{r:[3,6],f:'W',fork:1,c:1,ghost:0},{r:[5,6],f:'W',fork:1,c:2,ghost:0}],rem:[]};
const hash=s=>s.b.map(b=>b.color+':'+K(b.r)).join('|')+'|'+s.p.map(p=>[...p.r,p.c,p.fork,p.fork?p.f:''].join(',')).sort().join(';');
let stats={xChecked:0,primaryDirectStacks:0,primaryConflicts:0,iceBranches:0,fusedIceDirections:0,lateStacks:0,microPushConflicts:0,freeCollision:0,stoppedIce:0},probes=[];
function primary(s){
 const ei=s.b.findIndex(b=>b.color===4),empty=s.b[ei],free=s.p.find(p=>p.c<0);if(!empty||!free)return [];
 let births=[];stats.xChecked++;
 for(const p of s.p.filter(p=>p.c>=0)){
  if(p.fork<=0){births.push({r:p.r,d:null,f:p.f,fork:p.fork});continue;}
  const f=p.f,l=L[f],dirs=[l,L[L[l]],f],valid=[];
  for(const d of dirs){const r=add(p.r,d);if(wall.has(K(r)))continue;let push=null;
   if(same(r,empty.r)){if(wall.has(K(add(r,d))))continue;push=d;}
   valid.push({r,d,push,f,fork:p.fork-1});if(valid.length===2)break;
  }
  if(!valid.length)valid.push({r:p.r,d:null,f:p.f,fork:p.fork-1});births.push(...valid);
 }
 const dirs=[...new Set(births.filter(z=>z.push).map(z=>z.push))],branches=[];if(dirs.length>1)stats.primaryConflicts++;
 for(const win of dirs.length>1?dirs:[dirs[0]||null]){
  const er=win?add(empty.r,win):empty.r,active=births.filter(z=>!z.push||z.push===win);
  if(active.some(z=>same(z.r,er))){stats.primaryDirectStacks++;continue;} // Old direct-family excluded.
  if(active.some(z=>same(z.r,free.r))){stats.freeCollision++;continue;} // Multiple PLAYER in one new box not assumed.
  let b=[],p=[],slides=[];
  for(const z of active){let i=b.findIndex(b=>same(b.r,z.r));
   if(i>=0){p[i].fork=Math.max(p[i].fork,z.fork);if(ice.has(K(z.r))&&z.d){const old=slides.find(t=>t.i===i);if(old&&!old.dirs.includes(z.d)){old.dirs.push(z.d);stats.fusedIceDirections++;}}continue;}
   i=b.length;b.push({r:z.r,color:3});p.push({r:z.r,f:z.f,fork:z.fork,c:i,ghost:0});
   if(ice.has(K(z.r))&&z.d)slides.push({i,dirs:[z.d]});
  }
  const ci=b.length;b.push({r:er,color:4});p.push({...free});if(win&&ice.has(K(er)))slides.push({i:ci,dirs:[win]});
  const state={b,p,rem:[]};
  if(!win&&ice.has(K(er)))stats.stoppedIce++; // Resumption of already blocked ICE box is not assumed.
  branches.push({state,slides,win});
 }
 return branches;
}
function micro(s,slides,path){
 if(!slides.length)return [s];stats.iceBranches++;
 const choices=[];function pick(i,z){if(i===slides.length){choices.push(z);return;}for(const d of slides[i].dirs)pick(i+1,z.concat({i:slides[i].i,d}));}pick(0,[]);
 const out=[];
 for(const choice of choices){let intents=[];
  for(const z of choice){let ids=[];if(chain(s,s.b[z.i].r,z.d,ids))intents.push({ids,d:z.d});}
  const requests=new Map();let conflict=false;
  for(const z of intents)for(const i of z.ids){if(requests.has(i)&&requests.get(i)!==z.d)conflict=true;requests.set(i,z.d);}
  if(conflict){stats.microPushConflicts++;probes.push({kind:'micro-push-conflict',path,state:s,choice,intents});continue;}
  const b=s.b.map((q,i)=>({...q,r:requests.has(i)?add(q.r,requests.get(i)):q.r})),pairs=[];
  for(let i=0;i<b.length;i++)for(let j=i+1;j<b.length;j++)if(same(b[i].r,b[j].r)&&b[i].color!==b[j].color)pairs.push([i,j]);
  if(pairs.length){stats.lateStacks++;probes.push({kind:'late-stack',path,state:s,choice,intents,afterBoxes:b,pairs,goal:pairs.some(([i])=>['1,8','2,7','3,6','5,6','6,7','7,8'].includes(K(b[i].r)))});continue;}
  // Same-origin microcollision would fuse; not a new different-origin stack.
  if(b.length!==new Set(b.map(b=>K(b.r))).size)continue;
  let p=s.p.map(q=>q.c>=0?{...q,r:b[q.c].r}:q);if(p.some(q=>q.c<0&&b.some(box=>same(q.r,box.r)))){stats.freeCollision++;continue;}
  out.push({b,p,rem:[]});
 }
 return out;
}
let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0;
while(head<q.length&&head<cap){const s=q[head],path=paths[head++];
 if(s.p.some(p=>p.c>=0&&p.fork>0))for(const z of primary(s)){
  for(const n of micro(z.state,z.slides,path+'X')){
   // Only source25 continues through its first X to the new two-F1 domain.
   if(mode!=='25'||!n.p.some(p=>p.c>=0&&p.fork>0))continue;
   const k=hash(n);if(seen.has(k))continue;seen.add(k);q.push(n);paths.push(path+'X');
  }
 }
 if(path.length>=depth)continue;
 for(const a of 'WASD'){const n=step(s,a);if(!n||n.p.length!==s.p.length||n.p.some(p=>p.ghost)||n.b.some(b=>b.r[1]<=1))continue;
  const k=hash(n);if(seen.has(k))continue;seen.add(k);q.push(n);paths.push(path+a);}
}
for(const p of probes.slice(0,16))console.log('NEW_MICROTICK_PREDICATE',JSON.stringify(p));
console.log('FINITE_MICRO',JSON.stringify({source:mode,expanded:head,seen:seen.size,exhausted:head===q.length,cap,depth,stats,probes:probes.length,
 scope:'ordinary deployment then cargo-X + explicit one ICE continuation; different-origin microcollision only, old direct stack excluded; no free-to-born-box multi-cargo, no stopped-ICE resumption, no prior stack, y1 box excluded'}));
