// Fixed public-model audit only. NO BFS/game/input/save/canonical writes.
const m=require('./ch4-20-readonly.cjs'),cp=x=>JSON.parse(JSON.stringify(x)),K=r=>r.join(',');
const full25='SSSSSSDDSSSSAAWAASAXDDDWW';
function fixed(path,start=m.s25){let s=cp(start),trace=[];for(let i=0;i<path.length;i++){
 const q=m.multiStep(s,path[i],path.slice(0,i+1));
 if(q.length!==1)return{valid:false,n:i+1,branches:q,pre:s,trace};
 s=q[0].s;trace.push({n:i+1,a:path[i],s:cp(s)});
 }return{valid:true,s,trace};}
function geom(s,faces=false){return s.b.map(b=>[b.orig,b.color,K(b.r),b.c?.fork??'-',b.c?.ghost||0,faces?b.c?.f||'-':''].join(':')).sort().join('|')+
 '#'+s.p.map(p=>[K(p.r),p.fork,faces?p.f:''].join(':')).sort().join('|');}
function compact(s){return{b:s.b,p:s.p,bodyCells:s.b.length,cargos:s.b.filter(b=>b.c&&!b.c.ghost).length,free:s.p.length,
 goal:s.b.some(b=>b.c&&!b.c.ghost&&K(b.r)===K(m.goal))||s.p.some(p=>K(p.r)===K(m.goal))};}
const ax=fixed('AX'),old=fixed('SDAX'),oldSD=fixed('SDAXSD');
const outgoing='WASD'.split('').map(a=>{const p=m.multiStep(ax.s,a),q=m.multiStep(oldSD.s,a);return{a,countAX:p.length,countOld:q.length,
 identicalIncludingFaces:JSON.stringify(p.map(z=>geom(z.s,true)).sort())===JSON.stringify(q.map(z=>geom(z.s,true)).sort())};});
const preForce=fixed('SDAXSA'),force=m.multiStep(preForce.s,'W','SDAXSAW');
const leaves=force.map(z=>({choices:z.choices,seed:compact(z.s),probeDirections:'WASD'.split('').map(a=>{
 const r=fixed(a+'X',z.s);return{path:a+'X',valid:r.valid,result:r.valid?compact(r.s):r,n:r.n};
 })}));
const proof=m.raw.events.map((e,i)=>({event:i,o:e.observation})).filter(z=>z.o?.level?.id==='horse'&&z.o.level.instructions===full25&&!z.o.level.busy).map(z=>({event:z.event,frame:z.o.frame,time:z.o.level.timelines.find(t=>t.id===z.o.level.current_timeline)?.time}));
if(require.main===module)console.log(JSON.stringify({status:'fixed-only/no-search',full25,proof,AX:ax,oldSDAX:old,oldSDAXSD:oldSD,
 equivalentBeforeOrdinary:geom(ax.s)===geom(oldSD.s),outgoing,preForce,forceLeaves:leaves,goal:m.goal,
 expanded:0,seen:0,pending:0,depthCut:0,liveHandle:null},null,2));
module.exports={fixed,geom,compact,ax,old,oldSD,force,leaves};
