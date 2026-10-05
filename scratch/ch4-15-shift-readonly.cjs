// Bounded MODEL ONLY after actual26. Own ordinary engine plus explicit
// fork-container-X geometry: vacated parent boxes, same-origin fusion,
// competing pushes on the one empty C4. No game I/O or hidden implementation.
const fs=require('fs'),vm=require('vm'),src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
const ctx={require,process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))+
 '\nmodule.exports={step,wall,spike,ice,chain,tick};',ctx);
const {step,wall,spike,ice,chain,tick}=ctx.module.exports,K=p=>p.join(','),v={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'};
const add=(p,d)=>[p[0]+v[d][0],p[1]+v[d][1]],same=(a,b)=>K(a)===K(b),cp=s=>JSON.parse(JSON.stringify(s));
let start={b:[{r:[4,4],color:4},{r:[3,6],color:3},{r:[5,6],color:3}],
 p:[{r:[4,3],f:'W',fork:0,c:-1,ghost:0},{r:[3,6],f:'W',fork:1,c:1,ghost:0},{r:[5,6],f:'W',fork:1,c:2,ghost:0}],rem:[]};
const rowMode=process.argv[4]==='row';
if(rowMode)start={b:[{r:[4,3],color:4},{r:[4,4],color:3},{r:[3,6],color:3}],
 p:[{r:[4,2],f:'S',fork:0,c:-1,ghost:0},{r:[4,4],f:'A',fork:1,c:1,ghost:0},{r:[3,6],f:'A',fork:1,c:2,ghost:0}],rem:[]};
const h=s=>s.b.map(b=>K(b.r)).join('|')+'|'+s.p.map(p=>[...p.r,p.c,p.fork,p.fork?p.f:''].join(',')).sort().join(';');
function split(s){
 const empty=s.b.find(b=>b.color===4),free=s.p.find(p=>p.c<0);if(!empty||!free)return [];
 let births=[];
 for(const p of s.p.filter(p=>p.c>=0)){
  const f=p.f,l=L[f],dirs=[l,L[L[l]],f],valid=[];
  for(const d of dirs){let r=add(p.r,d);if(wall.has(K(r)))continue;let push=null;
   if(same(r,empty.r)){let dest=add(r,d);if(wall.has(K(dest)))continue;push=d;}
   if(same(r,free.r))continue; // Multi-person newly born container not modeled.
   valid.push({r,d,push});if(valid.length===2)break;
  }
  if(!valid.length)return [];births.push(...valid);
 }
 const pushDirs=[...new Set(births.filter(b=>b.push).map(b=>b.push))],out=[];
 for(const win of pushDirs.length>1?pushDirs:[pushDirs[0]||null]){
  const er=win?add(empty.r,win):empty.r;
  let bs=[],ps=[],slides=[];
  for(const z of births){if(z.push&&z.push!==win)continue;if(same(z.r,er)){
   if(process.argv[2]==='probe-stack'||process.argv[2]==='stack-family')return [{probe:true,win,emptyTo:er,births,at:er}];
   return []; // Different origin stacking omitted.
  }
   if(bs.some(b=>same(b.r,z.r)))continue; // Same-origin fusion, all offspring fork0.
   const c=bs.length;bs.push({r:z.r,color:3});ps.push({r:z.r,f:s.p.find(p=>p.c>=0).f,fork:0,c,ghost:0});
   if(ice.has(K(z.r)))slides.push({i:c,d:z.d});
  }
  if(ice.has(K(er))&&win)slides.push({i:bs.length,d:win});
  bs.push({r:er,color:4});ps.push({...free});let branch={b:bs,p:ps,rem:[],win,conflict:pushDirs.length>1,
   needsIce:births.some(z=>ice.has(K(z.r)))||ice.has(K(er))};
  if(process.argv[5]==='ice'&&slides.length){let pushes=[];for(const z of slides){let ids=[];if(chain(branch,branch.b[z.i].r,z.d,ids))pushes.push({ids,d:z.d});}
   const n=tick(branch,branch.p.map(p=>({...p,d:null})),pushes);if(!n)continue;branch={...n,win,conflict:pushDirs.length>1,needsIce:false};
  }
  out.push(branch);
 }
 return out;
}
function goal(s,side){return (side==='left'?['1,8','2,7','3,6']:['5,6','6,7','7,8']).every(g=>s.p.some(p=>K(p.r)===g));}
function tail(s,side,cap=1800){let q=[s],paths=[''],seen=new Set([h(s)]),head=0;
 while(head<q.length&&head<cap){const n=q[head],p=paths[head++];if(goal(n,side))return {path:p,state:n,expanded:head,seen:seen.size};
  if(p.length>=42||n.p.every(p=>p.c>=0))continue;
  for(const a of 'WASD'){const z=step(n,a);if(!z||z.p.filter(p=>p.c>=0).length<n.p.filter(p=>p.c>=0).length||z.b.some(b=>b.r[1]<=1))continue;
   const k=h(z);if(seen.has(k))continue;seen.add(k);q.push(z);paths.push(p+a);}
 }
 return {expanded:head,seen:seen.size,exhausted:head===q.length};
}
if(process.argv[2]==='replay'){let s=start;for(const a of process.argv[3]||''){s=step(s,a);console.log(a,JSON.stringify(s));if(!s)break;}console.log('SPLIT',JSON.stringify(split(s)));process.exit();}
const cap=Math.min(Number(process.argv[2])||2200,6000);let q=[start],paths=[''],seen=new Set([h(start)]),head=0,tests=0,positives=[],families=new Set(),tailCapped=0,maxTailSeen=0,stackProbes=[];
while(head<q.length&&head<cap){let s=q[head],p=paths[head++];
 const branches=split(s);
 if(process.argv[2]==='probe-stack'&&branches.some(b=>b.probe)){
  console.log('MODEL_STACK_PROBE',JSON.stringify({prefix:p,state:s,probe:branches,expanded:head,seen:seen.size}));process.exit();
 }
 if(process.argv[2]==='stack-family'&&branches.some(b=>b.probe)){
  const z=branches.find(b=>b.probe);
  if(!z.births.some(b=>['1,7','7,7'].includes(K(b.r)))){
   const sig=K(z.at)+'|'+z.births.map(b=>K(b.r)).join('|')+'|'+K(s.p.find(p=>p.c<0).r);
   if(!families.has(sig)){families.add(sig);const info={prefix:p,state:s,probe:z,atGoal:['1,8','2,7','3,6','5,6','6,7','7,8'].includes(K(z.at)),expanded:head};stackProbes.push(info);console.log('STACK_FAMILY',JSON.stringify(info));}
  }
 }
 if(process.argv[2]!=='stack-family'&&branches.length===2&&!branches.some(b=>b.needsIce)){const sig=branches.map(b=>b.b.map(b=>K(b.r)).join('|')+';'+K(b.p.find(p=>p.c<0).r)).join('/');
  if(!families.has(sig)&&branches.some(b=>b.p.some(p=>['3,6','5,6'].includes(K(p.r))))){families.add(sig);let results=[];
   for(const b of branches){let sides=['left','right'].map(side=>({side,...tail(b,side)}));results.push(sides);tests+=2;tailCapped+=sides.filter(t=>!t.exhausted&&t.path===undefined).length;maxTailSeen=Math.max(maxTailSeen,...sides.map(t=>t.seen));}
   if(results[0].some(t=>t.path!==undefined)&&results[1].some(t=>t.path!==undefined)){
    const left0=results[0].find(t=>t.side==='left'&&t.path!==undefined),right0=results[0].find(t=>t.side==='right'&&t.path!==undefined),left1=results[1].find(t=>t.side==='left'&&t.path!==undefined),right1=results[1].find(t=>t.side==='right'&&t.path!==undefined);
    if(left0&&right1||right0&&left1){const r={prefix:p,branches,results,expanded:head,seen:seen.size};console.log('MODEL_FULL_PAIR',JSON.stringify(r));process.exit();}
   }
   if(results.flat().some(t=>t.path!==undefined)){positives.push({prefix:p,branches,results});console.log('SIDE_POSITIVE',JSON.stringify(positives.at(-1)));}
  }
 }
 if(p.length>=24)continue;
 for(const a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==3||n.p.some(p=>p.ghost)||n.b.some(b=>b.r[1]<=1))continue;let k=h(n);if(seen.has(k))continue;seen.add(k);q.push(n);paths.push(p+a);}
}
console.log('FINITE_END',JSON.stringify({source:rowMode?'actual27 AX':'actual26',expanded:head,seen:seen.size,exhausted:head===q.length,cap,depth:24,tests,families:families.size,sidePositives:positives.length,tailCapped,maxTailSeen,stackProbes:stackProbes.length,scope:'ordinary preX, one empty C4 opposing fork-X conflict, initial child inner covered; ordinary side tail cap1800/depth42; no X ICE/stack/extra conflicts/ghost'}));
