// Independent static/short-replay audit. No BFS, game, save, or KB writes.
const fs=require('fs'),model=require('./ch4-19-readonly.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-19.json','utf8').replace(/^\uFEFF/,''));
const K=p=>p.join(','),prefix17='WDAXDDWWWSAAWWWAW';
function observation(path){return j.events.map((e,i)=>({i,o:e.observation})).reverse().find(z=>z.o?.level?.id==='counter'&&z.o.level.instructions===path&&z.o.level.timelines?.some(t=>t.entities));}
function simple(s){return{boxes:s.b.filter(b=>b.kind==='BOX'),free:s.p,actors:s.p.length+s.b.filter(b=>b.c).length};}
// Conditional local optical geometry only: never equate this to actual completed.
function rays(s){return[5,6,7].map(x=>{
 const near=s.b.find(b=>K(b.r)===K([x,7])),far=s.b.find(b=>K(b.r)===K([x,6]));
 const p7=s.p.find(p=>K(p.r)===K([x,7])),p6=s.p.find(p=>K(p.r)===K([x,6]));
 return{x,near:near?.kind||null,far:far?.kind||null,condition:near?.kind==='BOX'?'adjacent BOX closes branch (M054 conditional)':p7?'near live observer':far?.c||p6?'far live observer':far?'far empty BOX insufficient (M054)':'no observer'};
});}
const s17=model.replay(prefix17).s,direct=model.replay('X',s17),alternate=model.replay('DSSSSDDWASAWWWSSSDWX',s17);
const stackPaths=['WDAXDDWWWSAWWSDDWDAX','WDAXDDWWWSAWWWSSDDWWSAX'];
const stackAudit=stackPaths.map(path=>{const pre=model.replay(path.slice(0,-1));return{path,totalInputs:path.length,preInputs:path.length-1,preValid:pre.valid,pre:pre.valid?simple(pre.s):null,finalXAccepted:pre.valid&&model.replay('X',pre.s).valid,scope:'Existing model rejects different-origin BOX overlap; false is boundary, not physical disproof.'};});
const actual17=observation(prefix17),actual21=observation(prefix17+'DDWX');
function evidence(z){if(!z)return null;const l=z.o.level,t=l.timelines.find(t=>t.id===l.current_timeline)||l.timelines[0];return{event:z.i,instructions:l.instructions,completed:l.completed,prisms:t.entities.filter(e=>e.type==='PRISM').map(e=>({id:e.id,pos:e.pos,traversed:e.details.traversed,testCompleted:e.details.testCompleted})),players:t.entities.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,pos:e.pos,active:e.active,fork:e.properties.split,ghost:e.properties.ghost,contained:e.properties.contained,container:e.properties.container}))};}
const result={actual17:evidence(actual17),actualCentral21:evidence(actual21),directX:{valid:direct.valid,state:simple(direct.s),conditionalRays:rays(direct.s)},alternate20:{suffix:'DSSSSDDWASAWWWSSSDWX',valid:alternate.valid,state:simple(alternate.s),conditionalRays:rays(alternate.s)},stackAudit,
scope:'Independent actual flag audit plus four single-string replays; zero search expansions; no optical engine or stack propagation. First stack probe is total20, second23.'};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result,rays};
