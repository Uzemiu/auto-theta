// Own bounded read-only model of observed matrix geometry; never game I/O.
const fs=require('fs'),raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-13.json','utf8').replace(/^\uFEFF/,'')),t=raw.initial.level.timelines[0];
const wall=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>e.pos.join(','))),spike=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>e.pos.join(',')));
const v={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},left={W:'A',A:'S',S:'D',D:'W'},key=p=>p.join(','),add=(p,d)=>[p[0]+v[d][0],p[1]+v[d][1]];
const gates=['5,4','5,7'],buttons=['5,3','6,7']; // Pairing is geometry hypothesis until owner tests.
const initial={b:[2,2],p:[{r:[6,1],f:'S',c:false,fork:0}],gate:[false,false],rem:['6,2','5,5','5,6']};
const blocked=(r,s)=>wall.has(key(r))||gates.some((g,i)=>key(r)===g&&!s.gate[i]);
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
   if(ds.length>1&&pushes.some(p=>p.who===i&&p.d!==d))continue;
   let same=ps.find(q=>key(q.r)===key(r)&&q.c===c);if(same)same.fork=Math.max(same.fork,p.fork);else ps.push({r,f:p.f,c,fork:p.fork});}
  let rem=s.rem.slice();for(let p of ps){let i=rem.indexOf(key(p.r));if(i>=0){p.fork++;rem.splice(i,1);}}
  const gate=buttons.map((button,i)=>key(b)===button||key(b)===gates[i]||ps.some(p=>key(p.r)===button||key(p.r)===gates[i]));
  out.push({b,p:ps,rem,gate,conflict:ds.length>1,chosen:d});}
 return out;
}
const hash=s=>key(s.b)+'|'+s.p.map(p=>key(p.r)+','+(p.fork?p.f:'-')+','+(+p.c)+','+p.fork).sort().join(';')+'|'+s.rem.join(';')+'|'+s.gate.map(Number).join('');
function replay(path,start=initial,choice){let s=start;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){let ns=step(s,path[i]);s=ns.find(n=>n.chosen===choice)||ns[0];console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[2]==='replay'){replay(process.argv[3],process.argv[4]?JSON.parse(process.argv[4]):initial,process.argv[5]);process.exit();}
const phase=process.argv[2]||'solo',cap=Number(process.argv[3])||10000,start=process.argv[4]?replay(process.argv[4]):initial,q=[start],paths=[''],seen=new Set([hash(start)]),parity=p=>(p.r[0]+p.r[1])%2;let head=0;
while(head<q.length&&head<cap){let s=q[head],p=paths[head++],outs=s.p.filter(p=>!p.c);
 let hit=phase==='solo'?s.p.length===1&&s.p[0].fork===3&&s.p[0].r[1]<=3:phase==='capture'?s.b[1]<=3&&s.p.some(p=>p.c&&p.fork>=2)&&outs.length>=1:phase==='wait'?s.p.length===2&&s.p.every(p=>!p.c&&p.fork===2)&&parity(s.p[0])!==parity(s.p[1]):phase==='tail'?key(s.b)==='2,4'&&s.p.some(p=>p.c&&p.fork>=2)&&outs.some(p=>key(p.r)==='2,3'):false;
 if(hit){console.log('TARGET',JSON.stringify({path:p,state:s,expanded:head,seen:seen.size}));replay(p,start);process.exit();}
 if(p.length>=42)continue;for(let a of phase==='solo'||phase==='wait'||phase==='tail'?'WASD':'WASDX')for(let n of step(s,a)){
  if(n.conflict||n.p.length>3||n.p.length<1||phase!=='solo'&&n.p.length<2||n.b[1]<=1||spike.has(key(n.b)))continue;
  if(phase==='solo'&&n.p.length!==1||phase==='wait'&&(n.p.length!==2||n.p.some(p=>p.c||p.fork!==2)))continue;
  if(phase==='capture'&&n.p.length!==2)continue;
  if(phase==='tail'&&n.p.length!==2)continue;
  let h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(p+a);}}
console.log('BOUNDED_END',phase,head,seen.size);
