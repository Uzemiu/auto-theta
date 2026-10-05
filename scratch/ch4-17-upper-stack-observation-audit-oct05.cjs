// Fixed public-journal audit only: no Bridge, input, saves, KB edits or game BFS.
// The small body-cell closure below ignores all entities, pushes on SPIKE,
// resource availability and player reachability. It is a necessary-condition
// relaxation for ordinary rigid BOX/group translation, including box chains.
const fs=require('fs'),assert=require('assert');
const base=require('./ch4-17-readonly.cjs');
const engine=require('./ch4-17-double-cargo-oct05.cjs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-17.json','utf8'));
const initial=raw.initial.level.timelines[0];
const prefix='SDDDDWAXDWAWSWAWSDSAWWSAADWAX';
const pre=base.replay(prefix.slice(0,-1));
assert(pre.valid);
const seed=engine.secondX(pre.s);
const K=r=>r.join(','),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]};
const add=(r,v)=>[r[0]+v[0],r[1]+v[1]];
const actual29=raw.events.map((e,index)=>({index,observation:e.observation})).find(e=>e.observation&&e.observation.level&&e.observation.level.instructions===prefix);
assert(actual29,'Historical actual29 frame missing');
const level29=actual29.observation.level,t29=level29.timelines.find(t=>t.id===level29.current_timeline);
const actualBoxes=t29.entities.filter(e=>e.active&&e.type==='BOX');
const actualOutside=t29.entities.filter(e=>e.active&&e.type==='PLAYER'&&!e.properties.contained);
assert.deepStrictEqual(actualBoxes.map(e=>K(e.pos)).sort(),seed.b.map(e=>K(e.r)).sort());
assert.deepStrictEqual(actualOutside.map(e=>K(e.pos)).sort(),seed.p.map(K).sort());
assert(t29.entities.filter(e=>e.active&&e.type==='PLAYER').every(e=>e.properties.split===0&&e.properties.ghost===0));
function fixed(path){
 let leaves=[{s:seed,choices:[]}],trace=[];
 for(let i=0;i<path.length;i++){
  const next=[];
  for(const z of leaves){
   const ns=engine.step(z.s,path[i],path.slice(0,i+1));
   assert(ns.length,'Unmodeled fixed boundary at '+path.slice(0,i+1));
   for(const n of ns)next.push({s:n.s,choices:z.choices.concat(n.axis?[{n:i+1,axis:n.axis,conditional:!!n.conditional}]:[])});
  }
  leaves=next;trace.push({n:i+1,key:path[i],leaves:JSON.parse(JSON.stringify(leaves))});
 }
 return {path,trace,leaves:leaves.map(z=>({...z,mask:base.mmask(z.s)}))};
}
function bodyCellClosure(r){
 const queue=[r],seen=new Set([K(r)]),edges=[];
 for(let head=0;head<queue.length;head++)for(const[d,v]of Object.entries(V)){
  const current=queue[head],target=add(current,v),support=add(current,[-v[0],-v[1]]);
  // support may be a pusher OR another member of a chain. Either must have
  // non-Wall, existing terrain. Thus this remains necessary for remote pushes.
  if(base.blocked(target)||base.blocked(support))continue;
  edges.push({from:current,to:target,d,support});
  if(!seen.has(K(target))){seen.add(K(target));queue.push(target);}
 }
 return {source:r,cells:queue,edges};
}
const windows=['WWAWWWDSSA','WWDAWADAAS','WWDAWADAASSS'].map(fixed);
assert(windows[0].leaves.length===1&&windows[0].leaves[0].s.b.some(b=>b.ids.length===2&&K(b.r)==='1,3'));
assert(windows[1].leaves.length===1&&windows[1].leaves[0].s.b.some(b=>b.ids.length===2&&K(b.r)==='3,3'));
assert(windows[2].leaves.length===2);
assert(windows[2].leaves.every(z=>z.mask===34&&z.s.p.length===0));
const closures=seed.b.map(b=>({ids:b.ids,...bodyCellClosure(b.r)}));
assert(closures.every(c=>!c.cells.some(r=>r[1]===7&&r[0]>=2&&r[0]<=6)));
const blockerCells=[[3,6],[3,8],[5,6],[5,8],[0,7],[8,7]];
const blockers=blockerCells.map(pos=>({pos,entities:initial.entities.filter(e=>K(e.pos)===K(pos)).map(e=>({id:e.id,type:e.type,class:e.class,active:e.active,blockable:e.blockable}))}));
assert(blockers.every(c=>c.entities.some(e=>e.active&&e.class==='Wall'&&e.blockable)));
const old=JSON.parse(fs.readFileSync('scratch/results/ch4-17-low29-tail-oct05-result.json','utf8'));
const oldMetrics=Object.fromEntries(['expanded','seen','pending','cut','exhausted','cap','depth','rootMasks','stats'].map(k=>[k,old[k]]));
const result={sourcePrefix:prefix,actualSourceEvent:actual29.index,actualSourceTime:t29.time,seed,oldMetrics,windows,blockers,closures,
 scope:'Fixed replay + relaxed body-cell necessary condition only. No new game-state search. No upper BOX/stack Goal is reachable by ordinary rigid translation from actual29; unknown layer separation/new resources are not covered. Goal-observation replay remains conditional, not actual 4-17 evidence.'};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={result,fixed,bodyCellClosure};
