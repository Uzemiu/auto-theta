// Public M133 animation fixture and original calibration frames, fixed only.
// Limited geometry assumption, not a whole-game physics claim.
// No new graph or game interaction.
const fs=require('fs');
// The rule clone is already generated. Calibration must not rewrite a live model.
const {createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const m=createModel(j.events[205].observation),r=m.step(m.start,0),tests=[];
function compare(s,t){const diffs=[];for(const e of t.entities.filter(e=>e.type==='PLAYER'||e.type==='BOX'&&e.active)){
 const p=(e.type==='PLAYER'?s.p:s.b).find(p=>p.id===e.id);if(!p){diffs.push({id:e.id,missing:true});continue;}
 const actual={pos:e.pos,active:e.active,md:e.properties.movingdir,src:e.properties.movingsrc},modeled={pos:[p.x,p.y],active:e.type==='PLAYER'?p.active:true,md:p.md<0?0:m.DIR[p.md],src:p.src};
 if(e.type==='PLAYER'){actual.face=e.properties.face;modeled.face=p.face;actual.ghost=e.properties.ghost;modeled.ghost=p.ghost;actual.mask=e.properties.maskedoff;modeled.mask=p.masked;}
 if(JSON.stringify(actual)!==JSON.stringify(modeled))diffs.push({id:e.id,actual,modeled});
 const expected={face:e.type==='PLAYER'?p.face:0,maskedoff:e.type==='PLAYER'?p.masked:0,contained:0,container:-1,height:1,movingdir:p.md<0?0:m.DIR[p.md],movingsrc:p.src,movingsrcext:0};
 if(e.type==='PLAYER')Object.assign(expected,{key:0,split:0,ghost:p.ghost});
 for(const key of new Set([...Object.keys(expected),...Object.keys(e.properties)])){
  if(!(key in expected))diffs.push({id:e.id,field:key,unknownPublicProperty:true,actual:e.properties[key]});
  else if(!(key in e.properties)||e.properties[key]!==expected[key])diffs.push({id:e.id,field:key,actual:e.properties[key],modeled:expected[key]});
 }
 }return diffs;}
function check(label,s,t){const diffs=s?compare(s,t):[{missing:true}];tests.push({label,match:!diffs.length,diffs});}
if(r.valid&&r.leaves.length===1){check('actual80 event207/time147 modeltick2',r.leaves[0].trace.find(t=>t.tick===2)?.state,j.events[207].observation.level.timelines[0]);check('actual80 event208/time151 stable including corpse109',r.leaves[0].state,j.events[208].observation.level.timelines[0]);}
if(r.valid&&r.leaves.length===1)for(let event=212;event<=218;event++){const t=j.events[event].observation.level.timelines[0],tick=t.time-j.events[205].observation.level.timelines[0].time-1;check('M133 rapid event'+event+'/time'+t.time+'/tick'+tick,r.leaves[0].trace.find(v=>v.tick===tick)?.state,t);}
const v=createModel(j.events[146].observation),vr=v.step(v.start,0);if(vr.valid&&vr.leaves.length===1)for(const [event,tick]of [[148,2],[149,5],[150,null]])check('prior actual71 event'+event,tick===null?vr.leaves[0].state:vr.leaves[0].trace.find(t=>t.tick===tick)?.state,j.events[event].observation.level.timelines[0]);
const g=createModel(j.events[100].observation),gr=g.step(g.start,0),by=c=>gr.leaves.find(l=>l.choices.join(',')===c.join(','));
if(gr.valid){for(const [event,c,tick,axis]of [[102,[106,106],2,null],[103,[106,106],5,0],[103,[108],5,1],[104,[106,106],6,0],[112,[106,106],null,0],[112,[106,109],null,1],[112,[108],null,2]]){const s=by(c),t=j.events[event].observation.level.timelines.find(t=>axis===null||t.axis[0]===axis);check('priorM131 event'+event+' choices'+c,tick===null?s?.state:s?.trace.find(t=>t.tick===tick)?.state,t);}}
const io=j.initial?.observation||j.initial||j.events[0]?.observation,full=createModel(io).replay(j.events[79].observation.level.instructions);if(full.valid&&full.states.length===1)check('prior fullactual64 all IDs/face',full.states[0].state,j.events[79].observation.level.timelines[0]);
const summary={valid:r.valid,leaves:r.leaves.length,forces:r.forces,boundaries:r.boundaries,tests,allMatch:tests.length===20&&tests.every(t=>t.match),stable:r.leaves.map(l=>m.describe(l.state)),scope:'20 exact frames: PLAYER/active BOX IDs, position, active and every public properties key; movingsrcext=0, player key/split=0, BOX face=0 asserted; unknown/missing keys fail. Static type/class/details, animation and runtime time not modeled. Isolated perpendicular vacate geometry assumption, other rotation/destination not actual fixtures. Fixed only, no graph or rule-file rewrite.'};
if(require.main===module)console.log(JSON.stringify(summary,null,2));module.exports={m,r,summary,compare};
