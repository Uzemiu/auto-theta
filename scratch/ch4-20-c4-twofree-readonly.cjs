// Private observed geometry, distinct SDWSX first-split source. No Bridge access.
const fs=require('fs'),m=require('./ch4-20-readonly.cjs'),copy=x=>JSON.parse(JSON.stringify(x));
const pre=m.observedReplay('SDWSX',m.s25);if(!pre.valid)throw Error('fixed source invalid');
const start={b:pre.s.box.map(b=>({r:b.p,orig:b.orig,kind:'BOX',color:b.color,c:b.c})),p:pre.s.free,keys:0};
const K=s=>s.b.map(b=>[b.orig,b.r.join(','),b.c?.fork??'-',b.c?.f??'-'].join(':')).sort().join(';')+'|'+s.p.map(p=>[p.r.join(','),p.fork,p.f].join(':')).sort().join(';');
const target=s=>s.b.filter(b=>b.c?.fork===1&&!b.c.ghost).length===3&&s.b.some(b=>b.color===3&&b.c)&&s.p.length===1&&s.p[0].fork===1;
const cap=8000,depth=40,q=[{s:copy(start),path:''}],seen=new Set([K(start)]);let h=0,cut=0,reject=0,actorloss=0;const hits=[];
while(h<q.length&&h<cap){const z=q[h++];if(target(z.s))hits.push({path:z.path,s:m.summary(z.s)});
 if(z.path.length>=depth){cut++;continue;}
 for(const a of 'WASD'){
  const ns=m.multiStep(z.s,a,z.path+a);if(!ns.length){reject++;continue;}
  for(const n of ns){const s=n.s;if(s.b.some(b=>b.c?.ghost)||s.p.length+s.b.filter(b=>b.c).length!==4){actorloss++;continue;}
   const k=K(s);if(seen.has(k))continue;seen.add(k);q.push({s,path:z.path+a});}
 }
}
const result={source:'old actual C4-first25 + SDWSX MODEL30 (not yet actual)',fixedSource:pre.s,cap,depth,expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,reject,actorloss,hitCount:hits.length,hits:hits.slice(0,15),exhausted:h===q.length,scope:'ordinary only, preserve four live Fork1 actors; capture Blue alongside two C4 cargos, no X/stack/ghost propagation; ordinary conflict branches allowed only if four actors survive'};
fs.writeFileSync('scratch/results/ch4-20-c4-twofree-result.json',JSON.stringify(result));console.log(JSON.stringify(result));
