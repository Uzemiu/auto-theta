// Read-only candidate model. No game calls, implementation reads, or saved state writes.
// Covers free actors, the observed ghost DARK boundary, row9/10 prisms, source light.
// Stops on capture, superposition, or simultaneous disagreeing pushes.
const fs = require('fs');
const record = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-27.json', 'utf8').replace(/^\uFEFF/, ''));
const initial = record.initial.level.timelines[0];
const dirs = [[0,1],[-1,0],[0,-1],[1,0]], chars = 'WASD';
const xy = p => p.join(',');
const wall = new Set(initial.entities.filter(e=>e.type==='SOLID').map(e=>xy(e.pos)));
const spike = new Set(initial.tiles.filter(e=>e.type==='SPIKE').map(e=>xy(e.pos)));
const goals = new Set(record.initial.level.goals.map(xy));
function seed(o, axis=0) {
  const t=o.level.timelines.find(t=>t.axis[0]===axis);
  return {time:t.time, p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,z:e.pos.slice(),f:e.properties.face,g:e.properties.ghost,split:e.properties.split})),
    b:t.entities.filter(e=>e.type==='PRISM'&&e.active).map(e=>({id:e.id,z:e.pos.slice()})),
    dark:new Set(t.entities.filter(e=>e.type==='DARK'&&e.active).map(e=>xy(e.pos))),
    fork:t.entities.some(e=>e.type==='KEY'&&e.active)};
}
const move = (z,d) => [z[0]+dirs[d][0],z[1]+dirs[d][1]];
function illumination(boxes) {
  // Goal light is sourced by a prism on a Goal, not an unoccupied Goal.
  const q=boxes.filter(b=>goals.has(xy(b.z))).map(b=>b.z), seen=new Set(), lit=new Set();
  for(let i=0;i<q.length;i++) {
    const origin=q[i]; if(seen.has(xy(origin))) continue; seen.add(xy(origin));
    for(let d=0;d<4;d++) {
      let z=move(origin,d);
      while(!wall.has(xy(z))) {
        lit.add(xy(z)); const b=boxes.find(b=>xy(b.z)===xy(z));
        if(b){q.push(b.z);break;} z=move(z,d);
      }
    }
  }
  return lit;
}
function step(s,a) {
  let nextId=Math.max(...s.p.map(p=>p.id),58)+1;
  const plans=new Map(), p=[], bypos=z=>s.b.find(b=>xy(b.z)===xy(z));
  function chain(z,d) {
    const out=[];
    while(bypos(z)){const b=bypos(z);out.push(b);z=move(z,d);}
    return wall.has(xy(z))?null:out;
  }
  function can(v,d) {
    const z=move(v.z,d);
    if(wall.has(xy(z)) || (v.g&&!s.dark.has(xy(z))))return false;
    return chain(z,d)!==null;
  }
  function land(v,d,face,id,split) {
    const z=move(v.z,d), ch=chain(z,d);
    for(const b of ch) {
      if(plans.has(b.id)&&plans.get(b.id)!==d)throw Error('UNKNOWN simultaneous disagreeing push');
      plans.set(b.id,d);
    }
    let g=v.g || spike.has(xy(z));
    if(g&&!s.dark.has(xy(z)))return;
    if(s.fork&&xy(z)==='7,6')split++;
    p.push({id,z,f:face,g:Number(g),split});
  }
  for(const v of s.p) {
    if(a==='X') {
      if(!v.split){p.push({...v,z:v.z.slice()});continue;}
      let used=false;
      for(const off of [1,3]) {
        let d=(v.f+off)%4; if(!can(v,d)) d=v.f;
        if(can(v,d)){land(v,d,v.f,used?nextId++:v.id,v.split-1);used=true;}
      }
      if(!used)p.push({...v,z:v.z.slice(),split:v.split-1});
    } else {
      const d0=chars.indexOf(a);
      let found=false;
      for(let off=0;off<4;off++) {const d=(d0+off)%4;if(can(v,d)){land(v,d,d,v.id,v.split);found=true;break;}}
      if(!found)p.push({...v,z:v.z.slice(),f:d0});
    }
  }
  const b=s.b.map(b=>({id:b.id,z:plans.has(b.id)?move(b.z,plans.get(b.id)):b.z.slice()}));
  if(new Set(b.map(b=>xy(b.z))).size!==b.length)throw Error('UNKNOWN prism superposition');
  if(p.some(p=>b.some(b=>xy(p.z)===xy(b.z))))throw Error('UNKNOWN prism capture');
  if(new Set(p.map(p=>xy(p.z))).size!==p.length)throw Error('UNKNOWN actor merge');
  const lit=illumination(b), dark=new Set([...s.dark].filter(z=>!lit.has(z)));
  const revival=p.filter(p=>p.g&&lit.has(xy(p.z))).map(p=>p.id);
  for(const v of p)if(revival.includes(v.id))v.g=0;
  return {time:s.time+1,p,b,dark,fork:s.fork&&!p.some(p=>xy(p.z)==='7,6'),revival};
}
const compact=s=>({time:s.time,players:s.p.map(p=>({id:p.id,pos:p.z,face:p.f,ghost:p.g,split:p.split})),prisms:s.b.map(b=>({id:b.id,pos:b.z})),dark:[...s.dark].sort(),fork:s.fork});
const canonical=s=>JSON.stringify({p:s.p.map(p=>[p.id,...p.z,p.f,p.g,p.split]).sort((a,b)=>a[0]-b[0]),b:s.b.map(b=>[b.id,...b.z]).sort((a,b)=>a[0]-b[0]),dark:[...s.dark].sort(),fork:s.fork,time:s.time});
function replay(route, checkpoints=[]) {
  let s=seed(record.initial);const trace=[],match=[];
  for(const a of route){s=step(s,a);trace.push({action:a,...compact(s),revival:s.revival});
    for(const [time,event] of checkpoints)if(s.time===time)match.push({time,event,equal:canonical(s)===canonical(seed(record.events[event].observation))});
  }
  return {s,trace,match};
}
const old=replay('DDWAASSAXWWAWWDDDDSSSDDAWDWW',[[9,1],[14,3],[15,5],[28,9]]);
if(old.match.some(m=>!m.equal))throw Error('Known observation calibration failed: '+JSON.stringify(old.match));
const route='DDWAWWWDSSSSSAAAXWWAWWD', fresh=replay(route);
// Recoverable row9 alternative: X pushes the two initial prisms out in one frame,
// avoiding the transient7,9 source hitting the old4,9 relay.
const outwardRoute='DDWAAWWWX', outward=replay(outwardRoute);
const semantic=s=>JSON.stringify({p:s.p.map(p=>[p.id,...p.z,p.g,p.split]).sort((a,b)=>a[0]-b[0]),b:s.b.map(b=>[b.id,...b.z]).sort((a,b)=>a[0]-b[0]),dark:[...s.dark].sort(),fork:s.fork});
const rq=[{s:outward.s,parent:-1,a:''}], rseen=new Set([semantic(rq[0].s)]);
let rhit=-1,rexpanded=0,runknown=0;
for(let at=0;at<rq.length&&rexpanded<30000;at++) {
  rexpanded++;const s=rq[at].s;
  if(xy(s.b.find(b=>b.id===50).z)==='8,9'&&xy(s.b.find(b=>b.id===51).z)==='4,9'&&s.p.some(p=>p.g&&xy(p.z)==='4,2')&&s.p.some(p=>!p.g&&xy(p.z)==='3,9')){rhit=at;break;}
  for(const a of chars){let n;try{n=step(s,a);}catch(e){runknown++;continue;}
    if(n.p.length!==2||n.p.every(p=>p.g)||n.dark.size!==6||n.b.some(b=>b.z[1]!==9))continue;
    const k=semantic(n);if(rseen.has(k))continue;rseen.add(k);rq.push({s:n,parent:at,a});
  }
}
let recoverableRoute=null,recoverableProbe=null;
if(rhit>=0){recoverableRoute='';for(let i=rhit;rq[i].parent>=0;i=rq[i].parent)recoverableRoute=rq[i].a+recoverableRoute;
  recoverableProbe={freshPrefix:outwardRoute,afterOutwardX:compact(outward.s),setup:recoverableRoute,nextSingle:compact(step(rq[0].s,recoverableRoute[0])),preLight:compact(rq[rhit].s),lastSingle:{...compact(step(rq[rhit].s,'D')),revival:step(rq[rhit].s,'D').revival}};}
