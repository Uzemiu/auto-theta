// Fork0 two cargo ordinary model. Branches only known Color4 same-box conflicts.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-11.json','utf8').replace(/^\uFEFF/,'')),base=raw.initial.level.timelines[0];
const wall=new Set(base.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(base.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const vec={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,d)=>[p[0]+vec[d][0],p[1]+vec[d][1]];
const initial={bs:[[6,2],[6,4]],ps:[[4,2],[4,4],[6,1],[6,3]]}; // actual21
function step(s,a){let plans=[],pushes=[];
 for(let p of s.ps){let di=a,q,ok=false,chain=[];
  for(let j=0;j<4;j++,di=left[di]){q=add(p,di);chain=[];let at=q;while(s.bs.some(b=>key(b)===key(at))){chain.push(s.bs.findIndex(b=>key(b)===key(at)));at=add(at,di);}if(wall.has(key(q))||wall.has(key(at)))continue;ok=true;break;}
  if(!ok){q=p;chain=[];}plans.push(q);if(chain.length)pushes.push({di,chain});}
 let forces=s.bs.map((b,i)=>[...new Set(pushes.filter(p=>p.chain.includes(i)).map(p=>p.di))]);
 let conflicts=forces.map((f,i)=>f.length>1?i:-1).filter(i=>i>=0);if(conflicts.length>1)return [];
 if(conflicts.length&&pushes.some(p=>p.chain.length>1))return []; // bounded direct-box conflict only
 let choices=conflicts.length?forces[conflicts[0]]:[null],out=[];
 for(let chosen of choices){let bs=s.bs.map((b,i)=>forces[i].length?add(b,i===conflicts[0]?chosen:forces[i][0]):b);
  if(new Set(bs.map(key)).size!==2)continue;let ps=[];for(let q of plans){if(bs.some(b=>key(b)===key(q))||spike.has(key(q)))continue;if(!ps.some(p=>key(p)===key(q)))ps.push(q);}
  out.push({bs,ps,conflict:!!conflicts.length,chosen});}
 return out;
}
const hash=s=>s.bs.map(key).sort().join(';')+'|'+s.ps.map(key).sort().join(';');
function replay(path,start=initial,branch){let s=start;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){let ns=step(s,path[i]);s=ns.length>1?ns.find(n=>n.chosen===branch)||ns[0]:ns[0];console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
function tail(start,side,cap=16000){let goals=side==='left'?['1,7','2,7']:['6,7','7,7'],q=[start],paths=[''],seen=new Set([hash(start)]),head=0;
 while(head<q.length&&head<cap){let s=q[head],p=paths[head++];if(goals.every(g=>s.bs.some(b=>key(b)===g)))return {path:p,state:s,expanded:head,seen:seen.size};if(p.length>=40||!s.ps.length)continue;
  for(let a of 'WASD')for(let n of step(s,a)){if(n.conflict||n.bs.some(b=>b[1]===1||b[0]===7&&b[1]<6||b[0]===1&&b[1]<6))continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}}
 return {failed:true,expanded:head,seen:seen.size};
}
function staging(start,side,cap=10000){let gb=side==='left'?[[3,5],[4,5]]:side==='left-direct'?[[2,5],[3,5]]:side==='right-direct'?[[5,5],[6,5]]:[[4,5],[5,5]],gp=side==='left'?[[3,4],[4,4],[5,5]]:side==='left-direct'?[[2,4],[3,4],[4,5]]:side==='right-direct'?[[5,4],[6,4],[4,5]]:[[4,4],[5,4],[3,5]],perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]],md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
 const h=s=>Math.max(Math.min(Math.max(md(s.bs[0],gb[0]),md(s.bs[1],gb[1])),Math.max(md(s.bs[0],gb[1]),md(s.bs[1],gb[0]))),Math.min(...perms.map(p=>Math.max(...p.map((pi,i)=>md(s.ps[i],gp[pi]))))));
 let heap=[],best=new Map([[hash(start),0]]),expanded=0;
 const put=n=>{heap.push(n);let i=heap.length-1;while(i){let j=(i-1)>>1;if(heap[j].v<=n.v)break;heap[i]=heap[j];i=j;}heap[i]=n;};
 const get=()=>{let n=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].v<heap[j].v)j++;if(heap[j].v>=last.v)break;heap[i]=heap[j];i=j;}heap[i]=last;}return n;};
 put({s:start,p:'',v:h(start)*3});
 while(heap.length&&expanded<cap){let {s,p}=get();if(p.length!==best.get(hash(s)))continue;expanded++;if(!h(s)){let finish=side==='left'?'AWWA':side==='left-direct'?'WWA':side==='right-direct'?'WWD':'DWWD';return {path:p+finish,stagingPath:p,staging:s,expanded,seen:best.size};}if(p.length>=40)continue;
  for(let a of 'WASD')for(let n of step(s,a)){if(n.conflict||n.ps.length!==3||n.bs.some(b=>b[0]<2||b[0]>6||b[1]<2||b[1]>5))continue;let k=hash(n),g=p.length+1;if(best.has(k)&&best.get(k)<=g)continue;best.set(k,g);put({s:n,p:p+a,v:g+h(n)*3});}}
 return {failed:true,expanded,seen:best.size};
}
if(process.argv[2]==='replay'){replay(process.argv[3],process.argv[4]?JSON.parse(process.argv[4]):initial,process.argv[5]);process.exit();}
if(process.argv[2]==='tail'){let s=JSON.parse(process.argv[4]);console.log('TAIL',JSON.stringify(tail(s,process.argv[3],Number(process.argv[5])||16000)));process.exit();}
if(process.argv[2]==='stage'){let s=JSON.parse(process.argv[4]);console.log('STAGE',JSON.stringify(staging(s,process.argv[3],Number(process.argv[5])||10000)));process.exit();}
const start=process.argv[4]?replay(process.argv[4]):initial;
let q=[start],paths=[''],seen=new Set([hash(start)]),head=0,cap=Number(process.argv[3])||6000,candidates=0;
while(head<q.length&&head<cap){let s=q[head],p=paths[head++];if(p.length>=22)continue;
 if(process.argv[2]==='untrap'&&s.bs.every(b=>b[1]<=3)){console.log('UNTRAP',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p);process.exit();}
 for(let a of 'WASD'){let ns=step(s,a);if(ns.length===2&&ns.every(n=>n.conflict&&n.ps.length===3&&n.bs.every(b=>b[0]>=2&&b[0]<=6&&b[1]>=2&&b[1]<=4))){
   candidates++;console.log('CANDIDATE',JSON.stringify({path:p+a,states:ns,expanded:head}));if(process.argv[2]!=='solve')process.exit();
   let l=tail(ns[0],'left',6000),r=tail(ns[1],'right',6000);if(l.failed||r.failed){l=tail(ns[1],'left',6000);r=tail(ns[0],'right',6000);}
   if(!l.failed&&!r.failed){console.log('SOLUTION',JSON.stringify({prefix:p+a,left:l,right:r,states:ns}));process.exit();}console.log('TAIL_BOUND',JSON.stringify({left:l,right:r}));if(candidates>=4)process.exit();
  }
  for(let n of ns){if(n.conflict||n.ps.length!==4||n.bs.some(b=>b[0]<=1||b[0]>=7||b[1]<=1||b[1]>=5||spike.has(key(b))))continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}}}
console.log('BOUND',head,seen.size,candidates);
