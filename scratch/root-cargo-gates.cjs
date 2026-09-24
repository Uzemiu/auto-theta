// Read-only 3-18 cargo-key hypothesis. Static prisms are obstacles only; optical completion is not simulated.  Locks/keys added; same-lock split branch collisions rejected as unverified. No ice/prisms/stacking/worldline simulation.
const fs=require('fs'),r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),cfg=JSON.parse(process.argv[3]||'{}');
const o=cfg.observation_event!==undefined?r.events[cfg.observation_event].observation:r.initial,t=o.level.timelines[cfg.timeline_index||0],ents=t.entities.filter(e=>e.active),boxes=ents.filter(e=>e.type==='BOX'),items=ents.filter(e=>e.type==='KEY'),locks=ents.filter(e=>e.type==='LOCK');
if(t.tiles.some(e=>!['SOLID','SPIKE'].includes(e.type))||ents.some(e=>!['SOLID','GOAL','PLAYER','BOX','KEY','LOCK','PRISM','BUTTON','BUTTONGATE'].includes(e.type)))throw Error('Unsupported entities/tiles');
const xy=p=>p.slice(0,2).join(','),dirs=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>[(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
const walls=new Set(ents.filter(e=>e.blockable&&!['BOX','LOCK','BUTTONGATE'].includes(e.type)).map(e=>xy(e.pos))),safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...ents.filter(e=>e.floor)].map(e=>xy(e.pos))),bf=new Set([...t.tiles,...ents.filter(e=>e.floor)].map(e=>xy(e.pos)));
const gates=ents.filter(e=>e.type==='BUTTONGATE');
const gm=new Map((cfg.gates||[]).map(g=>[xy(g.at),g.buttons.map(xy)]));
if(gates.some(g=>!gm.has(xy(g.pos))))throw Error('Explicit verified gate/button mappings required');
function blocked(s,z){const k=xy(z);if(walls.has(k))return true;const buttons=gm.get(k);return buttons&&!(cfg.hold_occupied_gates&&[...s.b,...s.p].some(p=>xy(p)===k))&&!buttons.some(b=>s.b.some(p=>xy(p)===b)||s.p.some(p=>xy(p)===b));}
const start={p:ents.filter(e=>e.type==='PLAYER').map(e=>[...e.pos,e.properties.face,e.properties.split,e.properties.contained?boxes.findIndex(b=>b.id===e.properties.container):-1,e.properties.key]),b:boxes.map(e=>e.pos.slice()),c:0,l:0};
const serial=s=>s.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]>=0?xy(s.b[p[4]]):'-',p[5]].join(',')).sort().join(';')+'|'+(cfg.ordered_boxes?s.b.map(xy):s.b.map(xy).sort()).join(';')+'|'+s.c+'|'+s.l;
function next(s,a){
 const bi=z=>s.b.findIndex(b=>xy(b)===xy(z));let plans=new Map(),np=[],c=s.c,l=s.l,bad=false;const li=z=>locks.findIndex((e,i)=>!(l&(1<<i))&&xy(e.pos)===xy(z));
 function chain(i,d){const out=[];while(i>=0){if(out.includes(i))return null;out.push(i);const z=mv(s.b[i],d);if(blocked(s,z)||!bf.has(xy(z))||(li(z)>=0&&!s.p.some(p=>p[4]===i&&p[5]>0)))return null;i=bi(z);}return out;}
 function can(v,d){const z=mv(v,d);if(blocked(s,z)||(li(z)>=0&&!v[5]))return false;const i=bi(z);return i<0||!!chain(i,d);}
 function land(v,d,face,fork){let key=v[5];
  const z=mv(v,d),i=bi(z);
  if(i>=0){const ch=chain(i,d);if(!ch){bad=true;return;}for(const j of ch){if(plans.has(j)&&plans.get(j)!==d)bad=true;plans.set(j,d);}}
  const lock=li(z);if(lock>=0){if(cfg.keep_locks_closed){bad=true;return;}l|=1<<lock;key--;}
  for(let j=0;j<items.length;j++)if(!(c&(1<<j))&&xy(items[j].pos)===xy(z)){c|=1<<j;if(items[j].details.isFork)fork++;else key++;}
  if(!safe.has(xy(z))){if(cfg.allow_partial_death===false)bad=true;return;}
  np.push([...z,face,fork,-1,key]);
 }
 for(const v of s.p){
  if(v[4]>=0){if(a===4&&v[3]>0)return null;np.push([v[0],v[1],a===4?v[2]:a,v[3],v[4],v[5]]);continue;}
  if(a===4){
   if(!v[3]){np.push(v.slice());continue;}
   let lockTargets=new Set(),attempted=false;for(const off of [1,3]){let d=(v[2]+off)%4;if(!can(v,d))d=v[2];if(can(v,d)){const dst=mv(v,d),lock=locks.findIndex((e,i)=>!(s.l&(1<<i))&&xy(e.pos)===xy(dst));if(lock>=0){if(lockTargets.has(lock))return null;lockTargets.add(lock);}attempted=true;land(v,d,v[2],v[3]-1);}}
   if(!attempted)np.push([v[0],v[1],v[2],v[3]-1,-1,v[5]]);
  }else{let moved=false;for(let k=0;k<4;k++){let d=(a+k)%4;if(!can(v,d))continue;land(v,d,d,v[3]);moved=true;break;}if(!moved)np.push(v.slice());}
 }
 if(bad)return null;
 const nb=s.b.map((v,i)=>plans.has(i)?mv(v,plans.get(i)):v.slice());
 if(new Set(nb.map(xy)).size!==nb.length)return null; // Stacking not simulated.
 for(const p of np){if(p[4]>=0){p[0]=nb[p[4]][0];p[1]=nb[p[4]][1];if(plans.has(p[4])){const lock=li(p);if(lock>=0){if(p[5]<=0||cfg.keep_locks_closed)return null;p[5]--;l|=1<<lock;}for(let j=0;j<items.length;j++)if(!(c&(1<<j))&&xy(items[j].pos)===xy(p)){c|=1<<j;if(items[j].details.isFork)p[3]++;else p[5]++;}}}else{const i=nb.findIndex(b=>xy(b)===xy(p));if(i>=0)p[4]=i;}}
 const merged=[];for(const v of np){const p=merged.find(p=>xy(p)===xy(v)&&p[4]===v[4]);if(p){p[3]=Math.max(p[3],v[3]);p[5]=Math.max(p[5],v[5]);}else merged.push(v);}
 if(cfg.cargo_max_y!==undefined&&merged.some(p=>p[4]>=0&&p[1]>cfg.cargo_max_y))return null;
 return {p:merged,b:nb,c,l};
}
if(cfg.replay){let s=start,trace=[];for(const a of cfg.replay){s=next(s,'WASDX'.indexOf(a));trace.push(s);if(!s)break;}console.log(JSON.stringify({model:'ordinary-cargo-key-lock-explicit-gate-hypothesis',trace}));process.exit();}
const success=s=>cfg.contained_key!==undefined?s.p.some(p=>p[4]>=0&&p[5]>=cfg.contained_key&&(cfg.cargo_max_y===undefined||p[1]<=cfg.cargo_max_y)):cfg.find_boxing?s.p.some(p=>p[4]>=0):(cfg.goals||o.level.goals).every(g=>s.p.some(p=>xy(p)===xy(g))),q=[[start,-1,-1]],seen=new Set([serial(start)]);let end=-1,processed=0;const searchLimit=cfg.max_states||150000;
for(let i=0;i<q.length&&i<searchLimit;i++){
 processed++;const s=q[i][0];if(success(s)){end=i;break;}
 for(let a=0;a<5;a++){const n=next(s,a);if(!n||n.p.length<(cfg.min_players||1)||n.p.length>(cfg.max_players||2))continue;const k=serial(n);if(!seen.has(k)){seen.add(k);q.push([n,i,a]);}}
}
let actions=null,trace=[];if(end>=0){actions=[];for(let i=end;q[i][1]>=0;i=q[i][1]){actions.push('WASDX'[q[i][2]]);trace.push(q[i][0]);}actions.reverse();trace.reverse();actions=actions.join('');}
console.log(JSON.stringify({model:'ordinary-cargo-key-lock-explicit-gate-hypothesis',states:seen.size,processed_states:processed,pending_states:q.length-processed,stopped_at_limit:end<0&&processed>=searchLimit&&processed<q.length,queue_exhausted:end<0&&processed===q.length,actions,trace}));
