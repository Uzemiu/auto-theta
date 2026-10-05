const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-1.json','utf8').replace(/^\uFEFF/,''));
const base=raw.initial.level.timelines[0];
const wall=new Set(base.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(',')));
const spike=new Set(base.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const vec={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'};
const key=p=>p.join(',');const add=(p,d)=>[p[0]+vec[d][0],p[1]+vec[d][1]];
function fromSnap(s){let t=s.level.timelines[0],box=t.entities.find(e=>e.type==='BOX');return {b:box.pos,p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({r:e.pos,f:e.properties.face,c:e.properties.contained!==0,split:e.properties.split}))};}
const initial=process.argv.includes('branchleft')?{b:[4,5],p:[{r:[4,5],f:1,c:true,split:0},{r:[5,5],f:1,c:false,split:0}]}:process.argv.includes('branchdown')?{b:[5,4],p:[{r:[5,4],f:2,c:true,split:0},{r:[5,5],f:2,c:false,split:0}]}:process.argv[2]==='cargo2'?{b:[2,5],p:[{r:[2,5],f:3,c:true,split:0},{r:[3,5],f:1,c:false,split:0},{r:[4,5],f:1,c:false,split:0}]}:fromSnap(raw.events[13].observation);
function step(s,a){let plans=[], pushes=[];
 for(let i=0;i<s.p.length;i++){
  let p=s.p[i];if(p.c){plans.push({r:p.r,f:Object.keys(vec).indexOf(a)});continue;}
  let d=a,ok=false,q;
  for(let j=0;j<4;j++,d=left[d]){
   q=add(p.r,d);if(wall.has(key(q)))continue;
   if(key(q)===key(s.b)&&wall.has(key(add(s.b,d))))continue;
   ok=true;break;
  }
  if(!ok)q=p.r;
  if(ok&&key(q)===key(s.b))pushes.push(d);
  plans.push({r:q,f:Object.keys(vec).indexOf(d)});
 }
 let uniq=[...new Set(pushes)];if(uniq.length>1)return null; // model intentionally excludes unknown Color4 conflicts
 let b=uniq.length?add(s.b,uniq[0]):s.b,ps=[];
 for(let i=0;i<s.p.length;i++){
  let old=s.p[i],m=plans[i],c=old.c||key(m.r)===key(b)&&uniq.length;
  let r=old.c?b:m.r;
  if(spike.has(key(r))&&!c)continue;
  if(ps.some(p=>key(p.r)===key(r)&&p.c===!!c))continue;
  ps.push({r,f:m.f,c:!!c,split:old.split});
 }
 return {b,p:ps};
}
function show(s){return JSON.stringify(s);}
function replay(path,s=initial){console.log('START',show(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);if(!s){console.log('CONFLICT');return;}console.log(i+1,path[i],show(s));}return s;}
function hash(s){return key(s.b)+'|'+s.p.map(p=>key(p.r)+','+(+p.c)).sort().join(';');}
if(process.argv[2]==='replay')replay(process.argv[3]);
else {
 let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0,limit=30000,firstCargo;
 while(head<q.length&&head<limit){let s=q[head],path=paths[head++];
  if(s.p.length===3&&s.p.filter(p=>p.c).length===1){
   if(!firstCargo){firstCargo={path,state:s};console.log('FIRSTCARGO',show(firstCargo));}
   let free=s.p.filter(p=>!p.c).map(p=>key(p.r));
   if(process.argv.includes('target5')?key(s.b)==='5,5'&&free.includes('5,6')&&free.includes('6,5'):key(s.b)==='6,5'&&free.includes('5,5')&&free.includes('7,5')){console.log('TARGET',show({path,state:s,expanded:head,seen:seen.size}));process.exit();}
  }
  if(path.length>=22)continue;
  for(let a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==3)continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}
 }
 console.log('END',head,q.length,'seen',seen.size,'bounded',head<q.length,show(firstCargo));
}
