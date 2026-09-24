// Observed ordinary grid hypotheses only; no game input. No ice/locks/prisms/stacking/worldline simulation.
const fs=require('fs'),r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),cfg=JSON.parse(process.argv[3]||'{}');
const o=cfg.observation_event!==undefined?r.events[cfg.observation_event].observation:r.initial,t=o.level.timelines[cfg.timeline_index||0],ents=t.entities.filter(e=>e.active),boxes=ents.filter(e=>e.type==='BOX'),items=ents.filter(e=>e.type==='KEY');
if(t.tiles.some(e=>!['SOLID','SPIKE'].includes(e.type))||ents.some(e=>!['SOLID','GOAL','PLAYER','BOX','KEY'].includes(e.type))||items.some(e=>!e.details.isFork))throw Error('Unsupported entities/tiles');
const xy=p=>p.slice(0,2).join(','),dirs=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>[(p[0]+dirs[d][0]+t.size[0]+1)%(t.size[0]+1),(p[1]+dirs[d][1]+t.size[1]+1)%(t.size[1]+1)];
const walls=new Set(ents.filter(e=>e.blockable&&e.type!=='BOX').map(e=>xy(e.pos))),safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...ents.filter(e=>e.floor)].map(e=>xy(e.pos))),bf=new Set([...t.tiles,...ents.filter(e=>e.floor)].map(e=>xy(e.pos)));
const start={p:ents.filter(e=>e.type==='PLAYER').map(e=>[...e.pos,e.properties.face,e.properties.split,e.properties.contained?boxes.findIndex(b=>b.id===e.properties.container):-1]),b:boxes.map(e=>e.pos.slice()),c:0};
const serial=s=>s.p.map(p=>p.join(',')).sort().join(';')+'|'+s.b.map(xy).join(';')+'|'+s.c;
function next(s,a){
 const bi=z=>s.b.findIndex(b=>xy(b)===xy(z));let plans=new Map(),np=[],c=s.c,bad=false;
 function chain(i,d){const out=[];while(i>=0){if(out.includes(i))return null;out.push(i);const z=mv(s.b[i],d);if(walls.has(xy(z))||!bf.has(xy(z)))return null;i=bi(z);}return out;}
 function can(v,d){const z=mv(v,d);if(walls.has(xy(z)))return false;const i=bi(z);return i<0||!!chain(i,d);}
 function land(v,d,face,fork){
  const z=mv(v,d),i=bi(z);
  if(i>=0){const ch=chain(i,d);if(!ch){bad=true;return;}for(const j of ch){if(plans.has(j)&&plans.get(j)!==d)bad=true;plans.set(j,d);}}
  if(!safe.has(xy(z))){if(cfg.allow_partial_death===false)bad=true;return;}
  for(let j=0;j<items.length;j++)if(!(c&(1<<j))&&xy(items[j].pos)===xy(z)){c|=1<<j;fork++;}
  np.push([...z,face,fork,-1]);
 }
 for(const v of s.p){
  if(v[4]>=0){if(a===4&&v[3]>0)return null;np.push([v[0],v[1],a===4?v[2]:a,v[3],v[4]]);continue;}
  if(a===4){
   if(!v[3]){np.push(v.slice());continue;}
   let attempted=false;for(const off of [1,3]){let d=(v[2]+off)%4;if(!can(v,d))d=v[2];if(can(v,d)){attempted=true;land(v,d,v[2],v[3]-1);}}
   if(!attempted)np.push([v[0],v[1],v[2],v[3]-1,-1]);
  }else{let moved=false;for(let k=0;k<4;k++){let d=(a+k)%4;if(!can(v,d))continue;land(v,d,d,v[3]);moved=true;break;}if(!moved)np.push(v.slice());}
 }
 if(bad)return null;
 const nb=s.b.map((v,i)=>plans.has(i)?mv(v,plans.get(i)):v.slice());
 if(new Set(nb.map(xy)).size!==nb.length)return null; // Stacking not simulated.
 for(const p of np){if(p[4]>=0){p[0]=nb[p[4]][0];p[1]=nb[p[4]][1];}else{const i=nb.findIndex(b=>xy(b)===xy(p));if(i>=0)p[4]=i;}}
 const merged=[];for(const v of np){const p=merged.find(p=>xy(p)===xy(v)&&p[4]===v[4]);if(p)p[3]=Math.max(p[3],v[3]);else merged.push(v);}
 return {p:merged,b:nb,c};
}
if(cfg.replay){let s=start,trace=[];for(const a of cfg.replay){s=next(s,'WASDX'.indexOf(a));trace.push(s);if(!s)break;}console.log(JSON.stringify({model:'ordinary-contained-chain-fork-hypothesis',trace}));process.exit();}
const success=s=>cfg.find_boxing?s.p.some(p=>p[4]>=0):o.level.goals.every(g=>s.p.some(p=>xy(p)===xy(g))),q=[[start,-1,-1]],seen=new Set([serial(start)]);let end=-1,processed=0;const searchLimit=cfg.max_states||150000;
for(let i=0;i<q.length&&i<searchLimit;i++){
 processed++;const s=q[i][0];if(success(s)){end=i;break;}
 for(let a=0;a<5;a++){const n=next(s,a);if(!n||n.p.length<(cfg.min_players||1)||n.p.length>(cfg.max_players||2))continue;const k=serial(n);if(!seen.has(k)){seen.add(k);q.push([n,i,a]);}}
}
let actions=null,trace=[];if(end>=0){actions=[];for(let i=end;q[i][1]>=0;i=q[i][1]){actions.push('WASDX'[q[i][2]]);trace.push(q[i][0]);}actions.reverse();trace.reverse();actions=actions.join('');}
console.log(JSON.stringify({model:'ordinary-contained-chain-fork-hypothesis',states:seen.size,processed_states:processed,pending_states:q.length-processed,stopped_at_limit:end<0&&processed>=searchLimit&&processed<q.length,queue_exhausted:end<0&&processed===q.length,actions,trace}));
