const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-5.json','utf8').replace(/^\uFEFF/,''));
const base=raw.initial.level.timelines[0];
const wall=new Set(base.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(',')));
const spike=new Set(base.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const vec={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'};
const key=p=>p.join(',');const add=(p,d)=>[p[0]+vec[d][0],p[1]+vec[d][1]];
function fromSnap(s){let t=s.level.timelines[0],box=t.entities.find(e=>e.type==='BOX');return {b:box.pos,p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({r:e.pos,f:e.properties.face,c:e.properties.contained!==0,split:e.properties.split}))};}
const initial={b:[3,3],g:false,g1:false,remaining:true,p:[{r:[5,3],f:2,c:false,split:0},{r:[7,3],f:2,c:false,split:0}]};
const blocked=(p,s)=>wall.has(key(p))||(!s.g&&key(p)==='6,2')||(!s.g1&&key(p)==='2,7');
function step(s,a){let plans=[], pushes=[];
 for(let i=0;i<s.p.length;i++){
  let p=s.p[i];if(p.c){plans.push({r:p.r,f:Object.keys(vec).indexOf(a)});continue;}
  let d=a,ok=false,q;
  for(let j=0;j<4;j++,d=left[d]){
   q=add(p.r,d);if(blocked(q,s))continue;
   if(key(q)===key(s.b)&&blocked(add(s.b,d),s))continue;
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
 let remaining=s.remaining;if(remaining){for(let p of ps){if(key(p.r)==='6,1'){p.split++;remaining=false;break;}}}let g=key(b)==='6,4'||key(b)==='6,2'||ps.some(p=>key(p.r)==='6,4'||key(p.r)==='6,2');let g1=key(b)==='1,1'||key(b)==='2,7'||ps.some(p=>key(p.r)==='1,1'||key(p.r)==='2,7');return {b,p:ps,remaining,g,g1};
}
function show(s){return JSON.stringify(s);}
function replay(path,s=initial){console.log('START',show(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);if(!s){console.log('CONFLICT');return;}console.log(i+1,path[i],show(s));}return s;}
function hash(s){return key(s.b)+'|'+(+!!s.remaining)+','+(+!!s.g)+','+(+!!s.g1)+'|'+s.p.map(p=>key(p.r)+','+(+p.c)+','+p.f+','+p.split).sort().join(';');}
if(process.argv[2]==='replay')replay(process.argv[3]);
else {
 let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0,limit=30000,firstCargo;
 while(head<q.length&&head<limit){let s=q[head],path=paths[head++];
  if(s.p.some(p=>p.c&&p.split===1)&&!firstCargo){firstCargo={path,state:s};console.log('FIRSTFORKCARGO',show(firstCargo));}
  if(s.p.some(p=>p.c&&p.split===1)&&key(s.b)==='1,7'&&s.p.some(p=>!p.c&&key(p.r)==='1,6')){console.log('TARGET',show({path,state:s,expanded:head,seen:seen.size}));process.exit();}
  if(path.length>=42)continue;
  for(let a of 'WASD'){let n=step(s,a);if(!n||n.p.length!==2||n.b[1]<3||n.b[0]===7)continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}
 }
 console.log('END',head,q.length,'seen',seen.size,'nodeLimit',head<q.length,'firstForkCargo',show(firstCargo));
}
