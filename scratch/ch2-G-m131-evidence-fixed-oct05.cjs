// Public journal-only M131 fixture: no Bridge calls, search, or game/save mutation.
const fs = require('fs');
const assert = require('assert/strict');
const journal = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json', 'utf8').replace(/^\uFEFF/, ''));
const event = i => journal.events[i];
const obs = i => event(i).observation;
const axis = (i, n) => obs(i).level.timelines.find(t => t.axis[0] === n);
const entity = (i, n, id) => axis(i, n).entities.find(e => e.id === id);
const publicObject = e => ({id:e.id, pos:e.pos, active:e.active, properties:e.properties});
const activePlayers = t => t.entities.filter(e => e.type === 'PLAYER' && e.active).map(e => e.id).sort((a,b)=>a-b);

assert.equal(obs(100).level.instructions.length, 80);
assert.equal(axis(100, 0).time, 127);
assert.deepEqual(entity(100, 0, 106).pos, [12,10]);
assert.deepEqual(entity(100, 0, 108).pos, [5,2]);
assert.deepEqual(entity(100, 0, 109).pos, [2,2]);
assert.equal(event(101).actions, 'W');
assert.equal(event(101).receipt.executed, 1);
assert.equal(event(101).receipt.remaining, 0);

// These are observed animation fields, not anonymous local-model by=-1.
assert.equal(entity(102, 0, 116).properties.movingsrc, 108);
assert.equal(entity(103, 0, 118).properties.movingsrc, 106);
assert.equal(entity(103, 0, 106).active, false);
assert.equal(entity(103, 0, 106).properties.ghost, 1);
assert.deepEqual(entity(103, 0, 118).pos, [4,10]);

assert.equal(obs(108).level.instructions.length, 81);
assert.equal(obs(108).level.timelines.length, 3);
assert.equal(axis(108, 2).time, 133);
assert.deepEqual(activePlayers(axis(108, 2)), [105,108,109]);
assert.notEqual(entity(108, 2, 109).properties.movingdir, 0);
assert.equal(event(109).actions, 'T');
assert.equal(event(111).actions, 'T');
assert.deepEqual(event(109).receipt.players.map(e=>e.id).sort((a,b)=>a-b), [105]);
assert.deepEqual(event(111).receipt.players.map(e=>e.id).sort((a,b)=>a-b), [105,108,109]);

assert.equal(obs(112).level.instructions.length, 83);
assert.equal(obs(112).level.completed, false);
assert.equal(obs(112).level.busy, false);
assert.equal(obs(112).level.input_locked, false);
for (const n of [0,1,2]) {
  const t = axis(112,n);
  assert.equal(t.time,135);
  assert.deepEqual(activePlayers(t), n===2 ? [105,108] : [105]);
  const boxes = t.entities.filter(e=>e.type==='BOX'&&e.active);
  assert.equal(boxes.length,9);
  assert(boxes.every(e=>e.properties.height===1&&e.properties.contained===0&&e.properties.movingdir===0));
}
assert.equal(entity(112,2,109).active,false);
assert.equal(entity(112,2,109).properties.ghost,1);
assert.deepEqual(entity(112,2,109).pos,[2,10]);
assert.deepEqual(entity(112,2,114).pos,[2,11]);
assert.equal(entity(112,2,108).properties.movingdir,0);

console.log(JSON.stringify({
  verified:true, mechanism:'M131', journal:'2-G.json', sourceEvent:100,
  inputEvent:101, animationEvents:[102,103,104,105,106,107], firstStableEvent:108,
  tabs:[109,111], finalStableEvent:112,
  sourceContinuingAfterDeath:publicObject(entity(103,0,118)),
  branches:obs(112).level.timelines.map(t=>({axis:t.axis,time:t.time,
    players:t.entities.filter(e=>e.type==='PLAYER'&&e.active).map(publicObject),
    boxes:t.entities.filter(e=>e.type==='BOX'&&e.active).map(e=>({id:e.id,pos:e.pos}))})),
  scope:'Recorded instance only; no generalized inertia branching or fourth-leaf claim.'
},null,2));
