// Fixed replay compared to public actual animation/final frames. No search/input/writes.
const fs=require('fs'),assert=require('assert/strict');
const {m,final,sequence}=require('./ch2-G-m133-two-leaf-two-free-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const template=j.events[448].observation.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
const last=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=last.observation;
assert.equal(o.level.instructions,j.events[418].observation.level.instructions+sequence);
assert.equal(o.level.instructions.length,98);assert.equal(o.level.timelines.length,2);
assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
function expected(s){
 const es=structuredClone(template),v=[[0,1],[-1,0],[0,-1],[1,0]];
 for(const e of es){const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id);assert(z);
  e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
  if(e.type==='PLAYER'){e.active=z.active;e.face=v[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
 }return es;
}
function compare(got,want,{animation=false,allocation=false}={}){
 const differences=[],alloc=[];
 assert.equal(got.length,14);
 for(const e of want){const a=structuredClone(got.find(z=>z.id===e.id)),b=structuredClone(e);assert(a);
  if(!animation){delete a.anim_completed;delete b.anim_completed;}
  if(allocation){const ag=a.details.GMID,bg=b.details.GMID;if(ag!==bg)alloc.push({id:e.id,actualGMID:ag,sourceGMID:bg});delete a.details.GMID;delete b.details.GMID;}
  try{assert.deepEqual(a,b);}catch{differences.push({id:e.id,actual:a,expected:b});}
 }return {differences,allocationDifferences:alloc};
}
const before=[];
for(let tick=0;tick<6;tick++){
 const event=451+tick,ob=j.events[event].observation,t=ob.level.timelines[0];
 assert.equal(ob.level.timelines.length,1);assert.equal(t.time,154+tick);
 const c=compare(t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'),expected(final.leaves[0].trace[tick].state));
 before.push({event,frame:ob.frame,time:t.time,tick,...c});assert.deepEqual(c.differences,[]);
}
const branches=o.level.timelines.map(t=>{
 const got=t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'),alive106=got.find(e=>e.id===106).active;
 const leaf=final.leaves.find(l=>l.state.p.find(p=>p.id===106).active===alive106);assert(leaf);
 const c=compare(got,expected(leaf.state),{animation:true,allocation:true});
 assert.equal(t.time,160);assert(got.every(e=>e.anim_completed&&e.properties.movingdir===0&&e.properties.movingsrc===-1));assert.deepEqual(c.differences,[]);
 return {axis:t.axis,time:t.time,choices:leaf.choices,activeLeft:got.filter(e=>e.type==='PLAYER'&&e.id!==105&&e.active).map(e=>e.id),right:got.find(e=>e.id===105).pos,...c};
});
const pre=j.events[456].observation.level.timelines[0].entities;
assert.deepEqual(pre.find(e=>e.id===118).pos,[3,10]);assert.equal(pre.find(e=>e.id===118).properties.movingsrc,106);
assert.equal(pre.find(e=>e.id===118).properties.movingdir,3);assert.deepEqual(pre.find(e=>e.id===109).pos,[2,8]);assert.equal(pre.find(e=>e.id===109).properties.movingsrc,109);assert.equal(pre.find(e=>e.id===109).properties.movingdir,1);
assert.equal(j.events[457].observation.level.timelines.length,2);
console.log(JSON.stringify({event:last.i,frame:o.frame,n:98,beforeFrames:before,firstTwoLeafEvent:457,firstTwoLeafFrame:j.events[457].observation.frame,branches,fullPhysicalStaticDiffs:[],animationAndGuardsStable:true,modelTimeNotSubstitutedForRuntime:true}));
