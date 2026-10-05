'use strict';
// Constructed inventory, not a reachable checkpoint. Observed terrain/model only.
// No Bridge, save, or canonical KB calls. One finite ordinary transport audit.
const m=require('./ch4-22-readonly.cjs');
const fs=require('fs');
const copy=s=>JSON.parse(JSON.stringify(s));
const at=r=>r.join(',');
const s=copy(m.s15);
const coords=[[5,9],[3,4],[3,5],[3,6],[6,9]];
s.b.forEach((b,i)=>{b.r=coords[i];b.c=null;});
s.b[1].c={f:'D',fork:1,key:2,ghost:0};
s.p=[{r:[3,9],f:'A',fork:1,key:2}];
const child=m.step(s,'X','constructedX');
if(child.length!==1||child[0].axis)throw Error('Constructed X boundary');
const seed=child[0].s;
const serial=s=>s.b.map(b=>[b.color,at(b.r),b.c?b.c.key:'-',b.c?b.c.ghost:'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[at(p.r),p.key].join(':')).sort().join(';')+'|'+s.locks;
const cap=5000,depth=45;
const q=[{s:seed,path:''}],seen=new Set([serial(seed)]);
let head=0,cut=0,force=0,unknown=0,ghost=0,hit=null,maxCargoX=0,best=null;
while(head<q.length&&head<cap){
 const z=q[head++];
 const top=z.s.b.filter(b=>b.c&&b.r[1]===9);
 const x=Math.max(0,...top.map(b=>b.r[0]));
 if(x>maxCargoX){maxCargoX=x;best={path:z.path,s:m.summary(z.s)};}
 if(m.mask(z.s)===3){hit={path:z.path,s:m.summary(z.s)};break;}
 if(z.path.length>=depth){cut++;continue;}
 if(!z.s.p.length)continue;
 for(const a of 'WASD'){
  const out=m.step(z.s,a,z.path+a);
  if(!out.length){unknown++;continue;}
  for(const o of out){
   if(o.axis){force++;continue;}
   if(o.s.b.some(b=>b.c?.ghost)){ghost++;continue;}
   const h=serial(o.s);if(seen.has(h))continue;
   seen.add(h);q.push({s:o.s,path:z.path+a});
  }
 }
}
const r={constructed:m.summary(s),afterX:m.summary(seed),cap,depth,expanded:head,seen:seen.size,pending:q.length-head,depthCut:cut,exhausted:head===q.length,force,unknown,ghost,maxCargoX,best,hit,
 scope:'Constructed source only, cargo3,4 F1/D and outside3,9 F1/A, empty3,5/6+5/6,9; lastX then ordinary WASD; actual initial terrain, no force branches, independent stack, occupied cargo fusion or Ghost propagation; not a prefix search and not completion evidence.'};
fs.writeFileSync('scratch/results/root-ch4-22-corner-cargo-tail-oct05.json',JSON.stringify(r,null,2));
console.log(JSON.stringify(r,null,2));
