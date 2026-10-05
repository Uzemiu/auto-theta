// Read-only fixed cargo-tail audit. No search, input, save, or canonical writes.
// Geometry is public initial; step is reused from our observed 4-22 model.
const fs=require('fs'),vm=require('vm'),merges=[];
let code=fs.readFileSync('scratch/ch4-22-readonly.cjs','utf8')
 .replaceAll('artifacts/slot1-playthrough/4-22.json','artifacts/slot1-playthrough/4-26.json')
 .replace('copy=s=>JSON.parse(JSON.stringify(s))','copy=s=>structuredClone(s)')
 .replace('(1<<keys.length)-1','(1n<<BigInt(keys.length))-1n')
 .replace('(km&(1<<i))','(km&(1n<<BigInt(i)))')
 .replace('km&=~(1<<i)','km&=~(1n<<BigInt(i))')
 .replace('keys:s.keys,locks:s.locks','keys:s.keys.toString(),locks:s.locks')
 .replace('if(!old.c&&z.c)old.c=z.c;','if(!old.c&&z.c)old.c=z.c;else if(old.c&&z.c){if(old.kind===\'Prism\'&&(old.c.fork>0||z.c.fork>0)){boundary(\'stack\',path,s);return null;}auditMerge.push({r:z.r,a:old.c.fork,b:z.c.fork});old.c.fork=Math.max(old.c.fork,z.c.fork);}')
 +'\nmodule.exports.stats=stats;module.exports.samples=samples;';
const mod={exports:{}};vm.runInNewContext(code,{require,module:mod,console,process,structuredClone,auditMerge:merges});
const m=mod.exports,keys=m.t.entities.filter(e=>e.type==='KEY');
// All fixed cargo paths stay away from this stationary Prism; it is an obstacle,
// never converted into a cargo Box or used to infer light/completion flags.
for(const e of m.t.entities.filter(e=>e.type==='PRISM'))m.wall.add(e.pos.join(','));
function source(r,fork,face='W',spent=[]){let km=m.initial.keys;
 for(const p of [...spent,r,[15,2]]){const i=keys.findIndex(e=>e.pos.join(',')===p.join(','));if(i>=0)km&=~(1n<<BigInt(i));}
 return{b:[{r,orig:46,color:3,c:{f:face,fork,key:0,ghost:0}}],p:[],keys:km,locks:0};
}
function run(r,fork,path,face='W',spent=[],extra=[]){for(const k in m.stats)m.stats[k]=0;for(const k in m.samples)m.samples[k]=[];merges.length=0;
 const seed=source(r,fork,face,spent);seed.b.push(...structuredClone(extra));const out=m.replay(path,seed);
 return{source:m.summary(seed),path,count:path.length,valid:out.valid,failedAt:out.n,mask:out.valid?m.mask(out.s):0,
 trace:out.trace.map(z=>({n:z.n,a:z.a,forkCargo:z.s.boxes.filter(b=>b.c?.fork>0).map(b=>({r:b.p,f:b.c.f,fork:b.c.fork})),prism:z.s.boxes.filter(b=>b.id===92).map(b=>({r:b.p,c:b.c})),nearGoal:z.s.boxes.filter(b=>b.p[0]>=2&&b.p[0]<=5&&b.p[1]>=12).map(b=>({r:b.p,fork:b.c?.fork,ghost:b.c?.ghost})),free:z.s.free})),
 final:out.valid?m.summary(out.s):null,stats:structuredClone(m.stats),samples:structuredClone(m.samples),merges:structuredClone(merges)};
}
const macro='XXXDXXXWXXXXXXDXXXXWXXDXWX';
function fixed(){return{forkCount:keys.length,initialMask:m.initial.keys.toString(),scope:'fixed cargo-only conditional sources; 45-bit BigInt inventory, exact Wall/floor/SPIKE; static original Prism16,4; no search or optical simulation',
 topF1:run([3,14],1,'WX'),topF2:run([3,13],2,'AXWX'),
 topPrefill:run([3,13],1,'AX','W',[],[{r:[3,14],orig:46,color:3,c:{f:'W',fork:0,key:0,ghost:0}}]),
 lowerF1:run([11,3],1,macro),lowerF2:run([11,3],2,macro),
 lowerF2At4:run([11,4],2,macro.slice(1),'W',[[11,1],[11,2],[11,3]])};}
