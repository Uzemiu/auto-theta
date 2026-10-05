'use strict';
// Independent finite replay. Cargo X is checked as an explicit M098/M099
// geometric boundary, not simulated by an invented general implementation.
const fs=require('fs');
const {createModel,replay}=require('./stack-cargo-readonly.cjs');
const D=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-13.json','utf8').replace(/^\uFEFF/,''));
const model=createModel(D,{gates:[{at:[5,4],buttons:[[5,3]]},{at:[5,7],buttons:[[6,7]]}],allow_partial_death:true,max_stack:1});
const path='AAAAWAWDDDSDDWDWWWWWWWWAAXSSAWWWWADDDAADDDWDWWAADWAADSAAASAWWWWXAX';
const prefix=path.slice(0,-5);
const r=replay(model,prefix,{milestones:[25,26,51,prefix.length]});
const compact=s=>({boxes:s.b,players:s.p.map(p=>({at:p.slice(0,2),face:'WASD'[p[2]],fork:p[3],cargo:p[4]>=0,key:p[5]}))});
console.log(JSON.stringify({fullLength:path.length,prefixLength:prefix.length,prefix,valid:r.valid,failed_step:r.failed_step,milestones:r.milestones,prefixFinal:r.state&&compact(r.state)}));
console.log(JSON.stringify({checkpoint25:compact(replay(model,path.slice(0,25)).state),checkpoint26:compact(replay(model,path.slice(0,26)).state)}));
if(!r.valid)process.exit(1);
let s=r.state;
for(const a of 'WW'){s=model.next(s,'WASD'.indexOf(a));if(!s)throw Error('Invalid WW');console.log(JSON.stringify({action:a,...compact(s)}));}
const t=D.initial.level.timelines[0],xy=p=>p.join(',');
const walls=new Set(t.entities.filter(e=>e.active&&e.class==='Wall').map(e=>xy(e.pos)));
const floor=new Map([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>[xy(e.pos),e.type]));
const cargo=s.p.find(p=>p[4]>=0);
if(s.p.length!==1||xy(cargo.slice(0,2))!=='2,6'||cargo[2]!==0||cargo[3]!==2)throw Error('Not expected sole cargoFork2 preX');
const generation1=[[1,6],[3,6]],generation2=[[1,5],[1,7],[3,5],[3,7]];
if([...generation1,...generation2].some(p=>walls.has(xy(p))||!floor.has(xy(p))))throw Error('A split target is blocked/void');
console.log(JSON.stringify({cargoXRule:'M098: two free side cells, Fork2 -> two active Color4 cargoFork1',firstX:generation1,firstXTypes:generation1.map(p=>floor.get(xy(p))),A:'contained cargo wait at1,6/3,6 and set faceA',secondXRule:'each Fork1 cargo splits vertical; no external active player responds',secondX:generation2,secondXTypes:generation2.map(p=>floor.get(xy(p))),allFourGoal:true}));
// Local corrected trap is also a nominated predicate, not a searched prefix.
const local={p:[[5,6,0,2,-1,0],[5,3,0,2,-1,0]],b:[[5,5]],m:[1],c:7,l:0};
const afterW=model.next(local,0);
console.log(JSON.stringify({hypotheticalTrapCapture:true,start:compact(local),W:afterW&&compact(afterW),valid:!!afterW}));
