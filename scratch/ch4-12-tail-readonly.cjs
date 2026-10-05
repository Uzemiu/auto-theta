'use strict';
// Finite conditional tails only; no input, conflict/capture search, or game code.
// Ordinary movement uses the observed model. Cargo X is an explicitly limited
// M099 boundary substitution at 1,3/W, not a general hidden implementation.
const fs=require('fs');
const {createModel}=require('./stack-cargo-readonly.cjs');
const record=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-12.json','utf8').replace(/^\uFEFF/,''));
const index=record.events.findIndex(e=>e.observation?.level?.instructions==='DDDWDXWWWSSDDWSSX');
if(index<0)throw Error('Need actual17');
const model=createModel(record,{observation_event:index,gates:[{at:[7,4],buttons:[[6,2]]}],allow_partial_death:true,max_stack:1});
const clone=s=>JSON.parse(JSON.stringify(s));
const xy=p=>p.slice(0,2).join(',');
const t=record.initial.level.timelines[0];
const walls=new Set(t.entities.filter(e=>e.active&&e.class==='Wall').map(e=>xy(e.pos)));
function start(box,free,fork){return {p:[[...box,0,1,0,0],[...free,0,fork,-1,0]],b:[box.slice()],m:[1],c:0,l:0};}
function short(s){return {boxes:s.b,players:s.p.map(p=>({at:p.slice(0,2),face:'WASD'[p[2]],fork:p[3],cargo:p[4]>=0,key:p[5]}))};}
function next(s,a){
  if(a!=='X')return model.next(s,'WASD'.indexOf(a));
  const cargo=s.p.find(p=>p[4]>=0&&p[3]>0);
  if(!cargo)return model.next(s,4);
  if(xy(cargo)!=='1,3'||cargo[2]!==0||!walls.has('0,3')||!walls.has('1,4'))throw Error('Cargo X outside audited M099 boundary');
  const onlyFree=clone(s);onlyFree.p=onlyFree.p.filter(p=>p[4]<0);
  const n=model.next(onlyFree,4);
  if(!n||n.b.length!==1||xy(n.b[0])!=='1,3')throw Error('Unexpected external X effect');
  n.b[0]=[2,3];n.p.push([2,3,cargo[2],0,0,cargo[5]]);
  return n;
}
function auditLeft(fork,path){
  let s=start([1,3],[2,3],fork);const out={name:`Left/freeFork${fork}`,conditional:true,path,start:short(s),steps:[]};
  for(const a of path){s=next(s,a);if(!s)throw Error(`Invalid ${out.steps.length+1}/${a}`);out.steps.push({action:a,...short(s)});}
  out.final=short(s);console.log(JSON.stringify(out));
}
auditLeft(1,'WXSSDSSAWWWWW');
auditLeft(0,'WXSDSSAWWWWW');
for(const fork of [0,1]){
  let s=start([2,4],[2,3],fork);const rows=[];
  for(const a of 'WWW'){s=next(s,a);if(!s)throw Error('Invalid Up WWW');rows.push(short(s));}
  const c=s.p.find(p=>p[4]>=0);
  if(s.p.length!==1||xy(c)!=='2,7'||c[2]!==0||c[3]!==1||walls.has('1,7')||walls.has('3,7'))throw Error('Bad Up preX');
  console.log(JSON.stringify({name:`Up/freeFork${fork}`,conditional:true,path:'WWWX',preX:short(s),movementRows:rows,cargoXRule:'M098: two free side cells 1,7/3,7; consume fork, copy Color4 container',expectedFinal:{cargo:[[1,7],[3,7]],fork:0,free:[]}}));
}
