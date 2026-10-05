// Actual20 read-only two-BOX planning. Includes player ICE microsteps and
// gate pressure. Excludes BOX-on-ICE, stacking, push conflicts and X (fork0).
const fs=require('fs'),d=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-9.json','utf8').replace(/^\uFEFF/,'')),t=d.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(','))),ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>e.pos.join(',')));
const dirs={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,a)=>[p[0]+dirs[a][0],p[1]+dirs[a][1]];
const initial={bs:[[3,4],[2,3]],ps:(process.argv[2]==='new'||process.argv[2]==='newreplay'?[[2,4],[3,3]]:[[1,3],[1,5]]).map(r=>({r,c:-1})),g:false};
const occupied=(s,k)=>s.bs.some(b=>key(b)===k)||s.ps.some(p=>key(p.r)===k);
function step(old,a){let s=JSON.parse(JSON.stringify(old)),moving=s.ps.map((p,i)=>[i,a]);
 for(let micro=0;micro<4&&moving.length;micro++){let plans=[],pushes=[],blocked=p=>wall.has(key(p))||key(p)==='3,1'&&!s.g;
  for(let [i,di] of moving){let p=s.ps[i],q,ok=false,chain=[];
   for(let turns=0;turns<(micro?1:4);turns++,di=left[di]){q=add(p.r,di);chain=[];let at=q;
    while(s.bs.some(b=>key(b)===key(at))){chain.push(s.bs.findIndex(b=>key(b)===key(at)));at=add(at,di);}
    if(blocked(q)||blocked(at))continue;ok=true;break;}
   if(!ok){q=p.r;chain=[];}if(chain.length)pushes.push({di,chain});plans.push({i,r:q,f:di,chain,ok});
  }
  let moved=new Map();for(let v of pushes)for(let bi of v.chain){if(moved.has(bi)&&moved.get(bi)!==v.di)return null;moved.set(bi,v.di);}
  s.bs=s.bs.map((b,i)=>moved.has(i)?add(b,moved.get(i)):b);
  if(new Set(s.bs.map(key)).size!==s.bs.length||s.bs.some(b=>ice.has(key(b))))return null;
  let next=[];for(let m of plans){let p=s.ps[m.i];p.r=m.r;
   if(s.bs.some((b,i)=>moved.has(i)&&key(b)===key(p.r)))p.dead=true; // external captured, no further fork
   if(spike.has(key(p.r)))p.dead=true;else if(ice.has(key(p.r))&&m.ok&&!m.chain.length)next.push([m.i,m.f]);}
  let merged=new Set();s.ps.forEach(p=>{if(merged.has(key(p.r)))p.dead=true;else merged.add(key(p.r));});moving=next.filter(([i])=>!s.ps[i].dead);
  s.g=occupied(s,'7,6')||occupied(s,'3,1');
 }
 s.ps=s.ps.filter(p=>!p.dead);return s;
}
function hash(s){return s.bs.map(key).sort().join(';')+'|'+s.ps.map(p=>key(p.r)).sort().join(';')+'|'+(+s.g);}
function replay(path){let s=initial;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'||process.argv[2]==='newreplay'){replay(process.argv[3]);process.exit();}
let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0,maxRight=0;
while(head<q.length&&head<30000){let s=q[head],p=paths[head++];
 let x=Math.max(...s.ps.map(p=>p.r[0]));if(x>maxRight){maxRight=x;console.log('MAX_FREE_X',JSON.stringify({path:p,state:s}));}
 if(s.ps.some(p=>key(p.r)==='1,1')){console.log('GOAL',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p);process.exit();}
 if(p.length>=70)continue;for(let a of 'WASD'){let n=step(s,a);if(!n||!n.ps.length)continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}
}
console.log('BOUNDED_END',head,q.length,seen.size,'maxFreeX',maxRight);
