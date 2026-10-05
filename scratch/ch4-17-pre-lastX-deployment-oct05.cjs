// Fixed readonly transport from actual25; no search and no game/bridge/UI/save calls.
const fs=require('fs'),m=require('./ch4-17-fixed-firstX-low-cargo-oct05.cjs'),b=require('./ch4-17-readonly.cjs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-17.json','utf8').replace(/^\uFEFF/,''));
const full25='SDDDDWAXDWAWSWAWSDSAWWSAA';
const z=raw.events.map((e,i)=>({event:i,o:e.observation})).filter(z=>z.o?.level?.id==='floating'&&z.o.level.instructions===full25&&!z.o.level.busy).at(-1);
if(!z)throw Error('Missing actual25 evidence');
const t=z.o.level.timelines.find(t=>t.id===z.o.level.current_timeline)||z.o.level.timelines[0],E=t.entities.filter(e=>e.active),F=['W','A','S','D'];
const source={b:E.filter(e=>e.type==='BOX').map(e=>{const c=E.find(p=>p.type==='PLAYER'&&p.properties.contained&&p.properties.container===e.id);return{r:e.pos,orig:e.id,color:e.details.Color,c:c?{f:F[c.properties.face],fork:c.properties.split,ghost:c.properties.ghost}:null};}),p:E.filter(e=>e.type==='PLAYER'&&!e.properties.contained).map(e=>({r:e.pos,f:F[e.properties.face],fork:e.properties.split})),keys:0,x:1};
const tail47='DWWAASASAWWDDDDSSAAWAS';
const cp=x=>JSON.parse(JSON.stringify(x)),K=r=>r.join(','),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},O={W:'S',A:'D',S:'W',D:'A'};
const add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
function pushAudit(s){const byPos=new Map(s.b.map(b=>[K(b.r),b]));function chain(r,d){if(b.blocked(r))return false;const q=byPos.get(K(r));return!q||chain(add(r,d),d);}
 return s.b.map(z=>({origin:z.orig,r:z.r,liveFreeSafePushDirections:Object.keys(V).filter(d=>{const p=add(z.r,O[d]);return!b.blocked(p)&&!b.spikes.has(K(p))&&!byPos.has(K(p))&&chain(add(z.r,d),d);})}));}
function run(){const r=m.fixed(tail47,source);if(!r.valid)throw Error('Fixed22 transport rejected');const w=m.fixed('W',r.s),x=m.secondX(w.s),ds=m.fixed('DS',x);if(!ds.valid)throw Error('Fixed postX DS rejected');
 return{actualSource:{event:z.event,frame:z.o.frame,instructions:z.o.level.instructions,entities:E.filter(e=>['BOX','PLAYER'].includes(e.type)).map(e=>({id:e.id,type:e.type,r:e.pos,properties:e.properties}))},source,tail47,full47:full25+tail47,pre47:r,immediateX48:m.secondX(r.s),pre48:w,post49:x,post51:ds,mask51:b.mask(ds.s),pushAudit51:pushAudit(ds.s),scene3_4:{wall:b.walls.has('3,4'),floor:b.floors.has('3,4')},search:{started:false,liveHandle:null},scope:'One manually fixed actual25 transport family, not owner29/46 ordinary Goal domains. No model source or candidate beyond25 is actual until normal game verification.'};}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={source,tail47,run,pushAudit};
