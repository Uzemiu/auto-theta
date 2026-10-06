// Pure read-only MODEL. Fresh independent-box stacks + same-tick ghost capture.
// Does not call a game API, inspect game implementation, or write output files.
const fs=require('fs'),Module=require('module');
let src=fs.readFileSync('scratch/stack-cargo-readonly.cjs','utf8');
function alter(a,b){if(!src.includes(a))throw Error('Private model fixture changed');src=src.replace(a,b);}
alter("if(!safe.has(xy(z))){if(cfg.allow_partial_death===false)bad=true;return;}\n      np.push([...z,face,fork,-1,key]);", "np.push([...z,face,fork,-1,key,safe.has(xy(z))?0:1]);");
alter("np.push([v[0],v[1],a===4?v[2]:a,v[3],v[4],v[5]]);", "np.push([v[0],v[1],a===4?v[2]:a,v[3],v[4],v[5],v[6]||0]);");
alter("np.push([v[0],v[1],v[2],v[3]-1,-1,v[5]]);", "np.push([v[0],v[1],v[2],v[3]-1,-1,v[5],v[6]||0]);");
alter('const merged=[];\n    for(const v of np)', 'const alive=np.filter(p=>p[4]>=0||safe.has(xy(p)));\n    if(cfg.allow_partial_death===false&&alive.length!==np.length)return null;\n    const merged=[];\n    for(const v of alive)');
const mod=new Module('ch3-B-ghost-private',module);mod.paths=module.paths;mod._compile(src,'ch3-B-ghost-private.cjs');
const {createModel}=mod.exports;
const record=JSON.parse(fs.readFileSync('artifacts/slot1-playthrough/3-B.json','utf8').replace(/^\uFEFF/,''));
const source=record.events[17]?.observation?.frame===1005049?17:15;
const model=createModel(record,{observation_event:source,allow_partial_death:false,same_type_only:true,max_stack:4});
for(const p of model.start.p)p.push(0);
const o=record.events[source].observation,t=o.level.timelines[0],K=p=>p.slice(0,2).join(','),V=[[0,1],[-1,0],[0,-1],[1,0]],pc=m=>{let n=0;for(;m;m&=m-1)n++;return n;};
const safe=new Set(t.tiles.filter(e=>e.type==='SOLID').map(e=>K(e.pos)));
const desc=s=>({...model.describe(s),faces:s.p.map(p=>p[2]),ghosts:s.p.map(p=>p[6]||0),physicalBoxes:s.m.reduce((n,m)=>n+pc(m),0)});
const serial=s=>s.p.map(p=>[p[0],p[1],p[3]?p[2]:0,p[3],p[4]<0?'-':K(s.b[p[4]]),p[6]||0].join(',')).sort().join(';')+'|'+s.b.map((b,i)=>K(b)+':'+pc(s.m[i])).sort().join(';')+'|'+s.c;
const md=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const boxesTarget=[[6,2],[6,3],[7,1]],playersTarget=[[6,1],[6,5]];
function assignment(a,b){let best=999;function rec(i,used,n){if(n>=best)return;if(i===b.length){best=n;return;}for(let j=0;j<a.length;j++)if(!(used&(1<<j)))rec(i+1,used|(1<<j),n+md(a[j],b[i]));}rec(0,0,0);return best;}
function h(s){const bh=assignment(s.b,boxesTarget);const ph=s.p.length===2?Math.min(md(s.p[0],playersTarget[0])+md(s.p[1],playersTarget[1]),md(s.p[1],playersTarget[0])+md(s.p[0],playersTarget[1])):8+Math.min(...playersTarget.map(p=>md(s.p[0],p)));return bh*4+ph+(s.c?0:8);}
const accept=s=>s.p.some(p=>p[4]>=0&&p[6]===1&&K(p)==='6,4')&&s.p.some(p=>p[4]<0&&p[6]===0);
const q=[{s:model.start,parent:-1,a:'',g:0,f:h(model.start)*4}],heap=[],seen=new Set([serial(model.start)]);
function put(i){let k=heap.length;heap.push(i);while(k){const j=(k-1)>>1;if(q[heap[j]].f<=q[i].f)break;heap[k]=heap[j];k=j;}heap[k]=i;}
function pop(){const out=heap[0],last=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let j=k*2+1;if(j+1<heap.length&&q[heap[j+1]].f<q[heap[j]].f)j++;if(q[heap[j]].f>=q[last].f)break;heap[k]=heap[j];k=j;}heap[k]=last;}return out;}
const limit=30000;let expanded=0,hit=-1,stackTransitions=0,firstStack=null,firstStackRoute=null,firstFork0=0;
put(0);
while(heap.length&&expanded<limit){const i=pop(),s=q[i].s;expanded++;if(accept(s)){hit=i;break;}
  for(let a=0;a<5;a++){const n=model.next(s,a);if(!n||n.p.length<1||n.p.length>2||n.m.reduce((z,m)=>z+pc(m),0)!==4)continue;
    if(n.p.some(p=>p[4]>=0)&&!accept(n))continue;
    if(n.c&&n.p.length===1&&n.p[0][3]===0)continue;
    if(n.m.some(m=>pc(m)>1)){stackTransitions++;if(!firstStack){firstStack=desc(n);firstStackRoute='WASDX'[a];for(let j=i;q[j].parent>=0;j=q[j].parent)firstStackRoute=q[j].a+firstStackRoute;}}
    if(a===4&&s.p.some(p=>p[3]>0)&&n.p.length===2)firstFork0++;
    const k=serial(n);if(seen.has(k))continue;seen.add(k);const ni=q.length,g=q[i].g+1;q.push({s:n,parent:i,a:'WASDX'[a],g,f:g+h(n)*4});put(ni);
  }
}
let route=null,trace=null;if(hit>=0){route='';for(let i=hit;q[i].parent>=0;i=q[i].parent)route=q[i].a+route;
  let s=model.start;trace=[];for(let i=0;i<route.length;i++){s=model.next(s,'WASDX'.indexOf(route[i]));trace.push({step:i+1,action:route[i],...desc(s)});}
}
// Selected-entity calibration of the old actual20/30 normal routes.
const known='WWDDDDDWWWWWWWSSWWDDSSADWWWWSS';let s=model.start;const calibration=[];
for(let i=0;i<known.length;i++){s=model.next(s,'WASDX'.indexOf(known[i]));if([20,30].includes(i+1)){
  const ev=i+1===20?6:8,actual=record.events[ev].observation.level.timelines[0],p=actual.entities.find(e=>e.type==='PLAYER'&&e.active),bs=actual.entities.filter(e=>e.type==='BOX'&&e.active).map(e=>K(e.pos)).sort();
  calibration.push({step:i+1,event:ev,equal:s.p.length===1&&K(s.p[0])===K(p.pos)&&s.p[0][2]===p.properties.face&&s.p[0][3]===p.properties.split&&JSON.stringify(s.b.map(K).sort())===JSON.stringify(bs)&&s.p[0][6]===0});
}}
let stackTrace=null;if(firstStackRoute){let s=model.start;stackTrace=[];for(let i=0;i<firstStackRoute.length;i++){s=model.next(s,'WASDX'.indexOf(firstStackRoute[i]));stackTrace.push({step:i+1,action:firstStackRoute[i],...desc(s)});}}
const conditional={p:[[6,1,2,0,-1,0,0],[6,5,2,0,-1,0,0]],b:[[6,2],[6,3],[7,1],[4,4]],m:[1,2,4,8],c:1,l:0};
const conditionalAfter=model.next(conditional,2);
const smallBirthRoute='DDDDDWWWWAWSX';let small=model.start;const smallTrace=[];for(let i=0;i<smallBirthRoute.length;i++){small=model.next(small,'WASDX'.indexOf(smallBirthRoute[i]));smallTrace.push({step:i+1,action:smallBirthRoute[i],...desc(small)});}
console.log(JSON.stringify({scope:'NEW fresh stack+explicitGhost0/1; all4 original BOX masks retained; first capture targetSPIKE6,4+survivingfree; no force/optical/containedForkX/implementation/game inputs',source:{event:source,frame:o.frame,axis:t.axis,time:t.time,instructions:o.level.instructions},calibration,budget:limit,expanded,seen:seen.size,pending:heap.length,found:hit>=0,route,trace,stackTransitions,firstStack,firstStackRoute,stackTrace,firstFork0,conditionalGhostFixture:{status:'MODEL only; no fresh reachability proof, do not execute from fresh',before:desc(conditional),action:'S',after:desc(conditionalAfter)},smallBirthProbe:{status:'MODEL new13 firstsplit+safe double birth; no ghost capture or goal tail',route:smallBirthRoute,trace:smallTrace,preX:smallTrace.at(-2),postX:smallTrace.at(-1)},unknown:['Color3 same-tick SPIKE capture ghost1 is a normal-rule hypothesis pending actual probe.','Independent box stacks are preserved physically, never merged/disappeared.','A6,4 ghost capture alone is not complete Goal1,6 transportation.']},null,0));
