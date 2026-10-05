// Read-only new-root search: actual64 + fixed WDWDSDAD (MODEL72).
// No Bridge/game/save APIs, no previous graph/cap expansion.
const fs=require('fs'),assert=require('assert/strict');
const {createModel}=require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const source=j.events[79].observation,source64=source.level.instructions,prefix='WDWDSDAD';
const m=createModel(source),fixed=m.replay(prefix);assert(fixed.valid&&fixed.states.length===1);
const start=fixed.states[0].state,cap=5000,depth=35;
assert.equal(m.left(start),3);
const q=[{s:start,parent:-1,a:'',depth:0}],seen=new Map([[m.serial(start),0]]),heap=[];
let expanded=0,depthCut=0,stale=0,lossCut=0,forceCut=0,hit=null;
const counts={},samples={};
function heuristic(s){
 const boxes=s.b.filter(b=>b.x===6&&b.y>=5&&b.y<=10);
 const voice=s.p.filter(p=>p.active&&[108,109].includes(p.id));
 // Only order this finite queue; neither term is used as a reachability prune.
 return (boxes.length?0:3)+Math.min(...voice.map(p=>Math.abs(p.x-6)+Math.max(0,5-p.y,p.y-9)),8);
}
const score=n=>q[n].depth+heuristic(q[n].s);
function push(n){let i=heap.length;heap.push(n);while(i){let k=(i-1)>>1;if(score(heap[k])<=score(heap[i]))break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}
function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;while(true){let k=i,l=i*2+1,r=l+1;if(l<heap.length&&score(heap[l])<score(heap[k]))k=l;if(r<heap.length&&score(heap[r])<score(heap[k]))k=r;if(k===i)break;[heap[k],heap[i]]=[heap[i],heap[k]];i=k;}}return n;}
function path(n){let p='';while(n>0){p=q[n].a+p;n=q[n].parent;}return p;}
function record(kind,n,a,r){counts[kind]=(counts[kind]||0)+1;if(!samples[kind])samples[kind]={tail:path(n)+a,result:r};}
function midstop(s){return m.left(s)>=2&&s.p.some(p=>p.active&&[108,109].includes(p.id)&&p.x===6&&p.y>=5&&p.y<=9);}
push(0);
while(heap.length&&expanded<cap&&!hit){
 const n=pop(),node=q[n],key=m.serial(node.s);
 if(seen.get(key)!==node.depth){stale++;continue;}
 expanded++;
 if(midstop(node.s)){hit={kind:'six-column-safe-mid-stop',tail:path(n),state:node.s};break;}
 if(node.depth>=depth){depthCut++;continue;}
 for(let a=0;a<4;a++){
  const r=m.step(node.s,a),aa=m.A[a];
  if(r.boundaries.length){
   for(const b of r.boundaries){record(b.boundary,n,aa,b);
    if(b.boundary==='perpendicular-free-box'&&m.left(b.state)>=2){hit={kind:'perpendicular-free-box-window',tail:path(n)+aa,result:b};break;}}
   if(hit)break;continue;
  }
  if(r.forces.length){record('modeled-source-force',n,aa,{forces:r.forces,leaves:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:z.state}))});
   if(r.leaves.length>=4||r.leaves.some(z=>m.left(z.state)>=2)){
    hit={kind:r.leaves.length>=4?'four-compatible-modeled-leaves':'first-force-retains-two-left',tail:path(n)+aa,result:r};break;
   }
   forceCut++;continue;
  }
  assert.equal(r.leaves.length,1);
  const s=r.leaves[0].state;if(m.left(s)<2){lossCut++;continue;}
  const h=m.serial(s),d=node.depth+1;if(seen.has(h)&&seen.get(h)<=d)continue;
  seen.set(h,d);q.push({s,parent:n,a:aa,depth:d});push(q.length-1);
 }
}
if(hit){
 const replay=m.replay(prefix+hit.tail);
 hit.fixedReplay={valid:replay.valid,step:replay.step,states:replay.states?.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)})),boundaries:replay.boundaries};
}
const result={sourceEvent:79,source64,modelRoot72:prefix,cap,depth,expanded,seen:seen.size,pending:heap.length,
 depthCut,stale,lossCut,forceCut,hit,counts,samples,exhausted:!heap.length&&!hit,stats:m.stats,
 outsideHash:'ID105 pos/face excluded by model serial: isolated safe corridor; retained in fixed replay.',
 scope:'Ordinary no-X; at least two active left players in accepted states; first useful modeled force or perpendicular window stops; other unknown boundaries recorded and not propagated.'};
fs.writeFileSync('scratch/results/ch2-G-new72-midstop-oct05-result.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({cap,depth,expanded,seen:seen.size,pending:heap.length,depthCut,stale,lossCut,forceCut,exhausted:result.exhausted,hit:hit&&{kind:hit.kind,tail:hit.tail,valid:hit.fixedReplay.valid,states:hit.fixedReplay.states},counts,stats:m.stats}));
