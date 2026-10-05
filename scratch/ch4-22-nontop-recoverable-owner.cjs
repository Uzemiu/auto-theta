// Public observed terrain + our existing private model. No Bridge calls.
// New predicate replaces the old first-hit state with a dead BOX at1,9.
const fs=require('fs'),m=require('./ch4-22-readonly.cjs');
const copy=s=>JSON.parse(JSON.stringify(s)),eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const cap=Number(process.argv[2]||12000),maxDepth=Number(process.argv[3]||40);
const dead=b=>b.r[0]===1||b.r[1]===1||eq(b.r,[3,4])||b.r[0]>6;
const hash=s=>s.b.map(b=>[b.color,b.r.join(','),b.c?`${b.c.fork}:${b.c.key}:${b.c.fork?b.c.f:'-'}:${b.c.ghost}`:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[p.r.join(','),p.fork,p.key,p.f].join(':')).sort().join(';')+'|'+s.keys+'|'+s.locks;
const score=z=>z.path.length+(z.s.b.some(b=>b.c)?0:12)+Math.min(...z.s.p.map(p=>Math.abs(p.r[0]-3)+Math.abs(p.r[1]-9)));
const heap=[];
function push(z){heap.push(z);let i=heap.length-1;while(i){const j=(i-1)>>1;if(score(heap[j])<=score(heap[i]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
function pop(){const z=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&score(heap[j+1])<score(heap[j]))j++;if(score(heap[i])<=score(heap[j]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return z;}
const seen=new Map([[hash(m.s15),0]]);push({s:copy(m.s15),path:''});
let expanded=0,stale=0,depthCut=0,deadReject=0,resourceReject=0,forceReject=0,unknownReject=0,firstCargo=null,hit=null;
const forceSamples=[],unknownSamples=[];
while(heap.length&&expanded<cap){const z=pop();if(seen.get(hash(z.s))!==z.path.length){stale++;continue;}expanded++;
 const cargo=z.s.b.find(b=>b.c?.fork===1&&b.c.key===2&&!b.c.ghost);
 if(cargo&&!firstCargo)firstCargo={path:z.path,s:m.summary(z.s)};
 if(cargo&&!eq(cargo.r,[3,9])&&z.s.p.some(p=>p.fork===1&&p.key===2&&eq(p.r,[3,9])&&p.f==='A')){
  const children=m.step(z.s,'X',z.path+'X').filter(o=>!o.axis);
  const good=children.find(o=>o.s.b.length===6&&o.s.b.filter(b=>b.c&&!b.c.ghost).length===2&&o.s.p.length===2&&o.s.p.some(p=>eq(p.r,[2,9]))&&!o.s.b.some(dead)&&o.s.p.every(p=>p.key===2));
  if(good){hit={path:z.path,full:m.prefix15+z.path,s:m.summary(z.s),nextX:m.summary(good.s)};break;}
 }
 if(z.path.length>=maxDepth){depthCut++;continue;}
 for(const a of(z.s.p.length===1&&!z.s.b.some(b=>b.c)?'WASDX':'WASD')){
  const out=m.step(z.s,a,z.path+a);
  if(!out.length){unknownReject++;if(unknownSamples.length<4)unknownSamples.push({path:z.path+a,before:m.summary(z.s)});continue;}
  for(const o of out){if(o.axis){forceReject++;if(forceSamples.length<4)forceSamples.push({path:z.path+a,before:m.summary(z.s)});continue;}
   const n=o.s;if(n.b.some(dead)){deadReject++;continue;}
   const actors=n.p.length+n.b.filter(b=>b.c).length;
   if(n.b.some(b=>b.c?.ghost)||!n.p.length||actors!==(n.p.some(p=>p.fork===2)?1:2)||n.p.some(p=>(p.fork!==1&&p.fork!==2)||p.key!==2)||n.b.some(b=>b.c&&(b.c.fork!==1||b.c.key!==2))){resourceReject++;continue;}
   const k=hash(n),d=z.path.length+1;if(seen.has(k)&&seen.get(k)<=d)continue;seen.set(k,d);push({s:n,path:z.path+a});
  }
 }
}
let fixed=null;if(hit){const r=m.replay(hit.full);fixed={valid:r.valid,s:r.valid?m.summary(r.s):null};}
const result={source:'actual15; new actual22 not changed during search',cap,maxDepth,expanded,seen:seen.size,pending:heap.length,stale,depthCut,exhausted:!heap.length,deadReject,resourceReject,forceReject,unknownReject,firstCargo,hit,fixed,forceSamples,unknownSamples,
 scope:'one first freeX then ordinary WASD; cargoF1/key2 at any non3,9 and outside3,9 F1/key2 faceA; all five source BOX avoid x1,row1,3,4,x>6; target prospective X must keep six usable BOX,two cargo,two free incl2,9. Same-origin body classes hashed by color; face retained, no force/stack/Ghost propagation; no game input, no extra cap.'};
fs.writeFileSync('scratch/results/ch4-22-nontop-recoverable-owner-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
