// Read-only 3-B fresh revisit. New search: all <=4-box same-parity capture
// templates, followed by ordinary cargo transport. No game I/O or hidden data.
const fs=require('fs'),{createModel,replay}=require('./stack-cargo-readonly.cjs');
const record=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-B.json','utf8').replace(/^\uFEFF/,''));
const source=[...record.events.keys()].reverse().find(i=>record.events[i].observation?.level?.id==='extension'&&record.events[i].observation.level.instructions===''&&record.events[i].observation.level.timelines?.[0]?.tiles?.length);
const cfg={observation_event:source,allow_partial_death:false,max_players:2,min_players:1,same_type_only:true,max_stack:4};
const model=createModel(record,cfg),t=record.events[source].observation.level.timelines[0],es=t.entities.filter(e=>e.active),K=p=>p.slice(0,2).join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],add=(p,d,n=1)=>[p[0]+V[d][0]*n,p[1]+V[d][1]*n];
const tailModel=createModel(record,{...cfg,allow_partial_death:true});
const walls=new Set(es.filter(e=>e.blockable&&!e.pushable).map(e=>K(e.pos))),floor=new Set([...t.tiles,...es.filter(e=>e.floor)].map(e=>K(e.pos))),safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...es.filter(e=>e.floor)].map(e=>K(e.pos)));
const safeCells=[...safe].filter(k=>!walls.has(k)).map(k=>k.split(',').map(Number)),goal=[1,6];
function needsBlock(p,d,forbidden){
 const boxes=[];for(let n=1;n<9;n++){
  const z=add(p,d,n),k=K(z);if(walls.has(k)||!floor.has(k))return boxes;
  if(forbidden.has(k))return null;boxes.push(z);if(boxes.length>4)return null;
 }return null;
}
const templates=[],templateKeys=new Set();
for(const z of safeCells)for(let d=0;d<4;d++)for(const n of [2,4]){
 const chain=Array.from({length:n},(_,i)=>add(z,d,-i-1)),p=add(z,d,-n-1);
 if(!safe.has(K(p))||walls.has(K(p))||chain.some(b=>!floor.has(K(b))||walls.has(K(b))))continue;
 for(let dr=0;dr<4;dr++){
  const r=add(z,dr,-1);if(!safe.has(K(r))||walls.has(K(r))||K(r)===K(p)||chain.some(b=>K(b)===K(r)))continue;
  // The two children of the only fork share parity; no ICE in this level.
  if((p[0]+p[1]-r[0]-r[1])%2)continue;
  for(let a=0;a<4;a++){
   let req=[...chain],bad=false;const forbidden=new Set([K(p),K(r),K(z)]);
   for(const [v,actual] of [[p,d],[r,dr]])for(let turn=0;(a+turn)%4!==actual;turn++){
    const bs=needsBlock(v,(a+turn)%4,forbidden);if(!bs){bad=true;break;}req.push(...bs);
   }
   if(bad)continue;req=[...new Map(req.map(b=>[K(b),b])).values()];
   if(req.length>4||req.some(b=>forbidden.has(K(b))))continue;
   const key=req.map(K).sort().join('|')+';'+[K(p),K(r)].sort().join('|')+';'+a;
   if(templateKeys.has(key))continue;templateKeys.add(key);templates.push({boxes:req,players:[p,r],z,a});
  }
 }
}
// Dead border cargo cannot be pushed away from that border by a free actor;
// retain these templates in the report, prioritize viable interior/left cargo.
const viable=templates.filter(z=>z.z[1]>1&&z.z[1]<7&&z.z[0]<7);
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
function assignment(bs,gs){let best=999;function go(i,used,sum){if(sum>=best)return;if(i===gs.length){best=sum;return;}for(let j=0;j<bs.length;j++)if(!(used&(1<<j)))go(i+1,used|(1<<j),sum+md(bs[j],gs[i]));}go(0,0,0);return best;}
function h(s){if(s.p.some(p=>p[4]>=0))return 0;let best=999;
 for(const z of viable){let ph;if(s.p.length===2)ph=Math.min(md(s.p[0],z.players[0])+md(s.p[1],z.players[1]),md(s.p[1],z.players[0])+md(s.p[0],z.players[1]));else ph=Math.min(...z.players.map(p=>md(s.p[0],p)))+8;
  best=Math.min(best,assignment(s.b,z.boxes)*3+ph);
 }
 if(!s.c)best+=8;return best;
}
const serial=s=>s.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]>=0?K(s.b[p[4]]):'-'].join(',')).sort().join(';')+'|'+s.b.map(K).sort().join(';')+'|'+s.c;
function planner(start,accept,heur,cap,activeModel=model,firstCapture=false){
 const q=[{s:start,parent:-1,a:-1,depth:0,score:heur(start)*3}],heap=[],seen=new Set([serial(start)]);let processed=0,end=-1;
 function put(i){let k=heap.length;heap.push(i);while(k){const j=(k-1)>>1;if(q[heap[j]].score<=q[i].score)break;heap[k]=heap[j];k=j;}heap[k]=i;}
 function take(){const out=heap[0],z=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&q[heap[j+1]].score<q[heap[j]].score)j++;if(q[heap[j]].score>=q[z].score)break;heap[k]=heap[j];k=j;}heap[k]=z;}return out;}
 put(0);
 while(heap.length&&processed<cap){const i=take(),s=q[i].s;processed++;if(accept(s)){end=i;break;}
  for(let a=0;a<5;a++){const n=activeModel.next(s,a);if(!n||!n.p.length||n.p.length>2||n.b.length!==4||n.m.some(m=>(m&(m-1))!==0))continue;
   // No stacking in the first pass: masks/collapse are a different domain.
   if(firstCapture&&s.p.length===2&&n.p.length!==2)continue;
   if(firstCapture&&n.p.some(p=>p[4]>=0&&(p[1]===1||p[1]===7||p[0]===7)))continue;
   const k=serial(n);if(seen.has(k))continue;seen.add(k);
   const ni=q.length,depth=q[i].depth+1;q.push({s:n,parent:i,a,depth,score:depth+heur(n)*3});put(ni);
  }
 }
 let route=null,state=null;if(end>=0){route='';state=q[end].s;for(let i=end;q[i].parent>=0;i=q[i].parent)route='WASDX'[q[i].a]+route;}
 return {found:end>=0,route,processed,seen:seen.size,exhausted:!heap.length&&end<0,truncated:heap.length>0&&end<0,state,final:state?activeModel.describe(state):null};
}
const cap=Number(process.env.B_REVISIT_CAP||30000);
let result;
if(process.env.B_REPLAY){result=replay(model,process.env.B_REPLAY,{milestones:(process.env.B_MILESTONES||'').split(',').filter(Boolean).map(Number)});delete result.state;}
else{
 result=planner(model.start,s=>s.p.some(p=>p[4]>=0)&&s.p.some(p=>p[4]<0),h,cap,model,true);
 if(result.found){const tail=planner(result.state,s=>s.p.some(p=>K(p)===K(goal)),s=>Math.min(...s.p.filter(p=>p[4]>=0).map(p=>md(p,goal)))*2,20000,tailModel);delete tail.state;result.tail=tail;}
 delete result.state;
}
console.log(JSON.stringify({sourceEvent:source,templates:templates.length,viableTemplates:viable.length,cargoCells:[...new Set(viable.map(z=>K(z.z)))],cap,
 scope:'fresh ordinary WASDX; all safe even-chain/fallback templates up to4 boxes; first capture excludes permanent cargo y1/y7/x7 but allows empty box there; no live death until capture, tail may sacrifice free; no ghost, stack, optical observation or conflicting force; one fork; same-color BOX identity canonicalized before any stack',result}));
