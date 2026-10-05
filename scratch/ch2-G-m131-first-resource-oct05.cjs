// One new calibrated source-aware domain, fixed cap/depth. Read-only.
const fs=require('fs'),{createModel}=require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const m=createModel(j.events[79].observation),cap=5000,depthLimit=35;
const q=[{s:m.start,parent:-1,a:'',depth:0}],seen=new Set([m.serial(m.start)]),heap=[0];
let expanded=0,depthCut=0,lost=0,hit=null,maxLeaves=1,forcesSeen=0;
const boundaryCounts={},boundaries={},firstForces=[];
const priority=n=>q[n].depth+2*(4-m.left(q[n].s));
function push(n){heap.push(n);let i=heap.length-1;while(i){let k=(i-1)>>1;if(priority(heap[k])<=priority(heap[i]))break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}
function pop(){let n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(true){let k=i,l=i*2+1,r=l+1;if(l<heap.length&&priority(heap[l])<priority(heap[k]))k=l;if(r<heap.length&&priority(heap[r])<priority(heap[k]))k=r;if(k===i)break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}return n;}
function path(n){let p='';while(n>0){p=q[n].a+p;n=q[n].parent;}return p;}
while(heap.length&&expanded<cap){
 const n=pop(),node=q[n];expanded++;if(node.depth>=depthLimit){depthCut++;continue;}
 for(let a=0;a<4;a++){
  const sequence=path(n)+m.A[a],r=m.step(node.s,a);
  if(!r.valid){for(const b of r.boundaries){boundaryCounts[b.boundary]=(boundaryCounts[b.boundary]||0)+1;if(!boundaries[b.boundary])boundaries[b.boundary]={sequence,pre:m.describe(node.s),result:b};}continue;}
  maxLeaves=Math.max(maxLeaves,r.leaves.length);
  if(r.forces.length){
   forcesSeen++;const counts=r.leaves.map(z=>m.left(z.state));
   if(firstForces.length<8)firstForces.push({sequence,forces:r.forces,leafCount:r.leaves.length,left:counts});
   if(r.leaves.length>=4||counts.some(c=>c>=2)){hit={sequence,pre:m.describe(node.s),forces:r.forces,leaves:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)}))};break;}
   // This graph stops at the first force; low-resource completed branches are
   // recorded, not silently merged into an unverified multi-timeline domain.
   continue;
  }
  const s=r.leaves[0].state;if(m.left(s)<2){lost++;continue;}
  const key=m.serial(s);if(seen.has(key))continue;seen.add(key);q.push({s,parent:n,a:m.A[a],depth:node.depth+1});push(q.length-1);
 }
 if(hit)break;
}
const result={source:'actual64 event79/time89',cap,depthLimit,expanded,seen:seen.size,pending:heap.length,depthCut,exhausted:!hit&&!heap.length,lost,maxLeaves,forcesSeen,boundaryCounts,firstForces,hit,boundaries};
if(require.main===module)console.log(JSON.stringify(result));
module.exports={result};
