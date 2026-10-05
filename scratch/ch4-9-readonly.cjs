// Read-only ordinary-state model from DS+X hypothesis. Player ICE4,7 uses
// observed microsteps; no BOX-on-ICE and no X simulated. No game inputs.
const fs=require('fs'),d=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-9.json','utf8').replace(/^\uFEFF/,'')),t=d.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(','))),ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>e.pos.join(',')));
const dirs={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,a)=>[p[0]+dirs[a][0],p[1]+dirs[a][1]];
const initial={b:[3,4],p:[{r:[1,5],f:'S',c:false,split:1},{r:[3,5],f:'S',c:false,split:1}]};
const blocked=p=>wall.has(key(p))||key(p)==='3,1'; // gate closed, until button-access method found
function step(s,a){s=JSON.parse(JSON.stringify(s));let moving=s.p.map((p,i)=>!p.c?[i,a]:null).filter(Boolean);s.p.forEach(p=>{if(p.c)p.f=a;});
 for(let micro=0;micro<4&&moving.length;micro++){let plans=[],pushes=[];
  for(let [i,di] of moving){let p=s.p[i],q,ok=false;
   for(let turns=0;turns<(micro?1:4);turns++,di=left[di]){q=add(p.r,di);if(blocked(q)||key(q)===key(s.b)&&blocked(add(s.b,di)))continue;ok=true;break;}
   if(!ok)q=p.r;let push=ok&&key(q)===key(s.b);if(push)pushes.push(di);plans.push({i,r:q,f:micro?p.f:di,push,ok});
  }
  let uniq=[...new Set(pushes)];if(uniq.length>1)return null;let old=s.b;if(uniq.length)s.b=add(s.b,uniq[0]);if(ice.has(key(s.b)))return null;
  let next=[];for(let m of plans){let p=s.p[m.i];p.r=m.r;p.f=m.f;if(uniq.length&&key(p.r)===key(s.b)){p.c=true;p.r=s.b;}
   if(spike.has(key(p.r))&&!p.c)p.dead=true;else if(ice.has(key(p.r))&&m.ok&&!m.push&&!p.c)next.push([m.i,m.f]);}
  s.p.forEach(p=>{if(p.c)p.r=s.b;});let merged=new Set();s.p.forEach(p=>{let k=key(p.r)+','+p.c;if(merged.has(k))p.dead=true;else merged.add(k);});moving=next.filter(([i])=>!s.p[i].dead);
 }
 s.p=s.p.filter(p=>!p.dead);return s;
}
function hash(s){return key(s.b)+'|'+s.p.map(p=>key(p.r)+','+(+p.c)).sort().join(';');}
function replay(path){let s=initial;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'){replay(process.argv[3]);process.exit();}
function splitDirs(r,f,allow){let side=f==='W'||f==='S'?['A','D']:['W','S'];let ds=side.filter(a=>allow(add(r,a),a));if(ds.length<2&&allow(add(r,f),f)&&!ds.includes(f))ds.push(f);return ds;}
function firstX(s){let p=s.p[0],ds=splitDirs(p.r,p.f,(q,a)=>!blocked(q)&&(key(q)!==key(s.b)||!blocked(add(s.b,a))));let b=s.b,push=ds.filter(a=>key(add(p.r,a))===key(b));if(push.length>1)return null;if(push.length)b=add(b,push[0]);let ps=ds.map(a=>({r:add(p.r,a),f:p.f,c:false,split:1})).filter(p=>!spike.has(key(p.r)));if(ps.some(p=>ice.has(key(p.r))))return null;return {b,p:ps};}
function secondX(s){let cargo=s.p.find(p=>p.c),outside=s.p.find(p=>!p.c);if(!cargo||!outside)return null;
 let cds=splitDirs(cargo.r,cargo.f,q=>!blocked(q));if(cds.length!==2)return null;let bs=cds.map(a=>add(cargo.r,a));
 let fds=splitDirs(outside.r,outside.f,q=>!blocked(q));let ps=fds.map(a=>add(outside.r,a)).filter(q=>!spike.has(key(q))&&!bs.some(b=>key(b)===key(q)));
 if(ps.length!==2)return null;return {bs,ps};}
if(process.argv[2]==='allreplay'){
 let s={b:[3,4],p:[{r:[2,5],f:'S',c:false,split:2}]},xs=0,path=process.argv[3];console.log('DS_START',JSON.stringify(s));
 for(let i=0;i<path.length;i++){if(path[i]==='X'){if(xs++===0)s=firstX(s);else {console.log('FINAL_X',i+1,JSON.stringify(secondX(s)));break;}}else s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}process.exit();
}
if(process.argv[2]==='allfirst'){
 let solo=[{b:[3,4],p:[{r:[2,5],f:'S',c:false,split:2}]}],soloPaths=[''],soloSeen=new Set(),sh=0,seeds=[],seedPaths=[];
 const hf=s=>hash(s)+'|'+s.p.map(p=>key(p.r)+','+p.f).sort().join(';');
 while(sh<solo.length&&sh<2000){let s=solo[sh],path=soloPaths[sh++];let n=firstX(s);if(n&&n.p.length===2){seeds.push(n);seedPaths.push(path+'X');}
  for(let a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==1)continue;let h=hf(n);if(soloSeen.has(h))continue;soloSeen.add(h);solo.push(n);soloPaths.push(path+a);}}
 console.log('SOLO_PREFIX',sh,solo.length,'splitSeeds',seeds.length);
 let q=[],paths=[],seen=new Set(),head=0,candidates=0;for(let i=0;i<seeds.length;i++){let h=hf(seeds[i]);if(seen.has(h))continue;seen.add(h);q.push(seeds[i]);paths.push(seedPaths[i]);}
 while(head<q.length&&head<20000){let s=q[head],path=paths[head++],post=secondX(s);
  if(post&&!post.bs.some(b=>b[0]===1||key(b)==='3,5')){let fronts=post.bs.filter(b=>b[1]===3);if(fronts.length&&post.ps.some(p=>p[0]>Math.max(...fronts.map(b=>b[0]))||p[0]===7&&p[1]<=2)){
   console.log('RIGHTSIDE_TWOBOX_CANDIDATE',JSON.stringify({path:path+'X',before:s,post}));candidates++;}}
  if(path.length>=55)continue;for(let a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==2)continue;let h=hf(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}
 }
 console.log('ALL_FIRST_BOUNDED',head,q.length,seen.size,'rightSideCandidates',candidates);process.exit();
}
let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0,maxCargoX=0,first,cargoAt=new Map();
while(head<q.length&&head<20000){let s=q[head],path=paths[head++];
 if(s.p.some(p=>p.c)&&!first){first={path,state:s};console.log('FIRST_CARGO',JSON.stringify(first));}
 if(s.p.some(p=>p.c)&&!cargoAt.has(key(s.b)))cargoAt.set(key(s.b),{path,state:s});
 if(process.argv[2]==='cargo1'&&key(s.b)==='1,3'&&s.p.some(p=>p.c)){console.log('CARGO1',JSON.stringify({path,state:s}));replay(path);process.exit();}
 if(s.p.some(p=>p.c)&&s.b[0]>maxCargoX){maxCargoX=s.b[0];console.log('MAX_CARGO_X',JSON.stringify({path,state:s}));}
 if(key(s.b)==='7,4'&&s.p.some(p=>p.c)){console.log('TARGET',JSON.stringify({path,state:s,expanded:head,seen:seen.size}));replay(path);process.exit();}
 if(path.length>=50)continue;for(let a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==2)continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}
}
console.log('BOUNDED_END',head,q.length,seen.size,'maxCargoX',maxCargoX,'first',JSON.stringify(first));
console.log('CARGO_COORDINATES',JSON.stringify([...cargoAt]));
