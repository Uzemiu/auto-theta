// Independent finite replay of one nominated post-X route. No search/game I/O.
const fs=require('fs');
const raw=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/4-9.json','utf8').replace(/^\uFEFF/,''));
const t=raw.initial.level.timelines[0],xy=p=>p.join(',');
const walls=new Set(t.entities.filter(e=>e.class==='Wall').map(e=>xy(e.pos)));
const spikes=new Set(t.tiles.filter(e=>e.type==='SPIKE').map(e=>xy(e.pos)));
const ice=new Set(t.tiles.filter(e=>e.type==='ICE').map(e=>xy(e.pos)));
const dirs=['W','A','S','D'],vec=[[0,1],[-1,0],[0,-1],[1,0]];
const plus=(p,d)=>[p[0]+vec[d][0],p[1]+vec[d][1]];
const route='SDSAASSSSSWDSWSSWAAWWWWW';
let s={boxes:[[3,4],[2,3]],free:[[2,4],[3,3]],gate:false};
const trace=[];
for(let step=0;step<route.length;step++) {
 const a=dirs.indexOf(route[step]),plans=[],boxPush=new Map();
 const blocked=p=>walls.has(xy(p)) || xy(p)==='3,1'&&!s.gate;
 for(const p of s.free) {
  let plan;
  for(let off=0;off<4;off++) {
   const d=(a+off)%4,q=plus(p,d),chain=[];let end=q;
   if(blocked(q))continue;
   for(let bi;(bi=s.boxes.findIndex(b=>xy(b)===xy(end)))>=0;) {
    chain.push(bi);end=plus(end,d);
   }
   if(blocked(end))continue;
   plan={q,d,chain};break;
  }
  if(!plan)plan={q:p.slice(),d:a,chain:[]};
  for(const bi of plan.chain) {
   if(boxPush.has(bi)&&boxPush.get(bi)!==plan.d)throw Error('Excluded conflicting push');
   boxPush.set(bi,plan.d);
  }
  plans.push(plan);
 }
 const boxes=s.boxes.map((b,i)=>boxPush.has(i)?plus(b,boxPush.get(i)):b.slice());
 if(new Set(boxes.map(xy)).size!==boxes.length)throw Error('Excluded stacking');
 if(boxes.some(b=>ice.has(xy(b)))||plans.some(p=>ice.has(xy(p.q))))throw Error('Route needs ICE model');
 const free=[];let deaths=0;
 for(const p of plans) {
  if(spikes.has(xy(p.q))){deaths++;continue;}
  if(boxes.some(b=>xy(b)===xy(p.q)))throw Error('Excluded new capture');
  if(!free.some(q=>xy(q)===xy(p.q)))free.push(p.q);
 }
 const occupied=p=>boxes.some(b=>xy(b)===p)||free.some(q=>xy(q)===p);
 s={boxes,free,gate:occupied('7,6')||occupied('3,1')};
 trace.push({step:step+1,input:route[step],...s,...deaths?{free_deaths:deaths}:{}});
}
console.log(JSON.stringify({model_only:true,search_performed:false,
 gate_rule_basis:'Actual4-9 events[32]: loadedBOX7,6 and gate3,1 blockable=false after39 inputs',
 route,inputs:route.length,ice_visited:false,
 milestones:trace.filter(x=>[1,3,10,12,14,16,17,24].includes(x.step)),
 model_goal:s.free.some(p=>xy(p)==='1,1')},null,2));
