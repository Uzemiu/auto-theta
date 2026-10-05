// Read-only bounded planning, no game/save/KB access beyond observed JSON.
// Initial SD+X hypothesis: two fork1 free at5,5/5,3. Ordinary two-color
// box chain uses M028 as a hypothesis; owner must verify first actual push.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-8.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0];
const walls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(',')));
const spikes=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const dirs={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'};
const key=p=>p.join(','),add=(p,d)=>[p[0]+dirs[d][0],p[1]+dirs[d][1]];
const post=process.argv[2]==='post'||process.argv[2]==='postreplay';
const initial=post?{bs:[[4,1],[5,1],[6,2]],ps:[{r:[5,1],f:'A',c:1,split:0},{r:[6,2],f:'A',c:2,split:0},{r:[6,1],f:'S',c:-1,split:0},{r:[6,3],f:'W',c:-1,split:0}]}:{bs:[[4,1],[5,1]],ps:[{r:[5,5],f:'D',c:-1,split:1},{r:[5,3],f:'D',c:-1,split:1}]};
function step(s,a){let plans=[],pushes=[];
 for(let p of s.ps){if(p.c>=0){plans.push({r:p.r,f:a,chain:[]});continue;}let d=a,q,chain=[],ok=false;
  for(let j=0;j<4;j++,d=left[d]){q=add(p.r,d);chain=[];let at=q;
   while(s.bs.some(b=>key(b)===key(at))){let bi=s.bs.findIndex(b=>key(b)===key(at));chain.push(bi);at=add(at,d);}
   if(!walls.has(key(q))&&!walls.has(key(at))){ok=true;break;}
  }
  if(!ok){q=p.r;chain=[];}plans.push({r:q,f:d,chain});if(chain.length)pushes.push({d,chain});
 }
 let moved=new Map();for(let v of pushes)for(let bi of v.chain){if(moved.has(bi)&&moved.get(bi)!==v.d)return null;moved.set(bi,v.d);}
 let bs=s.bs.map((b,i)=>moved.has(i)?add(b,moved.get(i)):b);
 if(new Set(bs.map(key)).size!==bs.length)return null; // unmodeled stacking
 let ps=[];for(let i=0;i<s.ps.length;i++){let p=s.ps[i],m=plans[i],c=p.c;
  if(c<0)c=bs.findIndex((b,bi)=>moved.has(bi)&&key(b)===key(m.r));let r=c>=0?bs[c]:m.r;
  if(c<0&&spikes.has(key(r)))continue;if(ps.some(p=>p.c===c&&key(p.r)===key(r)))continue;
  ps.push({r,f:m.f,c,split:p.split});}
 return {bs,ps};
}
function hash(s){return s.bs.map(key).join(';')+'|'+s.ps.map(p=>key(p.r)+','+p.c+','+p.split).sort().join(';');}
function replay(path,s=initial){console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'||process.argv[2]==='postreplay'){replay(process.argv[3]);process.exit();}
let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0;
while(head<q.length&&head<10000){let s=q[head],p=paths[head++];
 if(post&&key(s.bs[2])==='7,7'&&s.ps.some(p=>p.c===2)){console.log('POST_TARGET',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p);process.exit();}
 if(key(s.bs[0])==='5,1'&&key(s.bs[1])==='6,1'&&s.ps.some(p=>p.c===1)&&s.ps.some(p=>p.c<0&&key(p.r)==='4,1')){console.log('CAPTURE',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p);process.exit();}
 if(p.length>=30)continue;for(let a of 'WASD'){let n=step(s,a);if(!n)continue;
  if(post){if(key(n.bs[0])!=='4,1'||key(n.bs[1])!=='5,1')continue;if(n.ps.filter(p=>p.c<0).length<1&&key(n.bs[2])!=='7,7')continue;}
  else {if(n.ps.length!==2||n.ps.some(p=>p.c===0))continue;} // only Color4 capture target
  let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}
}
console.log('BOUNDED_END',head,q.length,seen.size);
