// Whole public entity audit of prefix37 only; no search, game, or writes.
const fs=require('fs'),assert=require('assert/strict');
const {m,result,sequence}=require('./ch2-G-m133-two-leaf-two-free-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const reference=j.events[418].observation,tail=sequence.slice(0,-1),r=m.replay(tail);
assert.equal(sequence,'DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW');
assert.equal(sequence.length,38);assert.equal(tail.length,37);
assert(result.allEarlierAccepted&&r.valid&&r.states.length===1&&r.points.every(p=>p.states.length===1&&p.states[0].choices.length===0));
const objects=o=>o.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
assert.deepEqual(objects(reference),objects(j.events[259].observation));
if(process.argv[2]==='plan'){
 console.log(JSON.stringify({sequence,tail,groups:tail.match(/.{1,4}/g),sourceEvent:418,valid37:true}));process.exit(0);
}
const n=Number(process.argv[2]);assert(Number.isInteger(n)&&n>=0&&n<=37);
const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
assert.equal(o.level.instructions,reference.level.instructions+tail.slice(0,n));
assert.equal(o.level.timelines.length,1);assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
const state=n?r.points[n-1].states[0].state:m.start,vectors=[[0,1],[-1,0],[0,-1],[1,0]];
const expected=structuredClone(objects(reference));
for(const e of expected){
 const z=(e.type==='PLAYER'?state.p:state.b).find(z=>z.id===e.id);assert(z);
 e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
 if(e.type==='PLAYER'){e.active=z.active;e.face=vectors[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
}
const got=objects(o),diffs=[];assert.equal(got.length,14);
for(const e of expected){const a=got.find(z=>z.id===e.id);try{assert.deepEqual(a,e);}catch{diffs.push({id:e.id,actual:a,expected:e});}}
console.log(JSON.stringify({event:latest.i,frame:o.frame,tailStep:n,totalInput:60+n,time:o.level.timelines[0].time,full14PublicEntityDiffs:diffs,finalWNotSent:true,players:state.p.map(p=>({id:p.id,pos:[p.x,p.y],face:m.A[p.face],active:p.active,ghost:p.ghost,mask:p.masked})),boxes:state.b.map(b=>({id:b.id,pos:[b.x,b.y]}))}));
assert.deepEqual(diffs,[],'Complete public entity mismatch; stop input.');
