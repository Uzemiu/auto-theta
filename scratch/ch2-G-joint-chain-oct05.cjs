// Read-only, public-observation model. No game/save/UI APIs.
// One new target domain: reachable three-source S/D forces on the vertical 8,5..7 chain.
// Uses the existing public chord step function; this is not an independent physics engine.
const fs=require('fs'),base=require('./ch2-G-readonly.cjs');
const A=base.A, prefix='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const seed=base.replay(prefix);if(!seed.valid)throw Error('seed replay failed');
const cap=4000,depthLimit=35;
const clean=s=>({p:s.p.map(e=>({...e})),b:s.b.map(e=>({...e}))});
const at=(e,x,y)=>e.x===x&&e.y===y;
const target=s=>[[8,5],[8,6],[8,7]].every(([x,y])=>s.b.some(e=>at(e,x,y)))&&[[7,5],[7,7],[8,8]].every(([x,y])=>s.p.some(e=>at(e,x,y)));
const dist=(e,q)=>Math.abs(e.x-q[0])+Math.abs(e.y-q[1]);
function score(s,depth){
 let box=0;for(const q of [[8,5],[8,6],[8,7]])box+=Math.min(...s.b.map(e=>dist(e,q)));
 let player=1e9;for(let i=0;i<s.p.length;i++)for(let j=0;j<s.p.length;j++)for(let k=0;k<s.p.length;k++)if(i!==j&&i!==k&&j!==k)player=Math.min(player,dist(s.p[i],[7,5])+dist(s.p[j],[7,7])+dist(s.p[k],[8,8]));
 return depth*.35+box*3+player*2;
}
const q=[{s:clean(seed.state),path:''}],seen=new Set([base.serial(seed.state)]),heap=[];
const cost=n=>score(q[n].s,q[n].path.length);
function push(n){let i=heap.length;heap.push(n);while(i){const p=(i-1)>>1;if(cost(heap[p])<=cost(heap[i]))break;[heap[i],heap[p]]=[heap[p],heap[i]];i=p;}}
function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;for(;;){let k=i,l=i*2+1,r=l+1;if(l<heap.length&&cost(heap[l])<cost(heap[k]))k=l;if(r<heap.length&&cost(heap[r])<cost(heap[k]))k=r;if(k===i)break;[heap[i],heap[k]]=[heap[k],heap[i]];i=k;}}return n;}
push(0);let expanded=0,depthCut=0,hit=null,best=0;
const rejected={},first={};
while(heap.length&&expanded<cap&&!hit){
 const i=pop(),n=q[i];expanded++;if(score(n.s,0)<score(q[best].s,0))best=i;
 if(target(n.s)){const r=base.next(n.s,A.indexOf('S'),{find_probe:true});hit={type:'joint-source',path:n.path,pre:base.describe(n.s),result:r};break;}
 if(n.path.length>=depthLimit){depthCut++;continue;}
 for(let a=0;a<4;a++){
  const old={...base.stats},r=base.next(n.s,a,{find_probe:true}),path=n.path+A[a];
  if(!r){for(const k of Object.keys(old))if(base.stats[k]>old[k]){rejected[k]=(rejected[k]||0)+1;first[k]??={path,pre:base.describe(n.s)};}continue;}
  if(r.conflict){hit={type:'first-force',path,pre:base.describe(n.s),result:r};break;}
  if(r.probe){rejected[r.probe]=(rejected[r.probe]||0)+1;first[r.probe]??={path,result:r};continue;}
  if(r.p.length<3){rejected.lessThanThreeLive=(rejected.lessThanThreeLive||0)+1;continue;}
  const k=base.serial(r);if(seen.has(k))continue;seen.add(k);q.push({s:clean(r),path});push(q.length-1);
 }
}
const result={source:'2-G actual64/events79, fixed seed confirmed by input owner and root',prefix,cap,depthLimit,expanded,seen:seen.size,pending:heap.length,depthCut,exhausted:!hit&&!heap.length&&depthCut===0,hit,rejected,first,best:{path:q[best].path,score:score(q[best].s,0),state:base.describe(q[best].s)}};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result};
