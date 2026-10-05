// Default fixed replays; optional root-authorized one-cap constructed-tail search.
// No game access or canonical writes.
const fs=require('fs'),vm=require('vm'),merges=[];
const code=fs.readFileSync('scratch/ch4-22-readonly.cjs','utf8')
 .replaceAll('artifacts/slot1-playthrough/4-22.json','artifacts/slot1-playthrough/4-25.json')
 .replace('if(!old.c&&z.c)old.c=z.c;', 'if(!old.c&&z.c)old.c=z.c;else if(old.c&&z.c){auditMerge.push({r:z.r,a:old.c.fork,b:z.c.fork});old.c.fork=Math.max(old.c.fork,z.c.fork);}')+'\nmodule.exports.stats=stats;module.exports.samples=samples;';
const mod={exports:{}};vm.runInNewContext(code,{require,module:mod,console,process,auditMerge:merges});
const m=mod.exports,keys=m.t.entities.filter(e=>e.type==='KEY'),copy=s=>JSON.parse(JSON.stringify(s));
const c=fork=>({f:'W',fork,key:0,ghost:0});
const seed={b:[{r:[3,4],orig:83,color:4,c:c(2)},{r:[6,6],orig:64,color:3,c:null}],p:[],keys:m.initial.keys,locks:0};
for(const r of [[5,4],[3,4]])seed.keys&=~(1<<keys.findIndex(e=>e.pos.join(',')===r.join(',')));
const path='W'+'X'.repeat(13)+'DXX';
merges.length=0;const upper=m.replay(path,seed),upperMerges=copy(merges);
const brief=z=>({boxes:z.boxes.map(b=>({r:b.p,F:b.c?.fork,color:b.color})),free:z.free});
const f1=copy(seed);f1.b[0].c.fork=1;const direct=m.replay('W'+'X'.repeat(13),f1);
const last=keys.findIndex(e=>e.pos.join(',')==='4,15');
const buffer={b:[{r:[2,15],orig:83,color:4,c:c(1)},{r:[3,15],orig:64,color:3,c:c(0)}],p:[],keys:1<<last,locks:0};
const b=m.replay('WXDX',buffer);
// Another explicit missing source: already protected SPIKE cargo carries Fork1.
// Rear Blue transmits one W without killing its external pusher.
const entrance=copy(seed);entrance.b[0].r=[3,3];entrance.b[0].c.fork=1;entrance.b[1].r=[3,2];entrance.p=[{r:[3,1],f:'W',fork:0,key:0}];entrance.keys=m.initial.keys&~(1<<keys.findIndex(e=>e.pos.join(',')==='5,4'));
const e=m.replay(path,entrance);
const entranceSwap=copy(entrance);entranceSwap.b[0].orig=64;entranceSwap.b[0].color=3;entranceSwap.b[1].orig=83;entranceSwap.b[1].color=4;const es=m.replay(path,entranceSwap);
const front=copy(seed);front.b=[{r:[3,4],orig:64,color:3,c:c(1)},{r:[3,5],orig:83,color:4,c:null}];front.p=[];
const front12=m.replay('W'+'X'.repeat(12),front),front13=m.replay('W'+'X'.repeat(13),front);
const fixed={scope:'fixed conditional replays; zero BFS',strong:{path,count:path.length,valid:upper.valid,failedAt:upper.n,mask:upper.valid?m.mask(upper.s):0,trace:upper.trace.filter(z=>[1,2,8,11,12,13,14,15,16,17].includes(z.n)).map(z=>({n:z.n,a:z.a,s:brief(z.s)})),mergeInventory:[...new Set(upperMerges.map(z=>[z.a,z.b].sort().join('+')))]},fork1Direct:{path:'W'+ 'X'.repeat(13),valid:direct.valid,mask:direct.valid?m.mask(direct.s):0,final:direct.valid?m.summary(direct.s):null},buffer:{path:'WXDX',valid:b.valid,mask:b.valid?m.mask(b.s):0,trace:b.trace.map(z=>({n:z.n,a:z.a,s:brief(z.s)}))},protectedEntrance:{path,valid:e.valid,mask:e.valid?m.mask(e.s):0,afterW:e.trace[0]?.s,final:e.valid?m.summary(e.s):null},swappedProtectedEntrance:{valid:es.valid,mask:es.valid?m.mask(es.s):0,finalFree:es.valid?es.s.p:null},frontEmptyNoOutside:{source:m.summary(front),after12X:front12.valid?m.summary(front12.s):null,after13X:front13.valid?m.summary(front13.s):null,mask13:front13.valid?m.mask(front13.s):0}};
function search(cap=5000,depth=20){
 const start=copy(seed);start.b=[{r:[3,4],orig:64,color:3,c:c(1)},{r:[3,3],orig:83,color:4,c:null}];start.p=[{r:[3,2],f:'W',fork:0,key:0}];
 for(const k in m.stats)m.stats[k]=0;for(const k in m.samples)m.samples[k]=[];merges.length=0;
 const q=[{s:start,path:'',d:0}],seen=new Set([m.hash(start)]);let h=0,cut=0,lost=0,hit=null,maxY=0,furthest=null,pre=null;
 const macros=['X','WX','AX','SX','DX','W','A','S','D'];
 while(h<q.length&&h<cap){const z=q[h++],gm=m.mask(z.s);for(const b of z.s.b.filter(b=>b.c?.fork>0))if(b.r[1]>maxY){maxY=b.r[1];furthest={path:z.path,d:z.d,s:m.summary(z.s)};}
  const buffer=z.s.b.some(b=>b.c?.fork===0&&b.r.join(',')==='3,15')&&z.s.b.some(b=>b.c?.fork===1&&b.r.join(',')==='2,15');
  if(gm||buffer){hit={kind:gm?'Goal':'topF0buffer+F1',path:z.path,inputs:z.path.length,macroDepth:z.d,s:m.summary(z.s)};break;}
  if(z.d>=depth){cut++;continue;}if(!z.s.p.length&&!z.s.b.some(b=>b.c?.fork>0))continue;
  for(const mac of macros){let frontier=[{s:z.s,path:z.path}];for(const a of mac){const next=[];for(const f of frontier)for(const out of m.step(f.s,a,f.path+a)){if(out.s.b.some(b=>b.c?.ghost)){lost++;continue;}next.push({s:out.s,path:f.path+a});}frontier=next;if(!frontier.length)break;}
   for(const f of frontier){const key=m.hash(f.s);if(seen.has(key))continue;seen.add(key);q.push({s:f.s,path:f.path,d:z.d+1});}}
 }
 return{constructedSource:m.summary(start),cap,depth,depthUnit:'macro edge; at most40 actual inputs',expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,exhausted:h===q.length,hit,maxForkCargoY:maxY,furthest,stats:m.stats,samples:m.samples,ghostDiscarded:lost,mergeInventory:[...new Set(merges.map(z=>[z.a,z.b].sort().join('+')))],scope:'ordinary/WASD and face+X macros, alive Blue cargo3,4F1 +emptyC4 rear3,3 +outside3,2F0; all stair/side Fork active except3,4/5,4. Cargo key pickup, same-origin fusion; unknown independent stack/X force-conflict/occupied collision and Ghost stop; no wrap. Fixed one cap, no replay of firstcapture.'};
}
function directed(cap=5000,depth=20){
 const start=copy(seed);start.b=[{r:[3,4],orig:64,color:3,c:c(1)},{r:[3,3],orig:83,color:4,c:null}];start.p=[{r:[3,2],f:'W',fork:0,key:0}];
 for(const k in m.stats)m.stats[k]=0;for(const k in m.samples)m.samples[k]=[];merges.length=0;
 let serial=0;const heap=[],best=new Map(),closed=new Map();
 const score=s=>{let fy=0,cy=0,f=0,buffer=0;for(const b of s.b)if(b.c){cy=Math.max(cy,b.r[1]);if(b.c.fork>0)fy=Math.max(fy,b.r[1]);f+=b.c.fork;if(b.c.fork===0&&b.r.join(',')==='3,15')buffer=1;}return 20*fy+8*cy+3*f+30*buffer;};
 const ahead=(a,b)=>a.sc>b.sc||(a.sc===b.sc&&(a.path.length<b.path.length||(a.path.length===b.path.length&&a.serial<b.serial)));
 function push(z){z.serial=serial++;let i=heap.length;heap.push(z);while(i>0){const j=(i-1)>>1;if(!ahead(heap[i],heap[j]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
 function pop(){const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(true){let j=i,l=2*i+1,r=l+1;if(l<heap.length&&ahead(heap[l],heap[j]))j=l;if(r<heap.length&&ahead(heap[r],heap[j]))j=r;if(j===i)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return top;}
 const firstKey=m.hash(start);best.set(firstKey,0);push({s:start,path:'',d:0,k:firstKey,sc:score(start),history:[]});
 let expanded=0,cut=0,stale=0,lost=0,hit=null,topForkY=0,furthest=null;
 while(heap.length&&expanded<cap){const z=pop();if(z.d!==best.get(z.k)||(closed.has(z.k)&&closed.get(z.k)<=z.d)){stale++;continue;}closed.set(z.k,z.d);expanded++;
  let fy=0;for(const b of z.s.b)if(b.c?.fork>0)fy=Math.max(fy,b.r[1]);if(fy>topForkY){topForkY=fy;furthest={path:z.path,d:z.d,s:m.summary(z.s)};}
  const gm=m.mask(z.s),buffer=z.s.b.some(b=>b.c?.fork===0&&b.r.join(',')==='3,15')&&z.s.b.some(b=>b.c?.fork===1&&b.r.join(',')==='2,15');
  if(gm||buffer){hit={kind:gm?'Goal':'topF0buffer+F1',path:z.path,inputs:z.path.length,macroDepth:z.d,history:z.history,s:m.summary(z.s)};break;}
  if(z.d>=depth){cut++;continue;}if(!z.s.p.length&&!z.s.b.some(b=>b.c?.fork>0))continue;
  for(const mac of ['X','WX','AX','SX','DX','W','A','S','D']){let frontier=[{s:z.s,path:z.path,history:z.history}];for(const a of mac){const next=[];for(const f of frontier)for(const out of m.step(f.s,a,f.path+a)){if(out.s.b.some(b=>b.c?.ghost)){lost++;continue;}next.push({s:out.s,path:f.path+a,history:out.axis?[...f.history,{path:f.path+a,axis:out.axis}]:f.history});}frontier=next;if(!frontier.length)break;}
   for(const f of frontier){const k=m.hash(f.s),d=z.d+1;if(best.has(k)&&best.get(k)<=d)continue;best.set(k,d);push({...f,d,k,sc:score(f.s)-0.5*f.path.length});}}
 }
 let singleReplay=null;if(hit&&!hit.history.length){const r=m.replay(hit.path,start);singleReplay={valid:r.valid,mask:r.valid?m.mask(r.s):0,s:r.valid?m.summary(r.s):null};}
 return{algorithm:'best-first; 20*highestForkCargoY +8*highestCargoY +3*totalFork +30*F0at3,15 -.5*inputLength',constructedSource:m.summary(start),cap,depth,depthUnit:'macro edge; at most40 actual inputs',expanded,uniqueSeen:best.size,queueEntries:serial,pending:heap.length,staleSkipped:stale,depthCut:cut,exhausted:heap.length===0,hit,singleReplay,highestExpandedForkY:topForkY,furthest,stats:m.stats,samples:m.samples,ghostDiscarded:lost,mergeInventory:[...new Set(merges.map(z=>[z.a,z.b].sort().join('+')))],scope:'same constructed F1 entry; one new directed ordering, WASD and face+X macros, all stair/side Fork active except3,4/5,4; outside death allowed, unknown occupied/stack/Xforce/Ghost stop, no wrap; positive predicate is sufficient only.'};
}
// Main's manually constructed full tail; independent fixed recalculation using
// this private reuse of the public-observation 4-22 step, not another engine.
function manual25(){
 const start=copy(seed);start.b=[{r:[3,4],orig:64,color:3,c:c(1)},{r:[3,3],orig:83,color:4,c:null}];start.p=[{r:[3,2],f:'W',fork:0,key:0}];
 for(const k in m.stats)m.stats[k]=0;for(const k in m.samples)m.samples[k]=[];merges.length=0;
 const path='SXWXXXXAXWXXAXSWXXSAXWWXX',trace=[];let s=copy(start);
 for(let i=0;i<path.length;i++){
  const before=merges.length,out=m.step(s,path[i],path.slice(0,i+1));
  if(out.length!==1)return{valid:false,n:i+1,branches:out.length,trace,stats:copy(m.stats)};
  s=out[0].s;trace.push({n:i+1,actual:65+i,a:path[i],s:m.summary(s),merges:copy(merges.slice(before))});
 }
 return{scope:'25 fixed steps, zero search, actual64 source; reused 4-22 step and private same-origin max fusion patch',path,count:path.length,valid:true,mask:m.mask(s),source:m.summary(start),trace,stats:copy(m.stats),mergeInventory:[...new Set(merges.map(z=>[z.a,z.b].sort().join('+')))],final:m.summary(s)};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='search'?search():process.argv[2]==='directed'?directed():process.argv[2]==='manual25'?manual25():fixed,null,2));
module.exports={m,fixed,search,directed,manual25};
