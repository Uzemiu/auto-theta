// Read-only hypothesis for observed 3-21 ordinary terrain, multiple prisms, ghosts restricted to active DARK. No optics/boxing/worldlines. Includes recursive ordinary prism push chains based on M055. Ordered prisms; geometry candidate only.
const fs=require('fs'),r=JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),cfg=JSON.parse(process.argv[3]||'{}');
const o=cfg.observation_event===undefined?r.initial:r.events[cfg.observation_event].observation,t=o.level.timelines[cfg.timeline_index||0],es=t.entities.filter(e=>e.active),xy=p=>p.slice(0,2).join(','),ds=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>[p[0]+ds[d][0],p[1]+ds[d][1]];
if(o.level.world||o.level.looping||t.tiles.some(e=>!['SOLID','SPIKE'].includes(e.type))||es.some(e=>!['SOLID','GOAL','PLAYER','PRISM','KEY','DARK','BUTTON','BUTTONGATE','COLLECTION'].includes(e.type)))throw Error('Unsupported world/looping/terrain/entities');
const prisms=es.filter(e=>e.type==='PRISM');if(!prisms.length)throw Error('Observed prisms required');
const walls=new Set(es.filter(e=>e.blockable&&!['PRISM','BUTTONGATE'].includes(e.type)).map(e=>xy(e.pos))),floor=new Set(t.tiles.map(e=>xy(e.pos))),safe=new Set(t.tiles.filter(e=>e.type==='SOLID').map(e=>xy(e.pos))),dark=new Set(es.filter(e=>e.type==='DARK').map(e=>xy(e.pos))),items=es.filter(e=>e.type==='KEY');
if(items.some(e=>!e.details.isFork))throw Error('Only fork items supported');for(const e of es.filter(e=>e.floor)){floor.add(xy(e.pos));safe.add(xy(e.pos));}
const gates=new Map((cfg.gates||[]).map(g=>[xy(g.at),g.buttons.map(xy)]));for(const g of es.filter(e=>e.type==='BUTTONGATE'))if(!gates.has(xy(g.pos)))throw Error('Need explicit observed/hypothetical mappings');
const start={p:es.filter(e=>e.type==='PLAYER').map(e=>[...e.pos,e.properties.face,e.properties.split,e.properties.ghost]),b:prisms.map(e=>e.pos),c:0};
const serial=s=>s.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]].join(',')).sort().join(';')+'|'+s.b.map(xy).join(';')+'|'+s.c;
const gateOpen=(s,k)=>{const bs=gates.get(k);return !bs||bs.some(b=>s.b.some(z=>xy(z)===b)||s.p.some(p=>xy(p)===b))||(cfg.hold_occupied_gates!==false&&(s.b.some(z=>xy(z)===k)||s.p.some(p=>xy(p)===k)));};
function next(s,a){let plan=new Map(),np=[],c=s.c,bad=false;
 const blocked=z=>walls.has(xy(z))||!gateOpen(s,xy(z));
 function pushChain(bi,d,seen=new Set()){if(seen.has(bi))return true;seen.add(bi);const z=mv(s.b[bi],d);if(blocked(z)||!floor.has(xy(z)))return false;const bj=s.b.findIndex(b=>xy(b)===xy(z));return bj<0||pushChain(bj,d,seen);}
 function schedule(bi,d){if(plan.has(bi)){if(plan.get(bi)!==d)bad=true;return;}plan.set(bi,d);const z=mv(s.b[bi],d),bj=s.b.findIndex(b=>xy(b)===xy(z));if(bj>=0)schedule(bj,d);}
 function can(v,d){const z=mv(v,d);if(blocked(z)||(v[4]&&!dark.has(xy(z))))return false;const bi=s.b.findIndex(b=>xy(b)===xy(z));return bi<0||pushChain(bi,d);}
 function land(v,d,face,fork){const z=mv(v,d);const bi=s.b.findIndex(b=>xy(b)===xy(z));if(bi>=0)schedule(bi,d);
  for(let j=0;j<items.length;j++)if(!(c&(1<<j))&&xy(items[j].pos)===xy(z)){c|=1<<j;fork++;}
  if(!floor.has(xy(z)))return;let ghost=v[4];if(!safe.has(xy(z))){if(dark.has(xy(z)))ghost=1;else return;}np.push([...z,face,fork,ghost]);
 }
 for(const v of s.p){if(a===4){if(!v[3]){np.push(v.slice());continue;}let moved=false;for(const off of [1,3]){let d=(v[2]+off)%4;if(!can(v,d))d=v[2];if(can(v,d)){moved=true;land(v,d,v[2],v[3]-1);}}if(!moved)np.push([v[0],v[1],v[2],v[3]-1,v[4]]);}else{let moved=false;for(let k=0;k<4;k++){const d=(a+k)%4;if(can(v,d)){moved=true;land(v,d,d,v[3]);break;}}if(!moved)np.push(v.slice());}}
 if(bad)return null;const b=s.b.map((z,i)=>plan.has(i)?mv(z,plan.get(i)):z);if(new Set(b.map(xy)).size!==b.length||np.some(p=>b.some(z=>xy(p)===xy(z))))return null;
 const merged=[];for(const v of np){const q=merged.find(p=>xy(p)===xy(v));if(q){if(q[4]!==v[4]){if(cfg.find_mixed_contact){merged.push(v);continue;}return null;}q[3]=Math.max(q[3],v[3]);}else merged.push(v);}return {p:merged,b,c};
}
if(cfg.replay){let s=start,trace=[];for(const a of cfg.replay){s=next(s,'WASDX'.indexOf(a));trace.push(s);if(!s)break;}console.log(JSON.stringify({model:'dark-ghost-prism-hypothesis',trace}));process.exit();}
const success=s=>(!cfg.find_mixed_contact||s.p.some((p,i)=>s.p.some((z,j)=>i!==j&&p[4]!==z[4]&&xy(p)===xy(z))))&&(cfg.prism_goals||[]).every((g,i)=>!g||xy(s.b[i])===xy(g))&&(!cfg.any_prism_goals||cfg.any_prism_goals.every(g=>s.b.some(b=>xy(b)===xy(g))))&&s.p.some(p=>!p[4])&&(!cfg.require_ghost||s.p.some(p=>p[4]))&&(!cfg.ghost_goal||s.p.some(p=>p[4]&&xy(p)===xy(cfg.ghost_goal)))&&(!cfg.living_goal||s.p.some(p=>!p[4]&&xy(p)===xy(cfg.living_goal))),q=[[start,-1,-1]],seen=new Set([serial(start)]);let end=-1,processed=0,limit=cfg.max_states||300000;
for(let i=0;i<q.length&&i<limit;i++){processed++;const s=q[i][0];if(success(s)){end=i;break;}for(let a=0;a<5;a++){const n=next(s,a);if(!n||(cfg.avoid_lit_unsafe&&xy(n.b[0])==='1,3'&&xy(n.b[1])==='1,7'&&xy(n.b[2])==='1,9'&&n.p.some(p=>p[4]&&!safe.has(xy(p))))||!n.p.some(p=>!p[4])||n.p.length>2)continue;const k=serial(n);if(!seen.has(k)){seen.add(k);q.push([n,i,a]);}}}
let actions=null,trace=[];if(end>=0){actions=[];for(let i=end;q[i][1]>=0;i=q[i][1]){actions.push('WASDX'[q[i][2]]);trace.push(q[i][0]);}actions.reverse();trace.reverse();actions=actions.join('');}
console.log(JSON.stringify({model:'dark-ghost-prism-hypothesis',states:seen.size,processed_states:processed,pending_states:q.length-processed,stopped_at_limit:end<0&&processed>=limit&&processed<q.length,queue_exhausted:end<0&&processed===q.length,actions,trace}));