function phase(start,budget,target,allowedDark,allowedBox) {
  const q=[{s:start,parent:-1,a:''}],seen=new Set([semantic(start)]);let expanded=0,hit=-1,unknown=0;
  for(let at=0;at<q.length&&expanded<budget;at++){
    expanded++;const s=q[at].s;if(target(s)){hit=at;break;}
    for(const a of chars){let n;try{n=step(s,a);}catch(e){unknown++;continue;}
      if(n.p.length!==2||n.p.every(p=>p.g)||n.b.some(b=>b.z[1]!==9)||[...n.dark].sort().join(';')!==allowedDark||!allowedBox(n))continue;
      const k=semantic(n);if(seen.has(k))continue;seen.add(k);q.push({s:n,parent:at,a});
    }
  }
  let route=null;if(hit>=0){route='';for(let i=hit;q[i].parent>=0;i=q[i].parent)route=q[i].a+route;}
  const trace=[];if(route){let s=start;for(const a of route){s=step(s,a);trace.push({action:a,...compact(s)});}}
  return {expanded,seen:seen.size,pending:q.length-expanded,budget,unknownCuts:unknown,route,trace,s:hit>=0?q[hit].s:null,nextSingle:route?compact(step(start,route[0])):null};
}
function forcePrefix(start,budget) {
  const wantedP=new Map([[52,[8,8]],[59,[9,9]]]),wantedB=new Map([[50,[9,10]],[51,[8,9]]]);
  const man=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
  const h=s=>s.p.reduce((n,p)=>n+man(p.z,wantedP.get(p.id)),0)+s.b.reduce((n,b)=>n+2*man(b.z,wantedB.get(b.id)),0);
  const target=s=>s.p.every(p=>xy(p.z)===xy(wantedP.get(p.id)))&&s.b.every(b=>xy(b.z)===xy(wantedB.get(b.id)));
  const q=[{s:start,g:0,parent:-1,a:''}],best=new Map([[semantic(start),0]]),heap=[];
  function put(x){let i=heap.length;heap.push(x);while(i){const j=(i-1)>>1;if(heap[j][0]<=x[0])break;heap[i]=heap[j];i=j;}heap[i]=x;}
  function pop(){const out=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1][0]<heap[j][0])j++;if(heap[j][0]>=last[0])break;heap[i]=heap[j];i=j;}heap[i]=last;}return out[1];}
  put([h(start),0]);let expanded=0,unknown=0,hit=-1;
  while(heap.length&&expanded<budget){const at=pop(),node=q[at],s=node.s;if(best.get(semantic(s))!==node.g)continue;expanded++;
    if(target(s)){hit=at;break;}
    for(const a of chars){let n;try{n=step(s,a);}catch(e){unknown++;continue;}
      if(n.p.length!==2||n.p.some(p=>p.g)||n.b.some(b=>![9,10].includes(b.z[1])))continue;
      const k=semantic(n),g=node.g+1;if(best.has(k)&&best.get(k)<=g)continue;best.set(k,g);q.push({s:n,g,parent:at,a});put([g+h(n),q.length-1]);
    }
  }
  let route=null;if(hit>=0){route='';for(let i=hit;q[i].parent>=0;i=q[i].parent)route=q[i].a+route;}
  const trace=[];if(route){let s=start;for(const a of route){s=step(s,a);trace.push({action:a,...compact(s)});}}
  return {method:'bounded weighted A*; short candidate, not minimality proof',expanded,seen:best.size,pending:heap.length,budget,unknownCuts:unknown,route,trace,preForce:hit>=0?compact(q[hit].s):null};
}
let second=null,third=null;
let force=null,actual31=null,leafTails=null;
function onlyActor(s,id){return {...s,p:s.p.filter(p=>p.id===id).map(p=>({...p,z:p.z.slice()})),b:s.b.map(b=>({...b,z:b.z.slice()})),dark:new Set(s.dark)};}
function safeTail(s,route,goal){const trace=[];for(const a of route){s=step(s,a);if(s.p.length!==1||s.p[0].g)throw Error('Unsafe single-leaf tail');trace.push({action:a,...compact(s)});}if(xy(s.p[0].z)!==xy(goal))throw Error('Wrong single-leaf Goal');return {route,trace,goal,final:compact(s)};}
if(rhit>=0) {
  const firstLive=step(rq[rhit].s,'D');
  const event=record.events.findLastIndex(e=>e.observation?.frame===607320);
  if(event>=0)actual31={event,frame:607320,axis:[0,0,0],equal:canonical(firstLive)===canonical(seed(record.events[event].observation))};
  second=phase(firstLive,30000-rexpanded,
    s=>xy(s.b.find(b=>b.id===51).z)==='3,9'&&xy(s.b.find(b=>b.id===50).z)==='7,9'&&s.p.some(p=>p.g&&xy(p.z)==='6,3')&&s.p.some(p=>!p.g&&xy(p.z)==='8,9'),
    '4,2;4,3;6,2;6,3',s=>['3,9','4,9','5,9'].includes(xy(s.b.find(b=>b.id===51).z))&&['7,9','8,9'].includes(xy(s.b.find(b=>b.id===50).z)));
  if(second.s){second.preLight=compact(second.s);second.postLight=compact(step(second.s,'A'));second.revival=step(second.s,'A').revival;
    const after2=step(second.s,'A');
    third=phase(after2,Math.max(0,30000-rexpanded-second.expanded),
      s=>xy(s.b.find(b=>b.id===51).z)==='3,9'&&xy(s.b.find(b=>b.id===50).z)==='5,9'&&s.p.some(p=>p.g&&xy(p.z)==='4,3')&&s.p.some(p=>!p.g&&xy(p.z)==='6,9'),
      '4,2;4,3',s=>xy(s.b.find(b=>b.id===51).z)==='3,9'&&['5,9','6,9'].includes(xy(s.b.find(b=>b.id===50).z)));
    if(third.s){third.preLight=compact(third.s);third.postLight=compact(step(third.s,'A'));third.revival=step(third.s,'A').revival;
      force=forcePrefix(step(third.s,'A'),Math.max(0,30000-rexpanded-second.expanded-third.expanded));
      if(force.route){let f=step(third.s,'A');for(const a of force.route)f=step(f,a);
        const fixture=seed(record.events[9].observation),pb=s=>JSON.stringify({p:s.p.map(p=>[p.id,...p.z,p.f,p.g,p.split]).sort((a,b)=>a[0]-b[0]),b:s.b.map(b=>[b.id,...b.z]).sort((a,b)=>a[0]-b[0])});
        force.observedFixture={event:9,frame:record.events[9].observation.frame,time:28,playersAndPrismFieldsEqual:pb(f)===pb(fixture)};
        const winW=onlyActor(f,52),winA=onlyActor(f,59);winW.time++;winA.time++;
        winW.p[0].z=[8,9];winW.p[0].f=0;winW.b.find(b=>b.id===51).z=[8,10];
        winA.p[0].z=[8,9];winA.p[0].f=1;winA.b.find(b=>b.id===51).z=[7,9];
        force.borrowedPostForce={basis:'3-27 observed event9->11 known force; not actual new85',winW:compact(winW),winA:compact(winA)};
        leafTails={basis:'five MODEL leaf positions; no actual completion claim',deadFirst5:safeTail(onlyActor(firstLive,59),'D',[5,9]),deadSecond6:safeTail(onlyActor(step(second.s,'A'),59),'AAAA',[3,9]),deadThird4:safeTail(onlyActor(step(third.s,'A'),59),'DD',[7,9]),forceW:safeTail(winW,'AAAAAAA',[1,9]),forceA:safeTail(winA,'D',[9,9])};
      }
    }
  }
}
if(second)delete second.s;if(third)delete third.s;
// New bounded domain, not the old horizontal search: raise only relay50 to6,10.
const q=[{s:seed(record.events[3].observation),parent:-1,a:''}], seen=new Set([canonical(q[0].s).replace(/,"time":\d+}/,'}')]);
let hit=-1, expanded=0, unknownCuts=0;
for(let at=0;at<q.length&&expanded<4000;at++) {
  expanded++;const s=q[at].s;
  if(s.b.find(b=>b.id===50).z[1]===10&&s.p.some(p=>p.g&&xy(p.z)==='4,2')&&s.p.some(p=>!p.g&&xy(p.z)==='3,9')){hit=at;break;}
  for(const a of chars){let n;try{n=step(s,a);}catch(e){unknownCuts++;continue;}
    if(n.p.length!==2||n.p.filter(p=>p.g).length!==1||n.dark.size!==6||xy(n.b.find(b=>b.id===51).z)!=='4,9'||!['6,9','6,10'].includes(xy(n.b.find(b=>b.id===50).z)))continue;
    const k=canonical(n).replace(/,"time":\d+}/,'}');if(seen.has(k))continue;seen.add(k);q.push({s:n,parent:at,a});
  }
}
let shortRoute=null, shortProbe=null;
if(hit>=0){shortRoute='';for(let i=hit;q[i].parent>=0;i=q[i].parent)shortRoute=q[i].a+shortRoute;shortProbe={setup:shortRoute,nextSingle:compact(step(q[0].s,shortRoute[0])),preLight:compact(q[hit].s),lastSingle:{...compact(step(q[hit].s,'D')),revival:step(q[hit].s,'D').revival}};}
// Finite row9/10 geometry: 5 possible source Prisms times 17 second positions.
// Without a direct actor on the source Goal, a naked north SPIKE ray requires a
// row10 observer or relay. The most generous relay carries one safe observer;
// the source still needs separate south and horizontal observers (>=3 total).
const positions=[];for(let y=9;y<=10;y++)for(let x=1;x<=9;x++)positions.push([x,y]);
const profiles=[];
for(const goal of record.initial.level.goals)for(const other of positions) {
  if(xy(other)===xy(goal))continue;
  const northRelay=other[0]===goal[0]&&other[1]===10;
  const remainingRays=(goal[0]>1?1:0)+(goal[0]<9?1:0)+1;
  profiles.push({source:goal,other,northRelay,reason:northRelay?'even protected north cargo needs '+(1+remainingRays)+' observers total':'north SPIKE ray has no relay or safe free observer'});
}
console.log(JSON.stringify({mode:'readonly-bounded-model; not actual completion',source:{event:'initial',frame:record.initial.frame,axis:initial.axis,instructions:record.initial.level.instructions},
  knownCalibration:old.match,opticalProfiles:{count:profiles.length,uncoveredNorth:profiles.filter(p=>!p.northRelay).length,protectedRelayStillNeedsAtLeast3:profiles.filter(p=>p.northRelay).length},
  recoverableFirst5:{expanded:rexpanded,seen:rseen.size,pending:rq.length-rexpanded,budget:30000,unknownCuts:runknown,probe:recoverableProbe},
  secondRecoverable6:second,thirdRecoverable4:third,
  actual31SelectedFields:actual31,finalForcePrefix:force,newExpandedTotal:rexpanded+(second?.expanded||0)+(third?.expanded||0)+(force?.expanded||0),
  fiveLeafSafeTails:leafTails,
  shorterFromActual14:{source:{event:3,frame:record.events[3].observation.frame,axis:[0,0,0],instructions:record.events[3].observation.level.instructions,time:14},expanded,seen:seen.size,pending:q.length-expanded,budget:4000,unknownCuts,probe:shortProbe},
  candidate:{route,inputs:route.length,nextSingle:fresh.trace[0],preSplit:fresh.trace[15],afterSplit:fresh.trace[16],preLight:fresh.trace.at(-2),afterLight:fresh.trace.at(-1)},
  limits:['No capture/superposition/merge or game inputs.','Source-light and optical branch inference is calibrated only to the listed observed frames.','A successful single-column revival is a mechanism probe; it does not give a 5-Goal solution.','The discarded row10 Prism cannot be retrieved by this free/Fork0 model.']}));
