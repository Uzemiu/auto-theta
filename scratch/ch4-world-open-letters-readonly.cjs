// Read-only ordinary Chapter4 world navigation, explicit current full source.
const fs=require('fs'),K=p=>p.join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],A='WASD';
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/chapter4-world.json','utf8').replace(/^\uFEFF/,''));
const source=[{i:-1,o:raw.initial},...(raw.events||[]).map((e,i)=>({i,o:e.observation}))].reverse().find(z=>z.o?.level?.id==='Chapter4'&&z.o.level.world&&z.o.level.timelines?.[0]?.tiles?.length);
if(!source)throw Error('No actual full Chapter4 world source');
const t=source.o.level.timelines[0],terrain=new Map(t.tiles.map(e=>[K(e.pos),e.type]));
for(const e of t.entities)if(e.floor&&!terrain.has(K(e.pos)))terrain.set(K(e.pos),e.type);
const block=new Map(t.entities.filter(e=>e.active&&e.blockable).map(e=>[K(e.pos),e]));
const entry=new Map(t.entities.filter(e=>e.active&&e.type==='ENTRY').map(e=>[K(e.pos),e.details.LinkLevel]));
const completed=new Set(JSON.parse(fs.readFileSync('knowledge/progress.json','utf8').replace(/^\uFEFF/,'')).active_playthrough.verified_completed_levels);
const selected=process.argv[2]||'4-O',targetIds=selected==='nearest'?['4-J','4-K','4-L','4-M','4-N','4-O','4-Z']:[selected];
const targets=new Set([...entry].filter(([k,id])=>targetIds.includes(id)).map(([k])=>k));
const forbidden=new Set([...entry].filter(([k,id])=>!completed.has(id)&&!targets.has(k)).map(([k])=>k));
const player=t.entities.find(e=>e.active&&e.type==='PLAYER'&&!e.properties?.contained),start=player.pos;
function step(p,a){
 let d=a;
 for(let z=0;z<4;z++,d=(d+1)%4){
  let n=[p[0]+V[d][0],p[1]+V[d][1]],k=K(n),e=block.get(k);
  // Do not model pushable entries as walls or issue a blind push.
  if(e?.pushable)return null;
  if(e||!terrain.has(k))continue;
  const travel=[];
  for(let tick=0;tick<250;tick++){
   k=K(n);if(forbidden.has(k)||['SPIKE','DARK'].includes(terrain.get(k)))return null;
   travel.push(n);if(targets.has(k)||terrain.get(k)!=='ICE')return{pos:n,face:d,travel};
   const q=[n[0]+V[d][0],n[1]+V[d][1]],j=K(q),b=block.get(j);
   if(b?.pushable)return null;
   if(b||!terrain.has(j))return{pos:n,face:d,travel};
   n=q;
  }
  return null;
 }
 return{pos:p,face:a,travel:[]};
}
function replay(seq,s=start){const trace=[];for(let i=0;i<seq.length;i++){const r=step(s,A.indexOf(seq[i]));if(!r)return{valid:false,step:i+1,trace};trace.push({step:i+1,input:seq[i],from:s,to:r.pos,face:A[r.face],terrain:terrain.get(K(r.pos)),entry:entry.get(K(r.pos))||null,travel:r.travel});s=r.pos;}return{valid:true,trace,final:s};}
const q=[{p:start,path:'',trace:[]}],seen=new Set([K(start)]);let head=0,hit=null;
while(head<q.length){const s=q[head++];if(targets.has(K(s.p))){hit={path:s.path,...replay(s.path)};break;}
 for(let a=0;a<4;a++){const r=step(s.p,a);if(!r||seen.has(K(r.pos)))continue;seen.add(K(r.pos));q.push({p:r.pos,path:s.path+A[a]});}
}
const result={sourceEvent:source.i,sourceLevel:source.o.level.id,sourceInstructions:source.o.level.instructions,playerId:player.id,start,fork:player.properties.split,targetIds,expanded:head,seen:seen.size,exhausted:!hit&&head===q.length,hit,scope:'ordinary WASD; exact ICE; no push/X/wrap; Wall/blockable overrides tile; completed ENTRY pass-through; target-only unfinished ENTRY'};
if(require.main===module)console.log(JSON.stringify(result,null,2));
module.exports={source,result,replay,step,terrain,block,entry};
