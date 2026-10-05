// Actual axis0 prefix13 whole-entity audit; read-only fixed replay only.
const fs=require('fs'),assert=require('assert/strict');
const {m,result}=require('./ch2-G-strong98-a-perp14-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const reference=j.events[459].observation,tail=result.sequence.slice(0,-1),r=m.replay(tail);
const get=o=>o.level.timelines.find(t=>t.axis[0]===0),objects=t=>t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX');
assert.equal(result.sequence,'SDSAWWDSSWWSDW');assert.equal(tail.length,13);
assert(r.valid&&r.states.length===1&&r.points.every(p=>p.states.length===1&&p.states[0].choices.length===0));
if(process.argv[2]==='plan'){console.log(JSON.stringify({sequence:result.sequence,tail,groups:tail.match(/.{1,4}/g),sourceEvent:459,sourceAxis:0,prefix13valid:true}));process.exit(0);}
const n=Number(process.argv[2]);assert(Number.isInteger(n)&&n>=0&&n<=13);
const latest=j.events.map((e,i)=>({...e,i})).filter(e=>e.observation).at(-1),o=latest.observation;
assert.equal(o.level.instructions,reference.level.instructions+tail.slice(0,n));
assert.equal(o.level.timelines.length,2);assert(!['busy','input_locked','paused','dialog','completed'].some(k=>o.level[k]));
const state=n?r.points[n-1].states[0].state:m.start,v=[[0,1],[-1,0],[0,-1],[1,0]],expected=structuredClone(objects(get(reference)));
for(const e of expected){const z=(e.type==='PLAYER'?state.p:state.b).find(z=>z.id===e.id);assert(z);
 e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
 if(e.type==='PLAYER'){e.active=z.active;e.face=v[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
}
const got=objects(get(o)),diffs=[];assert.equal(got.length,14);
for(const e of expected){const a=got.find(z=>z.id===e.id);try{assert.deepEqual(a,e);}catch{diffs.push({id:e.id,actual:a,expected:e});}}
const other=o.level.timelines.find(t=>t.axis[0]===1),oldOther=reference.level.timelines.find(t=>t.axis[0]===1);
assert.equal(other.time,160);assert.deepEqual(objects(other),objects(oldOther));
console.log(JSON.stringify({event:latest.i,frame:o.frame,input:98+n,tailStep:n,axis0Time:get(o).time,axis1Time:other.time,full14PublicEntityDiffs:diffs,otherAxisPhysicalAndTimeDiffs:[],lastWNotSent:true}));
assert.deepEqual(diffs,[],'Stop on entire entity/animation mismatch.');
