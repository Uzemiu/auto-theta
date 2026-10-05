// Candidate-only model of observed ice maps. No game input or hidden solution reads.
// Rejects boxing, perpendicular inertia interactions and worldline conflicts.
const fs=require('fs'),r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''));
const cfg=JSON.parse(process.argv[3]?.startsWith('@')?fs.readFileSync(process.argv[3].slice(1),'utf8'):(process.argv[3]||'{}')),o=cfg.observation_event!==undefined?r.events[cfg.observation_event].observation:cfg.initial?r.initial:r.events.filter(e=>e.observation).at(-1).observation,t=cfg.timeline_index!==undefined?o.level.timelines[cfg.timeline_index]:(o.level.timelines.find(t=>t.id===(cfg.timeline??o.level.current_timeline))||o.level.timelines[0]);
const xy=p=>p.slice(0,2).join(','),dirs=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>o.level.world?[p[0]+dirs[d][0],p[1]+dirs[d][1]]:[(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
const ents=t.entities.filter(e=>e.active),walls=new Set(ents.filter(e=>e.blockable&&!['BOX','BUTTONGATE','LOCK'].includes(e.type)).map(e=>xy(e.pos))),locks=ents.filter(e=>e.type==='LOCK'),items=ents.filter(e=>e.type==='KEY');
const ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>xy(e.pos))),floor=new Set([...t.tiles.filter(e=>['SOLID','ICE'].includes(e.type)),...ents.filter(e=>e.floor)].map(e=>xy(e.pos))),bf=new Set([...t.tiles,...ents.filter(e=>e.floor)].map(e=>xy(e.pos)));
const gates=cfg.gates||[];if(ents.some(e=>e.type==='BUTTONGATE'&&!gates.some(g=>xy(g.at)===xy(e.pos))))throw Error('Explicit gate mapping required');
let start={p:ents.filter(e=>e.type==='PLAYER').map(e=>[...e.pos,e.properties.face,e.properties.split,e.properties.key]),b:ents.filter(e=>e.type==='BOX').map(e=>e.pos),c:0,l:0};
const serial=s=>s.p.map(p=>p.join(',')).sort().join(';')+'|'+s.b.map(xy).sort().join(';')+'|'+s.c+'|'+s.l+(s.conflict?'|conflict':'');
function next(st,a){
 let p=st.p.map(v=>[...v,-1]),b=st.b.map(v=>[...v,-1]),c=st.c,l=st.l;
 for(let tick=0;tick<150;tick++){
  const oldp=p,oldb=b,plans=new Map(),cancels=new Set();let invalid=false,conflict=null;
  const bi=z=>oldb.findIndex(v=>xy(v)===xy(z));
  const li=z=>locks.findIndex((e,i)=>!(l&(1<<i))&&xy(e.pos)===xy(z));
  const blocked=z=>walls.has(xy(z))||gates.some(g=>xy(g.at)===xy(z)&&![...oldp,...oldb].some(v=>xy(v)===xy(g.at)||g.buttons.some(q=>xy(q)===xy(v))));
  function chain(i,d){let out=[];while(i>=0){if(out.includes(i))return null;out.push(i);const z=mv(oldb[i],d);if(blocked(z)||li(z)>=0||!bf.has(xy(z)))return null;i=bi(z);}return out;}
  const can=(v,d)=>{const z=mv(v,d);if(blocked(z)||(li(z)>=0&&!v[4]))return false;const i=bi(z);return i<0||!!chain(i,d);};
  function push(i,d,actor){
   if(actor&&oldb[i][2]>=0&&(oldb[i][2]+2)%4===d){cancels.add(i);return false;}
   if(actor&&oldb[i][2]>=0&&oldb[i][2]!==d){invalid=true;return false;}
   const ch=chain(i,d);if(!ch)return false;
   ch.forEach((j,k)=>{const prev=plans.get(j);if(prev&&prev.d!==d){invalid=true;if(prev.actor&&actor)conflict={box:oldb[j].slice(0,2),tick,directions:[prev.d,d]};}plans.set(j,{d,tail:k===ch.length-1,actor});});return true;
  }
  function land(v,d,face,split,key){const z=mv(v,d),i=bi(z);if(!bf.has(xy(z))){invalid=true;return null;}
   if(i>=0&&!push(i,d,true))return [...v.slice(0,2),face,split,key,-1];
   const lock=li(z);if(lock>=0){l|=1<<lock;key--;}
   items.forEach((e,j)=>{if(!(c&(1<<j))&&xy(e.pos)===xy(z)){c|=1<<j;if(e.details.isFork)split++;else key++;}});
   return [...z,face,split,key,i>=0||lock>=0?-1:(ice.has(xy(z))?d:-1)];
  }
  let np=[];
  for(const v of oldp){
   if(tick){if(v[5]<0||!can(v,v[5]))np.push([...v.slice(0,5),-1]);else{const q=land(v,v[5],v[2],v[3],v[4]);if(q)np.push(q);}}
   else if(a===4){if(!v[3]){np.push([...v.slice(0,5),-1]);continue;}const before=np.length;for(const off of [1,3]){let d=(v[2]+off)%4;if(!can(v,d))d=v[2];if(can(v,d)){const q=land(v,d,v[2],v[3]-1,v[4]);if(q)np.push(q);}}if(np.length===before)np.push([v[0],v[1],v[2],v[3]-1,v[4],-1]);}
   else{let moved=false;for(let n=0;n<4;n++){const d=(a+n)%4;if(!can(v,d))continue;const q=land(v,d,d,v[3],v[4]);if(q)np.push(q);moved=true;break;}if(!moved)np.push([...v.slice(0,5),-1]);}
  }
  for(let i=0;i<oldb.length;i++)if(oldb[i][2]>=0&&!cancels.has(i)&&!plans.has(i))push(i,oldb[i][2],false);
  if(invalid)return cfg.find_conflict&&conflict&&xy(conflict.box)==='4,5'&&conflict.directions.includes(2)&&conflict.directions.includes(1)?{...st,conflict}:null;
  const nb=oldb.map((v,i)=>{const plan=plans.get(i);if(!plan||cancels.has(i))return [...v.slice(0,2),-1];const z=mv(v,plan.d);return [...z,plan.tail&&ice.has(xy(z))?plan.d:-1];});
  if(new Set(nb.map(xy)).size!==nb.length)return null;
  const captured=np.find(v=>v[3]>0&&nb.some(q=>xy(q)===xy(v)));
  if(captured) return {p:np.map(v=>v.slice(0,5)),b:nb.map(v=>v.slice(0,2)),c,l,captured:captured.slice(0,5)};
  if(np.some(v=>nb.some(q=>xy(v)===xy(q))))return null;
  np=np.filter(v=>floor.has(xy(v)));
  if(!np.length)return null;
  p=[];for(const v of np){const q=p.find(q=>xy(q)===xy(v)&&(cfg.merge_stable_only?(q[5]<0&&v[5]<0):q[2]===v[2]));if(q){q[3]=Math.max(q[3],v[3]);q[4]=Math.max(q[4],v[4]);}else p.push(v);}b=nb;
  if(!p.some(v=>v[5]>=0)&&!b.some(v=>v[2]>=0))return {p:p.map(v=>v.slice(0,5)),b:b.map(v=>v.slice(0,2)),c,l};
 }return null;
}
if(cfg.prefix)for(const a of cfg.prefix){start=next(start,'WASDX'.indexOf(a));if(!start)throw Error('Prefix model rejected');}
if(cfg.dump_start){console.log(JSON.stringify(start));process.exit();}
if(cfg.replay){let s=start,trace=[];for(const a of cfg.replay){s=next(s,'WASDX'.indexOf(a));trace.push(s);if(!s)break;}console.log(JSON.stringify({trace}));process.exit();}
const q=[[start,-1,-1]],seen=new Set([serial(start)]);let end=-1;
const success=s=>!!s.captured;
for(let i=0;i<q.length&&i<(cfg.max_states||50000);i++){const s=q[i][0];if(success(s)){end=i;break;}for(let a=0;a<(cfg.no_split?4:5);a++){const n=next(s,a);if(!n||n.p.length>(cfg.max_players||2))continue;const k=serial(n);if(!seen.has(k)){seen.add(k);q.push([n,i,a]);}}}
let actions=null,trace=[];if(end>=0){actions=[];for(let i=end;q[i][1]>=0;i=q[i][1]){actions.push('WASDX'[q[i][2]]);trace.push(q[i][0]);}actions=actions.reverse().join('');trace.reverse();}
console.log(JSON.stringify({model:'unverified-fork-capture-ice-candidate',states:seen.size,actions,trace}));
