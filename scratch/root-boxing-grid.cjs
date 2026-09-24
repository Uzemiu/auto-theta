// Candidate model from observed M038/M058. No game input or game implementation.
const fs=require('fs');
const r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),cfg=JSON.parse(process.argv[3]||'{}');
const o=cfg.observation_event!==undefined?r.events[cfg.observation_event].observation:r.initial,t=o.level.timelines[cfg.timeline_index||0];
const ents=t.entities.filter(e=>e.active),boxes=ents.filter(e=>e.type==='BOX');
if(boxes.length!==1||t.tiles.some(e=>e.type!=='SOLID'&&e.type!=='SPIKE')||ents.some(e=>!['SOLID','GOAL','PLAYER','BOX'].includes(e.type)))throw Error('Only one box, ordinary floors/spikes, players/goals/walls supported');
const xy=p=>p.slice(0,2).join(','),dirs=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>[(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
const walls=new Set(ents.filter(e=>e.blockable&&e.type!=='BOX').map(e=>xy(e.pos)));
const safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...ents.filter(e=>e.floor)].map(e=>xy(e.pos)));
const boxsafe=new Set([...t.tiles,...ents.filter(e=>e.floor)].map(e=>xy(e.pos)));
const start={p:ents.filter(e=>e.type==='PLAYER').map(e=>[...e.pos,e.properties.face,!!e.properties.contained]),b:boxes[0].pos.slice(0,2)};
const serial=s=>s.p.map(p=>[p[0],p[1],+p[3]].join(',')).sort().join(';')+'|'+xy(s.b);
function next(s,a){
 let pushes=[],p=[];
 function can(v,d){const z=mv(v,d);if(walls.has(xy(z)))return false;if(xy(z)!==xy(s.b))return true;const dest=mv(s.b,d);return !walls.has(xy(dest))&&boxsafe.has(xy(dest));}
 for(const v of s.p){
  if(v[3]){p.push([v[0],v[1],a,true]);continue;}
  let moved=false;
  for(let k=0;k<4;k++){const d=(a+k)%4;if(!can(v,d))continue;const z=mv(v,d);if(xy(z)===xy(s.b))pushes.push(d);if(safe.has(xy(z)))p.push([...z,d,false]);else if(!cfg.allow_partial_death)return null;moved=true;break;}
  if(!moved)p.push(v.slice());
 }
 if(new Set(pushes).size>1)return null; // No worldline conflict simulation.
 const b=pushes.length?mv(s.b,pushes[0]):s.b.slice();
 for(const v of p){if(v[3]){v[0]=b[0];v[1]=b[1];}else if(xy(v)===xy(b))v[3]=true;}
 const merged=[];for(const v of p){const old=merged.find(w=>xy(w)===xy(v)&&w[3]===v[3]);if(!old)merged.push(v);}
 return {p:merged,b};
}
if(cfg.replay){let s=start,trace=[];for(const a of cfg.replay){s=next(s,'WASD'.indexOf(a));trace.push(s);if(!s)break;}console.log(JSON.stringify({model:'ordinary-one-box-contained-hypothesis',trace}));process.exit();}
const success=s=>cfg.find_boxing?s.p.some(p=>p[3]):o.level.goals.every(g=>s.p.some(p=>xy(p)===xy(g)));
const q=[[start,-1,-1]],seen=new Set([serial(start)]);let end=-1,processed=0;const searchLimit=cfg.max_states||200000;
for(let i=0;i<q.length&&i<searchLimit;i++){
 processed++;const s=q[i][0];if(success(s)){end=i;break;}
 for(let a=0;a<4;a++){const n=next(s,a);if(!n||n.p.length<(cfg.min_players||2))continue;const key=serial(n);if(!seen.has(key)){seen.add(key);q.push([n,i,a]);}}
}
let actions=null,trace=[];if(end>=0){actions=[];for(let i=end;q[i][1]>=0;i=q[i][1]){actions.push('WASD'[q[i][2]]);trace.push(q[i][0]);}actions.reverse();trace.reverse();actions=actions.join('');}
console.log(JSON.stringify({model:'ordinary-one-box-contained-hypothesis',states:seen.size,processed_states:processed,pending_states:q.length-processed,stopped_at_limit:end<0&&processed>=searchLimit&&processed<q.length,queue_exhausted:end<0&&processed===q.length,actions,trace}));
