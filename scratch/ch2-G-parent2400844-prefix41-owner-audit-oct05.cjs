// Public-observation fixed-prefix audit only; no game input, search, or writes.
const fs=require('fs'),assert=require('assert/strict');
const {m,source,sequence,parentIndex}=require('./ch2-G-strong-parent2400844-probe-oct05.cjs');
const tail=sequence.slice(0,-1),r=m.replay(tail);
assert.equal(parentIndex,2400844);assert.equal(sequence.length,42);assert.equal(tail.length,41);
assert(r.valid&&r.states.length===1&&r.points.every(p=>p.states.length===1&&p.states[0].choices.length===0));
const objects=o=>o.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
const vectors=[[0,1],[-1,0],[0,-1],[1,0]];
function expected(n){
 const s=n?r.points[n-1].states[0].state:m.start,entities=structuredClone(objects(source));
 for(const e of entities){
  const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id);assert(z);
  e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
  if(e.type==='PLAYER'){e.active=z.active;e.face=vectors[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
 }
 return entities;
}
if(process.argv[2]==='plan'){
 console.log(JSON.stringify({sequence,tail,parentIndex,groups:tail.match(/.{1,4}/g),sourceEvent:259,sourceInstructions:source.level.instructions,states:Array.from({length:42},(_,n)=>({tailStep:n,instructions:source.level.instructions+tail.slice(0,n),entities:expected(n)}))}));
}else{
 const n=Number(process.argv[2]);assert(Number.isInteger(n)&&n>=0&&n<=41);
 const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
 const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
 assert.equal(o.level.instructions,source.level.instructions+tail.slice(0,n));assert.equal(o.level.timelines.length,1);
 assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
 const got=objects(o),diffs=[];assert.equal(got.length,14);
 for(const e of expected(n)){const a=got.find(z=>z.id===e.id);try{assert.deepEqual(a,e);}catch{diffs.push({id:e.id,actual:a,expected:e});}}
 console.log(JSON.stringify({parentIndex,event:latest.i,frame:o.frame,tailStep:n,totalInput:60+n,time:o.level.timelines[0].time,full14PublicEntityDiffs:diffs,finalWNotSent:true}));
 assert.deepEqual(diffs,[],'Complete public entity mismatch; stop input.');
}
