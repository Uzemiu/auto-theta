// Fixed public frames only, all public properties keys asserted.
// No search/rule writes/game or canonical operations on require.
const fs=require('fs'),Module=require('module');
const filename=require.resolve('./ch2-G-m133-actual80-calibration-oct05.cjs');
const code=fs.readFileSync(filename,'utf8').replace("require('./ch2-G-m133-source-model-oct05.cjs')","require('./ch2-G-m133-one-front-chain-model-oct05.cjs')");
const old=new Module(filename,module);old.filename=filename;old.paths=module.paths;old._compile(code,filename);
const {createModel}=require('./ch2-G-m133-one-front-chain-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const tests=[];
function check(label,s,t){const diffs=s?old.exports.compare(s,t):[{missing:true}];tests.push({label,match:!diffs.length,diffs});}
const o=j.events[482].observation,t=o.level.timelines.find(t=>t.axis[0]===0),m=createModel(o,t),r=m.step(m.start,0);
if(r.valid&&r.leaves.length===1){
 for(let event=485;event<=491;event++){
  const a=j.events[event].observation.level.timelines.find(t=>t.axis[0]===0),tick=a.time-t.time-1;
  check('actual112 event'+event+'/tick'+tick,r.leaves[0].trace.find(z=>z.tick===tick)?.state,a);
 }
 for(const event of [492,493])check('actual112 stable'+event,r.leaves[0].state,j.events[event].observation.level.timelines.find(t=>t.axis[0]===0));
}
const strongo=j.events[448].observation,st=strongo.level.timelines[0],g=createModel(strongo,st),gr=g.step(g.start,0);
if(gr.valid){
 for(let event=451;event<=456;event++){
  const a=j.events[event].observation.level.timelines[0],tick=a.time-st.time-1;
  check('strong98 event'+event+'/tick'+tick,gr.leaves[0].trace.find(z=>z.tick===tick)?.state,a);
 }
 for(const [axis,winner]of [[0,106],[1,109]])check('strong98 stable459 axis'+axis,gr.leaves.find(l=>l.choices[0]===winner)?.state,j.events[459].observation.level.timelines.find(t=>t.axis[0]===axis));
}
const summary={old20:old.exports.summary,valid:r.valid,forces:r.forces,boundaries:r.boundaries,tests,
 allMatch:old.exports.summary.allMatch&&tests.length===17&&tests.every(t=>t.match),
 scope:'20 previous frames +9 actual112 frames +8 strong98 frames. Every public properties key asserted; missing/unknown fails. Static type/class/details/animation/runtime time not modeled. One stationary SPIKE front->empty ICE, terminal two-stopped-Box Wall braking linked to the transferred front only; rotations are model hypotheses, longer push chains/moving fronts/co-destinations/stack remain unknown.'};
if(require.main===module)console.log(JSON.stringify(summary));
module.exports={m,r,gr,summary};
