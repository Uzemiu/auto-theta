// Diagnose a saved hit's exact predecessor path. No graph search/game calls.
const fs=require('fs'),v8=require('v8'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const z=v8.deserialize(fs.readFileSync('artifacts/solver-frontiers/m131-model60-current.v8'));
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const historicalSequence='DWWDAASDSASSSSSSAWWWWWWWWDW';
const record=z.hit?{hit:z.hit,parentIndex:z.hit.parentIndex??[...z.done].at(-1)}:z.hitHistory?.find(r=>r.hit.sequence===historicalSequence);
if(!record)throw Error('No retained hit fixture available');
const hit=record.hit,n=record.parentIndex??1028965,chain=[];
for(let k=n;k>=0;k=z.q[k].parent)chain.push(k);chain.reverse();
if(chain.slice(1).map(k=>z.q[k].a).join('')!==hit.sequence.slice(0,-1))throw Error('Retained hit parent identity mismatch');
const m=createModel(j.events[259].observation);
const canonical=s=>JSON.stringify({p:s.p.map(p=>({...p})).sort((a,b)=>a.id-b.id),b:s.b.map(b=>({...b})).sort((a,b)=>a.id-b.id)});
const report={expanded:z.expanded,seen:z.seen.size,pending:z.heap.length,concreteNodes:z.q.length,done:z.done.size,depthLimit:z.depthLimit,depthCut:z.depthCut,depthDeferred:z.depthDeferred.length,maxDepth:z.maxDepth,forcesSeen:z.forcesSeen,maxLeaves:z.maxLeaves,priorityLeft:z.priorityLeft,targetPolicy:z.targetPolicy,historicalHits:z.hitHistory.length,completedParentRemainders:z.completedParentRemainders,hitSequence:hit.sequence,length:hit.sequence.length,characters:[...hit.sequence].map((a,i)=>[i+1,a]),parentIndex:n,nodeDepth:z.q[n].depth,parentPath:chain.slice(1).map(k=>z.q[k].a).join(''),sourceMatches:canonical(m.start)===canonical(z.q[0].s),source:m.describe(m.start),storedSource:m.describe(z.q[0].s),firstMismatch:null};
let state=m.start;
for(let i=1;i<chain.length;i++){
 const q=z.q[chain[i]],r=m.step(state,m.A.indexOf(q.a));
 if(!r.valid||r.leaves.length!==1){report.firstMismatch={step:i,action:q.a,reason:'transition',valid:r.valid,boundaries:r.boundaries,leaves:r.leaves.length};break;}
 state=r.leaves[0].state;
 if(canonical(state)!==canonical(q.s)){const diffs=[];for(const type of ['p','b'])for(const e of q.s[type]){const a=state[type].find(a=>a.id===e.id);if(JSON.stringify(a)!==JSON.stringify(e))diffs.push({type,id:e.id,modeled:a,stored:e});}report.firstMismatch={step:i,action:q.a,prefix:chain.slice(1,i+1).map(k=>z.q[k].a).join(''),diffs};break;}
}
const direct=m.replay(hit.sequence);
report.fixed={valid:direct.valid,states:direct.states.map(t=>({choices:t.choices,left:m.left(t.state),state:m.describe(t.state)})),boundaries:direct.boundaries};
if(process.argv.includes('--compact')){delete report.characters;delete report.source;delete report.storedSource;report.fixed.states=report.fixed.states.map(t=>({choices:t.choices,left:t.left,activePlayers:t.state.p.filter(p=>p.active).map(p=>[p.id,p.x,p.y,p.face])}));}
console.log(JSON.stringify(report,null,2));
