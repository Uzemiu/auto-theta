// Candidate-only geometric audit of recorded 3-37 states. No game input.
// Reuses the observed-rule rigid-stack model; no optical/worldline simulator.
'use strict';
const fs = require('fs');
const api = require('./stack-cargo-readonly.cjs');
const r = JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-37.json','utf8').replace(/^\uFEFF/,''));
const raw161 = r.events[23].observation.level.instructions;
const base = api.createModel(r, {allow_partial_death:false});
const replay161 = api.replay(base, raw161);
const snapshot161 = api.createModel(r, {observation_event:23,allow_partial_death:false});
const validation = {steps:raw161.length,valid:replay161.valid,
  agrees_on_geometry_resources_cargo:replay161.valid &&
    JSON.stringify(replay161.final)===JSON.stringify(snapshot161.describe(snapshot161.start)),
  item_bit_note:'Initial model remembers the already-collected fork bit; snapshot model omits inactive KEY. This bit is not compared.'};

function holdCargoAudit(timeline_index) {
  const m = api.createModel(r,{observation_event:25,timeline_index,allow_partial_death:false});
  const initial = m.start;
  const cp = initial.p.find(p=>p[4]>=0);
  const heldMask = initial.m[cp[4]];
  const fixedCargo = s => s.p.some(p=>p[4]>=0 && s.m[p[4]]===heldMask && p[0]===9 && p[1]===6);
  const changedBodies = s=>s.b.some((b,j)=>{
    const k=initial.m.indexOf(s.m[j]);
    return k<0 || b.join(',')!==initial.b[k].join(',');
  });
  const q=[initial],seen=new Set([m.serial(initial)]),firstMove=[];
  let processed=0;
  for(let head=0;head<q.length && head<20000;head++) {
    processed++;
    const s=q[head];
    for(let a=0;a<4;a++) {
      const n=m.next(s,a);
      if(!n || n.p.length!==2 || !fixedCargo(n))continue;
      if(changedBodies(n))firstMove.push(m.describe(n));
      const h=m.serial(n);if(seen.has(h))continue;
      seen.add(h);q.push(n);
    }
  }
  return {timeline_index,processed,seen:seen.size,exhausted:processed===q.length,
    any_body_moved:firstMove.length>0,first_moved:firstMove[0]||null,
    initial:m.describe(initial)};
}

function compositions(total, length, prefix=[]) {
  if(length===1)return [[...prefix,total]];
  const out=[];
  for(let a=1;a<=total-length+1;a++)out.push(...compositions(total-a,length-1,[...prefix,a]));
  return out;
}
// Counts only a north-pushed linear spine: cargo front begins (9,5), n bodies
// occupy rows 6-n..5, pusher row 5-n. No removals, capture, side inputs, or
// container copies. Goal observations occur when each body's row becomes 6.
// Branch siblings may stop independently. Enumerate abstract right goal masks.
function spineMasks(groups) {
  const maxStep=groups.length; // Final push enters spike at pusher (9,5).
  function descend(step) {
    if(step>maxStep)return new Set([0]);
    // The front cargo reaches y=5+step.
    const goalBit=step>=1&&step<=4 ? 1<<(step-1):0;
    let branchCount=1;
    for(let i=0;i<groups.length;i++)if(step===i+1)branchCount*=groups[i];
    const next=descend(step+1);
    let leaves=new Set([0]);
    const choices=new Set([goalBit,...next]);
    for(let i=0;i<branchCount;i++) {
      const combined=new Set();
      for(const a of leaves)for(const b of choices)combined.add(a|b);
      leaves=combined;
    }
    return leaves;
  }
  return descend(1);
}
const linear = [];
for(let n=1;n<=4;n++)for(const counts of compositions(6,n)) {
  const masks=spineMasks(counts);
  linear.push({counts,max_cargo_y:5+n,right_four_possible:masks.has(15),
    best_right_goal_count:Math.max(...[...masks].map(x=>x.toString(2).replace(/0/g,'').length))});
}
console.log(JSON.stringify({model:'candidate-only',validation,
  hold9_6:[holdCargoAudit(0),holdCargoAudit(1)],
  fixed_north_spines:{compositions:linear.length,any_four:linear.some(x=>x.right_four_possible),
    four_body_cases:linear.filter(x=>x.counts.length===4)}},null,2));
