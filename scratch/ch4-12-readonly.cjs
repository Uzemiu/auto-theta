// Own read-only single-box finite model; actual6 first fork already spent.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-12.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const v={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,d)=>[p[0]+v[d][0],p[1]+v[d][1]];
const initial={b:[4,3],p:[{r:[6,2],f:'D',c:false,fork:0},{r:[7,3],f:'D',c:false,fork:0}],gate:true,rem:['7,5','7,6']};
const blocked=(r,s)=>wall.has(key(r))||key(r)==='7,4'&&!s.gate;
function step(s,a){let plans=[],pushes=[];
 for(let p of s.p){if(p.c){if(a==='X')return [];plans.push({...p,f:a});continue;}
  if(a==='X'){if(!p.fork){plans.push({...p});continue;}let l=left[p.f],opts=[l,left[left[l]],p.f],valid=[];
   for(let d of opts){let r=add(p.r,d);if(blocked(r,s)||key(r)===key(s.b)&&blocked(add(s.b,d),s))continue;valid.push({...p,r,d,fork:p.fork-1});if(key(r)===key(s.b))pushes.push({d,who:plans.length+valid.length-1});if(valid.length===2)break;}
   if(!valid.length)valid=[{...p,fork:p.fork-1}];plans.push(...valid);continue;}
  let d=a,r,ok=false;for(let j=0;j<4;j++,d=left[d]){r=add(p.r,d);if(blocked(r,s)||key(r)===key(s.b)&&blocked(add(s.b,d),s))continue;ok=true;break;}
  if(!ok)r=p.r;plans.push({...p,r,f:d});if(ok&&key(r)===key(s.b))pushes.push({d,who:plans.length-1});}
 let ds=[...new Set(pushes.map(p=>p.d))],choices=ds.length?ds:[null],out=[];
 for(let d of choices){let b=d?add(s.b,d):s.b,ps=[];
  for(let i=0;i<plans.length;i++){let p=plans[i],c=p.c||!!d&&key(p.r)===key(b),r=p.c?b:p.r;if(!c&&spike.has(key(r)))continue;
   if(ds.length>1&&pushes.some(p=>p.who===i&&p.d!==d))continue; // participant lost in this force branch; retained winner at old box cell
   let same=ps.find(q=>key(q.r)===key(r)&&q.c===c);if(same)same.fork=Math.max(same.fork,p.fork);else ps.push({r,f:p.f,c,fork:p.fork});}
  let rem=s.rem.slice();for(let p of ps){let i=rem.indexOf(key(p.r));if(i>=0){p.fork++;rem.splice(i,1);}}
  out.push({b,p:ps,rem,gate:key(b)==='6,2'||key(b)==='7,4'||ps.some(p=>key(p.r)==='6,2'||key(p.r)==='7,4'),conflict:ds.length>1,chosen:d});}
 return out;
}
const hash=s=>key(s.b)+'|'+s.p.map(p=>key(p.r)+','+(p.fork?p.f:'-')+','+(+p.c)+','+p.fork).sort().join(';')+'|'+s.rem.join(';')+'|'+(+s.gate);
function replay(path,start=initial,choice){let s=start;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){let ns=step(s,path[i]);s=ns.find(n=>n.chosen===choice)||ns[0];console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'){replay(process.argv[3],process.argv[4]?JSON.parse(process.argv[4]):initial,process.argv[5]);process.exit();}
if(process.argv[2]==='button'){
 let start=replay(process.argv[4]),cap=Number(process.argv[3])||8000,nodes=[];for(let x=2;x<=6;x++)for(let y=2;y<=5;y++){let b=[x,y];if(!wall.has(key(b))&&!spike.has(key(b)))nodes.push(b);}
 let dist=new Map([['6,2',0]]),front=[[6,2]];for(let i=0;i<front.length;i++)for(let b of nodes)for(let a of 'WASD'){let back=add(b,left[left[a]]);if(key(add(b,a))===key(front[i])&&!wall.has(key(back))&&!spike.has(key(back))&&!dist.has(key(b))){dist.set(key(b),dist.get(key(front[i]))+1);front.push(b);}}
 const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]),h=s=>{let db=dist.get(key(s.b));if(db===undefined)return 1000;let req=[];for(let a of 'WASD'){let next=add(s.b,a),back=add(s.b,left[left[a]]);if(dist.get(key(next))===db-1&&!wall.has(key(back))&&!spike.has(key(back)))req.push(back);}return db+(req.length?Math.min(...req.flatMap(r=>s.p.map(p=>md(p.r,r)))):0);};
 let heap=[],best=new Map([[hash(start),0]]),expanded=0;const put=n=>{heap.push(n);let i=heap.length-1;while(i){let j=(i-1)>>1;if(heap[j].v<=n.v)break;heap[i]=heap[j];i=j;}heap[i]=n;};const get=()=>{let n=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].v<heap[j].v)j++;if(heap[j].v>=last.v)break;heap[i]=heap[j];i=j;}heap[i]=last;}return n;};put({s:start,p:'',v:h(start)*4});
 while(heap.length&&expanded<cap){let {s,p}=get();if(best.get(hash(s))!==p.length)continue;expanded++;if(key(s.b)==='6,2'){console.log('BUTTON',JSON.stringify({path:p,state:s,expanded,seen:best.size}));replay(p,start);process.exit();}if(p.length>=40)continue;for(let a of 'WASD')for(let n of step(s,a)){if(n.conflict||n.p.length!==3||n.p.some(p=>p.c)||!n.rem.includes('7,6')||!dist.has(key(n.b)))continue;let k=hash(n),g=p.length+1;if(best.has(k)&&best.get(k)<=g)continue;best.set(k,g);put({s:n,p:p+a,v:g+h(n)*4});}}
 console.log('BUTTON_BOUND',expanded,best.size);process.exit();
}
let phase=process.argv[2]||'three',cap=Number(process.argv[3])||12000,start=process.argv[4]?replay(process.argv[4]):initial,q=[start],paths=[''],seen=new Set([hash(start)]),head=0;
while(head<q.length&&head<cap){let s=q[head],p=paths[head++];
 let outside=s.p.filter(p=>!p.c),parity=p=>(p.r[0]+p.r[1])%2;
 let hit=phase==='conflict'?key(s.b)==='2,3'&&s.p.some(p=>p.c&&p.fork===1)&&outside.some(p=>key(p.r)==='2,2')&&outside.some(p=>key(p.r)==='3,3'):phase==='onefork'?s.p.some(p=>p.fork===1&&p.r[1]<=3)&&s.rem.includes('7,6'):phase==='three'?s.p.length===3&&s.p.filter(p=>p.fork===1).length===2&&s.p.every(p=>!p.c):phase==='resource'?s.p.length===3&&s.p.every(p=>!p.c)&&s.p.filter(p=>p.fork===1).length===1&&s.p.filter(p=>!p.fork).length===2&&parity(s.p.filter(p=>!p.fork)[0])===parity(s.p.filter(p=>!p.fork)[1]):phase==='capture'||phase==='resourcecapture'?s.p.length===3&&s.p.some(p=>p.c&&p.fork===1)&&outside.length===2&&parity(outside[0])===parity(outside[1]):key(s.b)==='2,7'&&s.p.some(p=>p.c&&p.fork===1);
 if(hit){console.log('TARGET',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p,start);process.exit();}
 if(p.length>=40)continue;for(let a of ['three','resource','resourcecapture'].includes(phase)?'WASDX':'WASD')for(let n of step(s,a)){if(n.conflict||n.p.length>3||phase!=='end'&&n.p.length<(['onefork','three','resource','resourcecapture'].includes(phase)?2:3)||n.b[0]<=1||n.b[0]>=7||n.b[1]<=1||phase!=='end'&&spike.has(key(n.b)))continue;if(!n.rem.length&&!n.p.some(p=>p.fork))continue;let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}}
console.log('BOUNDED_END',phase,head,seen.size);
