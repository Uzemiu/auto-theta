// Read-only search of observed actual92; no Bridge, save, or hidden-code access.
// Prefixes reject all deaths, captures, merges, force races, stacks, lock opening.
// Terminal spike+side-push is a hypothesis to test, never assumed a proved death.
const fs = require('fs');
const sourcePath = 'artifacts/slot1-playthrough/3-26.json';
const j = JSON.parse(fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, ''));
const event = 119, observation = j.events[event].observation;
const t = observation.level.timelines[0];
const V = [[0,1],[-1,0],[0,-1],[1,0]], A = 'WASD', K = p => p.x+','+p.y;
const terrain = new Map(t.tiles.map(e => [e.pos.join(','),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(e.pos.join(',')))terrain.set(e.pos.join(','),e.type);
const walls = new Set(t.entities.filter(e=>e.active&&e.blockable&&!['BOX','PRISM','LOCK','BUTTONGATE'].includes(e.type)).map(e=>e.pos.join(',')));
const gates = t.entities.filter(e=>e.type==='BUTTONGATE').map(e=>({k:e.pos.join(','),button:[e.pos[0],1].join(',')}));
const lock=t.entities.find(e=>e.type==='LOCK');
const start={p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],face:e.properties.face,key:e.properties.key})),b:t.entities.filter(e=>e.active&&['BOX','PRISM'].includes(e.type)).map(e=>({id:e.id,x:e.pos[0],y:e.pos[1]})),locked:lock.active};
if(t.time!==92||!start.locked||start.p.length!==2||!start.p.some(p=>p.id===70&&K(p)==='9,1'&&p.key===0)||!start.p.some(p=>p.id===84&&K(p)==='15,7'&&p.key===1))throw Error('Source fixture changed');
const fixture={lockActive:lock.active,lockPos:lock.pos,wall4_3:walls.has('4,3'),targetSpike:terrain.get('5,1'),pre70Free:!walls.has('5,2'),pre84Free:!walls.has('7,1'),box65:start.b.find(b=>b.id===65),box66:start.b.find(b=>b.id===66)};
if(fixture.targetSpike!=='SPIKE'||K(fixture.box65)!=='6,1')throw Error('Target spike/box fixture changed');
// Face does not affect any ordinary transition in this restricted model.
// It is kept in all predicted snapshots, but omitted from visited signatures.
const serial=s=>JSON.stringify([s.p.map(p=>[p.id,p.x,p.y,p.key]),s.b.map(b=>[b.id,b.x,b.y]),s.locked]);
const originalBoxes=new Map(start.b.map(b=>[b.id,K(b)]));
function rawStep(s,a){
 const occupied=new Set([...s.p,...s.b].map(K));
 const closed=new Set(gates.filter(g=>!occupied.has(g.button)).map(g=>g.k));
 const dz=(p,d)=>[p.x+V[d][0],p.y+V[d][1]],at=z=>s.b.findIndex(b=>K(b)===z.join(','));
 const hard=(z,p)=>walls.has(z.join(','))||closed.has(z.join(','))||!terrain.has(z.join(','))||(s.locked&&z.join(',')===lock.pos.join(',')&&!p.key);
 function chain(n,d,p){const c=[];while(n>=0){if(c.includes(n))return null;c.push(n);const z=dz(s.b[n],d);if(hard(z,p))return null;n=at(z);}return c;}
 const plans=[],requests=new Map(),notes=[];
 for(const p of s.p){let d=a,c=null,n=0,rejected=[];for(;n<4;n++,d=(d+1)%4){const z=dz(p,d);if(hard(z,p)){rejected.push({d:A[d],to:z,reason:'hard-block'});continue;}const bi=at(z);c=bi<0?[]:chain(bi,d,p);if(c)break;rejected.push({d:A[d],to:z,reason:'blocked-push-chain'});}
  if(n===4){plans.push({...p});notes.push({id:p.id,from:[p.x,p.y],held:true,rejected});continue;}
  const z=dz(p,d),k=z.join(',');
  for(const bi of c){if(!requests.has(bi))requests.set(bi,[]);requests.get(bi).push({d,src:p.id});}
  plans.push({...p,x:z[0],y:z[1],face:d,key:p.key-(s.locked&&k===lock.pos.join(',')?1:0)});
  notes.push({id:p.id,from:[p.x,p.y],direction:A[d],to:z,terrain:terrain.get(k),pushes:c.map(i=>s.b[i].id),rejected});
 }
 for(const req of requests.values())if(new Set(req.map(r=>r.d)).size>1)return {boundary:'different-direction-force'};
 const nb=s.b.map((b,i)=>{const r=requests.get(i);return r?{...b,x:b.x+V[r[0].d][0],y:b.y+V[r[0].d][1]}:{...b};});
 if(new Set(nb.map(K)).size!==nb.length)return {boundary:'new-stack'};
 return {state:{p:plans,b:nb,locked:s.locked&&!plans.some(p=>K(p)===lock.pos.join(','))},notes,captures:plans.flatMap(p=>nb.filter(b=>K(b)===K(p)).map(b=>({player:p.id,box:b.id,pos:[p.x,p.y],spike:terrain.get(K(p))==='SPIKE'}))),spikes:plans.filter(p=>terrain.get(K(p))==='SPIKE').map(p=>p.id),merge:new Set(plans.map(K)).size!==plans.length};
}
const limit=100000,unknownCounts={};let totalExpanded=0;
function safeStep(s,a,mobile,stats){const r=rawStep(s,a);let why=r.boundary;
 if(!why&&r.spikes.length)why='spike-boundary-unmodeled-capture';
 if(!why&&r.captures.length)why='new-capture';
 if(!why&&r.merge)why='new-player-merge';
 if(!why&&!r.state.locked)why='lock-open';
 if(!why&&r.state.b.some(b=>K(b)!==originalBoxes.get(b.id)&&(!mobile||b.id!==65)))why='forbidden-container-motion';
 if(why){unknownCounts[why]=(unknownCounts[why]||0)+1;return null;}
 stats.acceptedTransitions++;
 const held=r.notes.filter(n=>n.held).length;
 if(held){stats.transitionsWithHeld++;if(held===1)stats.transitionsWithExactlyOneHeld++;if(!stats.firstHeld)stats.firstHeld={input:A[a],before:s,notes:r.notes,after:r.state};}
 if((r.state.p[0].x+r.state.p[0].y-r.state.p[1].x-r.state.p[1].y)%2!==0)stats.parityMismatch++;
 return r.state;
}
function exact(s){return s.p.some(p=>p.id===70&&K(p)==='5,2'&&p.key===0)&&s.p.some(p=>p.id===84&&K(p)==='7,1'&&p.key===1)&&s.locked&&s.b.every(b=>K(b)===originalBoxes.get(b.id));}
function terminal(s){for(let a=0;a<4;a++){const r=rawStep(s,a);if(r.boundary||r.merge||!r.state.locked)continue;const capture=r.captures.find(c=>c.box===65&&c.player===70&&c.spike);if(!capture)continue;const plan=r.notes.find(n=>n.id===84);if(!plan?.pushes.includes(65)||r.spikes.some(id=>id!==70))continue;
  if(r.state.b.some(b=>b.id!==65&&K(b)!==originalBoxes.get(b.id)))continue;
  return {input:A[a],prediction:r,scope:'The coincident spike arrival plus pushed empty box is NOT modeled as alive/dead. Actual same-input containment calibration required.'};}return null;}
