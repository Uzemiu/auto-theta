// Read-only dynamic optical probe. Game inputs, implementation, and save writes absent.
// Physical movement is calibrated to actual checkpoints. COL-as-observer is NOT assumed.
const fs=require('fs');
const rec=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-21.json','utf8').replace(/^\uFEFF/,''));
const predictionSource=rec.events.findLastIndex(e=>e.observation?.frame===1264741);
const predictionBase=new Map((predictionSource>=0?rec.events[predictionSource].observation.level.timelines.find(t=>t.axis[0]===0).entities:rec.initial.level.timelines[0].entities).filter(e=>['PLAYER','PRISM'].includes(e.type)).map(e=>[e.id,e]));
const initial=rec.initial.level.timelines[0],V=[[0,1],[-1,0],[0,-1],[1,0]],K=z=>z.join(','),M=(z,d)=>[z[0]+V[d][0],z[1]+V[d][1]];
const wall=new Set(initial.entities.filter(e=>e.type==='SOLID'&&e.blockable).map(e=>K(e.pos)));
const safe=new Set([...initial.tiles.filter(e=>e.type==='SOLID'),...initial.entities.filter(e=>e.floor)].map(e=>K(e.pos)));
const floor=new Set([...initial.tiles,...initial.entities.filter(e=>e.floor)].map(e=>K(e.pos)));
const gates=[{z:[8,3],button:[6,11]},{z:[5,7],button:[5,3]}],star=[2,6],goal=[8,1];
function seed(o){const t=o.level.timelines.find(t=>t.axis[0]===0);return {time:t.time,p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,z:e.pos.slice(),f:e.properties.face,F:e.properties.split,g:e.properties.ghost})),b:t.entities.find(e=>e.type==='PRISM'&&e.active).pos.slice(),dark:new Set(t.entities.filter(e=>e.type==='DARK'&&e.active).map(e=>K(e.pos))),fork:t.entities.find(e=>e.type==='KEY').active};}
function open(s,g){return K(s.b)===K(g.z)||s.p.some(p=>K(p.z)===K(g.z))||K(s.b)===K(g.button)||s.p.some(p=>K(p.z)===K(g.button));}
function step(s,a){const plans=new Set(),np=[];let nextId=Math.max(...initial.entities.map(e=>e.id))+1;
  const blocked=z=>wall.has(K(z))||gates.some(g=>K(g.z)===K(z)&&!open(s,g));
  function can(v,d){const z=M(v.z,d);if(blocked(z)||!floor.has(K(z))||(v.g&&!s.dark.has(K(z))))return false;
    if(K(z)===K(s.b)){const dest=M(s.b,d);if(blocked(dest)||!floor.has(K(dest)))return false;}return true;}
  function land(v,d,f,id,F){const z=M(v.z,d);if(K(z)===K(s.b))plans.add(d);
    const g=Number(v.g||!safe.has(K(z)));if(g&&!s.dark.has(K(z)))return;
    if(s.fork&&K(z)==='4,1')F++;np.push({id,z,f,F,g});}
  for(const v of s.p){if(a==='X'){
      if(!v.F){np.push({...v,z:v.z.slice()});continue;}
      if(v.g)throw Error('UNKNOWN free Ghost X; actual old event15 stayed and spentFork');
      let used=false;for(const off of [1,3]){let d=(v.f+off)%4;if(!can(v,d))d=v.f;if(can(v,d)){land(v,d,v.f,used?nextId++:v.id,v.F-1);used=true;}}
      if(!used)np.push({...v,F:v.F-1,z:v.z.slice()});
    }else{const base='WASD'.indexOf(a);let ok=false;for(let off=0;off<4;off++){const d=(base+off)%4;if(can(v,d)){land(v,d,d,v.id,v.F);ok=true;break;}}if(!ok)np.push({...v,z:v.z.slice(),f:base});}}
  if(plans.size>1)throw Error('UNKNOWN force');const b=plans.size?M(s.b,[...plans][0]):s.b.slice();
  if(np.some(p=>K(p.z)===K(b)))throw Error('UNKNOWN dynamic Prism capture');
  if(new Set(np.map(p=>K(p.z))).size!==np.length)throw Error('UNKNOWN actor contact');
  if(np.some(p=>!p.g&&K(p.z)===K(goal)))throw Error('Normal level completes before optical probe');
  // No COL ray or empty Goal ray is introduced. Existing observations have allDARK active.
  return {time:s.time+1,p:np,b,dark:new Set(s.dark),fork:s.fork&&!np.some(p=>K(p.z)==='4,1')};
}
const desc=s=>({time:s.time,players:s.p.map(p=>({id:p.id,pos:p.z,face:p.f,ghost:p.g,Fork:p.F})),prism:s.b,gates:gates.map(g=>({pos:g.z,open:open(s,g)})),dark:[...s.dark].sort(),fork:s.fork,
  entityPredictions:s.p.map(p=>{const e=predictionBase.get(p.id);return e?{...e,pos:p.z,face:V[p.f],active:true,properties:{...e.properties,face:p.f,split:p.F,ghost:p.g}}:null;}).concat(predictionBase.has(74)?[{...predictionBase.get(74),pos:s.b}]:[]),predictionScope:'stable MODEL, public actual8 static fields retained; no unverified COL光/branch/GMID reassignment'});
