// Own finite read-only model. No game input/save/main-KB/implementation reads.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-11.json','utf8').replace(/^\uFEFF/,'')),base=raw.initial.level.timelines[0];
const wall=new Set(base.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(base.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const vec={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,d)=>[p[0]+vec[d][0],p[1]+vec[d][1]];
const initial={b:[4,3],p:[{r:[2,5],f:'D',c:false,fork:2},{r:[3,4],f:'D',c:false,fork:2}]}; // actual5 WWWDX, owner verified both fork2
function ordinary(s,a){let plans=[],pushes=[];
 for(let p of s.p){if(p.c){plans.push({r:p.r,f:a});continue;}let d=a,q,ok=false;
  for(let j=0;j<4;j++,d=left[d]){q=add(p.r,d);if(wall.has(key(q)))continue;if(key(q)===key(s.b)&&wall.has(key(add(s.b,d))))continue;ok=true;break;}
  if(!ok)q=p.r;if(ok&&key(q)===key(s.b))pushes.push(d);plans.push({r:q,f:d});}
 let uniq=[...new Set(pushes)];if(uniq.length>1)return null;
 let b=uniq.length?add(s.b,uniq[0]):s.b,ps=[];
 for(let i=0;i<s.p.length;i++){let p=s.p[i],m=plans[i],c=p.c||!!uniq.length&&key(m.r)===key(b),r=p.c?b:m.r;if(!c&&spike.has(key(r)))continue;
  let same=ps.find(x=>key(x.r)===key(r)&&x.c===c);if(same)same.fork=Math.max(same.fork,p.fork);else ps.push({r,f:m.f,c,fork:p.fork});}
 return {b,p:ps};
}
function splitFree(s){if(s.p.some(p=>p.c&&p.fork>0))return null;let plans=[],pushes=[];
 for(let p of s.p){if(!p.fork||p.c){plans.push({...p});continue;}let di=left[p.f],opts=[di,left[left[di]],p.f],accepted=[];
  for(let d of opts){let q=add(p.r,d);if(wall.has(key(q))||key(q)===key(s.b)&&wall.has(key(add(s.b,d))))continue;accepted.push({r:q,f:p.f,c:false,fork:p.fork-1,d});if(key(q)===key(s.b))pushes.push(d);if(accepted.length===2)break;}
  if(!accepted.length)accepted.push({...p,fork:p.fork-1});plans.push(...accepted);}
 let uniq=[...new Set(pushes)];if(uniq.length>1)return null;let b=uniq.length?add(s.b,uniq[0]):s.b,ps=[];
 for(let p of plans){let c=p.c||!!uniq.length&&key(p.r)===key(b);if(!c&&spike.has(key(p.r)))continue;let same=ps.find(x=>key(x.r)===key(p.r)&&x.c===c);if(same)same.fork=Math.max(same.fork,p.fork);else ps.push({r:p.r,f:p.f,c,fork:p.fork});}return {b,p:ps};
}
function clonePose(s){let cp=s.p.filter(p=>p.c&&p.fork===1);if(cp.length!==1)return null;let bs=[],ps=[];
 for(let p of s.p){if(p.fork!==1)return null;let di=left[p.f],opts=[di,left[left[di]],p.f],accepted=[];
  for(let d of opts){let r=add(p.r,d);if(wall.has(key(r)))continue;accepted.push({r,f:p.f,c:p.c,fork:0});if(accepted.length===2)break;}
  if(accepted.length!==2)return null;
  if(p.c){for(let v of accepted)bs.push(v.r);}else ps.push(...accepted);}
 if(new Set([...bs,...ps.map(p=>p.r)].map(key)).size!==6||ps.some(p=>spike.has(key(p.r)))||bs.some(b=>spike.has(key(b))||b[0]<=1||b[0]>=7||b[1]<=1))return null;
 return {bs,ps};
}
const step=(s,a)=>a==='X'?splitFree(s):ordinary(s,a),hash=s=>key(s.b)+'|'+s.p.map(p=>key(p.r)+','+p.f+','+(+p.c)+','+p.fork).sort().join(';');
function replay(path,start=initial){let s=start;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'){replay(process.argv[3]);process.exit();}
let phase=process.argv[2]||'wait',cap=Number(process.argv[3])||15000;
let start=process.argv[4]?replay(process.argv[4]):initial,q=[start],paths=[''],seen=new Set([hash(start)]),head=0;
while(head<q.length&&head<cap){let s=q[head],p=paths[head++];let fork2=s.p.filter(p=>p.fork===2),nx=phase==='wait'?splitFree(s):null;
 let hit=phase==='wait'?s.p.some(p=>key(p.r)==='1,1'&&p.f==='S')&&nx&&nx.p.length===3&&nx.p.every(p=>p.fork===1&&!p.c):phase==='clone'?s.p.length===3&&!!clonePose(s):s.p.length===3&&s.p.some(p=>p.c&&p.fork===1)&&s.p.filter(p=>!p.c).length===2;
 if(hit){console.log('TARGET',JSON.stringify({path:p,state:s,nextX:nx,clone:clonePose(s),expanded:head,seen:seen.size}));replay(p,start);process.exit();}
 if(p.length>=32)continue;for(let a of 'WASD'){let n=ordinary(s,a);if(!n||n.p.length!==start.p.length||wall.has(key(n.b))||n.b[0]===1||n.b[0]===7||n.b[1]===1||spike.has(key(n.b)))continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}}
console.log('BOUNDED_END',phase,head,seen.size);
