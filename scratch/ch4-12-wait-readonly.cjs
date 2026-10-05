'use strict';
// Finite local geometry enumeration and nominated replay only; no BFS/input.
const fs=require('fs');
const {createModel}=require('./stack-cargo-readonly.cjs');
const D=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-12.json','utf8').replace(/^\uFEFF/,''));
const idx=D.events.findIndex(e=>e.observation?.level?.instructions==='DDDWDXWWWSSDDWSSX');
const model=createModel(D,{observation_event:idx,gates:[{at:[7,4],buttons:[[6,2]]}],allow_partial_death:true,max_stack:1});
const t=D.initial.level.timelines[0],xy=p=>p.join(',');
const walls=new Set(t.entities.filter(e=>e.active&&e.class==='Wall').map(e=>xy(e.pos)));
const floor=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>xy(e.pos)));
const safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...t.entities.filter(e=>e.floor)].map(e=>xy(e.pos)));
const dirs=[[0,1],[-1,0],[0,-1],[1,0]],mv=(p,d)=>[(p[0]+d[0]+9)%9,(p[1]+d[1]+9)%9];
const positions=[...floor].map(x=>x.split(',').map(Number)).filter(p=>!walls.has(xy(p)));
function isWait(p,b,buttonOpen){
  // Occupants of the gate also hold their individual gate open (M049/M099).
  const opened=buttonOpen||xy(p)==='7,4'||xy(b)==='7,4';
  const block=z=>walls.has(xy(z))||(!opened&&xy(z)==='7,4');
  return dirs.every(d=>{
    const z=mv(p,d);if(block(z))return true;
    if(xy(z)!==xy(b))return false; // Spike also means MOVE/death, not WAIT.
    const back=mv(b,d);return block(back)||!floor.has(xy(back));
  });
}
for(const buttonOpen of [false,true]){
 const waits=[];
 for(const p of positions.filter(p=>safe.has(xy(p))))for(const b of positions){
  if(xy(p)===xy(b)||xy(b)==='6,2'||xy(p)==='6,2')continue;
  if(isWait(p,b,buttonOpen))waits.push({free:p,box:b});
 }
 console.log(JSON.stringify({buttonOpen,checkedSafeFree:positions.filter(p=>safe.has(xy(p))).length,boxCells:positions.length,waits}));
}
function replay(name,s,path){
 const compact=s=>({players:s.p.map(p=>({at:p.slice(0,2),face:'WASD'[p[2]],fork:p[3],cargo:p[4]>=0})),box:s.b});
 const out={name,hypothetical:true,start:compact(s),path,steps:[]};
 for(const a of path){s=model.next(s,'WASDX'.indexOf(a));if(!s)throw Error('Invalid finite replay');out.steps.push({action:a,...compact(s)});}
 console.log(JSON.stringify(out));
}
// First W is an ordinary wait. A second actor then reaches 6,2 to open gate.
replay('free7,5 BOX7,6', {p:[[7,5,0,1,-1,0],[6,1,0,0,-1,0]],b:[[7,6]],m:[1],c:0,l:0},'WSSS');
replay('free7,6 BOX7,5', {p:[[7,6,0,1,-1,0],[6,1,0,0,-1,0]],b:[[7,5]],m:[1],c:0,l:0},'WSS');
