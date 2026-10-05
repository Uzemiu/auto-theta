// Fixed public-map checks only. No graph enumeration, Bridge, game, or save calls.
const fs = require('fs'), assert = require('assert/strict');
const {createModel} = require('./ch2-G-m131-source-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,''));
const actualEvents=[79,84,87,91,94,96,98,100];
const actual=actualEvents.map(i=>{
  const o=j.events[i].observation,t=o.level.timelines[0];
  const e=id=>t.entities.find(e=>e.id===id);
  return {event:i,n:o.level.instructions.length,time:t.time,tail:o.level.instructions.slice(64),
    receiver109:e(109).pos,box114:e(114).pos};
});
const m=createModel(j.events[79].observation);
const path='WDWDSDAD',r=m.replay(path);
assert(r.valid&&r.states.length===1&&r.states[0].choices.length===0);
const base=r.states[0].state;
const p=(s,id)=>s.p.find(e=>e.id===id);
assert.deepEqual([p(base,108).x,p(base,108).y],[6,10]);
assert.deepEqual([p(base,109).x,p(base,109).y],[6,4]);
const continuations=['S','SS','W','A','D'].map(seq=>{
  const z=m.replay(seq,base);assert(z.valid&&z.states.length===1);
  return {seq,players:z.states[0].state.p.filter(e=>e.active).map(e=>({id:e.id,pos:[e.x,e.y],face:m.A[e.face]}))};
});
const q=createModel(j.events[44].observation);
const earlyPath='AWWWWASDSA',early=q.replay(earlyPath);
assert(early.valid&&early.states.length===1);
const earlyState=early.states[0].state;
assert.equal(earlyState.p.filter(e=>e.active).length,5);
assert(earlyState.b.some(e=>e.id===111&&e.x===8&&e.y===4));
const failure=q.replay('DWW',earlyState);
assert(failure.valid&&failure.states.length===1);
const lost=p(failure.states[0].state,107);
assert(!lost.active&&lost.ghost===1&&lost.x===8&&lost.y===4);
console.log(JSON.stringify({actual,path,new72:m.describe(base),continuations,
  earlyPath,earlyBox111:[8,4],earlyFiveAlive:true,
  next:'DWW',receiver107:{pos:[lost.x,lost.y],active:lost.active,ghost:lost.ghost},
  scope:'Fixed model checks only. No proposed game input or general impossibility claim.'},null,2));
