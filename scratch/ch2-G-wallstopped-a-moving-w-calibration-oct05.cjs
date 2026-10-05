// Fixed old37 + actualW101 public windows, all public properties asserted.
const fs=require('fs'),Module=require('module');
const base=require.resolve('./ch2-G-m133-one-front-chain-calibration-oct05.cjs');
const code=fs.readFileSync(base,'utf8').replaceAll('ch2-G-m133-one-front-chain-model-oct05.cjs','ch2-G-m133-wallstopped-a-moving-w-model-oct05.cjs');
const prior=new Module(base,module);prior.filename=base;prior.paths=module.paths;prior._compile(code,base);
const {createModel}=require('./ch2-G-m133-wallstopped-a-moving-w-model-oct05.cjs');
const oldCompare=require('./ch2-G-m133-actual80-calibration-oct05.cjs').compare;
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const o=j.events[459].observation,t=o.level.timelines.find(t=>t.axis[0]===1),m=createModel(o,t);
const first=m.step(m.start,0),second=m.step(first.leaves[0].state,0),tests=[];
function check(label,s,t){const diffs=s?oldCompare(s,t):[{missing:true}];tests.push({label,match:!diffs.length,diffs});}
if(first.valid&&second.valid){
 for(const event of [529,530])check('actualW100 stable'+event,first.leaves[0].state,j.events[event].observation.level.timelines.find(t=>t.axis[0]===1));
 for(let event=532;event<=538;event++){
  const actual=j.events[event].observation.level.timelines.find(t=>t.axis[0]===1),tick=actual.time-167-1;
  check('actualW101 event'+event+'/tick'+tick,second.leaves[0].trace.find(t=>t.tick===tick)?.state,actual);
 }
 for(const event of [539,540])check('actualW101 stable'+event,second.leaves[0].state,j.events[event].observation.level.timelines.find(t=>t.axis[0]===1));
}
const summary={previous37:prior.exports.summary,newTests:tests,valid:first.valid&&second.valid,forceCount:second.forces.length,
 allMatch:prior.exports.summary.allMatch&&tests.length===11&&tests.every(t=>t.match),
 scope:'48 public frame/leaf records total, all PLAYER/activeBOX public property keys. Adds only A-facing sliding free arrivingICE with west trueWall clears md/src immediately, then same ordered stationaryA vs W-moving cross deactivates incoming W without ghost/mask/cargo. Other directions/twoMoving/Box-stop/order/heights remain unknown. Static/animation/time not modeled.'};
if(require.main===module)console.log(JSON.stringify(summary));
module.exports={m,first,second,summary};
