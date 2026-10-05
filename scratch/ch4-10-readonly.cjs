// Read-only finite ordinary model from actual8 SDXASDDD. No game input,
// hidden implementation, hints, save or main KB edits. Gate pairings actual.
const fs=require('fs'),d=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-10.json','utf8').replace(/^\uFEFF/,'')),t=d.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const dirs={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,a)=>[p[0]+dirs[a][0],p[1]+dirs[a][1]];
const gates=[{r:[3,4],id:0},{r:[4,5],id:0},{r:[4,1],id:1},{r:[1,4],id:1}];
const initial8={bs:[[3,3],[4,3],[4,2]],ps:[{r:[3,2],f:'W',c:-1,fork:0,k:0},{r:[6,1],f:'D',c:-1,fork:0,k:0}],go:[true,true,false,false],fork:true,key:true,lock:true};
const initial19={bs:[[3,3],[4,4],[4,3]],ps:[{r:[1,3],f:'W',c:-1,fork:0,k:0},{r:[1,5],f:'W',c:-1,fork:1,k:0}],go:[false,false,false,false],fork:false,key:true,lock:true};
const initial23={bs:[[3,3],[4,3],[4,2]],ps:[{r:[3,1],f:'D',c:-1,fork:0,k:0},{r:[1,3],f:'S',c:-1,fork:1,k:0}],go:[false,false,false,false],fork:false,key:true,lock:true};
const initial=process.argv[4]==='19'?initial19:process.argv[4]==='23'?initial23:initial8;
const has=(s,k)=>s.bs.some(b=>key(b)===k)||s.ps.some(p=>key(p.r)===k);
function step(old,a){let s=JSON.parse(JSON.stringify(old)),plans=[],pushes=[],opens=[];
 const blocked=p=>wall.has(key(p))||gates.some((g,i)=>key(g.r)===key(p)&&!s.go[i]);
 for(let i=0;i<s.ps.length;i++){let p=s.ps[i];if(p.c>=0){plans.push({i,r:p.r,f:a,chain:[],open:false});continue;}
  let di=a,q,ok=false,chain=[],open=false;
  for(let turns=0;turns<4;turns++,di=left[di]){q=add(p.r,di);chain=[];let at=q;
   while(s.bs.some(b=>key(b)===key(at))){chain.push(s.bs.findIndex(b=>key(b)===key(at)));at=add(at,di);}
   open=s.lock&&key(at)==='7,4';if(blocked(q)||blocked(at))continue;
   if(open){if(chain.length){let front=chain[chain.length-1];if(!s.ps.some(p=>p.c===front&&p.k>0))continue;}else if(!p.k)continue;}
   ok=true;break;}
  if(!ok){q=p.r;chain=[];open=false;}if(chain.length)pushes.push({di,chain});if(open)opens.push({i,chain});plans.push({i,r:q,f:di,chain,open});
 }
 let moved=new Map();for(let v of pushes)for(let bi of v.chain){if(moved.has(bi)&&moved.get(bi)!==v.di)return null;moved.set(bi,v.di);}
 s.bs=s.bs.map((b,i)=>moved.has(i)?add(b,moved.get(i)):b);if(new Set(s.bs.map(key)).size!==s.bs.length)return null;
 for(let v of opens){s.lock=false;let p=v.chain.length?s.ps.find(p=>p.c===v.chain[v.chain.length-1]&&p.k>0):s.ps[v.i];p.k--;}
 for(let m of plans){let p=s.ps[m.i];p.f=m.f;if(p.c>=0)p.r=s.bs[p.c];else {p.r=m.r;let bi=s.bs.findIndex((b,i)=>moved.has(i)&&key(b)===key(p.r));if(bi>=0)p.c=bi;else if(spike.has(key(p.r)))p.dead=true;}}
 for(let p of s.ps){if(p.dead)continue;if(s.fork&&key(p.r)==='1,5'){p.fork++;s.fork=false;}if(s.key&&key(p.r)==='3,6'){p.k++;s.key=false;}}
 let merged=new Map();for(let p of s.ps){if(p.dead)continue;let h=key(p.r)+','+p.c;if(merged.has(h)){let keep=merged.get(h);keep.k=Math.max(keep.k,p.k);keep.fork=Math.max(keep.fork,p.fork);p.dead=true;}else merged.set(h,p);}
 s.ps=s.ps.filter(p=>!p.dead);s.go=gates.map(g=>has(s,g.id?'1,1':'6,1')||has(s,key(g.r)));return s;
}
const hash=s=>s.bs.map(key).join(';')+'|'+s.ps.map(p=>key(p.r)+','+p.c+','+p.fork+','+p.k+','+p.f).sort().join(';')+'|'+s.go.map(Number).join('')+'|'+(+s.fork)+(+s.key)+(+s.lock);
function replay(path,start=initial){let s=start;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'){replay(process.argv[3]);process.exit();}
let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0,phase=process.argv[2]||'fork',cap=Number(process.argv[3])||20000;
const wait=s=>s.ps.some((p,i)=>p.c<0&&p.fork===1&&'WASD'.split('').some(a=>{let n=step(s,a);return n&&n.ps.length===2&&key(n.ps[i].r)===key(p.r)&&n.ps[i].c<0&&key(n.ps[1-i].r)!==key(s.ps[1-i].r);}));
while(head<q.length&&head<cap){let s=q[head],p=paths[head++];
 let hit=phase==='fork'?s.ps.some(p=>p.fork===1):phase==='wait'?wait(s):phase==='key'?s.ps.some(p=>p.fork===1)&&s.ps.some(p=>p.k===1):phase==='trap'?s.ps.some(p=>p.fork===1&&p.c<0&&key(p.r)==='2,4')&&s.bs.some(b=>key(b)==='2,3')&&!s.go[0]&&!s.go[3]:phase==='forkkey'?s.ps.some(p=>p.fork===1&&p.k===1):phase==='capture'?s.ps.some(p=>p.fork===1&&p.c>=0)&&s.ps.some(p=>p.c<0):s.ps.some(p=>p.fork===1&&p.k===1&&p.c>=0)&&s.ps.some(p=>p.c<0);
 if(hit){console.log('TARGET',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p);process.exit();}
 if(p.length>=55)continue;for(let a of 'WASD'){let n=step(s,a);if(!n||n.ps.length!==2)continue;
  if(n.bs.some((b,bi)=>b[0]===1||b[1]===1||key(b)==='6,2'||key(b)==='3,6'||(process.argv[5]==='safe'&&spike.has(key(b))&&!n.ps.some(p=>p.c===bi))))continue; // recoverability hypotheses, not universal rules
  let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}
}
console.log('BOUNDED_END',head,q.length,seen.size,phase);
