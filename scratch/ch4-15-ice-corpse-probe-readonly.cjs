// Read-only NEW mixed-fork pre-X resource predicate. No game/save/KB APIs.
// Ordinary prefix only; the unknown second-ICE-tick capture is never accepted.
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('scratch/ch4-15-readonly.cjs','utf8'),ctx={require,process:{argv:[]},console,module:{exports:{}}};
const patched=src.slice(0,src.indexOf("if(process.argv[2]==='replay')"))
 .replace(')),p=[];', ')),p=[],rem=s.rem.slice();')
 .replace('let r=c>=0?b[c].r:a.r;if(c<0', 'let r=c>=0?b[c].r:a.r;let ri=rem.indexOf(key(r));if(ri>=0){a={...a,fork:a.fork+1};rem.splice(ri,1);}if(c<0')
 .replace('let rem=s.rem.slice();for(let a of p)', 'for(let a of p)');
vm.runInNewContext(patched+'\nmodule.exports={initial,step,replay,wall,spike,ice};',ctx);
const {initial,step,replay}=ctx.module.exports,K=p=>p.join(','),at=(a,b)=>K(a)===K(b);
const prefix='AAAWX',start=replay(prefix,initial,true),cap=5000,depthLimit=40;
const target=s=>at(s.b[0].r,[4,6])&&at(s.b[1].r,[4,3])&&s.rem.includes('4,6')&&!s.rem.includes('4,5')&&
 s.p.length===2&&s.p.some(p=>p.c<0&&p.fork===0&&at(p.r,[3,6]))&&s.p.some(p=>p.c<0&&p.fork===1&&p.f==='A'&&at(p.r,[4,2]));
const hypothetical={b:[{r:[4,6],color:4},{r:[4,3],color:3}],p:[{r:[3,6],f:'W',fork:0,c:-1,ghost:0},{r:[4,2],f:'A',fork:1,c:-1,ghost:0}],rem:['4,6']};
function condition(){const x=step(hypothetical,'X'),d=x&&step(x,'D');return{pre:hypothetical,afterX:x,afterDWithoutCorpseCapture:d,unknown:'D main tick: receiver dies/picks last fork4,6 while Blue reachesICE4,5. D continuation: Blue reaches4,6. Model removes dead receiver before continuation; no claim of rescue.'};}
const hash=s=>s.b.map(b=>K(b.r)).join('|')+'#'+s.p.map(p=>[...p.r,p.fork,p.fork?p.f:''].join(',')).sort().join('|')+'#'+s.rem.join('|');
const q=[{s:start,path:''}],seen=new Set([hash(start)]);let head=0,hit=null,transitions=0;
while(head<q.length&&head<cap){const {s,path}=q[head++];if(target(s)){hit={tail:path,full:prefix+path,state:s,probe:'XD'};break;}
 if(path.length>=depthLimit)continue;
 for(const a of 'WASD'){transitions++;const n=step(s,a);if(!n||n.p.length!==2||n.p.some(p=>p.c>=0||p.ghost||p.fork>1)||!n.rem.includes('4,6')||n.b.some(b=>b.r[1]<=1))continue;
  const h=hash(n);if(seen.has(h))continue;seen.add(h);q.push({s:n,path:path+a});}
}
const result={prefix,cap,expanded:head,seen:seen.size,pending:q.length-head,depthLimit,exhausted:!hit&&head===q.length,transitions,hit,condition:condition(),scope:'early first fork spent; two live free, zero/one remaining safe fork; ordinary deployment only; no cargo/ghost/stack/conflict/X continuation before target; row1 boxes excluded; last4,6 fork preserved'};
function searchBudget(){
 const hashBudget=s=>s.b.map(b=>K(b.r)).join('|')+'#'+s.p.map(p=>[...p.r,p.c,p.fork,p.ghost].join(',')).sort().join('|')+'#'+s.rem.join('|');
 const qq=[{s:start,path:''}],ss=new Set([hashBudget(start)]),capBudget=20000;let i=0,hitBudget=null,transitionsBudget=0,depthCut=0;
 while(i<qq.length&&i<capBudget){const {s,path}=qq[i++];
  if(s.p.some(p=>p.c>=0&&p.fork>=1&&!p.ghost)&&s.p.some(p=>p.c<0&&p.fork>=1&&!p.ghost)){hitBudget={tail:path,full:prefix+path,state:s};break;}
  if(path.length>=40){depthCut++;continue;}
  for(const a of 'WASD'){transitionsBudget++;const n=step(s,a);if(!n||n.p.length!==2||n.p.some(p=>p.ghost)||n.b.some(b=>b.r[1]<=1)||n.p.reduce((v,p)=>v+p.fork,0)+n.rem.length<2)continue;
   const k=hashBudget(n);if(ss.has(k))continue;ss.add(k);qq.push({s:n,path:path+a});}
 }
 return{prefix,cap:capBudget,expanded:i,seen:ss.size,pending:qq.length-i,depthLimit:40,depthCut,exhausted:!hitBudget&&i===qq.length,transitions:transitionsBudget,hit:hitBudget,scope:'NEW early first-fork-X ordinary any-color LIVEcargo>=1 plus LIVEoutside>=1; cargo0 propagated; two live retained, no ghost/conflict/stack, no y1 box; further free-X consumes required fork allocation, cargo-X/unknown release excluded'};
}
if(require.main===module)console.log(JSON.stringify(process.argv[2]==='budget'?searchBudget():result,null,2));
module.exports={initial,step,replay,start,target,hypothetical,condition,result,searchBudget};