const geometric=s=>JSON.stringify({p:s.p.map(p=>[...p.z,p.f,p.F,p.g]).sort(),b:s.b,dark:[...s.dark].sort(),fork:s.fork});
const semantic=s=>JSON.stringify({p:s.p.map(p=>[...p.z,p.F?p.f:0,p.F,p.g]).sort(),b:s.b,fork:s.fork});
const replay=(start,path)=>{let s=start,trace=[];for(const a of path){s=step(s,a);trace.push({action:a,...desc(s)});}return {s,trace};};
const successRoute='ASSWWWDXWWWDDDWDWDWDWSDAAWWWWWWADDDDSSDDDSSSSSSSSSS';
const calibration=[];let s=seed(rec.initial);
for(let i=0;i<successRoute.length;i++){try{s=step(s,successRoute[i]);}catch(e){if(i+1===53)break;throw e;}
  for(const ev of [21,23,25,27]){const o=rec.events[ev].observation;if(o.level.instructions.length===i+1)calibration.push({event:ev,frame:o.frame,step:i+1,equal:geometric(s)===geometric(seed(o)),scope:'pos/face/Fork/ghost,Prism,DARK,KEY; old child id normalized'});}
}
const actualIndex=rec.events.findLastIndex(e=>e.observation?.frame===1264741),actual=actualIndex>=0?rec.events[actualIndex].observation:null;
const initial8=replay(seed(rec.initial),'ASSWWWDX');
const actual8=actual?{event:actualIndex,frame:actual.frame,equal:geometric(initial8.s)===geometric(seed(actual))}:null;
if(calibration.some(c=>!c.equal)||actual8&&!actual8.equal)throw Error('Physical observation calibration failed '+JSON.stringify({calibration,actual8}));
const source=actual?seed(actual):initial8.s;
const wanted=[[4,8],[2,10]],md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const target=s=>K(s.b)==='3,8'&&s.p.length===2&&s.p.every(p=>p.g===1)&&wanted.every(z=>s.p.some(p=>K(p.z)===K(z)));
const h=s=>md(s.b,[3,8])*5+Math.min(md(s.p[0].z,wanted[0])+md(s.p[1].z,wanted[1]),md(s.p[1].z,wanted[0])+md(s.p[0].z,wanted[1]))+s.p.filter(p=>!p.g).length*4;
const q=[{s:source,parent:-1,a:'',g:0,f:h(source)*3}],heap=[],seen=new Set([semantic(source)]);let expanded=0,hit=-1,unknown=0;
function put(i){let k=heap.length;heap.push(i);while(k){const j=(k-1)>>1;if(q[heap[j]].f<=q[i].f)break;heap[k]=heap[j];k=j;}heap[k]=i;}
function pop(){const out=heap[0],last=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&q[heap[j+1]].f<q[heap[j]].f)j++;if(q[heap[j]].f>=q[last].f)break;heap[k]=heap[j];k=j;}heap[k]=last;}return out;}
put(0);const cap=30000;
while(heap.length&&expanded<cap){const i=pop(),s=q[i].s;expanded++;if(target(s)){hit=i;break;}
  for(const a of 'WASD'){let n;try{n=step(s,a);}catch(e){unknown++;continue;}if(n.p.length!==2)continue;
    const k=semantic(n);if(seen.has(k))continue;seen.add(k);const ni=q.length,g=q[i].g+1;q.push({s:n,parent:i,a,g,f:g+h(n)*3});put(ni);}
}
let route=null,probe=null;
if(hit>=0){route='';for(let i=hit;q[i].parent>=0;i=q[i].parent)route=q[i].a+route;
  const r=replay(source,route),afterA=step(r.s,'A');probe={setup:route,trace:r.trace,preA:desc(r.s),afterAWithoutAssumedLight:desc(afterA),unknownCOLRay:'COL2,6 north passes2,7 toPrism2,8; if actual observable light activates it, safeGhost2,9 may split; otherwise norevival',starTailIfActuallyRevived:'ASSDS'};}