function search(mobile){const q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([serial(start)]);let head=0,hit=null,term=null;
 const stats={acceptedTransitions:0,transitionsWithHeld:0,transitionsWithExactlyOneHeld:0,parityMismatch:0,firstHeld:null};
 while(head<q.length&&totalExpanded<limit){const i=head++,node=q[i];totalExpanded++;if((!mobile&&exact(node.s))||(mobile&&(term=terminal(node.s)))){hit=i;break;}
  for(let a=0;a<4;a++){const s=safeStep(node.s,a,mobile,stats);if(!s)continue;const k=serial(s);if(seen.has(k))continue;seen.add(k);q.push({s,parent:i,a:A[a],depth:node.depth+1});}
 }
 let path=null,trace=[];if(hit!==null){const ids=[];for(let i=hit;q[i].parent>=0;i=q[i].parent)ids.push(i);ids.reverse();path=ids.map(i=>q[i].a).join('');trace=ids.map(i=>({input:q[i].depth,a:q[i].a,state:q[i].s}));if(!mobile)term={input:'A',prediction:rawStep(q[hit].s,1),scope:'Spike+box arrival is an unmodeled terminal hypothesis, not proved death or solved level.'};}
 return {phase:mobile?'only-box65-mobile':'all-five-containers-fixed',expanded:head,seen:seen.size,pending:q.length-head,exhausted:head===q.length,hit:hit!==null,path,trace,terminal:term,stats};
}
const fixed=search(false),mobile=fixed.hit||totalExpanded>=limit?null:search(true);
const report={scope:'MODEL ONLY: strict ordinary two-live prefix with lock active; no death/capture/merge/force/stack allowed before proposed terminal. Terrain and gates are public observed fixtures. No optical update, GMID/runtime, containment resolution, or completion proof.',source:{path:sourcePath,event,frame:observation.frame,time:t.time,instructions:observation.level.instructions},fixture,limit,totalExpanded,unknownCounts,fixed,mobile,parityReasoning:{source70Parity:(start.p.find(p=>p.id===70).x+start.p.find(p=>p.id===70).y)%2,source84Parity:(start.p.find(p=>p.id===84).x+start.p.find(p=>p.id===84).y)%2,target70Parity:(5+2)%2,target84Parity:(7+1)%2,necessaryException:'A single actor must hold or another nonordinary transition must change the relative parity before a side-push capture. With both actors moving exactly one orthogonal cell per input, parity equality is invariant. A captured actor starts one cell from the collision destination, while the side-pushing actor starts two cells from it, requiring opposite relative parity.',scope:'This proves the restricted ordinary graph target impossible. It does not rule out ordinary prefixes using other moved containers to trap/hold one actor, other already observed mechanics, or the game as a whole.'}};
fs.writeFileSync('scratch/ch3-26-lock-capture-oct06.md','# Lock-assisted coincident spike/box capture candidate\n\n```json\n'+JSON.stringify(report,null,2)+'\n```\n');
console.log(JSON.stringify({...report,fixed:{...fixed,trace:fixed.trace.length?{length:fixed.trace.length,first:fixed.trace[0],last:fixed.trace.at(-1)}:[]},mobile:mobile?{...mobile,trace:mobile.trace.length?{length:mobile.trace.length,first:mobile.trace[0],last:mobile.trace.at(-1)}:[]}:null}));
