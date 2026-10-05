// Exact public 2-G frames only; no search or game interaction.
const fs=require('fs'),{createModel}=require('./ch2-G-m132-blocked-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const obs=n=>j.events[n].observation;
const m=createModel(obs(100)),r=m.step(m.start,0);
const byChoices=choices=>r.leaves.find(z=>z.choices.join(',')===choices.join(','));
function compare(s,t){
 const out=[];
 for(const e of t.entities.filter(e=>e.type==='PLAYER'||(e.type==='BOX'&&e.active))){
  const z=(e.type==='PLAYER'?s.p:s.b).find(z=>z.id===e.id);if(!z){out.push({id:e.id,missing:true});continue;}
  const actual={at:e.pos,active:e.active};const modeled={at:[z.x,z.y],active:e.type==='PLAYER'?z.active:true};
  if(e.type==='PLAYER'){actual.face=e.properties.face;modeled.face=z.face;actual.ghost=e.properties.ghost;modeled.ghost=z.ghost;actual.masked=e.properties.maskedoff;modeled.masked=z.masked;}
  actual.md=e.properties.movingdir;modeled.md=z.md<0?0:m.DIR[z.md];actual.src=e.properties.movingsrc;modeled.src=z.src;
  if(JSON.stringify(actual)!==JSON.stringify(modeled))out.push({id:e.id,actual,modeled});
 }
 return out;
}
const tests=[];
function check(label,s,t){const diffs=compare(s,t);tests.push({label,match:!diffs.length,diffs});}
const leafA=byChoices([106,106]),leafW=byChoices([108]);
if(r.valid&&leafA&&leafW){
 check('event102 time130 / model tick2',leafA.trace.find(x=>x.tick===2).state,obs(102).level.timelines[0]);
 check('event103 first A-source branch / tick5',leafA.trace.find(x=>x.tick===5).state,obs(103).level.timelines.find(t=>t.axis[0]===0));
 check('event103 first W-source branch / tick5',leafW.trace.find(x=>x.tick===5).state,obs(103).level.timelines.find(t=>t.axis[0]===1));
 check('event104 retained A branch / tick6',leafA.trace.find(x=>x.tick===6).state,obs(104).level.timelines.find(t=>t.axis[0]===0));
 for(const [axis,choices]of [[0,[106,106]],[1,[106,109]],[2,[108]]])check('event112 actual83 stable axis'+axis,byChoices(choices).state,obs(112).level.timelines.find(t=>t.axis[0]===axis));
}
const initial=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,'' )).initial;
const io=initial?.observation||initial||j.events[0]?.observation;
let fixed64={valid:false,reason:'initial shape unavailable'};
if(io?.level){const b=createModel(io);fixed64=b.replay(obs(79).level.instructions);if(fixed64.valid&&fixed64.states.length===1)check('full actual64 all PLAYER/BOX fields',fixed64.states[0].state,obs(79).level.timelines[0]);}
const summary={valid:r.valid,leafCount:r.leaves.length,forces:r.forces,boundaries:r.boundaries,tests,allMatch:tests.length===8&&tests.every(x=>x.match),fixed64Valid:fixed64.valid,states:r.leaves.map(z=>({choices:z.choices,left:m.left(z.state),state:m.describe(z.state)}))};
if(require.main===module)console.log(JSON.stringify(summary,null,2));
module.exports={m,r,summary,compare,obs};
