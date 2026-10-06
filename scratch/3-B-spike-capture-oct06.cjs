// Read-only new 3-B domain: defer SPIKE death until same-tick BOX capture.
// Derived from already observed M092, not game code. No Bridge / game I/O.
const fs=require('fs'),Module=require('module');
let src=fs.readFileSync('scratch/stack-cargo-readonly.cjs','utf8');
src=src.replace("if(!safe.has(xy(z))){if(cfg.allow_partial_death===false)bad=true;return;}\n      np.push", "np.push");
src=src.replace('const merged=[];\n    for(const v of np)', `const alive=np.filter(p=>p[4]>=0||safe.has(xy(p)));
    if(cfg.allow_partial_death===false&&alive.length!==np.length)return null;
    const merged=[];
    for(const v of alive)`);
const mod=new Module('spike-private-model',module);mod.paths=module.paths;mod._compile(src,'spike-private-model.cjs');
const {createModel,replay}=mod.exports;
const r=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-B.json','utf8'));
const source=17,cfg={observation_event:source,allow_partial_death:false,max_stack:4,same_type_only:true};
const model=createModel(r,cfg),tailModel=createModel(r,{...cfg,allow_partial_death:true});
const t=r.events[source].observation.level.timelines[0],K=p=>p.slice(0,2).join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],add=(p,d,n=1)=>[p[0]+V[d][0]*n,p[1]+V[d][1]*n];
const es=t.entities.filter(e=>e.active),walls=new Set(es.filter(e=>e.blockable&&!e.pushable).map(e=>K(e.pos))),floor=new Set([...t.tiles,...es.filter(e=>e.floor)].map(e=>K(e.pos))),safe=new Set([...t.tiles.filter(e=>e.type==='SOLID'),...es.filter(e=>e.floor)].map(e=>K(e.pos)));
function needsBlock(p,d,forbidden){let bs=[];for(let n=1;n<9;n++){const z=add(p,d,n),k=K(z);if(walls.has(k)||!floor.has(k))return bs;if(forbidden.has(k))return null;bs.push(z);if(bs.length>4)return null;}return null;}
const templates=[],keys=new Set();
for(const cell of floor){if(safe.has(cell)||walls.has(cell))continue;const z=cell.split(',').map(Number);if(z[0]>=7||z[1]>=7||z[1]<=1)continue;
 for(let d=0;d<4;d++)for(const n of [2,4]){const chain=Array.from({length:n},(_,i)=>add(z,d,-i-1)),p=add(z,d,-n-1);if(!safe.has(K(p))||walls.has(K(p))||chain.some(b=>!floor.has(K(b))||walls.has(K(b))))continue;
 for(let dr=0;dr<4;dr++){const r=add(z,dr,-1);if(!safe.has(K(r))||walls.has(K(r))||K(r)===K(p)||chain.some(b=>K(b)===K(r))||(p[0]+p[1]-r[0]-r[1])%2)continue;
 for(let a=0;a<4;a++){let req=[...chain],bad=false;const forb=new Set([K(p),K(r),K(z)]);
 for(const [v,actual] of [[p,d],[r,dr]])for(let turn=0;(a+turn)%4!==actual;turn++){const bs=needsBlock(v,(a+turn)%4,forb);if(!bs){bad=true;break;}req.push(...bs);}
 if(bad)continue;req=[...new Map(req.map(b=>[K(b),b])).values()];if(req.length>4||req.some(b=>forb.has(K(b))))continue;
 const key=req.map(K).sort().join('|')+';'+[K(p),K(r)].sort().join('|')+';'+a;if(keys.has(key))continue;keys.add(key);templates.push({boxes:req,players:[p,r],z,a});}}}}
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
function assignment(bs,gs){let best=999;function go(i,used,sum){if(sum>=best)return;if(i===gs.length){best=sum;return;}for(let j=0;j<bs.length;j++)if(!(used&(1<<j)))go(i+1,used|(1<<j),sum+md(bs[j],gs[i]));}go(0,0,0);return best;}
function h(s){if(s.p.some(p=>p[4]>=0))return 0;let best=999;for(const z of templates){const ph=s.p.length===2?Math.min(md(s.p[0],z.players[0])+md(s.p[1],z.players[1]),md(s.p[1],z.players[0])+md(s.p[0],z.players[1])):Math.min(...z.players.map(p=>md(s.p[0],p)))+8;best=Math.min(best,assignment(s.b,z.boxes)*3+ph);}return best+(s.c?0:8);}
const serial=s=>s.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]>=0?K(s.b[p[4]]):'-'].join(',')).sort().join(';')+'|'+s.b.map((p,i)=>K(p)+':'+s.m[i].toString(2).split('1').length).sort().join(';')+'|'+s.c;
function planner(start,accept,heur,cap,activeModel=model,first=false){const q=[{s:start,parent:-1,a:-1,depth:0,score:heur(start)*3}],heap=[],seen=new Set([serial(start)]);let processed=0,end=-1;
 function put(i){let k=heap.length;heap.push(i);while(k){const j=(k-1)>>1;if(q[heap[j]].score<=q[i].score)break;heap[k]=heap[j];k=j;}heap[k]=i;}
 function take(){const out=heap[0],z=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&q[heap[j+1]].score<q[heap[j]].score)j++;if(q[heap[j]].score>=q[z].score)break;heap[k]=heap[j];k=j;}heap[k]=z;}return out;}
 put(0);while(heap.length&&processed<cap){const i=take(),s=q[i].s;processed++;if(accept(s)){end=i;break;}for(let a=0;a<5;a++){const n=activeModel.next(s,a);if(!n||!n.p.length||n.p.length>2||n.b.length!==4||n.m.some(m=>(m&(m-1))!==0))continue;if(first&&n.p.some(p=>p[4]>=0&&(safe.has(K(p))||p[1]===1||p[1]===7||p[0]===7)))continue;const k=serial(n);if(seen.has(k))continue;seen.add(k);const ni=q.length,depth=q[i].depth+1;q.push({s:n,parent:i,a,depth,score:depth+heur(n)*3});put(ni);}}
 let route=null,state=null;if(end>=0){route='';state=q[end].s;for(let i=end;q[i].parent>=0;i=q[i].parent)route='WASDX'[q[i].a]+route;}
 return {found:end>=0,route,processed,seen:seen.size,exhausted:!heap.length&&end<0,truncated:heap.length>0&&end<0,state,final:state?activeModel.describe(state):null};}
const result=planner(model.start,s=>s.p.some(p=>p[4]>=0&&!safe.has(K(p)))&&s.p.some(p=>p[4]<0),h,20000,model,true);
if(result.found){const tail=planner(result.state,s=>s.p.some(p=>K(p)==='1,6'),s=>Math.min(...s.p.filter(p=>p[4]>=0).map(p=>md(p,[1,6])))*2,8000,tailModel);delete tail.state;result.tail=tail;result.prefixTrace=replay(model,result.route,{milestones:[result.route.length-1,result.route.length]}).milestones;}
delete result.state;
console.log(JSON.stringify({sourceEvent:source,templates:templates.length,cargoCells:[...new Set(templates.map(z=>K(z.z)))],scope:'NEW defer same-tick SPIKE death to capture; first capture must SPIKE x<7/y2..6, all four independent boxes no stack, any first-X place; tail may sacrifice free; unknown SPIKE cargo ghost state not modeled, no hidden implementation/game I/O',result}));
