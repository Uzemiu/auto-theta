// Read-only Chapter4 4-Y entry audit. No game/bridge/save calls or JSON output files.
const fs=require('fs');
const K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],A='WASD';
const journal=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/chapter4-world.json','utf8').replace(/^\uFEFF/,''));
const source=journal.events.map((e,i)=>({i,o:e.observation})).reverse().find(z=>z.o?.level?.id==='Chapter4'&&z.o.level.world&&z.o.level.timelines?.some(t=>t.tiles?.length));
if(!source)throw Error('No full Chapter4 source');
const level=source.o.level,t=level.timelines.find(t=>t.id===level.current_timeline)||level.timelines[0];
const floor=new Map(t.tiles.filter(e=>e.active!==false&&e.floor).map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.active&&e.floor&&!floor.has(K(e.pos)))floor.set(K(e.pos),e.type);
const walls=new Set(t.entities.filter(e=>e.active&&e.class==='Wall').map(e=>K(e.pos)));
const entries=t.entities.filter(e=>e.active&&e.type==='ENTRY');
const fixed=new Map(t.entities.filter(e=>e.active&&e.blockable&&e.type!=='PLAYER').map(e=>[K(e.pos),e]));
const player=t.entities.find(e=>e.active&&e.type==='PLAYER'&&!e.properties?.contained);
const y=entries.find(e=>e.details.LinkLevel==='4-Y');
const completed=new Set(JSON.parse(fs.readFileSync('knowledge/progress.json','utf8').replace(/^\uFEFF/,'')).active_playthrough.verified_completed_levels);
const min=t.min_anchor,max=[min[0]+t.size[0],min[1]+t.size[1]];
function neighbor(p,d,wrap=false){let n=p.map((v,i)=>v+V[d][i]);if(wrap)for(let i=0;i<2;i++){if(n[i]<min[i])n[i]=max[i];else if(n[i]>max[i])n[i]=min[i];}return n;}
function blocked(p,avoidEntries){const k=K(p);if(!floor.has(k)||walls.has(k)||fixed.has(k))return true;return avoidEntries&&entries.some(e=>K(e.pos)===k&&!completed.has(e.details.LinkLevel));}
function step(p,a,{avoidEntries=true,wrap=false}={}){
 for(let z=0,d=a;z<4;z++,d=(d+1)%4){let n=neighbor(p,d,wrap);if(fixed.get(K(n))?.pushable)return null;if(blocked(n,false))continue;
  const path=[];for(let tick=0;tick<500;tick++){
   // An unlocked unfinished ENTRY is a loading hazard, not a wall which gives fallback.
   if(avoidEntries&&entries.some(e=>K(e.pos)===K(n)&&!completed.has(e.details.LinkLevel)))return null;
   const type=floor.get(K(n));if(type==='SPIKE'||type==='DARK')return null;path.push(n);
   if(type!=='ICE')return{p:n,face:A[d],path};
   const q=neighbor(n,d,wrap);if(fixed.get(K(q))?.pushable)return null;if(blocked(q,false))return{p:n,face:A[d],path};n=q;
  }return null;
 }return{p,face:A[a],path:[]};
}
function nav(start,target,opt){const q=[{p:start,path:''}],seen=new Set([K(start)]);let h=0,hit=null;
 while(h<q.length){const s=q[h++];if(K(s.p)===K(target)){hit=s;break;}for(let a=0;a<4;a++){const r=step(s.p,a,opt);if(!r||seen.has(K(r.p)))continue;seen.add(K(r.p));q.push({p:r.p,path:s.path+A[a]});}}
 return{expanded:h,seen:seen.size,exhausted:!hit&&h===q.length,hit};
}
function component(start,{allowSpike=false,wrap=false}={}){const q=[start],seen=new Set([K(start)]);let h=0;
 while(h<q.length){let p=q[h++];for(let d=0;d<4;d++){let n=neighbor(p,d,wrap),k=K(n);if(seen.has(k)||blocked(n,false)||(!allowSpike&&['SPIKE','DARK'].includes(floor.get(k))))continue;seen.add(k);q.push(n);}}
 return{count:seen.size,cells:q};
}
const fresh=[-31,-12],upper=[-68,-4],lowerNeighbors=[[-68,-11],[-69,-10],[-67,-10],[-68,-9]];
const c=component(fresh),cw=component(fresh,{wrap:true}),low=component([-68,-11]);
const crossings=[];for(const p of c.cells)for(let d=0;d<4;d++){const n=neighbor(p,d);if(floor.get(K(n))==='SPIKE'&&n[0]>=-72&&n[0]<=-64)crossings.push({from:p,to:n});}
const result={sourceEvent:source.i,sourceInstructions:level.instructions,player:{id:player.id,pos:player.pos,fork:player.properties.split},entry:{id:y.id,pos:y.pos,details:y.details},bounds:[min,max],
 conditionalFresh:nav(fresh,upper,{}),latestToUpper:nav(player.pos,upper,{}),
 optimistic:{safeComponent:c.count,wrappedSafeComponent:cw.count,lowerComponent:low.count,lowerNeighbors:lowerNeighbors.map(p=>({p,type:floor.get(K(p)),freshReachable:c.cells.some(q=>K(q)===K(p)),wrappedFreshReachable:cw.cells.some(q=>K(q)===K(p))})),westSpikeEdges:crossings},
 lowerCells:low.cells.sort((p,q)=>p[1]-q[1]||p[0]-q[0]),
 seam:[-70,-69,-68,-67,-66].map(x=>({p:[x,-5],type:floor.get(K([x,-5]))||'MISSING',wall:walls.has(K([x,-5]))})),
 lowerIce:{p:[-68,-8],type:floor.get('-68,-8')},
 scope:'Fixed exact Floor/Wall/active blocker; ordinary safe WASD+ICE. Optimistic component permits all nonblockable ENTRY, ignores ICE stopping. Conditional wrap is size+1, not assumed actual. No push/cargo/X dynamics.'};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={source,t,floor,walls,fixed,step,nav,component,result};
