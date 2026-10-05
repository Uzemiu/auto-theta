// Public M133 one-fixture geometry assumption, ordinary Color2 domain only.
const fs=require('fs');let s=fs.readFileSync('scratch/ch2-G-m132-blocked-source-model-oct05.cjs','utf8');
s=s.replace('const plans=new Map(),np=[],cancel=new Set(),requested=[];', 'const plans=new Map(),np=[],cancel=new Set(),requested=[],passes=[];');
const anchor="if(b[j].md!==d){stats.perpendicularFreeBox++;";
const replace=String.raw`if(b[j].md!==d){
     // Observed M133: sliding free enters an ICE cell vacated by independent
     // perpendicular moving Box. Rotation/ICE destination are model assumptions.
     const body=b[j],dest=move(body,body.md);
     const candidate=tick>0&&e.md>=0&&terrain.get(K(at(e)))==='ICE'&&terrain.get(K(z))==='ICE'&&bi(dest)<0&&!blocked(dest)&&!p.some(q=>q.active&&K(at(q))===K(dest));
     if(candidate){passes.push({j,e:{...e},d,md:body.md,src:body.src,dest,z});np.push({...e,x:z[0],y:z[1],md:d,src:e.id});continue;}
     stats.perpendicularFreeBox++;`;
if(!s.includes(anchor))throw Error('perp anchor');s=s.replace(anchor,replace);
const insertion=String.raw`
  // Validate after every ordinary and inertia request, so array order cannot
  // quietly admit another source, cancellation, or co-destination interaction.
  for(const pass of passes){
   const r=plans.get(pass.j)||[],others=np.filter(q=>q.id!==pass.e.id&&q.active);
   if(cancel.has(pass.j)||r.length!==1||r[0].kind!=='inertia'||r[0].d!==pass.md||r[0].src!==pass.src||others.some(q=>K(at(q))===K(pass.dest)||K(at(q))===K(pass.z))){
    return {boundary:'m133-nonindependent-contact',tick,box:b[pass.j].id,player:pass.e.id,playerDirection:pass.d,boxDirection:pass.md,boxSource:pass.src,requests:r,state:clone(s)};
   }
  }
`;
s=s.replace('const forceTargets=[];',insertion+'\n  const forceTargets=[];');
s=s.replace('if(forceTargets.length>1)return',"if(forceTargets.length&&passes.length)return {boundary:'m133-concurrent-force-unverified',tick,targets:forceTargets,passes,state:clone(s)};\n  if(forceTargets.length>1)return");
fs.writeFileSync('scratch/ch2-G-m133-source-model-oct05.cjs',s,'utf8');
module.exports={scope:'M133 geometric assumption, isolated perpendicular moving-free/moving-Box, no other requests/cancels/active occupancy/chains or concurrent force'};
