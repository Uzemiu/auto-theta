// Public actual15, exact fixed firstX at4,9/A. No game/bridge calls.
const fs=require('fs'),m=require('./ch4-22-readonly.cjs');
const seedPath='AWWWWAX',seed=m.replay(seedPath,m.s15);
if(!seed.valid)throw Error('fixed seed failed');
const K=r=>r.join(','),copy=s=>JSON.parse(JSON.stringify(s));
const hash=s=>s.b.map(b=>`${b.color}:${K(b.r)}:${b.c?'c':'-'}`).sort().join(';')+'|'+s.p.map(p=>K(p.r)).sort().join(';');
function dead(s){return s.b.some(b=>b.r[0]===1||b.r[1]===1||K(b.r)==='3,4'||b.r[0]>6)||s.p.some(p=>p.r[0]>6);}
function target(s){return s.b.some(b=>b.c?.fork===1&&K(b.r)==='5,9')&&s.p.some(p=>p.fork===1&&K(p.r)==='3,9');}
function search(cap=100000,depth=80){const q=[{s:seed.s,path:''}],seen=new Set([hash(seed.s)]);let h=0,cut=0,lost=0,hit=null;
 while(h<q.length&&h<cap){const z=q[h++];if(target(z.s)){hit={path:seedPath+z.path,tail:z.path,s:m.summary(z.s)};break;}if(z.path.length>=depth){cut++;continue;}for(const a of'WASD')for(const o of m.step(z.s,a,z.path+a)){
 const s=o.s;if(o.axis||dead(s)||s.p.length+s.b.filter(b=>b.c).length!==2||!s.p.length||s.p.some(p=>p.fork!==1||p.key!==2)||s.b.some(b=>b.c&&(b.c.ghost||b.c.fork!==1||b.c.key!==2))){lost++;continue;}
 // The first capture is the target; other captures are outside this deployment domain.
 if(s.b.some(b=>b.c)&&!target(s)){lost++;continue;}
 const k=hash(s);if(seen.has(k))continue;seen.add(k);q.push({s,path:z.path+a});}}
 let fixed=null;if(hit){const r=m.replay(hit.path,m.s15);fixed={valid:r.valid,s:m.summary(r.s),trace:r.trace};}
 return{source:'actual15 fixed AWWWWAX, five original BOX unchanged',expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,exhausted:h===q.length,lost,hit,fixed,
 scope:'ordinary exact two-F1 deployment until first capture cargo5,9/outside3,9; C4 class-canonical hash, no first Box1/row1/dead3,4, no east lock zone, no ghost/stack/conflict/other-first-capture propagation'};}
if(require.main===module){const r=search(Number(process.argv[2]||100000),Number(process.argv[3]||80));fs.writeFileSync('scratch/results/ch4-22-top-pair-result.json',JSON.stringify(r));console.log(JSON.stringify({...r,fixed:r.fixed?{valid:r.fixed.valid,s:r.fixed.s,steps:r.fixed.trace.length}:null}));}
module.exports={seed,seedPath,search,dead,target};
