// New MODEL60 inventory, one fixed-cap first-safe-force domain. Read-only public model.
const base=require('./ch2-G-readonly.cjs'), A=base.A;
const old64='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const prefix=old64.slice(0,50)+'WDSAWWDWAA',seed=base.replay(prefix);
if(!seed.valid||prefix.length!==60||seed.state.p.length!==4)throw Error('MODEL60 seed invalid');
const clean=s=>({p:s.p.map(e=>({...e})),b:s.b.map(e=>({...e}))});
const dist=(e,p)=>Math.abs(e.x-p[0])+Math.abs(e.y-p[1]);
// Safe left E/N force pairs, or safe right N/W guard pair; these are sufficient target shapes.
const shapes=[{b:[6,5],p:[[5,5],[6,4]]},{b:[6,7],p:[[5,7],[6,6]]},{b:[10,9],p:[[10,8],[11,9]]}];
function score(s,d){let v=1e9;for(const z of shapes){let pd=1e9;for(let i=0;i<s.p.length;i++)for(let j=0;j<s.p.length;j++)if(i!==j)pd=Math.min(pd,dist(s.p[i],z.p[0])+dist(s.p[j],z.p[1]));v=Math.min(v,pd*2+Math.min(...s.b.map(b=>dist(b,z.b)))*3);}return v+d*.25;}
const cap=5000,depthLimit=35,q=[{s:clean(seed.state),path:''}],heap=[],seen=new Set([base.serial(seed.state)]);
const cost=n=>score(q[n].s,q[n].path.length);
function push(n){let i=heap.length;heap.push(n);while(i){let j=(i-1)>>1;if(cost(heap[j])<=cost(heap[i]))break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}
function pop(){const n=heap[0],z=heap.pop();if(heap.length){heap[0]=z;let i=0;for(;;){let j=i,l=i*2+1,r=l+1;if(l<heap.length&&cost(heap[l])<cost(heap[j]))j=l;if(r<heap.length&&cost(heap[r])<cost(heap[j]))j=r;if(i===j)break;[heap[i],heap[j]]=[heap[j],heap[i]];i=j;}}return n;}
push(0);let expanded=0,depthCut=0,hit=null,best=0;
const boundary={},first={},allCaptures=[];
while(heap.length&&expanded<cap&&!hit){
 const n=pop(),u=q[n];expanded++;if(score(u.s,0)<score(q[best].s,0))best=n;
 if(u.path.length>=depthLimit){depthCut++;continue;}
 for(let a=0;a<4;a++){
  const path=u.path+A[a],old={...base.stats},r=base.next(u.s,a,{find_probe:true});
  if(!r){for(const k of Object.keys(old))if(base.stats[k]>old[k]){boundary[k]=(boundary[k]||0)+1;first[k]??={path,pre:base.describe(u.s)};if(k==='captureRejected'&&allCaptures.length<8)allCaptures.push({path,pre:base.describe(u.s)});}continue;}
  if(r.conflict){if(r.proposedPlayers.length>=3){hit={path,pre:base.describe(u.s),result:r};break;}boundary.unsafeForce=(boundary.unsafeForce||0)+1;first.unsafeForce??={path,result:r};continue;}
  if(r.probe){boundary[r.probe]=(boundary[r.probe]||0)+1;first[r.probe]??={path,result:r};continue;}
  if(r.p.length<3){boundary.lessThanThreeLive=(boundary.lessThanThreeLive||0)+1;continue;}
  const k=base.serial(r);if(seen.has(k))continue;seen.add(k);q.push({s:clean(r),path});push(q.length-1);
 }
}
const result={source:'MODEL60: actual50 plus WDSAWWDWAA; distinct from actual64',prefix,seed:base.describe(seed.state),cap,depthLimit,expanded,seen:seen.size,pending:heap.length,depthCut,exhausted:!hit&&!heap.length&&depthCut===0,hit,boundary,first,allCaptures,best:{path:q[best].path,score:score(q[best].s,0),state:base.describe(q[best].s)}};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result};
