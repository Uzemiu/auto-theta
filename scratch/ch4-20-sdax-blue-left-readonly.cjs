// Distinct fixed SDAX source; pure local model. No Bridge / game input.
const fs=require('fs'),m=require('./ch4-20-readonly.cjs'),copy=x=>JSON.parse(JSON.stringify(x));
const pre=m.observedReplay('SDAX',m.s25);if(!pre.valid)throw Error('SDAX source invalid');
const start={b:pre.s.box.map(b=>({r:b.p,orig:b.orig,kind:'BOX',color:b.color,c:b.c})),p:pre.s.free,keys:0};
const K=s=>s.b.map(b=>[b.orig,b.r.join(','),b.c?.fork??'-',b.c?.f??'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[p.r.join(','),p.fork,p.f].join(':')).sort().join(';');
const mobile=b=>b.r[0]>1&&b.r[1]>1&&!(b.r[0]===5&&b.r[1]===3);
const target=s=>s.b.filter(b=>b.c?.fork===1&&!b.c.ghost).length===3&&s.b.some(b=>b.color===3&&b.c&&b.r[0]<=3&&b.r[1]<=3)&&s.b.filter(b=>b.c).every(mobile)&&s.p.length===1&&s.p[0].fork===1;
const cap=12000,depth=35,q=[{s:copy(start),path:''}],seen=new Set([K(start)]);let h=0,cut=0,reject=0,actorloss=0,hit=null;
while(h<q.length&&h<cap){const z=q[h++];if(target(z.s)){hit={path:z.path,s:m.summary(z.s)};break;}
 if(z.path.length>=depth){cut++;continue;}
 for(const a of 'WASD'){
  const ns=m.multiStep(z.s,a,z.path+a);if(!ns.length){reject++;continue;}
  for(const n of ns){const s=n.s;if(s.b.some(b=>b.c?.ghost)||s.p.length+s.b.filter(b=>b.c).length!==4||s.p.some(p=>p.fork!==1)||s.b.some(b=>b.c&&b.c.fork!==1)){actorloss++;continue;}
   if(s.b.some(b=>b.c&&!mobile(b)))continue;
   const k=K(s);if(seen.has(k))continue;seen.add(k);q.push({s,path:z.path+a});}
 }
}
let replay=null;if(hit)replay=m.observedReplay('SDAX'+hit.path,m.s25);
const result={source:'historical actual C4-first25 + SDAX (MODEL29, no game input)',fixedSource:pre.s,cap,depth,expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,reject,actorloss,hit,fixedReplay:replay,exhausted:h===q.length,scope:'ordinary only after fixed SDAX; four live Fork1 actors; mobile Blue capture x2/3 y2/3; no further X, stack, ghost propagation; no cargo row1/x1/5,3 within this deployment target'};
fs.writeFileSync('scratch/results/ch4-20-sdax-blue-left-result.json',JSON.stringify(result));console.log(JSON.stringify(result));
