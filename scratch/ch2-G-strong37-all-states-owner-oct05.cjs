// Fixed public-observation MODEL stable states0..37, no search/write/game.
const fs=require('fs'),assert=require('assert/strict');
const {m,result,sequence}=require('./ch2-G-m133-two-leaf-two-free-probe-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const source=j.events[418].observation,tail=sequence.slice(0,-1),r=m.replay(tail);
assert.equal(sequence,'DDAWDWAASSWDDASSDSAADAWWWDWADSDAWDWADW');
assert(result.allEarlierAccepted&&r.valid&&r.points.every(p=>p.states.length===1&&p.states[0].choices.length===0));
const base=source.level.timelines[0].entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'),v=[[0,1],[-1,0],[0,-1],[1,0]];
const stableStates=[];
for(let n=0;n<=37;n++){
 const s=n?r.points[n-1].states[0].state:m.start,expected=structuredClone(base);
 for(const e of expected){const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id);assert(z);
  e.pos=[z.x,z.y];e.properties.movingdir=z.md<0?0:m.DIR[z.md];e.properties.movingsrc=z.md<0?-1:z.src;
  if(e.type==='PLAYER'){e.active=z.active;e.face=v[z.face];e.properties.face=z.face;e.properties.ghost=z.ghost;e.properties.maskedoff=z.masked;}
 }
 stableStates.push({n,totalInput:60+n,instructions:source.level.instructions+tail.slice(0,n),entities:expected});
}
console.log(JSON.stringify({sequence,sourceEvent:418,sourceInstructions:source.level.instructions,stableStates,scope:'Only fixed valid raw37 stable whole14 fields. Model ticks are not runtime time. No actual snapshot invented for missing historical inputs.'}));