// Shorten from an already observed ordinary source25; cumulative new expansions<=30k.
const knownPrefix=successRoute.slice(8,25),s25=replay(source,knownPrefix).s;
const sq=[{s:s25,parent:-1,a:''}],ss=new Set([semantic(s25)]);let sexp=0,shit=-1,sunknown=0;
for(let i=0;i<sq.length&&sexp<cap-expanded;i++){sexp++;const s=sq[i].s;if(target(s)){shit=i;break;}
  for(const a of 'WASD'){let n;try{n=step(s,a);}catch(e){sunknown++;continue;}if(n.p.length!==2||n.b[0]===2)continue;
    const k=semantic(n);if(ss.has(k))continue;ss.add(k);sq.push({s:n,parent:i,a});}
}
let shorter=null;if(shit>=0){let tail='';for(let i=shit;sq[i].parent>=0;i=sq[i].parent)tail=sq[i].a+tail;
  const setup=knownPrefix+tail,r=replay(source,setup);shorter={prefixToOld25:knownPrefix,tailFrom25:tail,setup,trace:r.trace,preA:desc(r.s),afterAWithoutAssumedLight:desc(step(r.s,'A'))};}
const observed37Index=rec.events.findLastIndex(e=>e.observation?.frame===1442933);
const observed37=observed37Index>=0?rec.events[observed37Index].observation:null;
let postProbe=null;
if(observed37){const s37=seed(observed37),s38=step(s37,'S'),s39=step(s38,'S');
  postProbe={actual37:{event:observed37Index,frame:observed37.frame,equalPhysicalModel:geometric(s37)===geometric(step(replay(source,shorter.setup).s,'A')),state:desc(s37),prismDetails:observed37.level.timelines[0].entities.find(e=>e.type==='PRISM').details},
    standard38:desc(s38),conservative39:desc(s39),unknown39:'Historical discriminator: Ghost95 S destination2,7 is outside DARK. Request-before-refusal would advance Prism2,7→2,6/COL; the model rejects the request before pushing. Actual39 below tests this fixture; COL-on-Prism is still unobserved.'};}
if(postProbe){for(const [time,frame] of [[38,1510904],[39,1514885]]){
  const i=rec.events.findLastIndex(e=>e.observation?.frame===frame);if(i<0)continue;
  const o=rec.events[i].observation,ss=seed(o),prediction=time===38?step(seed(observed37),'S'):step(step(seed(observed37),'S'),'S');
  postProbe['actual'+time]={event:i,frame,equalPhysicalModel:geometric(ss)===geometric(prediction),state:desc(ss),prismDetails:o.level.timelines[0].entities.find(e=>e.type==='PRISM').details};
  if(time===39)postProbe.current39Closure={navigableDark:[...ss.dark].filter(k=>!wall.has(k)).sort(),prism:[2,7],onlyDarkAdjacentPushPosition:[2,8],rejectedDirection:'S',scope:'Current39 only: two free ghost1/Fork0 players cannot reach the three other Prism-adjacent positions outside DARK, and the sole DARK-adjacent S push was actually rejected. No further ordinary WASD Prism transport or COL reach from this state; other fresh live/cargo prefixes remain open.'};
}}
console.log(JSON.stringify({scope:'dynamic public physics, twoGhost+onePrism; unknown COL observation source tested, never assumed in search',actual8,calibration,source:desc(source),budget:cap,expanded,seen:seen.size,pending:heap.length,unknownCuts:unknown,found:hit>=0,probe,shorterSearch:{source25:desc(s25),expanded:sexp,seen:ss.size,pending:sq.length-sexp,unknownCuts:sunknown,budget:cap-expanded,probe:shorter},postProbe,totalExpanded:expanded+sexp,structuralWalls:[[7,9],[7,8],[7,10],[2,11],[6,10],[6,12],[7,11]].map(pos=>({pos,wall:wall.has(K(pos))})),limits:['No emptyGoal light assumed.','Actual37 rules out only aligned COL2,6/Prism2,8 light activation.','COL/Prism same-cell observation and Prism-before-Ghost-refusal push ordering remain unknown.','No actor-contact/cargo/force/freeGhostX simulated.','MODEL setup is not actual star credit; owner must inspect flags/DARK/ghost at the terminal probe.']}));
