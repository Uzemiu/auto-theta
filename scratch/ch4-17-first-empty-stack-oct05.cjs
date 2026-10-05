// Strict readonly first-empty-stack fixed probe. Stops at the first overlap.
// No game, bridge, UI, save or hidden implementation access; no BFS.
const fs=require('fs'),geo=require('./ch4-17-readonly.cjs'),cp=z=>JSON.parse(JSON.stringify(z));
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-17.json','utf8').replace(/^\uFEFF/,''));
const sourcePrefix='SDDDDWAX',tail='WWAWW';
const z=raw.events.map((e,i)=>({event:i,o:e.observation})).filter(z=>z.o?.level?.id==='floating'&&z.o.level.instructions===sourcePrefix&&!z.o.level.busy).at(-1);
if(!z)throw Error('Missing real fixed8 observation');
const t=z.o.level.timelines.find(t=>t.id===z.o.level.current_timeline)||z.o.level.timelines[0],E=t.entities.filter(e=>e.active),F=['W','A','S','D'];
const source={b:E.filter(e=>e.type==='BOX').map(e=>({id:e.id,r:e.pos,color:e.details.Color})),p:E.filter(e=>e.type==='PLAYER').map(e=>({id:e.id,r:e.pos,f:F[e.properties.face],fork:e.properties.split,contained:e.properties.contained,ghost:e.properties.ghost}))};
const K=r=>r.join(','),V={W:[0,1],A:[-1,0],S:[0,-1],D:[1,0]},L={W:'A',A:'S',S:'D',D:'W'},eq=(a,b)=>K(a)===K(b),add=(r,d)=>[r[0]+V[d][0],r[1]+V[d][1]];
function chain(bs,r,d,ids){if(geo.blocked(r))return false;const i=bs.findIndex(b=>eq(b.r,r));if(i<0)return true;if(!chain(bs,add(r,d),d,ids))return false;ids.push(i);return true;}
function strictStep(s,a){const plans=[],dirs=new Map(),bs=cp(s.b);
 for(const p of s.p){let d=a,r=p.r,ids=[],ok=false;for(let j=0;j<4;j++,d=L[d]){r=add(p.r,d);ids=[];if(chain(s.b,r,d,ids)){ok=true;break;}}const q={...cp(p),r:ok?r:p.r,f:ok?d:p.f};plans.push({player:p.id,input:a,selected:ok?d:null,boxIds:ids.map(i=>s.b[i].id),p:q});for(const i of ok?ids:[]){if(dirs.has(i)&&dirs.get(i)!==d)return{boundary:'force',plans};dirs.set(i,d);}}
 for(const[i,d]of dirs)bs[i].r=add(bs[i].r,d);
 const ps=plans.map(z=>z.p);
 if(ps.some(p=>geo.spikes.has(K(p.r))))return{boundary:'nakedSPIKE',plans,bs};
 if(new Set(ps.map(p=>K(p.r))).size!==ps.length)return{boundary:'freeFusion',plans,bs};
 if(ps.some(p=>bs.some(b=>eq(b.r,p.r))))return{boundary:'cargoCapture',plans,bs};
 const group=bs.filter((b,i)=>bs.some((q,j)=>i!==j&&eq(b.r,q.r)));
 if(group.length)return{boundary:'firstEmptyStack',target:group.length===2&&s.p.length===2&&s.p.every(p=>p.fork===1&&!p.contained&&!p.ghost),plans,post:{b:bs,p:ps},unknownHeightOrder:true};
 return{s:{b:bs,p:ps},plans};
}
function run(){let s=cp(source),trace=[];for(let i=0;i<tail.length;i++){const r=strictStep(s,tail[i]);trace.push({fullInput:i+9,a:tail[i],pre:cp(s),...r});if(r.boundary)return{sourceRef:{event:z.event,frame:z.o.frame,instructions:sourcePrefix},source,tail,full:sourcePrefix+tail,fixedSteps:i+1,trace,result:r,search:{started:false,expanded:0,liveHandle:null}};s=r.s;}return{trace,result:null};}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={source,strictStep,run};
