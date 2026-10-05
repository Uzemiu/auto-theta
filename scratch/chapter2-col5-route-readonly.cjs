// One-person read-only ordinary/ICE navigation, latest actual Chapter2 world.
// No input, hints, save edit, X, push, gate change or implementation reads.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/chapter2-world.json','utf8').replace(/^\uFEFF/,''));
const obs=[{index:-1,o:raw.initial},...(raw.events||[]).map((e,index)=>({index,o:e.observation}))].reverse()
 .find(x=>x.o?.level?.id==='Chapter2'&&x.o.level.world&&x.o.level.timelines?.[0]?.tiles?.length);
if(!obs)throw Error('No complete Chapter2 world observation');
const t=obs.o.level.timelines[0],K=p=>p.join(','),v=[[0,1],[-1,0],[0,-1],[1,0]];
const terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const blocking=new Map(t.entities.filter(e=>e.active&&e.blockable).map(e=>[K(e.pos),e]));
const allowCompletedAlways=process.argv.includes('--allow-completed-always');
// Conditional world-wrap model only. Ordinary-level size+1 is verified;
// applying min_anchor and the same wrap to Chapter2 still needs live evidence.
const modelWorldWrap=process.argv.includes('--model-world-wrap');
function advance(p,d){const z=[p[0]+v[d][0],p[1]+v[d][1]];
 if(modelWorldWrap)for(let i=0;i<2;i++){const low=t.min_anchor[i],width=t.size[i]+1;z[i]=low+((z[i]-low)%width+width)%width;}
 return z;
}
const forbidden=new Set(t.entities.filter(e=>e.type==='ENTRY'&&
 (e.details.AlwaysEnable&&!allowCompletedAlways||!/^2-\d+$/.test(e.details.LinkLevel)&&!['2-X','2-Y','2-B','2-C','2-D'].includes(e.details.LinkLevel))).map(e=>K(e.pos)));
const targetArg=process.argv.indexOf('--target');
const goal=targetArg>=0?process.argv[targetArg+1]:'39,6';
if(!/^-?\d+,-?\d+$/.test(goal))throw Error('Target must be x,y');
if(targetArg>=0)forbidden.delete(goal); // Only the selected entry may end the route.
function next(p,a){let d=a;
 for(let tries=0;tries<4;tries++,d=(d+1)%4){
  const n=advance(p,d),k=K(n),e=blocking.get(k);
  // A potentially legal push cannot be simulated as a blocked fallback.
  if(e?.pushable)return null;
  if(e||!terrain.has(k))continue;
  if(forbidden.has(k)||['SPIKE','DARK'].includes(terrain.get(k)))return null;
  const travel=[n],slid=new Set([k]);let r=n;
  while(terrain.get(K(r))==='ICE'){
   const q=advance(r,d),j=K(q),b=blocking.get(j);
   if(b?.pushable)return null;
   if(b||!terrain.has(j))break;
   if(forbidden.has(j)||['SPIKE','DARK'].includes(terrain.get(j)))return null;
   if(slid.has(j))return null; // A looping ICE route is not a stable navigation stop.
   slid.add(j);
   r=q;travel.push(r);
  }
  return {p:r,travel,face:d};
 }
 return {p,travel:[],face:a};
}
const start=(process.argv[2]||'75,17').split(',').map(Number);
const replayArg=process.argv.indexOf('--replay');
if(replayArg>=0){
 let ps=[{p:start,face:2,fork:1}],trace=[];
 const path=process.argv[replayArg+1]||'';
 for(let i=0;i<path.length;i++){
  const a=path[i],born=[];
  for(const p of ps){
   if(a!=='X'){const z=next(p.p,'WASD'.indexOf(a));if(!z)throw Error('unsupported/dead step '+(i+1));born.push({...p,p:z.p,face:z.face});continue;}
   if(!p.fork){born.push(p);continue;}
   for(let d of [(p.face+1)%4,(p.face+3)%4]){
    let n=advance(p.p,d),k=K(n);
    if(blocking.has(k)||!terrain.has(k)){d=p.face;n=advance(p.p,d);k=K(n);}
    if(blocking.has(k)||!terrain.has(k))continue;
    const z=next(p.p,d);if(!z)throw Error('unsupported/dead birth '+(i+1));born.push({p:z.p,face:p.face,fork:p.fork-1});
   }
  }
  const merged=[];for(const p of born){const z=merged.find(q=>K(q.p)===K(p.p));if(z)z.fork=Math.max(z.fork,p.fork);else merged.push(p);}
  ps=merged;if([1,2,8,9,20,30,42,path.length].includes(i+1))trace.push({step:i+1,input:a,players:ps});
 }
 console.log(JSON.stringify({sourceEvent:obs.index,start,path,trace,final:ps,scope:'independent no-push/no-gate ordinary/free-X ICE replay; end-stop fusion; candidate checkpoints only'}));process.exit();
}
let q=[{p:start,path:'',trace:[]}],head=0,seen=new Set([K(start)]),hit=null;
while(head<q.length){const s=q[head++];if(K(s.p)===goal){hit=s;break;}
 for(let a=0;a<4;a++){const z=next(s.p,a);if(!z||seen.has(K(z.p)))continue;
  seen.add(K(z.p));q.push({p:z.p,path:s.path+'WASD'[a],trace:[...s.trace,{input:'WASD'[a],pos:z.p,steps:z.travel.length}]});
 }
}
console.log(JSON.stringify({sourceEvent:obs.index,start,expanded:head,seen:seen.size,exhausted:!hit&&head===q.length,
 target:goal,sourceWorld:obs.o.level.id,hit,allowCompletedAlways,modelWorldWrap,conditionalWrapBounds:modelWorldWrap?[t.min_anchor,t.min_anchor.map((n,i)=>n+t.size[i])]:undefined,scope:'fixed current blocking; no push/X/mutable gates; completed numeric entries allowed (AlwaysEnable only with explicit model flag), completed X/Y/B/C/D allowed; other letters avoided except an explicitly selected final target; world-wrap only when explicit conditional model flag is present, not live verified'}));
