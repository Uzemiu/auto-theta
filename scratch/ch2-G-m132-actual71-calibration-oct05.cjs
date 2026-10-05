// Narrow actual70 -> 71 plus original eight M131 checkpoints, fixed only.
const fs=require('fs'),{createModel}=require('./ch2-G-m132-blocked-source-model-oct05.cjs');
const prev=require('./ch2-G-m132-blocked-calibration-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const m=createModel(j.events[146].observation),r=m.step(m.start,0),tests=[];
for(const [event,tick]of [[148,2],[149,5],[150,null]]){
 const s=tick===null?r.leaves[0]?.state:r.leaves[0]?.trace.find(x=>x.tick===tick)?.state;
 const diffs=s?prev.compare(s,j.events[event].observation.level.timelines[0]):[{missing:true}];
 tests.push({event,tick,match:diffs.length===0,diffs});
}
const summary={actual71Valid:r.valid,leafCount:r.leaves.length,forces:r.forces,boundaries:r.boundaries,tests,allMatch:tests.every(x=>x.match),originalM131:{allMatch:prev.summary.allMatch,tests:prev.summary.tests},stable:r.leaves.map(z=>m.describe(z.state))};
if(require.main===module)console.log(JSON.stringify(summary,null,2));
module.exports={m,r,summary};
