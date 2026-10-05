// Self-owned, public-observation resource search. No game/save/KB mutation.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-20.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],K=r=>r.join(','),eq=(a,b)=>K(a)===K(b),clone=s=>JSON.parse(JSON.stringify(s));
const V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
const walls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>K(e.pos))),floors=new Set([...t.tiles,...t.entities.filter(e=>e.floor)].map(e=>K(e.pos))),spikes=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>K(e.pos)));
if(t.tiles.some(e=>e.type==='ICE'))throw Error('ICE not implemented in this private domain');
const actual4={b:t.entities.filter(e=>e.type==='BOX').map(e=>({r:e.pos,orig:e.id,color:e.details.Color,c:null})),p:[{r:[4,6],f:'S',fork:3}]};
const stats={moves:0,conflict:0,stack:0,occupied:0,ghost:0,death:0,capture:0},samples=[];
const blocked=r=>walls.has(K(r))||!floors.has(K(r));
function chain(bs,r,d,ids){if(blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function boundary(kind,path,s,post){stats[kind]++;if(samples.filter(q=>q.kind===kind).length<3)samples.push({kind,path,pre:clone(s),post});}
function step(s,a,path=''){
 stats.moves++;let bs,plans=[];
 if(a==='X'){
  const cargo=s.b.filter(b=>b.c?.fork>0);if(!cargo.length&&!s.p.some(p=>p.fork))return null;
  bs=s.b.filter(b=>!b.c||!b.c.fork).map(clone);
  function birth(r,f,fork,kind,parent){let n=0;for(const d of [L[f],L[L[L[f]]],f]){const q=add(r,d),ids=[];if(!chain(bs,q,d,ids))continue;plans.push({r:q,f,fork,d,ids,kind,parent});if(++n===2)return;}if(!n)plans.push({r,f,fork,d:f,ids:[],kind,parent});}
  for(const b of cargo)birth(b.r,b.c.f,b.c.fork-1,'cargo',b);
  for(const p of s.p)if(p.fork)birth(p.r,p.f,p.fork-1,'free',p);else plans.push({...p,d:p.f,ids:[],kind:'free',parent:p});
 }else{
  bs=s.b.map(b=>({...clone(b),c:b.c?{...b.c,f:a}:null}));
  for(const p of s.p){let d=a,ids=[],r=p.r,ok=false;for(let i=0;i<4;i++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}plans.push({r:ok?r:p.r,f:ok?d:a,fork:p.fork,d,ids:ok?ids:[],kind:'free',parent:p});}
 }
 const dirs=new Map();for(const p of plans)for(const i of p.ids){if(dirs.has(i)&&dirs.get(i)!==p.d){boundary('conflict',path,s,{plans});return null;}dirs.set(i,p.d);}
 for(const[i,d]of dirs)bs[i].r=add(bs[i].r,d);
 const ps=[];for(const p of plans)if(p.kind==='cargo')bs.push({r:p.r,orig:p.parent.orig,color:p.parent.color,c:{...p.parent.c,fork:p.fork}});else ps.push({r:p.r,f:p.f,fork:p.fork});
 const merged=[];for(const b of bs){const old=merged.find(q=>eq(q.r,b.r));if(!old){merged.push(b);continue;}if(old.orig!==b.orig){boundary('stack',path,s,{b:bs,p:ps});return null;}if(!old.c&&b.c)old.c=b.c;else if(old.c&&b.c)old.c.fork=Math.max(old.c.fork,b.c.fork);}
 const p=[];for(const z of ps){const b=merged.find(b=>eq(b.r,z.r));if(b){if(b.c&&z.fork){boundary('occupied',path,s,{b:bs,p:ps});return null;}if(!b.c){b.c={f:z.f,fork:z.fork,ghost:spikes.has(K(z.r))?1:0};stats.capture++;if(b.c.ghost)stats.ghost++;}continue;}if(spikes.has(K(z.r))){stats.death++;continue;}const old=p.find(p=>eq(p.r,z.r));if(old)old.fork=Math.max(old.fork,z.fork);else p.push(z);}
 return{b:merged,p};
}
const hash=s=>s.b.map(b=>[b.orig,b.color,K(b.r),b.c?.fork??'-',b.c?.fork?b.c.f:'-',b.c?.ghost||0].join(':')).sort().join(';')+'|'+s.p.map(p=>[K(p.r),p.fork,p.fork?p.f:'-'].join(':')).sort().join(';');
const actors=s=>s.p.length+s.b.filter(b=>b.c&&!b.c.ghost).length;
const blueTarget=s=>s.b.some(b=>b.color===3&&b.c?.fork===2&&!b.c.ghost)&&s.p.length===1&&s.p[0].fork===2&&actors(s)===2;
const threeTarget=s=>s.b.filter(b=>b.c?.fork===1&&!b.c.ghost).length===3&&s.p.length===1&&s.p[0].fork===1&&actors(s)===4;
function replay(path,start=actual4){let s=clone(start),trace=[];for(let i=0;i<path.length;i++){s=step(s,path[i],path.slice(0,i+1));if(!s)return{valid:false,n:i+1,trace};trace.push({n:i+1,a:path[i],s:clone(s)});}return{valid:true,s,trace};}

// New, strict first Blue capture at left transportation opening.
const leftCoords=new Set(['2,3','3,3']);
const leftBlue=s=>s.b.find(b=>b.color===3&&b.c?.fork===2&&!b.c.ghost&&leftCoords.has(K(b.r)));
function emptyC4Geometry(s){
 const b=s.b.find(b=>b.color===4);if(!b||b.c||b.r[1]<=1)return false;
 return 'WASD'.split('').some(d=>{const back=add(b.r,L[L[d]]);return !blocked(back)&&!spikes.has(K(back))&&chain(s.b,add(b.r,d),d,[]);});
}
function leftSearch(cap=12000,depth=45){
 for(const k of Object.keys(stats))stats[k]=0;samples.splice(0);
 const q=[{s:clone(actual4),path:'',x:0}],seen=new Set([hash(actual4)+'|0']);let h=0,cut=0,lost=0,wrongFirst=0,badC4=0;
 const rejectedFirst=[];
 while(h<q.length&&h<cap){const z=q[h++];
  if(z.x===1&&blueTarget(z.s)&&leftBlue(z.s)&&emptyC4Geometry(z.s))return{hit:{prefix:'SSSS'+z.path,tail:z.path,s:z.s},expanded:h,seen:seen.size,pending:q.length-h,depthCut:cut,lost,wrongFirst,badC4,rejectedFirst,cap,depth,stats:{...stats},samples:clone(samples)};
  if(z.path.length>=depth){cut++;continue;}
  for(const a of z.x?'WASD':'WASDX'){const n=step(z.s,a,'SSSS'+z.path+a);if(!n)continue;const x=z.x+(a==='X'?1:0);
   if(n.b.some(b=>b.c?.ghost)||actors(n)!==(x?2:1)||n.p.some(p=>p.fork!==(x?2:3))||n.b.some(b=>b.c&&b.c.fork!==(x?2:3))){lost++;continue;}
   const newlyBlue=n.b.find(b=>b.color===3&&b.c),oldBlue=z.s.b.find(b=>b.color===3&&b.c);
   if(newlyBlue&&!oldBlue&&!leftCoords.has(K(newlyBlue.r))){wrongFirst++;if(rejectedFirst.length<4)rejectedFirst.push({tail:z.path+a,pre:z.s,post:n});continue;}
   // C4 can never be emptied by the remaining ordinary phase; such capture cannot satisfy this target.
   if(n.b.some(b=>b.color===4&&b.c)){badC4++;continue;}
   const k=hash(n)+'|'+x;if(seen.has(k))continue;seen.add(k);q.push({s:n,path:z.path+a,x});
  }
 }
 return{hit:null,expanded:h,seen:seen.size,pending:q.length-h,exhausted:h===q.length,depthCut:cut,cap,depth,lost,wrongFirst,badC4,rejectedFirst,stats:{...stats},samples:clone(samples)};
}
if(require.main===module){const result=process.argv[2]==='replay'?replay(process.argv[3]||''):leftSearch();console.log(JSON.stringify({status:'first-blue-left-model-only',result,liveHandle:null,scope:'Actual4 with three spent Fork pickups; solo WASD then exactly first free X then WASD. Strict first Blue capture in 2,3/3,3; safe cargoFork2/outsideFork2, empty C4 above row1 with at least one static legal push request. Wrong first Blue/C4 cargo rejects recorded. No force/independent stack/Ghost/highFork occupied propagation; no Goal claim.'},null,2));}
module.exports={actual4,step,replay,leftSearch,blueTarget,emptyC4Geometry};
