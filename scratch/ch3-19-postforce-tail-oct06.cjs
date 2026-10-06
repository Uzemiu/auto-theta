// Read-only bounded ordinary tails of the two actually observed54 force leaves.
// No X, game/Bridge calls, save edits, hints, cargo invention, or main-file writes.
const fs=require('fs'),vm=require('vm');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-19.json','utf8').replace(/^\uFEFF/,''));
const event=85,o=raw.events[event].observation;
if(o.frame!==1097671||o.level.id!=='lockpick2'||o.level.timelines.length!==2)throw Error('Expected actual54 two-leaf source');
const definition=fs.readFileSync('scratch/root-cargo-gates.cjs','utf8').split('if(cfg.replay)')[0].replace('if(!moved)np.push(v.slice());','if(!moved)np.push([v[0],v[1],a,v[3],v[4],v[5]]);');
const results=[];
for(let leaf=0;leaf<2;leaf++){
 const t=o.level.timelines[leaf],players=t.entities.filter(e=>e.type==='PLAYER'&&e.active&&!e.properties.maskedoff),boxes=t.entities.filter(e=>e.type==='BOX'&&e.active&&!e.properties.maskedoff);
 if(t.time!==54||players.length!==1||boxes.length!==6||players[0].properties.key!==0||players[0].properties.split!==0||players[0].properties.contained)throw Error('Branch source resource changed');
 const cfg={observation_event:event,timeline_index:leaf,gates:[{at:[3,6],buttons:[[8,1]]},{at:[4,6],buttons:[[9,1]]}],hold_occupied_gates:true,allow_partial_death:false,ordered_boxes:true};
 const ctx={require,process:{argv:['node','model','artifacts/slot1-playthrough/3-19.json',JSON.stringify(cfg)]}};
 vm.runInNewContext(definition+';globalThis.model={start,next,serial};',ctx);
 const {start,next,serial}=ctx.model,ids=boxes.map(e=>e.id);
 const describe=s=>({player:s.p.map(p=>({id:players[0].id,at:p.slice(0,2),face:'WASD'[p[2]],fork:p[3],contained:p[4]>=0,container:p[4]>=0?ids[p[4]]:null,key:p[5]})),boxes:s.b.map((p,i)=>({id:ids[i],at:p})),collectedMask:s.c,lockMask:s.l});
 const cap=3000,q=[{s:start,parent:-1,a:'',depth:0}],seen=new Set([serial(start)]);let head=0,hit=null,rejected=0,containedStates=0,keyStates=0,closest=null,maxDepth=0;
 function route(i){let out='';while(q[i].parent>=0){out=q[i].a+out;i=q[i].parent;}return out;}
 while(head<q.length&&head<cap){const i=head++,node=q[i],s=node.s;maxDepth=Math.max(maxDepth,node.depth);
  const distance=Math.abs(s.p[0][0]-13)+Math.abs(s.p[0][1]-3);if(!closest||distance<closest.distance)closest={distance,sequence:route(i),state:describe(s)};
  if(s.p.some(p=>p[0]===13&&p[1]===3)){hit=i;break;}
  for(let a=0;a<4;a++){const n=next(s,a);if(!n||n.p.length!==1){rejected++;continue;}if(n.p[0][4]>=0)containedStates++;if(n.p[0][5]>0)keyStates++;const k=serial(n);if(seen.has(k))continue;seen.add(k);q.push({s:n,parent:i,a:'WASD'[a],depth:node.depth+1});}
 }
 let candidate=null;
 if(hit!==null){const sequence=route(hit),trace=[];let s=start;for(const[i,a]of[...sequence].entries()){s=next(s,'WASD'.indexOf(a));if(!s||s.p.length!==1)throw Error('Candidate replay failed');trace.push({step:i+1,input:a,state:describe(s)});}candidate={sequence,trace,scope:'Model ordinary safe candidate; actual owner completion required.'};}
 results.push({source:{event,frame:o.frame,leaf,axis:t.axis,time:t.time,instructions:o.level.instructions,activeActor:players[0].id,maskedActors:t.entities.filter(e=>e.type==='PLAYER'&&!e.active&&e.properties.maskedoff).map(e=>({id:e.id,pos:e.pos})),start:describe(start)},cap,expanded:head,seen:seen.size,pending:q.length-head,exhausted:hit===null&&head===q.length,maxDepth,rejected,containedStates,keyStates,closest,hit:hit!==null,candidate});
}
const report={scope:'MODEL ONLY: actual85/frame1097671 two leaves independently, one active free actor each, six observed boxes preserved. Only ordinary WASD, no X/fork, ghosts, masked-player participation, new stacking, extra branches or unknown simultaneous spike rescue. Every accepted step retains the living actor and rejects naked SPIKE. Keys/locks retain actual pickup/unlock prerequisites. A bounded no-hit is not global impossibility.',source:{event,frame:o.frame,completed:o.level.completed},totalExpanded:results.reduce((n,r)=>n+r.expanded,0),leaves:results,resourceCut:'Each source has no cargo, one free Fork0/key0 actor and six empty BOX on SOLID/SPIKE terrain with no ICE. In this ordinary one-actor model, pushing empty boxes moves them away from the pusher; it cannot create new cargo. The only active ordinary KEY is5,5 on SPIKE, which naked safe prefixes cannot collect; LOCK12,3 therefore remains closed. This explanation is scoped to the checked ordinary model, not unknown metamechanics or the full game.',process:'foreground terminal, no checkpoints or background handles'};
fs.writeFileSync('scratch/ch3-19-postforce-tail-oct06.md','# 3-19 actual54 postforce ordinary tails\n\n```json\n'+JSON.stringify(report,null,2)+'\n```\n');
console.log(JSON.stringify(report));
