// Exact retained parent2413439, fixed only; require has no write/search/game side effects.
const fs=require('fs'),{createModel}=require('./ch2-G-m133-source-model-oct05.cjs');
const sequence="DDAWDWAASSWDDASSDSASAWWDWAWDWADSDAWDWADW",parentIndex=2413439,checkpointStats={"expanded":1748972,"seen":2429310,"pending":722772,"concreteNodes":2491326,"done":1748972,"depthLimit":60,"depthCut":0,"depthDeferred":0,"maxDepth":53,"forces":1671,"maxLeaves":3,"priorityLeft":100,"targetPolicy":"leaf-resource-upper-bound-four","historicalHits":5,"completedParentRemainders":3};
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,'')),source=j.events[259].observation,m=createModel(source);
const prefix=sequence.slice(0,-1),before=m.replay(prefix);
if(!before.valid||before.states.length!==1||before.points.some(e=>e.states.length!==1))throw Error('Prefix changed');
const pre=before.states[0].state,last=m.step(pre,m.A.indexOf(sequence.at(-1)));
if(!last.valid||last.leaves.length!==2||last.leaves.some(l=>m.left(l.state)!==2))throw Error('Terminal strong layout changed');
const checkpoints=[];let s=m.start;for(let i=0;i<prefix.length;i++){const r=m.step(s,m.A.indexOf(prefix[i]));if(!r.valid||r.forces.length||r.leaves.length!==1)throw Error('Prefix transition changed');s=r.leaves[0].state;if((i+1)%4===0||i+1===prefix.length)checkpoints.push({input:i+1,state:m.describe(s)});}
const result={sourceEvent:259,sourceFrame:source.frame,parentIndex,sequence,length:sequence.length,prefix,checkpointStats,checkpoints,pre:m.describe(pre),probe:{action:sequence.at(-1),forces:last.forces,leaves:last.leaves.map(l=>({choices:l.choices,left:m.left(l.state),state:m.describe(l.state),trace:l.trace.map(t=>({...t,state:m.describe(t.state)}))}))},scope:'MODEL only, original conservativeM133. Two leaves each2free are sufficient resources, not a fourGoal completion. Concrete parent path was separately audited against retained q. Runtimetime/T/GMID must be actual; trace microticks are not runtime.'};
if(require.main===module)console.log(JSON.stringify(result));module.exports={m,source,sequence,parentIndex,checkpointStats,pre,last,final:last,result};
