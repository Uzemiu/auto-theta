// Fixed public actual C87 evidence audit. No search, game, or save calls.
const fs=require('fs'),assert=require('assert/strict');
const {m,result}=require('./ch2-G-m133-retained-left-force-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const ref=j.events[284].observation;
const prior=m.replay(result.sequence.slice(0,-1));assert(prior.valid&&prior.states.length===1);
const final=m.step(prior.states[0].state,m.A.indexOf('W'));
assert(final.valid&&final.leaves.length===2&&final.forces.length===1);
const vectors=[[0,1],[-1,0],[0,-1],[1,0]];
function expected(state){
 const entities=structuredClone(ref.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'));
 for(const e of entities){
  const z=(e.type==='PLAYER'?state.p:state.b).find(z=>z.id===e.id);assert(z);
  e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
  if(e.type==='PLAYER'){e.active=z.active;e.face=vectors[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
 }
 return entities;
}
function differences(t,state,{animation=true}={}){
 const want=expected(state),got=t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'),diffs=[];
 assert.equal(got.length,14);
 for(const e of want){
  const a=structuredClone(got.find(a=>a.id===e.id)),b=structuredClone(e);
  if(!animation){delete a.anim_completed;delete b.anim_completed;}
  // Public GMID is a new runtime object instance on the duplicated branch.
  // The source model keeps logical entity id, not these allocation counters.
  // Preserve and report every GMID separately rather than claiming equality.
  delete a.details.GMID;delete b.details.GMID;
  try{assert.deepEqual(a,b);}catch{diffs.push({id:e.id,actual:a,expected:b});}
 }
 return diffs;
}
const evidence=[];
for(let i=287;i<=293;i++){
 const o=j.events[i].observation;
 for(const t of o.level.timelines){
  const candidates=[];
  for(const leaf of final.leaves)for(const tr of leaf.trace)if(!differences(t,tr.state,{animation:false}).length)candidates.push({choices:leaf.choices,tick:tr.tick});
  if(!candidates.length){
   const closest=final.leaves.flatMap(leaf=>leaf.trace.map(tr=>({choices:leaf.choices,tick:tr.tick,diffs:differences(t,tr.state,{animation:false})}))).sort((a,b)=>a.diffs.length-b.diffs.length)[0];
   console.log(JSON.stringify({unmatchedEvent:i,axis:t.axis,closest}));
  }
  assert(candidates.length,`Actual event${i}/axis${t.axis} lacks full physical entity match.`);
  evidence.push({event:i,frame:o.frame,time:t.time,axis:t.axis,matches:candidates});
 }
}
const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
assert.equal(o.level.instructions,ref.level.instructions+'W');assert.equal(o.level.timelines.length,2);
assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
const mappings=o.level.timelines.map(t=>{
 const matched=final.leaves.filter(leaf=>!differences(t,leaf.state).length);
 assert.equal(matched.length,1,'Stable entire entity dictionary including animations must match exactly one leaf.');
 const leaf=matched[0];return {axis:t.axis,time:t.time,choice:leaf.choices,physicalEntityDiffs:[],allPropertiesMatch:true,publicRuntimeGMID:t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX').map(e=>({id:e.id,sourceGMID:ref.level.timelines[0].entities.find(q=>q.id===e.id).details.GMID,GMID:e.details.GMID})),active:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.id),entities:t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX')};
});
assert.deepEqual(mappings.map(v=>v.choice[0]).sort(),[106,109]);
console.log(JSON.stringify({actual:true,finalEvent:latest.i,frame:o.frame,actions:87,traceEvidence:evidence,forces:final.forces.map(f=>({tick:f.tick,box:f.box,cell:f.cell,requests:f.requests,path:f.path})),leaves:mappings,unsettledMovingIds:o.level.timelines.flatMap(t=>t.entities.filter(e=>['PLAYER','BOX'].includes(e.type)&&e.properties.movingdir!==0).map(e=>({axis:t.axis,id:e.id}))),scope:'All public entity fields including entire properties, type/class/face/height/container and final animations are compared; branch GMID allocation counters are reported separately. Trace tick matching uses public fields, not runtime-time inference. Two leaves only, not completed.'}));
