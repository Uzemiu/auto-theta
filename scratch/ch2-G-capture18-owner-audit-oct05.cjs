// Fixed prefix audit only: public observations/model, no game/search calls.
const fs=require('fs'),assert=require('assert/strict');
const {m,result}=require('./ch2-G-m133-capture19-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const ref=j.events[350].observation,tail=result.sequence.slice(0,-1),r=m.replay(tail);
assert.equal(result.sequence,'WWDSSDSAAAWDSAASWDA');assert.equal(tail.length,18);
assert(r.valid&&r.states.length===1&&r.points.every(p=>p.states.length===1&&p.states[0].choices.length===0));
const summary=s=>({players:s.p.map(z=>({id:z.id,pos:[z.x,z.y],face:m.A[z.face],active:z.active,ghost:z.ghost,masked:z.masked})),boxes:s.b.map(z=>({id:z.id,pos:[z.x,z.y]}))});
if(process.argv[2]==='plan'){
 console.log(JSON.stringify({raw:result.sequence,tail,groups:Array.from({length:Math.ceil(tail.length/4)},(_,i)=>tail.slice(i*4,i*4+4)),valid18:true,checkpoints:r.points.filter(p=>p.step%4===0||p.step===18).map(p=>({tailStep:p.step,total:60+p.step,...summary(p.states[0].state)}))}));process.exit(0);
}
const n=Number(process.argv[2]);assert(Number.isInteger(n)&&n>=0&&n<=18);
const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
assert.equal(o.level.instructions,ref.level.instructions+tail.slice(0,n));assert.equal(o.level.timelines.length,1);
assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
const state=n?r.points[n-1].states[0].state:m.start,vectors=[[0,1],[-1,0],[0,-1],[1,0]];
const expected=structuredClone(ref.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'));
for(const e of expected){
 const z=(e.type==='PLAYER'?state.p:state.b).find(z=>z.id===e.id);assert(z);
 e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
 if(e.type==='PLAYER'){e.active=z.active;e.face=vectors[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
}
const got=o.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'),diffs=[];assert.equal(got.length,14);
for(const e of expected){const a=got.find(q=>q.id===e.id);try{assert.deepEqual(a,e);}catch{diffs.push({id:e.id,actual:a,expected:e});}}
console.log(JSON.stringify({event:latest.i,frame:o.frame,total:60+n,tailStep:n,time:o.level.timelines[0].time,fullPublicEntityDiffs:diffs,...summary(state)}));
assert.deepEqual(diffs,[],'Full public entity mismatch; no further input.');
