'use strict';
// Limited resource stages from root's MODEL-ONLY exact three-free0 state.
// No game IO or capture/conflict search. Each bounded phase forbids cargo.
const fs=require('fs');
const {createModel}=require('./stack-cargo-readonly.cjs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-12.json','utf8').replace(/^\uFEFF/,''));
const record=JSON.parse(JSON.stringify(raw));
const t=record.initial.level.timelines[0];
t.entities=t.entities.filter(e=>e.type!=='PLAYER');
for(const e of t.entities){if(e.type==='KEY')e.active=e.id===56;if(e.type==='BOX')e.pos=[5,3];}
for(const [id,pos] of [[100059,[4,2]],[100060,[6,3]],[100061,[7,2]]])t.entities.push({id,type:'PLAYER',class:'Player',pos,active:true,floor:false,pushable:true,blockable:false,properties:{face:0,split:0,ghost:0,contained:0,container:-1,key:0}});
const model=createModel(record,{gates:[{at:[7,4],buttons:[[6,2]]}],allow_partial_death:false,max_stack:1});
const xy=p=>p.slice(0,2).join(',');
const serial=s=>s.p[0].slice(0,2).join(',')+'|'+s.p.slice(1).map(p=>xy(p)+':'+p[3]).sort().join(';')+'|'+xy(s.b[0])+'|'+s.c;
function scan(start,accept,allowedBox,limit=1500){
 const q=[[start,-1,'']],seen=new Set([serial(start)]);let end=-1,processed=0;
 for(let i=0;i<q.length&&i<limit;i++){
  processed++;const s=q[i][0];if(accept(s)){end=i;break;}
  for(let a=0;a<4;a++){
   const n=model.next(s,a);
   if(!n||n.p.length!==3||n.p.some(p=>p[4]>=0)||n.p.slice(1).some(p=>p[3])||!allowedBox.has(xy(n.b[0])))continue;
   const k=serial(n);if(seen.has(k))continue;seen.add(k);q.push([n,i,'WASD'[a]]);
  }
 }
 let path=null,state=null;if(end>=0){path='';for(let i=end;q[i][1]>=0;i=q[i][1])path=q[i][2]+path;state=q[end][0];}
 return {path,state,processed,seen:seen.size,exhausted:end<0&&processed===q.length,truncated:end<0&&processed<q.length};
}
let s=model.start,full='';
const phases=[
 ['left row3 with upper pusher',s=>xy(s.b[0])==='2,3'&&s.p.some(p=>['2,4','2,5'].includes(xy(p))),new Set(['5,3','4,3','3,3','2,3'])],
 ['down to2,2',s=>xy(s.b[0])==='2,2',new Set(['2,3','2,2'])],
 ['east to button6,2',s=>xy(s.b[0])==='6,2',new Set(['2,2','3,2','4,2','5,2','6,2'])],
 ['old waiter gets fork7,6',s=>xy(s.p[0])==='7,6'&&s.p[0][3]===1,new Set(['6,2'])]
];
for(const [name,accept,allowed] of phases){
 const r=scan(s,accept,allowed);console.log(JSON.stringify({name,conditionalModelStart:true,path:r.path,processed:r.processed,seen:r.seen,exhausted:r.exhausted,truncated:r.truncated,result:r.state&&{p:r.state.p,b:r.state.b,c:r.state.c}}));
 if(!r.state)break;s=r.state;full+=r.path;
}
console.log(JSON.stringify({prefix:full,p:s.p,b:s.b,c:s.c}));
