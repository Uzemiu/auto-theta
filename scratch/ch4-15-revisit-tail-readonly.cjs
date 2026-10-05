// Model-only post fork-X conflict hypothesis. No game interaction.
const fs=require('fs'),vm=require('vm'),source=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8');
const box={require,process:{argv:[]},console,module:{exports:{}}};
vm.runInNewContext(source.slice(0,source.indexOf("if(process.argv[2]==='replay')"))+
  '\nmodule.exports={step,spike,ice};',box);
const {step,spike,ice}=box.module.exports,K=r=>r.join(',');
const side=process.argv[2]||'left',right=side==='right';
const initial={b:[{r:[2,6],color:3},{r:[4,6],color:3},{r:[6,6],color:3},{r:[right?3:5,6],color:4}],
  p:[{r:[2,6],f:'W',fork:0,c:0,ghost:0},{r:[4,6],f:'W',fork:0,c:1,ghost:0},
    {r:[6,6],f:'W',fork:0,c:2,ghost:0},{r:[4,4],f:'W',fork:0,c:-1,ghost:0}],rem:[]};
const goals=right?['5,6','6,7','7,8']:['3,6','2,7','1,8'];
const hit=s=>goals.every(g=>s.p.some(p=>K(p.r)===g));
const hash=s=>s.b.map(b=>K(b.r)).join(';')+'|'+s.p.map(p=>[...p.r,p.c,p.ghost].join(',')).sort().join(';');
function replay(path){let s=initial;console.log('START',JSON.stringify(s));for(let i=0;i<path.length;i++){
  s=step(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}return s;}
if(process.argv[3]==='replay'){replay(process.argv[4]||'');process.exit();}
const cap=Math.min(Number(process.argv[3])||10000,12000);let q=[initial],paths=[''],seen=new Set([hash(initial)]),head=0;
while(head<q.length&&head<cap){const s=q[head],path=paths[head++];
  if(hit(s)){console.log('CONDITIONAL_TARGET',JSON.stringify({side,path,state:s,expanded:head,seen:seen.size}));replay(path);process.exit();}
  if(path.length>=45||s.p.every(p=>p.c>=0))continue;
  for(const a of 'WASD'){let n=step(s,a);if(!n||n.p.filter(p=>p.c>=0).length<3)continue;
    if(n.b.some(b=>b.r[1]<=1))continue;
    const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push(n);paths.push(path+a);}
}
console.log('FINITE_END',JSON.stringify({side,expanded:head,seen:seen.size,queue:q.length,exhausted:head===q.length,
  cap,depthLimit:45,scope:'hypothetical fork-X branch; ordinary only, three cargo plus one free plus buffer BOX'}));
