// Actual public microframes/final dictionaries versus fixed model; no input/search/write.
const fs=require('fs'),assert=require('assert/strict');
const {m,last,sequence,parentIndex}=require('./ch2-G-strong-parent2400844-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const template=j.events[718].observation.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
const o=j.events[731].observation;assert.equal(parentIndex,2400844);
assert.equal(o.level.instructions,j.events[259].observation.level.instructions+sequence);assert.equal(o.level.instructions.length,102);
assert.equal(o.level.timelines.length,2);assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
const vectors=[[0,1],[-1,0],[0,-1],[1,0]];
function expected(s){const es=structuredClone(template);for(const e of es){const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id);assert(z);e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;if(e.type==='PLAYER'){e.active=z.active;e.face=vectors[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}}return es;}
function compare(got,want,{animation=false,allocation=false}={}){
 const differences=[],alloc=[];assert.equal(got.length,14);
 for(const e of want){const a=structuredClone(got.find(z=>z.id===e.id)),b=structuredClone(e);assert(a);
  if(!animation){delete a.anim_completed;delete b.anim_completed;}
  if(allocation){if(a.details.GMID!==b.details.GMID)alloc.push({id:e.id,actualGMID:a.details.GMID,sourceGMID:b.details.GMID});delete a.details.GMID;delete b.details.GMID;}
  try{assert.deepEqual(a,b);}catch{differences.push({id:e.id,actual:a,expected:b});}
 }return {differences,allocationDifferences:alloc};
}
const frames=[];for(let tick=0;tick<6;tick++){const event=721+tick,ob=j.events[event].observation,t=ob.level.timelines[0];assert.equal(ob.level.timelines.length,1);assert.equal(t.time,159+tick);const c=compare(t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'),expected(last.leaves[0].trace[tick].state));frames.push({event,frame:ob.frame,tick,actualTime:t.time,...c});assert.deepEqual(c.differences,[]);}
const pre=j.events[726].observation.level.timelines[0].entities;
const box=pre.find(e=>e.id===118),receiver=pre.find(e=>e.id===109),manager=pre.find(e=>e.id===106);
assert.deepEqual(box.pos,[3,10]);assert.equal(box.properties.movingdir,3);assert.equal(box.properties.movingsrc,106);
assert.deepEqual(receiver.pos,[2,8]);assert.equal(receiver.properties.movingdir,1);assert.equal(receiver.properties.movingsrc,109);
assert.deepEqual(manager.pos,[11,10]);assert(manager.active);
assert.equal(j.events[727].observation.level.timelines.length,2);
const branches=o.level.timelines.map(t=>{const got=t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');const leaf=last.leaves.find(l=>l.state.p.find(p=>p.id===106).active===got.find(e=>e.id===106).active);assert(leaf);const c=compare(got,expected(leaf.state),{animation:true,allocation:true});assert.deepEqual(c.differences,[]);assert.equal(t.time,165);assert(got.every(e=>e.anim_completed&&e.properties.movingdir===0&&e.properties.movingsrc===-1));return {axis:t.axis,actualTime:t.time,choices:leaf.choices,activePlayers:got.filter(e=>e.type==='PLAYER'&&e.active).map(e=>({id:e.id,pos:e.pos})),...c};});
assert.deepEqual(j.events[730].observation.level.timelines,o.level.timelines);
console.log(JSON.stringify({parentIndex,event:731,frame:o.frame,input:102,frames,forceBeforeEvent:726,firstTwoAxisEvent:727,branches,fullPhysicalStaticDiffs:[],allAnimationStable:true,modelTicksNotRuntime:true,extraInput:false}));
