// Fixed public stable samples only, no graph and no game calls.
const fs=require('fs'),{createModel}=require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const m=createModel(j.events[74].observation),r=m.replay('WDSAWWDWAA');if(!r.valid)throw Error('source');
const s=r.states[0].state,t=m.replay('WDWD',s);if(!t.valid)throw Error('sample2');
function shapeState(s){return {p:s.p.map(e=>[e.id,e.x,e.y,e.face,+e.active,e.ghost,e.masked,e.md,e.src]).sort((a,b)=>a[0]-b[0]),b:s.b.map(e=>[e.x,e.y,e.md,e.src]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])};}
function shape(r){return {valid:r.valid,leaves:r.leaves.map(e=>({choices:e.choices,s:shapeState(e.state),trace:e.trace.map(t=>shapeState(t.state))})).sort((a,b)=>JSON.stringify(a.choices).localeCompare(JSON.stringify(b.choices))),boundaries:r.boundaries.map(e=>({kind:e.boundary,tick:e.tick,s:e.state&&shapeState(e.state),proposed:e.proposed&&shapeState(e.proposed)})),forces:r.forces.map(e=>({tick:e.tick,cell:e.cell,requests:e.requests.map(r=>[r.d,r.src,r.kind]).sort(),path:e.path}))};}
const tests=[];
for(const [label,base]of [['MODEL60 stable',s],['MODEL60+WDWD stable',t.states[0].state]])for(const kind of ['swap IDs only','reverse object array']){
 const p=m.clone(base);if(kind==='swap IDs only')[p.b[0].id,p.b[8].id]=[p.b[8].id,p.b[0].id];else p.b.reverse();
 for(let a=0;a<4;a++){const x=m.step(base,a),y=m.step(p,a),match=JSON.stringify(shape(x))===JSON.stringify(shape(y));tests.push({label,kind,a:m.A[a],match,firstBoundary:x.boundaries[0]?.boundary});}
}
const m80=createModel(j.events[100].observation),a80=m80.clone(m80.start);a80.b.reverse();
tests.push({label:'actual80 final W three-leaf calibration',kind:'reverse object array',a:'W',match:JSON.stringify(shape(m80.step(m80.start,0)))===JSON.stringify(shape(m80.step(a80,0)))});
if(require.main===module)console.log(JSON.stringify({allMatch:tests.every(t=>t.match),tests}));
module.exports={tests,shapeState,shape};
