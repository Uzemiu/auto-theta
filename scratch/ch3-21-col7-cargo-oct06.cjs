// Read-only independent COL7 cargo geometry and bounded first-capture target.
// Dynamic COL optics and Ghost-in-Prism leaving DARK are not assumed facts.
const fs=require('fs'),vm=require('vm');
const rec=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-21.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=34,o=rec.events[sourceEvent].observation,t=o.level.timelines[0];
if(o.frame!==1264741||t.time!==8||o.level.instructions!=='ASSWWWDX')throw Error('Expected actual8 source changed');
const K=z=>z.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],A='WASD',M=(z,d)=>[z[0]+V[d][0],z[1]+V[d][1]];
const terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const wall=new Set(t.entities.filter(e=>e.active&&e.blockable&&!['PRISM','BUTTONGATE'].includes(e.type)).map(e=>K(e.pos)));
const safe=z=>['SOLID','GOAL','BUTTON'].includes(terrain.get(K(z))),floor=z=>terrain.has(K(z));
const dark=new Set(t.entities.filter(e=>e.type==='DARK'&&e.active).map(e=>K(e.pos)));
const gates=[{at:[8,3],button:[6,11]},{at:[5,7],button:[5,3]}],goal=[8,1];
const start={p:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,z:e.pos.slice(),f:e.properties.face,g:e.properties.ghost,c:!!e.properties.contained})),b:t.entities.find(e=>e.type==='PRISM'&&e.active).pos.slice()};
if(start.p.length!==2||start.p.some(p=>p.g||p.c))throw Error('Source two live free fixture changed');
const open=(s,g)=>K(s.b)===K(g.at)||s.p.some(p=>K(p.z)===K(g.at))||K(s.b)===K(g.button)||s.p.some(p=>K(p.z)===K(g.button));
const blocked=(s,z)=>wall.has(K(z))||gates.some(g=>K(g.at)===K(z)&&!open(s,g));
const stats={differentForce:0,actorContact:0,outsideDarkCargo:0,nakedDeath:0,normalGoal:0,captureTransitions:0,heldTransitions:0,firstHeld:null,firstCapture:null};
function step(s,a){const plans=new Set(),np=[],notes=[];
 function can(p,d){const z=M(p.z,d);if(blocked(s,z)||!floor(z)||(p.g&&!dark.has(K(z))))return false;if(K(z)===K(s.b)){const dest=M(s.b,d);if(blocked(s,dest)||!floor(dest))return false;}return true;}
 for(const p of s.p){if(p.c){np.push({...p,z:p.z.slice(),f:a});notes.push({id:p.id,contained:true,from:p.z});continue;}
  let d=a,n=0;for(;n<4&&!can(p,d);n++,d=(d+1)%4){}
  if(n===4){np.push({...p,z:p.z.slice(),f:a});notes.push({id:p.id,held:true,from:p.z});continue;}
  const z=M(p.z,d);if(K(z)===K(s.b))plans.add(d);const g=Number(p.g||!safe(z));
  if(g&&!dark.has(K(z))){stats.nakedDeath++;return null;}
  np.push({...p,z,f:d,g});notes.push({id:p.id,from:p.z,to:z,direction:A[d],pushes:K(z)===K(s.b)});
 }
 if(plans.size>1){stats.differentForce++;return null;}const b=plans.size?M(s.b,[...plans][0]):s.b.slice();
 let captures=0;
 for(const p of np){if(p.c){if(p.g&&!dark.has(K(b))){stats.outsideDarkCargo++;return null;}p.z=b.slice();}else if(K(p.z)===K(b)){p.c=true;captures++;}}
 if(new Set(np.map(p=>K(p.z)+(p.c?':C':':F'))).size!==np.length){stats.actorContact++;return null;}
 if(np.some(p=>!p.g&&K(p.z)===K(goal))){stats.normalGoal++;return null;}
 return {p:np,b,notes,captures};
}
const serial=s=>JSON.stringify([s.p.map(p=>[p.id,...p.z,p.g,p.c]),s.b]);
const desc=s=>({players:s.p.map(p=>({id:p.id,pos:p.z,face:A[p.f],ghost:p.g,contained:p.c,Fork:0})),prism:s.b});
const local=[[2,10],[2,9],[2,8],[2,7],[2,6],[2,11],[1,9],[3,9]].map(z=>({pos:z,terrain:terrain.get(K(z)),wall:wall.has(K(z)),dark:dark.has(K(z)),collection:K(z)==='2,6'}));
const conditionalSSS=[{input:1,action:'S',from:{cargo:[2,9],freeGhost:[2,10]},mechanicalDestinations:{prism:[2,8],freeGhost:[2,9]},unknown:'Prism-cargo stepping onto SPIKE+DARK and possible COL optics. Do not assume actual active/ghost/contained persistence or unchanged DARK.'},{input:2,action:'S',from:{cargo:[2,8],freeGhost:[2,9]},mechanicalDestinations:{prism:[2,7],freeGhost:[2,8]},unknown:'Cargo itself leaves DARK here, in second S. BOX M073 is precedent, not a proof for PRISM. Pusher stays in SPIKE+DARK.'},{input:3,action:'S',from:{cargo:[2,7],freeGhost:[2,8]},mechanicalDestinationsIfAllowed:{prism:[2,6],freeGhost:[2,7]},ordinaryFreeGhostRule:'Ghost target2,7 is outside DARK, so source-based can-rule rejects S; next D reaches3,8 in DARK and does not move Prism. Pushing a Prism before Ghost movement refusal or optical revival would be a new actual boundary.',unknown:'Do not predict COL pickup or grant Ghost-cargo escape. This is a calibration input only after actual first/second S states, not a three-step completion route.'}];
const ghostDarkDegree=[...dark].map(k=>k.split(',').map(Number)).filter(z=>floor(z)&&!wall.has(K(z))).map(z=>({pos:z,freeNeighbors:V.map((_,d)=>M(z,d)).filter(n=>floor(n)&&!wall.has(K(n))&&dark.has(K(n))),singlePrismCanFullyHold:V.map((_,d)=>M(z,d)).filter(n=>floor(n)&&!wall.has(K(n))&&dark.has(K(n))).length===1&&(()=>{const d=V.findIndex((_,d)=>{const n=M(z,d);return floor(n)&&!wall.has(K(n))&&dark.has(K(n));});const dest=M(M(z,d),d);return wall.has(K(dest))||!floor(dest);})()}));
const cap=8000,q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([serial(start)]);let head=0,hit=null;
const target=s=>K(s.b)==='2,9'&&s.p.some(p=>p.c&&p.g)&&s.p.some(p=>!p.c&&p.g&&K(p.z)==='2,10');
function route(i){let out='';while(q[i].parent>=0){out=q[i].a+out;i=q[i].parent;}return out;}
while(head<q.length&&head<cap){const i=head++,node=q[i];if(target(node.s)){hit=i;break;}for(let a=0;a<4;a++){const r=step(node.s,a);if(!r)continue;if(r.notes.some(n=>n.held)){stats.heldTransitions++;if(!stats.firstHeld)stats.firstHeld={prefix:route(i),input:A[a],before:desc(node.s),after:desc(r),notes:r.notes};}if(r.captures){stats.captureTransitions++;if(!stats.firstCapture)stats.firstCapture={prefix:route(i),input:A[a],before:desc(node.s),after:desc(r),notes:r.notes};}const k=serial(r);if(seen.has(k))continue;seen.add(k);q.push({s:r,parent:i,a:A[a],depth:node.depth+1});}}
let candidate=null;if(hit!==null){const sequence=route(hit),points=[];let s=start;for(const[i,a]of[...sequence].entries()){const n=step(s,A.indexOf(a));if(!n)throw Error('Candidate prefix replay mismatch');points.push({step:i+1,input:a,state:desc(n)});s=n;}candidate={sequence,source:{event:sourceEvent,frame:o.frame},points,state:desc(s),scope:'Model-only prefix with observed ordinary Ghost movement rules and inferred Prism capture. Actual incremental calibration required; stop on new DARK/light/cargo behavior. No star credit.'};}
const report={scope:'Read-only independent cargo proposal; optical helper target not searched. Only actual8 public physical map and M066 freeGhost rules are used. COL rays are not introduced as facts, and Ghost cargo leaving DARK is a rejected unknown boundary.',source:{event:sourceEvent,frame:o.frame,time:t.time,instructions:o.level.instructions,state:desc(start)},local,conditionalSSS,parity:{source:[0,0],targetCargo2_9:1,targetFree2_10:0,necessary:'Both free actors moving one orthogonal cell per input preserve equal relative parity. First side-push capture requires opposite parity; some actual held, optical, or already-cargo behavior must intervene.',ghostOnlyWaiting:ghostDarkDegree,scope:'Static DARK, single Prism and no optical change. One-Prism-only blocking cannot hold any free Ghost in this recorded region. Alive corner waits are searched, not assumed impossible globally.'},search:{cap,expanded:head,seen:seen.size,pending:q.length-head,exhausted:hit===null&&head===q.length,hit:hit!==null,stats,candidate},limits:['No Ghost passes Wall or unobserved nonDARK.','No light-changing COL assumption or first-S revival.','Different force and actor contact/merge rejected.','No X, extra Fork, prism duplication or new worldline.','M073 BOX-outside-DARK does not establish PRISM cargo collection.','No-hit is only this bounded physical model, not the full game.'],process:'foreground terminal with no checkpoint or background handle'};
fs.writeFileSync('scratch/ch3-21-col7-cargo-oct06.md','# 3-21 COL7 Ghost-cargo local geometry\n\n```json\n'+JSON.stringify(report,null,2)+'\n```\n');
console.log(JSON.stringify(report));
