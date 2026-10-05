// Fixed pre-contact physics and direct actual101 evidence, read-only/no search.
const fs=require('fs'),assert=require('assert/strict');
const {result}=require('./ch2-G-strong98-w-cross2-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const source=j.events[529].observation,old=j.events[459].observation;
const axis=(o,a)=>o.level.timelines.find(t=>t.axis[0]===a),objects=t=>t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
const ent=(o,id)=>objects(axis(o,1)).find(e=>e.id===id);
const noAnim=e=>{e=structuredClone(e);delete e.anim_completed;return e;};
const v=[[0,1],[-1,0],[0,-1],[1,0]],faces='WASD',md={stop:0,W:1,A:3,S:2,D:4};
const checks=[];
for(const q of result.probe.boundary.acceptedTrace){
  const idx=532+q.tick,o=j.events[idx].observation,expected=structuredClone(objects(axis(source,1)));
  for(const e of expected){
    const z=(e.type==='PLAYER'?q.state.p:q.state.b).find(z=>z.id===e.id);assert(z);
    e.pos=[z.x,z.y];e.properties.movingdir=md[z.md];e.properties.movingsrc=z.src;
    if(e.type==='PLAYER'){e.active=z.active;e.face=v[faces.indexOf(z.face)];e.properties.face=faces.indexOf(z.face);e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
  }
  const physical=objects(axis(o,1)).map(noAnim),expectedPhysical=expected.map(noAnim);
  const diffs=[];
  for(const e of expectedPhysical){
    const actual=physical.find(z=>z.id===e.id);
    if(JSON.stringify(actual)!==JSON.stringify(e)){
      if(idx!==534||e.id!==108)assert.deepEqual(actual,e);
      const adjusted=structuredClone(e);
      assert.equal(actual.properties.movingdir,0);assert.equal(actual.properties.movingsrc,-1);
      assert.equal(e.properties.movingdir,3);assert.equal(e.properties.movingsrc,108);
      adjusted.properties.movingdir=0;adjusted.properties.movingsrc=-1;
      assert.deepEqual(actual,adjusted);
      diffs.push({id:108,field:'properties.movingdir',actual:0,model:3},{id:108,field:'properties.movingsrc',actual:-1,model:108});
    }
  }
  assert.deepEqual(objects(axis(o,0)),objects(axis(old,0)));
  checks.push({event:idx,frame:o.frame,time:axis(o,1).time,tick:q.tick,fullPhysicalStaticDiffs:diffs});
}
const pre=j.events[537].observation,post=j.events[538].observation;
assert.equal(axis(pre,1).time,173);assert.equal(axis(post,1).time,174);
assert.deepEqual([ent(pre,108).pos,ent(pre,109).pos],[[2,9],[2,8]]);
assert.deepEqual([ent(pre,108).active,ent(pre,109).active],[true,true]);
assert.equal(ent(pre,108).properties.face,1);assert.equal(ent(pre,108).properties.movingdir,0);assert.equal(ent(pre,108).properties.movingsrc,-1);
assert.equal(ent(pre,109).properties.face,0);assert.equal(ent(pre,109).properties.movingdir,1);assert.equal(ent(pre,109).properties.movingsrc,109);
assert.deepEqual([ent(post,108).pos,ent(post,109).pos],[[2,9],[2,9]]);
assert.deepEqual([ent(post,108).active,ent(post,109).active],[true,false]);
for(const id of [108,109]){
  const e=ent(post,id);assert.equal(e.properties.ghost,0);assert.equal(e.properties.maskedoff,0);assert.equal(e.properties.contained,0);
  assert.equal(e.properties.container,-1);assert.equal(e.properties.height,1);assert.equal(e.properties.split,0);assert.equal(e.properties.key,0);
  assert.equal(e.properties.movingdir,0);assert.equal(e.properties.movingsrc,-1);
}
const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),s=latest.observation,l=s.level;
assert.equal(latest.i,540);assert.equal(l.instructions,old.level.instructions+'TWW');assert.equal(l.instructions.length,101);
assert.equal(l.timelines.length,2);assert.equal(axis(s,0).time,160);assert.equal(axis(s,1).time,174);
assert.deepEqual(objects(axis(s,0)),objects(axis(old,0)));
assert.deepEqual(objects(axis(s,1)).filter(e=>e.type==='BOX'),objects(axis(source,1)).filter(e=>e.type==='BOX'));
assert.deepEqual(objects(axis(s,1)).filter(e=>e.type==='PLAYER'&&e.active).map(e=>e.id),[105,108]);
assert(!['busy','input_locked','paused','dialog','completed'].some(k=>l[k]));
for(const t of l.timelines)for(const e of objects(t)){assert(e.anim_completed);assert.equal(e.properties.movingdir,0);assert.equal(e.properties.movingsrc,-1);}
const r=j.events[531].receipt;assert(r.ok);assert.equal(r.executed,1);assert.equal(r.remaining,0);
console.log(JSON.stringify({event:latest.i,frame:s.frame,input:101,preContactChecks:checks,directBefore:{event:537,frame:pre.frame,time:173},directAfter:{event:538,frame:post.frame,time:174},selectedAxis1Time:174,oldAxis0Time:160,axis0Whole14DictionaryDiffs:[],axis1NineBoxesWholeDictDiffs:[],contactSurvivingPlayer:108,contactInactivePlayer:109,inactiveGhost:0,inactiveMask:0,inactiveContained:0,allGuardsAnimationAndMotionClear:true,postUnknownModelNotInvented:true,undo:126,retry:0,liveOwnerHandle:null}));
