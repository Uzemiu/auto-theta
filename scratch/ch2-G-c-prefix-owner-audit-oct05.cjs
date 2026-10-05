// Fixed public-observation audit only. No game input and no search.
const fs=require('fs'),assert=require('assert/strict');
const {m,result}=require('./ch2-G-m133-retained-left-force-probe-oct05.cjs');
const journal=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const source=journal.events[259].observation,base=source.level.instructions;
const raw=result.sequence,tail=raw.slice(0,-1),replay=m.replay(tail);
assert.equal(raw,'DWWDAASDSASSSSSSAWWWWWWWWDW');
assert.equal(raw.length,27);assert.equal(tail.length,26);
assert(replay.valid&&replay.states.length===1);
assert(replay.points.every(p=>p.states.length===1&&p.states[0].choices.length===0));
const summary=s=>({players:s.p.map(z=>({id:z.id,pos:[z.x,z.y],face:m.A[z.face],active:z.active,ghost:z.ghost,masked:z.masked})),boxes:s.b.map(z=>({id:z.id,pos:[z.x,z.y]}))});
if(process.argv[2]==='plan'){
 console.log(JSON.stringify({raw,tail,groups:Array.from({length:Math.ceil(tail.length/4)},(_,i)=>tail.slice(4*i,4*i+4)),valid26:true,checkpoints:replay.points.filter(p=>p.step%4===0||p.step===26).map(p=>({tailStep:p.step,total:60+p.step,...summary(p.states[0].state)}))}));process.exit(0);
}
const n=Number(process.argv[2]);assert(Number.isInteger(n)&&n>=0&&n<=26);
const latest=journal.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),actual=latest.observation;
assert.equal(actual.level.instructions,base+tail.slice(0,n));
assert.equal(actual.level.timelines.length,1);
assert(!['busy','input_locked','paused','dialog','completed'].some(k=>actual.level[k]));
const state=n?replay.points[n-1].states[0].state:m.start;
const vectors=[[0,1],[-1,0],[0,-1],[1,0]],expected=structuredClone(source.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'));
for(const e of expected){
 const z=(e.type==='PLAYER'?state.p:state.b).find(z=>z.id===e.id);assert(z);
 e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
 if(e.type==='PLAYER'){
  e.active=z.active;e.face=vectors[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;
 }
}
const got=actual.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
assert.equal(got.length,14);const diffs=[];
for(const e of expected){
 const a=got.find(a=>a.id===e.id);
 try{assert.deepEqual(a,e);}catch{diffs.push({id:e.id,actual:a,expected:e});}
}
console.log(JSON.stringify({event:latest.i,frame:actual.frame,tailStep:n,total:60+n,time:actual.level.timelines[0].time,fullPublicEntityDiffs:diffs,...summary(state)}));
assert.deepEqual(diffs,[],'Complete public PLAYER/BOX dictionary mismatch; stop all input.');
