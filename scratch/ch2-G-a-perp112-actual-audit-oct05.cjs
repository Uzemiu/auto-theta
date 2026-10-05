// Read-only fixed pre-boundary comparison and direct public actual112 evidence.
const fs=require('fs'),assert=require('assert/strict');
const {result}=require('./ch2-G-strong98-a-perp14-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const axis=(o,a)=>o.level.timelines.find(t=>t.axis[0]===a);
const objects=t=>t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
const withoutAnim=e=>{e=structuredClone(e);delete e.anim_completed;return e;};
const ref=j.events[482].observation,old=j.events[459].observation;
const v=[[0,1],[-1,0],[0,-1],[1,0]],faces='WASD',md={stop:0,W:1,A:3,S:2,D:4};
const checks=[];
for(const q of result.probe.boundaries[0].acceptedTrace){
  const idx=485+q.tick,o=j.events[idx].observation,expected=structuredClone(objects(axis(ref,0)));
  for(const e of expected){
    const z=(e.type==='PLAYER'?q.state.p:q.state.b).find(z=>z.id===e.id);assert(z);
    e.pos=[z.x,z.y];e.properties.movingdir=md[z.md];e.properties.movingsrc=z.src;
    if(e.type==='PLAYER'){
      e.active=z.active;e.face=v[faces.indexOf(z.face)];e.properties.face=faces.indexOf(z.face);
      e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;
    }
  }
  assert.deepEqual(objects(axis(o,0)).map(withoutAnim),expected.map(withoutAnim));
  assert.deepEqual(objects(axis(o,1)),objects(axis(old,1)));
  checks.push({event:idx,frame:o.frame,time:axis(o,0).time,tick:q.tick,fullPhysicalStaticDiffs:[]});
}
const pre=j.events[489].observation,post=j.events[490].observation;
const ent=(o,id)=>objects(axis(o,0)).find(e=>e.id===id);
assert.equal(axis(pre,0).time,206);assert.equal(axis(post,0).time,207);
assert.deepEqual([ent(pre,108).pos,ent(pre,115).pos,ent(pre,111).pos],[[6,9],[6,10],[5,10]]);
assert.deepEqual([ent(post,108).pos,ent(post,115).pos,ent(post,111).pos],[[6,10],[5,10],[4,10]]);
assert.equal(ent(pre,108).properties.movingdir,1);assert.equal(ent(pre,108).properties.movingsrc,108);
assert.equal(ent(post,108).properties.movingdir,1);assert.equal(ent(post,108).properties.movingsrc,108);
assert.equal(ent(pre,115).properties.movingdir,3);assert.equal(ent(pre,115).properties.movingsrc,106);
assert.equal(ent(post,115).properties.movingdir,0);assert.equal(ent(post,115).properties.movingsrc,-1);
assert.equal(ent(pre,111).properties.movingdir,0);assert.equal(ent(pre,111).properties.movingsrc,-1);
assert.equal(ent(post,111).properties.movingdir,3);assert.equal(ent(post,111).properties.movingsrc,106);
const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),s=latest.observation,l=s.level;
assert.equal(latest.i,493);assert.equal(l.instructions,old.level.instructions+result.sequence);
assert.equal(l.instructions.length,112);assert.equal(l.timelines.length,2);
assert.equal(axis(s,0).time,208);assert.equal(axis(s,1).time,160);
assert.deepEqual(objects(axis(s,1)),objects(axis(old,1)));
assert.deepEqual(objects(axis(s,0)).map(withoutAnim),objects(axis(j.events[492].observation,0)).map(withoutAnim));
assert(!['busy','input_locked','paused','dialog','completed'].some(k=>l[k]));
for(const t of l.timelines){
  assert.equal(objects(t).length,14);
  for(const e of objects(t)){
    assert(e.anim_completed);assert.equal(e.properties.movingdir,0);assert.equal(e.properties.movingsrc,-1);
    assert.equal(e.properties.contained,0);assert.equal(e.properties.container,-1);assert.equal(e.properties.height,1);
    if(e.type==='BOX')assert(e.active);
  }
}
assert.deepEqual(objects(axis(s,0)).filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.id),[105]);
assert.deepEqual(objects(axis(s,1)).filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.id),[105,108,109]);
const receipt=j.events[484].receipt;assert(receipt.ok);assert.equal(receipt.executed,1);assert.equal(receipt.remaining,0);
console.log(JSON.stringify({event:latest.i,frame:s.frame,input:112,sequence:result.sequence,premodelChecks:checks,directBefore:{event:489,frame:pre.frame,time:206},directAfter:{event:490,frame:post.frame,time:207},currentAxisTime:208,oldAxisTime:160,oldAxisWhole14DictDiffs:[],postUnknownModelNotInvented:true,stableCurrentPhysicsDiffs:[],allAnimationMotionAndGuardsClear:true,axisActivePlayers:l.timelines.map(t=>({axis:t.axis,time:t.time,players:objects(t).filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.id)})),undo:112,retry:0,liveOwnerHandle:null}));
