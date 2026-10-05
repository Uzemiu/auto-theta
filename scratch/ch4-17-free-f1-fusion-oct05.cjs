// Only find a short normal F1+F1 free-player co-cell probe.
// No Bridge/game/save input. The model's post-fusion max is NOT treated as truth.
const b=require('./ch4-17-readonly.cjs'),K=r=>r.join(','),eq=(a,c)=>K(a)===K(c),v={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+v[d][0],r[1]+v[d][1]];
const prefix='SDDDDWAX',source=b.replay(prefix);if(!source.valid)throw Error('Invalid actual8');
function hash(s){return s.b.map(z=>z.orig+':'+K(z.r)).sort().join(';')+'|'+s.p.map(z=>K(z.r)+':'+z.f).sort().join(';');}
function chain(s,r,d){if(b.blocked(r))return false;const z=s.b.find(z=>eq(z.r,r));return !z||chain(s,add(r,d),d);}
function dest(s,p,a){let d=a;for(let j=0;j<4;j++,d=L[d]){const r=add(p.r,d);if(chain(s,r,d))return{r,d};}return{r:p.r,d:a};}
const q=[{s:source.s,path:''}],seen=new Set([hash(source.s)]);let head=0,hit=null,cut=0;
while(head<q.length&&head<5000&&!hit){const z=q[head++];if(z.path.length>=25){cut++;continue;}
 for(const a of'WASD'){const preDest=z.s.p.map(p=>dest(z.s,p,a));const n=b.step(z.s,a,prefix+z.path+a);if(!n||n.b.some(z=>z.c))continue;
  if(n.p.length===1&&preDest.length===2&&eq(preDest[0].r,preDest[1].r)&&!b.spikes.has(K(preDest[0].r))){hit={tail:z.path+a,full:prefix+z.path+a,pre:z.s,requested:a,preDest,postModel:n};break;}
  if(n.p.length!==2||n.p.some(p=>p.fork!==1))continue;const h=hash(n);if(!seen.has(h)){seen.add(h);q.push({s:n,path:z.path+a});}
 }
}
console.log(JSON.stringify({expanded:head,seen:seen.size,pending:q.length-head,cut,cap:5000,depth:25,hit},null,2));
