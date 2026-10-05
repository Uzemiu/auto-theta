// One new finite domain, narrowed within the same <=5000 budget:
// first same-face moving/BOX-push-stopped crossing, with >=3 left surviving stable.
// Stops at the first newly supported window; no game, UI, save or canonical writes.
const fs=require('fs'),assert=require('assert'),{createModel}=require('./ch2-G-m045-model-oct05.cjs');
const j=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/2-G.json','utf8').replace(/^\uFEFF/,'')),m=createModel(j.initial);
const prefix='AWWWSSAAWWWWWWWAADADSDSAADSSAWDWAWDWAWDSSSSSSSSAWWDWAAWWDDASDSAA';
const fixed=m.replay(prefix);assert(fixed.valid);assert.equal(fixed.points.length,64);
const o=j.events[79].observation,l=o.level,t=l.timelines.find(t=>t.id===l.current_timeline)||l.timelines[0],es=new Map(t.entities.map(e=>[e.id,e]));
assert.equal(l.instructions,prefix);
for(const p of fixed.state.p){const e=es.get(p.id);assert(e.active);assert.deepEqual(e.pos,[p.x,p.y]);assert.equal(e.properties.face,p.face);assert.equal(e.properties.ghost,0);assert.equal(e.properties.contained,0);}
for(const b of fixed.state.b){assert(es.get(b.id).active);assert.deepEqual(es.get(b.id).pos,[b.x,b.y]);}
assert.equal(t.entities.filter(e=>e.type==='PLAYER'&&e.active).length,5);assert.deepEqual(es.get(105).pos,[14,6]);
const cap=5000,depthLimit=35,clean=s=>({p:s.p.map(e=>({...e})),b:s.b.map(e=>({...e}))}),q=[{s:clean(fixed.state),path:''}],seen=new Set([m.serial(fixed.state)]);
let head=0,depthCut=0,hit=null;const boundary={},first={},inertiaWindows=[];
while(head<q.length&&head<cap&&!hit){
 const n=q[head++];if(n.path.length>=depthLimit){depthCut++;continue;}
 for(let a=0;a<4;a++){
  const path=n.path+m.A[a],old={...m.stats},r=m.next(n.s,a,{find_probe:true,firstSameFaceCross:true,boxStoppedOnly:true,strictCross:true});
  if(!r){for(const k of Object.keys(old))if(m.stats[k]>old[k]){boundary[k]=(boundary[k]||0)+1;first[k]??={path,pre:m.describe(n.s)};}continue;}
  if(r.conflict){if(r.proposedPlayers.length>=3){hit={type:'first-safe-force',path,pre:m.describe(n.s),result:r};break;}boundary.unsafeForce=(boundary.unsafeForce||0)+1;continue;}
  if(r.probe){
   if(r.probe==='different-inertial-BOX-requests'||r.probe==='perpendicular-free-box')inertiaWindows.push({path,pre:m.describe(n.s),kind:r.probe,box:r.box,tick:r.tick,requests:r.requests,boxMovement:r.boxMovement,pusher:r.pusher,pushDirection:r.pushDirection,micro:r.state?m.describe(r.state):null,proposed:r.proposedPlayers,traceRequests:r.trace?.filter(x=>x.requested.length).map(x=>({tick:x.tick,requested:x.requested}))});
   if(r.probe==='same-face-moving-stopped'&&r.proposedPlayers.length>=3){
    const z=m.next(n.s,a,{find_probe:true,strictCross:true});
    if(z&&!z.probe&&!z.conflict&&z.p.length>=3){hit={type:'M045-useful-BOX-stopped-window',path,pre:m.describe(n.s),result:r};break;}
    if(z?.conflict&&z.proposedPlayers.length>=3){hit={type:'M045-BOX-stopped-before-safe-force',path,pre:m.describe(n.s),result:r,continuation:z};break;}
    boundary.unhelpfulBoxStoppedCross=(boundary.unhelpfulBoxStoppedCross||0)+1;first.unhelpfulBoxStoppedCross??={path,pre:m.describe(n.s),result:r,continuation:z};continue;
   }
   boundary[r.probe]=(boundary[r.probe]||0)+1;first[r.probe]??={path,pre:m.describe(n.s),result:r};continue;
  }
  if(r.p.length<3){boundary.lessThanThreeLive=(boundary.lessThanThreeLive||0)+1;continue;}
  const k=m.serial(r);if(seen.has(k))continue;seen.add(k);q.push({s:clean(r),path});
 }
}
let stable=null;if(hit){const prev=m.replay(hit.path.slice(0,-1),fixed.state);assert(prev.valid);const z=m.next(prev.state,m.A.indexOf(hit.path.at(-1)),{find_probe:true,strictCross:true});stable=z&&!z.conflict&&!z.probe?{state:m.describe(z),crossings:z.crossings,ticks:z.trace.length}:z;}
const result={source:'actual64/event79, all left IDs/faces and9BOX fixed match',target:'M045 BOX-push-stopped first-cross and stable >=3 functional left, or safe force',calibration:'2-21 events15→17 exact match; 2-13 dynamic gate not modelled, excluded from gate-free scope by root',restart:'Root authorized replay of the 126-node earlier WALL-stopped early stop within same <=5000 cap; no larger budget',prefix,cap,depthLimit,expanded:head,seen:seen.size,pending:q.length-head,depthCut,exhausted:!hit&&head===q.length&&depthCut===0,hit,stable,boundary,first,inertiaWindows};
if(require.main===module)console.log(JSON.stringify(process.argv.includes('--inertia')?{cap,depthLimit,expanded:head,seen:seen.size,pending:q.length-head,depthCut,hit,boundary,inertiaWindows}:result,null,2));module.exports={result};
