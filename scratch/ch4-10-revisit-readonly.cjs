// Read-only second visit. Uses only our old ordinary model and actual public map.
// No game input, hint, save, main KB, hidden implementation, or large search.
const fs = require('fs'), vm = require('vm');
const source = fs.readFileSync('scratch/ch4-10-readonly.cjs', 'utf8');
const box = { require, process: { argv: [] }, console, module: { exports: {} } };
const ordinarySource=source.slice(0, source.indexOf("if(process.argv[2]==='replay')"))
  .replace('if(new Set(s.bs.map(key)).size!==s.bs.length)return null;',
    'if(new Set(s.bs.map(key)).size!==s.bs.length)return {...s, stack:true, stackPushes:pushes, stackPlans:plans};');
vm.runInNewContext(ordinarySource +
  '\nmodule.exports={step,initial23,spike,wall,gates};', box);
const { step, initial23, spike } = box.module.exports;
const K = p => p.join(',');
const cp = s => JSON.parse(JSON.stringify(s));
function canonical(s) {
  const order=s.bs.map((r,i)=>({r,i})).sort((a,b)=>a.r[0]-b.r[0]||a.r[1]-b.r[1]);
  const remap=new Map(order.map((v,i)=>[v.i,i]));
  s.bs=order.map(v=>v.r);
  for(const p of s.ps)if(p.c>=0)p.c=remap.get(p.c);
  return s;
}
function hash(s) {
  return s.bs.map(K).join(';')+'|'+s.ps.map(p=>[...p.r,p.c,p.fork,p.k,p.fork?p.f:''].join(',')).sort().join(';')+
    '|'+s.go.map(Number).join('')+'|'+(+s.key)+(+s.lock);
}
function ordinary(s,a) {
  const n=step(s,a); if(!n||n.ps.length!==s.ps.length)return null;
  if(n.stack)return n; // Detect first distinct-source overlap only, no simulation beyond it.
  // Our old ordinary model does not record new SPIKE-capture ghost1; reject that
  // unmodeled branch instead of treating it as a confirmed live cargo.
  for(let i=0;i<n.ps.length;i++)if(s.ps[i].c<0&&n.ps[i].c>=0&&spike.has(K(n.ps[i].r)))return null;
  return canonical(n);
}
function replay(path,s) {
  console.log('START',JSON.stringify(s));
  for(let i=0;i<path.length;i++){s=ordinary(s,path[i]);console.log(i+1,path[i],JSON.stringify(s));if(!s)break;}
  return s;
}
const capture=replay('WSSSSAWWA',cp(initial23));
const vertical={bs:[[2,4],[2,2],[3,3],[4,2]],ps:[
  {r:[2,4],f:'D',c:0,fork:0,k:0},{r:[2,2],f:'D',c:1,fork:0,k:0},
  {r:[5,3],f:'D',c:-1,fork:0,k:0}],go:[false,false,false,false],fork:false,key:true,lock:true};
const horizontal={bs:[[1,3],[3,3],[4,3],[4,2]],ps:[
  {r:[1,3],f:'S',c:0,fork:0,k:0},{r:[3,3],f:'S',c:1,fork:0,k:0},
  {r:[5,3],f:'D',c:-1,fork:0,k:0}],go:[false,false,false,false],fork:false,key:true,lock:true};
const post3={bs:[[3,4],[3,2],[2,3],[4,3]],ps:[
  {r:[3,4],f:'A',c:0,fork:0,k:0},{r:[3,2],f:'A',c:1,fork:0,k:0},
  {r:[6,1],f:'D',c:-1,fork:0,k:0}],go:[true,true,false,false],fork:false,key:true,lock:true};
const name=process.argv[2]||'vertical', initial=canonical(cp(name==='stack'?initial23:name==='pre3'?capture:name==='post3'?post3:name==='horizontal'?horizontal:vertical));
if(process.argv[3]==='replay'){replay(process.argv[4]||'',initial);process.exit();}
// Model-only conditional post-X states: X itself has not been executed this visit.
const cap=Math.min(Number(process.argv[3])||6000,12000);
let queue=[initial],paths=[''],seen=new Set([hash(initial)]),head=0;
while(head<queue.length&&head<cap){
  const s=queue[head],path=paths[head++];
  const hit=name==='stack'?false:name==='pre3'?s.ps.some(p=>p.c>=0&&p.fork===1&&K(p.r)==='3,3'&&p.f==='A')&&
    s.ps.some(p=>p.c<0&&K(p.r)==='6,1'):s.ps.some(p=>p.k>0&&p.r[1]<=3);
  if(hit){
    console.log('KEY_TARGET',JSON.stringify({name,path,state:s,expanded:head,seen:seen.size}));
    replay(path,initial);process.exit();
  }
  if(path.length>=36)continue;
  for(const a of 'WASD'){
    const n=ordinary(s,a);if(!n)continue;
    if(n.stack){
      if(name==='stack'&&n.stackPlans.every(m=>!spike.has(K(m.r))||n.bs.some(b=>K(b)===K(m.r)))){
        console.log('FIRST_STACK_TARGET',JSON.stringify({path:path+a,pre:s,result:n,expanded:head,seen:seen.size,
          scope:'M052 first overlap only; contained stack/X behavior not simulated'}));process.exit();
      }
      continue;
    }
    if(name==='stack'){
      if(n.ps.some(p=>p.c>=0)||!n.ps.some(p=>p.fork===1))continue;
      const h=hash(n);if(seen.has(h))continue;seen.add(h);queue.push(n);paths.push(path+a);continue;
    }
    // Preserve all four boxes for the long right corridor. Retain preexisting
    // x1 box in horizontal case, but reject additional ordinary dead corners.
    if(n.bs.some(b=>b[1]===1||K(b)==='3,6'||K(b)==='5,6'||K(b)==='6,2'||
      (b[0]===1&&!initial.bs.some(q=>q[0]===1))))continue;
    if(name==='pre3'&&n.bs.some((b,i)=>spike.has(K(b))&&!n.ps.some(p=>p.c===i)))continue;
    const h=hash(n);if(seen.has(h))continue;
    seen.add(h);queue.push(n);paths.push(path+a);
  }
}
console.log('FINITE_END',JSON.stringify({name,expanded:head,seen:seen.size,queue:queue.length,cap,
  exhausted:head===queue.length,depthLimit:36,scope:name==='stack'?
    'ordinary two free actors/Fork1; three original boxes, allow x1/y1; stop at first stack; no X/conflict/ghost capture':
    'ordinary only; preserve actors/boxes; no new ghost capture/stack/conflict/X'}));