function relay(cap=6000,depth=45){
 // New explicitly authorized conditional geometry, not the earlier cargo-only
 // family. A Prism is a pushable mixed-chain body; no Prism cargo is propagated.
 m.wall.delete('16,4');
 const start=source([11,2],1);start.b.push({r:[12,2],orig:92,color:1,kind:'Prism',c:null});start.p=[{r:[13,2],f:'W',fork:0,key:0}];
 for(const k in m.stats)m.stats[k]=0;for(const k in m.samples)m.samples[k]=[];merges.length=0;
 const score=s=>{let cy=0,fy=0,forks=0;for(const b of s.b)if(b.c){cy=Math.max(cy,b.r[1]);if(b.c.fork)fy=Math.max(fy,b.r[1]);forks+=b.c.fork;}
  const pri=s.b.find(b=>b.orig===92),head=s.b.some(b=>b.c?.fork===0&&b.r.join(',')==='3,14'),rear=s.b.some(b=>b.c?.fork>0&&b.r.join(',')==='3,13');
  return 12*cy+18*fy+4*(pri?.r[1]||0)+2*forks+15*s.p.length+40*head+80*(head&&rear);};
 let serial=0;const heap=[],best=new Map(),closed=new Map();
 const ahead=(a,b)=>a.sc>b.sc||(a.sc===b.sc&&(a.path.length<b.path.length||(a.path.length===b.path.length&&a.serial<b.serial)));
 function push(z){z.serial=serial++;let i=heap.length;heap.push(z);while(i>0){let j=(i-1)>>1;if(!ahead(heap[i],heap[j]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
 function pop(){const z=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(true){let j=i,l=2*i+1,r=l+1;if(l<heap.length&&ahead(heap[l],heap[j]))j=l;if(r<heap.length&&ahead(heap[r],heap[j]))j=r;if(j===i)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return z;}
 const k0=m.hash(start);best.set(k0,0);push({s:start,path:'',sc:score(start),k:k0});
 let expanded=0,cut=0,stale=0,hit=null,maxY=0,maxForkY=0,highest=null,priCapture=0,ghost=0,maxFork=0,firstF2=null;
 const priSamples=[];
 while(heap.length&&expanded<cap){const z=pop(),d=z.path.length;if(d!==best.get(z.k)||(closed.has(z.k)&&closed.get(z.k)<=d)){stale++;continue;}closed.set(z.k,d);expanded++;
  for(const b of z.s.b)if(b.c){if(b.r[1]>maxY){maxY=b.r[1];highest={path:z.path,s:m.summary(z.s)};}if(b.c.fork)maxForkY=Math.max(maxForkY,b.r[1]);if(b.c.fork>maxFork){maxFork=b.c.fork;if(maxFork>=2&&!firstF2)firstF2={path:z.path,s:m.summary(z.s)};}}
  const pri=z.s.b.find(b=>b.orig===92),optic=pri?.r.join(',')==='3,15'&&z.s.b.some(b=>b.c&&!b.c.ghost&&b.r.join(',')==='3,14');
  if(m.mask(z.s)||optic){hit={kind:m.mask(z.s)?'directGoal':'PrismGoal+southAdjacentCargo',path:z.path,len:d,s:m.summary(z.s)};break;}
  if(d>=depth){cut++;continue;}if(!z.s.p.length&&!z.s.b.some(b=>b.c?.fork))continue;
  for(const a of 'WASDX')for(const out of m.step(z.s,a,z.path+a)){
   const n=out.s,np=n.b.find(b=>b.orig===92);if(np?.c){priCapture++;if(priSamples.length<3)priSamples.push({path:z.path+a,source:m.summary(z.s),result:m.summary(n)});continue;}
   if(n.b.some(b=>b.c?.ghost)){ghost++;continue;}const k=m.hash(n),nd=d+1;if(best.has(k)&&best.get(k)<=nd)continue;
   best.set(k,nd);push({s:n,path:z.path+a,k,sc:score(n)-0.3*nd});
  }
 }
 let replay=null;if(hit){let s=structuredClone(start),trace=[];for(let i=0;i<hit.path.length;i++){const out=m.step(s,hit.path[i],hit.path.slice(0,i+1));if(out.length!==1){replay={valid:false,n:i+1,branches:out.length};break;}s=out[0].s;trace.push({n:i+1,a:hit.path[i],s:m.summary(s)});}if(!replay)replay={valid:true,directMask:m.mask(s),final:m.summary(s),trace};}
 return{scope:'one new conditional Blue11,2F1/Pri12,2/outside13,2F0 domain; WASDX; 45-bit inventory; mixed pushes, same-origin max; no Prism capture/X, Ghost, independent stack or X-force propagation',algorithm:'best-first: 12*highestCargoY +18*highestForkCargoY +4*PrismY +2*totalFork +15*liveFree +40*F0head3,14 +80*(head&ForkRear3,13) -.3*inputLength',source:m.summary(start),cap,depth,expanded,seen:best.size,queueEntries:serial,pending:heap.length,stale,depthCut:cut,exhausted:heap.length===0,hit,replay,maxCargoY:maxY,maxForkCargoY:maxForkY,maxFork,firstF2,highest,priCapture,priSamples,ghost,stats:structuredClone(m.stats),samples:structuredClone(m.samples)};
}
function observedPrism23(){
 // Enabled only after root's real MCP confirmation and events41 of actual23:
 // a single fork-bearing Prism copied to two active contained cargo Prisms.
 const observations=m.raw.events.map(e=>e.observation).filter(Boolean),o=[...observations].reverse().find(o=>o.level?.id==='dna'&&o.level.instructions==='DDWWWDSSSAXAAWAADSSAADX');
 if(!o)throw Error('Required actual23 Prism-copy evidence absent');
 const t=o.level.timelines[0],es=t.entities,pri=es.filter(e=>e.active&&e.type==='PRISM');
 if(pri.length!==2||!pri.some(e=>e.pos.join(',')==='11,1')||!pri.some(e=>e.pos.join(',')==='11,3'))throw Error('Actual23 source differs');
 m.wall.delete('16,4');let km=m.initial.keys;for(let i=0;i<keys.length;i++)if(es.some(e=>e.id===keys[i].id&&!e.active))km&=~(1n<<BigInt(i));
 const start={b:es.filter(e=>e.active&&['BOX','PRISM'].includes(e.type)).map(e=>{const p=es.find(p=>p.active&&p.type==='PLAYER'&&p.properties.contained&&p.properties.container===e.id);return{r:e.pos,orig:e.type==='PRISM'?92:e.id,color:e.details.Color,kind:e.type==='PRISM'?'Prism':'Box',c:p?{f:['W','A','S','D'][p.properties.face],fork:p.properties.split,key:p.properties.key,ghost:p.properties.ghost}:null};}),p:es.filter(e=>e.active&&e.type==='PLAYER'&&!e.properties.contained).map(e=>({r:e.pos,f:['W','A','S','D'][e.properties.face],fork:e.properties.split,key:e.properties.key})),keys:km,locks:0};
 function one(path){for(const k in m.stats)m.stats[k]=0;for(const k in m.samples)m.samples[k]=[];merges.length=0;let s=structuredClone(start),trace=[],firstMerge=null;
  for(let i=0;i<path.length;i++){const n0=merges.length,out=m.step(s,path[i],path.slice(0,i+1)),newMerges=structuredClone(merges.slice(n0));if(newMerges.length&&!firstMerge)firstMerge={n:i+1,actual:24+i,a:path[i],source:m.summary(s),merges:newMerges};
   if(out.length!==1)return{valid:false,n:i+1,branches:out.length,trace,firstMerge,stats:structuredClone(m.stats),samples:structuredClone(m.samples)};
   s=out[0].s;trace.push({n:i+1,actual:24+i,a:path[i],s:m.summary(s),merges:newMerges});}
  return{path,len:path.length,valid:true,directMask:m.mask(s),trace,firstMerge,stats:structuredClone(m.stats),mergeInventory:[...new Set(merges.map(z=>[z.a,z.b].sort().join('+')))],final:m.summary(s)};
 }
 return{scope:'fixed actual23 Prism-copy source, no search; same-origin Prism F0+F0 fusion observed actual24; charged Prism overlap is a stopped boundary; no optics algorithm',source:m.summary(start),immediateX:one('X'),faceWThenUpper:one('W'+macro),immediateXThenUpper:one('XW'+macro.slice(1))};
}
function leadingTurns(){
 m.wall.delete('16,4');
 const extra=[{r:[11,3],orig:92,color:1,kind:'Prism',c:null}],one='XXXXWXDXWXXAXWXAXX',two=one+'XWXDXWXX';
 return{scope:'fixed turn structure only; root MODEL47 not actual, Blue11,2F1/A, empty leadingPri11,3, no outside; no search',
 firstTurn:run([11,2],1,one,'A',[[11,1]],extra),secondTurn:run([11,2],1,two,'A',[[11,1]],extra)};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='relay'?relay():process.argv[2]==='prism23'?observedPrism23():process.argv[2]==='leading-turns'?leadingTurns():fixed(),null,2));
module.exports={m,source,run,fixed,relay,observedPrism23,leadingTurns};
