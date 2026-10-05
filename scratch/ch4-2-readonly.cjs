const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-2.json','utf8').replace(/^\uFEFF/,''));
const base=raw.initial.level.timelines[0];
const wall=new Set(base.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(',')));
const spike=new Set(base.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const vec={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'};
const key=p=>p.join(',');const add=(p,d)=>[p[0]+vec[d][0],p[1]+vec[d][1]];
function fromSnap(s){let t=s.level.timelines[0],box=t.entities.find(e=>e.type==='BOX');return {b:box.pos,p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({r:e.pos,f:e.properties.face,c:e.properties.contained!==0,split:e.properties.split}))};}
const initial=process.argv.includes('afterx')?{b:[3,2],p:[{r:[1,4],f:0,c:false,split:0},{r:[3,4],f:0,c:false,split:0},{r:[4,2],f:0,c:false,split:0}]}:{b:[3,4],p:[{r:[2,3],f:0,c:false,split:1},{r:[1,4],f:0,c:false,split:1}]};
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
function hash(s){return key(s.b)+'|'+s.p.map(p=>key(p.r)+','+(+p.c)+','+p.f).sort().join(';');}
if(process.argv[2]==='replay')replay(process.argv[3]);
else {
 let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0,limit=30000;
 while(head<q.length&&head<limit){let s=q[head],path=paths[head++];
  if(process.argv.includes('afterx')?s.p.some(p=>p.c)&&key(s.b)==='3,6'&&s.p.some(p=>!p.c&&key(p.r)==='2,6')&&s.p.some(p=>!p.c&&key(p.r)==='3,5'):key(s.b)==='3,2'&&s.p.some(p=>key(p.r)==='4,2'&&p.f===0)&&s.p.some(p=>key(p.r)==='2,4'&&p.f===0)){console.log('TARGET',show({path,state:s,expanded:head,seen:seen.size}));process.exit();}
  if(path.length>=(process.argv.includes('afterx')?28:18))continue;
  for(let a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==(process.argv.includes('afterx')?3:2)||(!process.argv.includes('afterx')&&n.p.some(p=>p.c)))continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}
 }
 console.log('END',head,q.length,'seen',seen.size,'nodeLimit',head<q.length);
}
