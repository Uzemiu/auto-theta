// Candidate-only model of observed ice maps. No game input or hidden solution reads.
// Rejects boxing, perpendicular inertia interactions and worldline conflicts.
const fs=require('fs'),r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''));
const cfg=JSON.parse(process.argv[3]||'{}'),o=cfg.observation_event!==undefined?r.events[cfg.observation_event].observation:cfg.initial?r.initial:r.events.filter(e=>e.observation&&(!cfg.latest_world||e.observation.level?.world)).at(-1).observation,t=cfg.timeline_index!==undefined?o.level.timelines[cfg.timeline_index]:(o.level.timelines.find(t=>t.id===(cfg.timeline??o.level.current_timeline))||o.level.timelines[0]);
if(cfg.merge_stable_only===undefined)cfg.merge_stable_only=true;
const xy=p=>p.slice(0,2).join(','),dirs=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>o.level.world?[p[0]+dirs[d][0],p[1]+dirs[d][1]]:[(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
const ents=t.entities.filter(e=>e.active),walls=new Set(ents.filter(e=>e.blockable&&!['BOX','BUTTONGATE','LOCK'].includes(e.type)).map(e=>xy(e.pos))),locks=ents.filter(e=>e.type==='LOCK'),items=ents.filter(e=>e.type==='KEY');
const ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>xy(e.pos))),floor=new Set([...t.tiles.filter(e=>['SOLID','ICE'].includes(e.type)),...ents.filter(e=>e.floor)].map(e=>xy(e.pos))),bf=new Set([...t.tiles,...ents.filter(e=>e.floor)].map(e=>xy(e.pos)));
const gates=cfg.gates||[];if(ents.some(e=>e.type==='BUTTONGATE'&&!gates.some(g=>xy(g.at)===xy(e.pos))))throw Error('Explicit gate mapping required');
const forbiddenCells=new Set((cfg.forbid_cells||[]).map(xy));
const start={p:ents.filter(e=>e.type==='PLAYER').map(e=>[...e.pos,e.properties.face,e.properties.split,e.properties.key]),b:ents.filter(e=>e.type==='BOX').map(e=>e.pos),c:0,l:0};
if(cfg.box_override)start.b=cfg.box_override;
const serial=s=>s.p.map(p=>p.join(',')).sort().join(';')+'|'+s.b.map(xy).sort().join(';')+'|'+s.c+'|'+s.l+(s.conflict?'|conflict':'');
function next(st,a){
 let p=st.p.map(v=>[...v,-1]),b=st.b.map(v=>[...v,-1]),c=st.c,l=st.l;
 for(let tick=0;tick<150;tick++){
  const oldp=p,oldb=b,plans=new Map(),cancels=new Set();let invalid=false,conflict=null,forbidden=false;
  const bi=z=>oldb.findIndex(v=>xy(v)===xy(z));
  const li=z=>locks.findIndex((e,i)=>!(l&(1<<i))&&xy(e.pos)===xy(z));
  const blocked=z=>(o.level.world&&!bf.has(xy(z)))||walls.has(xy(z))||gates.some(g=>xy(g.at)===xy(z)&&![...oldp,...oldb].some(v=>xy(v)===xy(g.at)||g.buttons.some(q=>xy(q)===xy(v))));
  function chain(i,d){let out=[];while(i>=0){if(out.includes(i))return null;out.push(i);const z=mv(oldb[i],d);if(blocked(z)||li(z)>=0||!bf.has(xy(z)))return null;i=bi(z);}return out;}
  const can=(v,d)=>{const z=mv(v,d);if(blocked(z)||(li(z)>=0&&!v[4]))return false;const i=bi(z);return i<0||!!chain(i,d);};
  function push(i,d,actor){
   if(actor&&oldb[i][2]>=0&&(oldb[i][2]+2)%4===d){cancels.add(i);return false;}
   if(actor&&oldb[i][2]>=0&&oldb[i][2]!==d){invalid=true;return false;}
   const ch=chain(i,d);if(!ch)return false;
   if((cfg.forbid_box_push||[]).some(pos=>ch.some(j=>xy(pos)===xy(oldb[j])))){invalid=true;forbidden=true;return false;}
   ch.forEach((j,k)=>{const prev=plans.get(j);if(prev&&prev.d!==d){invalid=true;if(prev.actor&&actor)conflict={box:oldb[j].slice(0,2),tick,directions:[prev.d,d]};}plans.set(j,{d,tail:k===ch.length-1,actor});});return true;
  }
  function land(v,d,face,split,key){const z=mv(v,d),i=bi(z);
   if(forbiddenCells.has(xy(z))||(cfg.bounds&&(z[0]<cfg.bounds[0]||z[0]>cfg.bounds[1]||z[1]<cfg.bounds[2]||z[1]>cfg.bounds[3]))){invalid=true;forbidden=true;return null;}
   if(i>=0&&!push(i,d,true))return [...v.slice(0,2),face,split,key,-1];
   if(!floor.has(xy(z))){if(!cfg.allow_partial_death)invalid=true;return null;}
   const lock=li(z);if(lock>=0){l|=1<<lock;key--;}
   items.forEach((e,j)=>{if(!(c&(1<<j))&&xy(e.pos)===xy(z)){c|=1<<j;if(e.details.isFork)split++;else key++;}});
   return [...z,face,split,key,i>=0||lock>=0?-1:(ice.has(xy(z))?d:-1)];
  }
  let np=[];
  for(const v of oldp){
   if(tick){if(v[5]<0||!can(v,v[5]))np.push([...v.slice(0,5),-1]);else{const q=land(v,v[5],v[2],v[3],v[4]);if(q)np.push(q);}}
   else if(a===4){if(!v[3]){np.push([...v.slice(0,5),-1]);continue;}let attempted=false;for(const off of [1,3]){let d=(v[2]+off)%4;if(!can(v,d))d=v[2];if(can(v,d)){attempted=true;const q=land(v,d,v[2],v[3]-1,v[4]);if(q)np.push(q);}}if(!attempted)np.push([v[0],v[1],v[2],v[3]-1,v[4],-1]);}
   else{let moved=false;for(let n=0;n<4;n++){const d=(a+n)%4;if(!can(v,d))continue;const q=land(v,d,d,v[3],v[4]);if(q)np.push(q);moved=true;break;}if(!moved)np.push([...v.slice(0,5),-1]);}
  }
  for(let i=0;i<oldb.length;i++)if(oldb[i][2]>=0&&!cancels.has(i)&&!plans.has(i))push(i,oldb[i][2],false);
  if(invalid)return !forbidden&&cfg.find_conflict&&conflict?{...st,conflict}:null;
  const nb=oldb.map((v,i)=>{const plan=plans.get(i);if(!plan||cancels.has(i))return [...v.slice(0,2),-1];const z=mv(v,plan.d);return [...z,plan.tail&&ice.has(xy(z))?plan.d:-1];});
  if(new Set(nb.map(xy)).size!==nb.length||np.some(v=>nb.some(q=>xy(v)===xy(q))))return null;
  if(cfg.target_touch&&np.some(v=>xy(v)===xy(cfg.target_touch)))return {p:np.map(v=>v.slice(0,5)),b:nb.map(v=>v.slice(0,2)),c,l,touched:true,intermediate_tick:tick};
  p=[];for(const v of np){const q=p.find(q=>xy(q)===xy(v)&&(cfg.merge_stable_only?(q[5]<0&&v[5]<0):q[2]===v[2]));if(q){q[3]=Math.max(q[3],v[3]);q[4]=Math.max(q[4],v[4]);}else p.push(v);}b=nb;
  if(!p.some(v=>v[5]>=0)&&!b.some(v=>v[2]>=0))return {p:p.map(v=>v.slice(0,5)),b:b.map(v=>v.slice(0,2)),c,l};
 }return null;
}
if(cfg.replay){let s=start,trace=[];for(const a of cfg.replay){s=next(s,'WASDX'.indexOf(a));trace.push(s);if(!s)break;}console.log(JSON.stringify({trace}));process.exit();}
const q=[[start,-1,-1]],seen=new Set([serial(start)]);let end=-1;
const success=s=>cfg.stack_attempt?s.b.some((b,i)=>(!cfg.stack_at||xy(b)===xy(cfg.stack_at))&&s.b.some((c,j)=>i!==j&&dirs.some((v,d)=>xy(mv(b,d))===xy(c)&&walls.has(xy(mv(c,d)))&&s.p.some(p=>xy(mv(p,d))===xy(b))))):cfg.target_touch?!!s.touched:cfg.find_conflict?!!s.conflict&&s.p.length>=(cfg.min_players||0)&&(!cfg.conflict_interior||s.conflict.box.every((v,i)=>v>=2&&v<=t.size[i]-2))&&(!cfg.conflict_box||xy(s.conflict.box)===xy(cfg.conflict_box))&&(!cfg.conflict_directions||cfg.conflict_directions.every(d=>s.conflict.directions.includes(d))):cfg.goal_players?cfg.goal_players.every(g=>s.p.some(p=>xy(p)===xy(g)&&p[2]===g[2]&&p[3]>=g[3])):cfg.target_box?s.b.some(b=>xy(b)===xy(cfg.target_box)):cfg.target_key?s.p.some(p=>p[4]>0):(cfg.goals||o.level.goals).every(g=>s.p.some(p=>xy(p)===xy(g)));
for(let i=0;i<q.length&&i<(cfg.max_states||600000);i++){const s=q[i][0];if(success(s)){end=i;break;}for(let a=0;a<(cfg.no_split?4:5);a++){const n=next(s,a);if(!n||n.p.length<(cfg.min_alive||1)||n.p.length>(cfg.max_players||2)||(n.conflict&&!success(n))||(cfg.keep_boxes||[]).some(b=>!n.b.some(v=>xy(b)===xy(v))))continue;const k=serial(n);if(!seen.has(k)){seen.add(k);q.push([n,i,a]);}}}
let actions=null,trace=[];if(end>=0){actions=[];for(let i=end;q[i][1]>=0;i=q[i][1]){actions.push('WASDX'[q[i][2]]);trace.push(q[i][0]);}actions=actions.reverse().join('');trace.reverse();}
console.log(JSON.stringify({model:'unverified-multibox-ice-candidate',assumed_box_override:cfg.box_override,states:seen.size,actions,trace}));
