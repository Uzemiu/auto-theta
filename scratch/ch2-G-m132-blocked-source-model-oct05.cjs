// Private public-observation model. No bridge/UI/save/hidden implementation calls.
// M131-specific addition: retain a moving BOX's original PLAYER source across
// M035 chain transfer, and resolve different-direction requests by source mask.
// Other uncertain capture/stack/perpendicular-free-BOX boundaries still stop.
const K=z=>z.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],A='WASD',DIR=[1,3,2,4];
function createModel(o,t=o.level.timelines[0]){
 const terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
 for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
 const walls=new Set(t.entities.filter(e=>e.active&&e.blockable&&e.type!=='BOX').map(e=>K(e.pos)));
 const at=e=>[e.x,e.y],move=(e,d)=>[e.x+V[d][0],e.y+V[d][1]],clone=s=>({p:s.p.map(e=>({...e})),b:s.b.map(e=>({...e}))});
 const start={p:t.entities.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],face:e.properties.face,active:e.active,ghost:e.properties.ghost||0,masked:e.properties.maskedoff||0,md:DIR.indexOf(e.properties.movingdir),src:e.properties.movingsrc??-1})),b:t.entities.filter(e=>e.active&&e.type==='BOX').map(e=>({id:e.id,x:e.pos[0],y:e.pos[1],md:DIR.indexOf(e.properties.movingdir),src:e.properties.movingsrc??-1}))};
 const stats={forceEvents:0,sameFaceMovingStopped:0,capture:0,stack:0,perpendicularFreeBox:0,uncertainPlayerCross:0,sameSourceDifferentDirections:0,loop:0};
 const left=s=>s.p.filter(p=>p.active&&p.id!==105).length;
 function oneTick(s,a,tick){
  const p=s.p,b=s.b,bi=z=>b.findIndex(e=>K(at(e))===K(z)),blocked=z=>walls.has(K(z))||!terrain.has(K(z));
  function chain(j,d){const out=[];while(j>=0){if(out.includes(j))return null;out.push(j);const z=move(b[j],d);if(blocked(z))return null;j=bi(z);}return out;}
  function can(e,d){const z=move(e,d);if(blocked(z))return false;const j=bi(z);return j<0||!!chain(j,d);}
  const plans=new Map(),np=[],cancel=new Set(),requested=[];
  function request(j,d,src,kind){if(!plans.has(j))plans.set(j,[]);plans.get(j).push({d,src,kind});requested.push({box:b[j].id,d,src,kind});}
  for(const e of p){
   if(!e.active){np.push({...e,md:-1,src:-1});continue;}
   let d=tick===0?a:e.md;
   if(d<0){np.push({...e});continue;}
   if(tick===0){let n=0;while(n<4&&!can(e,d)){d=(d+1)%4;n++;}if(n===4){np.push({...e,md:-1,src:-1});continue;}}
   else if(!can(e,d)){np.push({...e,md:-1,src:-1});continue;}
   const z=move(e,d),j=bi(z);
   if(j>=0&&b[j].md>=0){
    if((b[j].md+2)%4===d){cancel.add(j);np.push({...e,md:-1,src:-1});continue;}
    if(b[j].md!==d){stats.perpendicularFreeBox++;return {boundary:'perpendicular-free-box',tick,box:b[j].id,player:e.id,playerDirection:d,boxDirection:b[j].md,boxSource:b[j].src,state:clone(s)};}
   }
   if(j>=0)for(const q of chain(j,d))request(q,d,e.id,'player');
   const md=j>=0?-1:terrain.get(K(z))==='ICE'?d:-1,dead=terrain.get(K(z))==='SPIKE';
   np.push({...e,x:z[0],y:z[1],face:tick===0?d:e.face,active:!dead,ghost:dead?1:e.ghost,md:dead?-1:md,src:dead||md<0?-1:e.id});
  }
  for(let j=0;j<b.length;j++)if(b[j].md>=0&&!plans.has(j)&&!cancel.has(j)){
   const ch=chain(j,b[j].md);if(ch)for(const q of ch)request(q,b[j].md,b[j].src,'inertia');
  }
  const forceTargets=[];
  for(const [j,r]of plans){
   const dirs=[...new Set(r.map(z=>z.d))];if(dirs.length<2)continue;
   const sources=[...new Set(r.map(z=>z.src))];
   if(sources.some(z=>z<0)||sources.length<2||sources.some(src=>new Set(r.filter(z=>z.src===src).map(z=>z.d)).size>1)){
    stats.sameSourceDifferentDirections++;return {boundary:'unverified-force-source',tick,box:b[j].id,requests:r,state:clone(s)};
   }
   forceTargets.push({force:true,tick,box:b[j].id,cell:at(b[j]),requests:r,sources,state:clone(s)});
  }
  if(forceTargets.length>1)return {boundary:'unverified-simultaneous-force-targets',tick,targets:forceTargets,state:clone(s)};
  if(forceTargets.length){stats.forceEvents++;return forceTargets[0];}
  const nb=b.map((e,j)=>{
   const r=plans.get(j);if(!r?.length||cancel.has(j))return {...e,md:-1,src:-1};
   const d=r[0].d,src=r[0].src,z=move(e,d),contacted=bi(z)>=0;let md=contacted?-1:terrain.get(K(z))==='ICE'?d:-1;
   // Actual71 event149: old A from2,9 faces immediate true Wall1,9.
   // Clear only immediate Wall/missing-Floor next direction before a free contacts it.
   if(md>=0&&blocked([z[0]+V[md][0],z[1]+V[md][1]]))md=-1;
   return {id:e.id,x:z[0],y:z[1],md,src:md<0?-1:src};
  });
  if(new Set(nb.map(e=>K(at(e)))).size<nb.length){stats.stack++;return {boundary:'new-stack',tick,state:clone(s),proposed:{p:np,b:nb}};}
  if(np.some(e=>e.active&&nb.some(q=>K(at(q))===K(at(e))))){stats.capture++;return {boundary:'new-capture',tick,state:clone(s),proposed:{p:np,b:nb}};}
  const merged=[];
  for(const e of np){
   if(!e.active){merged.push(e);continue;}
   const q=merged.find(q=>q.active&&K(at(q))===K(at(e)));
   if(!q){merged.push(e);continue;}
   if(q.face===e.face&&((q.md>=0)!==(e.md>=0))){stats.sameFaceMovingStopped++;merged.push(e);continue;}
   if((q.face+2)%4===e.face&&q.md>=0&&e.md>=0){merged.push(e);continue;}
   if((q.md<0&&e.md<0)||q.face===e.face){merged.push({...e,active:false,md:-1,src:-1});continue;}
   stats.uncertainPlayerCross++;return {boundary:'unverified-player-cross',tick,state:clone(s),players:[q,e]};
  }
  return {state:{p:merged,b:nb},requested};
 }
 function step(s,a,{maxForces=8,resume=false}={}){
  const init=clone(s);
  if(!resume){for(const p of init.p){p.md=-1;p.src=-1;}for(const b of init.b){b.md=-1;b.src=-1;}}
  const leaves=[],boundaries=[],forces=[];
  function run(state,tick,path,trace){
   for(;tick<100;tick++){
    const r=oneTick(state,a,tick);
    if(r.boundary){boundaries.push({...r,path});return;}
    if(r.force){
     forces.push({tick,box:r.box,cell:r.cell,requests:r.requests,path:[...path]});
     if(path.length>=maxForces){boundaries.push({boundary:'force-limit',...r,path});return;}
     for(const winner of r.sources){
      const ss=clone(state),losers=r.sources.filter(z=>z!==winner);
      for(const p of ss.p)if(losers.includes(p.id)){p.active=false;p.masked=1;p.md=-1;p.src=-1;}
      for(const b of ss.b)if(losers.includes(b.src)){b.md=-1;b.src=-1;}
      run(ss,tick,path.concat(winner),trace);
     }
     return;
    }
    state=r.state;trace=trace.concat({tick,state:clone(state),requested:r.requested});
    if(!state.p.some(e=>e.active&&e.md>=0)&&!state.b.some(e=>e.md>=0)){
     leaves.push({state,choices:path,trace});return;
    }
   }
   stats.loop++;boundaries.push({boundary:'loop',state,path});
  }
  run(init,resume?1:0,[],[]);return {valid:boundaries.length===0,leaves,boundaries,forces};
 }
 function replay(seq,s=start){let states=[{state:clone(s),choices:[]}];const points=[];
  for(let i=0;i<seq.length;i++){
   const outs=[];for(const leaf of states){const r=step(leaf.state,A.indexOf(seq[i]));if(!r.valid)return {valid:false,step:i+1,boundaries:r.boundaries,points};for(const z of r.leaves)outs.push({...z,choices:leaf.choices.concat(z.choices)});}
   states=outs;points.push({step:i+1,a:seq[i],states});
  }
  return {valid:true,states,points};
 }
 const describe=s=>({p:s.p.map(e=>({...e,face:A[e.face],md:e.md<0?'stop':A[e.md]})),b:s.b.map(e=>({...e,md:e.md<0?'stop':A[e.md]}))});
 const serial=s=>s.p.filter(e=>e.id!==105).map(e=>[e.id,e.x,e.y,e.face,+e.active,e.ghost,e.masked].join(',')).join('|')+'#'+s.b.map(e=>[e.id,e.x,e.y].join(',')).join('|');
 return {start,step,replay,describe,serial,left,stats,A,DIR,clone};
}
module.exports={createModel};
