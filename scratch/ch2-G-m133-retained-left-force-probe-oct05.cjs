// Fixed replay from the real restored new60, no search and no game calls.
const fs=require('fs'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const sourceEvent=259,o=j.events[sourceEvent].observation,m=createModel(o);
// Exact raw checkpoint hit.sequence (27); prior hand-copied 28 had an extra S.
const sequence='DWWDAASDSASSSSSSAWWWWWWWWDW';
let state=m.start;
const checkpoints=[],priorForces=[],priorBoundaries=[];
for(let i=0;i<sequence.length-1;i++){
  const r=m.step(state,m.A.indexOf(sequence[i]));
  if(!r.valid||r.leaves.length!==1||r.forces.length){priorBoundaries.push({step:i+1,action:sequence[i],valid:r.valid,leaves:r.leaves.length,forces:r.forces,boundaries:r.boundaries});break;}
  state=r.leaves[0].state;
  if((i+1)%4===0||i>=sequence.length-5)checkpoints.push({tailStep:i+1,totalInput:60+i+1,prefix:sequence.slice(0,i+1),state:m.describe(state)});
}
const final=priorBoundaries.length?null:m.step(state,m.A.indexOf(sequence.at(-1)));
const result={sourceEvent,sourceFrame:o.frame??o.frameId,realSourceTime:o.level.timelines[0].time,sequence,length:sequence.length,preLength:sequence.length-1,allEarlierAccepted:!priorBoundaries.length,priorBoundaries,checkpoints,pre:m.describe(state),final:final?{valid:final.valid,forces:final.forces,boundaries:final.boundaries,leaves:final.leaves.map(l=>({choices:l.choices,left:m.left(l.state),stable:m.describe(l.state),trace:l.trace}))}:null,scope:'M131/M132 plus limited M133 geometry model; fixed replay only, candidate not actual. Model trace ticks are not runtime time.'};
function auditActualC87(){
 const {compare}=require('./ch2-G-m133-actual80-calibration-oct05.cjs');
 const raw=m.replay(sequence);if(!raw.valid)throw Error('Fixed27 invalid');
 const rows=[];
 for(let i=287;i<=295;i++){
  const obs=j.events[i]?.observation;if(!obs)continue;
  for(const t of obs.level.timelines){
   const candidates=[];
   for(const leaf of final.leaves)for(const tr of leaf.trace)if(!compare(tr.state,t).length)candidates.push({choices:leaf.choices,tick:tr.tick});
   rows.push({event:i,frame:obs.frame,time:t.time,axis:t.axis,match:!!candidates.length,matches:candidates});
  }
 }
 const end=j.events[295].observation,leaves=end.level.timelines.map(t=>{const choices=raw.states.filter(l=>!compare(l.state,t).length).map(l=>l.choices);return{axis:t.axis,time:t.time,choices,match:choices.length===1,activePlayers:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.id)};});
 return {actual:true,finalEvent:295,frame:end.frame,actions:end.level.instructions.length,completed:end.level.completed,rows,leaves,allMatch:rows.every(r=>r.match)&&leaves.every(l=>l.match),scope:'Every public PLAYER/active BOX properties key, IDs/position/active. Static class/details/animation not modeled here; owner full dictionary audit separately excludes only GMID allocation changes.'};
}
if(require.main===module)console.log(JSON.stringify(process.argv.includes('--actual')?auditActualC87():result,null,2));
module.exports={m,result,auditActualC87};
