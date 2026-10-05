// Compare the latest recorded stable state to a fixed public-observation replay.
// No search or game API; a discrepancy aborts before any further input.
const fs=require('fs'),assert=require('assert'),m=require('./ch2-G-readonly.cjs');
const seq='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8'));
const i=j.events.findLastIndex(e=>e.observation?.level?.id==='chord');
const o=j.events[i].observation,l=o.level,n=l.instructions.length;
assert(!l.paused&&!l.busy&&!l.input_locked&&!l.dialog&&!l.completed);
assert.equal(l.instructions,seq.slice(0,n));
const r=n?m.replay(l.instructions):{valid:true,state:m.start};assert(r.valid);
const t=l.timelines.find(t=>t.id===l.current_timeline),es=new Map(t.entities.map(e=>[e.id,e]));
assert.equal(l.timelines.length,1);
for(const p of r.state.p){const e=es.get(p.id);assert(e.active);assert.deepEqual(e.pos,[p.x,p.y]);
 assert.equal(e.properties.face,p.face);assert.equal(e.properties.ghost,0);assert.equal(e.properties.contained,0);}
for(const b of r.state.b){const e=es.get(b.id);assert(e.active);assert.deepEqual(e.pos,[b.x,b.y]);}
assert.equal(t.entities.filter(e=>e.type==='PLAYER'&&e.active).length,5);
assert.equal(t.entities.filter(e=>e.type==='BOX'&&e.active).length,9);
let y=4;for(const a of l.instructions){let d='WD'.includes(a)?1:-1;if(y+d<4||y+d>10)d=-d;y+=d;}
assert.deepEqual(es.get(105).pos,[14,y]);
const target=Number(process.argv[2]||n);assert(target>=n&&target<=64&&target-n<=20);
console.log(JSON.stringify({event:i,step:n,time:t.time,match:true,nextTarget:target,next:seq.slice(n,target),
 players:[...es.values()].filter(e=>e.type==='PLAYER'&&e.active).map(e=>[e.id,...e.pos]),
 boxes:[...es.values()].filter(e=>e.type==='BOX'&&e.active).map(e=>[e.id,...e.pos])}));
