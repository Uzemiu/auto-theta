// Read-only fixed replay of actual60 and one unknown free-v-movingBox probe.
// No graph search, bridge/UI/save/hidden implementation calls.
const fs=require('fs'),{createModel}=require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const actual=j.events[131].observation,m=createModel(actual),tail='DDWASAWADW';
const old=createModel(j.events[74].observation),deployed=old.replay('WDSAWWDWAA');
const shape=s=>JSON.stringify({p:s.p.map(p=>[p.id,p.x,p.y,p.face,p.active,p.ghost,p.masked,p.md,p.src]),b:s.b.map(b=>[b.id,b.x,b.y,b.md,b.src])});
if(!deployed.valid||shape(deployed.states[0].state)!==shape(m.start))throw Error('actual60 differs from MODEL60');
const r=m.replay(tail);if(!r.valid||r.states.length!==1)throw Error('preProbe10 not single valid stable leaf');
const compact=s=>({players:s.p.map(p=>`${p.id}:${p.x},${p.y}/${m.A[p.face]}${p.active?'':`/deadG${p.ghost}M${p.masked}`}`),boxes:s.b.map(b=>`${b.id}:${b.x},${b.y}`)});
const pre=r.states[0].state,probe=m.step(pre,0);
const summary={sourceEvent:131,sourceActualInputs:60,sourceMatchesModel60:true,tail,prefix:r.points.map(p=>({n:p.step,a:p.a,prefix:tail.slice(0,p.step),...compact(p.states[0].state)})),pre:m.describe(pre),probe:{valid:probe.valid,forces:probe.forces,boundaries:probe.boundaries.map(z=>({...z,state:m.describe(z.state)}))}};
if(require.main===module)console.log(JSON.stringify(summary,null,2));
module.exports={m,r,pre,probe,summary};
