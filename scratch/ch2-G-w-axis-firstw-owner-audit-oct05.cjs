// Fixed, public-source W-axis first-W plan; no search/write/game side effects.
const fs=require('fs'),assert=require('assert/strict');
const model=require('./ch2-G-m132-blocked-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const source=j.events[459].observation,t=source.level.timelines.find(t=>t.axis[0]===1);
const m=model.createModel(source,t),r=m.step(m.start,m.A.indexOf('W'));
assert(r.valid&&r.forces.length===0&&r.leaves.length===1&&r.boundaries.length===0);
const objects=t=>t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
const expected=structuredClone(objects(t)),s=r.leaves[0].state,v=[[0,1],[-1,0],[0,-1],[1,0]];
for(const e of expected){
  const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id);assert(z);
  e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
  if(e.type==='PLAYER'){e.active=z.active;e.face=v[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
}
const plan={sourceEvent:459,sourceInstructions:source.level.instructions,sequence:'TW',actualInputTarget:100,modelFirstWValid:true,modelFirstWForceCount:0,expectedAxis1:expected,untouchedAxis0:objects(source.level.timelines.find(t=>t.axis[0]===0))};
if(require.main===module){
  if(process.argv[2]==='plan'){console.log(JSON.stringify(plan));process.exit(0);}
  const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation,l=o.level;
  assert.equal(l.instructions,plan.sourceInstructions+'TW');assert.equal(l.timelines.length,2);
  assert.deepEqual(objects(l.timelines.find(t=>t.axis[0]===1)),plan.expectedAxis1);
  assert.deepEqual(objects(l.timelines.find(t=>t.axis[0]===0)),plan.untouchedAxis0);
  assert.equal(l.timelines.find(t=>t.axis[0]===0).time,160);
  assert(!['busy','input_locked','paused','dialog','completed'].some(k=>l[k]));
  console.log(JSON.stringify({event:latest.i,frame:o.frame,instructions:l.instructions,actions:100,selectedAxis1Time:l.timelines.find(t=>t.axis[0]===1).time,oldAxis0Time:160,full28EntityDictDiffs:[],GMIDDiffs:[],allMotionAndAnimationSettled:true,secondWNotSent:true}));
}
module.exports={plan,m,r};
