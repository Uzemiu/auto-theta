'use strict';
// Finite post-observation ordinary audit; no game input or hidden implementation.
// Seed first considered conditional; actual43/44 in 4-15.json events69/71/72
// subsequently confirmed stack formation, goal-collapse and inherited actors.
// This model does not generate that X/collapse, nor simulate any later overlaps.
const fs = require('fs'), vm = require('vm');
const source = fs.readFileSync('scratch/ch4-15-readonly.cjs', 'utf8');
const context = { require, process: { argv: [] }, console, module: { exports: {} } };
vm.runInNewContext(source.slice(0, source.indexOf("if(process.argv[2]==='replay')")) +
  '\nmodule.exports={step};', context);
const { step } = context.module.exports;
const goals = ['3,6','2,7','1,8','5,6','6,7','7,8'], at = p => p.join(',');
function audit(color) {
  const start = {b:[{r:[5,6],color},{r:[4,6],color:3},{r:[4,4],color:3},{r:[7,7],color:3}],
    p:[{r:[5,6],f:'A',fork:0,c:0,ghost:0},{r:[4,6],f:'A',fork:0,c:1,ghost:0},
       {r:[4,4],f:'A',fork:0,c:2,ghost:0},{r:[7,7],f:'A',fork:0,c:3,ghost:0},
       {r:[6,6],f:'A',fork:0,c:-1,ghost:0}],rem:[]};
  const hash = s => s.b.map(b => at(b.r)).join('|') + '|' +
    s.p.map(p => at(p.r)+','+p.c+','+p.ghost).sort().join(';');
  const coverage = s => goals.reduce((m,g,i) =>
    s.p.some(p => !p.ghost && at(p.r)===g) ? m|(1<<i) : m, 0);
  const q=[{s:start,path:''}], seen=new Set([hash(start)]), profiles=new Map();
  let head=0, depthCutoffStates=0, maxDepth=0;
  const cap=6000, depthLimit=35;
  while(head<q.length && head<cap) {
    const {s,path}=q[head++], mask=coverage(s); maxDepth=Math.max(maxDepth,path.length);
    if(!profiles.has(mask)) profiles.set(mask,{path,b:s.b,p:s.p});
    if(path.length>=depthLimit) {depthCutoffStates++;continue;}
    for(const a of 'WASD') {
      const n=step(s,a);
      // Later overlaps/new worldline observations/ghosts/X are not modeled.
      if(!n || n.rem.length || n.p.some(p=>p.ghost)) continue;
      const h=hash(n); if(seen.has(h))continue; seen.add(h);q.push({s:n,path:path+a});
    }
  }
  const masks=[...profiles.keys()], pairs=[];
  for(let i=0;i<masks.length;i++)for(let j=i;j<masks.length;j++)
    if((masks[i]|masks[j])===63)pairs.push([masks[i],masks[j]]);
  return {collapsedSourceColor:color,expanded:head,seen:seen.size,queue:q.length,cap,depthLimit,
    maxDepth,depthCutoffStates,wholeConstrainedGraphExhausted:head===q.length&&depthCutoffStates===0,
    profiles:[...profiles].map(([mask,x])=>({mask,goals:goals.filter((g,i)=>mask&(1<<i)),...x})),
    pairsCoverAllSix:pairs};
}
const results=[audit(4),audit(3)];
console.log(JSON.stringify({model:'actual44 seed: 4 cargoFork0 + 1 free; restricted ordinary/no-new-stack domain',results}));
