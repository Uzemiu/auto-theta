// Read-only resource predicate from actual9, public observations and public model.
// No game, save, reflection, implementation or canonical knowledge access.
const m=require('./ch4-19-readonly.cjs');
const K=p=>p.join(','),copy=s=>JSON.parse(JSON.stringify(s));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]};
const prefix='WDAXDDWWW',start=m.replay(prefix).s;
const mode=process.argv[2]||'inventory',cap=mode==='upper'?5000:2500,depth=40;
if(!['inventory','upper'].includes(mode))throw Error('Use inventory or upper');
// Optimistic ordinary push reachability to the three southern optical branches.
// Ignores other boxes and observer interference; rejecting a square therefore
// applies only to ordinary transport by an alive uncontained pusher after last X.
const live=p=>!m.blocked(p)&&!m.spikes.has(K(p));
const target=[];for(const x of[5,6,7])for(const y of[6,7])target.push([x,y]);
const recoverable=new Set(target.map(K)),rq=target.map(p=>[...p]);
for(let h=0;h<rq.length;h++)for(const [dx,dy]of Object.values(V)){
 const r=rq[h],prev=[r[0]-dx,r[1]-dy],pusher=[r[0]-2*dx,r[1]-2*dy];
 if(m.blocked(prev)||!live(pusher)||recoverable.has(K(prev)))continue;
 recoverable.add(K(prev));rq.push(prev);
}
function hash(s,x){return s.b.filter(b=>b.kind==='BOX').map(b=>[b.orig,K(b.r),b.c?b.c.fork:'-',b.c?.fork?b.c.f:'-',b.c?.ghost||0].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-'].join(':')).sort().join(';')+'|'+s.keys+'|'+x;}
function actors(s){return s.p.length+s.b.filter(b=>b.c).length;}
// A stronger sufficient access test includes the actual pusher component.
// It permits unladen safe walks only, with every BOX/PRISM treated as blocked.
function upperAccess(s){
 const occupied=new Set(s.b.map(b=>K(b.r))),walk=s.p.map(p=>p.r),visited=new Set(walk.map(K));
 for(let j=0;j<walk.length;j++){
  const r=walk[j];if(r[0]===2&&(r[1]===5||r[1]===6))return true;
  for(const[dx,dy]of Object.values(V)){
   const n=[r[0]+dx,r[1]+dy];
   if(live(n)&&!occupied.has(K(n))&&!visited.has(K(n))){visited.add(K(n));walk.push(n);}
  }
 }
 return false;
}
const q=[{s:copy(start),path:'',x:0}],seen=new Set([hash(start,0)]);
let h=0,cut=0,prunedBudget=0,prunedDead=0,prunedGhost=0,hit=null,blueFirst=null;
while(h<q.length&&h<cap){
 const z=q[h++],boxes=z.s.b.filter(b=>b.kind==='BOX'),cargo=boxes.filter(b=>b.c);
 if(z.x&&boxes.some(b=>b.orig===43&&b.c)&&!blueFirst)blueFirst={tail:z.path,cargo:cargo.length,outside:z.s.p.length,s:z.s};
 if(z.x&&cargo.length===3&&z.s.p.length===1&&(mode==='inventory'||upperAccess(z.s))){hit={tail:z.path,full:prefix+z.path,s:z.s};break;}
 if(z.path.length>=depth){cut++;continue;}
 for(const a of z.x?'WASD':'WASDX'){
  const n=m.step(z.s,a,prefix+z.path+a);if(!n)continue;
  const nx=z.x+(a==='X'?1:0);
  if(n.b.some(b=>b.c?.ghost)){prunedGhost++;continue;}
  if(actors(n)!==(nx?4:2)||n.p.length<1){prunedBudget++;continue;}
  if(nx&&n.b.some(b=>b.kind==='BOX'&&!recoverable.has(K(b.r)))){prunedDead++;continue;}
  const key=hash(n,nx);if(seen.has(key))continue;seen.add(key);q.push({s:n,path:z.path+a,x:nx});
 }
}
console.log(JSON.stringify({source:'actual9',mode,predicate:'after exactly one additional X: three safe cargo (including Blue43) plus one outside; all three BOX ordinary-recoverable to upper rays'+(mode==='upper'?'; outside unladen safe access to 2,5 or 2,6':''),cap,depth,expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,exhausted:h===q.length,prunedBudget,prunedDead,prunedGhost,hit,blueFirst,scope:'new inventory-preserving/dead-position-pruned resource graph, not old full transport graph; no independent stack/conflict/occupied-Fork/Ghost propagation; optical completion still requires actual game'},null,2));
